"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const cards = [
  {
    title: "Sales & Revenue Management",
    description:
      "Expertise in pricing, channels, and demand segmentation across corporate, leisure, MICE, etc.",
  },
  {
    title: "Marketing & PR",
    description:
      "Brand visibility, campaign planning, and guest engagement through targeted hospitality communication strategies.",
  },
  {
    title: "Hotel Operations",
    description:
      "Hands-on understanding of SOPs, service delivery, and departmental alignment for consistent guest experience.",
  },
  {
    title: "Pre-Opening",
    description:
      "Support in budgeting, planning, team structuring, and operational readiness from concept to launch.",
  },
  {
    title: "Auditing",
    description:
      "Thorough audits assessing SOP compliance, tangible and intangible service quality, and operational efficiency gaps.",
  },
  {
    title: "Market Research",
    description:
      "On-ground intelligence, competitive benchmarking, and data-backed insights for informed hospitality decisions.",
  },
];

export default function DomainExperiences() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="relative bg-[#FFF3EE] py-20 px-4 md:px-16 overflow-hidden rounded-tr-[300px]">
      {/* Heading */}
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-serif text-black">
          Domain Experiences
        </h2>
        <div className="h-1 w-16 bg-[#EB6332] mx-auto mt-2" />
      </div>

      {/* Scrollable Cards + Arrows */}
      <div className="relative mt-12">
        {/* Navigation Arrows */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
          <button
            onClick={() => scroll("left")}
            className="p-2 rounded-full text-White hover:bg-[#FFF3EE] hover:text-white bg-[#EB6332] shadow"
          >
            <ChevronLeft size={20} className="text-white" />
          </button>
        </div>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
          <button
            onClick={() => scroll("right")}
            className="p-2 rounded-full text-White hover:bg-[#FFF3EE] hover:text-white bg-[#EB6332] shadow"
          >
            <ChevronRight size={20} className="text-white" />
          </button>
        </div>

        {/* Scrollable Container */}
        <div className="mt-6 overflow-x-auto scrollbar-hide">
          <div
            ref={scrollRef}
            className="flex gap-6 px-12 py-4 scroll-smooth scrollbar-hide"
            style={{
              scrollSnapType: "x mandatory",
              scrollBehavior: "smooth",
            }}
          >
            {cards.map((card, index) => (
              <div
                key={index}
                className="min-w-[260px] md:min-w-[300px] bg-white rounded-xl p-6 shadow-sm scroll-snap-align-start"
              >
                <h3 className="font-serif text-lg mb-2 text-black">
                  {card.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
