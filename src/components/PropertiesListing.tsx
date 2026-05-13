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
  { value: 'price-asc',  label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
] as const;

// ── helpers ──────────────────────────────────────────────────────────────────
function fmtPrice(price?: number) {
  if (!price) return 'Contact us';
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', maximumFractionDigits: 0,
  }).format(price);
}

// ── Dark editorial card ───────────────────────────────────────────────────────
function DarkCard({ property }: { property: Property }) {
  return (
    <article className="group relative flex flex-col bg-white/[0.04] border border-white/[0.08] rounded-2xl overflow-hidden hover:border-[#C9A24E]/40 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(201,162,78,0.12)] transition-all duration-300 cursor-pointer h-full">
      {/* Full-card link */}
      <a
        href={`/properties/${property.slug}`}
        className="absolute inset-0 z-10"
        aria-label={`View details: ${property.title}`}
      />

      {/* Image — 16:9 */}
      <div className="relative overflow-hidden flex-shrink-0" style={{ aspectRatio: '16/9' }}>
        <img
          src={property.images[0]}
          alt={property.title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />

        {/* Badges row */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2 z-20">
          {property.featured && (
            <span className="bg-[#C9A24E] text-[#0d2218] px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide shadow-lg">
              ⭐ Featured
            </span>
          )}
          <span className="ml-auto inline-flex items-center gap-1 bg-[#0d2218]/80 backdrop-blur-sm border border-[#C9A24E]/30 text-[#C9A24E] text-[10px] font-semibold tracking-[0.16em] uppercase px-2.5 py-1 rounded-full">
            {property.type === 'home' ? '🏠 Home' : '🌳 Land'}
          </span>
        </div>

        {/* Photo count */}
        {property.images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white/75 px-2 py-0.5 rounded-md text-[10px] flex items-center gap-1 z-20">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {property.images.length}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        {/* Location */}
        <p
          className="text-[#C9A24E]/70 text-[10px] font-semibold tracking-[0.22em] uppercase mb-2"
          style={{ fontFamily: 'var(--font-sans, Inter, system-ui)' }}
        >
          📍 {property.location}
        </p>

        {/* Title */}
        <h2
          className="text-white font-bold leading-snug mb-3 line-clamp-2"
          style={{ fontFamily: 'var(--font-display, "Cormorant Garamond", Georgia, serif)', fontSize: '1.2rem' }}
        >
          {property.title}
        </h2>

        {/* Price */}
        <p className="text-white text-2xl font-extrabold mb-3">{fmtPrice(property.price)}</p>

        {/* Specs */}
        <div
          className="flex flex-wrap gap-3 text-xs pb-4 mb-4 border-b border-white/[0.08]"
          style={{ fontFamily: 'var(--font-sans, Inter, system-ui)' }}
        >
          {property.bedrooms  && <span className="text-white/50"><strong className="text-white/75 font-semibold">{property.bedrooms}</strong> Beds</span>}
          {property.bathrooms && <span className="text-white/50"><strong className="text-white/75 font-semibold">{property.bathrooms}</strong> Baths</span>}
          {property.landSize  && <span className="text-white/50"><strong className="text-white/75 font-semibold">{property.landSize}</strong> acres</span>}
          {property.size      && <span className="text-white/50"><strong className="text-white/75 font-semibold">{property.size.toLocaleString()}</strong> m²</span>}
        </div>

        {/* Features — max 2 */}
        <ul className="space-y-1.5 mb-5 flex-1" style={{ fontFamily: 'var(--font-sans, Inter, system-ui)' }}>
          {(property.features ?? []).slice(0, 2).map((f, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-white/55">
              <span className="text-green-400 mt-0.5 flex-shrink-0">✓</span>
              <span className="leading-snug">{f}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <a
          href={`https://wa.me/50684291847?text=Hi!%20I'm%20interested%20in:%20${encodeURIComponent(property.title)}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          className="w-full flex items-center justify-center gap-2 bg-[#C9A24E] hover:brightness-110 active:brightness-95 text-[#0d2218] px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-[0.14em] transition-all duration-200 relative z-20 shadow-[0_4px_16px_rgba(201,162,78,0.25)] hover:shadow-[0_6px_24px_rgba(201,162,78,0.4)]"
          style={{ fontFamily: 'var(--font-sans, Inter, system-ui)' }}
        >
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 001.332 4.993L2 22l5.083-1.334a9.96 9.96 0 004.928 1.317h.004a9.99 9.99 0 009.99-9.982C22.002 6.666 17.522 2 12.012 2zm0 18.288h-.004a8.27 8.27 0 01-4.22-1.157l-.302-.18-3.138.823.838-3.058-.196-.313a8.28 8.28 0 01-1.27-4.417c.002-4.57 3.725-8.287 8.29-8.287 2.214 0 4.295.863 5.86 2.428a8.26 8.26 0 012.433 5.865c-.003 4.568-3.725 8.286-8.29 8.296z" />
          </svg>
          Contact via WhatsApp
        </a>
      </div>
    </article>
  );
}

// ── animation variants ────────────────────────────────────────────────────────
const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

// ── main component ────────────────────────────────────────────────────────────
export default function PropertiesListing({
  properties,
  defaultType,
  noFilters = false,
}: {
  properties: Property[];
  defaultType?: 'all' | 'land' | 'home';
  noFilters?: boolean;
}) {
  const [filters, setFilters] = useState<FilterState>(() => {
    const fromURL = parseFiltersFromURL();
    if (defaultType && defaultType !== 'all' && fromURL.type === 'all') {
      return { ...fromURL, type: defaultType };
    }
    return fromURL;
  });
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

  useEffect(() => {
    const params = filtersToURLParams(filters);
    const qs = params.toString();
    window.history.replaceState({}, '', qs ? `?${qs}` : window.location.pathname);
  }, [filters]);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<Record<string, string>>).detail;
      setFilters(prev => ({
        ...prev,
        ...(detail.type     && { type:       detail.type      as FilterState['type'] }),
        ...(detail.price    && { priceRange: detail.price     as FilterState['priceRange'] }),
        ...(detail.size     && { sizeRange:  detail.size      as FilterState['sizeRange'] }),
        ...(detail.location && { location:   detail.location }),
      }));
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

  const selectCls = "text-xs border border-white/[0.12] rounded-full px-3 py-1.5 bg-white/[0.06] text-white/70 cursor-pointer hover:border-[#C9A24E]/50 outline-none transition-colors appearance-none";

  return (
    <section id="properties-listing" className="bg-[#0d2218] w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 md:py-20">

        {/* ── Filter bar (only on /properties) ─────────────────────── */}
        {!noFilters && (
          <div className="sticky top-[4.5rem] z-30 bg-[#0d2218]/95 backdrop-blur-md border-b border-white/[0.08] -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 mb-12 flex flex-wrap items-center gap-2 md:gap-3">
            {/* Count */}
            <span
              className="text-sm font-semibold text-white/60 mr-auto whitespace-nowrap"
              style={{ fontFamily: 'var(--font-sans, Inter, system-ui)' }}
            >
              {matchCount} {matchCount === 1 ? 'property' : 'properties'}
              {activeFilterCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="ml-2 text-xs text-[#C9A24E] font-bold hover:text-white transition-colors"
                >
                  Clear ×
                </button>
              )}
            </span>

            {/* Category links */}
            {(['all', 'land', 'home'] as const).map(t => {
              const href = t === 'all' ? '/properties' : t === 'land' ? '/lands' : '/homes';
              const label = t === 'all' ? 'All' : t === 'land' ? '🌳 Land' : '🏠 Homes';
              const active = t === 'all' ? filters.type === 'all' : defaultType === t;
              return (
                <a
                  key={t}
                  href={href}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 ${
                    active
                      ? 'bg-[#C9A24E] text-[#0d2218] border-[#C9A24E]'
                      : 'bg-white/[0.06] text-white/70 border-white/[0.12] hover:border-[#C9A24E]/50'
                  }`}
                  style={{ fontFamily: 'var(--font-sans, Inter, system-ui)' }}
                >
                  {label}
                </a>
              );
            })}

            {/* Filters */}
            <select value={filters.priceRange} onChange={e => updateFilter('priceRange', e.target.value as FilterState['priceRange'])} aria-label="Filter by price" className={selectCls}>
              {PRICE_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <select value={filters.sizeRange} onChange={e => updateFilter('sizeRange', e.target.value as FilterState['sizeRange'])} aria-label="Filter by size" className={selectCls}>
              {SIZE_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <select value={filters.location} onChange={e => updateFilter('location', e.target.value)} aria-label="Filter by location" className={selectCls}>
              <option value="all">All areas</option>
              {locations.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <select value={sort} onChange={e => setSort(e.target.value as SortOption)} aria-label="Sort properties" className={selectCls}>
              {SORT_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        )}

        {/* ── Empty state ───────────────────────────────────────────── */}
        {matchCount === 0 && (
          <div className="text-center py-24">
            <p className="text-4xl mb-4">🌿</p>
            <p className="text-white/50 text-lg mb-4" style={{ fontFamily: 'var(--font-sans, Inter, system-ui)' }}>
              No properties match your filters.
            </p>
            <button
              onClick={resetFilters}
              className="text-[#C9A24E] font-semibold text-sm hover:text-white transition-colors"
              style={{ fontFamily: 'var(--font-sans, Inter, system-ui)' }}
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* ── Cards grid ───────────────────────────────────────────── */}
        {matchCount > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedAll.map((property, idx) => {
              const isMatching = matchingIds.has(property.id);
              return (
                <motion.div
                  key={property.id}
                  custom={idx}
                  variants={cardVariants}
                  initial="hidden"
                  animate={
                    isMatching
                      ? 'visible'
                      : ({ opacity: 0.15, scale: 0.97, y: 0, transition: { duration: 0.3 } } as any)
                  }
                  className={!isMatching ? 'pointer-events-none select-none' : ''}
                >
                  <DarkCard property={property} />
                </motion.div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
