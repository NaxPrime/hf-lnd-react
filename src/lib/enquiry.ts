import { createHash, createHmac } from "node:crypto";
import { isIP } from "node:net";
import schema from "@/Content/contact-sheet-schema.json";
import { getGoogleAccessToken } from "@/lib/google-sheets-auth";

export const ENQUIRY_ORIGIN = "https://www.hotelfirst.one";
export const MAX_ENQUIRY_BYTES = 8192;
const SHEETS_API = "https://sheets.googleapis.com/v4/spreadsheets";
type Environment = Record<string, string | undefined>;
type Send = typeof fetch;
type Enquiry = {
  submissionId: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  agree: true;
  advertisingConsent: boolean;
  website: string;
  pageUrl: string;
  referrer: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
};

function reply(status: number, body: Record<string, unknown>) {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow",
      ...(status === 429 ? { "Retry-After": "3600" } : {}),
    },
  });
}

class InvalidRequest extends Error {
  constructor(public status: number, public code: string) { super(code); }
}

async function readBody(request: Request): Promise<unknown> {
  if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") {
    throw new InvalidRequest(415, "invalid_content_type");
  }
  if (Number(request.headers.get("content-length") || "0") > MAX_ENQUIRY_BYTES) {
    throw new InvalidRequest(413, "body_too_large");
  }
  if (!request.body) throw new InvalidRequest(400, "invalid_body");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_ENQUIRY_BYTES) {
        await reader.cancel();
        throw new InvalidRequest(413, "body_too_large");
      }
      chunks.push(value);
    }
    const joined = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) { joined.set(chunk, offset); offset += chunk.length; }
    return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(joined));
  } catch (error) {
    if (error instanceof InvalidRequest) throw error;
    throw new InvalidRequest(400, "invalid_body");
  } finally { reader.releaseLock(); }
}

export function validateEnquiry(value: unknown): Enquiry {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new InvalidRequest(400, "invalid_body");
  const body = value as Record<string, unknown>;
  const fields = ["submissionId", "name", "email", "phone", "message", "agree", "advertisingConsent",
    "website", "pageUrl", "referrer", "utmSource", "utmMedium", "utmCampaign"];
  if (Object.keys(body).some((key) => !fields.includes(key))) throw new InvalidRequest(400, "invalid_fields");
  const text = (key: string, max: number, multiline = false) => {
    const item = body[key];
    const controls = multiline ? /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/ : /[\u0000-\u001f\u007f]/;
    if (typeof item !== "string" || !item.trim() || item.length > max || controls.test(item)) {
      throw new InvalidRequest(400, "invalid_fields");
    }
    return item.trim();
  };
  const optional = (key: string, max: number) => {
    const item = body[key];
    if (item === undefined) return "";
    if (typeof item !== "string" || item.length > max || /[\u0000-\u001f\u007f]/.test(item)) {
      throw new InvalidRequest(400, "invalid_fields");
    }
    return item.trim();
  };
  const submissionId = text("submissionId", 36).toLowerCase();
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(submissionId)) {
    throw new InvalidRequest(400, "invalid_fields");
  }
  const name = text("name", 120);
  const email = text("email", 254).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new InvalidRequest(400, "invalid_fields");
  const rawPhone = text("phone", 30);
  if (!/^[+\d\s()-]+$/.test(rawPhone)) throw new InvalidRequest(400, "invalid_fields");
  let phone = rawPhone.replace(/\D/g, "");
  if (phone.startsWith("00")) phone = phone.slice(2);
  if (/^[6-9]\d{9}$/.test(phone)) phone = "91" + phone;
  if (!/^91[6-9]\d{9}$/.test(phone)) throw new InvalidRequest(400, "invalid_fields");
  const message = text("message", 5000, true);
  if (body.agree !== true || typeof body.advertisingConsent !== "boolean") {
    throw new InvalidRequest(400, "consent_required");
  }
  const pageUrl = optional("pageUrl", 500);
  if (pageUrl) {
    try { if (new URL(pageUrl).origin !== ENQUIRY_ORIGIN) throw new Error(); }
    catch { throw new InvalidRequest(400, "invalid_fields"); }
  }
  const referrer = optional("referrer", 500);
  if (referrer) {
    try { if (!/^https?:$/.test(new URL(referrer).protocol)) throw new Error(); }
    catch { throw new InvalidRequest(400, "invalid_fields"); }
  }
  return { submissionId, name, email, phone, message, agree: true,
    advertisingConsent: body.advertisingConsent, website: optional("website", 200), pageUrl, referrer,
    utmSource: optional("utmSource", 120), utmMedium: optional("utmMedium", 120),
    utmCampaign: optional("utmCampaign", 120) };
}

function productionReady(env: Environment, request: Request) {
  // NODE_ENV=production also occurs in local builds and is insufficient.
  return env.VERCEL === "1" && env.VERCEL_ENV === "production" &&
    env.ENQUIRY_OUTBOUND_ENABLED === "true" && new URL(request.url).origin === ENQUIRY_ORIGIN;
}

function sheetsReady(env: Environment) {
  return /^[A-Za-z0-9_-]{20,}$/.test(env.HOTELFIRST_SHEET_ID || "") &&
    Boolean(env.GOOGLE_SERVICE_ACCOUNT_JSON_BASE64) && (env.ENQUIRY_RATE_LIMIT_SALT?.length || 0) >= 32;
}

function metaReady(env: Environment) {
  return env.META_CAPI_ENABLED === "true" && /^\d+$/.test(env.META_PIXEL_ID || "") &&
    Boolean(env.META_CONVERSIONS_API_TOKEN) && /^v\d+\.\d+$/.test(env.META_GRAPH_API_VERSION || "") &&
    !env.META_CONVERSIONS_API_TEST_EVENT_CODE;
}

async function sendMeta(send: Send, env: Environment, enquiry: Enquiry, request: Request, ip: string) {
  if (!enquiry.advertisingConsent || !metaReady(env)) return "disabled";
  const hash = (input: string) => createHash("sha256").update(input.trim().toLowerCase()).digest("hex");
  try {
    const response = await send(`https://graph.facebook.com/${env.META_GRAPH_API_VERSION}/${env.META_PIXEL_ID}/events`, {
      method: "POST", redirect: "error", cache: "no-store", signal: AbortSignal.timeout(3000),
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${env.META_CONVERSIONS_API_TOKEN}` },
      body: JSON.stringify({ data: [{
        event_name: "Lead", event_time: Math.floor(Date.now() / 1000), event_id: enquiry.submissionId,
        action_source: "website", event_source_url: ENQUIRY_ORIGIN + "/Contact",
        user_data: { em: [hash(enquiry.email)], ph: [hash(enquiry.phone)],
          client_ip_address: ip, client_user_agent: (request.headers.get("user-agent") || "").slice(0, 512) },
        custom_data: { form_name: "contact_form", lead_source: "website_contact_form" },
      }] }),
    });
    if (!response.ok) return "failed";
    const result = await response.json();
    return result?.events_received === 1 ? "sent" : "failed";
  } catch { return "failed"; }
}

function sheetUrl(env: Environment, suffix: string) {
  return `${SHEETS_API}/${env.HOTELFIRST_SHEET_ID}/${suffix}`;
}

async function readExisting(send: Send, env: Environment, token: string) {
  const query = new URLSearchParams();
  for (const range of ["A2:A", "C2:C", "E2:E", "S2:S", "T2:T"]) query.append("ranges", `${schema.tab}!${range}`);
  query.set("valueRenderOption", "UNFORMATTED_VALUE");
  const response = await send(sheetUrl(env, `values:batchGet?${query}`), {
    method: "GET", redirect: "error", cache: "no-store", signal: AbortSignal.timeout(5000),
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("sheet_read_failed");
  const result = await response.json() as { valueRanges?: { values?: string[][] }[] };
  if (!Array.isArray(result.valueRanges) || result.valueRanges.length !== 5 ||
      result.valueRanges.some((entry) => entry.values !== undefined && !Array.isArray(entry.values))) {
    throw new Error("sheet_read_invalid");
  }
  return result.valueRanges.map((entry) => (entry.values || []).map((row) => String(row?.[0] ?? "")));
}

async function appendEnquiry(send: Send, env: Environment, token: string, row: string[]) {
  const range = encodeURIComponent(`${schema.tab}!A:U`);
  const response = await send(sheetUrl(env, `values/${range}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`), {
    method: "POST", redirect: "error", cache: "no-store", signal: AbortSignal.timeout(8000),
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ values: [row] }),
  });
  if (!response.ok) throw new Error("sheet_append_failed");
  const result = await response.json();
  if (result?.updates?.updatedRows !== 1 || result?.updates?.updatedColumns !== schema.headers.length ||
      !String(result?.updates?.updatedRange || "").startsWith(`${schema.tab}!A`)) {
    throw new Error("sheet_append_unconfirmed");
  }
}

export function createEnquiryHandler({ env, send = fetch, authorize = getGoogleAccessToken }:
  { env: Environment; send?: Send; authorize?: (env: Environment) => Promise<string> }) {
  return async function handleEnquiry(request: Request): Promise<Response> {
    const requestOrigin = new URL(request.url).origin;
    const fetchSite = request.headers.get("sec-fetch-site");
    if (request.headers.get("origin") !== requestOrigin || (fetchSite && fetchSite !== "same-origin")) {
      return reply(403, { ok: false, code: "origin_rejected" });
    }
    let enquiry: Enquiry;
    try { enquiry = validateEnquiry(await readBody(request)); }
    catch (error) {
      const invalid = error instanceof InvalidRequest ? error : new InvalidRequest(400, "invalid_body");
      return reply(invalid.status, { ok: false, code: invalid.code });
    }
    if (enquiry.website) return reply(200, { ok: false, code: "delivery_unconfirmed" });
    if (!productionReady(env, request)) return reply(503, { ok: false, code: "delivery_disabled" });
    if (!sheetsReady(env)) return reply(503, { ok: false, code: "delivery_unconfigured" });
    // Trusted only on Vercel, whose edge sets this header. No body-IP fallback.
    const ip = request.headers.get("x-vercel-forwarded-for")?.trim() || "";
    if (!isIP(ip)) return reply(503, { ok: false, code: "delivery_unconfigured" });
    const digest = (value: string) => createHmac("sha256", env.ENQUIRY_RATE_LIMIT_SALT!).update(value).digest("hex");
    const fingerprint = digest(JSON.stringify(enquiry));
    const ipHash = digest(ip);
    const advertisingEligible = enquiry.advertisingConsent && metaReady(env);
    let token: string;
    let rows: string[][];
    try {
      token = await authorize(env);
      rows = await readExisting(send, env, token);
    } catch { return reply(503, { ok: false, code: "abuse_control_unavailable" }); }
    const [ids, dates, emails, ips, hashes] = rows;
    const existingIndex = ids.findIndex((value) => value === enquiry.submissionId);
    if (existingIndex >= 0) {
      if (hashes[existingIndex] !== fingerprint) return reply(409, { ok: false, code: "delivery_pending" });
      return reply(200, { ok: true, accepted: true, eventId: enquiry.submissionId, replay: true,
        advertisingEligible, tracking: "not_repeated" });
    }
    const now = new Date();
    let ipCount = 0;
    let emailCount = 0;
    for (let index = 0; index < dates.length; index++) {
      const created = Date.parse(dates[index]);
      if (!Number.isFinite(created)) continue;
      const elapsed = now.getTime() - created;
      if (elapsed >= 0 && elapsed < 15 * 60_000 && ips[index] === ipHash) ipCount++;
      if (elapsed >= 0 && elapsed < 60 * 60_000 && emails[index] === enquiry.email) emailCount++;
    }
    if (ipCount >= 5 || emailCount >= 3) return reply(429, { ok: false, code: "rate_limited" });
    const submittedUtc = now.toISOString();
    const submittedIst = new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Kolkata", year: "numeric",
      month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(now);
    const row = [enquiry.submissionId, submittedIst, submittedUtc, enquiry.name, enquiry.email,
      enquiry.phone, enquiry.message, "New", "", "", "", "Website contact form", enquiry.pageUrl,
      enquiry.referrer, enquiry.utmSource, enquiry.utmMedium, enquiry.utmCampaign,
      enquiry.advertisingConsent ? "Yes" : "No", ipHash, fingerprint,
      (request.headers.get("user-agent") || "").slice(0, 512)];
    try { await appendEnquiry(send, env, token, row); }
    catch { return reply(502, { ok: false, code: "delivery_unconfirmed" }); }
    const tracking = await sendMeta(send, env, enquiry, request, ip);
    return reply(200, { ok: true, accepted: true, eventId: enquiry.submissionId, replay: false,
      advertisingEligible, tracking });
  };
}
