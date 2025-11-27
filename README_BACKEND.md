# Backend Setup for Contact Form

This backend server accepts contact form submissions and stores them in the configured database.

## Setup Instructions

1. Install dependencies

```bash
npm install
```

2. Create a `.env` file in the backend folder with at minimum:

```env
MONGO_URI=your-mongodb-connection-string
PORT=5000
```

3. Start the server

```bash
npm run server
```

Or start both frontend and backend in development:

```bash
npm run dev
```

## API Endpoints

- `POST /api/contact` — receives and stores a contact message
- `GET /api/messages` — lists recent messages (for verification)
- `GET /api/health` — health check

## Notes

- The backend stores messages in the database configured by `MONGO_URI`.
- If you later want notifications (email), integrate a third-party email provider and add that functionality.

## Troubleshooting

- If messages are not saving, check that `MONGO_URI` contains a database name and that your DB allows connections from your IP (MongoDB Atlas network access).
- Check server logs for detailed errors.
```markdown
# Backend Setup for Contact Form

This backend server accepts contact form submissions and stores them in the configured database.

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

This will install:
- `express` - Web server framework
- `cors` - Enable CORS for frontend requests
- `dotenv` - Environment variable management
- `concurrently` - Run frontend and backend together (dev dependency)

### 2. Create Environment File

Create a `.env` file in the backend root directory containing at minimum the MongoDB connection and port:

```env
MONGO_URI=your-mongodb-connection-string
PORT=5000
```

**Important:** Never commit the `.env` file to git! It's already in `.gitignore`.

### 3. Start the Server

#### Option A: Run Backend Only
```bash
npm run server
<!-- README cleaned: email sending removed; replaced with storage-only instructions -->
# Backend Setup for Contact Form

This backend server accepts contact form submissions and stores them in the configured database.

## Setup Instructions

1. Install dependencies

```bash
npm install
```

2. Create a `.env` file in the backend folder with at minimum:

```env
MONGO_URI=your-mongodb-connection-string
PORT=5000
```

3. Start the server

```bash
npm run server
```

Or start both frontend and backend in development:

```bash
npm run dev
```

## API Endpoints

- `POST /api/contact` — receives and stores a contact message
- `GET /api/messages` — lists recent messages (for verification)
- `GET /api/health` — health check

## Notes

- The backend stores messages in the database configured by `MONGO_URI`.
- If you later want notifications (email), integrate a third-party email provider and add that functionality.

## Troubleshooting

- If messages are not saving, check that `MONGO_URI` contains a database name and that your DB allows connections from your IP (MongoDB Atlas network access).
- Check server logs for detailed errors.
This backend stores messages in the configured database. If you later want to add email notifications, integrate a transactional email service (SendGrid, Mailgun, AWS SES) and update the server accordingly.

