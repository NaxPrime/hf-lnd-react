import WhyHotelFirst from "@/components/Services/whyHotelFirst";
import CaseInPoint from "@/components/Services/CaseInPoint";
import CommonPitfalls from "@/components/Services/CommonPitfalls";
import HeroCard from "@/components/Services/HeroCard";
import WhatWeDoSection from "@/components/Services/WhatWeDo";
import { brandSelectionContent } from "@/Content/BrandSelection";
import BrandSection from "@/components/Services/BrandSection";
import CallToAction from "@/components/Services/CTA";

const BrandSelection = () => {
  return (
    <main>
      <HeroCard {...brandSelectionContent} />;
      <WhatWeDoSection items={brandSelectionContent.whatWeDo} />
      <CaseInPoint items={brandSelectionContent.caseInPont} />
      <CommonPitfalls items={brandSelectionContent.CommonPitfallsProps} />
      <WhyHotelFirst />
      <BrandSection cards={brandSelectionContent.audienceCards} />
      <CallToAction />
    </main>
  );
};

export default BrandSelection;
