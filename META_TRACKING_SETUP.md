# HotelFirst Meta measurement handoff

Updated: 20 September 2026 IST. This file replaces the earlier browser-trusted CAPI flow. See `SEO_BACKEND_SETUP.md` for the complete release sequence and environment checklist.

## Current event flow

1. The visitor completes the full Contact form and accepts the Privacy Policy.
2. Advertising measurement is a separate optional checkbox. The inquiry can be sent without it.
3. The browser posts a bounded JSON request with a UUIDv4 `submissionId` to `/api/enquiry`.
4. The endpoint rejects noncanonical origin, local/preview, disabled, invalid, oversized, unconfigured, duplicate or rate-limited requests before any provider call.
5. A shared Upstash transaction reserves the UUID and applies IP/email quotas using keyed digests.
6. Formspree must confirm acceptance before the endpoint returns success.
7. Only after acceptance, and only with advertising consent and complete Meta configuration, the server sends a CAPI `Lead` with hashed email/phone plus permitted request context. Name and message are not sent to Meta.
8. The accepted UUID is also used by the optional browser `Lead`, allowing Meta to deduplicate browser and server events.
9. GA measurement is independent. It receives no inquiry PII and remains off until analytics consent is explicitly provided.

The former `POST /api/meta/lead` endpoint is retired and returns HTTP 410. Browser code cannot directly claim that a provider accepted a lead.

## Required production variables

```text
ENQUIRY_OUTBOUND_ENABLED=true
FORMSPREE_FORM_ID=
ENQUIRY_REDIS_REST_URL=https://<database>.upstash.io
ENQUIRY_REDIS_REST_TOKEN=
ENQUIRY_RATE_LIMIT_SALT=<random value of at least 32 characters>

META_CAPI_ENABLED=true
META_BROWSER_ENABLED=true
META_PIXEL_ID=
META_GRAPH_API_VERSION=v<current supported version>
META_CONVERSIONS_API_TOKEN=
```

All variables are server-side. Do not create a `NEXT_PUBLIC_` Meta token or use the old client pixel variable. The root layout sends only the nonsecret pixel ID to the browser after server production gates pass.

`META_CONVERSIONS_API_TEST_EVENT_CODE` disables production advertising eligibility in the application. Use it only in a controlled test environment and remove it before production activation.

## Required verification before activation

- Run `node --test scripts/test-enquiry.mjs` and `node scripts/test-enquiry-analytics.mjs`.
- Validate the exact Lua reservation command in `src/lib/enquiry.ts` against an isolated Upstash database; automated tests mock the REST API.
- Configure Vercel edge/firewall controls and confirm trusted forwarding headers.
- Verify the domain in Meta Business settings through the authorized GoDaddy DNS account.
- Use Meta Events Manager Test Events on an authorized deployment. Confirm one Browser Lead and one Server Lead share the same UUID and are deduplicated.
- Confirm no event is emitted after a provider rejection, without optional advertising consent, on a preview/local host, or with a test-event code in production.
- Remove all test configuration, redeploy, and inspect the final production environment before enabling campaigns.

Historical July/August deployment checks do not certify this revised flow. A fresh deployment and test are required after authorization. No live inquiry or Meta event was sent during the 20 September local implementation.
