# API Connection Setup

## If API is Not Accessible

If you're getting connection errors or the API is not accessible, follow these steps:

### 1. Check if Backend Server is Running

Open a new terminal and run:
```bash
npm run server
```

You should see:
```
🚀 Server is running on http://localhost:5000
📡 API endpoint: http://localhost:5000/api/contact
```

### 2. Test the API Connection

Open your browser and go to:
```
http://localhost:5000/api/health
```

You should see:
```json
{"status":"Server is running","timestamp":"..."}
```

If this works, the server is running correctly.

### 3. Check for Port Conflicts

If port 5000 is already in use, you can change it:

**Option A:** Change the port in `.env`:
```
PORT=5001
```

**Option B:** Update the frontend to use the new port in `src/components/contact.js`:
```javascript
const API_URL = 'http://localhost:5001';
```

### 4. For Production/Deployment

When deploying, create a `.env` file in your React app root (for Create React App) or set environment variables:

**In your React app's `.env` file (create it if it doesn't exist):**
```
REACT_APP_API_URL=https://your-backend-domain.com
```

**Important:** 
- React environment variables must start with `REACT_APP_`
- Restart the React dev server after adding `.env` variables

### 5. CORS Issues

If you're getting CORS errors, make sure:
1. The backend server has CORS enabled (already done in `server.js`)
2. Both frontend and backend are running
3. Frontend URL matches what's allowed in CORS config

### 6. Network/Firewall Issues

- Windows Firewall might be blocking Node.js
- Antivirus might be blocking the connection
- Check if `localhost:5000` is accessible in your browser

### 7. Quick Test

Test the API directly using curl or Postman:

```bash
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"Test message"}'
```

Or use this JavaScript in browser console:
```javascript
fetch('http://localhost:5000/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Test',
    email: 'test@example.com',
    message: 'Test message'
  })
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

