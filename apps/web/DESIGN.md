---
name: Maison Sillage
description: A French editorial fashion inspiration gallery in ink and warm ivory.
colors:
  ink: "#171715"
  cream: "#f7f5ef"
  stone: "#eeebe3"
  bronze: "#ac9575"
  line: "#d9d4c9"
  muted: "#666257"
  light-muted: "#c6bfb1"
typography:
  display:
    fontFamily: '"Cormorant Garamond", serif'
    fontSize: "clamp(76px, 7.3vw, 96px)"
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: "-0.035em"
  headline:
    fontFamily: '"Cormorant Garamond", serif'
    fontSize: "clamp(54px, 6.5vw, 96px)"
    fontWeight: 400
    lineHeight: 0.96
    letterSpacing: "-0.035em"
  title:
    fontFamily: '"Cormorant Garamond", serif'
    fontSize: "29px"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Inter, sans-serif"
    fontSize: "13px"
    lineHeight: 1.85
  label:
    fontFamily: "Inter, sans-serif"
    fontSize: "10px"
    fontWeight: 500
    letterSpacing: "0.13em"
rounded:
  square: "0"
  circle: "50%"
spacing:
  card-gap: "24px"
  mobile-card-gap: "16px"
  mobile-gutter: "22px"
  section: "clamp(80px, 9vw, 140px)"
components:
  quick-save:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.cream}"
    padding: "15px 20px"
    height: "52px"
  quick-save-selected:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.ink}"
  favorite:
    backgroundColor: "rgb(247 245 239 / 95%)"
    textColor: "{colors.ink}"
    rounded: "{rounded.circle}"
    width: "44px"
    height: "44px"
  favorite-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.cream}"
  quick-view:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.ink}"
    padding: "14px"
---

# Design System: Maison Sillage

## Overview

**Creative North Star: “The Editorial Fashion Notebook.”**

An immersive photographic invitation, with expressive serif headlines, disciplined interface typography and generous breathing room. Warm ivory pages alternate with an ink-dark lookbook; subtle champagne details support the photographs rather than compete with them. Asymmetric images and a horizontal collection give the page an editorial rhythm.

This document governs the active `/` route: `app/routes.ts` selects `app/routes/canva-original.ts`, which serves `app/original/maison-sillage.html`. Styles load from `public/canva-original/`, with `luxury.css` providing the final visual overrides. Repository-root design documents describe the older, inactive React homepage; retain those as an archived design scope, not as guidance for this storefront.

The product is a French-language inspiration gallery. Images are not supplied sale inventory. Preserve the factual distinction throughout the experience: no invented prices, sizes, materials, stock, provenance, checkout or payment behavior.

**Key Characteristics:**

- Full-screen photographic opening and oversized editorial type.
- Flat, precise surfaces with fine dividing lines.
- Real discovery, zoom and saved-inspiration interactions.
- Restrained motion that respects reduced-motion preferences.

## Colors

The normative palette above is extracted from the final `luxury.css` custom properties. `--wine` remains a compatibility alias with the same value as `--ink`; it is not a separate accent.

### Primary

- **Bronze / subtle champagne:** `--bronze` marks focus, selected lookbook details and small accents.

### Neutral

- **Ink:** `--ink` anchors text, the lookbook, footer and saved states.
- **Warm ivory:** `--cream` provides page and dialog surfaces.
- **Stone:** `--stone` supports image areas and neutral layering.
- **Line:** `--line` divides content without adding heavy containers.
- **Muted / light muted:** `--muted` supports secondary text on light surfaces; `--light-muted` supports secondary text on dark surfaces.

Keep champagne rare. Photography and the ink/ivory relationship establish the hierarchy.

## Typography

Cormorant Garamond supplies display, headings, image titles and the wordmark through `--serif`. Locally hosted variable Inter supplies interface and body text through `--sans`. Keep editorial italics within headlines; use uppercase, tracked sans labels for navigation and actions.

The frontmatter records the desktop hierarchy. The mobile hero uses `clamp(62px,17vw,80px)` with a .94 line height, section headings use 60px, and the FAQ uses 50px. Body copy stays compact with generous leading and short measures: hero copy is 34ch on desktop and 31ch on mobile. Do not apply display tracking to body text.

## Layout

The main container caps at 1440px. Desktop sections use 6vw side gutters and the section spacing token; mobile sections use 76px vertical padding and the mobile gutter. The hero fills at least 100svh and uses a directional image gradient to support text.

Universe images use a 1.15fr/.85fr asymmetric pair with a 5vw gap and a delayed second image. At 600px and below, retain the two-image composition with a 13px gap and taller crops. The collection scrolls horizontally: approximately 3.18 cards on desktop, 44% card width at 800px and 85% at 600px. Preserve the visible next-card invitation and usable navigation controls.

Responsive overrides occur at 1000px, 800px and 600px. At 800px, desktop navigation yields to the mobile menu. At 600px, quick-view becomes a single column and the gallery uses 42svh. The saved-selection drawer is full-height, at most 490px wide, and never wider than the viewport.

## Elevation & Depth

Surfaces are predominantly flat. Image crops, tonal changes, fine borders and dark translucent backdrops establish depth. Native modal dialogs sit above the page; their backdrop uses ink at 65% opacity. Avoid introducing decorative card shadows. The lookbook image label uses a small text shadow solely for photographic legibility.

## Shapes

Editorial images, panels and dialogs use square edges. Circular favorites and count indicators are compact exceptions. Controls generally provide 44px or larger interaction targets, with thin outlines and clear pressed states.

## Components

### Navigation

A sticky header starts translucent and dark over the hero, then becomes warm ivory. Desktop “Explorer” opens a click-driven editorial mega menu; mobile uses a stacked menu. Preserve expanded-state attributes, Escape dismissal and focus restoration. Hover underlines animate from the left.

### Buttons

The hero CTA is an understated underline with an arrow that moves diagonally on hover. Primary save actions use ink on ivory; their selected state reverses that relationship. Outline actions remain precise and square. Focus uses the bronze outline, retaining the inherited 2px outline and 4px offset.

### Filters

Category filters are typographic tabs with a bottom rule, not filled pills. The pressed state uses an ink underline and `aria-pressed`. Keep them operable on touch and keyboard.

### Cards / Containers

Collection cards place photography first, with a .75 image aspect ratio and serif title beneath. A circular favorite shares the existing saved-selection state. Related-image hover swaps are another inspiration, not an alternate product SKU. Quick-view is revealed on fine-pointer hover or keyboard focus; touch users receive the action directly.

### Quick-view and lookbook

Quick-view combines a contained photograph with concise editorial copy, a real 1.45× detail zoom and a save action. Keep the explicit inspiration/non-sale disclosure. The dark lookbook has pressed scene choices, previous/next controls and an enlarged-image viewer. Native dialogs preserve keyboard dismissal and return focus to the trigger.

### Saved-selection drawer and notebook

The right-hand drawer displays the same favorites used by cards and quick-view. Removal updates every surface; an empty state replaces the list when needed. Persistence uses this browser when storage is available, with a truthful visit-only fallback. “Ouvrir mon carnet” opens the existing printable notebook. This is a wishlist for inspirations, not a shopping cart.

### Motion

Use the existing `--ease` curve for restrained entrances, hover movement and dialogs. Headline lines reveal sequentially; dialogs enter vertically and the drawer enters horizontally. Keep transformations and opacity lightweight. Reduced-motion rules remove animation and smooth scrolling; do not hide content behind an animation requirement.

## Do's and Don'ts

- **Do** preserve photographic scale, asymmetric pacing and quiet interface typography.
- **Do** keep focus, pressed states, dismiss controls and touch actions visible and usable.
- **Do** connect new saving surfaces to the existing favorites and printable notebook.
- **Do** preserve French copy and clearly label inspiration imagery.
- **Don't** import the inactive React homepage's palette or component language.
- **Don't** invent commercial inventory, product facts, pricing or purchase flows.
- **Don't** add decorative gold fills, rounded card shells or ornamental shadows.
- **Don't** make hover, custom cursors or motion necessary to discover or operate controls.
