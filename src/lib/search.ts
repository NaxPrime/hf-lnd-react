import type { Metadata } from "next";

export const SITE_URL = "https://www.hotelfirst.one";
export const ORGANIZATION_ID = SITE_URL + "/#organization";

// Search topics are an editorial and measurement taxonomy. Search engines may
// ignore the legacy meta-keywords field, so these phrases must never be used as
// a substitute for useful, evidence-backed visible content.
export const SEARCH_TOPICS = {
  advisory: [
    "hotel advisory India",
    "hospitality consulting India",
    "hotel owner advisory",
    "hotel asset strategy",
    "hotel operator advisory",
    "hotel investment advisory",
  ],
  brandSelection: [
    "hotel brand selection",
    "hotel operator selection",
    "hotel management agreement advisory",
    "HMA commercial review",
    "hotel contract negotiation",
    "owner-side hotel advisory",
  ],
  businessIntelligence: [
    "hotel feasibility study",
    "hotel market study",
    "hospitality market intelligence",
    "hotel demand analysis",
    "hotel development feasibility",
    "hotel financial modelling",
  ],
  assetManagement: [
    "hotel asset management",
    "hotel owner representation",
    "hotel operator accountability",
    "hotel P&L review",
    "hotel performance benchmarking",
    "hotel capital planning",
  ],
  mysteryAudit: [
    "hotel mystery audit",
    "hospitality quality assurance",
    "hotel service audit",
    "guest experience audit",
    "hotel operational standards audit",
  ],
  turnaround: [
    "hotel turnaround consulting",
    "hotel performance optimization",
    "underperforming hotel advisory",
    "hotel operational audit",
    "hotel revenue and cost optimization",
    "hotel repositioning advisory",
  ],
} as const;

export const searchPages = [
  {
    "path": "/",
    "title": "HotelFirst | Hotel Owner Advisory & Asset Strategy",
    "description": "HotelFirst advises hotel owners, developers and investors on brand selection, market studies, asset management, mystery audits and performance improvement.",
    "keywords": SEARCH_TOPICS.advisory
  },
  {
    "path": "/Aboutus",
    "title": "About HotelFirst Advisory",
    "description": "Meet HotelFirst, a boutique hospitality advisory firm working with hotel owners, developers and investors on strategy and asset performance.",
    "keywords": ["HotelFirst Advisory", "hospitality advisory Visakhapatnam", "hotel owner consulting India"]
  },
  {
    "path": "/Contact",
    "title": "Contact HotelFirst | Request a Consultation",
    "description": "Discuss your hotel project, brand selection, asset performance or operational audit with HotelFirst. Request a consultation with our advisory team.",
    "keywords": ["contact HotelFirst Advisory", "hotel advisory consultation India", "hospitality consulting consultation"]
  },
  {
    "path": "/services/BrandSelection",
    "title": "Hotel Brand Selection & HMA Advisory",
    "description": "Compare hotel brands, evaluate operator proposals and review commercial HMA terms with HotelFirst's owner-focused brand selection and negotiation support.",
    "keywords": SEARCH_TOPICS.brandSelection
  },
  {
    "path": "/services/BusinessIntelligence",
    "title": "Hotel Feasibility & Market Studies",
    "description": "Evaluate hotel demand, competition, positioning and financial scenarios with HotelFirst's market intelligence and feasibility studies.",
    "keywords": SEARCH_TOPICS.businessIntelligence
  },
  {
    "path": "/services/AssetManagement",
    "title": "Hotel Asset Management & Owner Advisory",
    "description": "Independent hotel performance oversight, P&L reviews, operator accountability and capital planning aligned with ownership goals.",
    "keywords": SEARCH_TOPICS.assetManagement
  },
  {
    "path": "/services/MysteryAudit",
    "title": "Hotel Mystery Audits & Quality Assurance",
    "description": "Assess the guest journey, service consistency and operational standards through HotelFirst's mystery guest audits and quality assurance programs.",
    "keywords": SEARCH_TOPICS.mysteryAudit
  },
  {
    "path": "/services/AdhocConsultation",
    "title": "Hotel Performance Optimization & Turnarounds",
    "description": "Diagnose hotel performance gaps and develop practical plans for revenue, costs, operations, repositioning and management transitions.",
    "keywords": SEARCH_TOPICS.turnaround
  },
  {
    "path": "/privacy-policy",
    "title": "Privacy Policy",
    "description": "Read how HotelFirst handles personal information, website inquiries and privacy requests.",
    "keywords": ["HotelFirst privacy policy"]
  },
  {
    "path": "/data-deletion",
    "title": "Data Deletion Instructions",
    "description": "Learn how to ask HotelFirst to delete eligible personal data from website inquiries, communications and connected social-platform interactions.",
    "keywords": ["HotelFirst data deletion instructions"]
  },
  {
    "path": "/terms-and-conditions",
    "title": "Terms and Conditions",
    "description": "Read the terms governing use of the HotelFirst website and its hospitality advisory information.",
    "keywords": ["HotelFirst terms and conditions"]
  }
] as const;

export type SearchPath = (typeof searchPages)[number]["path"];

export function pageMetadata(path: SearchPath): Metadata {
  const page = searchPages.find((entry) => entry.path === path)!;
  const url = SITE_URL + path;
  const title = page.title.includes("HotelFirst") ? page.title : page.title + " | HotelFirst";
  return {
    title: { absolute: title },
    description: page.description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "en_IN",
      siteName: "HotelFirst",
      url,
      title,
      description: page.description,
      images: [{
        url: SITE_URL + "/logos/hotelfirst_logo_horizontal_default.png",
        alt: "HotelFirst Advisory",
      }],
    },
    twitter: {
      card: "summary",
      title,
      description: page.description,
      images: [SITE_URL + "/logos/hotelfirst_logo_horizontal_default.png"],
    },
  };
}

export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export const organizationGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      name: "HotelFirst",
      alternateName: "HotelFirst Advisory",
      url: SITE_URL + "/",
      logo: SITE_URL + "/logos/hotelfirst_logo_horizontal_default.png",
      email: "begin@hotelfirst.one",
      telephone: "+919052888789",
      foundingDate: "2025",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Visakhapatnam",
        addressRegion: "Andhra Pradesh",
        addressCountry: "IN",
      },
      sameAs: ["https://www.linkedin.com/company/hotelfirst"],
      knowsAbout: Object.values(SEARCH_TOPICS).flat(),
      description: searchPages[0].description,
    },
    {
      "@type": "WebSite",
      "@id": SITE_URL + "/#website",
      url: SITE_URL + "/",
      name: "HotelFirst",
      publisher: { "@id": ORGANIZATION_ID },
      inLanguage: "en-IN",
    },
  ],
};
