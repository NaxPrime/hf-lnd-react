// Retired: a browser assertion cannot prove that an inquiry was accepted.
// Only /api/enquiry may emit CAPI after server-confirmed provider acceptance.
export function POST() {
  return Response.json({ ok: false, code: "retired_endpoint" }, {
    status: 410,
    headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" },
  });
}

export function GET() {
  return Response.json({ enabled: false, mode: "server_accepted_enquiries_only" }, {
    headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" },
  });
}
