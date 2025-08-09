import BrandSection from "@/components/Services/BrandSection";
import CaseInPoint from "@/components/Services/CaseInPoint";
import CommonPitfalls from "@/components/Services/CommonPitfalls";
import CallToAction from "@/components/Services/CTA";
import HeroCard from "@/components/Services/HeroCard";
import WhatWeDoSection from "@/components/Services/WhatWeDo";
import WhyHotelFirst from "@/components/Services/whyHotelFirst";
import { assetManagementContent } from "@/Content/AssetManagement";

const AssetManagement = () => {
  return (
    <main>
      <HeroCard {...assetManagementContent} />
      <WhatWeDoSection items={assetManagementContent.whatWeDo} />
      <CaseInPoint items={assetManagementContent.caseInPont} />
      <CommonPitfalls items={assetManagementContent.CommonPitfallsProps} />
      <WhyHotelFirst />
      <BrandSection cards={assetManagementContent.audienceCards} />
      <CallToAction />
    </main>
  );
};

export default AssetManagement;
