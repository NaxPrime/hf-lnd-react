import BrandSection from "@/components/Services/BrandSection";
import CaseInPoint from "@/components/Services/CaseInPoint";
import CommonPitfalls from "@/components/Services/CommonPitfalls";
import CallToAction from "@/components/Services/CTA";
import HeroCard from "@/components/Services/HeroCard";
import WhatWeDoSection from "@/components/Services/WhatWeDo";
import WhyHotelFirst from "@/components/Services/whyHotelFirst";
import { performanceOptimizationContent } from "@/Content/AdhocConsultation";

const Adhoc = () => {
  return (
    <main>
      <HeroCard {...performanceOptimizationContent} />
      <WhatWeDoSection items={performanceOptimizationContent.whatWeDo} />
      <CaseInPoint items={performanceOptimizationContent.caseInPont} />
      <CommonPitfalls
        items={performanceOptimizationContent.CommonPitfallsProps}
      />
      <WhyHotelFirst />
      <BrandSection cards={performanceOptimizationContent.audienceCards} />
      <CallToAction />
    </main>
  );
};

export default Adhoc;
