import { BarChart, Building2, Hand } from "lucide-react";

// content/mystery-audit-content.ts
export const mysteryAuditContent = {
  title: "Mystery Audits & Quality Assurance",
  breadcrumb: "Home > Services",
  overviewTitle: "Overview",
  overviewText:
    "We provide actionable insights on service quality and brand standards. At HotelFirst, we conduct structured audits and assessments tailored to hotel operations. Our model captures guest experience and operational consistency to identify performance gaps and recommend measurable improvements.",
  bannerImage: "/Images/Services/Mystery audit/1.jpg",
  resortImage: "/Images/Services/Mystery audit/2.jpg",

  whatWeDo: [
    {
      title: "Mystery Guest Audits",
      highlight: "Mystery Guest",
      description:
        "Our auditors experience your property like a guest and report on every interaction. The insights reveal how well your team delivers on service promise and SOP adherence.",
      image: "/Images/Services/Mystery audit/3.jpg",
    },
    {
      title: "SOP-Based Audit Model",
      highlight: "SOP-Based",
      description:
        "We audit against brand and operational standards. Our structured format scores compliance, highlights gaps, and suggests corrective actions.",
      image: "/Images/Services/Mystery audit/4.jpg",
    },
    {
      title: "Industry Benchmark Audit Model",
      highlight: "Industry Benchmark",
      description:
        "We compare your performance with sector benchmarks and identify best practices to elevate your service and guest experience.",
      image: "/Images/Services/Mystery audit/5.jpg",
    },
    {
      title: "Pre-Brand Inspection Audits",
      highlight: "Pre-Brand Inspection",
      description:
        "We support owners preparing for operator audits by identifying service gaps and delivering action plans for compliance.",
      image: "/Images/Services/Mystery audit/6.jpg",
    },
    {
      title: "Annual Multi-Year Audit Programs",
      highlight: "Annual Multi-Year",
      description:
        "Multi-property brands and hotel owners planning long-term quality initiatives rely on us for recurring assessments and progress tracking.",
      image: "/Images/Services/Mystery audit/8.jpg",
    },
  ],

  caseInPont: [
    {
      title: "Case in Point",
      highlight: "Point",
      image: "/Images/Services/Mystery audit/7.jpg",
      quote: `A luxury resort in Rajasthan worked with us to identify service lapses affecting repeat guests. Our audits revealed inconsistencies in arrival and dining experiences. Post-implementation, the resort saw a 27% improvement in guest satisfaction scores over 6 months.`,
    },
  ],

  CommonPitfallsProps: [
    {
      title: "Common",
      highlight: "Pitfalls",
      subtitle: "Owners Make",
      image: "/Images/Services/Mystery audit/9.jpg",
      pitfalls: [
        { text: "Belief that brand standards alone ensure service quality" },
        { text: "Lack of regular third-party evaluation" },
        { text: "Over-reliance on internal reporting and feedback" },
        { text: "Delayed response to negative reviews or complaints" },
      ],
    },
  ],

  whyHotelFirstData: [
    {
      title: "Why",
      highlight: "HotelFirst",
      items: [
        {
          icon: Building2,
          text: "Data-led insights tailored to your operational reality",
        },
        {
          icon: BarChart,
          text: "Experienced auditors trained across multiple brands",
        },
        {
          icon: BarChart,
          text: "Actionable diagnostics, not generic checklists",
        },
        {
          icon: Hand,
          text: "Flexible deployment—one-time or periodic feedback",
        },
      ],
    },
  ],

  audienceCards: [
    {
      image: "/Images/Services/Mystery audit/2.jpg",
      title: "Who This Is For?",
      items: [
        "Independent Hotel Owners",
        "Operators seeking consistent service delivery",
        "Resorts preparing for brand audits",
        "Owners evaluating training effectiveness",
        "Brands implementing service excellence programs",
      ],
    },
  ],
};
