# HotelFirst search and measurement release handoff

Reviewed: 20 September 2026 IST. Local implementation and acceptance are complete. No commit, push, Vercel deployment, DNS/account change, URL submission, live inquiry, outreach or publication was performed.

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
- Browser CTA email fields now route users to the full contact form instead of sending directly to Formspree. The email is transferred once through first-party session storage and removed on contact-page load.
- `/api/enquiry` validates bounded JSON, same-origin requests, privacy consent, Indian mobile numbers and a UUID event ID. It fails closed outside explicitly enabled canonical Vercel production.
- Production enquiry delivery requires shared Upstash rate limiting and idempotent receipts. Meta CAPI can run only after Formspree confirms acceptance and the visitor separately opts into advertising measurement.
- The retired browser-trusted `/api/meta/lead` endpoint returns HTTP 410 for POST.
- GA and Meta browser tracking are disabled in local/preview environments. GA has one manual page-view path and remains off until an explicit analytics-consent call is wired. No inquiry PII is passed to GA.
- Vercel Web Analytics is restored through its official Next.js component on Vercel production only. It also must be enabled in the Vercel project dashboard.
- The privacy page now describes the implemented Vercel, Formspree, Upstash, GA and optional Meta flows. Owner/legal review remains a release requirement.

## Acceptance evidence

Run from this directory:

```powershell
node --test scripts/test-enquiry.mjs
node scripts/test-enquiry-analytics.mjs
npx tsc --noEmit --incremental false
```

Current results: 18 enquiry/Contact tests passed; 14 isolated analytics tests passed; TypeScript passed.

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

Current result: 148 generated routes; 1,128 browser/content/schema/link/image/download/redirect checks passed and zero failed. Evidence is written to `artifacts/seo-acceptance/`.

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

Current result: 96 generated routes; 67 release-gate checks passed and zero failed. All 40 unapproved guides, six resources, six downloads and both draft hubs returned HTTP 404.

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
FORMSPREE_FORM_ID=
ENQUIRY_REDIS_REST_URL=https://<database>.upstash.io
ENQUIRY_REDIS_REST_TOKEN=
ENQUIRY_RATE_LIMIT_SALT=<random value of at least 32 characters>
```

Before activation, execute the exact Redis Lua reservation logic in `src/lib/enquiry.ts` against an isolated Upstash database and confirm expiry/durability. The automated tests mock REST responses; they do not execute Upstash itself. Configure Vercel firewall/bot controls as another layer because same-origin checks and quotas do not stop distributed abuse.

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
4. Validate Upstash behavior and Vercel edge protection in an isolated environment.
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
