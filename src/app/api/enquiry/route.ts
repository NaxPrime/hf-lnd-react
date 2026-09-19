import { createEnquiryHandler } from "@/lib/enquiry";

export const runtime = "nodejs";

export async function POST(request: Request) {
  return createEnquiryHandler({ env: process.env })(request);
}
