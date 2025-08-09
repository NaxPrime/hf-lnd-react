"use client";

import Image from "next/image";

export interface PitfallItem {
  text: string;
}

export interface CommonPitfallsItem {
  title: string;
  highlight: string;
  subtitle: string;
  pitfalls: PitfallItem[];
  image: string;
}

export default function CommonPitfalls({
  items,
}: {
  items: CommonPitfallsItem[];
}) {
  return (
    <div className="flex flex-col space-y-0">
      {items.map((item, idx) => (
        <section
          key={idx}
          className="relative flex flex-col md:flex-row items-stretch overflow-hidden"
        >
          {/* Orange background on the left half */}
          <div className="hidden md:block absolute top-0 left-0 w-[50vw] h-full bg-[#FDEFE9] z-0" />

          {/* Left Content */}
          <div className="w-full md:w-1/2 py-20 px-6 md:px-24 flex flex-col justify-center z-10">
            <h2 className="text-4xl md:text-5xl font-serif font-semibold text-[#2D1D15] leading-tight mb-10">
              {item.title}{" "}
              <span className="text-[#D54F2F] font-normal">
                {item.highlight}
              </span>
              <br />
              {item.subtitle}
            </h2>

            <ul className="space-y-6">
              {item.pitfalls.map((pitfall, i) => (
                <li key={i} className="flex items-start gap-4 text-[#3E2F27]">
                  <div className="w-7 h-7 bg-[#D54F2F] rounded-full flex items-center justify-center text-white font-bold text-base leading-none">
                    ×
                  </div>
                  <p className="text-lg leading-relaxed">{pitfall.text}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Image */}
          <div className="w-full md:w-1/2 relative z-10">
            <div className="relative h-[400px] md:h-full">
              <Image
                src={item.image}
                alt="Common Pitfalls"
                fill
                className="object-cover rounded-none md:rounded-r-2xl"
              />
            </div>
          </div>
        </section>
      ))}

      {/* Optional Bottom Bars */}
      <div className="flex w-full h-[40px]">
        <div className="w-1/2 bg-[#FDEFE9]" />
        <div className="w-1/4 bg-[#F05323]" />
        <div className="w-1/4 bg-black" />
      </div>
    </div>
  );
}
