// src/lib/properties.ts
export type SizeUnit = "sqm" | "sqft" | "acres";
export type PropType = "home" | "land";

export interface Property {
  id: string;
  title: string;
  slug: string;            // usaremos el slug para la URL
  price?: number;          // USD
  type: PropType;
  bedrooms?: number;
  bathrooms?: number;
  size?: number;           // numérico
  sizeUnit?: SizeUnit;
  landSize?: number;       // si aplica
  landUnit?: SizeUnit;
  location: string;
  featured?: boolean;
  images: string[];
  features?: string[];
  description?: string;
}

import data from "@/data/properties.json"; // import JSON estático
const ALL = data as Property[];

export function getAllProperties(): Property[] {
  return ALL;
}

export function getPropertyBySlug(slug: string): Property | null {
  return ALL.find(p => p.slug === slug) ?? null;
}

// Helpers de visualización
export function formatPriceUSD(value?: number): string {
  if (!value && value !== 0) return "";
  return `$${value.toLocaleString("en-US")}`;
}

export function formatMeasure(value?: number, unit?: SizeUnit): string {
  if (value == null || !unit) return "";
  const u =
    unit === "sqm" ? "m²" :
    unit === "sqft" ? "sqft" :
    unit === "acres" ? "acres" : unit;
  return `${value.toLocaleString()} ${u}`;
}
