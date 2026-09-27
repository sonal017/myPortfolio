function publicHttpsUrl(value, name, originOnly = false) {
  let url;
  try { url = new URL(value); } catch { throw new Error(`${name} must be an HTTPS URL.`); }
  const host = url.hostname;
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash ||
      host === 'localhost' || host.endsWith('.localhost') || host === '[::1]' ||
      /^127\./.test(host) || host === '0.0.0.0' || (originOnly && url.pathname !== '/')) {
    throw new Error(`${name} must be a public HTTPS ${originOnly ? 'origin' : 'URL'} without credentials, query, or hash.`);
  }
  return originOnly ? url.origin : url.href;
}

function loadConfig(env = process.env) {
  const production = env.NODE_ENV === 'production';
  const port = Number(env.PORT || 5000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT must be between 1 and 65535.');
  const mongoUri = (env.MONGO_URI || '').trim();
  if (production && !mongoUri) throw new Error('MONGO_URI is required in production.');
  if (mongoUri && !/^mongodb(?:\+srv)?:\/\//.test(mongoUri)) throw new Error('MONGO_URI must be a MongoDB connection string.');
  const frontendUrl = (env.FRONTEND_URL || '').trim();
  const frontendOrigin = production || frontendUrl
    ? publicHttpsUrl(frontendUrl, 'FRONTEND_URL', true) : undefined;
  const sheetUrl = env.GOOGLE_SHEET_URL ? publicHttpsUrl(env.GOOGLE_SHEET_URL, 'GOOGLE_SHEET_URL') : undefined;
  const trustProxy = (env.TRUST_PROXY || '').trim();
  if (/^(true|\d+)$/i.test(trustProxy)) {
    throw new Error('TRUST_PROXY must name trusted proxy IPs/subnets, not true or a hop count.');
  }
  return {
    production, port, mongoUri, frontendOrigin, sheetUrl,
    trustProxy: !trustProxy || trustProxy === 'false' ? false : trustProxy,
  };
}

module.exports = { loadConfig };
