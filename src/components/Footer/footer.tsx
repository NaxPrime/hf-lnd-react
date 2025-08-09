"use client";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#0F172A] text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <Image
                width={200}
                height={100}
                src="/logos/hotelfirst_logo_horizontal_BgNavieblue.svg"
                alt="HotelFirst Logo"
                className=" "
              />
            </Link>
            <p className="text-gray-300 text-justify mb-4 max-w-[30rem]">
              HotelFirst is a leading hospitality consulting firm specializing
              in hotel operations, asset management, and strategic advisory
              services.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
              >
                LinkedIn
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Twitter
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Instagram
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/Aboutus"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/Contact"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/services/BrandSelection"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Brand Selection
                </Link>
              </li>
              <li>
                <Link
                  href="/services/AssetManagement"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Asset Management
                </Link>
              </li>
              <li>
                <Link
                  href="/services/BusinessIntelligence"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Business Intelligence
                </Link>
              </li>
              <li>
                <Link
                  href="/services/MysteryAudit"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Mystery Audit
                </Link>
              </li>
              <li>
                <Link
                  href="/services/AdhocConsultation"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Adhoc Consultation
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-row justify-between border-t border-gray-700 text-center mt-8 pt-8  ">
          <div className="">
            <p className="text-gray-300">
              © 2025 HotelFirst. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-4">
            {/* <a
              href="#"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Legal Notice
            </a> */}
            <a
              href="/privacy-policy"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="/terms-and-conditions"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Terms of Use
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
