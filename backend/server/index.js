const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// simple request logger for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} -> ${req.method} ${req.originalUrl} from ${req.ip}`);
  next();
});

// Startup header to clearly identify which backend is running
console.log('=============================================');
console.log('Starting backend: SQLite (local) server');
console.log(`   Entry file: ${__filename}`);
console.log('=============================================');

// Initialize SQLite DB (file: server/messages.db)
const dbPath = path.join(__dirname, 'messages.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to connect to DB', err);
  } else {
    console.log('Connected to SQLite DB at', dbPath);
  }
});

// Create messages table if not exists
db.run(
  `CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`
);

// API endpoint to receive messages
app.post('/api/messages', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'name, email and message are required' });
  }

  const stmt = db.prepare('INSERT INTO messages (name, email, message) VALUES (?, ?, ?)');
  stmt.run(name, email, message, function (err) {
    if (err) {
      console.error('DB insert error', err);
      return res.status(500).json({ error: 'Failed to save message' });
    }

    res.json({ id: this.lastID, name, email, message, created_at: new Date().toISOString() });
  });
  stmt.finalize();
});

// Keep legacy /api/contact route for frontend compatibility
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'name, email and message are required' });
  }

  const stmt = db.prepare('INSERT INTO messages (name, email, message) VALUES (?, ?, ?)');
  stmt.run(name, email, message, function (err) {
    if (err) {
      console.error('DB insert error', err);
      return res.status(500).json({ error: 'Failed to save message' });
    }

    res.json({ id: this.lastID, name, email, message, created_at: new Date().toISOString() });
  });
  stmt.finalize();
});

// Add a GET endpoint to list messages (for quick local verification)
app.get('/api/messages', (req, res) => {
  db.all('SELECT id, name, email, message, created_at FROM messages ORDER BY id DESC LIMIT 50', (err, rows) => {
    if (err) {
      console.error('DB select error', err);
      return res.status(500).json({ error: 'Failed to fetch messages' });
    }
    res.json({ messages: rows });
  });
});

// expose listing also at /api/contact for convenience
app.get('/api/contact', (req, res) => {
  db.all('SELECT id, name, email, message, created_at FROM messages ORDER BY id DESC LIMIT 50', (err, rows) => {
    if (err) {
      console.error('DB select error', err);
      return res.status(500).json({ error: 'Failed to fetch messages' });
    }
    res.json({ messages: rows });
  });
});

// Simple health route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
