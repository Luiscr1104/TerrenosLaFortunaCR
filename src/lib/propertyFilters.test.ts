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
