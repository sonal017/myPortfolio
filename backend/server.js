const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Debug: Check if .env is loaded (only in development)
if (process.env.NODE_ENV !== 'production') {
  console.log('📝 Environment variables check:');
  console.log(`   EMAIL_USER: ${process.env.EMAIL_USER ? '✅ Set' : '❌ NOT SET'}`);
  console.log(`   EMAIL_PASS: ${process.env.EMAIL_PASS ? '✅ Set' : '❌ NOT SET'}`);
  console.log(`   RECEIVER_EMAIL: ${process.env.RECEIVER_EMAIL ? '✅ Set' : '⚠️  Using EMAIL_USER'}`);
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

// Create transporter for nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASS, // Your Gmail App Password
  },
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.log('❌ Email service error:', error);
    if (error.code === 'EAUTH') {
      console.log('⚠️  Authentication failed. Please check:');
      console.log('   1. EMAIL_USER in .env file is correct');
      console.log('   2. EMAIL_PASS is a valid Gmail App Password (not your regular password)');
      console.log('   3. 2-Step Verification is enabled on your Google account');
      console.log('   4. App Password was generated from: https://myaccount.google.com/apppasswords');
    }
  } else {
    console.log('✅ Email server is ready to send messages');
    console.log(`📧 Emails will be sent to: ${process.env.RECEIVER_EMAIL || process.env.EMAIL_USER || 'NOT SET'}`);
  }
});

// Connect to MongoDB if MONGO_URI is provided
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    console.log('✅ Connected to MongoDB Atlas');
  }).catch((err) => {
    console.error('❌ MongoDB connection error:', err.message || err);
  });
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

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
      });
    }

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.RECEIVER_EMAIL || process.env.EMAIL_USER, // Your email where you want to receive messages
      replyTo: email,
      subject: `New Contact Form Message from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-top: 20px;">
            <p style="margin: 10px 0;"><strong style="color: #334155;">Name:</strong> <span style="color: #64748b;">${name}</span></p>
            <p style="margin: 10px 0;"><strong style="color: #334155;">Email:</strong> <span style="color: #64748b;">${email}</span></p>
            <p style="margin: 10px 0;"><strong style="color: #334155;">Message:</strong></p>
            <div style="background-color: white; padding: 15px; border-radius: 4px; margin-top: 10px; color: #475569; line-height: 1.6;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
          <p style="margin-top: 20px; color: #94a3b8; font-size: 12px;">
            This email was sent from your portfolio contact form.
          </p>
        </div>
      `,
      text: `
        New Contact Form Submission
        
        Name: ${name}
        Email: ${email}
        Message: ${message}
      `,
    };

    // Check if email credentials are set
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('❌ Email credentials not configured');
      return res.status(500).json({
        success: false,
        message: 'Email server not configured. Please check .env file.',
      });
    }

    // Send email
    console.log('📧 Attempting to send email...');
    // Try sending email (if credentials present)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        await transporter.sendMail(mailOptions);
        console.log('✅ Email sent successfully!');
      } catch (emailErr) {
        console.warn('⚠️  Email send failed, continuing to save message to DB:', emailErr.message || emailErr);
      }
    } else {
      console.log('ℹ️  Email credentials missing; skipping email send and saving only to DB.');
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

    res.status(200).json({
      success: true,
      message: 'Thank you! Your message has been sent successfully.',
    });
  } catch (error) {
    console.error('❌ Error sending email:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    // More specific error messages
    let errorMessage = 'Failed to send message. Please try again later.';
    
    if (error.code === 'EAUTH') {
      errorMessage = 'Email authentication failed. Please check your email credentials in .env file.';
      console.error('⚠️  Authentication Error Details:');
      console.error('   - Make sure EMAIL_USER is your full Gmail address');
      console.error('   - Make sure EMAIL_PASS is a Gmail App Password (not your regular password)');
      console.error('   - Get App Password from: https://myaccount.google.com/apppasswords');
    } else if (error.code === 'ECONNECTION' || error.code === 'ETIMEDOUT') {
      errorMessage = 'Could not connect to email server. Please check your internet connection.';
      console.error('⚠️  Connection Error: Check internet connection');
    } else if (error.response) {
      errorMessage = `Email server error: ${error.response.message || 'Unknown error'}`;
      console.error('⚠️  Email server response:', error.response);
    } else {
      console.error('⚠️  Full error details:', {
        code: error.code,
        command: error.command,
        response: error.response,
        stack: error.stack
      });
    }
    
    res.status(500).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
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
  if (!process.env.EMAIL_USER) {
    console.warn('⚠️  WARNING: EMAIL_USER is not set in .env file');
  }
  if (!process.env.EMAIL_PASS) {
    console.warn('⚠️  WARNING: EMAIL_PASS is not set in .env file');
  }
  if (!process.env.RECEIVER_EMAIL && !process.env.EMAIL_USER) {
    console.warn('⚠️  WARNING: RECEIVER_EMAIL is not set. Will use EMAIL_USER as receiver.');
  }
});

