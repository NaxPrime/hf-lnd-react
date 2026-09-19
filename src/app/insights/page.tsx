import { notFound } from "next/navigation";
import { getVisibleInsights, isContentPreview, ownerMetadata } from "@/lib/owner-content";
import { OwnerFrame, DraftStatus } from "@/components/OwnerLibrary/OwnerFrame";
import ContentLibrary from "@/components/OwnerLibrary/ContentLibrary";
import styles from "@/components/OwnerLibrary/OwnerLibrary.module.css";

export function generateMetadata() {
  const guides = getVisibleInsights();
  return ownerMetadata("Hotel owner decision guides", "Owner-side guides to hotel brands, feasibility, asset performance, mystery audits and turnarounds.", "/insights", guides.length > 0 && !isContentPreview());
}

export default function InsightsPage() {
  const guides = getVisibleInsights();
  if (!guides.length) notFound();
  return <OwnerFrame><p className={styles.eyebrow}>HotelFirst Advisory / Owner library</p>
    <h1 className={styles.title}>Hotel owner decision guides</h1>
    <p className={styles.intro}>The questions, documents and trade-offs behind a hotel decision. From the first brand shortlist to the next operating review.</p>
    {isContentPreview() ? <DraftStatus /> : null}
    <ContentLibrary entries={guides.map((guide) => ({ id: guide.id, title: guide.title, description: guide.description, group: guide.pillar, href: `/insights/${guide.slug}` }))} />
  </OwnerFrame>;
}
