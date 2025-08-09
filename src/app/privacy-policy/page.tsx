// ./src/app/privacy-policy/page.tsx
import React from "react";

export default function PrivacyPolicy() {
  return (
    <main className="px-[120px] py-[7.5rem] bg-white text-gray-800">
      <article id="privacy-policy" className="prose max-w-none">
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="mb-6">
          <strong>Effective Date:</strong> 01/09/2025
        </p>

        <p className="mb-6">
          HotelFirst (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) values
          your privacy and is committed to protecting your personal data. This
          Privacy Policy explains how we collect, use, store and share
          information when you use{" "}
          <a
            href="https://www.hotelfirst.one"
            className="text-blue-600 underline hover:text-blue-800"
          >
            www.hotelfirst.one
          </a>{" "}
          or engage our services.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          1. Information We Collect
        </h2>
        <ul className="list-disc pl-6 marker:text-orange-500">
          <li>
            <strong>Personal Information:</strong> name, email address, phone
            number, company name, billing information.
          </li>
          <li>
            <strong>Usage Data:</strong> IP address, browser type, device
            information, pages visited, date/time of visits.
          </li>
          <li>
            <strong>Communications:</strong> messages sent to us via email,
            contact forms or other channels.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          2. How We Use Your Information
        </h2>
        <ul className="list-disc pl-6 marker:text-orange-500">
          <li>To provide and manage our services.</li>
          <li>To respond to your inquiries and requests.</li>
          <li>
            To send important updates, service notices and marketing materials
            (where permitted).
          </li>
          <li>To comply with legal obligations.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          3. Legal Basis for Processing
        </h2>
        <p>
          We process your personal data based on your consent, the necessity to
          perform a contract, compliance with legal obligations or our
          legitimate interests as defined under applicable laws, including the
          Digital Personal Data Protection Act, 2023 (India) and the General
          Data Protection Regulation (EU).
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          4. Data Sharing &amp; Disclosure
        </h2>
        <p>We do not sell your personal data. We may share it with:</p>
        <ul className="list-disc pl-6 marker:text-orange-500">
          <li>
            Service providers assisting in operations (e.g., hosting, payment
            processing, analytics).
          </li>
          <li>Legal authorities when required by law.</li>
          <li>Business partners only with your explicit consent.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Data Retention</h2>
        <p>
          We retain your personal data only as long as necessary for the
          purposes described in this policy or as required by law.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">6. Your Rights</h2>
        <ul className="list-disc pl-6 marker:text-orange-500">
          <li>Access, correct or delete your personal data.</li>
          <li>
            Withdraw consent at any time where processing is based on consent.
          </li>
          <li>Object to or restrict certain types of data processing.</li>
          <li>Request data portability.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">7. Data Security</h2>
        <p>
          We implement reasonable administrative, technical and physical
          safeguards to protect your information from loss, misuse, unauthorised
          access, disclosure, alteration and destruction.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          8. International Data Transfers
        </h2>
        <p>
          Where applicable, we ensure adequate protection for personal data
          transferred outside your jurisdiction through standard contractual
          clauses or other lawful mechanisms.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          9. Cookies &amp; Tracking Technologies
        </h2>
        <p>
          We use cookies and similar technologies to enhance user experience,
          analyse usage and deliver relevant content. You can manage cookie
          preferences in your browser settings.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          10. Changes to This Privacy Policy
        </h2>
        <p>
          We may update this policy from time to time. Updates will be posted on
          our Website with a revised &quot;Effective Date&quot;. Continued use
          of our services after posting constitutes acceptance of the updated
          policy.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">11. Contact Us</h2>
        <p>For any privacy-related questions or concerns:</p>
        <address className="not-italic">
          HotelFirst
          <br />
          Email:{" "}
          <a
            href="mailto:privacy@hotelfirst.one"
            className="text-blue-600 underline hover:text-blue-800"
          >
            privacy@hotelfirst.one
          </a>
          <br />
          Website:{" "}
          <a
            href="https://www.hotelfirst.one"
            className="text-blue-600 underline hover:text-blue-800"
          >
            www.hotelfirst.one
          </a>
        </address>
      </article>
    </main>
  );
}
