import { createEnquiryHandler } from "@/lib/enquiry";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: Request) {
  return createEnquiryHandler({ env: process.env })(request);
}
