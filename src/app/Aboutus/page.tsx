"use client";

import AboutUsHero from "@/components/Aboutus/AboutUsHero";
import DomainExperiences from "@/components/Aboutus/DomainExperiences";
import OurJourney from "@/components/Aboutus/Ourjourney";
import CallToAction from "@/components/Home/CTA";

const AboutusHero = () => {
  return (
    <main>
      <AboutUsHero />
      <OurJourney />
      <DomainExperiences />
      <CallToAction />
    </main>
  );
};

export default AboutusHero;
