"use client";

import Image from "next/image";

export default function WhyHotelFirst() {
  return (
    <section className="px-6 md:px-16 py-16 bg-white text-[#2C2C2C] font-serif">
      {/* Top section */}
      <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center gap-12 mb-12">
        {/* Text */}
        <div className="w-full md:w-2/3">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Why HotelFirst?
          </h2>
          <p className="text-gray-500 text-lg mb-4">
            At HotelFirst, we believe the value of insight lies in its
            execution. As a boutique firm, we take on a select number of
            mandates, ensuring each receives focused, senior-led attention.
          </p>
          <p className="text-gray-500 text-lg">
            With an ownership mindset and outcome driven approach, we deliver
            tailored strategies that go beyond analysis to real impact.
          </p>
        </div>

        {/* Image */}
        <div className="h-64 md:h-80 md:w-1/3 rounded-[80px_0px_80px_0px] overflow-hidden">
          <Image
            src="/Images/Home/WhyHF.jpg" // place the image in public/images/
            alt="Hotel Lobby"
            width={800}
            height={600}
            className="w-full object-cover"
          />
        </div>
      </div>

      {/* Orange line */}
      <div className="h-[3px] bg-[#F15A29] max-w-7xl mx-auto rounded-full mb-16" />

      {/* Bottom 3 features */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 text-left">
        {/* Item 1 */}
        <div className="flex flex-col items-start gap-4">
          <div className="w-10 h-10 bg-[#F15A29] text-white font-bold text-center rounded-full flex items-center justify-center">
            1
          </div>
          <h4 className="text-lg font-bold">Ownership Mindset</h4>
          <p className="text-gray-500 text-sm leading-relaxed">
            We treat every engagement as if the business were our own, with the
            same diligence, urgency, and long-term focus. For us, real success
            is measured by results, not appearances.
          </p>
        </div>

        {/* Item 2 */}
        <div className="flex flex-col items-start gap-4">
          <div className="w-10 h-10 bg-[#F15A29] text-white font-bold text-center rounded-full flex items-center justify-center">
            2
          </div>
          <h4 className="text-lg font-bold">Relentless Intelligence</h4>
          <p className="text-gray-500 text-sm leading-relaxed">
            We go far beyond surface level analysis. Whether it means conducting
            field interviews, tracking on ground dynamics, or triangulating data
            from unconventional sources, we do what it takes to uncover the
            truth.
          </p>
        </div>

        {/* Item 3 */}
        <div className="flex flex-col items-start gap-4">
          <div className="w-10 h-10 bg-[#F15A29] text-white font-bold text-center rounded-full flex items-center justify-center">
            3
          </div>
          <h4 className="text-lg font-bold">Purposeful Selectivity</h4>
          <p className="text-gray-500 text-sm leading-relaxed">
            We intentionally work with a limited number of clients so we can go
            deeper, think sharper, and deliver solutions that are carefully
            built, thoroughly tested, and truly effective.
          </p>
        </div>
      </div>
    </section>
  );
}
