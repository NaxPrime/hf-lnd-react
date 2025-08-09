// ./src/app/terms-and-conditions/page.tsx
import React from "react";

export default function TermsAndConditions() {
  return (
    <main className="px-[120px] py-[7.5rem] bg-white text-gray-800">
      <article id="terms-conditions" className="prose max-w-none">
        <h1 className="text-4xl font-bold mb-4">Terms &amp; Conditions</h1>
        <p className="mb-6">
          <strong>Effective Date:</strong> 01/09/2025
        </p>

        <p className="mb-6">
          By accessing{" "}
          <a
            href="https://www.hotelfirst.one"
            className="text-blue-600 underline hover:text-blue-800"
          >
            www.hotelfirst.one
          </a>{" "}
          or engaging HotelFirst (&quot;we&quot;, &quot;us&quot;, or
          &quot;our&quot;), you agree to be bound by these Terms &amp;
          Conditions (&quot;Terms&quot;). If you do not accept these Terms, do
          not use our website or services.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Definitions</h2>
        <ul className="list-disc pl-6 marker:text-orange-500">
          <li>
            <strong>Client:</strong> any person or entity engaging
            HotelFirst&apos;s services.
          </li>
          <li>
            <strong>Services:</strong> consulting, advisory, audits, feasibility
            studies, asset management and related services.
          </li>
          <li>
            <strong>Website:</strong> www.hotelfirst.one and its content.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          2. Scope &amp; Engagement
        </h2>
        <p>
          Services are provided only under a written proposal, engagement letter
          or contract. No work is deemed to commence until the relevant
          agreement is signed. HotelFirst may decline or suspend services at its
          discretion.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          3. Fees &amp; Payment
        </h2>
        <ul className="list-disc pl-6 marker:text-orange-500">
          <li>
            Fees, payment schedules and invoicing are specified in the
            engagement letter.
          </li>
          <li>
            Late payments may incur interest at 2% per month or the maximum rate
            permitted by law.
          </li>
          <li>Unless expressly stated, fees are non-refundable.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          4. Intellectual Property
        </h2>
        <p>
          All material, methodologies, templates and deliverables created by
          HotelFirst remain our exclusive property unless otherwise agreed in
          writing. Clients receive a licence to use deliverables for their
          internal business purposes only; commercial redistribution is
          prohibited without prior written consent.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Confidentiality</h2>
        <p>
          Each party shall keep confidential all proprietary information
          disclosed during an engagement. HotelFirst may reference work for
          marketing only in anonymised form unless otherwise restricted in
          writing.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">6. Disclaimers</h2>
        <p>
          Services are provided on an &quot;as is&quot; basis. While we exercise
          due care, HotelFirst makes no warranties—express or implied—regarding
          results or fitness for a particular purpose. Clients retain
          responsibility for decisions made using our advice or deliverables.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          7. Limitation of Liability
        </h2>
        <p>
          To the fullest extent permitted by law, HotelFirst will not be liable
          for indirect, special, incidental or consequential damages. Our
          aggregate liability for any claim shall not exceed the fees paid for
          the specific engagement giving rise to the claim.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">8. Termination</h2>
        <p>
          Either party may terminate an engagement in accordance with the
          engagement letter. HotelFirst may terminate immediately for material
          breach, non-payment or misuse of deliverables. Outstanding fees become
          payable on termination.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          9. Compliance &amp; Use
        </h2>
        <p>
          Clients agree to use services and content lawfully and in compliance
          with applicable Indian laws, including the Information Technology Act,
          2000 and the Digital Personal Data Protection Act, 2023.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">10. Amendments</h2>
        <p>
          We may amend these Terms at any time. Updated Terms will be posted on
          the Website. Continued use of the Website after posting constitutes
          acceptance of the changes.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          11. Governing Law &amp; Jurisdiction
        </h2>
        <p>
          These Terms are governed by the laws of India. Disputes shall be
          subject to the exclusive jurisdiction of the courts in Visakhapatnam,
          Andhra Pradesh.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">12. Contact</h2>
        <p>For queries relating to these Terms:</p>
        <address className="not-italic">
          HotelFirst
          <br />
          Email:{" "}
          <a
            href="mailto:begin@hotelfirst.one"
            className="text-blue-600 underline hover:text-blue-800"
          >
            begin@hotelfirst.one
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
