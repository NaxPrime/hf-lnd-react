"use client";

import Link from "next/link";

interface ServicesDropdownProps {
  onClose: () => void;
}

export default function ServicesDropdown({ onClose }: ServicesDropdownProps) {
  const handleLinkClick = () => {
    onClose();
  };

  return (
    <div className="absolute top-full mt-2 w-[398px] bg-white shadow-[7px_-6px_12px_6px_rgba(0,0,0,0.15),0px_4px_4px_0px_rgba(0,0,0,0.30)] rounded-tr-[20px] rounded-bl-[20px] rounded-br-[20px] flex flex-col items-start text-[#1E1E1E] text-base font-medium z-50 overflow-hidden">
      <Link
        href="/services/BrandSelection"
        onClick={handleLinkClick}
        className="hover:bg-[#F96430] hover:text-white w-full transition-colors duration-200 p-4 rounded-tr-[20px]"
      >
        Brand Selection & Contract Negotiation
      </Link>
      <Link
        href="/services/AssetManagement"
        onClick={handleLinkClick}
        className="hover:bg-[#F96430] hover:text-white transition-colors duration-200 p-4 w-full"
      >
        Asset Management & Owners Representation
      </Link>
      <Link
        href="/services/BusinessIntelligence"
        onClick={handleLinkClick}
        className="hover:bg-[#F96430] hover:text-white transition-colors duration-200 p-4 w-full"
      >
        Business Intelligence & Market Analysis
      </Link>
      <Link
        href="/services/MysteryAudit"
        onClick={handleLinkClick}
        className="hover:bg-[#F96430] hover:text-white transition-colors duration-200 p-4 w-full"
      >
        Mystery Audit & Quality Assurance
      </Link>
      <Link
        href="/services/AdhocConsultation"
        onClick={handleLinkClick}
        className="hover:bg-[#F96430] hover:text-white transition-colors duration-200 p-4 w-full rounded-bl-[20px] rounded-br-[20px]"
      >
        Operational Turnaround & Management Advisory
      </Link>
    </div>
  );
}
