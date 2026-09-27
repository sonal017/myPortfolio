# Contact Backend

Run commands in `backend` with Node.js 22.16 or later:

```sh
npm ci
npm test
npm start
```

Configure `backend/.env` using `backend/.env.example`. MongoDB is required for successful submissions; in production both `MONGO_URI` and an exact HTTPS `FRONTEND_URL` are required. Keep credentials out of Git and the frontend.

## API

- `POST /api/contact`: accepts JSON string fields `name`, `email`, and `message`; confirms success only after an acknowledged MongoDB write.
- `GET /api/health`: HTTP 200 when connected, HTTP 503 when storage is unavailable.
- `GET /api/messages` and `GET /api/contact`: intentionally unavailable (404). Read messages privately through your database client.

Storage failures return 503, invalid input 400, oversized payloads 413, non-JSON bodies 415, and rate-limited requests 429. No submitted contact data or provider credentials are returned in errors or logged.

Google Sheets is an optional copy after the MongoDB save, not a substitute for the database. Its response must acknowledge the copy with JSON `{"success":true}`. This backend does not send email notifications.

The legacy `backend/server/index.js` launch path now starts the same secured server; its old SQLite routes are retired. The old local database is not part of the deployed application.

For local frontend and backend together, run `npm run dev` in `frontend` after installing both packages.

See [deployment settings, proxy trust and staging verification](docs/deployment.md) before public launch.

