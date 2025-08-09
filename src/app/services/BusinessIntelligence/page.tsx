import BrandSection from "@/components/Services/BrandSection";
import CaseInPoint from "@/components/Services/CaseInPoint";
import CommonPitfalls from "@/components/Services/CommonPitfalls";
import CallToAction from "@/components/Services/CTA";
import HeroCard from "@/components/Services/HeroCard";
import WhatWeDoSection from "@/components/Services/WhatWeDo";
import WhyHotelFirst from "@/components/Services/whyHotelFirst";
import { businessIntelligenceContent } from "@/Content/BusinessIntelligence";

const BusinessIntelligence = () => {
  return (
    <main>
      <HeroCard {...businessIntelligenceContent} />
      <WhatWeDoSection items={businessIntelligenceContent.whatWeDo} />
      <CaseInPoint items={businessIntelligenceContent.caseInPont} />
      <CommonPitfalls items={businessIntelligenceContent.CommonPitfallsProps} />
      <WhyHotelFirst />
      <BrandSection cards={businessIntelligenceContent.audienceCards} />
      <CallToAction />
    </main>
  );
};

export default BusinessIntelligence;
