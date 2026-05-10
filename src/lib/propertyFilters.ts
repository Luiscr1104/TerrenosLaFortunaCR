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
