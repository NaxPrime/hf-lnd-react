"use client";

import { useState } from "react";

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    agree: false,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("https://formspree.io/f/xnnzpeoy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
          agree: false,
        });
      } else {
        alert("There was an error submitting the form. Please try again.");
      }
    } catch {
      alert("There was an error submitting the form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div
        className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center mt-[5rem] justify-center"
        style={{ backgroundImage: 'url("/Images/hero.jpg")' }}
      >
        <div className="w-full max-w-2xl px-4 py-12">
          <div className="bg-white shadow-lg rounded-xl p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Thank You!
              </h2>
              <p className="text-gray-600 mb-6">
                Your message has been sent successfully. We&apos;ll get back to
                you as soon as possible.
              </p>
            </div>
            <button
              onClick={() => setIsSubmitted(false)}
              className="bg-orange-500 text-white px-6 py-2 rounded font-semibold hover:bg-orange-600 transition"
            >
              Send Another Message
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center mt-[5rem] justify-center"
      style={{ backgroundImage: 'url("/Images/hero.jpg")' }}
    >
      <div className="w-full max-w-7xl px-4 py-12 flex flex-col md:flex-row items-start justify-between gap-10">
        {/* Left side */}
        <div className="text-white max-w-md">
          <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-8">
            Contact us
          </h2>

          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-1">Email Address</h3>
            <div className="border-t w-10 border-white mb-2" />
            <p className="text-xl font-bold">begin@hotelfirst.one</p>
            <p className="text-sm">
              Assistance hours:
              <br />
              Monday - Friday 9 am to 6pm IST
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-1">Number</h3>
            <div className="border-t w-10 border-white mb-2" />
            <p className="text-xl font-bold">+91 90528 88789</p>
            <p className="text-sm">
              Assistance hours:
              <br />
              Monday - Friday 9 am to 6pm IST
            </p>
          </div>
        </div>

        {/* Right side - form */}
        <div className="bg-white shadow-lg rounded-xl w-full md:w-1/2 p-8">
          <h3 className="text-2xl font-bold mb-6 text-center">
            Let&apos;s Get In Touch.
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                First Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter your full name..."
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="Enter your Email address"
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <div className="flex border rounded overflow-hidden">
                <span className="flex items-center px-3 bg-gray-100 text-sm">
                  🇮🇳 +91
                </span>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="9505455999"
                  className="flex-1 px-3 py-2 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={4}
                placeholder="Enter your message"
                className="w-full border rounded px-3 py-2"
              ></textarea>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="agree"
                name="agree"
                checked={formData.agree}
                onChange={handleInputChange}
                required
              />
              <label htmlFor="agree" className="text-sm">
                I hereby agree to our Privacy Policy terms.
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-orange-500 text-white py-2 rounded font-semibold hover:bg-orange-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Sending..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
