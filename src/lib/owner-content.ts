import { readdirSync, readFileSync, existsSync } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import resourceData from "@/Content/owner-resources.json";
import { ORGANIZATION_ID, SITE_URL } from "@/lib/search";

export type DecisionStep = { title: string; detail: string };
export type Insight = {
  id: string;
  slug: string;
  title: string;
  description: string;
  pillar: string;
  servicePath: string;
  audience: string;
  answer: string;
  sections: { heading: string; paragraphs: string[]; bullets?: string[] }[];
  decisionSteps: DecisionStep[];
  checklist: string[];
  limitations: string;
  relatedIds: string[];
  reviewStatus: "editorial-draft" | "approved";
  reviewedBy?: string;
  reviewedAt?: string;
};

export type OwnerResource = {
  id: string;
  slug: string;
  title: string;
  route: string;
  service: string;
  purpose: string;
  answer: string;
  sections: [string, string][];
  columns: string[];
  rows: string[][];
  review: string;
  reviewStatus: "editorial-draft" | "approved";
  reviewedBy?: string;
  reviewedAt?: string;
};

export const resources = resourceData as OwnerResource[];
const servicePaths = new Set([
  "/services/BrandSelection", "/services/BusinessIntelligence", "/services/AssetManagement",
  "/services/MysteryAudit", "/services/AdhocConsultation",
]);

export function localServicePath(value: string): string {
  const url = new URL(value, SITE_URL);
  if (url.origin !== SITE_URL || !servicePaths.has(url.pathname)) {
    throw new Error(`Invalid owner service destination: ${value}`);
  }
  return url.pathname;
}

export function getInsights(): Insight[] {
  const directory = path.join(process.cwd(), "src", "Content", "insights");
  if (!existsSync(directory)) return [];
  const entries = readdirSync(directory).filter((file) => file.endsWith(".json")).map((file) => {
    const guide = JSON.parse(readFileSync(path.join(directory, file), "utf8")) as Insight;
    if (!guide.id || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(guide.slug) || !guide.title ||
      !guide.answer || !Array.isArray(guide.sections) || !guide.sections.length ||
      !Array.isArray(guide.decisionSteps) || guide.decisionSteps.length < 3 ||
      !Array.isArray(guide.checklist) || !Array.isArray(guide.relatedIds) ||
      !["editorial-draft", "approved"].includes(guide.reviewStatus)) {
      throw new Error(`Incomplete owner guide: ${file}`);
    }
    if (guide.reviewStatus === "approved" && (!guide.reviewedBy || !/^\d{4}-\d{2}-\d{2}$/.test(guide.reviewedAt || ""))) {
      throw new Error(`Missing editorial approval record: ${file}`);
    }
    return { ...guide, servicePath: localServicePath(guide.servicePath) };
  });
  if (new Set(entries.map((item) => item.slug)).size !== entries.length || new Set(entries.map((item) => item.id)).size !== entries.length) {
    throw new Error("Duplicate owner guide route or ID");
  }
  const ids = new Set(entries.map((item) => item.id));
  for (const guide of entries) {
    if (guide.relatedIds.some((id) => !ids.has(id) || id === guide.id)) throw new Error(`Invalid related guide: ${guide.id}`);
  }
  return entries.sort((a, b) => a.id.localeCompare(b.id));
}

export function isContentPreview(): boolean {
  return process.env.HOTELFIRST_CONTENT_PREVIEW === "1" && process.env.VERCEL_ENV !== "production";
}

export function isApproved(item: Pick<Insight | OwnerResource, "reviewStatus" | "reviewedBy" | "reviewedAt">): boolean {
  return item.reviewStatus === "approved" && Boolean(item.reviewedBy) && /^\d{4}-\d{2}-\d{2}$/.test(item.reviewedAt || "");
}

export function getVisibleInsights(): Insight[] {
  const insights = getInsights();
  return isContentPreview() ? insights : insights.filter(isApproved);
}

export function getResources(): OwnerResource[] {
  const slugs = new Set<string>();
  const ids = new Set<string>();
  return resources.map((resource) => {
    if (!resource.id || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(resource.slug) ||
      resource.route !== `/resources/${resource.slug}` || !resource.title || !resource.answer ||
      resource.sections.length < 3 || resource.columns.length < 2 || !resource.rows.length ||
      resource.rows.some((row) => row.length !== resource.columns.length) ||
      !["editorial-draft", "approved"].includes(resource.reviewStatus)) {
      throw new Error(`Incomplete owner resource: ${resource.id || resource.slug}`);
    }
    if (slugs.has(resource.slug) || ids.has(resource.id)) throw new Error(`Duplicate owner resource: ${resource.id}`);
    if (resource.reviewStatus === "approved" && !isApproved(resource)) throw new Error(`Missing editorial approval record: ${resource.id}`);
    slugs.add(resource.slug);
    ids.add(resource.id);
    return { ...resource, service: localServicePath(resource.service) };
  });
}

export function getVisibleResources(): OwnerResource[] {
  const items = getResources();
  return isContentPreview() ? items : items.filter(isApproved);
}

export function ownerMetadata(title: string, description: string, route: string, approved = false): Metadata {
  const index = approved && process.env.VERCEL_ENV !== "preview" && !isContentPreview();
  return {
    title: { absolute: `${title} | HotelFirst Advisory` },
    description,
    alternates: { canonical: SITE_URL + route },
    robots: { index, follow: true, googleBot: { index, follow: true } },
    openGraph: { title, description, url: SITE_URL + route, siteName: "HotelFirst Advisory", type: "website",
      images: [{ url: SITE_URL + "/logos/hotelfirst_logo_horizontal_default.png", alt: "HotelFirst Advisory" }] },
    twitter: { card: "summary", title, description },
  };
}

export function ownerPageSchema(title: string, description: string, route: string, section: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": SITE_URL + route + "#page",
    name: title,
    description,
    url: SITE_URL + route,
    isPartOf: { "@id": SITE_URL + "/#website" },
    publisher: { "@id": ORGANIZATION_ID },
    inLanguage: "en-IN",
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL + "/" },
        { "@type": "ListItem", position: 2, name: section, item: SITE_URL + (section === "Owner guides" ? "/insights" : "/resources") },
        { "@type": "ListItem", position: 3, name: title, item: SITE_URL + route },
      ],
    },
  };
}
