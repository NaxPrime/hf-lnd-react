import { notFound, permanentRedirect } from "next/navigation";
import { legacyDestination, legacyServices } from "@/lib/legacy-search";

export const dynamicParams = false;

export function generateStaticParams() {
  return legacyServices.map((topic) => ({ topic }));
}

export default async function LegacyFaqRedirect({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params;
  const destination = legacyDestination(topic);
  if (!destination) notFound();
  permanentRedirect(destination);
}
