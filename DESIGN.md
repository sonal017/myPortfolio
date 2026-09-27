# Sonalkumar Singh Portfolio

## Intent

A developer portfolio for recruiters and prospective clients. Lead with the
developer's name and real work. Keep the experience calm, legible, and quick to
scan. This document describes this portfolio, not another company's brand.

Reference: VoltAgent's independent Vercel design analysis, read 2026-09-27:
https://github.com/VoltAgent/awesome-design-md/blob/main/design-md/vercel/DESIGN.md

Adapted principles: restrained surfaces, consistent spacing, clear hierarchy,
subtle layered elevation, and explicit component states. Retain the existing
SS identity, blue accent, and locally hosted Manrope / Space Grotesk fonts.
Do not import Vercel trademarks, gradients, proprietary assets, or marketing copy.

## Color Roles

`frontend/src/App.css` is the source of truth for CSS tokens.

| Role | Light | Dark |
| --- | --- | --- |
| Page | #ffffff | #161719 |
| Secondary surface | #f7f8fa | #1e2023 |
| Panel | #ffffff | #26282c |
| Primary text | #16181d | #f7f8fa |
| Body text | #4c5666 | #b9bfca |
| Secondary text | #606b7b | #a3acbb |
| Divider | #e2e5ea | #363c47 |
| Accent | #2751d0 | #8aafff |

Use blue for actions, links, and focus. Green signals availability; red signals
errors. Status must also include text. Both themes cover the entire page.

## Typography

- Manrope: body copy, labels, buttons, and navigation.
- Space Grotesk: headings, name, and compact facts.
- Desktop name 68px; tablet 58px; mobile 42px; narrow mobile 36px.
- Section heading 36px desktop / 28px mobile; project title 28px desktop / 24px mobile.
- Body 16px; descriptions 16px desktop / 15px mobile; secondary copy 14px;
  metadata at least 12px.
- Form inputs remain 16px on all devices.
- Heading weight 600; body 400; controls 600. Letter spacing stays zero.
- Use balanced headings, readable paragraph measures, and wrapping instead of clipping.

## Layout

- Content width caps at 1200px. Gutters: 32px desktop, 20px mobile, 16px narrow.
- Respect device safe-area insets in the fixed header, gutters, and footer.
- Base spacing unit is 4px. Reuse spacing tokens for section and control rhythm.
- Section padding 80px / 88px desktop and 48px mobile.
- All six projects use the same two-column grid, with screenshots above their
  descriptions. The grid uses one column below 768px; no featured-row variation.
- Screenshots keep a reserved 16:9 frame and show the real image without cropping.
- Page sections are unframed bands. Do not turn sections into floating cards.

## Components and States

- Controls use 4px or 6px radii; media 6px; dialogs 8px.
- Buttons and standalone links have at least 44px touch height; primary actions 48px.
- Provide default, hover, pressed, focus-visible, disabled, error, and loading states.
- The project section is titled "Worked Projects" and always shows all projects,
  without category filters or URL-based filtering.
- Navigation closes when focus leaves the expanded menu; Escape returns focus.
- Input errors appear next to their field and are associated with aria-describedby.
- Trim submitted values, focus the first invalid field, and keep entered text after failure.
- Warn before discarding an unsent message. Do not persist contact details in localStorage.
- Submission keeps a stable button label, announces progress, and delays its spinner
  to avoid fast-response flicker. Prevent repeat submissions while a request is pending.
- Preserve the native dialog, focus restoration, and direct email recovery path.

## Motion and Elevation

- Use short CSS feedback, approximately 160-180ms, with explicit properties.
- Use subtle layered shadows only for framed media, selected controls, and overlays.
- No autoplay decoration, scroll hijacking, parallax, or hidden-on-scroll content.
- Honor reduced-motion and reduced-transparency preferences.

## Content and Verification

- Keep all six projects, ownership labels, live links, and the current CV.
- Never show source-code links for company projects without an authorized public repo.
- Do not fabricate metrics, testimonials, screenshots, employers, or experience.
- Protect personal names, project names, and technology names from automatic translation.
- The no-JavaScript version shows every project and usable native links.
- Regenerate the static fallback, run tests and a production build, then verify
  desktop/mobile, light/dark, keyboard navigation, reduced motion, and no-JavaScript.
- Design work must not silently alter backend storage, access controls, or deployment.
