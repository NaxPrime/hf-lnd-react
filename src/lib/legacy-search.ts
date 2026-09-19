// Existing sitemap routes remain accessible while their content awaits editorial review.
export const legacyServices = [
  "revenue-management",
  "ota-optimization",
  "hotel-marketing",
  "hotel-consulting",
  "hotel-profitability",
  "revenue-management-for-resorts",
  "revenue-management-for-business-hotels",
  "revenue-management-for-boutique-hotels",
  "revenue-management-for-3-star-hotels",
  "revenue-management-for-4-star-hotels",
  "revenue-management-for-5-star-hotels",
] as const;

const legacyLocations = ["hyderabad", "bangalore", "goa", "chennai", "mumbai"];
export const legacySlugs = legacyServices.flatMap((service) => [
  service,
  ...legacyLocations.map((location) => `${service}-${location}`),
]);

const canonicalDestinations: Record<(typeof legacyServices)[number], string> = {
  "revenue-management": "/services/AssetManagement",
  "ota-optimization": "/services/AdhocConsultation",
  "hotel-marketing": "/services/AdhocConsultation",
  "hotel-consulting": "/",
  "hotel-profitability": "/services/AssetManagement",
  "revenue-management-for-resorts": "/services/AssetManagement",
  "revenue-management-for-business-hotels": "/services/AssetManagement",
  "revenue-management-for-boutique-hotels": "/services/AssetManagement",
  "revenue-management-for-3-star-hotels": "/services/AssetManagement",
  "revenue-management-for-4-star-hotels": "/services/AssetManagement",
  "revenue-management-for-5-star-hotels": "/services/AssetManagement",
};

export function legacyDestination(slug: string): string | undefined {
  const service = legacyServices.find((candidate) =>
    slug === candidate || legacyLocations.some((location) => slug === `${candidate}-${location}`));
  return service ? canonicalDestinations[service] : undefined;
}
