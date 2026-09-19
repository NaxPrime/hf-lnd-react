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
const forbiddenFetch = () => { throw new Error("REAL NETWORK IS FORBIDDEN IN ENQUIRY TESTS"); };
globalThis.fetch = forbiddenFetch;

function loadTs(file, modules = {}, extras = {}) {
  const source = readFileSync(new URL(file, root), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
      esModuleInterop: true, jsx: ts.JsxEmit.ReactJSX },
  });
  const mod = { exports: {} };
  const context = { exports: mod.exports, module: mod, Response, Request, Headers, URL,
    TextDecoder, Uint8Array, AbortSignal, fetch: forbiddenFetch, process: { env: {} },
    require(id) {
      if (id === "node:crypto") return crypto;
      if (id === "node:net") return net;
      if (id in modules) return modules[id];
      throw new Error("Unmocked dependency " + id);
    }, ...extras };
  vm.runInNewContext(outputText, context, { filename: fileURLToPath(new URL(file, root)) });
  return mod.exports;
}

const enquiry = loadTs("src/lib/enquiry.ts");
const id = "77dad9ae-33a9-4e0a-98ca-e3136c5c058d";
const input = { submissionId: id, name: "Synthetic Person", email: "synthetic@example.invalid",
  phone: "9000000000", message: "Synthetic inquiry, never delivered.", agree: true, advertisingConsent: false };
const configured = { VERCEL: "1", VERCEL_ENV: "production", ENQUIRY_OUTBOUND_ENABLED: "true",
  ENQUIRY_REDIS_REST_URL: "https://synthetic.upstash.io", ENQUIRY_REDIS_REST_TOKEN: "synthetic-only",
  ENQUIRY_RATE_LIMIT_SALT: "synthetic-unit-test-salt-not-for-production",
  FORMSPREE_FORM_ID: "testonly", META_CAPI_ENABLED: "true", META_PIXEL_ID: "1234567890",
  META_CONVERSIONS_API_TOKEN: "synthetic-only", META_GRAPH_API_VERSION: "v25.0" };

function request(value = input, { raw, headers = {}, origin = enquiry.ENQUIRY_ORIGIN } = {}) {
  return new Request(origin + "/api/enquiry", { method: "POST", headers: {
    Origin: origin, "Content-Type": "application/json", "Sec-Fetch-Site": "same-origin",
    "x-vercel-forwarded-for": "192.0.2.10", "User-Agent": "Synthetic test browser", ...headers,
  }, body: raw ?? JSON.stringify(value) });
}

// These doubles model the REST adapter contract. They do not certify a real Redis
// deployment, Lua execution, provider delivery, or Meta account configuration.
function fixture(options = {}) {
  const events = [];
  const receipts = new Map();
  const counts = new Map();
  let providerCalls = 0;
  let metaCalls = 0;
  const send = async (url, init) => {
    assert.equal(init.method, "POST");
    assert.equal(init.redirect, "error");
    assert.ok(init.signal instanceof AbortSignal);
    const body = JSON.parse(init.body);
    if (url === configured.ENQUIRY_REDIS_REST_URL) {
      assert.ok(init.headers.Authorization.startsWith("Bearer "));
      assert.ok(!JSON.stringify(body).includes(input.email));
      assert.ok(!JSON.stringify(body).includes("192.0.2.10"));
      if (body[0] === "EVAL") {
        events.push("reserve");
        assert.equal(body[1], enquiry.RESERVE_ENQUIRY_LUA);
        assert.equal(body[2], 3);
        assert.equal(body[7], 86400);
        if (options.storeFails) throw new Error("private store diagnostic");
        if (options.rateLimited) return Response.json({ result: "rate_limited" });
        const [, , , key, ipKey, emailKey, fingerprint] = body;
        if (receipts.has(key)) return Response.json({ result: receipts.get(key) });
        counts.set(ipKey, (counts.get(ipKey) || 0) + 1);
        counts.set(emailKey, (counts.get(emailKey) || 0) + 1);
        if (counts.get(ipKey) > 5 || counts.get(emailKey) > 3) return Response.json({ result: "rate_limited" });
        receipts.set(key, "pending:" + fingerprint);
        return Response.json({ result: "reserved" });
      }
      assert.equal(body[0], "SET");
      assert.deepEqual(body.slice(3), ["XX", "EX", 86400]);
      events.push("receipt");
      if (options.receiptFails) throw new Error("private receipt diagnostic");
      receipts.set(body[1], body[2]);
      return Response.json({ result: "OK" });
    }
    if (url === "https://formspree.io/f/testonly") {
      providerCalls++;
      events.push("provider");
      assert.equal(init.headers.Accept, "application/json");
      assert.equal(body.phone, "919000000000");
      assert.equal(body.submissionId, id);
      if (options.provider) return options.provider(body, init);
      return Response.json({ next: "/thanks" });
    }
    if (url === "https://graph.facebook.com/v25.0/1234567890/events") {
      metaCalls++;
      events.push("meta");
      assert.ok(!url.includes("access_token"));
      assert.ok(!init.body.includes(input.email));
      assert.ok(!init.body.includes(input.message));
      assert.ok(!init.body.includes(input.name));
      const event = body.data[0];
      assert.equal(event.event_name, "Lead");
      assert.equal(event.event_id, id);
      assert.equal(event.event_source_url, enquiry.ENQUIRY_ORIGIN + "/Contact");
      assert.match(event.user_data.em[0], /^[a-f0-9]{64}$/);
      assert.match(event.user_data.ph[0], /^[a-f0-9]{64}$/);
      if (options.meta) return options.meta(body);
      return Response.json({ events_received: 1 });
    }
    throw new Error("Unexpected outbound destination: " + new URL(url).host);
  };
  return { send, events, receipts, calls: () => ({ providerCalls, metaCalls }) };
}

async function run(req, env = configured, fx = fixture()) {
  const response = await enquiry.createEnquiryHandler({ env, send: fx.send })(req);
  assert.equal(response.headers.get("Cache-Control"), "no-store");
  assert.match(response.headers.get("X-Robots-Tag"), /noindex/);
  return { response, body: await response.json(), fx };
}

test("invalid JSON, null, arrays, types, fields, consent and lengths fail before outbound", async () => {
  const cases = [null, [], 1, {}, { ...input, eventSourceUrl: "https://bad.invalid/" },
    { ...input, submissionId: {} }, { ...input, email: "bad" }, { ...input, name: " " },
    { ...input, name: "x".repeat(121) }, { ...input, email: "x".repeat(255) },
    { ...input, phone: "1" }, { ...input, phone: "letters9000000000" },
    { ...input, message: "x".repeat(5001) }, { ...input, message: "bad\u0000" },
    { ...input, agree: false }, { ...input, agree: "true" }, { ...input, advertisingConsent: "false" }];
  for (const value of cases) {
    const { response, fx } = await run(request(value));
    assert.equal(response.status, 400, JSON.stringify(value).slice(0, 120));
    assert.equal(fx.events.length, 0);
  }
  assert.equal((await run(request(input, { raw: "{" }))).response.status, 400);
  assert.equal((await run(request(input, { raw: '"' + "x".repeat(9000) + '"' }))).response.status, 413);
  assert.equal((await run(request(input, { headers: { "Content-Type": "text/plain" } }))).response.status, 415);
  assert.equal((await run(request(input, { headers: { "Content-Length": "9000" } }))).response.status, 413);
});

test("cross-origin, missing Origin and cross-site requests are rejected", async () => {
  for (const headers of [{ Origin: "https://other.invalid" }, { Origin: "" }, { "Sec-Fetch-Site": "cross-site" }]) {
    const { response, fx } = await run(request(input, { headers }));
    assert.equal(response.status, 403);
    assert.equal(fx.events.length, 0);
  }
});

test("local/preview/disabled and incomplete production configuration fail closed", async () => {
  for (const env of [{}, { ...configured, VERCEL: undefined }, { ...configured, VERCEL_ENV: "preview" },
    { ...configured, ENQUIRY_OUTBOUND_ENABLED: "false" }, { ...configured, ENQUIRY_REDIS_REST_TOKEN: "" },
    { ...configured, ENQUIRY_REDIS_REST_URL: "http://localhost/" }, { ...configured, ENQUIRY_RATE_LIMIT_SALT: "short" },
    { ...configured, FORMSPREE_FORM_ID: "bad/path" }]) {
    const { response, fx } = await run(request(), env);
    assert.equal(response.status, 503);
    assert.equal(fx.events.length, 0);
  }
  const local = await run(request(input, { origin: "http://127.0.0.1:3000" }));
  assert.equal(local.response.status, 503);
  assert.equal(local.fx.events.length, 0);
  const noIp = await run(request(input, { headers: { "x-vercel-forwarded-for": "" } }));
  assert.equal(noIp.response.status, 503);
  assert.equal(noIp.fx.events.length, 0);
});

test("durable gate unavailable or limiting never reaches provider", async () => {
  const blocked = await run(request(), configured, fixture({ rateLimited: true }));
  assert.equal(blocked.response.status, 429);
  assert.equal(blocked.response.headers.get("Retry-After"), "3600");
  assert.equal(blocked.fx.calls().providerCalls, 0);
  const unavailable = await run(request(), configured, fixture({ storeFails: true }));
  assert.equal(unavailable.response.status, 503);
  assert.equal(unavailable.body.code, "abuse_control_unavailable");
  assert.equal(unavailable.fx.calls().providerCalls, 0);
});

test("provider-confirmed inquiry without advertising consent sends no Meta event", async () => {
  const { response, body, fx } = await run(request());
  assert.equal(response.status, 200);
  assert.equal(body.accepted, true);
  assert.equal(body.advertisingEligible, false);
  assert.deepEqual(fx.events, ["reserve", "provider", "receipt"]);
});

test("consented CAPI follows provider acceptance and uses the stable browser event ID", async () => {
  const { body, fx } = await run(request({ ...input, advertisingConsent: true }));
  assert.equal(body.eventId, id);
  assert.equal(body.advertisingEligible, true);
  assert.equal(body.tracking, "sent");
  assert.deepEqual(fx.events, ["reserve", "provider", "receipt", "meta"]);
});

test("provider failure/invalid response/network rejection never emits conversion or leaks errors", async () => {
  for (const provider of [() => Response.json({ ok: false }, { status: 400 }),
    () => Response.json({ ok: false }), () => Response.json({ ok: true }),
    () => Response.json({ next: "/thanks", errors: [] }),
    () => Response.json({ next: "/thanks", ok: false }), () => Response.json({}), () => new Response("not json"),
    () => { throw new Error("private provider diagnostic"); }]) {
    const { response, body, fx } = await run(request({ ...input, advertisingConsent: true }), configured, fixture({ provider }));
    assert.equal(response.status, 502);
    assert.equal(body.code, "delivery_unconfirmed");
    assert.equal(fx.calls().metaCalls, 0);
    assert.ok(!JSON.stringify(body).includes("private"));
    assert.equal(fx.events.includes("receipt"), false);
  }
});

test("provider AbortSignal timeout returns a safe failure with no Meta conversion", async () => {
  const budgets = [];
  const fast = loadTs("src/lib/enquiry.ts", {}, { AbortSignal: {
    timeout(ms) { budgets.push(ms); return AbortSignal.timeout(5); },
  } });
  const fx = fixture({ provider: (_body, init) => new Promise((_resolve, reject) => {
    if (init.signal.aborted) reject(init.signal.reason);
    else init.signal.addEventListener("abort", () => reject(init.signal.reason), { once: true });
  }) });
  // Native AbortSignal timeout timers are unref'ed; keep this isolated probe alive.
  const hold = setTimeout(() => {}, 100);
  try {
    const response = await fast.createEnquiryHandler({ env: configured, send: fx.send })(request());
    assert.equal(response.status, 502);
    assert.equal((await response.json()).code, "delivery_unconfirmed");
    assert.deepEqual(budgets, [3000, 8000]);
    assert.equal(fx.calls().metaCalls, 0);
  } finally { clearTimeout(hold); }
});

test("Meta and receipt failures cannot turn an accepted inquiry into an error", async () => {
  for (const meta of [() => { throw new Error("private token diagnostic"); },
    () => Response.json({ error: "private" }, { status: 500 }), () => new Response("not json")]) {
    const { response, body } = await run(request({ ...input, advertisingConsent: true }), configured, fixture({ meta }));
    assert.equal(response.status, 200);
    assert.equal(body.accepted, true);
    assert.equal(body.tracking, "failed");
    assert.ok(!JSON.stringify(body).includes("private"));
  }
  const saved = await run(request({ ...input, advertisingConsent: true }), configured, fixture({ receiptFails: true }));
  assert.equal(saved.response.status, 200);
  assert.equal(saved.body.accepted, true);
  assert.equal(saved.body.advertisingEligible, false);
  assert.equal(saved.fx.calls().metaCalls, 0);
});

test("accepted replay and changed-payload replay cannot resend provider or CAPI", async () => {
  const fx = fixture();
  const value = { ...input, advertisingConsent: true };
  await run(request(value), configured, fx);
  const replay = await run(request(value), configured, fx);
  assert.equal(replay.body.replay, true);
  assert.equal(replay.body.eventId, id);
  assert.deepEqual(fx.calls(), { providerCalls: 1, metaCalls: 1 });
  const conflict = await run(request({ ...value, message: "Different inquiry" }), configured, fx);
  assert.equal(conflict.response.status, 409);
  assert.deepEqual(fx.calls(), { providerCalls: 1, metaCalls: 1 });
});

test("pending duplicate across handler instances cannot send twice", async () => {
  let release;
  let entered;
  const ready = new Promise((resolve) => { entered = resolve; });
  const held = new Promise((resolve) => { release = resolve; });
  const fx = fixture({ provider: () => { entered(); return held; } });
  const first = run(request(), configured, fx);
  await ready;
  const concurrent = await run(request(), configured, fx);
  assert.equal(concurrent.response.status, 409);
  release(Response.json({ next: "/thanks" }));
  await first;
  assert.equal(fx.calls().providerCalls, 1);
});

test("production test-event code disables advertising, without blocking inquiry", async () => {
  const { body, fx } = await run(request({ ...input, advertisingConsent: true }),
    { ...configured, META_CONVERSIONS_API_TEST_EVENT_CODE: "synthetic-test-only" });
  assert.equal(body.accepted, true);
  assert.equal(body.advertisingEligible, false);
  assert.equal(fx.calls().metaCalls, 0);
});

test("retired CAPI endpoint returns 410 and exposes no configuration values", async () => {
  const route = loadTs("src/app/api/meta/lead/route.ts");
  assert.equal(route.POST().status, 410);
  assert.deepEqual(await route.GET().json(), { enabled: false, mode: "server_accepted_enquiries_only" });
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

test("client analytics failure preserves accepted success UI", async () => {
  const client = contactHarness({ failingTracking: true });
  await client.submit();
  assert.ok(client.updates.some((entry) => entry.index === 0 && entry.value === true));
  assert.ok(!client.updates.some((entry) => entry.index === 3 && entry.value));
});

test("client uses same event ID for browser Lead and consent is taken only from accepted result", async () => {
  const client = contactHarness();
  await client.submit();
  assert.equal(client.tracked.length, 1);
  assert.equal(client.tracked[0][1], id);
  assert.equal(client.tracked[0][2], true);
  assert.equal(JSON.stringify(client.tracked).includes(input.email), false);
});

test("client repeat guard is synchronous and retries retain submission ID", async () => {
  let release;
  const held = new Promise((resolve) => { release = resolve; });
  const client = contactHarness({ responseFactory: () => held });
  const first = client.submit();
  await client.submit();
  assert.equal(client.calls.length, 1);
  release(Response.json({ ok: false, code: "delivery_unconfirmed" }, { status: 502 }));
  await first;
  await client.submit();
  assert.equal(client.calls.length, 2);
  assert.equal(client.calls[0].submissionId, client.calls[1].submissionId);
  assert.equal(client.tracked.length, 0);
});

test("client rejects mismatched receipt and measures the first confirmed replay only once", async () => {
  const wrong = contactHarness({ responseFactory: () => Response.json({ ok: true, accepted: true, eventId: "wrong" }) });
  await wrong.submit();
  assert.equal(wrong.tracked.length, 0);
  assert.equal(wrong.updates.some((entry) => entry.index === 0 && entry.value === true), false);
  const replay = contactHarness({ responseFactory: () => Response.json({ ok: true, accepted: true, eventId: id, replay: true }) });
  await replay.submit();
  assert.equal(replay.tracked.length, 1);
  assert.equal(replay.updates.some((entry) => entry.index === 0 && entry.value === true), true);
  await replay.submit();
  assert.equal(replay.tracked.length, 1);
});

test("lost first response followed by accepted replay still measures the accepted lead", async () => {
  const client = contactHarness({ responseFactory: (attempt) => {
    if (attempt === 1) throw new Error("Synthetic lost response after server acceptance");
    return Response.json({ ok: true, accepted: true, eventId: id, replay: true, advertisingEligible: true });
  } });
  await client.submit();
  assert.equal(client.tracked.length, 0);
  await client.submit();
  assert.equal(client.calls[0].submissionId, client.calls[1].submissionId);
  assert.equal(client.tracked.length, 1);
  assert.equal(client.tracked[0][1], id);
  assert.equal(client.tracked[0][2], true);
});
