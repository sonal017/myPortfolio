const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const axios = require('axios');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Startup header to clearly identify which backend is running
console.log('=============================================');
console.log('Starting backend: MongoDB (Mongoose) server');
console.log(`   Entry file: ${__filename}`);
console.log('=============================================');

const app = express();
const PORT = process.env.PORT || 5000;

// Google Sheets configuration
const GOOGLE_SHEET_URL = process.env.GOOGLE_SHEET_URL;

// Google Sheets save function (defined early so it can be called by routes)
async function saveToGoogleSheet(data) {
  if (!GOOGLE_SHEET_URL) {
    console.warn('⚠️  GOOGLE_SHEET_URL not configured. Skipping Google Sheet save.');
    return;
  }
  try {
    console.log('📤 Attempting to save to Google Sheet...');
    const response = await axios.post(GOOGLE_SHEET_URL, data);
    console.log('✅ Successfully saved to Google Sheet:', response.status, response.data);
  } catch (err) {
    console.error('❌ Error saving to Google Sheet:', err.response?.status, err.response?.data || err.message);
  }
}

// Debug: Check if .env is loaded (only in development)
if (process.env.NODE_ENV !== 'production') {
  console.log('📝 Environment variables check:');
  console.log(`   MONGO_URI: ${process.env.MONGO_URI ? '✅ Set' : '❌ NOT SET'}`);
  console.log(`   GOOGLE_SHEET_URL: ${GOOGLE_SHEET_URL ? '✅ Set' : '❌ NOT SET'}`);
}

// Middleware
// CORS configuration - allow all origins in development
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL || 'http://localhost:3000'
    : true, // Allow all origins in development
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log all incoming requests for debugging
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path}`);
  next();
});

// Email sending removed: backend no longer sends emails

// Connect to MongoDB if MONGO_URI is provided
if (process.env.MONGO_URI) {
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((error) => console.error("MongoDB connection error:", error));

} else {
  console.warn('⚠️  MONGO_URI not set. Messages will not be saved to MongoDB.');
}

// Mongoose schema/model for messages
const messageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
}, { timestamps: { createdAt: 'created_at' } });

const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);

// Contact form route
app.post('/api/contact', async (req, res) => {
  try {
    console.log('📨 Received contact form submission');
    const { name, email, message } = req.body;
    console.log(`   From: ${name} (${email})`);

    // Validation
    if (!name || !email || !message) {
      console.log('❌ Validation failed: Missing required fields');
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    // Email sending removed: backend will only validate and save messages
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
      });
    }

    // Save to MongoDB (if connected)
    try {
      if (mongoose.connection && mongoose.connection.readyState === 1) {
        const saved = await Message.create({ name, email, message });
        console.log('💾 Message saved to MongoDB with id', saved._id);
      } else {
        console.warn('⚠️  MongoDB not connected — message not saved to DB.');
      }
    } catch (dbErr) {
      console.error('❌ Failed to save message to MongoDB:', dbErr.message || dbErr);
    }

    // NEW: Save to Google Sheet as well
    await saveToGoogleSheet({ name, email, message });

    res.status(200).json({
      success: true,
      message: 'Thank you! Your message has been received.',
    });
  } catch (error) {
    console.error('❌ Error processing contact submission:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process message. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? (error && error.message) : undefined,
    });
  }
});

// Provide GET route to list last messages for quick verification
app.get('/api/messages', async (req, res) => {
  try {
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      const rows = await Message.find({}).sort({ created_at: -1 }).limit(50).lean();
      return res.json({ messages: rows });
    }
    return res.status(500).json({ error: 'MongoDB not connected' });
  } catch (err) {
    console.error('Failed to fetch messages from MongoDB', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📡 API endpoint: http://localhost:${PORT}/api/contact`);
  
  // Check environment variables
  if (!process.env.MONGO_URI) {
    console.warn('⚠️  WARNING: MONGO_URI is not set in .env file');
  }
  if (!GOOGLE_SHEET_URL) {
    console.warn('⚠️  WARNING: GOOGLE_SHEET_URL is not set in .env file');
  }
});

