# Deployment checklist

## Architecture

- Frontend: publish `frontend/build`, produced by `npm ci` and `npm run build` in `frontend`.
- Backend: one long-running Node.js 22.16+ process, `npm ci --omit=dev` and `npm start` in `backend`.
- MongoDB is the required source of truth. The API starts listening only after connecting when a URI is configured, and production refuses to start without one.
- Google Sheets is an optional, best-effort copy after the acknowledged MongoDB write. Its endpoint should return JSON `{"success":true}`. Copy failures do not erase the database record or invite duplicate submissions. There is no automatic mirror retry or email notification.
- Neither backend entry point exposes a public message-listing route. Inspect messages using a private, access-controlled database client.
- Do not publish source folders, `.env` files, or the retired local SQLite database. Serve only the frontend build as static files.

## Required deployment settings

Set these values in your host's environment settings, not in Git:

| Service | Variable | Value |
| --- | --- | --- |
| Frontend build | `REACT_APP_API_URL` | Actual HTTPS backend base URL, without `/api/contact` |
| Backend | `NODE_ENV` | `production` |
| Backend | `FRONTEND_URL` | Exact HTTPS portfolio origin, including `www` only if that is the canonical host |
| Backend | `MONGO_URI` | Database connection string for a restricted application account |
| Backend | `PORT` | Port supplied by the host; defaults to 5000 |
| Backend | `GOOGLE_SHEET_URL` | Optional HTTPS Apps Script endpoint |
| Backend | `TRUST_PROXY` | Verified proxy IPs/CIDRs, or `false` for direct connections |

The API setting is embedded at frontend build time. Changing it requires a rebuild and redeploy.
The production build rejects missing, HTTP, and localhost API settings. Local `npm start` still uses the existing local API setting.
`frontend/.env.production.example` and `backend/.env.example` contain placeholders, not deployment credentials.

An alternative is `REACT_APP_API_URL=/`, but ONLY after configuring your frontend host to forward `/api/*` to the backend. An SPA fallback that returns HTML is not an API proxy and is rejected by the contact form.

Never set proxy trust to `true` or a guessed hop count. Confirm your host's proxy network configuration first. CORS accepts the exact configured origin, not arbitrary preview domains. CORS is not authentication; origin-less clients are still subject to validation and rate limits.

## Abuse and timeout controls

- Five contact attempts per IP/subnet per 15 minutes, including invalid requests; blocked requests get HTTP 429 and `Retry-After`.
- The limiter uses process memory. Deploy one backend instance initially. Before multiple replicas or serverless deployment, configure a shared limiter store or equivalent platform rate limiting; restarts reset in-memory counters.
- Strict JSON input, 32 KB body limit, no compressed request bodies; string-only name/email/message lengths of 100/254/5000, trimming, email and control-character validation.
- MongoDB operations have a 5-second client deadline and majority write acknowledgement; Sheet copies have a 3-second abort deadline. Browser timeout is 15 seconds.
- HTTP headers/body intake deadlines are 10/15 seconds. Apply corresponding limits at the hosting reverse proxy.
- Logs exclude submitted names, email addresses, message text and raw provider errors.

## Verification before publishing

1. Run `npm ci`, `npm test`, and `npm audit --omit=dev` in `backend`.
2. Run `npm ci`, `npm test -- --watchAll=false --runInBand`, and `npm run build` in `frontend` with the real API build setting.
3. Run the [browser checks](playwright-checks.md) against a local preview. Those checks mock contact requests and do not prove delivery.
4. On staging, check HTTPS, `/api/health` (200), and that GET `/api/messages` and GET `/api/contact` return 404. Confirm allowed-origin CORS and the proxy trust setting.
5. Submit one identifiable test enquiry with your own email address and verify the record privately in MongoDB. If enabled, verify the optional Sheet copy too. Confirm that temporary storage failure shows an error and retains the browser draft.
6. Verify rate limiting from the deployed client IP, CV downloads, mobile layout, theme switching, and the no-JavaScript page on the final host.
7. Commit the reviewed changes, deploy the tested commit, and monitor storage errors and uptime.

Tests use fake storage and local HTTP servers, never the live database or Sheet. Deployment credentials, a real staging delivery check, shared rate limiting (if scaling), and host-specific proxy configuration cannot be verified without the chosen hosting setup.

## Dependency audit status

The backend dependency update cleared the seven reported production dependency findings (zero remaining at verification). Unused server/database packages were removed from the frontend and compatible fixes reduced its full audit from 66 to 28 findings: 9 low, 5 moderate, and 14 high, with no critical findings remaining. These remaining paths come through Create React App build/test/development tooling, not the contact backend. They are not being declared harmless or resolved. Keep development servers private and use only trusted build inputs; review a supported build-tool migration separately. Do not run `npm audit fix --force`: its suggested `react-scripts@0.0.0` replacement would break this application.

References: [CRA build-time environment settings](https://create-react-app.dev/docs/adding-custom-environment-variables/), [rate limiter configuration and store behavior](https://express-rate-limit.mintlify.app/reference/configuration), [Mongoose connection options](https://mongoosejs.com/docs/connections.html).
