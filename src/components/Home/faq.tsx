"use client";

import { useState } from "react";

type FAQ = {
  question: string;
  answer: string;
  category: string;
};

const faqs: FAQ[] = [
  {
    category: "Strategy & Engagement",
    question:
      "When should a hotel owner consider bringing in a hospitality consultant?",
    answer:
      "The ideal time is when you’re still ideating or exploring solutions, before decisions are locked in. Whether you are ideating, evaluating concepts, facing uncertainty, or anticipating change, we bring clarity and structure early in the process to help you move forward with confidence.",
  },
  {
    category: "Strategy & Engagement",
    question: "Do you only work with large hotel assets or portfolios?",
    answer:
      "Not at all. While we do work with institutional players, we also partner with single-asset owners, family-run properties, and boutique developers who need clarity, structure, or an expert lens on their project.",
  },
  {
    category: "Strategy & Engagement",
    question: "How involved is HotelFirst during a typical engagement?",
    answer:
      "We're not a hands-off advisor. Depending on the scope, we offer deep-dive diagnostics, work with on-ground teams, align with ownership priorities, and even represent the owner in brand/operator negotiations or reviews.",
  },
  {
    category: "Working Relationship",
    question: "Will I be working directly with the founder or a junior team?",
    answer:
      "At HotelFirst, all engagements are led by senior leadership with deep industry experience. You’ll work directly with a principal advisor or senior consultant, especially in strategic reviews, decision-making, and stakeholder discussions not just junior analysts.",
  },
  {
    category: "Working Relationship",
    question: "Do you work under NDAs or with confidential mandates?",
    answer:
      "Absolutely. Many of our clients are private, discreet, or in early stages of sensitive transactions. We operate with strict confidentiality and are comfortable working under formal NDAs.",
  },
  {
    category: "Working Relationship",
    question:
      "Can you collaborate with other consultants or specialists on our project?",
    answer:
      "Yes. We often complement other teams like architects, branding consultants, or legal advisors and act as the hospitality strategy layer in multi-stakeholder environments.",
  },
  {
    category: "Fees, Formats & Commitment",
    question: "Do you charge hourly or project-based fees?",
    answer:
      "Typically, we offer project-based pricing for defined scopes (e.g., Business Intelligence study, audit, etc.), and retainer models for ongoing advisory or asset management. Hourly rates are used for highly focused, short-term interventions.",
  },
  {
    category: "Fees, Formats & Commitment",
    question: "What’s the minimum duration for a retainer engagement?",
    answer:
      "Most retainer-based partnerships are 6 to 12 months, especially for performance oversight. For one-time studies, the duration is tied to the project scope.",
  },
  {
    category: "Fees, Formats & Commitment",
    question: "What geographies do you cover?",
    answer:
      "We are India-based but geographically flexible, especially for strategic mandates. We’ve worked across urban and leisure markets and support offshore investors with India-based hospitality assets.",
  },
  {
    category: "Fees, Formats & Commitment",
    question: "How quickly can you start once we reach out?",
    answer:
      "Depending on scope and bandwidth, we typically begin a project within 1–2 weeks of confirmation. For urgent audits or evaluations, we do our best to accommodate accelerated timelines.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [showAll, setShowAll] = useState(false);

  const toggleIndex = (index: number) => {
    if (showAll) return;
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleShowAll = () => {
    setShowAll(true);
    setOpenIndex(null);
  };

  const handleHideAll = () => {
    setShowAll(false);
    setOpenIndex(null);
  };

  const categories = [...new Set(faqs.map((faq) => faq.category))];

  return (
    <section id="faq" className="mx-auto max-w-5xl px-4 py-16">
      <h2 className="mt-2 text-center text-3xl font-bold text-black md:text-4xl">
        Frequently Asked Questions
      </h2>

      <div className="mt-4 flex cursor-pointer justify-center gap-6 text-sm font-semibold text-indigo-600">
        <span onClick={handleShowAll} className="hover:underline">
          Show All
        </span>
        /
        <span onClick={handleHideAll} className="hover:underline">
          Hide All
        </span>
      </div>

      <div className="mt-10 space-y-10">
        {categories.map((category) => (
          <div key={category}>
            <h3 className="mb-4 text-xl font-semibold text-black">
              {category}
            </h3>
            <div className="space-y-4">
              {faqs
                .map((faq, index) => ({ ...faq, index }))
                .filter((faq) => faq.category === category)
                .map((faq) => {
                  const isOpen = showAll || openIndex === faq.index;
                  return (
                    <div key={faq.index} className="border-b">
                      <button
                        className="flex w-full items-center justify-between py-4 text-left text-base font-semibold text-gray-600"
                        onClick={() => toggleIndex(faq.index)}
                      >
                        {faq.question}
                        <span className="ml-4">
                          {isOpen ? (
                            <svg
                              className="h-5 w-5 rotate-180 transform"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="h-5 w-5"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          )}
                        </span>
                      </button>
                      {isOpen && (
                        <p className="px-1 pb-6 text-sm text-gray-600">
                          {faq.answer}
                        </p>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
