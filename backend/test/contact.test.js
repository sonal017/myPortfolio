const { test } = require('node:test');
const assert = require('node:assert/strict');
const { once } = require('node:events');
const { createServer } = require('node:http');
const { Mongoose } = require('mongoose');
const { createApp, validateContact } = require('../app');
const { loadConfig } = require('../config');
const { createStorage, mongoOptions } = require('../storage');

const values = { name: 'Test Visitor', email: 'visitor@example.test', message: 'A portfolio enquiry.' };
const env = { NODE_ENV: 'production', FRONTEND_URL: 'https://portfolio.example.test', MONGO_URI: 'mongodb://127.0.0.1/test' };
const logger = { error() {}, warn() {} };

async function listen(t, app) {
  const server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => new Promise((resolve) => { server.close(resolve); server.closeAllConnections(); }));
  return `http://127.0.0.1:${server.address().port}`;
}

async function fixture(t, overrides = {}) {
  const saved = [];
  const storage = { isReady: () => true, save: async (data) => { saved.push(data); } };
  const app = createApp({ config: loadConfig(env), storage, logger, ...overrides });
  const url = await listen(t, app);
  const post = (body = values, options = {}) => fetch(`${url}/api/contact`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', Origin: env.FRONTEND_URL },
    body: JSON.stringify(body), ...options,
  });
  return { url, saved, post };
}

test('message listing and retired contact GET routes return 404 without data', async (t) => {
  const { url } = await fixture(t);
  for (const route of ['/api/messages', '/api/contact']) {
    const response = await fetch(url + route);
    assert.equal(response.status, 404);
    assert.deepEqual(await response.json(), { success: false, message: 'Not found.' });
    assert.equal(response.headers.get('cache-control'), 'no-store');
    assert.equal(response.headers.get('x-powered-by'), null);
  }
});

test('valid input is trimmed and only known fields are persisted', async (t) => {
  const { post, saved } = await fixture(t);
  const response = await post({ ...values, name: ' Test Visitor ', message: ' A portfolio enquiry. ', admin: true });
  assert.equal(response.status, 200);
  assert.equal((await response.json()).success, true);
  assert.deepEqual(saved, [values]);
});

test('response waits for persistence acknowledgement', async (t) => {
  let finish;
  let entered;
  const started = new Promise((resolve) => { entered = resolve; });
  const storage = { isReady: () => true, save: () => { entered(); return new Promise((resolve) => { finish = resolve; }); } };
  const { post } = await fixture(t, { storage });
  let answered = false;
  const response = post().then((result) => { answered = true; return result; });
  await started;
  assert.equal(answered, false);
  finish();
  assert.equal((await response).status, 200);
});

test('storage failure returns 503, never false success or private error details', async (t) => {
  const storage = { isReady: () => false, save: async () => { throw new Error('private database details'); } };
  const { post, url } = await fixture(t, { storage });
  const response = await post();
  assert.equal(response.status, 503);
  const result = await response.json();
  assert.equal(result.success, false);
  assert.equal(JSON.stringify(result).includes('private database details'), false);
  assert.equal((await fetch(`${url}/api/health`)).status, 503);
});

test('health reports readiness without exposing configuration', async (t) => {
  const { url } = await fixture(t);
  const response = await fetch(`${url}/api/health`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: 'ready' });
});

test('types, empty input, control characters, email and length limits are enforced', async (t) => {
  const { post, saved } = await fixture(t, { contactLimit: 100 });
  const invalid = [null, [], {}, { ...values, name: 1 }, { ...values, name: ' ' },
    { ...values, email: ['a@b.test'] }, { ...values, email: 'invalid' },
    { ...values, message: { $gt: '' } }, { ...values, message: '\u0000' },
    { ...values, name: 'a\nb' }, { ...values, name: 'a'.repeat(101) },
    { ...values, email: 'a'.repeat(250) + '@b.test' }, { ...values, message: 'a'.repeat(5001) }];
  for (const input of invalid) assert.equal((await post(input)).status, 400);
  assert.deepEqual(saved, []);
  assert.equal(validateContact({ ...values, name: 'a'.repeat(100), message: 'a'.repeat(5000) }).message.length, 5000);
  assert.equal(validateContact({ ...values, message: 'line one\nline two' }).message, 'line one\nline two');
});

test('malformed, oversized, and non-JSON bodies fail before storage', async (t) => {
  const { post, saved } = await fixture(t);
  assert.equal((await post(values, { body: '{' })).status, 400);
  assert.equal((await post({ ...values, message: 'a'.repeat(40000) })).status, 413);
  assert.equal((await post(values, { headers: { 'Content-Type': 'text/plain' } })).status, 415);
  assert.deepEqual(saved, []);
});

test('CORS allows the exact frontend and blocks other origins before storage', async (t) => {
  const { url, post, saved } = await fixture(t);
  const preflight = await fetch(`${url}/api/contact`, { method: 'OPTIONS', headers: {
    Origin: env.FRONTEND_URL, 'Access-Control-Request-Method': 'POST', 'Access-Control-Request-Headers': 'content-type',
  } });
  assert.equal(preflight.status, 204);
  assert.equal(preflight.headers.get('access-control-allow-origin'), env.FRONTEND_URL);
  for (const origin of ['https://evil.example.test', 'https://portfolio.example.test.evil.test', 'null', 'http://localhost:3002']) {
    const response = await post(values, { headers: { 'Content-Type': 'application/json', Origin: origin } });
    assert.equal(response.status, 403);
    assert.equal(response.headers.get('access-control-allow-origin'), null);
  }
  assert.deepEqual(saved, []);
});

test('development permits localhost, but not arbitrary web origins', async (t) => {
  const { post } = await fixture(t, { config: loadConfig({}) });
  const response = await post(values, { headers: { 'Content-Type': 'application/json', Origin: 'http://localhost:3002' } });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('access-control-allow-origin'), 'http://localhost:3002');
});

test('rate limiting returns 429 and Retry-After without another write', async (t) => {
  const { post, saved } = await fixture(t, { contactLimit: 2 });
  assert.equal((await post()).status, 200);
  assert.equal((await post()).status, 200);
  const blocked = await post();
  assert.equal(blocked.status, 429);
  assert.equal((await blocked.json()).success, false);
  assert.ok(Number(blocked.headers.get('retry-after')) > 0);
  assert.equal(saved.length, 2);
});

test('untrusted proxy headers cannot reset the rate limit', async (t) => {
  // Trust a different subnet, never the test client; forged headers must be ignored.
  const config = { ...loadConfig(env), trustProxy: '192.0.2.0/24' };
  const { post } = await fixture(t, { config, contactLimit: 1 });
  const options = (ip) => ({ headers: { 'Content-Type': 'application/json', 'X-Forwarded-For': ip } });
  assert.equal((await post(values, options('198.51.100.1'))).status, 200);
  assert.equal((await post(values, options('198.51.100.2'))).status, 429);
});

test('production configuration rejects missing storage, unsafe URLs and blanket proxy trust', () => {
  assert.throws(() => loadConfig({ ...env, MONGO_URI: '' }), /MONGO_URI/);
  for (const url of ['', 'http://portfolio.example.test', 'https://localhost', 'https://127.0.0.1', 'https://portfolio.example.test/path', 'https://user:pass@portfolio.example.test']) {
    assert.throws(() => loadConfig({ ...env, FRONTEND_URL: url }), /FRONTEND_URL/);
  }
  for (const proxy of ['true', '1', '10']) assert.throws(() => loadConfig({ ...env, TRUST_PROXY: proxy }), /TRUST_PROXY/);
  assert.equal(loadConfig(env).trustProxy, false);
  assert.equal(loadConfig({ ...env, FRONTEND_URL: `${env.FRONTEND_URL}/` }).frontendOrigin, env.FRONTEND_URL);
});

function storageFixture(options = {}) {
  const mongoose = new Mongoose();
  mongoose.connection.readyState = 1;
  const calls = [];
  mongoose.models.Message = { create: async (data) => { calls.push(data); } };
  const storage = createStorage({ mongoose, logger, ...options });
  return { mongoose, calls, storage };
}

test('disconnected MongoDB or a rejected write cannot be hidden by Sheets', async () => {
  let copies = 0;
  const { mongoose, storage } = storageFixture({ sheetUrl: 'https://sheets.example.test', post: async () => { copies++; } });
  mongoose.connection.readyState = 0;
  await assert.rejects(storage.save(values), /unavailable/);
  mongoose.connection.readyState = 1;
  mongoose.models.Message.create = async () => { throw new Error('write failed'); };
  await assert.rejects(storage.save(values), /write failed/);
  assert.equal(copies, 0);
});

test('successful MongoDB storage does not require Sheets', async () => {
  const { storage, calls } = storageFixture();
  await storage.save(values);
  assert.deepEqual(calls, [values]);
  assert.equal(mongoOptions.timeoutMS, 5000);
});

test('optional Sheet copies are bounded and require acknowledgement, without losing the DB save', async () => {
  for (const behavior of ['success', 'failure', 'html']) {
    let warnings = 0;
    const { storage, calls } = storageFixture({
      sheetUrl: 'https://sheets.example.test', logger: { warn: () => { warnings++; } },
      post: async (url, body, options) => {
        assert.deepEqual(body, values);
        assert.equal(options.timeout, 3000);
        assert.ok(options.signal instanceof AbortSignal);
        if (behavior === 'failure') throw new Error('provider down');
        return { data: behavior === 'success' ? { success: true } : '<html>login</html>' };
      },
    });
    await storage.save(values);
    assert.deepEqual(calls, [values]);
    assert.equal(warnings, behavior === 'success' ? 0 : 1);
  }
});

test('a hanging Sheet request is aborted within the configured deadline', async (t) => {
  const remote = createServer(() => {});
  const url = await listen(t, remote);
  let warned = false;
  const { storage, calls } = storageFixture({ sheetUrl: url, logger: { warn: () => { warned = true; } } });
  const before = Date.now();
  await storage.save(values);
  assert.ok(Date.now() - before < 4500);
  assert.equal(warned, true);
  assert.deepEqual(calls, [values]);
});
