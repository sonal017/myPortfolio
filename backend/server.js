const path = require('node:path');
const mongoose = require('mongoose');
const { loadConfig } = require('./config');
const { createApp } = require('./app');
const { createStorage, mongoOptions } = require('./storage');

async function start() {
  require('dotenv').config({ path: path.join(__dirname, '.env'), quiet: true });
  const config = loadConfig(process.env);
  if (config.mongoUri) await mongoose.connect(config.mongoUri, mongoOptions);
  const storage = createStorage({ mongoose, sheetUrl: config.sheetUrl });
  const app = createApp({ config, storage });
  const server = app.listen(config.port, () => {
    console.log(`Contact API listening on port ${config.port}`);
  });
  server.requestTimeout = 15000;
  server.headersTimeout = 10000;
  server.keepAliveTimeout = 5000;
  const shutdown = () => {
    server.close(async () => { await mongoose.disconnect(); });
    setTimeout(() => process.exit(1), 10000).unref();
  };
  process.once('SIGTERM', shutdown);
  process.once('SIGINT', shutdown);
  return server;
}

function run() {
  start().catch(() => {
    // Driver errors may contain connection credentials, so do not print them.
    console.error('API startup failed. Check environment configuration and MongoDB connectivity.');
    process.exitCode = 1;
    mongoose.disconnect();
  });
}

if (require.main === module) run();
module.exports = { start, run };
