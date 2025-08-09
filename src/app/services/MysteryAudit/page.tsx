import HeroCard from "@/components/Services/HeroCard";
import { mysteryAuditContent } from "@/Content/MysteryAudit";
import WhyHotelFirst from "@/components/Services/whyHotelFirst";
import CaseInPoint from "@/components/Services/CaseInPoint";
import CommonPitfalls from "@/components/Services/CommonPitfalls";
import WhatWeDoSection from "@/components/Services/WhatWeDo";
import BrandSection from "@/components/Services/BrandSection";
import CallToAction from "@/components/Services/CTA";

const MysteryAudit = () => {
  return (
    <main>
      <HeroCard {...mysteryAuditContent} />
      <WhatWeDoSection items={mysteryAuditContent.whatWeDo} />
      <CaseInPoint items={mysteryAuditContent.caseInPont} />
      <CommonPitfalls items={mysteryAuditContent.CommonPitfallsProps} />
      <WhyHotelFirst />
      <BrandSection cards={mysteryAuditContent.audienceCards} />
      <CallToAction />
    </main>
  );
};

export default MysteryAudit;
