# Portfolio Browser Checks

Uses Microsoft's Playwright CLI skill, installed at
`~/.codex/skills/playwright-cli`.

Start the portfolio on port 3002, then run these commands from `frontend`:

```powershell
playwright-cli -s=portfolio-qa open http://localhost:3002/
playwright-cli -s=portfolio-qa run-code --filename=scripts/portfolio-browser-check.js
playwright-cli -s=portfolio-qa close
```

If npm's global directory is not on PATH on Windows, invoke the installed command
with `& "$env:APPDATA\npm\playwright-cli.cmd"` in place of `playwright-cli`.

The check covers the consistent six-project grid at five widths, loaded images,
company source-link rules, both CV downloads, theme persistence, keyboard
navigation, contact validation, mocked 503/429 and acknowledged/unacknowledged saves, dialog focus, and the
no-JavaScript fallback. It throws on failure and returns a named check list on success.

Contact responses are intercepted inside the test browser. Other non-GET/HEAD
requests are blocked during the check; no actual contact submission is sent.
Use a fresh named session and close only that session when finished.

Screenshots, browser logs, and test CV downloads are stored under the ignored
`frontend/node_modules/.cache/playwright-cli/` directory. The CLI configuration is
`frontend/.playwright/cli.config.json`; no production dependency is added.

This is a local Chromium smoke check, not a full accessibility audit or proof of
backend delivery. The mocked HTTP 503/429 intentionally create console resource
error; uncaught JavaScript page errors still fail the check. Firefox, WebKit,
physical touch devices, and real message persistence are not covered here.
