import { createHash, createHmac } from "node:crypto";
import { isIP } from "node:net";

/**
 * Production prerequisites (never read or provisioned by isolated tests):
 * VERCEL=1, VERCEL_ENV=production, ENQUIRY_OUTBOUND_ENABLED=true,
 * FORMSPREE_FORM_ID, ENQUIRY_REDIS_REST_URL / ENQUIRY_REDIS_REST_TOKEN,
 * and a random ENQUIRY_RATE_LIMIT_SALT of at least 32 characters.
 * The Upstash database must support EVAL and retain receipts for 24 hours.
 * Confirm trusted Vercel forwarding headers and edge/bot protection before release;
 * Origin checks and this shared IP/email quota do not eliminate distributed abuse.
 * Optional CAPI: META_CAPI_ENABLED=true, META_PIXEL_ID, META_GRAPH_API_VERSION,
 * META_CONVERSIONS_API_TOKEN, and no META_CONVERSIONS_API_TEST_EVENT_CODE.
 * Customer advertisingConsent must also be true. No names/messages go to Meta.
 * Provider acceptance is not proof of inbox delivery. Ambiguous attempts require
 * provider-side reconciliation; there is no automatic delivery or CAPI retry.
 */
export const ENQUIRY_ORIGIN = "https://www.hotelfirst.one";
export const MAX_ENQUIRY_BYTES = 8192;
const RECEIPT_TTL_SECONDS = 86400;
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
};

// A shared Redis transaction, not a per-process counter. Keys contain keyed
// digests, not contact details. Pending receipts survive ambiguous provider errors
// for 24 hours so a retry cannot automatically send a second real inquiry.
export const RESERVE_ENQUIRY_LUA = `
local existing = redis.call('GET', KEYS[1])
if existing then return existing end
local ipCount = redis.call('INCR', KEYS[2])
if ipCount == 1 then redis.call('EXPIRE', KEYS[2], 900) end
local emailCount = redis.call('INCR', KEYS[3])
if emailCount == 1 then redis.call('EXPIRE', KEYS[3], 3600) end
if ipCount > 5 or emailCount > 3 then return 'rate_limited' end
redis.call('SET', KEYS[1], 'pending:' .. ARGV[1], 'EX', ARGV[2])
return 'reserved'
`;

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
  const fields = ["submissionId", "name", "email", "phone", "message", "agree", "advertisingConsent"];
  if (Object.keys(body).some((key) => !fields.includes(key))) throw new InvalidRequest(400, "invalid_fields");
  const text = (key: string, max: number, multiline = false) => {
    const item = body[key];
    const controls = multiline ? /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/ : /[\u0000-\u001f\u007f]/;
    if (typeof item !== "string" || !item.trim() || item.length > max || controls.test(item)) {
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
  return { submissionId, name, email, phone, message, agree: true, advertisingConsent: body.advertisingConsent };
}

function productionReady(env: Environment, request: Request) {
  // NODE_ENV=production also occurs in local builds and is insufficient.
  return env.VERCEL === "1" && env.VERCEL_ENV === "production" &&
    env.ENQUIRY_OUTBOUND_ENABLED === "true" && new URL(request.url).origin === ENQUIRY_ORIGIN;
}

function storeReady(env: Environment) {
  return /^https:\/\/[a-z0-9-]+\.upstash\.io\/?$/.test(env.ENQUIRY_REDIS_REST_URL || "") &&
    Boolean(env.ENQUIRY_REDIS_REST_TOKEN) && (env.ENQUIRY_RATE_LIMIT_SALT?.length || 0) >= 32 &&
    /^[a-zA-Z0-9]{6,64}$/.test(env.FORMSPREE_FORM_ID || "");
}

function metaReady(env: Environment) {
  return env.META_CAPI_ENABLED === "true" && /^\d+$/.test(env.META_PIXEL_ID || "") &&
    Boolean(env.META_CONVERSIONS_API_TOKEN) && /^v\d+\.\d+$/.test(env.META_GRAPH_API_VERSION || "") &&
    !env.META_CONVERSIONS_API_TEST_EVENT_CODE;
}

async function redis(send: Send, env: Environment, command: (string | number)[]) {
  const response = await send(env.ENQUIRY_REDIS_REST_URL!, {
    method: "POST", redirect: "error", cache: "no-store",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${env.ENQUIRY_REDIS_REST_TOKEN}` },
    body: JSON.stringify(command), signal: AbortSignal.timeout(3000),
  });
  if (!response.ok) throw new Error("store_unavailable");
  const data = await response.json();
  if (!data || data.error || typeof data.result !== "string") throw new Error("store_unavailable");
  return data.result as string;
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

export function createEnquiryHandler({ env, send = fetch }: { env: Environment; send?: Send }) {
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
    if (!productionReady(env, request)) return reply(503, { ok: false, code: "delivery_disabled" });
    if (!storeReady(env)) return reply(503, { ok: false, code: "delivery_unconfigured" });
    // Trusted only on Vercel, whose edge sets this header. No body-IP fallback.
    const ip = request.headers.get("x-vercel-forwarded-for")?.trim() || "";
    if (!isIP(ip)) return reply(503, { ok: false, code: "delivery_unconfigured" });
    const digest = (value: string) => createHmac("sha256", env.ENQUIRY_RATE_LIMIT_SALT!).update(value).digest("hex");
    const fingerprint = digest(JSON.stringify(enquiry));
    const receiptKey = `hf:enquiry:v1:receipt:${enquiry.submissionId}`;
    let reservation: string;
    try {
      reservation = await redis(send, env, ["EVAL", RESERVE_ENQUIRY_LUA, 3, receiptKey,
        `hf:enquiry:v1:ip:${digest(ip)}`, `hf:enquiry:v1:email:${digest(enquiry.email)}`, fingerprint, RECEIPT_TTL_SECONDS]);
    } catch { return reply(503, { ok: false, code: "abuse_control_unavailable" }); }
    const advertisingEligible = enquiry.advertisingConsent && metaReady(env);
    if (reservation === `accepted:${fingerprint}`) {
      return reply(200, { ok: true, accepted: true, eventId: enquiry.submissionId, replay: true,
        advertisingEligible, tracking: "not_repeated" });
    }
    if (reservation === "rate_limited") return reply(429, { ok: false, code: "rate_limited" });
    if (reservation !== "reserved") return reply(409, { ok: false, code: "delivery_pending" });

    try {
      const response = await send(`https://formspree.io/f/${env.FORMSPREE_FORM_ID}`, {
        method: "POST", redirect: "error", cache: "no-store", signal: AbortSignal.timeout(8000),
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name: enquiry.name, email: enquiry.email, phone: enquiry.phone,
          message: enquiry.message, agree: true, advertisingConsent: enquiry.advertisingConsent,
          submissionId: enquiry.submissionId }),
      });
      const result = await response.json();
      // Formspree's installed SDK recognizes a successful JSON response by its
      // string `next` field; do not assume an undocumented `ok: true` field.
      if (!response.ok || !result || typeof result !== "object" || Array.isArray(result) ||
          typeof result.next !== "string" || !result.next || "errors" in result || "error" in result || result.ok === false) {
        throw new Error("provider_not_accepted");
      }
    } catch { return reply(502, { ok: false, code: "delivery_unconfirmed" }); }

    // Accepted inquiries stay successful even if receipt persistence or optional
    // measurement fails. A pending receipt prevents automatic duplicate delivery.
    let receiptSaved = false;
    try { receiptSaved = await redis(send, env, ["SET", receiptKey, `accepted:${fingerprint}`, "XX", "EX", RECEIPT_TTL_SECONDS]) === "OK"; }
    catch { /* Do not expose upstream diagnostics or personal information. */ }
    const tracking = receiptSaved ? await sendMeta(send, env, enquiry, request, ip) : "skipped";
    return reply(200, { ok: true, accepted: true, eventId: enquiry.submissionId, replay: false,
      advertisingEligible: receiptSaved && advertisingEligible, tracking });
  };
}
