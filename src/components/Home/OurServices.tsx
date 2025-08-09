"use client";

import { ArrowRight } from "lucide-react";

export default function OurServices() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-12">
          At HotelFirst, we offer two core service verticals, each designed to
          deliver high-impact outcomes through strategic depth, operational
          clarity, and intelligent execution.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Service Card 1 */}
          <div className="bg-white p-8 rounded-xl shadow-md text-left">
            <h3 className="text-xl font-semibold mb-2">
              Strategy & Asset Advisory
            </h3>
            <p className="text-gray-600 mb-4">
              Supporting ownership, investment, and development decisions
              through structured, insight-led engagement.
            </p>
            <div className="text-gray-800 mb-4">
              <p className="font-semibold mb-2">Key Areas:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Brand Selection & Contract Negotiation</li>
                <li>Business Intelligence & Market Studies</li>
                <li>Asset Management Solutions</li>
              </ul>
            </div>
            <a
              href="services/AssetManagement"
              className="text-green-600 font-semibold flex items-center gap-2 hover:underline"
            >
              Learn More <ArrowRight size={16} />
            </a>
          </div>

          {/* Service Card 2 */}
          <div className="bg-white p-8 rounded-xl shadow-md text-left">
            <h3 className="text-xl font-semibold mb-2">
              Operational Performance & Assurance
            </h3>
            <p className="text-gray-600 mb-4">
              Addressing on-ground performance gaps and service quality through
              audit-led evaluation and operational realignment.
            </p>
            <div className="text-gray-800 mb-4">
              <p className="font-semibold mb-2">Key Areas:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Mystery Audits & Quality Assurance</li>
                <li>Performance Optimization & Turnarounds</li>
              </ul>
            </div>
            <a
              href="services/AdhocConsultation"
              className="text-green-600 font-semibold flex items-center gap-2 hover:underline"
            >
              Learn More <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
