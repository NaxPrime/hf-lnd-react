"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import ServicesDropdown from "./ServicesDropdown";
import Image from "next/image";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isServicesOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        servicesRef.current &&
        !servicesRef.current.contains(event.target as Node)
      ) {
        setIsServicesOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isServicesOpen]);

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-[#1E1E1E]">
          <Image
            width={200}
            height={100}
            src="/logos/hotelfirst_logo_horizontal_default.png"
            alt="HotelFirst Logo"
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex flex-1 justify-center items-center space-x-8">
          <Link href="/" className="hover:text-[#F96430] transition-colors">
            Home
          </Link>

          {/* Services Dropdown (Click-based) */}
          <div className="relative services-dropdown-parent" ref={servicesRef}>
            <button
              className="hover:text-[#F96430] transition-colors"
              type="button"
              onClick={() => setIsServicesOpen(!isServicesOpen)}
            >
              Services
            </button>

            {isServicesOpen && (
              <div className="absolute top-full left-0 z-50">
                <ServicesDropdown onClose={() => setIsServicesOpen(false)} />
              </div>
            )}
          </div>

          <Link
            href="/Aboutus"
            className="hover:text-[#F96430] transition-colors"
          >
            About
          </Link>
          <Link
            href="/Contact"
            className="hover:text-[#F96430] transition-colors"
          >
            Contact
          </Link>
        </div>

        {/* Consultation Button */}
        <div className="hidden md:flex">
          <Link
            href="/Contact"
            className="bg-[#F96430] text-white px-5 py-2 rounded-sm font-medium hover:bg-[#e15525] transition"
          >
            Request Consultation
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white px-4 pb-4 space-y-4">
          <Link href="/" className="block hover:text-[#F96430]">
            Home
          </Link>

          {/* Mobile Dropdown Toggle (Click-based) */}
          <div className="relative services-dropdown-parent" ref={servicesRef}>
            <button
              className="hover:text-[#F96430] transition-colors"
              type="button"
              onClick={() => setIsServicesOpen(!isServicesOpen)}
            >
              Services
            </button>

            {isServicesOpen && (
              <div className="pl-4 pt-2">
                <ServicesDropdown onClose={() => setIsServicesOpen(false)} />
              </div>
            )}
          </div>

          <Link href="/Aboutus" className="block hover:text-[#F96430]">
            About
          </Link>
          <Link href="/Contact" className="block hover:text-[#F96430]">
            Contact
          </Link>

          <Link
            href="/Contact"
            className="block bg-[#F96430] text-white text-center py-2 rounded-sm font-medium hover:bg-[#e15525] transition"
          >
            Request Consultation
          </Link>
        </div>
      )}
    </nav>
  );
}
