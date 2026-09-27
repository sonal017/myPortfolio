# API Connection Setup

## Local development

1. Configure `backend/.env` with your MongoDB connection, `NODE_ENV=development`, and `PORT=5000`.
2. Run `npm ci` and `npm start` in `backend`.
3. Set `REACT_APP_API_URL=http://localhost:5000` in `frontend/.env`, then run `npm start` in `frontend`. Restart after environment changes.
4. Check [local API health](http://localhost:5000/api/health). HTTP 200 with `{"status":"ready"}` indicates a database connection. HTTP 503 means storage is unavailable.

For a port conflict, change backend `PORT` and the port in frontend `REACT_APP_API_URL`; do not hardcode a new URL in component code.

## Production

Set `REACT_APP_API_URL` to the actual HTTPS backend base URL in the frontend build environment. Run `npm run build`; missing, insecure, or local production API URLs are rejected. This value is embedded in the JavaScript build, so changing it requires rebuilding.

Set backend `NODE_ENV=production`, `MONGO_URI`, and `FRONTEND_URL` to the exact HTTPS portfolio origin. Unknown browser origins receive 403. Localhost browser origins are accepted only in development.

Using `REACT_APP_API_URL=/` requires an explicitly configured same-origin `/api/*` proxy. An HTML SPA fallback is not a working API response.

A live form test writes contact data to MongoDB and optionally Google Sheets. Use only your own test data and inspect it with a private database client. No public message-listing endpoint is available.

See the complete [deployment checklist](docs/deployment.md), including rate-limit proxy settings and verification steps.

