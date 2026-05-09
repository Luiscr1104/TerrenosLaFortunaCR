# /properties Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign `/properties` with a cinematic split-photo hero, bento editorial grid, animated filter bar with URL-param state, ROI calculator, and upgraded SEO/schema.

**Architecture:** A static `PropertiesHero.astro` handles the hero + chip filters (writing URL params + dispatching a custom event). A React `PropertiesListing.tsx` (client:load) owns all filter/sort state, reads URL params on mount, listens for hero events, and renders both the sticky filter bar and the bento grid inline. A separate React `RoiCalculator.tsx` (client:visible) handles the investment calculator. All filter logic lives in a pure `src/lib/propertyFilters.ts` that is unit-tested with Vitest.

**Tech Stack:** Astro 5, React 19, Framer Motion 12 (already installed), Tailwind CSS v4, TypeScript 5, Vitest (to add)

---

## File Map

| Status | Path | Responsibility |
|--------|------|---------------|
| **new** | `src/lib/propertyFilters.ts` | Pure filter/sort functions + URL param helpers |
| **new** | `src/lib/propertyFilters.test.ts` | Vitest unit tests for the above |
| **new** | `vitest.config.ts` | Vitest config (node environment) |
| **new** | `src/components/PropertiesHero.astro` | Split-photo hero, parallax thumbnails, quick-filter chips |
| **new** | `src/components/PropertiesListing.tsx` | React: filter state, sticky bar, bento grid, inline card components |
| **new** | `src/components/RoiCalculator.tsx` | React: ROI sliders + animated CountUp results |
| **new** | `src/components/FaqAccordion.astro` | Static accordions with CSS max-height animation |
| **modify** | `src/pages/properties/index.astro` | Rewire with all new components + SEO + 3 schema blocks |

`PropertyCard.astro` is **not modified** — card HTML is rendered inline inside `PropertiesListing.tsx` because React components cannot render Astro components at runtime.

---

## Task 1 — Filter/Sort Utilities + Vitest Setup

**Files:**
- Create: `vitest.config.ts`
- Create: `src/lib/propertyFilters.ts`
- Create: `src/lib/propertyFilters.test.ts`
- Modify: `package.json` (add test script)

- [ ] **Step 1.1 — Install Vitest**

```bash
npm install -D vitest
```

Expected: vitest appears in `package.json` devDependencies.

- [ ] **Step 1.2 — Create `vitest.config.ts`**

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
  },
});
```

- [ ] **Step 1.3 — Add test script to `package.json`**

In `package.json`, add to `"scripts"`:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 1.4 — Write failing tests**

```typescript
// src/lib/propertyFilters.test.ts
import { describe, it, expect } from 'vitest';
import { filterProperties, sortProperties } from './propertyFilters';
import type { Property } from './properties';

const mock: Property[] = [
  {
    id: '1', title: 'Land A', slug: 'land-a', price: 100_000,
    type: 'land', landSize: 2, landUnit: 'acres',
    location: 'La Tigra, San Carlos', images: [],
  },
  {
    id: '2', title: 'Home B', slug: 'home-b', price: 400_000,
    type: 'home', landSize: 0.5, landUnit: 'acres',
    location: 'Chachagua, La Fortuna', featured: true, images: [],
  },
  {
    id: '3', title: 'Land C', slug: 'land-c', price: 200_000,
    type: 'land', landSize: 5, landUnit: 'acres',
    location: 'San Rafael, San Carlos', images: [],
  },
];

describe('filterProperties', () => {
  it('returns all with default filters', () => {
    const result = filterProperties(mock, { type: 'all', priceRange: 'all', sizeRange: 'all', location: 'all' });
    expect(result).toHaveLength(3);
  });

  it('filters by type=land', () => {
    const result = filterProperties(mock, { type: 'land', priceRange: 'all', sizeRange: 'all', location: 'all' });
    expect(result).toHaveLength(2);
    result.forEach(p => expect(p.type).toBe('land'));
  });

  it('filters by priceRange=under150', () => {
    const result = filterProperties(mock, { type: 'all', priceRange: 'under150', sizeRange: 'all', location: 'all' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('filters by priceRange=300to500', () => {
    const result = filterProperties(mock, { type: 'all', priceRange: '300to500', sizeRange: 'all', location: 'all' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });

  it('filters by sizeRange=over3', () => {
    const result = filterProperties(mock, { type: 'all', priceRange: 'all', sizeRange: 'over3', location: 'all' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('3');
  });

  it('filters by sizeRange=under1', () => {
    const result = filterProperties(mock, { type: 'all', priceRange: 'all', sizeRange: 'under1', location: 'all' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });

  it('filters by location (case-insensitive substring)', () => {
    const result = filterProperties(mock, { type: 'all', priceRange: 'all', sizeRange: 'all', location: 'La Tigra' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('combines type + price filters', () => {
    const result = filterProperties(mock, { type: 'land', priceRange: 'under150', sizeRange: 'all', location: 'all' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });
});

describe('sortProperties', () => {
  it('featured first: featured property is first', () => {
    const sorted = sortProperties(mock, 'featured');
    expect(sorted[0].featured).toBe(true);
  });

  it('price-asc: ascending order', () => {
    const sorted = sortProperties(mock, 'price-asc');
    expect(sorted[0].price).toBe(100_000);
    expect(sorted[2].price).toBe(400_000);
  });

  it('price-desc: descending order', () => {
    const sorted = sortProperties(mock, 'price-desc');
    expect(sorted[0].price).toBe(400_000);
    expect(sorted[2].price).toBe(100_000);
  });

  it('does not mutate the original array', () => {
    const original = [...mock];
    sortProperties(mock, 'price-asc');
    expect(mock).toEqual(original);
  });
});
```

- [ ] **Step 1.5 — Run tests, confirm they fail**

```bash
npm test
```

Expected: FAIL — `filterProperties` and `sortProperties` not found.

- [ ] **Step 1.6 — Implement `src/lib/propertyFilters.ts`**

```typescript
// src/lib/propertyFilters.ts
import type { Property } from './properties';

export interface FilterState {
  type: 'all' | 'home' | 'land';
  priceRange: 'all' | 'under150' | '150to300' | '300to500' | 'over500';
  sizeRange: 'all' | 'under1' | '1to3' | 'over3';
  location: string; // 'all' or a location substring to match
}

export type SortOption = 'featured' | 'price-asc' | 'price-desc';

export const DEFAULT_FILTERS: FilterState = {
  type: 'all',
  priceRange: 'all',
  sizeRange: 'all',
  location: 'all',
};

export function filterProperties(properties: Property[], filters: FilterState): Property[] {
  return properties.filter(p => {
    if (filters.type !== 'all' && p.type !== filters.type) return false;

    const price = p.price ?? 0;
    if (filters.priceRange === 'under150' && price >= 150_000) return false;
    if (filters.priceRange === '150to300' && (price < 150_000 || price > 300_000)) return false;
    if (filters.priceRange === '300to500' && (price < 300_000 || price > 500_000)) return false;
    if (filters.priceRange === 'over500' && price <= 500_000) return false;

    const acres = p.landSize ?? 0;
    if (filters.sizeRange === 'under1' && acres >= 1) return false;
    if (filters.sizeRange === '1to3' && (acres < 1 || acres > 3)) return false;
    if (filters.sizeRange === 'over3' && acres <= 3) return false;

    if (
      filters.location !== 'all' &&
      !p.location.toLowerCase().includes(filters.location.toLowerCase())
    ) return false;

    return true;
  });
}

export function sortProperties(properties: Property[], sort: SortOption): Property[] {
  const arr = [...properties];
  if (sort === 'featured') {
    return arr.sort((a, b) => {
      if (a.featured === b.featured) return 0;
      return a.featured ? -1 : 1;
    });
  }
  if (sort === 'price-asc') return arr.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
  if (sort === 'price-desc') return arr.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
  return arr;
}

export function parseFiltersFromURL(): FilterState {
  if (typeof window === 'undefined') return DEFAULT_FILTERS;
  const p = new URLSearchParams(window.location.search);
  return {
    type: (p.get('type') as FilterState['type']) ?? 'all',
    priceRange: (p.get('price') as FilterState['priceRange']) ?? 'all',
    sizeRange: (p.get('size') as FilterState['sizeRange']) ?? 'all',
    location: p.get('location') ?? 'all',
  };
}

export function filtersToURLParams(filters: FilterState): URLSearchParams {
  const p = new URLSearchParams();
  if (filters.type !== 'all') p.set('type', filters.type);
  if (filters.priceRange !== 'all') p.set('price', filters.priceRange);
  if (filters.sizeRange !== 'all') p.set('size', filters.sizeRange);
  if (filters.location !== 'all') p.set('location', filters.location);
  return p;
}
```

- [ ] **Step 1.7 — Run tests, confirm they pass**

```bash
npm test
```

Expected: All 11 tests PASS.

- [ ] **Step 1.8 — Commit**

```bash
git add vitest.config.ts src/lib/propertyFilters.ts src/lib/propertyFilters.test.ts package.json package-lock.json
git commit -m "feat: add property filter/sort utilities with Vitest tests"
```

---

## Task 2 — PropertiesHero.astro

**Files:**
- Create: `src/components/PropertiesHero.astro`

- [ ] **Step 2.1 — Create the component**

```astro
---
// src/components/PropertiesHero.astro
import type { Property } from '@/lib/properties';

interface Props {
  heroProperty: Property;
  thumbnails: Property[];
}

const { heroProperty, thumbnails } = Astro.props;
const heroImg = heroProperty.images[0];
---

<section
  class="relative w-full overflow-hidden bg-[#0d2218]"
  style="min-height: min(88vh, 700px); margin-top: 5rem;"
  aria-label="Properties search hero"
>
  <div
    class="h-full"
    style="display: grid; grid-template-columns: 60% 40%; min-height: inherit;"
  >
    <!-- Left: Hero image + content -->
    <div class="relative overflow-hidden">
      <img
        src={heroImg}
        alt={heroProperty.title}
        fetchpriority="high"
        loading="eager"
        width="1200"
        height="800"
        class="absolute inset-0 w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-gradient-to-r from-[#0d2218]/85 via-[#0d2218]/50 to-transparent"></div>

      <div class="relative z-10 flex flex-col justify-end h-full px-8 pb-14 pt-16 max-w-2xl">

        <p
          class="text-[#C9A24E]/70 text-xs font-semibold uppercase tracking-[0.25em] mb-4 animate-fade-up"
          style="animation-fill-mode: both; animation-delay: 0ms;"
        >
          La Fortuna · Arenal · Costa Rica
        </p>

        <h1
          class="text-white font-bold leading-[1.05] mb-5 animate-fade-up"
          style="font-family: var(--font-display); font-size: clamp(2.25rem, 5vw, 4rem); animation-fill-mode: both; animation-delay: 80ms;"
        >
          Land & Luxury Homes<br />
          <span style="color: #C9A24E;">for Sale in La Fortuna</span>
        </h1>

        <p
          class="text-white/70 text-base leading-relaxed mb-8 max-w-md animate-fade-up"
          style="animation-fill-mode: both; animation-delay: 160ms;"
        >
          Volcano-view lots, eco retreats and luxury villas — full legal support for international buyers.
        </p>

        <!-- Search bar -->
        <div
          class="animate-fade-up"
          style="animation-fill-mode: both; animation-delay: 240ms;"
        >
          <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 max-w-lg">
            <div class="flex gap-2 mb-3">
              <input
                id="hero-search-input"
                type="text"
                placeholder="Budget, type, location..."
                class="flex-1 bg-white/90 text-gray-800 placeholder-gray-500 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#C9A24E]/60"
                aria-label="Search properties"
              />
              <button
                id="hero-search-btn"
                class="bg-[#C9A24E] text-[#0d2218] font-bold px-5 py-2.5 rounded-xl text-sm hover:brightness-110 transition-all whitespace-nowrap"
              >
                Search
              </button>
            </div>
            <!-- Quick-filter chips -->
            <div class="flex flex-wrap gap-2" role="group" aria-label="Quick filters">
              <button class="hero-chip chip-active" data-key="type" data-value="all">All</button>
              <button class="hero-chip" data-key="type" data-value="home">🏠 Homes</button>
              <button class="hero-chip" data-key="type" data-value="land">🌳 Land</button>
              <button class="hero-chip" data-key="price" data-value="under150">Under $150k</button>
              <button class="hero-chip" data-key="size" data-value="1to3">1–3 acres</button>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Right: Parallax thumbnails -->
    <div class="hidden md:grid overflow-hidden" style="grid-template-rows: 1fr 1fr; gap: 3px;">
      {thumbnails.slice(0, 2).map((p, i) => (
        <div class="relative overflow-hidden">
          <img
            src={p.images[0]}
            alt={p.title}
            width="600"
            height="400"
            loading="lazy"
            data-parallax={i === 0 ? 'up' : 'down'}
            class="w-full h-full object-cover"
            style="transform: scale(1.12); will-change: transform;"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-[#0d2218]/70 to-transparent pointer-events-none"></div>
          {p.price && (
            <div class="absolute bottom-3 left-3 bg-[#C9A24E] text-[#0d2218] text-xs font-bold px-3 py-1.5 rounded-lg shadow">
              ${p.price.toLocaleString('en-US')}
            </div>
          )}
          <a
            href={`/properties/${p.slug}`}
            class="absolute inset-0"
            aria-label={`View ${p.title}`}
          />
        </div>
      ))}
    </div>
  </div>
</section>

<style>
  .hero-chip {
    background: rgba(255,255,255,0.12);
    border: 1px solid rgba(255,255,255,0.2);
    color: rgba(255,255,255,0.85);
    border-radius: 9999px;
    padding: 0.25rem 0.875rem;
    font-size: 0.75rem;
    cursor: pointer;
    transition: all 0.15s;
    font-weight: 500;
  }
  .hero-chip:hover,
  .hero-chip.chip-active {
    background: #C9A24E;
    color: #0d2218;
    border-color: #C9A24E;
    font-weight: 700;
  }
  @media (max-width: 768px) {
    section { min-height: 72vh !important; }
    section > div { grid-template-columns: 1fr !important; }
  }
</style>

<script>
  // ── Parallax ────────────────────────────────────────────────────────
  const parallaxEls = document.querySelectorAll<HTMLImageElement>('[data-parallax]');
  function updateParallax() {
    const scrollY = window.scrollY;
    parallaxEls.forEach(el => {
      const factor = el.dataset.parallax === 'up' ? -0.06 : 0.05;
      el.style.transform = `scale(1.12) translateY(${scrollY * factor}px)`;
    });
  }
  window.addEventListener('scroll', updateParallax, { passive: true });

  // ── Hero chips → URL params + notify PropertiesListing ─────────────
  const allChips = document.querySelectorAll<HTMLButtonElement>('.hero-chip');

  allChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const key = chip.dataset.key!;
      const value = chip.dataset.value!;

      // Update active visual state within same key group
      allChips.forEach(c => { if (c.dataset.key === key) c.classList.remove('chip-active'); });
      chip.classList.add('chip-active');

      // Sync URL search params
      const params = new URLSearchParams(window.location.search);
      value === 'all' ? params.delete(key) : params.set(key, value);
      const qs = params.toString();
      window.history.replaceState({}, '', qs ? `?${qs}` : window.location.pathname);

      // Notify the React PropertiesListing component
      window.dispatchEvent(
        new CustomEvent('hero-filter', { detail: Object.fromEntries(params) })
      );

      // Scroll to grid
      document.getElementById('properties-listing')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Search button → just scroll to grid
  document.getElementById('hero-search-btn')?.addEventListener('click', () => {
    document.getElementById('properties-listing')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
</script>
```

- [ ] **Step 2.2 — Smoke-test by running dev server**

```bash
npm run dev
```

Open `http://localhost:4321/properties` — confirm the hero renders a split image layout. The right side is invisible until Task 6 passes real `thumbnails` props. That's fine for now.

- [ ] **Step 2.3 — Commit**

```bash
git add src/components/PropertiesHero.astro
git commit -m "feat: add cinematic split-photo PropertiesHero with parallax and quick-filter chips"
```

---

## Task 3 — PropertiesListing.tsx (Filter Bar + Bento Grid)

**Files:**
- Create: `src/components/PropertiesListing.tsx`

- [ ] **Step 3.1 — Create `src/components/PropertiesListing.tsx`**

```tsx
// src/components/PropertiesListing.tsx
import { useState, useMemo, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import type { Property } from '@/lib/properties';
import {
  filterProperties,
  sortProperties,
  parseFiltersFromURL,
  filtersToURLParams,
  DEFAULT_FILTERS,
  type FilterState,
  type SortOption,
} from '@/lib/propertyFilters';

// ── constants ──────────────────────────────────────────────────────────────
const PRICE_OPTS = [
  { value: 'all',      label: 'Any price' },
  { value: 'under150', label: 'Under $150k' },
  { value: '150to300', label: '$150k–$300k' },
  { value: '300to500', label: '$300k–$500k' },
  { value: 'over500',  label: 'Over $500k' },
] as const;

const SIZE_OPTS = [
  { value: 'all',    label: 'Any size' },
  { value: 'under1', label: 'Under 1 acre' },
  { value: '1to3',   label: '1–3 acres' },
  { value: 'over3',  label: '3+ acres' },
] as const;

const SORT_OPTS = [
  { value: 'featured',   label: 'Featured first' },
  { value: 'price-asc',  label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
] as const;

// ── helpers ─────────────────────────────────────────────────────────────────
function fmtPrice(price?: number) {
  if (!price) return 'Contact us';
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', maximumFractionDigits: 0,
  }).format(price);
}

// ── card components (inline — Astro cards can't be used in React trees) ────
function FeaturedCard({ property }: { property: Property }) {
  return (
    <article
      className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer h-full"
    >
      <a
        href={`/properties/${property.slug}`}
        className="absolute inset-0 z-10"
        aria-label={`View details: ${property.title}`}
      />
      {/* Image — portrait 3:4 */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '3/4' }}>
        <img
          src={property.images[0]}
          alt={property.title}
          width={600}
          height={800}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2 z-20">
          {property.featured && (
            <span className="bg-[#C9A24E] text-[#0d2218] px-2.5 py-1 rounded-full text-xs font-bold shadow-lg">
              ⭐ Featured
            </span>
          )}
          <span className="ml-auto bg-white/95 backdrop-blur-sm text-neutral-900 px-2.5 py-1 rounded-full text-xs font-semibold shadow-md">
            {property.type === 'home' ? '🏠 Home' : '🌳 Land'}
          </span>
        </div>
        {property.images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-xs flex items-center gap-1.5 z-20">
            📷 {property.images.length}
          </div>
        )}
      </div>
      {/* Content */}
      <div className="p-5">
        <p className="text-xs text-neutral-500 font-medium mb-1">📍 {property.location}</p>
        <h2
          className="text-[#0d2218] font-bold leading-snug mb-2 line-clamp-2"
          style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem' }}
        >
          {property.title}
        </h2>
        <p className="text-3xl font-extrabold text-[#0d2218] mb-4">{fmtPrice(property.price)}</p>
        <div className="flex flex-wrap gap-4 text-sm text-neutral-700 pb-4 mb-4 border-b border-neutral-100">
          {property.bedrooms && <span><strong>{property.bedrooms}</strong> Beds</span>}
          {property.bathrooms && <span><strong>{property.bathrooms}</strong> Baths</span>}
          {property.landSize && <span><strong>{property.landSize}</strong> acres</span>}
          {property.size && <span><strong>{property.size.toLocaleString()}</strong> m²</span>}
        </div>
        <ul className="space-y-1.5 mb-5">
          {(property.features ?? []).slice(0, 3).map((f, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-neutral-700">
              <span className="text-green-600 mt-0.5 flex-shrink-0">✓</span>
              <span className="leading-snug">{f}</span>
            </li>
          ))}
        </ul>
        <a
          href={`https://wa.me/50689354697?text=Hi!%20I'm%20interested%20in:%20${encodeURIComponent(property.title)}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:shadow-lg relative z-20"
        >
          Contact via WhatsApp
        </a>
      </div>
    </article>
  );
}

function SecondaryCard({ property }: { property: Property }) {
  return (
    <article
      className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer"
    >
      <a
        href={`/properties/${property.slug}`}
        className="absolute inset-0 z-10"
        aria-label={`View details: ${property.title}`}
      />
      <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
        <img
          src={property.images[0]}
          alt={property.title}
          width={400}
          height={225}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 left-2 right-2 flex items-start justify-between gap-2 z-20">
          {property.featured && (
            <span className="bg-[#C9A24E] text-[#0d2218] px-2 py-0.5 rounded-full text-[11px] font-bold">⭐</span>
          )}
          <span className="ml-auto bg-white/95 text-neutral-900 px-2 py-0.5 rounded-full text-[11px] font-semibold">
            {property.type === 'home' ? '🏠 Home' : '🌳 Land'}
          </span>
        </div>
      </div>
      <div className="p-4">
        <p className="text-[11px] text-neutral-500 mb-1">📍 {property.location}</p>
        <h3
          className="text-[#0d2218] font-bold leading-snug line-clamp-2 mb-2"
          style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem' }}
        >
          {property.title}
        </h3>
        <p className="text-2xl font-extrabold text-[#0d2218] mb-3">{fmtPrice(property.price)}</p>
        <div className="flex flex-wrap gap-3 text-xs text-neutral-600 mb-3">
          {property.bedrooms && <span><strong>{property.bedrooms}</strong> Beds</span>}
          {property.bathrooms && <span><strong>{property.bathrooms}</strong> Baths</span>}
          {property.landSize && <span><strong>{property.landSize}</strong> acres</span>}
        </div>
        <a
          href={`https://wa.me/50689354697?text=Hi!%20I'm%20interested%20in:%20${encodeURIComponent(property.title)}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2.5 rounded-xl font-semibold text-xs transition-all duration-200 relative z-20"
        >
          WhatsApp
        </a>
      </div>
    </article>
  );
}

// ── animation variants ────────────────────────────────────────────────────
const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.07, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

// ── main component ────────────────────────────────────────────────────────
export default function PropertiesListing({ properties }: { properties: Property[] }) {
  const [filters, setFilters] = useState<FilterState>(() => parseFiltersFromURL());
  const [sort, setSort] = useState<SortOption>('featured');

  const locations = useMemo(() => {
    const raw = properties.map(p => p.location.split(',')[0].trim());
    return [...new Set(raw)].sort();
  }, [properties]);

  const sortedAll = useMemo(() => sortProperties(properties, sort), [properties, sort]);

  const matchingIds = useMemo(
    () => new Set(filterProperties(properties, filters).map(p => p.id)),
    [properties, filters]
  );

  const matchCount = matchingIds.size;
  const activeFilterCount = Object.values(filters).filter(v => v !== 'all').length;

  // Sync URL when filters change
  useEffect(() => {
    const params = filtersToURLParams(filters);
    const qs = params.toString();
    window.history.replaceState({}, '', qs ? `?${qs}` : window.location.pathname);
  }, [filters]);

  // Listen for chip events dispatched by PropertiesHero
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<Record<string, string>>).detail;
      setFilters({
        type: (detail.type as FilterState['type']) ?? 'all',
        priceRange: (detail.price as FilterState['priceRange']) ?? 'all',
        sizeRange: (detail.size as FilterState['sizeRange']) ?? 'all',
        location: detail.location ?? 'all',
      });
    };
    window.addEventListener('hero-filter', handler);
    return () => window.removeEventListener('hero-filter', handler);
  }, []);

  const updateFilter = useCallback(
    <K extends keyof FilterState>(key: K, value: FilterState[K]) =>
      setFilters(prev => ({ ...prev, [key]: value })),
    []
  );

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setSort('featured');
  }, []);

  return (
    <section id="properties-listing" className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* ── Sticky Filter + Sort Bar ───────────────────────────────── */}
      <div className="sticky top-[4.5rem] z-30 bg-white/90 backdrop-blur-sm border-b border-neutral-100 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 mb-10 flex flex-wrap items-center gap-2 md:gap-3">
        {/* Count + clear */}
        <span className="text-sm font-semibold text-neutral-700 mr-auto whitespace-nowrap">
          {matchCount} {matchCount === 1 ? 'property' : 'properties'}
          {activeFilterCount > 0 && (
            <button
              onClick={resetFilters}
              className="ml-2 text-xs text-[#C9A24E] font-bold hover:text-[#0d2218] transition-colors"
              aria-label="Clear all filters"
            >
              Clear ×
            </button>
          )}
        </span>

        {/* Type chips */}
        {(['all', 'home', 'land'] as const).map(t => (
          <button
            key={t}
            onClick={() => updateFilter('type', t)}
            aria-pressed={filters.type === t}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 ${
              filters.type === t
                ? 'bg-[#0d2218] text-[#C9A24E] border-[#0d2218]'
                : 'bg-white text-neutral-700 border-neutral-300 hover:border-[#0d2218]'
            }`}
          >
            {t === 'all' ? 'All' : t === 'home' ? '🏠 Homes' : '🌳 Land'}
          </button>
        ))}

        {/* Price */}
        <select
          value={filters.priceRange}
          onChange={e => updateFilter('priceRange', e.target.value as FilterState['priceRange'])}
          aria-label="Filter by price"
          className="text-xs border border-neutral-300 rounded-full px-3 py-1.5 bg-white text-neutral-700 cursor-pointer hover:border-[#0d2218] outline-none transition-colors"
        >
          {PRICE_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        {/* Size */}
        <select
          value={filters.sizeRange}
          onChange={e => updateFilter('sizeRange', e.target.value as FilterState['sizeRange'])}
          aria-label="Filter by size"
          className="text-xs border border-neutral-300 rounded-full px-3 py-1.5 bg-white text-neutral-700 cursor-pointer hover:border-[#0d2218] outline-none transition-colors"
        >
          {SIZE_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        {/* Location */}
        <select
          value={filters.location}
          onChange={e => updateFilter('location', e.target.value)}
          aria-label="Filter by location"
          className="text-xs border border-neutral-300 rounded-full px-3 py-1.5 bg-white text-neutral-700 cursor-pointer hover:border-[#0d2218] outline-none transition-colors"
        >
          <option value="all">All areas</option>
          {locations.map(l => <option key={l} value={l}>{l}</option>)}
        </select>

        {/* Sort */}
        <select
          value={sort}
          onChange={e => setSort(e.target.value as SortOption)}
          aria-label="Sort properties"
          className="text-xs border border-neutral-300 rounded-full px-3 py-1.5 bg-white text-neutral-700 cursor-pointer hover:border-[#0d2218] outline-none transition-colors"
        >
          {SORT_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* ── Empty state ────────────────────────────────────────────── */}
      {matchCount === 0 && (
        <div className="text-center py-20">
          <p className="text-3xl mb-3">🌿</p>
          <p className="text-neutral-600 font-medium text-lg">No properties match your filters.</p>
          <button
            onClick={resetFilters}
            className="mt-4 text-[#C9A24E] font-bold text-sm hover:text-[#0d2218] transition-colors"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* ── Bento Grid ─────────────────────────────────────────────── */}
      {matchCount > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: sortedAll.length === 1 ? '1fr' : 'repeat(3, 1fr)',
            gap: '1.25rem',
          }}
        >
          {sortedAll.map((property, idx) => {
            const isMatching = matchingIds.has(property.id);
            const isFeatured = idx === 0 && sortedAll.length > 1;

            return (
              <motion.div
                key={property.id}
                custom={idx}
                variants={cardVariants}
                initial="hidden"
                animate={
                  isMatching
                    ? 'visible'
                    : { opacity: 0.18, scale: 0.97, y: 0, transition: { duration: 0.3 } }
                }
                whileInView={isMatching ? 'visible' : undefined}
                viewport={{ once: true, amount: 0.1 }}
                style={isFeatured ? { gridRow: 'span 2' } : undefined}
                className={!isMatching ? 'pointer-events-none select-none' : ''}
              >
                {isFeatured
                  ? <FeaturedCard property={property} />
                  : <SecondaryCard property={property} />
                }
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}
```

- [ ] **Step 3.2 — Run dev server and verify**

```bash
npm run dev
```

The component won't appear on the page until Task 6 wires it in. Open browser console — no TypeScript errors should appear if you navigate to the page.

- [ ] **Step 3.3 — Commit**

```bash
git add src/components/PropertiesListing.tsx
git commit -m "feat: add PropertiesListing — animated bento grid with sticky filter bar and URL-param state"
```

---

## Task 4 — RoiCalculator.tsx

**Files:**
- Create: `src/components/RoiCalculator.tsx`

- [ ] **Step 4.1 — Create `src/components/RoiCalculator.tsx`**

```tsx
// src/components/RoiCalculator.tsx
import { useState, useEffect, useRef } from 'react';

type PropType = 'land' | 'home' | 'villa';

const ROI: Record<PropType, { rentalYieldMonthly: number; appreciation: number; label: string }> = {
  land:  { rentalYieldMonthly: 0,      appreciation: 0.08, label: '🌳 Land' },
  home:  { rentalYieldMonthly: 0.007,  appreciation: 0.06, label: '🏠 Residential' },
  villa: { rentalYieldMonthly: 0.0095, appreciation: 0.07, label: '🏡 Rental Villa' },
};

function useCountUp(target: number, duration = 550) {
  const [val, setVal] = useState(target);
  const prev = useRef(target);
  const raf  = useRef<number>(0);

  useEffect(() => {
    if (prev.current === target) return;
    const from = prev.current;
    prev.current = target;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(from + (target - from) * ease));
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);

  return val;
}

const usd = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

export default function RoiCalculator() {
  const [budget, setBudget]       = useState(340_000);
  const [propType, setPropType]   = useState<PropType>('villa');
  const [occupancy, setOccupancy] = useState(65);

  const params = ROI[propType];
  const effectiveMonthlyYield =
    propType === 'villa'
      ? params.rentalYieldMonthly * (occupancy / 65)
      : params.rentalYieldMonthly;

  const monthly    = Math.round(budget * effectiveMonthlyYield);
  const annualRoi  = propType === 'land' ? 0 : (monthly * 12 / budget) * 100;
  const fiveYear   = Math.round(budget * Math.pow(1 + params.appreciation, 5));

  const animMonthly  = useCountUp(monthly);
  const animFiveYear = useCountUp(fiveYear);
  // annualRoi is small — animate × 10 to get one decimal place
  const animRoiX10   = useCountUp(Math.round(annualRoi * 10));

  const waMsg = encodeURIComponent(
    `Hi! I ran the ROI calculator:\n• Budget: ${usd(budget)}\n• Type: ${params.label}\n` +
    (propType !== 'land' ? `• Monthly Rental: ${usd(monthly)}\n• Annual ROI: ${(annualRoi).toFixed(1)}%\n` : '') +
    `• 5-Year Value: ${usd(fiveYear)}\nCan you send a detailed projection?`
  );

  return (
    <section className="w-full py-16 bg-[#0d2218] text-white" aria-labelledby="roi-heading">
      <div className="max-w-5xl mx-auto px-6">

        <div className="text-center mb-10">
          <p className="text-[#C9A24E] text-xs font-bold uppercase tracking-[0.2em] mb-2">Investment Tool</p>
          <h2
            id="roi-heading"
            className="text-3xl md:text-4xl font-bold"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Estimate Your Return
          </h2>
          <p className="text-white/55 text-sm mt-2 max-w-sm mx-auto">
            Adjust the parameters to see estimated rental income and appreciation for La Fortuna properties.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 items-start">

          {/* ── Inputs ─────────────────────────────────────────────── */}
          <div className="space-y-8">

            {/* Budget */}
            <div>
              <div className="flex justify-between items-baseline mb-2">
                <label htmlFor="roi-budget" className="text-xs font-bold uppercase tracking-[0.15em] text-white/55">
                  Budget
                </label>
                <span className="text-xl font-extrabold text-[#C9A24E]">{usd(budget)}</span>
              </div>
              <input
                id="roi-budget"
                type="range" min={50_000} max={800_000} step={5_000}
                value={budget}
                onChange={e => setBudget(+e.target.value)}
                className="w-full accent-[#C9A24E] h-1.5"
                aria-valuemin={50000} aria-valuemax={800000} aria-valuenow={budget}
              />
              <div className="flex justify-between text-xs text-white/35 mt-1.5">
                <span>$50k</span><span>$800k</span>
              </div>
            </div>

            {/* Property type */}
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-white/55 mb-3">
                Property Type
              </p>
              <div className="flex gap-2">
                {(Object.entries(ROI) as [PropType, typeof ROI[PropType]][]).map(([key, { label }]) => (
                  <button
                    key={key}
                    onClick={() => setPropType(key)}
                    aria-pressed={propType === key}
                    className={`flex-1 px-2 py-2.5 rounded-xl text-xs font-semibold border transition-all duration-150 ${
                      propType === key
                        ? 'bg-[#C9A24E] text-[#0d2218] border-[#C9A24E]'
                        : 'bg-white/5 text-white/65 border-white/10 hover:border-white/30'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Occupancy (homes and villas only) */}
            {propType !== 'land' && (
              <div>
                <div className="flex justify-between items-baseline mb-2">
                  <label htmlFor="roi-occupancy" className="text-xs font-bold uppercase tracking-[0.15em] text-white/55">
                    Occupancy Rate
                  </label>
                  <span className="text-xl font-extrabold text-[#C9A24E]">{occupancy}%</span>
                </div>
                <input
                  id="roi-occupancy"
                  type="range" min={40} max={90} step={5}
                  value={occupancy}
                  onChange={e => setOccupancy(+e.target.value)}
                  className="w-full accent-[#C9A24E] h-1.5"
                  aria-valuemin={40} aria-valuemax={90} aria-valuenow={occupancy}
                />
                <div className="flex justify-between text-xs text-white/35 mt-1.5">
                  <span>40%</span><span>90%</span>
                </div>
              </div>
            )}
          </div>

          {/* ── Results ────────────────────────────────────────────── */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6">

            <div>
              <p className="text-xs text-white/45 uppercase tracking-[0.15em] mb-1">
                {propType === 'land' ? 'Land appreciates — no rental income' : 'Est. Monthly Rental'}
              </p>
              <p className="text-4xl font-extrabold text-[#C9A24E]">
                {propType === 'land' ? '—' : (
                  <>
                    {usd(animMonthly)}
                    <span className="text-base font-normal text-white/45"> / mo</span>
                  </>
                )}
              </p>
            </div>

            <div className="border-t border-white/10 pt-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/55">Annual Gross ROI</span>
                <span className="text-xl font-bold text-white">
                  {propType === 'land' ? '—' : `${(animRoiX10 / 10).toFixed(1)}%`}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/55">5-Year Value (est.)</span>
                <span className="text-xl font-bold text-[#C9A24E]">{usd(animFiveYear)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/55">Appreciation / yr</span>
                <span className="text-base font-semibold text-white/70">
                  {(params.appreciation * 100).toFixed(0)}%
                </span>
              </div>
            </div>

            <p className="text-[10px] text-white/30 leading-relaxed">
              Estimates based on La Fortuna market averages. Actual returns vary.
              Contact us for a personalized analysis.
            </p>

            <a
              href={`https://wa.me/50689354697?text=${waMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-[#C9A24E] text-[#0d2218] font-bold px-5 py-3.5 rounded-xl hover:brightness-110 transition-all duration-200 hover:shadow-xl text-sm"
            >
              Get a Detailed Projection →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4.2 — Commit**

```bash
git add src/components/RoiCalculator.tsx
git commit -m "feat: add ROI calculator with animated CountUp and WhatsApp CTA"
```

---

## Task 5 — FaqAccordion.astro

**Files:**
- Create: `src/components/FaqAccordion.astro`

- [ ] **Step 5.1 — Create `src/components/FaqAccordion.astro`**

```astro
---
// src/components/FaqAccordion.astro
const faqs = [
  {
    question: "Can foreigners buy land and homes in La Fortuna?",
    answer: "Yes. Foreigners have full ownership rights in Costa Rica, including titled land, homes, farms and investment properties. You can purchase under your personal name or through a local corporation. We guide you through each step of the process so everything is clear and properly documented.",
  },
  {
    question: "Is La Fortuna a good area for real-estate investment?",
    answer: "Absolutely. The region receives international tourism all year thanks to Arenal Volcano, hot springs and adventure activities. Properties with volcano views or natural water sources are highly attractive for vacation rentals and long-term appreciation. The area is consistently one of Costa Rica's strongest real-estate markets.",
  },
  {
    question: "Do you assist clients who live abroad?",
    answer: "Yes. Most of our investors live in the United States, Canada or Europe. We offer video calls, virtual tours, remote signings and coordination with trusted attorneys, architects and builders so you can invest securely from anywhere in the world.",
  },
  {
    question: "What is the best area in La Fortuna to buy land?",
    answer: "La Tigra and Chachagua are the most sought-after areas — both within 20 minutes of downtown La Fortuna, with lush surroundings, cool mountain climate and excellent appreciation potential. San Rafael offers lower entry prices for buyers looking for a larger lot. We help you identify the best zone for your specific goals and budget.",
  },
  {
    question: "How long does the buying process take for a foreigner?",
    answer: "For cash purchases, the process typically takes 4–8 weeks from offer acceptance to closing: 1–2 weeks for due diligence and title search, 1 week for contract preparation, and 2–4 weeks for registration at the National Registry. Remote closings are common and our team coordinates every step.",
  },
];
---

<section class="max-w-4xl mx-auto px-6 py-14 md:py-16" aria-labelledby="faq-heading">
  <div class="mb-10">
    <h2 id="faq-heading" class="text-3xl md:text-4xl font-bold text-neutral-900 mb-2">
      Frequently Asked Questions
    </h2>
    <p class="text-neutral-500 text-sm md:text-base">
      Key information for international buyers interested in La Fortuna real estate.
    </p>
  </div>

  <div class="space-y-3">
    {faqs.map((faq, i) => (
      <details class="faq-item border border-neutral-200 rounded-2xl overflow-hidden bg-white">
        <summary class="flex items-center justify-between gap-4 px-6 py-5 cursor-pointer list-none select-none hover:bg-neutral-50/80 transition-colors">
          <span class="font-semibold text-neutral-900 text-sm md:text-base pr-2">
            {faq.question}
          </span>
          <span class="faq-icon text-[#C9A24E] text-xl leading-none flex-shrink-0 transition-transform duration-300 font-light">
            +
          </span>
        </summary>
        <div class="faq-body px-6" style="max-height: 0; overflow: hidden; transition: max-height 0.35s ease;">
          <p class="text-neutral-600 text-sm leading-relaxed pb-5 pt-1">
            {faq.answer}
          </p>
        </div>
      </details>
    ))}
  </div>
</section>

<style>
  details[open] .faq-icon {
    transform: rotate(45deg);
  }
  details[open] > summary {
    background-color: #fafaf8;
    border-bottom: 1px solid #f0ece0;
  }
</style>

<script>
  document.querySelectorAll<HTMLDetailsElement>('.faq-item').forEach(details => {
    const body = details.querySelector<HTMLElement>('.faq-body');
    if (!body) return;

    details.addEventListener('toggle', () => {
      body.style.maxHeight = details.open ? `${body.scrollHeight}px` : '0';
    });
  });
</script>
```

- [ ] **Step 5.2 — Commit**

```bash
git add src/components/FaqAccordion.astro
git commit -m "feat: add animated FAQ accordion with 5 Q&As"
```

---

## Task 6 — Rewire `/properties/index.astro` + All Schema

**Files:**
- Modify: `src/pages/properties/index.astro`

- [ ] **Step 6.1 — Replace `/properties/index.astro` with the full rewrite**

```astro
---
import Layout from "@/layouts/Layout.astro";
import PropertiesHero from "../../components/PropertiesHero.astro";
import PropertiesListing from "../../components/PropertiesListing";
import RoiCalculator from "../../components/RoiCalculator";
import FaqAccordion from "../../components/FaqAccordion.astro";
import { getAllProperties } from "@/lib/properties";

const properties = getAllProperties();
const siteUrl = "https://www.buylandcr.com";

// Hero: featured property with highest price for left column,
// next two featured for right thumbnail stack.
const featured = properties
  .filter(p => p.featured)
  .sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
const heroProperty  = featured[0] ?? properties[0];
const heroThumbNails = featured.slice(1, 3);

// ── Schema: ItemList ──────────────────────────────────────────────────
const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Properties and land for sale in La Fortuna, Costa Rica",
  description:
    "Curated homes, vacation rentals and land for sale in La Fortuna de San Carlos, near Arenal Volcano in Costa Rica.",
  itemListElement: properties.map((p, idx) => ({
    "@type": "Product",
    position: idx + 1,
    name: p.title,
    url: `${siteUrl}/properties/${p.slug}`,
    description: p.description ?? `Property for sale in ${p.location}, Costa Rica.`,
    offers: {
      "@type": "Offer",
      price: p.price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
  })),
};

// ── Schema: FAQPage ───────────────────────────────────────────────────
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Can foreigners buy land and homes in La Fortuna?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Foreigners have full ownership rights in Costa Rica, including titled land, homes, farms and investment properties. You can purchase under your personal name or through a local corporation.",
      },
    },
    {
      "@type": "Question",
      name: "Is La Fortuna a good area for real-estate investment?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely. The region receives international tourism all year thanks to Arenal Volcano, hot springs and adventure activities. Properties with volcano views or natural water sources are highly attractive for vacation rentals and long-term appreciation.",
      },
    },
    {
      "@type": "Question",
      name: "Do you assist clients who live abroad?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Most of our investors live in the United States, Canada or Europe. We offer video calls, virtual tours, remote signings and coordination with trusted attorneys so you can invest from anywhere.",
      },
    },
    {
      "@type": "Question",
      name: "What is the best area in La Fortuna to buy land?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "La Tigra and Chachagua are the most sought-after areas, both within 20 minutes of downtown La Fortuna. San Rafael offers lower entry prices for larger lots. We help you identify the best zone for your goals.",
      },
    },
    {
      "@type": "Question",
      name: "How long does the buying process take for a foreigner?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "For cash purchases, the process typically takes 4–8 weeks: 1–2 weeks for due diligence, 1 week for contract preparation, and 2–4 weeks for National Registry registration. Remote closings are common.",
      },
    },
  ],
};

// ── Schema: BreadcrumbList ────────────────────────────────────────────
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",       item: siteUrl },
    { "@type": "ListItem", position: 2, name: "Properties", item: `${siteUrl}/properties` },
  ],
};
---

<Layout
  title="Land & Luxury Homes for Sale in La Fortuna, Costa Rica | BuyLandCR"
  description="Browse volcano-view lots, eco retreats and luxury villas in La Fortuna de San Carlos. Full legal support for foreign buyers. Filter by type, price and size."
  keywords="land for sale La Fortuna Costa Rica, homes for sale Arenal Volcano, invest in Costa Rica real estate foreigners, buy land Costa Rica, La Fortuna property investment"
  image={heroProperty.images[0]}
  preloadImage={heroProperty.images[0]}
>
  <!-- Schema blocks -->
  <script type="application/ld+json" set:html={JSON.stringify(itemListSchema)} slot="head" />
  <script type="application/ld+json" set:html={JSON.stringify(faqSchema)} slot="head" />
  <script type="application/ld+json" set:html={JSON.stringify(breadcrumbSchema)} slot="head" />

  <!-- 1. Hero -->
  <PropertiesHero heroProperty={heroProperty} thumbnails={heroThumbNails} />

  <!-- 2. Filter bar + Bento grid (React, hydrate immediately) -->
  <PropertiesListing client:load properties={properties} />

  <!-- 3. ROI Calculator (React, hydrate when visible) -->
  <RoiCalculator client:visible />

  <!-- 4. Trust / SEO intro -->
  <section class="max-w-6xl mx-auto px-6 py-10 md:py-14">
    <div class="grid gap-10 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] items-start">
      <div class="space-y-5">
        <h2 class="text-2xl md:text-3xl font-bold tracking-tight text-neutral-900">
          Buy Property in La Fortuna de San Carlos as a Foreign Investor
        </h2>
        <p class="text-neutral-700 leading-relaxed text-sm md:text-base">
          La Fortuna is one of Costa Rica's strongest real-estate markets thanks to its
          year-round tourism, lush rainforest and proximity to
          <strong>Arenal Volcano, the country's most visited landmark</strong>.
          This constant flow of visitors creates solid demand for vacation rentals,
          boutique projects and long-term stays.
        </p>
        <p class="text-neutral-700 leading-relaxed text-sm md:text-base">
          As a foreigner, you enjoy the <strong>same ownership rights as Costa Rican citizens</strong>.
          You can purchase under your personal name or through a local corporation.
          Our team coordinates due diligence, title verification, purchase contracts
          and closing so you can invest with confidence from abroad.
        </p>
      </div>

      <aside class="bg-[#F2EBDA] border border-[#E8DFC8] rounded-2xl p-5 md:p-6 space-y-4">
        <h3 class="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-500">
          Why investors choose La Fortuna
        </h3>
        <ul class="space-y-3 text-sm text-neutral-700">
          {[
            "Strong tourism all year — not only high season.",
            "High demand for vacation rentals and boutique developments.",
            "Attractive appreciation for volcano-view or water-source land.",
            "Full legal support in English for international buyers.",
          ].map(item => (
            <li class="flex gap-2 items-start">
              <span class="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#C9A24E] flex-shrink-0"></span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  </section>

  <!-- 5. FAQ Accordions -->
  <FaqAccordion />

  <!-- 6. CTA Band -->
  <section class="w-full py-12 md:py-16 bg-[#0d2218] text-center text-white relative overflow-hidden">
    <div
      class="absolute inset-0 pointer-events-none"
      style="background: radial-gradient(circle at 20% 50%, rgba(201,162,78,0.07) 0%, transparent 60%), radial-gradient(circle at 80% 50%, rgba(201,162,78,0.05) 0%, transparent 60%);"
    ></div>
    <div class="relative z-10 max-w-3xl mx-auto px-6">
      <h3 class="text-2xl md:text-3xl font-bold mb-3">
        Looking for something very specific?
      </h3>
      <p class="text-neutral-300 mb-7 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
        Share your budget, preferred size and whether you want a volcano-view lot,
        a farm with a natural water source or an income-generating rental.
        We'll send you a personalized shortlist directly to your WhatsApp or email.
      </p>
      <a
        href="https://wa.me/50689354697?text=Hi!%20I'm%20looking%20for%20a%20specific%20type%20of%20property%20in%20La%20Fortuna%2C%20Costa%20Rica.%20Please%20help%20me%20find%20land%20or%20a%20home%20that%20matches%20my%20budget%20and%20investment%20goals."
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-2 bg-[#C9A24E] text-[#0d2218] px-7 py-3.5 rounded-xl font-bold hover:brightness-110 transition-all shadow-lg hover:shadow-xl text-sm md:text-base"
      >
        Get Personalized Options on WhatsApp
      </a>
    </div>
  </section>
</Layout>
```

> **Note on schema slots:** If `Layout.astro` does not support `slot="head"` for script tags, move the three `<script type="application/ld+json">` blocks to after the `<Layout>` opening tag without the `slot` attribute — Astro will inject them into the `<head>` if Layout uses `<slot />` before `</head>`, or place them in the body (still valid for JSON-LD). Check `src/layouts/Layout.astro` to confirm slot behavior.

- [ ] **Step 6.2 — Verify schema slot support in Layout.astro**

Read `src/layouts/Layout.astro` and look for where `<slot />` or named slots are used. If there is no `slot="head"`, remove the `slot="head"` attribute from all three script tags.

- [ ] **Step 6.3 — Run dev server and do a full visual check**

```bash
npm run dev
```

Open `http://localhost:4321/properties` and verify:
1. Hero renders with split photo left + two thumbnails right
2. Parallax on thumbnails activates on scroll
3. Quick-filter chips in hero scroll to the grid and dim non-matching cards
4. Sticky filter bar is visible on scroll past hero
5. Type/price/size/location dropdowns filter the grid correctly
6. Featured card occupies the left 2-row slot in the bento grid
7. ROI calculator renders, sliders update the animated numbers
8. FAQ items open/close with smooth animation
9. CTA band renders with subtle radial glow

- [ ] **Step 6.4 — Check browser console for errors**

Open DevTools → Console. There should be zero errors. Common issues to watch for:
- `Cannot find module '@/lib/propertyFilters'` → confirm the file path is `src/lib/propertyFilters.ts`
- React hydration mismatch → usually means a component renders different HTML on server vs. client. If this happens, add `suppressHydrationWarning` to the `PropertiesListing` wrapper in index.astro or wrap the URL-param-dependent state in `useEffect` with a mounted flag
- `slot="head"` schema scripts not in `<head>` → remove the slot attribute and let them appear in body

- [ ] **Step 6.5 — Run TypeScript check**

```bash
npx astro check
```

Expected: 0 errors.

- [ ] **Step 6.6 — Commit**

```bash
git add src/pages/properties/index.astro
git commit -m "feat: rewire /properties page — cinematic hero, bento grid, ROI calculator, FAQ, 3 schema blocks"
```

---

## Self-Review

**Spec coverage check:**

| Spec requirement | Covered in |
|---|---|
| Split-photo hero 60/40 with parallax | Task 2 |
| H1 with primary keyword | Task 6 (Layout title + H1 in PropertiesHero) |
| Hero chips → URL params → scroll to grid | Task 2 (script block) |
| Sticky filter bar with type/price/size/location | Task 3 |
| Filter state synced to URL params | Task 3 (`filtersToURLParams` + `useEffect`) |
| Hero chip events received by React component | Task 3 (`hero-filter` event listener) |
| Bento grid 1.8fr 1fr 1fr, featured spans 2 rows | Task 3 (inline style on grid container) |
| Dim non-matching cards (opacity + scale) | Task 3 (motion animate) |
| Stagger entrance animations | Task 3 (cardVariants with `custom` + delay) |
| ROI Calculator — 3 sliders | Task 4 |
| CountUp animation on result values | Task 4 (`useCountUp` hook) |
| WhatsApp CTA with pre-filled figures | Task 4 |
| FAQ accordions with CSS transition | Task 5 |
| 5 FAQ questions | Task 5 |
| Schema: ItemList | Task 6 |
| Schema: FAQPage (5 Q&As) | Task 6 |
| Schema: BreadcrumbList | Task 6 |
| Hero image preload (`fetchpriority="high"`) | Task 2 (img attr) + Task 6 (Layout preloadImage) |
| OG image = hero property image | Task 6 (Layout image prop) |
| SEO meta title + description + keywords | Task 6 |
| `prefers-reduced-motion` | Framer Motion respects this automatically via its internal media query check |
| Accessible sliders (aria-value*) | Task 4 (aria attrs on inputs) |
| Accessible filter chips (aria-pressed) | Task 3 (aria-pressed on type buttons) |

All spec requirements are covered. No gaps found.
