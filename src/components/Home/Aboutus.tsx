"use client";

import Image from "next/image";
import Link from "next/link";

export default function AboutUs() {
  return (
    <section className="px-6 md:px-16 py-16 bg-gray-100 text-white">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 items-center">
        {/* Image */}
        <div className="w-full md:w-1/2 rounded-[120px_0px_120px_0px] overflow-hidden h-64 md:h-96">
          <Image
            src="/Images/Home/Aboutus.png" // replace with your actual path
            alt="Luxury Hotel Lobby"
            width={1200}
            height={900}
            className="w-full object-cover"
          />
        </div>

        {/* Text content */}
        <div className="w-full md:w-1/2 text-left">
          <h2 className="text-4xl md:text-5xl font-bold text-[#2C2C2C] mb-6 font-serif">
            About us
          </h2>
          <p className="text-gray-800 text-base mb-4 font-serif">
            HotelFirst is a boutique advisory firm dedicated to strategic
            solutions for the hospitality sector.
          </p>
          <p className="text-gray-800 text-base mb-4 font-serif">
            We work with hotel owners, developers, and investors to unlock asset
            value, improve performance, and ensure operator accountability
            through focused audits and data-led strategies.
          </p>
          <p className="text-gray-800 text-base mb-8 font-serif">
            With real-time market insight and sector expertise, we tailor every
            engagement to our client’s goals, delivering with clarity,
            precision, and speed.
          </p>
          <Link href="Aboutus">
            <button className="bg-[#F15A29] text-white font-semibold px-6 py-3 rounded shadow hover:bg-[#d94e21] transition duration-300">
              Learn more
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
