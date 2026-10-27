# HotelFirst website enquiries: Google Sheets handoff

Updated: 27 October 2026 IST. This document records implementation and release checks; confirm live delivery separately on the production domain. The four Production variables below were added to the verified `hf-lnd-react` Vercel project as sensitive values. Vercel applies them to deployments created after configuration.

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

## Release checklist

1. The verified Vercel project `hf-lnd-react` owns both `hotelfirst.one` and `www.hotelfirst.one`, but its project record did not show a Git link on 27 October. Connect the `NaxPrime/hf-lnd-react` repository in Vercel or deploy the reviewed commit using Vercel CLI. A GitHub push alone does not prove a production deployment.
2. Review the privacy wording, Sheet access list and retention policy with the business owner.
3. The four Production variables above are already present as sensitive values, including `ENQUIRY_OUTBOUND_ENABLED=true`. Confirm they remain present before publishing; the currently deployed code is unaffected until a new deployment.
4. Run `node --test scripts/test-enquiry.mjs`, `node scripts/test-enquiry-analytics.mjs`, `npx tsc --noEmit --incremental false`, and `npm run build` locally.
5. Deploy a protected preview with test-only credentials or a separate test sheet. Confirm a legitimate inquiry creates exactly one row, captures UTC/IST and campaign fields, and a failed append never shows success. Do not place fake leads in the production register.
6. Deploy/promote the reviewed commit. Test one owner-approved real inquiry, then verify the row and any consent-gated Meta event.
7. Confirm access and handling: assign an owner for daily review, follow-up and retention/deletion. Google Sheets does not send an instant alert to Akshay by itself.

If the endpoint returns `delivery_unconfigured` or `abuse_control_unavailable`, check Vercel variables, spreadsheet sharing, service-account validity, and the Google Sheets API in the service-account project. Do not log tokens, private keys, messages or personal data while diagnosing.

## Dependency note

The application was updated from Next.js 15.3.8 to 15.5.28 and `npm audit fix` resolved compatible transitive advisories. As of 27 October, `npm audit --omit=dev` still reports one high-severity advisory in Next's nested PostCSS and one moderate advisory in Next itself; npm's suggested fix is a breaking Next.js 16 upgrade. Do not force that migration into this release without separate route, SEO and UI regression checks.
