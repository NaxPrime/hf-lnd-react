import { ORGANIZATION_ID, SITE_URL, searchPages, serializeJsonLd, type SearchPath } from "@/lib/search";

export default function ServiceSchema({ path }: { path: SearchPath }) {
  const page = searchPages.find((entry) => entry.path === path)!;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": SITE_URL + path + "#service",
    url: SITE_URL + path,
    name: page.title,
    description: page.description,
    serviceType: page.title,
    audience: {
      "@type": "Audience",
      audienceType: "Hotel owners, developers, investors, asset managers and hotel leadership teams",
    },
    provider: { "@id": ORGANIZATION_ID },
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }} />;
}
