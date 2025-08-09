import Image from "next/image";

interface WhatWeDoItem {
  title: string;
  highlight: string;
  description: string;
  image: string;
}

export default function WhatWeDoSection({ items }: { items: WhatWeDoItem[] }) {
  return (
    <section
      className="relative py-24 px-4 md:px-12"
      style={{
        background: "linear-gradient(180deg, #FFF 0%, #FEEFEA 100%)",
      }}
    >
      <h2 className="text-center text-3xl font-serif font-semibold mb-20">
        What we do
      </h2>

      <div className="relative max-w-6xl mx-auto flex flex-col gap-40">
        {items.map((item, index) => {
          const isEven = index % 2 === 0;
          const nextImageExists = index < items.length - 1;

          return (
            <div key={index} className="relative z-10">
              {/* Card */}
              <div
                className={`relative flex flex-col md:flex-row items-start gap-10 md:gap-24 ${
                  !isEven ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Text */}
                <div className="md:w-1/2 px-4">
                  <h3 className="text-2xl font-medium mb-2 leading-snug">
                    <span className="text-[#D54F2F]">{item.highlight}</span>{" "}
                    {item.title.replace(item.highlight, "")}
                  </h3>
                  <p className="text-gray-700 text-base">{item.description}</p>
                </div>

                {/* Image */}
                <div className="md:w-1/2 w-full relative aspect-[16/10] rounded-xl overflow-hidden shadow-lg z-50">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Connector SVG (between current and next item) */}
              {nextImageExists && (
                <div
                  className={`absolute w-[431px] h-[400px] ${
                    isEven
                      ? "left-[5%] md:left-[20%] z-0"
                      : "right-[5%] md:right-[20%] flip scale-x-[-1] z-0"
                  } top-[80%]`}
                >
                  <svg
                    width="431"
                    height="400"
                    viewBox="0 0 431 400"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full"
                  >
                    <path
                      d="M431.001 1.21681H95.5006C64.1673 -1.11652 1.50062 14.4168 1.50062 95.2168C1.50062 176.017 1.5 273.5 1.5 399.5"
                      stroke="black"
                      strokeWidth="2"
                      strokeLinejoin="round"
                      strokeDasharray="8 8"
                    />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
