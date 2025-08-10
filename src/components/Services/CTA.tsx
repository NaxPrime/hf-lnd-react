// app/components/CallToAction.tsx
"use client";

import { Mail } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

export default function CallToAction() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("https://formspree.io/f/xnnzpeoy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setEmail("");
      } else {
        alert("There was an error submitting your email. Please try again.");
      }
    } catch {
      alert("There was an error submitting your email. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="relative h-[25rem] bg-black/60 text-white flex items-center justify-center bg-cover bg-center">
        <div className="absolute inset-0 z-0">
         <Image src="/Images/cta.png" alt="Hero background" fill className="" />
          <div className="absolute inset-0 hidden" />
        </div>
        <div className="text-center px-4">
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
            <h2 className="text-3xl md:text-4xl font-serif mb-4">Thank You!</h2>
            <p className="text-lg md:text-xl mb-6">
              We&apos;ve received your email and will get back to you soon.
            </p>
          </div>
          <button
            onClick={() => setIsSubmitted(false)}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Subscribe Another Email
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[25rem] bg-black/60 text-white flex items-center justify-center bg-cover bg-center">
 <div className="absolute inset-0 z-0">
         <Image src="/Images/cta.png" alt="Hero background" fill className="" />
          <div className="absolute inset-0 hidden" />
        </div>
      <div className="text-center px-4">
        <h2 className="text-4xl md:text-5xl font-serif mb-2 leading-[2]">
          Begin your journey
        </h2>
        <h2 className="text-orange-500 text-4xl md:text-5xl font-serif mb-4 leading-[2]">
          with better insight.
        </h2>
        <form
          onSubmit={handleSubmit}
          className="mt-6 flex items-center justify-center max-w-xl mx-auto rounded-lg"
        >
          <div className="relative w-full">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Email Address"
              className="w-full pl-12 pr-4 py-3 rounded-l-lg text-black outline-none bg-white"
              required
            />
            <span className="absolute left-4 top-3.5 text-gray-400 text-xl">
              <Mail className="w-5 h-5" />
            </span>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-r-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Sending..." : "Send"}
          </button>
        </form>

        <p className="mt-6 text-lg md:text-xl font-serif">
          Or Reach out at:{" "}
          <span className="underline">begin@hotelfirst.one</span>
        </p>
      </div>
    </div>
  );
}
