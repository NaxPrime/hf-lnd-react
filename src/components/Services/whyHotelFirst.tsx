import { CheckCircle } from "lucide-react";

export default function WhyHotelFirst() {
  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Why Choose HotelFirst?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We bring decades of hospitality expertise and a proven track record
            of delivering exceptional results for our clients.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Experience */}
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">
              Decades of Experience
            </h3>
            <p className="text-gray-600">
              Our team brings over 25 years of combined experience in the
              hospitality industry, ensuring you get expert guidance.
            </p>
          </div>

          {/* Results */}
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Proven Results</h3>
            <p className="text-gray-600">
              We have successfully helped hundreds of hotels improve their
              operations and profitability through our strategic approach.
            </p>
          </div>

          {/* Personalized */}
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">
              Personalized Approach
            </h3>
            <p className="text-gray-600">
              Every hotel is unique. We tailor our solutions to meet your
              specific needs and challenges.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
