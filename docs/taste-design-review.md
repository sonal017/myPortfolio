# Taste design pass

Reference: https://www.tasteskill.dev/ and its upstream `skills/taste-skill/SKILL.md`
and `skills/redesign-skill/SKILL.md`, read on 2026-09-27.

## Direction

Developer portfolio for recruiters and prospective clients. Preserve the SS logo,
blue identity, real project images, copy, navigation, CV, and no-JavaScript support.
Use the existing React and native CSS implementation, not a new design framework.

- Design variance: 6. Two larger lead projects, then a compact paired grid.
- Motion intensity: 3. Feedback on hover and press; no scroll hijacking or hidden content.
- Visual density: 4. Readable project evidence and compact grouped technology lists.
- Type: self-hosted Manrope for body text and Space Grotesk for headings.
- Shape: 4px controls, 6px media and filter groups, 8px dialog.

## Audit and changes

- Removed the hard-coded dark introduction from light mode; every section uses theme tokens.
- Replaced decorative numbering and repeated eyebrow/headline stacks with direct labels.
- Gave SlotMate and Ezhog larger screenshot layouts without inventing results or metrics.
- Added project filters; the static version always exposes every project.
- Reorganized skills into category rows instead of three uneven columns.
- Removed the contact form's floating container and increased input border contrast.
- Kept the existing icon family, meaningful status colors, focus rings, reduced-motion
  behavior, native education disclosure, and contact error/success states.

The external skill is guidance, not a reason to replace accurate screenshots with
generated imagery, fabricate testimonials, add decorative effects, or change URL anchors.

## Verification

- Nine automated tests pass, including project filtering, company source-link rules,
  CV links, contact states, static output, and licensed self-hosted fonts.
- Production build passes. Existing browser-data freshness warnings remain; no
  dependency updates were bundled into this design change.
- Browser checks covered 320, 390, 768, 1024, 1440, and 1920px widths, with no
  horizontal overflow. A narrow-screen filter-label overflow was found and fixed.
- Checked light and dark themes, real image loading, keyboard filtering, menu
  Escape/focus return, skip-to-content focus, and reduced-motion behavior.
- Primary light-theme text tokens have at least 4.82:1 contrast on the tinted
  surface. This is a targeted check, not a full accessibility certification.
- Disabled JavaScript in the production preview: all six projects, native mobile
  navigation, resume links, and direct contact links remain present.
- Contact delivery was mocked in tests; no real message was sent. Lighthouse and
  cross-browser audits were not run.
