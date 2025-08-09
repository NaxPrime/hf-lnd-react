"use client";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative h-[100vh] w-full text-white">
      {/* Background Image */}
      <Image
        src="/Images/hero.jpg"
        alt="Hotel Lobby"
        width={1920}
        height={1080}
        objectPosition="center"
        className="absolute inset-0 w-full h-full object-cover z-0"
        priority
      />

      {/* Content */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex flex-col justify-center">
        <h1 className="text-4xl md:text-6xl font-semibold text-white leading-tight font-serif">
          Strategic Hotel Advisory, <br />
          <span className="block mt-2">Delivered First.</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-gray-200 max-w-xl font-serif">
          Creating Value. Strengthening Performance. Guiding Decisions.
        </p>
        <Link
          href="/Contact"
          className="w-fit bg-[#F96430] text-white text-center py-2 px-6 mt-4 rounded-sm font-medium text-xl hover:bg-[#e15525] transition duration-300 rounded-full"
        >
          Request Consultation
        </Link>
      </div>
    </section>
  );
}
