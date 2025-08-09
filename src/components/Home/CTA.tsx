"use client";

import { useState } from "react";
import Image from "next/image";
import { Mail } from "lucide-react";

export default function CallToAction() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      const formData = new FormData();
      formData.append("email", email);

      const response = await fetch("https://formspree.io/f/xnnzpeoy", {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setStatus("success");
        setEmail("");
      } else {
        console.error("Formspree error:", result);
        setStatus("error");
      }
    } catch (error) {
      console.error("Submission failed:", error);
      setStatus("error");
    }
  };

  const resetForm = () => {
    setStatus("idle");
    setEmail("");
  };

  return (
    <div className="relative h-[25rem] bg-black/60 text-white flex items-center justify-center bg-cover bg-center">
      {/* Use an absolutely positioned Image component as the background */}
      <div className="absolute inset-0 z-0">
        <Image src="/images/cta.png" alt="Hero background" fill className="" />
        <div className="absolute inset-0 hidden" />
      </div>
      <div className="text-center px-4 z-10">
        {status === "success" ? (
          <>
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
              <h2 className="text-3xl md:text-4xl font-serif mb-4">
                Thank You!
              </h2>
              <p className="text-lg md:text-xl mb-6">
                We&apos;ve received your email and will get back to you soon.
              </p>
            </div>
            <button
              onClick={resetForm}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Subscribe Another Email
            </button>
          </>
        ) : (
          <>
            <h2 className="text-4xl md:text-5xl font-[Montaga] mb-4">
              Ready to begin? <br />
              <span className="text-orange-500">Let&apos;s talk strategy.</span>
            </h2>

            <form
              onSubmit={handleSubmit}
              className="mt-6 flex items-center justify-center max-w-xl mx-auto"
            >
              <div className="relative w-full">
                <input
                  type="email"
                  name="email"
                  placeholder="Enter Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-l-lg text-black outline-none"
                  required
                />
                <span className="absolute left-4 top-3.5 text-gray-400 text-xl">
                  <Mail className="w-5 h-5" />
                </span>
              </div>
              <button
                type="submit"
                disabled={status === "submitting"}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-r-lg transition-colors disabled:opacity-60"
              >
                {status === "submitting" ? "Sending..." : "Send"}
              </button>
            </form>

            {status === "error" && (
              <p className="mt-4 text-red-400 text-sm">
                Something went wrong. Please try again.
              </p>
            )}
          </>
        )}

        <p className="mt-6 text-lg md:text-xl font-serif">
          Or Reach out at:{" "}
          <span className="underline">begin@hotelfirst.one</span>
        </p>
      </div>
    </div>
  );
}
