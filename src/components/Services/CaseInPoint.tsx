"use client";

import Image from "next/image";

interface CaseInPointProps {
  title: string;
  highlight: string;
  quote: string;
  image: string;
}

export default function CaseInPoint({ items }: { items: CaseInPointProps[] }) {
  return (
    <section className="w-full py-20 px-4 md:px-20 bg-white">
      {items.map((item, index) => (
        <div
          key={index}
          className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12"
        >
          {/* ✅ FIXED: Make container relative and give it height */}
          <div className="w-full md:w-1/2 relative h-[400px] rounded-2xl overflow-hidden shadow-md">
            <Image
              src={item.image}
              alt={`${item.highlight} image`}
              fill
              className="object-cover"
            />
          </div>

          {/* Text Section */}
          <div className="w-full md:w-1/2 flex flex-col gap-6 relative">
            <h2 className="text-4xl font-serif font-medium text-black leading-snug">
              {item.title.split(" ")[0]} in{" "}
              <span className="text-[#D54F2F]">{item.highlight}</span>
            </h2>

            <div className="relative text-lg text-[#333] leading-relaxed max-w-xl pl-8 pr-8">
              <span className="absolute -left-2 -top-2 text-[#D54F2F] text-4xl">
                &ldquo;
              </span>
              {item.quote}
              <span className="absolute -bottom-2 -right-2 text-[#D54F2F] text-4xl">
                &rdquo;
              </span>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
