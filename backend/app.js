const express = require('express');
const cors = require('cors');
const { rateLimit } = require('express-rate-limit');

const limits = { name: 100, email: 254, message: 5000 };

function validateContact(body) {
  if (!body || Array.isArray(body) || typeof body !== 'object') return null;
  const values = {};
  for (const [field, max] of Object.entries(limits)) {
    if (typeof body[field] !== 'string' || body[field].length > max) return null;
    const value = body[field].trim();
    if (!value || /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(value)) return null;
    if (field !== 'message' && /[\r\n\t]/.test(value)) return null;
    values[field] = value;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) return null;
  return values;
}

function createApp({ config, storage, logger = console, contactLimit = 5 }) {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', config.trustProxy);
  app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store');
    res.set('X-Content-Type-Options', 'nosniff');
    const origin = req.get('origin');
    const local = !config.production && /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin || '');
    if (origin && origin !== config.frontendOrigin && !local) {
      return res.status(403).json({ success: false, message: 'Origin not allowed.' });
    }
    next();
  });
  app.use(cors({ origin: true, methods: ['GET', 'POST'], allowedHeaders: ['Content-Type'] }));
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: contactLimit,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { success: false, message: 'Too many attempts. Please wait 15 minutes or email me directly.' },
  });

  app.post('/api/contact', limiter, (req, res, next) => {
    if (!req.is('application/json')) return res.status(415).json({ success: false, message: 'Send application/json.' });
    next();
  }, express.json({ limit: '32kb', strict: true, inflate: false }), async (req, res) => {
    const values = validateContact(req.body);
    if (!values) return res.status(400).json({ success: false, message: 'Enter a valid name, email, and message within the field limits.' });
    try {
      await storage.save(values);
      return res.status(200).json({ success: true, message: 'Thank you! Your message has been received.' });
    } catch {
      logger.error('Contact persistence failed. No success confirmation was sent.');
      return res.status(503).json({ success: false, message: 'Your message could not be saved. Please try again or email me directly.' });
    }
  });

  app.get('/api/health', (req, res) => {
    const ready = storage.isReady();
    res.status(ready ? 200 : 503).json({ status: ready ? 'ready' : 'unavailable' });
  });
  // Deliberately no message-listing API: read submissions through the private database.
  app.use((req, res) => res.status(404).json({ success: false, message: 'Not found.' }));
  app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);
    const status = [400, 413, 415].includes(error.status) ? error.status : 500;
    const message = status === 413 ? 'Message payload is too large.' : status === 500 ? 'Request failed.' : 'Invalid request body.';
    res.status(status).json({ success: false, message });
  });
  return app;
}

module.exports = { createApp, validateContact };
