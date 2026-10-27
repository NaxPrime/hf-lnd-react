# HotelFirst search and measurement release handoff

Reviewed: 27 October 2026 IST. Google Sheets inquiry delivery is deployed to the domain-owning Vercel project and was verified with a synthetic inquiry. The synthetic row was removed. Earlier detailed SEO acceptance evidence below predates this change; a fresh live release-gate run passed 68 checks.

## What is implemented

- Ten authored pages have unique titles, descriptions, canonical URLs, Open Graph metadata and one visible H1.
- The site exposes truthful `Organization`, `WebSite`, `Service`, `WebPage` and `BreadcrumbList` JSON-LD. It does not use unsupported AI schema or obsolete meta-keywords.
- `robots.txt` permits public content, excludes `/api/`, and declares the canonical sitemap.
- `sitemap.xml` contains the ten authored pages plus only guides/resources with a complete editorial approval record.
- Exactly 40 owner-decision guides and six worksheet resources exist locally. Every current item is an `editorial-draft`.
- Drafts are visible only when `HOTELFIRST_CONTENT_PREVIEW=1` outside Vercel production. They are visibly labelled, `noindex`, absent from the sitemap, and fail closed as HTTP 404 in a normal production build.
- The six resource pages provide real CSV worksheets. Downloads are `noindex`, attachment responses and unavailable before editorial approval.
- Sixty-six old service/location variants and eleven canned FAQ variants permanently redirect to the closest genuine canonical service instead of remaining doorway pages.
- Unknown root, FAQ, guide, resource and worksheet routes return real HTTP 404 responses.
- Browser CTA email fields route users to the full contact form. The email is transferred once through first-party session storage and removed on contact-page load.
- `/api/enquiry` validates bounded JSON, same-origin requests, privacy consent, Indian mobile numbers and a UUID event ID. It fails closed outside explicitly enabled canonical Vercel production.
- Production enquiry delivery now appends directly to the HotelFirst Google Sheet using a server-side service account. It reads prior rows for best-effort sequential duplicate and IP/email checks; simultaneous requests can still race. Meta CAPI can run only after Google Sheets confirms an append and the visitor separately opts into advertising measurement.
- The retired browser-trusted `/api/meta/lead` endpoint returns HTTP 410 for POST.
- GA and Meta browser tracking are disabled in local/preview environments. GA has one manual page-view path and remains off until an explicit analytics-consent call is wired. No inquiry PII is passed to GA.
- Vercel Web Analytics is restored through its official Next.js component on Vercel production only. It also must be enabled in the Vercel project dashboard.
- The privacy page now describes the implemented Vercel, Google Sheets, GA and optional Meta flows. Owner/legal review remains a release requirement.

## Acceptance evidence

Run from this directory:

```powershell
node --test scripts/test-enquiry.mjs
node scripts/test-enquiry-analytics.mjs
npx tsc --noEmit --incremental false
```

The 20 September results were 18 enquiry/Contact tests, 14 analytics tests and TypeScript. Rerun all checks after this Google Sheets change; do not treat old counts as current evidence.

Draft-preview build and full browser acceptance:

```powershell
$env:HOTELFIRST_CONTENT_PREVIEW='1'
npm run build
$env:PORT='3100'
npm start

# In another terminal
$env:SEO_BASE_URL='http://127.0.0.1:3100'
npm run seo:verify
```

Historical 20 September result: 148 generated routes; 1,128 browser/content/schema/link/image/download/redirect checks passed and zero failed. Evidence is written to `artifacts/seo-acceptance/`.

Release-gate build:

```powershell
$env:HOTELFIRST_CONTENT_PREVIEW='0'
npm run build
$env:PORT='3101'
npm start

# In another terminal
$env:SEO_BASE_URL='http://127.0.0.1:3101'
npm run seo:verify-release
```

Historical 20 September result: 96 generated routes; 67 release-gate checks passed and zero failed. All 40 unapproved guides, six resources, six downloads and both draft hubs returned HTTP 404.

## 27 October live release evidence

- Commit `66e14b5` was pushed to `NaxPrime/hf-lnd-react` main and deployed directly as Vercel production deployment `dpl_FzBkGS8smU1G8CxmBGy3YvXnFfRW`.
- Vercel reported Ready and aliases for both `hotelfirst.one` and `www.hotelfirst.one`.
- The live `/Contact` route returned HTTP 200; `/api/enquiry` rejected malformed input with HTTP 400. A synthetic, advertising-opted-out inquiry was accepted into the dedicated Sheet, and its exact replay did not create a duplicate row. The test row was deleted afterward.
- `npm run seo:verify-release` against `https://www.hotelfirst.one` passed 68 checks, zero failed.
- Vercel has no GitHub Login Connection for this project. The production deployment was performed directly; future GitHub pushes will not auto-deploy until the account connection is completed.

## Editorial release gate

Do not approve the 46 draft items in bulk merely to publish them. Akshay or another named subject-matter reviewer must review the exact file and its assumptions, limitations, terminology and destination.

For an approved guide or resource, set:

```json
{
  "reviewStatus": "approved",
  "reviewedBy": "Full reviewer name",
  "reviewedAt": "YYYY-MM-DD"
}
```

An `approved` record without both fields fails validation. Once approved, the route becomes public in a normal production build and is added automatically to the sitemap. Never set `HOTELFIRST_CONTENT_PREVIEW=1` as a production environment variable; the code also ignores it when `VERCEL_ENV=production`.

## Production environment variables

Search verification, supplied by the respective consoles:

```text
GOOGLE_SITE_VERIFICATION=
BING_SITE_VERIFICATION=
```

Inquiry delivery, configured only in Vercel Production:

```text
ENQUIRY_OUTBOUND_ENABLED=true
HOTELFIRST_SHEET_ID=<HotelFirst spreadsheet ID>
GOOGLE_SERVICE_ACCOUNT_JSON_BASE64=<base64 of service-account JSON; server-side only>
ENQUIRY_RATE_LIMIT_SALT=<random value of at least 32 characters>
```

Before activation, verify the Google Sheet is shared with the service account and run an authorized end-to-end test on a protected deployment. Sheet-based duplicate and quota reads are not atomic; Vercel firewall/bot controls are recommended as another layer. The automated tests mock Sheets responses and do not certify live delivery.

Optional Meta measurement:

```text
META_CAPI_ENABLED=true
META_BROWSER_ENABLED=true
META_PIXEL_ID=
META_GRAPH_API_VERSION=v<current supported version>
META_CONVERSIONS_API_TOKEN=
```

Do not leave `META_CONVERSIONS_API_TEST_EVENT_CODE` in Production. The site sends no Meta Lead without the visitor's optional advertising consent. Browser and server Lead events share the same UUID for deduplication.

Optional Google Analytics:

```text
ANALYTICS_ENABLED=true
GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

GA remains off until a consent interface calls `setAnalyticsConsent(true)`. Leave `ANALYTICS_ENABLED=false` until that interface and the applicable legal wording are approved. Review GA Enhanced Measurement and Meta automatic matching settings in their dashboards so vendor automation does not reintroduce duplicate or unintended events.

Vercel Web Analytics needs no site secret. Enable Web Analytics in the correct Vercel project dashboard and redeploy after the code is authorized.

## Authorized rollout sequence

1. Review and approve the privacy wording, processing purposes, provider accounts and retention settings.
2. Review individual guides/resources and add approval fields only to exact approved versions.
3. Add production secrets in Vercel. Do not place them in Git or client-side variables.
4. Validate Google Sheets append behavior and Vercel edge protection in an isolated environment.
5. Create a Vercel preview deployment, then run the live equivalent of the acceptance scripts against its URL. Keep drafts unavailable unless the preview is access-controlled and intentionally built with the preview flag.
6. Promote only after live image, canonical, redirect, form-failure, analytics and mobile checks pass.
7. In Vercel, enable Web Analytics and confirm requests appear in the project Analytics dashboard.
8. Verify `hotelfirst.one` in Google Search Console and Bing Webmaster Tools using the supplied verification values. Submit `https://www.hotelfirst.one/sitemap.xml` after the verified deployment.
9. Keep `npm run seo:indexnow` in dry-run mode until the new deployment and live sitemap are verified. `npm run seo:indexnow -- --send` performs an external notification and requires explicit authorization.
10. Complete Meta domain verification through GoDaddy DNS and test Pixel/CAPI deduplication using Meta's test tools before enabling production measurement.
11. Follow the separate Google Business Profile checklist. Do not create or claim a listing until the owner verifies that the premises satisfy Google's in-person, signage and staffing rules and confirms no duplicate profile exists.
12. Use the authority-readiness publication gates for any publisher pitch or profile correction. No automated links, paid dofollow placements, link exchanges, fabricated associations or optimized-anchor advertorials.

## Measurement boundary

Search Console, Bing, Vercel Analytics, approved CRM outcomes and reproducible AI-search observations become the post-deployment baseline. Keep these states separate: published, indexed, ranking observed, brand mention observed, cited link observed, ordered recommendation observed and qualified inquiry received.

No source change or submission can guarantee indexing, a top-three/top-five ranking, a ChatGPT recommendation, a backlink or commercial results. The local work makes the site technically ready and establishes a compliant publication process; external outcomes require approved deployment, useful reviewed content, genuine third-party authority and measured iteration.
