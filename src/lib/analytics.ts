// Server-derived configuration; consent is never inferred or persisted.
export interface AnalyticsConfig {
  isProduction: boolean;
  analyticsEnabled: boolean;
  gaMeasurementId: string;
  metaEnabled: boolean;
  metaPixelId: string;
}

const ORIGIN = "https://www.hotelfirst.one";
const knownPaths = new Set([
  "/", "/Aboutus", "/Contact", "/privacy-policy", "/terms-and-conditions",
  "/services/BrandSelection", "/services/BusinessIntelligence",
  "/services/AssetManagement", "/services/MysteryAudit", "/services/AdhocConsultation",
  "/insights", "/resources",
]);
const eventNames = new Set([
  "contact_form_started", "contact_form_submitted", "contact_form_failed",
  "email_clicked", "phone_clicked", "button_click", "form_submit", "generate_lead",
]);
const formNames = new Set(["contact_form", "newsletter_signup"]);
const buttonNames = new Set([
  "request_consultation_desktop", "request_consultation_mobile", "request_consultation_hero",
]);

type Pixel = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[][];
  push?: Pixel;
  loaded: boolean;
  version: string;
};
type TrackingWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  fbq?: Pixel;
  _fbq?: Pixel;
} & Record<string, unknown>;

let config: AnalyticsConfig = {
  isProduction: false, analyticsEnabled: false, gaMeasurementId: "",
  metaEnabled: false, metaPixelId: "",
};
let analyticsConsent = false;
let gaId = "";
let gaConfigured = false;
let gaFailed = false;
let pixelId = "";
let pixelFailed = false;
let pixelLoaded = false;
let currentPath = "/";
let lastPagePath: string | undefined;
const gaLeadIds = new Set<string>();
const metaLeadIds = new Set<string>();
const pendingMetaLeads = new Set<string>();

function browser(): TrackingWindow | undefined {
  return typeof window === "undefined" ? undefined : window as unknown as TrackingWindow;
}

function production(w: TrackingWindow): boolean {
  return config.isProduction === true && w.location.origin === ORIGIN;
}

function gaAllowed(w: TrackingWindow): boolean {
  return production(w) && analyticsConsent && config.analyticsEnabled === true && !gaFailed &&
    /^G-[A-Z0-9]{4,20}$/.test(config.gaMeasurementId) && (!gaId || gaId === config.gaMeasurementId);
}

function safePath(path: string): string {
  const parsed = new URL(path, ORIGIN);
  if (parsed.origin !== ORIGIN) return "/other";
  if (knownPaths.has(parsed.pathname)) return parsed.pathname;
  // Aggregate dynamic routes rather than sending arbitrary URL segments or names.
  if (parsed.pathname.startsWith("/insights/")) return "/insights/[slug]";
  if (parsed.pathname.startsWith("/resources/")) return "/resources/[slug]";
  return "/other";
}

function pageData() {
  const path = safePath(currentPath);
  return { page_path: path, page_location: ORIGIN + path, page_referrer: "", page_title: "HotelFirst" };
}

function safeParams(params: Record<string, unknown>): Record<string, string> {
  const safe: Record<string, string> = {};
  if (typeof params.form_name === "string" && formNames.has(params.form_name)) safe.form_name = params.form_name;
  if (typeof params.button_name === "string" && buttonNames.has(params.button_name)) safe.button_name = params.button_name;
  return safe;
}

function addScript(id: string, src: string, onError: () => void, onLoad?: () => void): void {
  const script = document.createElement("script");
  script.id = id;
  script.async = true;
  script.src = src;
  script.referrerPolicy = "no-referrer";
  script.onerror = onError;
  if (onLoad) script.onload = onLoad;
  document.head.appendChild(script);
}

function disableGa(w: TrackingWindow): void {
  if (!gaId) return;
  w["ga-disable-" + gaId] = true;
  // Also discard commands queued while the vendor script was still loading.
  if (Array.isArray(w.dataLayer)) w.dataLayer.length = 0;
  gaConfigured = false;
  lastPagePath = undefined;
}

function ensureGa(w: TrackingWindow): boolean {
  if (!gaAllowed(w)) { disableGa(w); return false; }
  if (!gaId) {
    // Refuse to combine with a separately installed tag or GTM container.
    if (w.gtag || w.dataLayer) return false;
    gaId = config.gaMeasurementId;
    w.dataLayer = [];
    w.gtag = (...args: unknown[]) => {
      if (gaAllowed(w)) w.dataLayer?.push(args);
    };
    w["ga-disable-" + gaId] = false;
    w.gtag("consent", "default", {
      analytics_storage: "granted", ad_storage: "denied",
      ad_user_data: "denied", ad_personalization: "denied",
    });
    w.gtag("js", new Date());
    // The queue exists before tag loading, so early route effects are not lost.
    try {
      addScript("hotelfirst-ga", "https://www.googletagmanager.com/gtag/js?id=" + gaId, () => {
        gaFailed = true;
        try { disableGa(w); } catch { /* Analytics must never affect the form. */ }
      });
    } catch {
      gaFailed = true;
      disableGa(w);
      return false;
    }
  }
  w["ga-disable-" + gaId] = false;
  if (!gaConfigured) {
    w.gtag?.("consent", "update", {
      analytics_storage: "granted", ad_storage: "denied",
      ad_user_data: "denied", ad_personalization: "denied",
    });
    // Release prerequisite: disable Enhanced Measurement history page views and
    // automatic form/site-search/outbound measurement in the GA stream settings.
    // send_page_view:false alone does not disable history-based automatic events.
    w.gtag?.("config", gaId, {
      send_page_view: false, allow_google_signals: false,
      allow_ad_personalization_signals: false, ...pageData(),
    });
    gaConfigured = true;
  }
  return true;
}

function sendGa(eventName: string, params: Record<string, unknown> = {}): boolean {
  const w = browser();
  if (!w || !eventNames.has(eventName) || !ensureGa(w)) return false;
  const safe = safeParams(params);
  if (eventName === "button_click" && !safe.button_name) return false;
  if (eventName === "form_submit" && !safe.form_name) return false;
  w.gtag?.("event", eventName, { ...safe, ...pageData(), send_to: gaId });
  return true;
}

function syncPageView(): void {
  const w = browser();
  if (!w || !ensureGa(w) || lastPagePath === currentPath) return;
  const data = pageData();
  w.gtag?.("set", data);
  w.gtag?.("event", "page_view", { ...data, send_to: gaId });
  lastPagePath = currentPath;
}

/** Called by the provider with server-derived flags. Never enables consent. */
export function configureAnalytics(next: AnalyticsConfig, path = "/"): void {
  try {
    if (!browser()) return;
    config = { ...next };
    const parsed = new URL(path, ORIGIN);
    currentPath = parsed.origin === ORIGIN ? parsed.pathname : "/other";
    syncPageView();
  } catch { /* Tracking is optional. */ }
}

/** Future CMP integration must call this explicitly. False after every page load. */
export function setAnalyticsConsent(granted: boolean): void {
  try {
    const w = browser();
    if (!w) return;
    analyticsConsent = granted === true;
    if (!analyticsConsent) disableGa(w);
    else syncPageView();
  } catch { /* Tracking is optional. */ }
}

export function trackPageView(path: string): void {
  try {
    if (!browser()) return;
    const parsed = new URL(path, ORIGIN);
    currentPath = parsed.origin === ORIGIN ? parsed.pathname : "/other";
    syncPageView();
  } catch { /* Tracking is optional. */ }
}

export function trackCustomEvent(eventName: string, params: Record<string, unknown> = {}): void {
  try { sendGa(eventName, params); } catch { /* Never log event parameters. */ }
}

// Compatibility alias: one sanitized GA path, not a second GTM event.
export const pushToDataLayer = trackCustomEvent;

function safePixelContext(w: TrackingWindow): boolean {
  // Pixel reads document URL/referrer itself. Suppress browser events when those
  // might contain user data; consented server Leads remain independent.
  if (w.location.pathname !== "/Contact" || w.location.search || w.location.hash) return false;
  if (!document.referrer) return true;
  const referrer = new URL(document.referrer);
  return referrer.origin === ORIGIN && knownPaths.has(referrer.pathname) && !referrer.search && !referrer.hash;
}

function flushMetaLeads(w: TrackingWindow): void {
  if (!pixelLoaded || !pendingMetaLeads.size) return;
  // Recheck after asynchronous SDK loading; navigation may have changed the URL.
  if (!production(w) || config.metaEnabled !== true || pixelId !== config.metaPixelId || !safePixelContext(w)) {
    pendingMetaLeads.clear();
    return;
  }
  w.fbq?.("consent", "grant");
  for (const id of pendingMetaLeads) {
    w.fbq?.("trackSingle", pixelId, "Lead", { content_name: "HotelFirst contact form" }, { eventID: id });
    pendingMetaLeads.delete(id);
  }
}

function sendMetaLead(eventId: string): boolean {
  const w = browser();
  if (!w || !production(w) || config.metaEnabled !== true || pixelFailed ||
      !/^\d{5,25}$/.test(config.metaPixelId) || !safePixelContext(w) ||
      (pixelId && pixelId !== config.metaPixelId)) return false;
  if (!pixelId) {
    if (w.fbq || w._fbq) return false;
    const fbq: Pixel = Object.assign(function (...args: unknown[]) {
      if (fbq.callMethod) fbq.callMethod(...args);
      else fbq.queue.push(args);
    }, { queue: [] as unknown[][], loaded: true, version: "2.0" });
    fbq.push = fbq;
    w.fbq = fbq;
    w._fbq = fbq;
    pixelId = config.metaPixelId;
    fbq("consent", "revoke");
    fbq("set", "autoConfig", false, pixelId);
    fbq("init", pixelId);
    try {
      addScript("hotelfirst-meta", "https://connect.facebook.net/en_US/fbevents.js", () => {
        pixelFailed = true;
        pendingMetaLeads.clear();
        try { fbq.queue.length = 0; } catch { /* Tracking is optional. */ }
      }, () => {
        pixelLoaded = true;
        try { flushMetaLeads(w); } catch { pendingMetaLeads.clear(); }
      });
    } catch { pixelFailed = true; fbq.queue.length = 0; return false; }
  }
  pendingMetaLeads.add(eventId);
  flushMetaLeads(w);
  // No PageView/custom events are emitted. Do not immediately revoke: the Pixel
  // may still be loading and an immediate revoke can suppress this queued Lead.
  return true;
}

/** Only after enquiry API provider acceptance. No contact values are sent. */
export function trackLead(
  params: Record<string, unknown> = {}, eventId?: string, advertisingEligible = false,
): void {
  const validId = typeof eventId === "string" && /^[A-Za-z0-9_-]{8,128}$/.test(eventId) ? eventId : undefined;
  try {
    if ((!validId || !gaLeadIds.has(validId)) && sendGa("generate_lead", params) && validId) gaLeadIds.add(validId);
  } catch { /* GA failure must not suppress an independently consented Meta Lead. */ }
  try {
    if (advertisingEligible === true && validId && !metaLeadIds.has(validId) && sendMetaLead(validId)) metaLeadIds.add(validId);
  } catch { /* Tracking cannot change the enquiry result. */ }
}

export function trackButtonClick(buttonName: string): void {
  trackCustomEvent("button_click", { button_name: buttonName });
}

export function trackFormSubmit(formName: string): void {
  trackCustomEvent("form_submit", { form_name: formName });
}
