import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { getVisibleInsights, getVisibleResources, isApproved, ownerMetadata, ownerPageSchema } from "@/lib/owner-content";
import { serializeJsonLd } from "@/lib/search";
import { OwnerFrame, DecisionDiagram, DraftStatus } from "@/components/OwnerLibrary/OwnerFrame";
import styles from "@/components/OwnerLibrary/OwnerLibrary.module.css";

export const dynamicParams = false;
export function generateStaticParams() { return getVisibleInsights().map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getVisibleInsights().find((item) => item.slug === slug);
  if (!guide) notFound();
  return ownerMetadata(guide.title, guide.description, `/insights/${guide.slug}`, isApproved(guide));
}

export default async function InsightPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guides = getVisibleInsights();
  const guide = guides.find((item) => item.slug === slug);
  if (!guide) notFound();
  const related = guides.filter((item) => guide.relatedIds.includes(item.id));
  const worksheets = getVisibleResources().filter((item) => item.service === guide.servicePath);
  return <OwnerFrame>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(ownerPageSchema(guide.title, guide.description, `/insights/${slug}`, "Owner guides")) }} />
    <p className={styles.eyebrow}>{guide.pillar}</p><h1 className={styles.title}>{guide.title}</h1>
    <p className={styles.intro}>{guide.answer}</p>
    {guide.reviewStatus === "editorial-draft" ? <DraftStatus /> : <p className={styles.status}>Reviewed by {guide.reviewedBy} · {guide.reviewedAt}</p>}
    <DecisionDiagram steps={guide.decisionSteps} />
    <article className={styles.article}>
      {guide.sections.map((section) => <section className={styles.section} key={section.heading}>
        <h2>{section.heading}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        {section.bullets?.length ? <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul> : null}
      </section>)}
      <section className={styles.section}><h2>Before the next decision</h2><ul>{guide.checklist.map((item) => <li key={item}>{item}</li>)}</ul></section>
      <p className={styles.limits}>{guide.limitations}</p>
      {worksheets.length > 0 && <section className={styles.section}><h2>Working documents</h2><ul className={styles.related}>
        {worksheets.map((item) => <li key={item.id}><Link href={item.route}>{item.title}<ArrowRight size={16} aria-hidden="true" /></Link></li>)}
      </ul></section>}
      <section className={styles.section}><h2>Related owner decisions</h2><ul className={styles.related}>
        {related.map((item) => <li key={item.id}><Link href={`/insights/${item.slug}`}>{item.title}<ArrowRight size={16} aria-hidden="true" /></Link></li>)}
      </ul></section>
      <div className={styles.actions}><Link className={styles.button} href={guide.servicePath}>Explore the advisory service<ArrowRight size={16} aria-hidden="true" /></Link>
        <Link className={styles.textLink} href="/Contact">Discuss your hotel decision</Link></div>
    </article>
  </OwnerFrame>;
}
