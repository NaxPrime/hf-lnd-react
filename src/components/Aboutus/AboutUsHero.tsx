// app/components/AboutUs.tsx

import Image from "next/image";

export default function AboutUsHero() {
  return (
    <section className="flex flex-col md:flex-row items-center mt-[5rem] justify-center gap-10 px-6 md:px-16 py-12">
      <div className="w-full md:w-1/2">
        <Image
          src="/Images/aboutus.png"
          alt="Hotel Lobby"
          width={1200}
          height={800}
          className="rounded-2xl w-full object-cover"
          priority
        />
      </div>
      <div className="w-full md:w-1/2 text-center md:text-left">
        <h2 className="text-5xl md:text-6xl font-serif text-black">About us</h2>
      </div>
    </section>
  );
}
