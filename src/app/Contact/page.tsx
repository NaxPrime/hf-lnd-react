"use client";

import { useEffect, useRef, useState } from "react";
import { trackFormSubmit, trackCustomEvent, trackLead } from "@/lib/analytics";

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const submittingRef = useRef(false);
  const submissionIdRef = useRef<string | null>(null);
  const measuredSubmissionIdRef = useRef<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    agree: false,
    advertisingConsent: false,
  });

  useEffect(() => {
    try {
      const savedEmail = sessionStorage.getItem("hotelfirst_contact_email") || "";
      sessionStorage.removeItem("hotelfirst_contact_email");
      if (savedEmail.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(savedEmail)) {
        setFormData((current) => ({ ...current, email: savedEmail }));
      }
    } catch { /* The contact form remains usable when browser storage is unavailable. */ }
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!hasStarted) {
      setHasStarted(true);
      trackCustomEvent("contact_form_started");
    }
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submittingRef.current) return;
    submittingRef.current = true;
    setIsSubmitting(true);
    setSubmissionError("");

    try {
      submissionIdRef.current ||= crypto.randomUUID();
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, submissionId: submissionIdRef.current }),
      });
      const result = await response.json();
      if (response.ok && result?.ok === true && result.accepted === true && result.eventId === submissionIdRef.current) {
        setIsSubmitted(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
          agree: false,
          advertisingConsent: false,
        });
        // Measurement must never invalidate an already accepted inquiry.
        // A replay may be the first confirmation this browser receives after a
        // lost response. Deduplicate by measurement here, not by server receipt.
        if (measuredSubmissionIdRef.current !== result.eventId) {
          measuredSubmissionIdRef.current = result.eventId;
          try {
            trackFormSubmit("contact_form");
            trackCustomEvent("contact_form_submitted", { form_name: "contact_form" });
            trackLead({ form_name: "contact_form" }, result.eventId, result.advertisingEligible === true);
          } catch { /* Submission succeeded independently of analytics. */ }
        }
      } else {
        const messages: Record<string, string> = {
          delivery_disabled: "Online inquiry delivery is unavailable here. No message was sent. Please contact begin@hotelfirst.one.",
          delivery_unconfigured: "Online inquiries are temporarily unavailable. Please contact begin@hotelfirst.one.",
          abuse_control_unavailable: "Online inquiries are temporarily unavailable. Please try again later.",
          rate_limited: "Too many attempts. Please wait before trying again.",
          delivery_pending: "An earlier attempt is still unconfirmed. Please contact begin@hotelfirst.one before sending it again.",
          delivery_unconfirmed: "We could not confirm delivery. Please contact begin@hotelfirst.one before sending it again.",
          invalid_fields: "Please check your name, email, Indian mobile number and message.",
          consent_required: "Please accept the Privacy Policy before sending your inquiry.",
          body_too_large: "Your message is too long. Please shorten it and try again.",
        };
        const code = typeof result?.code === "string" ? result.code : "";
        setSubmissionError(Object.prototype.hasOwnProperty.call(messages, code) ? messages[code] : "We could not submit your inquiry. Please check the form and try again.");
      }
    } catch {
      setSubmissionError("Delivery could not be confirmed. Please contact begin@hotelfirst.one if you are unsure before sending again.");
    } finally {
      submittingRef.current = false;
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
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                Thank You!
              </h1>
              <p className="text-gray-600 mb-6">
                Your message has been sent successfully. We&apos;ll get back to
                you as soon as possible.
              </p>
            </div>
            <button
              onClick={() => {
                submissionIdRef.current = null;
                measuredSubmissionIdRef.current = null;
                setHasStarted(false);
                setSubmissionError("");
                setIsSubmitted(false);
              }}
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
          <h1 className="text-3xl md:text-4xl font-serif font-semibold mb-8">
            Contact us
          </h1>

          <div className="mb-6">
            <h2 className="font-semibold text-lg mb-1">Email Address</h2>
            <div className="border-t w-10 border-white mb-2" />
            <p className="text-xl font-bold">
              <a href="mailto:begin@hotelfirst.one" onClick={() => trackCustomEvent("email_clicked")}>
                begin@hotelfirst.one
              </a>
            </p>
            <p className="text-sm">
              Assistance hours:
              <br />
              Monday - Friday 9 am to 6pm IST
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-lg mb-1">Number</h2>
            <div className="border-t w-10 border-white mb-2" />
            <p className="text-xl font-bold">
              <a href="tel:+919052888789" onClick={() => trackCustomEvent("phone_clicked")}>
                +91 90528 88789
              </a>
            </p>
            <p className="text-sm">
              Assistance hours:
              <br />
              Monday - Friday 9 am to 6pm IST
            </p>
          </div>
        </div>

        {/* Right side - form */}
        <div className="bg-white shadow-lg rounded-xl w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Let&apos;s Get In Touch.
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                First Name
              </label>
              <input
                type="text"
                name="name"
                maxLength={120}
                disabled={isSubmitting}
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
                maxLength={254}
                disabled={isSubmitting}
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
                  maxLength={30}
                  disabled={isSubmitting}
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
                maxLength={5000}
                disabled={isSubmitting}
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
                disabled={isSubmitting}
                checked={formData.agree}
                onChange={handleInputChange}
                required
              />
              <label htmlFor="agree" className="text-sm">
                I agree to the{" "}
                <a
                  href="/privacy-policy"
                  className="underline hover:text-orange-600"
                  target="_blank"
                  rel="noreferrer"
                >
                  Privacy Policy
                </a>
                .
              </label>
            </div>

            <div className="flex items-start space-x-2">
              <input type="checkbox" id="advertisingConsent" name="advertisingConsent"
                checked={formData.advertisingConsent} onChange={handleInputChange} disabled={isSubmitting} />
              <label htmlFor="advertisingConsent" className="text-sm">
                Optional: allow HotelFirst to share my email and phone in hashed form, IP address and browser information with Meta to measure advertising results. My message will not be shared with Meta. I can send this inquiry without agreeing.
              </label>
            </div>

            {submissionError && <p role="alert" className="text-sm text-red-700">{submissionError}</p>}

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
