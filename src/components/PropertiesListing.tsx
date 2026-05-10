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
            gridTemplateColumns: sortedAll.length === 1 ? '1fr' : '1.8fr 1fr 1fr',
            gap: '1.5rem',
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
                    : { opacity: 0.18, scale: 0.97, y: 0, transition: { duration: 0.3 } } as any
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
