import { BarChart, Building2, Workflow, FileSignature } from "lucide-react";

// content/brand-selection-content.ts
export const brandSelectionContent = {
  title: "Brand Selection & Contract Negotiation",
  breadcrumb: "Home > Services",
  overviewTitle: "Overview",
  overviewText:
    "Selecting the right brand is a pivotal decision that shapes positioning, performance, and long-term asset value. HotelFirst supports owners and developers in identifying, evaluating, and securing brand affiliations that align with strategic and commercial objectives.",
  bannerImage: "/Images/Services/Brand Selection/10.jpg",
  resortImage: "/Images/Services/Brand Selection/11.jpg",

  whatWeDo: [
    {
      title: "Brand Fit Assessment",
      highlight: "Brand Fit",
      description:
        "We evaluate your project’s fundamentals: location, scale, target market, and vision—and recommend brands that align with your positioning goals and asset strategy. Our approach prioritizes fit over familiarity.",
      image: "/Images/Services/Brand Selection/9.jpg",
    },
    {
      title: "Commercial & Technical Due Diligence",
      highlight: "Commercial & Technical",
      description:
        "We assess brand fees, loyalty program value, pre-opening costs, technical obligations, and projected returns to support sound, well-informed decision-making.",
      image: "/Images/Services/Brand Selection/8.jpg",
    },
    {
      title: "Operator Outreach & RFP",
      highlight: "Operator Outreach",
      description:
        "We manage the end-to-end brand selection process, issuing tailored RFPs, coordinating with shortlisted operators, and overseeing site visits and proposal evaluations.",
      image: "/Images/Services/Brand Selection/7.jpg",
    },
    {
      title: "Term Sheet Evaluation",
      highlight: "Term Sheet",
      description:
        "We benchmark commercial terms base and incentive fees, owner priority, exit rights, and territorial protections to ensure alignment with your financial and operational objectives.",
      image: "/Images/Services/Brand Selection/10.jpg",
    },
    {
      title: "Contract Negotiation Support",
      highlight: "Contract Negotiation",
      description:
        "From term sheet to final HMA, we support or represent you across commercial, and technical negotiations to safeguard long-term asset value.",
      image: "/Images/Services/Brand Selection/5.jpg",
    },
  ],

  caseInPont: [
    {
      title: "Case in Point",
      highlight: "Point",
      image: "/Images/Services/Brand Selection/4.jpg",
      quote: `A 120-key resort in coastal Karnataka engaged HotelFirst to identify an appropriate upscale brand. After evaluating five operators, we shortlisted two and led commercial negotiations. The outcome: a 4-year performance clause, an 18% reduction in pre-opening costs, and savings of ₹8 crores in operator fees over a 10-year term.`,
    },
  ],

  CommonPitfallsProps: [
    {
      title: "Common",
      highlight: "Pitfalls",
      subtitle: "Owners Make",
      image: "/Images/Services/Brand Selection/3.jpg",
      pitfalls: [
        {
          text: "Accepting templated brand agreements without comparison",
        },
        {
          text: "Prioritizing key money over long-term cost of fees",
        },
        {
          text: "Ignoring brand-specific technical requirements",
        },
        {
          text: "Failing to plan for mid-contract performance exits",
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
          text: "Proven expertise in asset strategy and operator relations",
        },
        {
          icon: Building2,
          text: "Independent, owner-aligned perspective without conflicts",
        },
        {
          icon: Workflow,
          text: "Hands-on support with budgeting, forecasting, and audits",
        },
        {
          icon: FileSignature,
          text: "Data-backed insights that protect and grow asset value",
        },
      ],
    },
  ],
  audienceCards: [
    {
      image: "/Images/Services/Brand Selection/2.jpg",
      title: "Who This Is For?",
      items: [
        "Hotel Developers",
        "Real Estate Investors",
        "Independent Hotel Owners",
        "Promoters seeking repositioning strategies",
        "Institutional Investors exploring brand conversion opportunities",
      ],
    },
    {
      image: "/Images/Services/Brand Selection/1.jpg",
      title: "Outcomes We Deliver",
      disabled: false, // disable this card
      items: [
        "A shortlist of brand partners tailored to your asset and ambition",
        "Term sheets that balance flexibility with control",
        "Contracts that secure operational alignment, risk mitigation, and financial upside",
        "Confidence to proceed with clarity at every stage",
      ],
    },
  ],
};
