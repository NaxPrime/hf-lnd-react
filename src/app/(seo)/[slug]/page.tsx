import { Metadata } from 'next';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const titleSlug = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return {
    title: `${titleSlug} | HotelFirst`,
    description: `HotelFirst provides expert ${titleSlug.toLowerCase()} solutions to help hotels increase revenue, occupancy, and profitability.`,
  };
}

export default async function ProgrammaticSEOPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const titleSlug = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="min-h-screen pt-24 bg-gray-50 text-[#1E1E1E]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-6 font-serif">{titleSlug} Experts</h1>
        
        <div className="prose prose-lg max-w-none text-gray-700">
          <p className="mb-6">
            Welcome to HotelFirst&apos;s premier <strong>{titleSlug.toLowerCase()}</strong> services. 
            We specialize in driving measurable results for hospitality properties looking to optimize their performance, 
            reduce dependency on OTAs, and maximize overall profitability.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4 mt-8 font-serif">Comprehensive {titleSlug} Strategies</h2>
          <p className="mb-6">
            The modern hospitality landscape is more competitive than ever. 
            Through strategic consulting, advanced data analysis, and proven implementation methodologies, 
            our {titleSlug.toLowerCase()} solutions are designed to immediately impact your bottom line. 
            We look at your entire digital and operational footprint to uncover hidden revenue opportunities.
          </p>

          <div className="bg-white shadow-md rounded-lg p-8 mt-8 border border-gray-100">
            <h3 className="text-xl font-semibold mb-4 font-serif">Why Choose HotelFirst?</h3>
            <ul className="list-disc pl-6 space-y-3">
              <li>Data-driven approach to maximizing RevPAR and occupancy.</li>
              <li>Tailored strategies specific to your market and property type.</li>
              <li>Expert team with decades of combined hospitality experience.</li>
              <li>Focus on direct bookings to lower commission costs.</li>
            </ul>
          </div>

          <h2 className="text-2xl font-semibold mb-4 mt-12 font-serif">Get Started Today</h2>
          <p className="mb-6">
            Ready to elevate your property&apos;s performance? Our team is ready to conduct a full audit 
            of your current setup and provide an actionable roadmap. 
          </p>
          <Link href="/Contact" className="inline-block bg-[#F96430] text-white px-8 py-3 rounded font-medium hover:bg-[#e15525] transition mt-4">
            Request a Consultation
          </Link>
        </div>
      </div>
    </div>
  );
}
