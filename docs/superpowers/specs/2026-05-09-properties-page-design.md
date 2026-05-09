# /properties Page — Design Spec

**Date:** 2026-05-09  
**Project:** BuyLandCR (TerrenosLaFortunaCR)  
**Page:** `/properties` (index)  
**Stack:** Astro + React/TSX + Tailwind CSS v4 + tw-animate-css  

---

## Summary

A full redesign of the `/properties` listing page targeting foreign real estate investors. The page must:

1. Convert visitors to leads through a cinematic first impression and an ROI calculator
2. Surface all 5 (and future) properties with clear hierarchy and filtering
3. Rank for long-tail keywords: *land for sale La Fortuna Costa Rica*, *homes for sale Arenal Volcano*, *invest in Costa Rica real estate foreigners*

---

## Design Decisions

| Aspect | Decision | Rationale |
|---|---|---|
| Overall layout | Full-hero search + bento grid | Maximum first impression, product-first |
| Hero background | Split photo + parallax | Shows real property photos, lighter than video |
| Property grid | Bento editorial (featured 2x) | Luxury feel, clear hierarchy |
| Conversion tool | ROI Calculator | Qualifies high-intent investor leads |
| Animations | CSS + IntersectionObserver (no new libs) | Performant, uses existing tw-animate-css |

---

## Section 1 — Hero Split (full viewport height, `mt-20` for header)

### Layout
Two-column CSS grid: `grid-cols-[60%_40%]` on desktop, stacked on mobile.

**Left column (60%):**
- Background: hero image = `images[0]` of the featured property with the highest price (currently `property-003`, the $715k Luxury Home in Chachagua). If no featured property exists, use the first property. This is determined at build time in the Astro frontmatter.
- Image rendered as `object-cover`
- Gradient overlay: `from-forest-deep/80 via-forest-deep/40 to-transparent` left-to-right
- Content (z-10, bottom-anchored on desktop, centered on mobile):
  - Breadcrumb: `La Fortuna · Arenal · Costa Rica` — uppercase tracking, gold/50 color
  - `H1` (Cormorant Garamond, 56–72px): *"Land & Luxury Homes for Sale in La Fortuna, Costa Rica"*
  - Subheadline (Inter, 16px, white/70): *"Volcano-view lots, eco retreats and luxury villas — full legal support for international buyers."*
  - **Integrated search bar** (see below)

**Right column (40%):**
- Two stacked property thumbnails (`images[0]` of 2nd and 3rd featured properties)
- Each thumbnail: `aspect-[4/3]`, `object-cover`, subtle parallax on scroll via `transform: translateY` (JavaScript scroll listener, max ±20px)
- Price badge overlay bottom-left (gold background, forest text)
- On mobile: right column hidden, hero uses the left image full-width

### Integrated Search Bar
```
[ Budget, type, location...          ] [ Search ]
[ All ] [ 🏠 Homes ] [ 🌳 Land ] [ Under $200k ] [ 1+ acres ]
```
- Container: `bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4`
- Text input: free-text (non-functional search — on submit, scrolls to grid and pre-fills filter)
- Quick-filter chips below input: type, price bracket, size bracket
- Chips are pill buttons that scroll to grid and activate the corresponding filter by updating URL search params (e.g., `?type=land&price=under200k`). `FilterSortBar` reads these params on mount via `URLSearchParams` and initializes its state accordingly. This makes filters shareable and bookmarkable.

### Entrance Animations
All triggered on page load (not IntersectionObserver — hero is always visible):
- Breadcrumb: `animate-fade-up` 0ms delay
- H1: `animate-fade-up` 80ms delay
- Subheadline: `animate-fade-up` 160ms delay
- Search bar: `animate-fade-up` 240ms delay
- Right thumbnails: `animate-fade-in` 320ms delay

### SEO
- `H1` contains primary keyword
- `view-transition-name: title-properties` on H1 (already in current page, keep)
- Preload hero image via `<link rel="preload" as="image">`
- Hero image gets `fetchpriority="high"` and `loading="eager"`

---

## Section 2 — Filter + Sort Bar (sticky, below hero)

Sticky bar that follows the user as they scroll through the grid.

**Left side:** Property count — *"5 properties in La Fortuna"* (updates live when filters change)

**Center:** Filter chips row:
- Type: `All` | `🏠 Homes` | `🌳 Land`
- Price range dropdown: `Any price` | `Under $150k` | `$150k–$300k` | `$300k–$500k` | `$500k+`
- Size dropdown: `Any size` | `Under 1 acre` | `1–3 acres` | `3+ acres`
- Location dropdown: `All areas` | `La Tigra` | `San Rafael` | `Chachagua`

**Right side:** Sort dropdown — `Featured first` (default) | `Price: Low to High` | `Price: High to Low`

**Active filter badge:** small gold dot + count badge on the filter icon when any non-default filter is active (e.g., "3 filters active")

**Behavior on filter change:** cards that don't match transition to `opacity-20 scale-95 pointer-events-none` rather than `display:none` — this preserves the bento layout shape while clearly indicating filtered-out items.

**Mobile:** filter bar collapses to a single "Filter & Sort" button that opens a bottom sheet drawer.

---

## Section 3 — Bento Property Grid

### CSS Grid Structure
```css
grid-template-columns: 1.8fr 1fr 1fr;
grid-template-rows: auto auto;
gap: 1.5rem;
```

**Featured card** (first `featured: true` property, or first property if none): `grid-row: span 2` on the first column. All other cards fill the remaining 4 slots in reading order.

On tablet (< 1024px): `grid-template-columns: 1fr 1fr`, featured card still spans 2 rows.  
On mobile (< 640px): single column, featured card no longer spans.

### Featured Card Design
- Image: `aspect-[3/4]` tall portrait, `object-cover`, subtle `scale-105` on hover with `overflow-hidden`
- Top badges: ⭐ Featured (gold) + type badge (white)
- Photo count chip (bottom right)
- Content below image:
  - Location chip with pin icon
  - Title: Cormorant Garamond, 22px, 2-line clamp
  - Price: 36px, extrabold, forest-deep
  - Specs row: beds / baths / m² / acres
  - Top 3 features with green checkmarks
  - WhatsApp CTA button (full width, green)

### Secondary Cards Design
- Image: `aspect-[16/9]`, `object-cover`, `scale-105` on hover
- Same badge layout as featured, scaled down
- Title: Cormorant Garamond, 16px
- Price: 24px, extrabold
- 2 specs only (size + beds or size only for land)
- WhatsApp button (full width, compact)

### Stagger Entrance Animation
Each `.property-item` gets `animation-delay: calc(var(--index) * 80ms)` via inline style. Animation: `fade-up` from `translateY(24px) opacity-0` to `translateY(0) opacity-100`. Triggered by IntersectionObserver on the grid container (threshold 0.1).

---

## Section 4 — ROI Calculator

### Container
Full-width section, `bg-forest-deep text-white`, two columns on desktop (inputs left, results right), single column on mobile.

### Left Column — Inputs
1. **Budget slider**
   - Range: $50,000 – $800,000, step $5,000
   - Live label showing current value formatted as currency
   - Gold track fill up to thumb position

2. **Property type toggle**
   - Three pill buttons: `🌳 Land` | `🏠 Residential Home` | `🏡 Rental Villa`
   - Affects ROI calculation multipliers

3. **Occupancy rate slider** (only visible when type = Rental Villa or Home)
   - Range: 40% – 90%, default 65%
   - Label: *"Expected occupancy rate"*

### Right Column — Results
Animated number counters (CSS `@keyframes countUp` via JS `requestAnimationFrame`) that recount whenever inputs change:

| Label | Formula (approximate, for display purposes) |
|---|---|
| Est. Monthly Rental | `budget × rental_yield_monthly[type]` |
| Annual Gross ROI | `(monthly × 12 / budget) × 100` |
| 5-Year Value (est.) | `budget × (1 + appreciation_rate)^5` |

**Multiplier constants (editable in component):**
- Land: rental yield 0% (land doesn't rent), appreciation 8%/yr
- Residential Home: rental yield 0.7%/mo, appreciation 6%/yr  
- Rental Villa: rental yield 0.95%/mo at default 65% occupancy, scales linearly, appreciation 7%/yr

**Disclaimer (10px, white/40):** *"Estimates based on La Fortuna market averages. Actual returns vary. Contact us for a detailed analysis."*

**CTA:** `"Get a Detailed Projection →"` — gold button, opens WhatsApp with pre-filled message including the calculated figures.

### Mobile
Collapses to a single-column stacked layout. Results appear below inputs. Sliders get larger touch targets (min 44px height).

---

## Section 5 — Trust / SEO Intro (condensed)

Kept from current page, visually upgraded:
- Two-column layout maintained
- Left text: H2 + 2 paragraphs (existing SEO copy, no changes)
- Right aside: bullet list with gold dot markers → upgraded to icon + text rows
- Entrance animation: `animate-fade-in` via IntersectionObserver

---

## Section 6 — FAQ (Accordions)

Current 3-column static grid → animated accordion list:
- Each question is a `<details>`/`<summary>` styled as an accordion
- Open/close: `max-height` CSS transition (0 → auto via JS-measured height), `+` → `×` icon rotation
- All 3 existing questions kept, add 2 more:
  - *"What is the best area in La Fortuna to buy land?"*
  - *"How long does the buying process take for a foreigner?"*
- Schema.org `FAQPage` structured data (JSON-LD) with all 5 Q&As

---

## Section 7 — CTA Band (existing, kept)

Forest background CTA with WhatsApp link — no structural changes, only visual polish:
- Add subtle golden particle dots via CSS `radial-gradient` pseudo-element
- Entrance animation: scale from 98% to 100% + fade-in

---

## Component Architecture

| Component | Type | Notes |
|---|---|---|
| `PropertiesHero.astro` | Astro | Static hero shell, parallax via inline script |
| `FilterSortBar.tsx` | React | Sticky bar, manages filter/sort state |
| `PropertyBentoGrid.tsx` | React | Bento grid, receives filtered+sorted props, animates |
| `PropertyCard.astro` | Astro (existing) | Reused with minor visual updates |
| `RoiCalculator.tsx` | React | All interactive calculator logic |
| `FaqAccordion.astro` | Astro | Progressive enhancement via `<details>` |

`FilterSortBar` and `PropertyBentoGrid` share state via React context or prop drilling (simple enough for prop drilling — only 2 levels).

---

## SEO Checklist

- [x] H1 with primary keyword on every page load
- [x] Schema.org `ItemList` (already implemented, keep)
- [x] Schema.org `FAQPage` (new — 5 Q&As)
- [x] Breadcrumb Schema.org (`BreadcrumbList`)
- [x] Preloaded hero image (`fetchpriority="high"`)
- [x] Descriptive alt text on all property images
- [x] Canonical URL tag
- [x] Open Graph image (use hero/featured property image)
- [x] Title tag: *"Land & Luxury Homes for Sale in La Fortuna, Costa Rica | BuyLandCR"*
- [x] Meta description: *"Browse volcano-view lots, eco retreats and luxury villas in La Fortuna de San Carlos. Full legal support for foreign buyers. Filter by type, price and size."*
- [x] Internal links to each property detail page (`/properties/[slug]`)
- [x] Page text includes secondary keywords: *Arenal Volcano property*, *Costa Rica land investment*, *foreign buyer Costa Rica*

---

## Accessibility

- Filter chips and dropdowns keyboard-navigable (tab + enter/space)
- All sliders have `aria-label`, `aria-valuemin`, `aria-valuemax`, `aria-valuenow`
- Images have descriptive `alt` text
- Animated elements respect `prefers-reduced-motion`: all transitions set to `0ms` when media query matches
- Color contrast: gold (#C9A24E) on forest (#0d2218) passes WCAG AA for large text

---

## Performance Constraints

- No new npm dependencies for animations (use `tw-animate-css` already installed)
- React components use `client:visible` (Astro partial hydration) — only hydrate when in viewport
- Property images: already on Cloudflare Images CDN, use `/public` variant (already doing this)
- Hero image: `fetchpriority="high"`, no lazy loading
- Total new JS budget: < 8KB gzipped

---

## Out of Scope

- Map view of properties (future)
- Saved favorites / wishlist (future)
- Real-time availability from a CMS (future)
- Mortgage calculator (Option C — rejected: most CR buyers pay cash)
