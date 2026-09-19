// Isolated tests: vendor scripts are captured as plain objects and never loaded.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const analyticsPath = path.join(root, "src/lib/analytics.ts");
const source = fs.readFileSync(analyticsPath, "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS },
}).outputText;
const layout = fs.readFileSync(path.join(root, "src/app/layout.tsx"), "utf8");
const configExpression = layout.match(/const trackingConfig = (\{[\s\S]*?\n  \});/)?.[1];
const ORIGIN = "https://www.hotelfirst.one";
const acceptedId = "28d29db9-b356-4d9c-9920-8d003bca0164";
const otherId = "3284b60b-2d57-45b6-8dce-05bf18b9a4f1";
const enabled = {
  isProduction: true, analyticsEnabled: true, gaMeasurementId: "G-TEST123456",
  metaEnabled: true, metaPixelId: "123456789012345",
};
let passed = 0;

function fixture({ url = ORIGIN + "/Contact", referrer = "", ssr = false, failScript = false } = {}) {
  const scripts = [];
  const w = { location: new URL(url) };
  const document = {
    referrer,
    createElement: () => ({}),
    head: { appendChild: script => {
      if (failScript) throw new Error("mock script blocker");
      scripts.push(script);
    } },
  };
  const exports = {};
  const context = { exports, URL, Date, console, ...(!ssr ? { window: w, document } : {}) };
  vm.runInNewContext(compiled, context, { filename: "analytics.mock.js" });
  return {
    api: exports, w, scripts, document,
    commands: () => (w.dataLayer || []).map(entry => Array.from(entry)),
    events: name => (w.dataLayer || []).map(entry => Array.from(entry)).filter(entry => entry[0] === "event" && (!name || entry[1] === name)),
    pixelLeads: () => (w.fbq?.queue || []).filter(entry => entry[0] === "trackSingle"),
    loadPixel: () => scripts.find(script => script.id === "hotelfirst-meta")?.onload(),
  };
}

function test(name, run) {
  run();
  passed++;
  console.log("PASS " + name);
}

test("analytics module passes isolated strict TypeScript checking", () => {
  const program = ts.createProgram([analyticsPath], {
    noEmit: true, strict: true, skipLibCheck: true, types: [],
    target: ts.ScriptTarget.ES2020, lib: ["lib.es2020.d.ts", "lib.dom.d.ts"],
  });
  const errors = ts.getPreEmitDiagnostics(program).filter(d => d.category === ts.DiagnosticCategory.Error);
  assert.equal(errors.length, 0, errors.map(d => ts.flattenDiagnosticMessageText(d.messageText, "\n")).join("\n"));
});

test("SSR calls never access window/document", () => {
  const { api, scripts } = fixture({ ssr: true });
  api.configureAnalytics(enabled, "/Contact");
  api.setAnalyticsConsent(true);
  api.trackPageView("/Contact?email=private@example.test");
  api.trackCustomEvent("contact_form_started");
  api.trackButtonClick("request_consultation_hero");
  api.trackFormSubmit("contact_form");
  api.trackLead({ email: "private@example.test" }, acceptedId, true);
  assert.equal(scripts.length, 0);
});

test("server layout requires both Vercel gates and explicit feature flags", () => {
  assert.ok(configExpression);
  const env = {
    VERCEL: "1", VERCEL_ENV: "production", ANALYTICS_ENABLED: "true",
    META_CAPI_ENABLED: "true", META_BROWSER_ENABLED: "true",
    GA_MEASUREMENT_ID: enabled.gaMeasurementId, META_PIXEL_ID: enabled.metaPixelId,
  };
  const evaluate = overrides => vm.runInNewContext("(" + configExpression + ")", { process: { env: { ...env, ...overrides } } });
  assert.equal(evaluate({}).isProduction, true);
  for (const overrides of [{ VERCEL: undefined }, { VERCEL: "0" }, { VERCEL_ENV: "preview" }, { VERCEL_ENV: undefined }]) {
    assert.equal(evaluate(overrides).isProduction, false);
  }
  assert.equal(evaluate({ ANALYTICS_ENABLED: "TRUE" }).analyticsEnabled, false);
  assert.equal(evaluate({ META_CAPI_ENABLED: undefined }).metaEnabled, false);
  assert.equal(evaluate({ META_BROWSER_ENABLED: undefined }).metaEnabled, false);
  assert.doesNotMatch(layout, /G-4TXDJ8D50N|GoogleTagManager/);
  assert.match(layout, /trackingConfig\.isProduction\s*\?\s*<Analytics\s*\/>\s*:\s*null/);
});

test("no local, preview, or noncanonical tracking even with consent and valid IDs", () => {
  for (const url of ["http://localhost:3000/Contact", "http://127.0.0.1:3000/Contact", "https://preview.vercel.app/Contact", "https://hotelfirst.one/Contact"]) {
    const f = fixture({ url });
    f.api.configureAnalytics(enabled, "/Contact");
    f.api.setAnalyticsConsent(true);
    f.api.trackLead({}, acceptedId, true);
    assert.equal(f.scripts.length, 0, url);
  }
  const f = fixture();
  f.api.configureAnalytics({ ...enabled, isProduction: false }, "/Contact");
  f.api.setAnalyticsConsent(true);
  f.api.trackLead({}, acceptedId, true);
  assert.equal(f.scripts.length, 0);
});

test("GA remains absent until explicit consent; no denied events replay", () => {
  const f = fixture();
  f.api.configureAnalytics(enabled, "/Contact?email=private@example.test#secret");
  f.api.trackCustomEvent("contact_form_started");
  f.api.trackLead({}, acceptedId);
  assert.equal(f.scripts.length, 0);
  assert.equal(f.w.dataLayer, undefined);
  f.api.setAnalyticsConsent(true);
  assert.equal(f.scripts.length, 1);
  assert.equal(f.events("page_view").length, 1);
  assert.equal(f.events("generate_lead").length, 0);
  assert.equal(f.events("page_view")[0][2].page_location, ORIGIN + "/Contact");
  assert.equal(f.scripts[0].referrerPolicy, "no-referrer");
});

test("initialization and repeated route effects queue one page view per navigation", () => {
  const f = fixture();
  f.api.setAnalyticsConsent(true); // CMP may run before the provider effect.
  f.api.configureAnalytics(enabled, "/Contact");
  f.api.configureAnalytics({ ...enabled }, "/Contact");
  f.api.setAnalyticsConsent(true);
  f.api.trackPageView("/Contact?email=private@example.test#secret");
  assert.equal(f.events("page_view").length, 1);
  assert.equal(f.commands().filter(command => command[0] === "config").length, 1);
  assert.equal(f.commands().find(command => command[0] === "config")[2].send_page_view, false);
  f.api.trackPageView("/Aboutus");
  f.api.trackPageView("/Contact");
  assert.equal(f.events("page_view").length, 3);
  assert.equal(f.scripts.length, 1);
});

test("consent withdrawal disables GA and clears pending commands", () => {
  const f = fixture();
  f.api.configureAnalytics(enabled, "/Contact");
  f.api.setAnalyticsConsent(true);
  f.api.setAnalyticsConsent(false);
  assert.equal(f.w["ga-disable-" + enabled.gaMeasurementId], true);
  assert.equal(f.commands().length, 0);
  f.api.trackFormSubmit("contact_form");
  assert.equal(f.commands().length, 0);
  f.api.setAnalyticsConsent(true);
  assert.equal(f.events("page_view").length, 1);
  assert.equal(f.scripts.length, 1);
});

test("only fixed event/form/button identifiers and sanitized page data reach GA", () => {
  const f = fixture({ referrer: ORIGIN + "/?email=private@example.test" });
  f.api.configureAnalytics(enabled, "/Contact?email=private@example.test#secret");
  f.api.setAnalyticsConsent(true);
  f.api.trackLead({ form_name: "contact_form", name: "Private Person", email: "private@example.test", phone: "+911234567890", message: "secret", page_location: "unsafe", event_id: "unsafe" }, acceptedId);
  f.api.trackButtonClick("Private Person");
  f.api.trackFormSubmit("private@example.test");
  f.api.trackCustomEvent("private@example.test", { email: "private@example.test" });
  f.api.trackButtonClick("request_consultation_hero");
  f.api.trackPageView("/private@example.test?message=secret");
  f.api.trackPageView("/insights/private-person");
  const serialized = JSON.stringify(f.commands());
  assert.doesNotMatch(serialized, /Private Person|private@example|1234567890|secret|unsafe|private-person/);
  assert.equal(f.events("generate_lead")[0][2].form_name, "contact_form");
  assert.equal(f.events("button_click").length, 1);
  assert.equal(f.events("page_view").at(-1)[2].page_path, "/insights/[slug]");
  assert.ok(f.events().every(event => event[2].page_referrer === ""));
});

test("GA and Meta independently deduplicate the same accepted event ID", () => {
  const f = fixture();
  f.api.configureAnalytics(enabled, "/Contact");
  f.api.setAnalyticsConsent(true);
  f.api.trackLead({ form_name: "contact_form", email: "private@example.test" }, acceptedId, true);
  f.api.trackLead({ form_name: "contact_form" }, acceptedId, true);
  f.loadPixel();
  assert.equal(f.events("generate_lead").length, 1);
  assert.equal(f.pixelLeads().length, 1);
  const lead = f.pixelLeads()[0];
  assert.equal(lead[1], enabled.metaPixelId);
  assert.equal(lead[2], "Lead");
  assert.equal(lead[4].eventID, acceptedId);
  assert.doesNotMatch(JSON.stringify(f.w.fbq.queue), /private@example|PageView/);
  assert.ok(f.w.fbq.queue.some(command => command[0] === "set" && command[1] === "autoConfig" && command[2] === false));
  assert.equal(f.scripts.filter(script => script.id === "hotelfirst-meta").length, 1);
});

test("advertising opt-in is independent from analytics consent and defaults false", () => {
  const f = fixture();
  f.api.configureAnalytics(enabled, "/Contact");
  f.api.trackLead({}, acceptedId);
  f.api.trackLead({}, acceptedId, false);
  assert.equal(f.scripts.length, 0);
  f.api.trackLead({}, acceptedId, true);
  f.loadPixel();
  assert.equal(f.pixelLeads().length, 1);
  assert.equal(f.w.gtag, undefined);
  f.api.setAnalyticsConsent(true);
  f.api.trackLead({}, acceptedId, true);
  assert.equal(f.events("generate_lead").length, 1);
  assert.equal(f.pixelLeads().length, 1);
});

test("Meta browser events are suppressed for unsafe URL/referrer contexts", () => {
  for (const options of [
    { url: ORIGIN + "/Contact?email=private@example.test" },
    { url: ORIGIN + "/Contact#private" },
    { url: ORIGIN + "/private@example.test" },
    { referrer: ORIGIN + "/Contact?email=private@example.test" },
    { referrer: "https://external.test/private-person" },
    { referrer: ORIGIN + "/private-person" },
  ]) {
    const f = fixture(options);
    f.api.configureAnalytics(enabled, "/Contact");
    f.api.trackLead({}, acceptedId, true);
    assert.equal(f.scripts.length, 0, JSON.stringify(options));
  }
  const clean = fixture({ referrer: ORIGIN + "/Aboutus" });
  clean.api.configureAnalytics(enabled, "/Contact");
  clean.api.trackLead({}, acceptedId, true);
  clean.loadPixel();
  assert.equal(clean.pixelLeads().length, 1);
});

test("Meta rechecks privacy gates after asynchronous script loading", () => {
  const f = fixture();
  f.api.configureAnalytics(enabled, "/Contact");
  f.api.trackLead({}, acceptedId, true);
  assert.equal(f.pixelLeads().length, 0);
  f.w.location = new URL(ORIGIN + "/Contact?email=private@example.test");
  f.loadPixel();
  assert.equal(f.pixelLeads().length, 0);
  assert.doesNotMatch(JSON.stringify(f.w.fbq.queue), /private@example/);
});

test("invalid IDs, disabled flags, and separately installed tags fail closed", () => {
  const f = fixture();
  f.api.configureAnalytics({ ...enabled, analyticsEnabled: false, metaEnabled: false }, "/Contact");
  f.api.setAnalyticsConsent(true);
  f.api.trackLead({}, acceptedId, true);
  f.loadPixel();
  assert.equal(f.scripts.length, 0);
  f.api.configureAnalytics({ ...enabled, gaMeasurementId: "private@example.test", metaPixelId: "invalid" }, "/Contact");
  f.api.trackLead({}, acceptedId, true);
  assert.equal(f.scripts.length, 0);
  const invalidEvent = fixture();
  invalidEvent.api.configureAnalytics(enabled, "/Contact");
  invalidEvent.api.trackLead({}, "private@example.test", true);
  invalidEvent.api.trackLead({}, undefined, true);
  assert.equal(invalidEvent.scripts.length, 0);
  const occupied = fixture();
  occupied.w.gtag = () => { throw new Error("must not use external tag"); };
  occupied.w.fbq = () => { throw new Error("must not use external pixel"); };
  occupied.api.configureAnalytics(enabled, "/Contact");
  occupied.api.setAnalyticsConsent(true);
  occupied.api.trackLead({}, acceptedId, true);
  assert.equal(occupied.scripts.length, 0);
});

test("script failures and throwing trackers never escape into the form workflow", () => {
  const blocked = fixture({ failScript: true });
  blocked.api.configureAnalytics(enabled, "/Contact");
  blocked.api.setAnalyticsConsent(true);
  blocked.api.trackLead({}, acceptedId, true);
  assert.equal(blocked.scripts.length, 0);
  const f = fixture();
  f.api.configureAnalytics(enabled, "/Contact");
  f.api.setAnalyticsConsent(true);
  f.api.trackLead({}, acceptedId, true);
  f.w.gtag = () => { throw new Error("mock GA failure"); };
  f.w.fbq.callMethod = () => { throw new Error("mock Meta failure"); };
  assert.doesNotThrow(() => f.api.trackLead({}, otherId, true));
  assert.doesNotThrow(() => f.api.trackPageView("/Aboutus"));
  assert.doesNotThrow(() => f.api.trackCustomEvent("generate_lead", new Proxy({}, { get() { throw new Error("hostile getter"); } })));
  for (const script of f.scripts) assert.doesNotThrow(() => script.onerror());
});

console.log(`${passed} isolated analytics tests passed. No network requests or vendor scripts executed.`);
