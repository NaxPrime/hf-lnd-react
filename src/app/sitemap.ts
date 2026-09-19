import type { MetadataRoute } from "next";
import { SITE_URL, searchPages } from "@/lib/search";
import { getInsights, getResources, isApproved } from "@/lib/owner-content";

export default function sitemap(): MetadataRoute.Sitemap {
  const approvedGuides = getInsights().filter(isApproved);
  const approvedResources = getResources().filter(isApproved);
  return [
    ...searchPages.map((page) => ({ url: SITE_URL + page.path })),
    ...(approvedGuides.length ? [{ url: SITE_URL + "/insights" }] : []),
    ...approvedGuides.map((guide) => ({
      url: SITE_URL + "/insights/" + guide.slug,
      lastModified: guide.reviewedAt,
    })),
    ...(approvedResources.length ? [{ url: SITE_URL + "/resources" }] : []),
    ...approvedResources.map((resource) => ({
      url: SITE_URL + resource.route,
      lastModified: resource.reviewedAt,
    })),
  ];
}
