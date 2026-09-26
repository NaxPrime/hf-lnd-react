import Link from "next/link";
import { CheckCircle2, Clock3, Mail, ShieldCheck } from "lucide-react";

const requestEmail = "begin@hotelfirst.one";
const requestSubject = "Data Deletion Request";
const requestHref = `mailto:${requestEmail}?subject=${encodeURIComponent(requestSubject)}`;

const requestDetails = [
  "Your full name.",
  "The email address or telephone number you used with HotelFirst.",
  "Where you interacted with us, such as our website, Facebook or Instagram.",
  "Enough context to locate the record, such as an approximate inquiry date.",
];

const processSteps = [
  {
    title: "Send your request",
    description: `Email ${requestEmail} with the subject “${requestSubject}”.`,
  },
  {
    title: "Complete verification",
    description:
      "We may ask for limited information to confirm that the request concerns you. We will never ask for your password, one-time password or access token.",
  },
  {
    title: "Deletion and confirmation",
    description:
      "After verification, we will delete or anonymise eligible personal data and confirm completion, normally within 30 days.",
  },
];

export default function DataDeletionPage() {
  return (
    <main className="bg-slate-50 text-slate-800">
      <section className="border-b border-slate-200 bg-[#0F172A] text-white">
        <div className="mx-auto max-w-5xl px-6 pb-16 pt-32 sm:px-8 lg:px-12 lg:pb-20 lg:pt-36">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-400/40 bg-orange-400/10 px-4 py-2 text-sm font-semibold text-orange-200">
            <ShieldCheck aria-hidden="true" className="h-4 w-4" />
            Privacy request instructions
          </div>
          <h1 className="max-w-3xl font-serif text-4xl font-bold tracking-tight sm:text-5xl">
            Request deletion of your HotelFirst data
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            These instructions apply to personal data you provided to HotelFirst
            through our website, inquiry process, email, Facebook or Instagram
            integrations.
          </p>
          <p className="mt-5 text-sm text-slate-400">
            Effective date: 26 September 2026
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-5xl gap-8 px-6 py-12 sm:px-8 lg:grid-cols-[minmax(0,1fr)_19rem] lg:px-12 lg:py-16">
        <article className="space-y-10">
          <section aria-labelledby="request-heading" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-start gap-4">
              <span className="rounded-xl bg-orange-50 p-3 text-orange-600">
                <Mail aria-hidden="true" className="h-6 w-6" />
              </span>
              <div>
                <h2 id="request-heading" className="text-2xl font-bold text-slate-950">
                  How to submit a deletion request
                </h2>
                <p className="mt-3 leading-7 text-slate-600">
                  Email us from an address connected with your HotelFirst
                  interaction. Use the subject line <strong>{requestSubject}</strong>.
                </p>
              </div>
            </div>

            <ul className="mt-6 space-y-3">
              {requestDetails.map((detail) => (
                <li key={detail} className="flex gap-3 leading-7 text-slate-700">
                  <CheckCircle2 aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-orange-600" />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>

            <p className="mt-6 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
              Do not send passwords, one-time passwords, payment-card details,
              government identity numbers or Meta access tokens. If additional
              verification is necessary, we will explain what is required.
            </p>

            <a
              href={requestHref}
              className="mt-7 inline-flex min-h-12 items-center justify-center rounded-lg bg-orange-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              Email a deletion request
            </a>
          </section>

          <section aria-labelledby="process-heading">
            <h2 id="process-heading" className="text-2xl font-bold text-slate-950">
              What happens after you contact us
            </h2>
            <ol className="mt-6 space-y-4">
              {processSteps.map((step, index) => (
                <li key={step.title} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-6">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0F172A] font-bold text-white">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-950">{step.title}</h3>
                    <p className="mt-1 leading-7 text-slate-600">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="scope-heading" className="space-y-4">
            <h2 id="scope-heading" className="text-2xl font-bold text-slate-950">
              Scope and lawful retention
            </h2>
            <p className="leading-7 text-slate-600">
              A verified request may cover inquiry details, correspondence,
              marketing preferences and other personal data controlled by
              HotelFirst. We will also instruct relevant service providers to
              delete eligible data where the request applies to information they
              process for us.
            </p>
            <p className="leading-7 text-slate-600">
              Some information may be retained when necessary to comply with a
              legal obligation, resolve a dispute, prevent fraud or establish,
              exercise or defend legal claims. Where complete deletion is not
              permitted, we will restrict the information to the required purpose
              and explain that outcome in our response.
            </p>
            <p className="leading-7 text-slate-600">
              Deletion from active systems may not immediately remove encrypted
              backup copies. Those copies remain protected and expire through
              the normal backup-retention cycle.
            </p>
          </section>

          <section aria-labelledby="platform-heading" className="space-y-4">
            <h2 id="platform-heading" className="text-2xl font-bold text-slate-950">
              Facebook and Instagram data
            </h2>
            <p className="leading-7 text-slate-600">
              If your request concerns information shared with HotelFirst through
              Facebook or Instagram, identify the platform and the profile or
              account used. We can act on data under HotelFirst&apos;s control. To
              delete information controlled independently by Meta, use the
              privacy and account controls provided by Facebook or Instagram.
            </p>
          </section>
        </article>

        <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
          <section className="rounded-2xl bg-[#0F172A] p-6 text-white">
            <Clock3 aria-hidden="true" className="h-7 w-7 text-orange-400" />
            <h2 className="mt-4 text-xl font-bold">Expected response</h2>
            <p className="mt-3 leading-7 text-slate-300">
              We aim to acknowledge requests within seven business days and
              complete verified requests normally within 30 days.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-bold text-slate-950">Related policies</h2>
            <nav aria-label="Related privacy pages" className="mt-4 flex flex-col gap-3">
              <Link className="font-semibold text-orange-700 underline-offset-4 hover:underline" href="/privacy-policy">
                Privacy Policy
              </Link>
              <Link className="font-semibold text-orange-700 underline-offset-4 hover:underline" href="/terms-and-conditions">
                Terms and Conditions
              </Link>
            </nav>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 text-sm leading-6 text-slate-600">
            <h2 className="font-bold text-slate-950">Data contact</h2>
            <p className="mt-2">HotelFirst Advisory</p>
            <a className="break-all font-semibold text-orange-700 hover:underline" href={`mailto:${requestEmail}`}>
              {requestEmail}
            </a>
          </section>
        </aside>
      </div>
    </main>
  );
}
