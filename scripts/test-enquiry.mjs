import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import crypto from "node:crypto";
import net from "node:net";

const require = createRequire(import.meta.url);
const ts = require("typescript");
const root = new URL("../", import.meta.url);
const schema = JSON.parse(readFileSync(new URL("src/Content/contact-sheet-schema.json", root), "utf8"));
const forbiddenFetch = () => { throw new Error("REAL NETWORK IS FORBIDDEN IN ENQUIRY TESTS"); };
globalThis.fetch = forbiddenFetch;

function loadTs(file, modules = {}, extras = {}) {
  const source = readFileSync(new URL(file, root), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
      esModuleInterop: true, jsx: ts.JsxEmit.ReactJSX },
  });
  const mod = { exports: {} };
  const context = { exports: mod.exports, module: mod, Response, Request, Headers, URL, URLSearchParams,
    TextDecoder, Uint8Array, AbortSignal, fetch: forbiddenFetch, process: { env: {} },
    require(id) {
      if (id === "node:crypto") return crypto;
      if (id === "node:net") return net;
      if (id === "@/Content/contact-sheet-schema.json") return schema;
      if (id === "@/lib/google-sheets-auth") return { getGoogleAccessToken: async () => "synthetic-token" };
      if (id in modules) return modules[id];
      throw new Error("Unmocked dependency " + id);
    }, ...extras };
  vm.runInNewContext(outputText, context, { filename: fileURLToPath(new URL(file, root)) });
  return mod.exports;
}

const enquiry = loadTs("src/lib/enquiry.ts");
const id = "77dad9ae-33a9-4e0a-98ca-e3136c5c058d";
const input = { submissionId: id, name: "Synthetic Person", email: "synthetic@example.invalid",
  phone: "9000000000", message: "Synthetic inquiry, never delivered.", agree: true,
  advertisingConsent: false, website: "", pageUrl: "https://www.hotelfirst.one/Contact",
  referrer: "", utmSource: "", utmMedium: "", utmCampaign: "" };
const configured = { VERCEL: "1", VERCEL_ENV: "production", ENQUIRY_OUTBOUND_ENABLED: "true",
  HOTELFIRST_SHEET_ID: "syntheticSpreadsheetId123456789", GOOGLE_SERVICE_ACCOUNT_JSON_BASE64: "synthetic",
  ENQUIRY_RATE_LIMIT_SALT: "synthetic-unit-test-salt-not-for-production",
  META_CAPI_ENABLED: "true", META_PIXEL_ID: "1234567890", META_CONVERSIONS_API_TOKEN: "synthetic-only",
  META_GRAPH_API_VERSION: "v25.0" };

function request(value = input, { raw, headers = {}, origin = enquiry.ENQUIRY_ORIGIN } = {}) {
  return new Request(origin + "/api/enquiry", { method: "POST", headers: {
    Origin: origin, "Content-Type": "application/json", "Sec-Fetch-Site": "same-origin",
    "x-vercel-forwarded-for": "192.0.2.10", "User-Agent": "Synthetic test browser", ...headers,
  }, body: raw ?? JSON.stringify(value) });
}

function fixture(options = {}) {
  const rows = [];
  const events = [];
  let metaCalls = 0;
  let appendCalls = 0;
  const send = async (url, init) => {
    assert.equal(init.redirect, "error");
    assert.ok(init.signal instanceof AbortSignal);
    if (url.startsWith("https://sheets.googleapis.com/v4/spreadsheets/")) {
      assert.equal(init.headers.Authorization, "Bearer synthetic-token");
      if (init.method === "GET") {
        events.push("read");
        if (options.readFails) return Response.json({ error: "private" }, { status: 500 });
        const columns = [5, 4, 1, 15, 16];
        return Response.json({ valueRanges: columns.map((column) => ({ values: rows.map((row) => [row[column]]) })) });
      }
      assert.equal(init.method, "POST");
      appendCalls++;
      events.push("append");
      assert.ok(url.includes("valueInputOption=RAW"));
      assert.ok(url.includes("insertDataOption=INSERT_ROWS"));
      const row = JSON.parse(init.body).values[0];
      assert.equal(row.length, schema.headers.length);
      assert.equal(row[0], input.name);
      assert.equal(row[1], input.email);
      assert.equal(row[2], "919000000000");
      assert.equal(row[3], input.message);
      assert.match(row[4], /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
      assert.match(row[5], /^[0-9a-f]{8}-33a9-4e0a-98ca-e3136c5c058d$/);
      if (options.appendFails) return Response.json({ error: "private" }, { status: 500 });
      if (options.unconfirmed) return Response.json({ updates: { updatedRows: 0, updatedColumns: 0 } });
      rows.push(row);
      return Response.json({ updates: { updatedRows: 1, updatedColumns: schema.headers.length,
        updatedRange: `${schema.tab}!A${rows.length + 1}:R${rows.length + 1}` } });
    }
    if (url === "https://graph.facebook.com/v25.0/1234567890/events") {
      metaCalls++;
      events.push("meta");
      assert.ok(!init.body.includes(input.email));
      assert.ok(!init.body.includes(input.message));
      const event = JSON.parse(init.body).data[0];
      assert.equal(event.event_id, id);
      if (options.metaFails) return Response.json({ error: "private" }, { status: 500 });
      return Response.json({ events_received: 1 });
    }
    throw new Error("Unexpected outbound destination");
  };
  return { send, rows, events, calls: () => ({ appendCalls, metaCalls }) };
}

async function run(req, env = configured, fx = fixture()) {
  const response = await enquiry.createEnquiryHandler({ env, send: fx.send,
    authorize: async () => "synthetic-token" })(req);
  assert.equal(response.headers.get("Cache-Control"), "no-store");
  assert.match(response.headers.get("X-Robots-Tag"), /noindex/);
  return { response, body: await response.json(), fx };
}

test("validation rejects bad JSON, fields, consent, phone, and oversized bodies before network", async () => {
  const cases = [null, [], {}, { ...input, eventSourceUrl: "https://bad.invalid" },
    { ...input, email: "bad" }, { ...input, name: " " }, { ...input, phone: "123" },
    { ...input, message: "x".repeat(5001) }, { ...input, agree: false },
    { ...input, advertisingConsent: "false" }, { ...input, pageUrl: "https://bad.invalid/" },
    { ...input, referrer: "javascript:alert(1)" }, { ...input, utmSource: "x".repeat(121) }];
  for (const value of cases) {
    const { response, fx } = await run(request(value));
    assert.equal(response.status, 400);
    assert.equal(fx.events.length, 0);
  }
  assert.equal((await run(request(input, { raw: "{" }))).response.status, 400);
  assert.equal((await run(request(input, { raw: "x".repeat(9000) }))).response.status, 413);
  assert.equal((await run(request(input, { headers: { "Content-Type": "text/plain" } }))).response.status, 415);
});

test("origin, honeypot, preview and incomplete configuration fail before sheet writes", async () => {
  for (const headers of [{ Origin: "https://bad.invalid" }, { Origin: "" }, { "Sec-Fetch-Site": "cross-site" }]) {
    assert.equal((await run(request(input, { headers }))).response.status, 403);
  }
  const bait = await run(request({ ...input, website: "spam.example" }));
  assert.equal(bait.body.accepted, undefined);
  assert.equal(bait.fx.events.length, 0);
  for (const env of [{}, { ...configured, VERCEL_ENV: "preview" },
    { ...configured, ENQUIRY_OUTBOUND_ENABLED: "false" },
    { ...configured, HOTELFIRST_SHEET_ID: "" },
    { ...configured, GOOGLE_SERVICE_ACCOUNT_JSON_BASE64: "" },
    { ...configured, ENQUIRY_RATE_LIMIT_SALT: "short" }]) {
    const { response, fx } = await run(request(), env);
    assert.equal(response.status, 503);
    assert.equal(fx.events.length, 0);
  }
  assert.equal((await run(request(input, { headers: { "x-vercel-forwarded-for": "" } }))).response.status, 503);
});

test("empty sheet accepts one inquiry; repeat is acknowledged without second write or CAPI", async () => {
  const fx = fixture();
  const first = await run(request({ ...input, advertisingConsent: true }), configured, fx);
  assert.equal(first.response.status, 200);
  assert.equal(first.body.accepted, true);
  assert.equal(first.body.eventId, id);
  assert.deepEqual(fx.events, ["read", "append", "meta"]);
  assert.equal(fx.rows.length, 1);
  const again = await run(request({ ...input, advertisingConsent: true }), configured, fx);
  assert.equal(again.body.replay, true);
  assert.deepEqual(fx.calls(), { appendCalls: 1, metaCalls: 1 });
  const changed = await run(request({ ...input, message: "Different inquiry", advertisingConsent: true }), configured, fx);
  assert.equal(changed.response.status, 409);
  assert.deepEqual(fx.calls(), { appendCalls: 1, metaCalls: 1 });
});

test("no advertising consent means no Meta event; failed reads and writes do not claim delivery", async () => {
  const noConsent = await run(request());
  assert.equal(noConsent.response.status, 200);
  assert.equal(noConsent.body.advertisingEligible, false);
  assert.equal(noConsent.fx.calls().metaCalls, 0);
  for (const options of [{ readFails: true }, { appendFails: true }, { unconfirmed: true }]) {
    const failed = await run(request({ ...input, advertisingConsent: true }), configured, fixture(options));
    assert.notEqual(failed.response.status, 200);
    assert.equal(failed.body.accepted, undefined);
    assert.equal(failed.fx.calls().metaCalls, 0);
  }
  const metaFail = await run(request({ ...input, advertisingConsent: true }), configured, fixture({ metaFails: true }));
  assert.equal(metaFail.response.status, 200);
  assert.equal(metaFail.body.tracking, "failed");
});

test("sheet-based IP and email quotas reject sequential excess submissions", async () => {
  const fx = fixture();
  for (let i = 0; i < 3; i++) {
    const nextId = `${String(i).padStart(8, "0")}-33a9-4e0a-98ca-e3136c5c058d`;
    const result = await run(request({ ...input, submissionId: nextId }), configured, fx);
    assert.equal(result.response.status, 200);
  }
  const fourth = await run(request({ ...input, submissionId: "00000004-33a9-4e0a-98ca-e3136c5c058d" }), configured, fx);
  assert.equal(fourth.response.status, 429);
  assert.equal(fx.calls().appendCalls, 3);
});

test("production Meta test-event code suppresses conversion without blocking the enquiry", async () => {
  const { body, fx } = await run(request({ ...input, advertisingConsent: true }),
    { ...configured, META_CONVERSIONS_API_TEST_EVENT_CODE: "synthetic" });
  assert.equal(body.accepted, true);
  assert.equal(body.advertisingEligible, false);
  assert.equal(fx.calls().metaCalls, 0);
});

test("retired CAPI endpoint stays disabled; route fails closed without production env", async () => {
  const route = loadTs("src/app/api/meta/lead/route.ts");
  assert.equal(route.POST().status, 410);
  const enquiryRoute = loadTs("src/app/api/enquiry/route.ts", { "@/lib/enquiry": enquiry });
  assert.equal((await enquiryRoute.POST(request())).status, 503);
});

function contactHarness({ failingTracking = false, responseFactory } = {}) {
  let slot = 0;
  const updates = [];
  const calls = [];
  const tracked = [];
  const component = loadTs("src/app/Contact/page.tsx", {
    react: {
      useState(initial) { const index = slot++; return [typeof initial === "object" ? { ...input, submissionId: undefined } : initial,
        (value) => updates.push({ index, value })]; },
      useRef: (initial) => ({ current: initial }),
      useEffect: (run) => run(),
    },
    "react/jsx-runtime": { jsx: (type, props) => ({ type, props }), jsxs: (type, props) => ({ type, props }) },
    "@/lib/analytics": {
      trackFormSubmit() { if (failingTracking) throw new Error("synthetic tracker failed"); },
      trackCustomEvent() {}, trackLead(...args) { tracked.push(args); },
    },
  }, { crypto: { randomUUID: () => id }, fetch: async (url, init) => {
    assert.equal(url, "/api/enquiry");
    calls.push(JSON.parse(init.body));
    if (responseFactory) return responseFactory(calls.length);
    return Response.json({ ok: true, accepted: true, eventId: id, replay: false, advertisingEligible: true });
  } });
  function form(node) {
    if (!node || typeof node !== "object") return null;
    if (node.type === "form") return node;
    for (const child of [node.props?.children].flat(Infinity)) { const found = form(child); if (found) return found; }
    return null;
  }
  const onSubmit = form(component.default()).props.onSubmit;
  return { submit: () => onSubmit({ preventDefault() {} }), calls, updates, tracked };
}

test("client reports only confirmed delivery and reuses submission ID on uncertain response", async () => {
  const client = contactHarness({ responseFactory: (attempt) => attempt === 1
    ? Response.json({ ok: false, code: "delivery_unconfirmed" }, { status: 502 })
    : Response.json({ ok: true, accepted: true, eventId: id, replay: true, advertisingEligible: true }) });
  await client.submit();
  assert.equal(client.tracked.length, 0);
  await client.submit();
  assert.equal(client.calls[0].submissionId, client.calls[1].submissionId);
  assert.equal(client.tracked[0][1], id);
});

test("client analytics failure preserves accepted success UI", async () => {
  const client = contactHarness({ failingTracking: true });
  await client.submit();
  assert.ok(client.updates.some((entry) => entry.index === 0 && entry.value === true));
});
