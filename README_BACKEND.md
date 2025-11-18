# Backend Setup for Contact Form

This backend server handles sending emails from your portfolio contact form.

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

This will install:
- `express` - Web server framework
- `nodemailer` - Email sending library
- `cors` - Enable CORS for frontend requests
- `dotenv` - Environment variable management
- `concurrently` - Run frontend and backend together (dev dependency)

### 2. Configure Gmail for Sending Emails

Since we're using Gmail, you need to set up an App Password:

1. Go to your Google Account settings
2. Enable 2-Step Verification (if not already enabled)
3. Go to App Passwords: https://myaccount.google.com/apppasswords
4. Select "Mail" and "Other (Custom name)"
5. Name it "Portfolio Contact Form"
6. Copy the generated 16-character password

### 3. Create Environment File

Create a `.env` file in the root directory:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password
RECEIVER_EMAIL=your-email@gmail.com
PORT=5000
```

**Important:** Never commit the `.env` file to git! It's already in `.gitignore`.

### 4. Start the Server

#### Option A: Run Backend Only
```bash
npm run server
```

#### Option B: Run Both Frontend and Backend (Development)
```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- React frontend on `http://localhost:3000`

### 5. Update Frontend API URL for Production

When deploying, update the API URL in `src/components/contact.js`:

Change:
```javascript
const response = await fetch('http://localhost:5000/api/contact', {
```

To your production backend URL:
```javascript
const response = await fetch('https://your-backend-domain.com/api/contact', {
```

Or use an environment variable:
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const response = await fetch(`${API_URL}/api/contact`, {
```

## API Endpoints

### POST `/api/contact`
Sends an email from the contact form.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello, I'm interested in your work!"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Thank you! Your message has been sent successfully."
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message here"
}
```

### GET `/api/health`
Health check endpoint to verify server is running.

## Deployment Options

### Option 1: Deploy Backend Separately
- Deploy backend to services like:
  - Heroku
  - Railway
  - Render
  - Vercel (with serverless functions)
  - AWS Lambda
  - DigitalOcean App Platform

### Option 2: Use Environment Variables
For production, set environment variables in your hosting platform:
- `EMAIL_USER`
- `EMAIL_PASS`
- `RECEIVER_EMAIL`
- `PORT`

## Alternative: Email Services

Instead of Gmail, you can use:
- **SendGrid** - Professional email service
- **Mailgun** - Transactional email API
- **AWS SES** - Amazon Simple Email Service
- **Mailtrap** - For testing (doesn't send real emails)

Update the transporter configuration in `server.js` for these services.

## Troubleshooting

1. **"Authentication failed"**
   - Make sure you're using an App Password, not your regular Gmail password
   - Ensure 2-Step Verification is enabled

2. **"Connection timeout"**
   - Check if port 5000 is available
   - Firewall may be blocking the connection

3. **"CORS error"**
   - Make sure `cors` middleware is installed
   - Check if backend URL matches frontend fetch URL

4. **Emails not received**
   - Check spam folder
   - Verify `RECEIVER_EMAIL` is correct
   - Check server logs for errors

## Security Notes

- Never expose your `.env` file
- Use App Passwords, not your main Gmail password
- Consider rate limiting for production
- Add CAPTCHA to prevent spam
- Validate and sanitize all inputs

