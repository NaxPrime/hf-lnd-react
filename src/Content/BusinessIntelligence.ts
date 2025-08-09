import { BarChart, Building2, FileSignature, Workflow } from "lucide-react";

// content/business-intelligence-content.ts
export const businessIntelligenceContent = {
  title: "Business Intelligence & Market Studies",
  breadcrumb: "Home > Services",
  overviewTitle: "Overview",
  overviewText:
    "HotelFirst provides fact-based insights to guide investment, development, and repositioning decisions. Whether evaluating a new site, repositioning an asset, or conducting feasibility for financing, we combine location intelligence, competitive benchmarking, and demand analysis to drive confident decision-making.",
  bannerImage: "/Images/Services/Business Intelligence/1.jpg",
  resortImage: "/Images/Services/Business Intelligence/2.jpg",

  whatWeDo: [
    {
      title: "Location & Macro-Demand Assessment",
      highlight: "Location & Macro",
      description:
        "We assess the viability of your site or region for hospitality development or expansion, using tourism trends, infrastructure updates, and economic activity mapping.",
      image: "/Images/Services/Business Intelligence/3.jpg",
    },
    {
      title: "Competitive Landscape Mapping",
      highlight: "Competitive Landscape",
      description:
        "We benchmark proposed or existing assets against key competitors on rate, performance, amenities, and positioning to determine differentiation opportunities.",
      image: "/Images/Services/Business Intelligence/4.jpg",
    },
    {
      title: "Product Concept & Positioning Advisory",
      highlight: "Product Concept",
      description:
        "We define a product-market fit by aligning guest needs with the optimal hotel classification, room mix, amenities, and branding strategy.",
      image: "/Images/Services/Business Intelligence/5.jpg",
    },
    {
      title: "Stakeholder Interviews & Validation",
      highlight: "Stakeholder Interviews",
      description:
        "We gather insights from government, operators, and local stakeholders to validate assumptions and shape contextual recommendations.",
      image: "/Images/Services/Business Intelligence/6.jpg",
    },
    {
      title: "Financial Projections & Business Modelling",
      highlight: "Financial Projections",
      description:
        "We build investment-grade feasibility studies, including multi-scenario P&L forecasts, IRR modeling, and sensitivity analysis.",
      image: "/Images/Services/Business Intelligence/7.jpg",
    },
    {
      title: "Strategy & Policy Gap Recommendations",
      highlight: "Recommendations",
      description:
        "For policy clients, we provide actionable recommendations on tourism strategy, asset activation, and demand stimulation initiatives.",
      image: "/Images/Services/Business Intelligence/8.jpg",
    },
  ],

  caseInPont: [
    {
      title: "Case in Point",
      highlight: "Point",
      image: "/Images/Services/Business Intelligence/9.jpg",
      quote: `HotelFirst partnered with a local state agency to assess tourism potential in a tier-3 destination. Our study guided a 5-year roadmap including 3 hotel projects, new experiential offerings, and infrastructure upgrades. Investor interest increased following release of the report.`,
    },
  ],

  CommonPitfallsProps: [
    {
      title: "Common",
      highlight: "Pitfalls",
      subtitle: "Owners Make",
      image: "/Images/Services/Business Intelligence/2.jpg",
      pitfalls: [
        {
          text: "Relying on anecdotal demand instead of structured data",
        },
        {
          text: "Underestimating local competition and pricing benchmarks",
        },
        {
          text: "Ignoring infrastructure and seasonality constraints",
        },
        {
          text: "Skipping feasibility studies before investments",
        },
      ],
    },
  ],

  whyHotelFirstData: [
    {
      title: "Why",
      highlight: "HotelFirst",
      items: [
        {
          icon: BarChart,
          text: "Data-driven approach anchored in hospitality-specific metrics",
        },
        {
          icon: Building2,
          text: "Access to proprietary benchmarks and trend analysis",
        },
        {
          icon: Workflow,
          text: "Custom financial models validated by investment professionals",
        },
        {
          icon: FileSignature,
          text: "Experience across public, private, and tourism board clients",
        },
      ],
    },
  ],

  audienceCards: [
    {
      image: "/Images/Services/Business Intelligence/3.jpg",
      title: "Who This Is For?",
      items: [
        "Hotel developers evaluating new projects",
        "Investors assessing feasibility before funding",
        "Tourism boards needing destination strategy",
        "Operators considering expansion or repositioning",
        "Financial institutions seeking third-party diligence",
      ],
    },
    {
      image: "/Images/Services/Business Intelligence/4.jpg",
      title: "Outcomes We Deliver",
      disabled: false,
      items: [
        "Accurate forecasts and scenario modeling",
        "Clear go/no-go recommendations",
        "Investor-ready project documentation",
        "Positioning that aligns with demand trends",
      ],
    },
  ],
};
