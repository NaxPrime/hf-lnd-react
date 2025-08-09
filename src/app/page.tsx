import AboutUs from "@/components/Home/Aboutus";
import CallToAction from "@/components/Home/CTA";
import FaqSection from "@/components/Home/faq";
import Hero from "@/components/Home/Hero";
import OurServices from "@/components/Home/OurServices";
import WhyHotelFirst from "@/components/Home/WhyHotelFirst";

export default function Home() {
  return (
    <main>
      <Hero />
      <AboutUs />
      <WhyHotelFirst />
      <OurServices />
      <FaqSection />
      <CallToAction />
    </main>
  );
}
