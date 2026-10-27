# HotelFirst website enquiries: Google Sheets handoff

Updated: 27 October 2026 IST. This document records implementation and release checks; confirm live delivery separately on the production domain. The four Production variables below were added to the verified `hf-lnd-react` Vercel project as sensitive values. Vercel applies them to deployments created after configuration.

## Production verification, 27 October 2026 IST

- Website commit `66e14b5` was pushed to `NaxPrime/hf-lnd-react` main and deployed directly to Vercel Production as `dpl_FzBkGS8smU1G8CxmBGy3YvXnFfRW`. Both `hotelfirst.one` and `www.hotelfirst.one` resolve to that Ready deployment.
- The live Contact page returned HTTP 200. A malformed inquiry was rejected with HTTP 400.
- One clearly marked synthetic inquiry returned `accepted: true` and created a 21-column row with IST, UTC and campaign attribution. A repeat with the same UUID returned `replay: true` and did not create another row. Advertising consent was false, so no Meta event was requested.
- The synthetic row was deleted after verification; the `Enquiries` tab had zero data rows afterward. No real customer enquiry was submitted by this test.
- The live release-gate verifier passed 68 checks with zero failures.

## Sheet and access

- Workbook: `HotelFirst Advisory | Website Enquiries`.
- Sheet: `Enquiries`, with 21 columns defined in `src/Content/contact-sheet-schema.json`.
- Service account: `crea99@crea-488211.iam.gserviceaccount.com` needs Editor access to this specific workbook. Do not share the credential itself with anyone.
- The source credential is kept under `HotelFirst_Workspace/local-private/credentials/google/crea.env`. ConnectMe is read-only and remains separate.
- Run `node scripts/setup-contact-sheet.mjs <spreadsheet-id>` to verify/reapply the sheet formatting. It refuses to overwrite a different header or workbook structure.

## Vercel Production variables

Set these on the **website project's Production environment**, not in GitHub or a `NEXT_PUBLIC_` variable:

```text
ENQUIRY_OUTBOUND_ENABLED=true
HOTELFIRST_SHEET_ID=<spreadsheet ID>
GOOGLE_SERVICE_ACCOUNT_JSON_BASE64=<base64-encoded full service-account JSON>
ENQUIRY_RATE_LIMIT_SALT=<new random 32+ character string>
```

The credential must be the JSON object only, not the `crea.env` wrapper text. Keep the value encrypted/sensitive in Vercel. The salt must be unique to HotelFirst and must not be the service-account key. Remove the former `FORMSPREE_FORM_ID`, `ENQUIRY_REDIS_REST_URL` and `ENQUIRY_REDIS_REST_TOKEN` variables if they exist.

## Delivery contract

`/api/enquiry` runs on the existing Vercel Node.js function. It validates the request and privacy consent, checks a hidden spam field, reads existing Sheet rows for sequential UUID/IP/email checks, then appends one `RAW` row. The form shows success only when Google Sheets reports one full row written. A repeated UUID with the same payload is acknowledged; a changed payload is rejected. Optional Meta CAPI runs only after confirmed acceptance and separate advertising consent.

No separate server, Formspree account or Upstash database is required. This does **not** make the form immune to abuse: Sheets checks are read-then-write and cannot be atomic across concurrent Vercel instances. The same UUID may occasionally duplicate under simultaneous requests or an ambiguous network failure. Enable Vercel edge protections as appropriate, monitor the sheet, and move to a transactional store if volume or abuse warrants it. A Sheet is a lightweight lead register, not a CRM or durable queue.

## Operator follow-up

1. Add a GitHub Login Connection to the Vercel account and connect `NaxPrime/hf-lnd-react` to the `hf-lnd-react` project. Vercel CLI rejected the connection without that account-level step, so a future GitHub push alone will not deploy.
2. Have the business owner review the privacy wording, Sheet access list, retention/deletion schedule and whether a real customer inquiry reaches the responsible person promptly.
3. Assign an owner for daily lead review and follow-up. Google Sheets does not itself send an instant WhatsApp/email alert to Akshay.
4. Before enabling optional Meta CAPI/browser tracking, finish domain/account verification and consent-gated live event testing as described in `META_TRACKING_SETUP.md`.
5. For future changes, run the form tests, analytics tests, TypeScript check and build; verify a protected preview or separate test sheet before promotion. Do not leave synthetic rows in the production register.

If the endpoint returns `delivery_unconfigured` or `abuse_control_unavailable`, check Vercel variables, spreadsheet sharing, service-account validity, and the Google Sheets API in the service-account project. Do not log tokens, private keys, messages or personal data while diagnosing.

## Dependency note

The application was updated from Next.js 15.3.8 to 15.5.28 and `npm audit fix` resolved compatible transitive advisories. As of 27 October, `npm audit --omit=dev` still reports one high-severity advisory in Next's nested PostCSS and one moderate advisory in Next itself; npm's suggested fix is a breaking Next.js 16 upgrade. Do not force that migration into this release without separate route, SEO and UI regression checks.
