import { notFound, permanentRedirect } from "next/navigation";
import { legacyDestination, legacySlugs } from "@/lib/legacy-search";

export const dynamicParams = false;

export function generateStaticParams() {
  return legacySlugs.map((slug) => ({ slug }));
}

export default async function LegacySearchRedirect({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const destination = legacyDestination(slug);
  if (!destination) notFound();
  permanentRedirect(destination);
}
