import { notFound } from "next/navigation";
import { getVisibleResources, isContentPreview, ownerMetadata } from "@/lib/owner-content";
import { OwnerFrame, DraftStatus } from "@/components/OwnerLibrary/OwnerFrame";
import ContentLibrary from "@/components/OwnerLibrary/ContentLibrary";
import styles from "@/components/OwnerLibrary/OwnerLibrary.module.css";

export function generateMetadata() {
  const resources = getVisibleResources();
  return ownerMetadata("Hotel owner decision worksheets", "Practical working documents for hotel brand selection, feasibility, performance oversight and operational decisions.", "/resources", resources.length > 0 && !isContentPreview());
}

export default function ResourcesPage() {
  const resources = getVisibleResources();
  if (!resources.length) notFound();
  return <OwnerFrame><p className={styles.eyebrow}>HotelFirst Advisory / Working documents</p>
    <h1 className={styles.title}>Hotel owner decision worksheets</h1>
    <p className={styles.intro}>Make the assumptions, evidence and unresolved questions visible before the next commitment.</p>{isContentPreview() ? <DraftStatus /> : null}
    <ContentLibrary entries={resources.map((item) => ({ id: item.id, title: item.title, description: item.answer, group: "Decision worksheets", href: item.route }))} />
  </OwnerFrame>;
}
