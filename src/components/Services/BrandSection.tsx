// components/BrandSection.tsx

import Image from "next/image";

interface CardItem {
  image: string;
  title: string;
  items: string[];
  disabled?: boolean;
}

interface BrandSectionProps {
  cards: CardItem[];
}

export default function BrandSection({ cards }: BrandSectionProps) {
  // Remove disabled cards completely
  const visibleCards = cards.filter((card) => !card.disabled);

  return (
    <section
      className="py-20 px-4 md:px-12"
      style={{
        background: "linear-gradient(180deg, #FFF 0%, #FEEFEA 100%)",
      }}
    >
      <div
        className={`max-w-6xl mx-auto grid gap-10 ${
          visibleCards.length === 1
            ? "grid-cols-1 place-items-center"
            : "grid-cols-1 md:grid-cols-2"
        }`}
      >
        {visibleCards.map((card, idx) => (
          <div
            key={idx}
            className="rounded-3xl overflow-hidden border border-gray-200 bg-white"
          >
            {/* Card Image */}
            <div className="relative h-48 md:h-56">
              <Image
                src={card.image}
                alt={card.title}
                fill
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-black/20" />
            </div>

            {/* Card Content */}
            <div className="p-8">
              <h3 className="text-3xl font-serif font-medium text-gray-900 mb-6">
                {card.title}
              </h3>
              <ul className="list-disc pl-5 text-gray-600 space-y-3 text-lg leading-relaxed">
                {card.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
