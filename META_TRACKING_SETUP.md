# HotelFirst Meta measurement handoff

Updated: 27 October 2026 IST. The Google Sheets inquiry path is deployed and was verified with advertising consent off. Optional Meta CAPI/browser Lead measurement remains disabled or unverified until its separate account, domain and consent-gated release checks are complete. See `SEO_BACKEND_SETUP.md` for the release sequence.

## Current event flow

1. The visitor completes the full Contact form and accepts the Privacy Policy.
2. Advertising measurement is a separate optional checkbox. The inquiry can be sent without it.
3. The browser posts a bounded JSON request with a UUIDv4 `submissionId` to `/api/enquiry`.
4. The endpoint rejects noncanonical origin, local/preview, disabled, invalid, oversized, unconfigured and sequentially duplicate or rate-limited requests before a Sheets append.
5. It reads existing lead IDs, times, emails and keyed IP hashes from Google Sheets. These checks are best-effort, not atomic across concurrent Vercel invocations.
6. Google Sheets must confirm one appended row before the endpoint returns success.
7. Only after acceptance, and only with advertising consent and complete Meta configuration, the server sends a CAPI `Lead` with hashed email/phone plus permitted request context. Name and message are not sent to Meta.
8. The accepted UUID is also used by the optional browser `Lead`, allowing Meta to deduplicate browser and server events.
9. GA measurement is independent. It receives no inquiry PII and remains off until analytics consent is explicitly provided.

The former `POST /api/meta/lead` endpoint is retired and returns HTTP 410. Browser code cannot directly claim that a provider accepted a lead.

## Required production variables

```text
ENQUIRY_OUTBOUND_ENABLED=true
HOTELFIRST_SHEET_ID=<HotelFirst spreadsheet ID>
GOOGLE_SERVICE_ACCOUNT_JSON_BASE64=<base64 of service-account JSON>
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
- Verify real Google Sheets append/lookup against a protected deployment; automated tests mock the REST API.
- Configure Vercel edge/firewall controls and confirm trusted forwarding headers.
- Verify the domain in Meta Business settings through the authorized GoDaddy DNS account.
- Use Meta Events Manager Test Events on an authorized deployment. Confirm one Browser Lead and one Server Lead share the same UUID and are deduplicated.
- Confirm no event is emitted after a provider rejection, without optional advertising consent, on a preview/local host, or with a test-event code in production.
- Remove all test configuration, redeploy, and inspect the final production environment before enabling campaigns.

The live synthetic inquiry confirmed Sheets delivery but intentionally did not exercise Meta measurement. Do not treat this as CAPI or browser-pixel acceptance; complete the checks above before enabling paid measurement.
