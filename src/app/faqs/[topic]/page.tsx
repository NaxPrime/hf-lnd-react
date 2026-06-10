import { Metadata } from 'next';
import FAQSchema from '@/components/SEO/FAQSchema';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ topic: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const topic = resolvedParams.topic.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return {
    title: `${topic} FAQs | HotelFirst`,
    description: `Frequently asked questions about ${topic.toLowerCase()} in the hospitality industry.`,
  };
}

export default async function FAQPage({ params }: { params: Promise<{ topic: string }> }) {
  const resolvedParams = await params;
  const topic = resolvedParams.topic.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  const faqs = [
    {
      question: `What is the importance of ${topic.toLowerCase()}?`,
      answer: `Effective ${topic.toLowerCase()} is crucial for maximizing revenue and ensuring long-term profitability in the highly competitive hospitality market.`
    },
    {
      question: `How can HotelFirst help with ${topic.toLowerCase()}?`,
      answer: `HotelFirst leverages deep industry expertise and data-driven strategies to optimize your ${topic.toLowerCase()} processes, reducing OTA dependency and increasing direct bookings.`
    },
    {
      question: `How quickly can we see results from ${topic.toLowerCase()}?`,
      answer: `While some operational improvements can yield immediate results within weeks, full strategic implementation of ${topic.toLowerCase()} typically shows significant ROI within 3 to 6 months.`
    }
  ];

  return (
    <div className="min-h-screen pt-24 bg-gray-50 text-[#1E1E1E]">
      <FAQSchema faqs={faqs} />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 font-serif">Frequently Asked Questions: {topic}</h1>
        
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold mb-3 font-serif text-[#F96430]">{faq.question}</h3>
              <p className="text-gray-700">{faq.answer}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center bg-white p-8 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold mb-4 font-serif">Still have questions?</h2>
          <p className="text-gray-600 mb-6">Our experts are ready to help you optimize your property.</p>
          <Link href="/Contact" className="inline-block bg-[#F96430] text-white px-8 py-3 rounded font-medium hover:bg-[#e15525] transition">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
