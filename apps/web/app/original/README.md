# Original Canva website

Published source: https://kangaroo-3qm66d.my.canva.site/
Canva design: DAHbEoDr7zM. Retrieved 2026-11-16.

`maison-sillage.html` contains the complete published document, its authored CSS
and its original application script. The `/` resource route returns this document
directly. The previous React homepage remains in the repository but is not the
active homepage. Edit this HTML to change the currently displayed website.

All seven sections, footer, nine collection cards, lookbook carousel, favorites,
notebook print dialog and responsive menu come from the original document.
Favorites follow the original session-only behavior and reset on page reload.

Integration changes are limited to removing Canva editor/telemetry/resizing SDKs,
removing the iframe's fixed runtime dimensions, and replacing external resource
URLs with local files. Original design CSS and copy have been preserved.

Assets in `public/canva-original/`:

- Original Pexels photos, with identical photo IDs in the local filenames.
- Cormorant Garamond 400/500/600 and DM Sans 400/500/600/700, downloaded from Google Fonts.
- Lucide 0.577.0 UMD bundle, downloaded from jsDelivr.

Verification: TypeScript and production build pass. Desktop 1440×900 and mobile
390×844 captures confirm all sections/images loaded and no horizontal overflow.
Browser checks cover category filters, favorite counts, lookbook next, notebook
open/close, FAQ disclosure and mobile navigation, without runtime exceptions.

The incumbent DESIGN.md describes the former approximation, not this imported
document. For this homepage the original HTML/CSS is the visual source of truth.
