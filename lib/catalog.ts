export const FALLBACK_CATEGORY = "Misc";

export const DEFAULT_CATEGORIES = [
  "Beds",
  "Seating",
  "Tables",
  "Storage",
  "Decor & Finishing",
  "Materials",
  "Tools & Hardware",
  "Furniture",
  FALLBACK_CATEGORY,
] as const;

export type CatalogContentType = "REEL" | "POST" | "VIDEO";
