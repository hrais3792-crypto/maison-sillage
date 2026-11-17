---
name: Maison Sillage
description: A French fashion storefront shaped as a sequence of editorial passages.
colors:
  limestone: "#eee9e0"
  limestone-light: "#f5f2eb"
  ink: "#292722"
  ink-soft: "#555148"
  iron: "#37332e"
  oxblood: "#793f3b"
  bronze: "#927656"
  rule: "rgb(41 39 34 / 20%)"
  iron-text: "#e2d9cb"
  footer-muted: "#d8cfc0"
  bronze-light: "#d4bb9b"
  entry-image-fallback: "#d3c4b1"
  collection-image-fallback: "#d4c8b9"
typography:
  display:
    fontFamily: "Playfair Display Variable, Georgia, serif"
    fontSize: "clamp(3.2rem, 5.3vw, 5.4rem)"
    fontWeight: 400
    lineHeight: 0.98
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Playfair Display Variable, Georgia, serif"
    fontSize: "clamp(2.8rem, 5vw, 4.8rem)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Playfair Display Variable, Georgia, serif"
    fontSize: "clamp(2.1rem, 3.2vw, 3.2rem)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Outfit, sans-serif"
    fontSize: "0.98rem"
    fontWeight: 400
    lineHeight: 1.75
  label:
    fontFamily: "Outfit, sans-serif"
    fontSize: "0.76rem"
    fontWeight: 400
    letterSpacing: "0.045em"
  action:
    fontFamily: "Outfit, sans-serif"
    fontSize: "0.84rem"
    fontWeight: 400
  brand-mark:
    fontFamily: "Playfair Display Variable, Georgia, serif"
    fontSize: "0.9rem"
    fontWeight: 400
rounded:
  circle: "50%"
  arch: "50% 50% 0 0 / 20% 20% 0 0"
components:
  collection-link:
    backgroundColor: "{colors.oxblood}"
    textColor: "{colors.limestone-light}"
    typography: "{typography.action}"
    rounded: "0"
    padding: "0.2rem 0.05rem 0.2rem 1.15rem"
    height: "3.4rem"
  site-navigation:
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "0"
    padding: "0.5rem 0"
  brand-mark:
    textColor: "{colors.oxblood}"
    typography: "{typography.brand-mark}"
    rounded: "{rounded.circle}"
    size: "2.45rem"
---

# Design System: Maison Sillage

## Visual ambiences

The appearance selector below the header offers Pierre (the existing palette), Galerie (white #ffffff, stone #efefed, green accent #434d42), and Nuit (background #252321, surface #302c29, text #f3e9dc, copper accent #e1b28f). Semantic colors update navigation, passages, controls, and focus treatments. The hero uses monochrome photography in Galerie and a darker treatment in Nuit. The selector uses a 1.25rem editorial title and 0.8rem controls, consistent with existing small interface sizes. Its white swatch intentionally previews the Galerie surface.

Controls expose aria-pressed, retain 44px touch targets, and wrap on mobile. Preference is stored locally when available; unavailable storage keeps appearance changes usable for the current visit and displays a status message. Verification: TypeScript and production build passed. Automated design review returned only advisory findings for these intentional size and swatch additions. Browser rendering verification was blocked by a Chrome GPU startup failure in the execution environment.

## Overview

**Creative North Star: "Le passage des silhouettes"**

Maison Sillage's homepage is an editorial sequence of thresholds: a fashion image and collection invitation, a two-image collection passage, then a quiet Maison sign-off. Warm limestone, a dark iron section, oxblood action, and restrained bronze framing give the page its architectural character. The desktop and mobile captures confirm this hierarchy, with the lead image paired with the collection plaque on wider screens and placed above it on narrow screens.

The current implementation uses real font files for Outfit and Playfair Display Variable, but its three remote Unsplash photographs are explicitly labeled as inspiration, not Maison Sillage product imagery. No catalog, prices, availability, provenance, or craftsmanship story is represented. The brief mentions textured glass, but no glass surface or texture is implemented in the inspected CSS or captures; this document records the shipped limestone-and-iron treatment instead.

**Key Characteristics:**
- A warm, restrained palette with oxblood reserved for the main collection action.
- Playfair Display headlines paired with Outfit navigation, labels, and body copy.
- Editorial image framing and a single arched plaque establish passage-like architecture.
- Responsive layouts preserve the image-to-copy sequence and direct collection navigation.

## Colors

The palette moves from warm, pale limestone through charcoal iron and ink, with deep muted oxblood and aged bronze as sparing accents.

### Primary
- **Deep Oxblood** (`#793f3b`): Main collection link, selected text and directional icon accents, and focus outlines.

### Secondary
- **Muted Bronze** (`#927656`): Circular brand-mark border, arch outline, and underlines on secondary links.
- **Pale Bronze** (`#d4bb9b`): Directional icon accent on the iron-colored Maison passage.

### Neutral
- **Warm Limestone** (`#eee9e0`): Main page and header background.
- **Pale Limestone** (`#f5f2eb`): Collection passage background and light text on oxblood or iron.
- **Warm Ink** (`#292722`): Main text and the base tone of the fine divider rules.
- **Soft Ink** (`#555148`): Supporting paragraphs, captions, and quiet labels on light surfaces.
- **Blackened Iron** (`#37332e`): Maison passage and footer background.
- **Iron Linen** (`#e2d9cb`): Supporting copy on the iron passage.
- **Footer Linen** (`#d8cfc0`): Footer's small collection-status line.
- **Passage Rule** (`rgb(41 39 34 / 20%)`): Fine separators on limestone surfaces.
- **Image Fallbacks** (`#d3c4b1`, `#d4c8b9`): Flat backgrounds behind the lead and collection images while images load.

### Named Rules
**The Passage-Link Rule.** Keep the collection invitation a clear, directly usable link; the arch is framing, not a replacement for the action.

## Typography

**Display Font:** Playfair Display Variable (with Georgia, serif fallback)  
**Body Font:** Outfit (with sans-serif fallback)  
**Label/Mono Font:** Outfit, same sans-serif family as body.

**Character:** Playfair Display Variable supplies the composed, high-contrast editorial voice; Outfit keeps navigation, captions, and explanatory copy plain and legible.

### Hierarchy
- **Display** (400, `clamp(3.2rem, 5.3vw, 5.4rem)`, `0.98` line-height, `-0.035em` tracking): Lead collection statement; the mobile rule has its own responsive clamp and a wider text measure.
- **Headline** (400, `clamp(2.8rem, 5vw, 4.8rem)`, `1` line-height, `-0.035em` tracking): Collection section heading.
- **Title** (400, `clamp(2.1rem, 3.2vw, 3.2rem)`, `1.1` line-height): Collection note heading; the Maison title scales separately to the viewport.
- **Body** (400, `0.98rem`, `1.75` line-height): Introductory copy. Supporting collection text uses `0.88rem` and `1.75`; body sizes are tuned by section.
- **Label** (400, `0.76rem`, `0.045em` tracking): Desktop navigation and header note. Image captions use `0.68rem` and compact tracking.

### Named Rules
**The Editorial Pairing Rule.** Keep Playfair Display Variable for large editorial titles and Outfit for functional navigation, captions, and prose.

## Layout

The sticky header is a three-column grid at desktop width, with brand at left, centered navigation, and a quiet descriptor at right. At `900px` and below, the descriptor disappears and navigation becomes a toggle-controlled dropdown beneath the header. The header's minimum height is `82px` on desktop, `74px` at tablet widths, and `70px` at `640px` and below.

The entry passage pairs a flexible image column and a text/plaque column. It uses a `min(780px, 82svh)` minimum height on desktop and stacks image first, then copy, at `640px` and below. Collection content uses an asymmetrical two-column image-and-note composition, collapsing to one column on mobile. The Maison passage uses a wide title/copy grid, then a single column on mobile. Horizontal page insets are fluid with `clamp()` on large viewports and close to `1.2rem` on mobile; section padding is intentionally generous.

The collection and Maison sections have `5rem` scroll margins, and the document reserves space below the sticky header for anchor destinations. Scrolling is smooth by default and becomes automatic under `prefers-reduced-motion: reduce`.

## Elevation & Depth

The system is flat at rest: depth comes from the full-bleed editorial photography, shifts between limestone and iron backgrounds, hairline borders, and the arched outline around the entry copy. No box-shadow system is used. The lead image has a subtle arrival scale animation, and its caption uses a soft text shadow for legibility; reduced-motion preferences remove animation and transition effects.

## Shapes

Most surfaces and controls are square-cornered. The exceptions are deliberate: the brand initials sit in a circular thin-bronze outline, and the entry plaque uses an open-bottom arch made by a single border pseudo-element. Fine horizontal rules separate navigation, captions, and text groups; there are no rounded cards or pill controls.

## Components

### Navigation
- **Style:** Sticky limestone header with ink text; desktop navigation is centered and uses small Outfit labels with a fine underline that reveals on hover or focus.
- **Mobile:** At `900px` and below, a circular, thin-rule menu toggle opens a full-width limestone menu below the header. Its accessible label and expanded state change with open/closed state; selecting an anchor closes the menu.
- **Focus:** Links and the toggle use a `2px` oxblood outline with `4px` offset.

### Brand Lockup
- **Shape:** A `2.45rem` circular mark with a `1px` bronze border, oxblood “MS” initials, and Playfair Display Variable; the brand name is set in the same display family.
- **Use:** Links to the home passage and is paired with the Maison name. The small-screen mark is `2.2rem`.

### Primary Collection Link
- **Character:** A square, oxblood-filled anchor with a calm, direct action label and a slim directional arrow.
- **Shape:** Square corners, `1px` oxblood border, minimum height `3.4rem` (`3.15rem` on mobile).
- **State:** Hover removes the fill and switches the label to oxblood; focus retains the global visible outline.
- **Behavior:** Links directly to `#collection`; it is an anchor, not a purchase or checkout button.

### Secondary Links
- **Style:** Text-and-arrow anchors, without a filled container. The Maison and collection note links use a bronze bottom border; directional icons use oxblood, except on iron where the light-link icon uses pale bronze.
- **State:** The arrow shifts `3px` up and right on hover; link underline treatment stays restrained.

### Entry Plaque
- **Shape:** Open-bottom, thin-bronze arch framing the h1, description, and primary link; no fill separate from the limestone copy region.
- **Responsive behavior:** The arch narrows around the text on mobile while retaining the same open-bottom silhouette.

### Editorial Figures
- **Style:** Unrounded image crops with `object-fit: cover`, aspect ratios tuned by image role, and small Outfit captions.
- **Content status:** Current remote photographs and captions identify the images as editorial inspiration. Keep that status clear until real collection imagery is supplied.

### Collection and Maison Passages
- **Collection:** Pale limestone surface, asymmetrical image layout, a fine heading rule, disclaimer, image captions, and a copy block with top rule.
- **Maison:** Blackened-iron background, pale text, oversized Playfair Display title, thin top rule, and a light return link.

## Do's and Don'ts

### Do:
- **Do** retain the limestone / pale limestone / iron surfaces and the current oxblood action contrast.
- **Do** use the collection anchor as a clear passage into the collection section.
- **Do** keep the mobile sequence image first, then the entry plaque and collection content.
- **Do** preserve visible focus outlines and reduced-motion behavior.
- **Do** identify the current photographs and collection status as inspiration or unfinished where shown.

### Don't:
- **Don't** present inspiration imagery as actual Maison Sillage products.
- **Don't** invent product names or details, prices, availability, provenance, craft claims, testimonials, or commerce flows.
- **Don't** document textured glass, shadow cards, rounded product cards, or other treatments as shipped; they are not present in the inspected implementation.
- **Don't** turn the styled collection anchor into an implied purchase or checkout action.
