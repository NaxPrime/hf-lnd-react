import { BarChart, Building2, Workflow, FileSignature } from "lucide-react";

// content/asset-management-content.ts
export const assetManagementContent = {
  title: "Asset Management Solutions",
  breadcrumb: "Home > Services",
  overviewTitle: "Overview",
  overviewText:
    "HotelFirst helps property owners optimize asset value through active oversight, data-driven monitoring, and strategic intervention. We align operator performance with ownership goals, offering independent guidance on operational, contractual, and commercial levers to enhance returns.",
  bannerImage: "/Images/Services/Asset Management/1.jpg",
  resortImage: "/Images/Services/Asset Management/2.jpg",

  whatWeDo: [
    {
      title: "Performance Monitoring & KPI Oversight",
      highlight: "Performance Monitoring",
      description:
        "We track KPIs such as ADR, occupancy, GOP margins, and RevPAR against budget and benchmarks to flag deviations early and identify improvement areas.",
      image: "/Images/Services/Asset Management/3.jpg",
    },
    {
      title: "Monthly P&L Reviews & Budget Planning",
      highlight: "Budget Planning",
      description:
        "We evaluate P&L statements monthly to assess variance, guide cost control, and strengthen future planning and forecast accuracy.",
      image: "/Images/Services/Asset Management/4.jpg",
    },
    {
      title: "Ownership-Operator Alignment",
      highlight: "Alignment",
      description:
        "We represent owner interests in conversations with the hotel operator, ensuring commercial objectives and brand compliance are met.",
      image: "/Images/Services/Asset Management/5.jpg",
    },
    {
      title: "Contract Compliance & Brand Commitment Review",
      highlight: "Contract Compliance",
      description:
        "We review operator contracts and track delivery against agreed brand standards, financial covenants, and owner obligations.",
      image: "/Images/Services/Asset Management/1.jpg",
    },
    {
      title: "Revenue & Cost Optimization Guidance",
      highlight: "Optimization Guidance",
      description:
        "We deep dive into department-wise performance to improve F&B, spa, banquets, and other income streams while managing operating ratios.",
      image: "/Images/Services/Asset Management/2.jpg",
    },
    {
      title: "Quarterly Strategic Reviews & Annual Business Plans",
      highlight: "Business Plans",
      description:
        "We lead quarterly and annual reviews to assess long-term goals, capital investment priorities, and asset value creation strategies.",
      image: "/Images/Services/Asset Management/3.jpg",
    },
  ],

  caseInPont: [
    {
      title: "Case in Point",
      highlight: "Point",
      image: "/Images/Services/Asset Management/6.jpg",
      quote: `HotelFirst was engaged by an investment fund to turn around a non-performing resort. Over 12 months, we renegotiated vendor contracts, restructured staff incentives, and introduced targeted pricing strategies. The asset achieved a 27% RevPAR uplift and positive GOP margins within a year.`,
    },
  ],

  CommonPitfallsProps: [
    {
      title: "Common",
      highlight: "Pitfalls",
      subtitle: "Owners Make",
      image: "/Images/Services/Asset Management/5.jpg",
      pitfalls: [
        {
          text: "Not tracking operator performance against benchmarks",
        },
        {
          text: "Lack of clarity on budget versus actuals",
        },
        {
          text: "Passive oversight with no strategic course correction",
        },
        {
          text: "Failure to hold operator accountable to contract terms",
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
      image: "/Images/Services/Asset Management/2.jpg",
      title: "Who This Is For?",
      items: [
        "Property owners seeking improved asset returns",
        "Funds with a portfolio of hospitality investments",
        "Family offices with passive hotel ownership",
        "Operators needing structured oversight",
        "Lenders or investors requiring periodic reporting",
      ],
    },
    {
      image: "/Images/Services/Asset Management/3.jpg",
      title: "Outcomes We Deliver",
      disabled: false,
      items: [
        "Improved financial performance and profitability",
        "Contract compliance and alignment with goals",
        "Greater transparency and proactive risk management",
        "Asset value maximization and long-term planning",
      ],
    },
  ],
};
