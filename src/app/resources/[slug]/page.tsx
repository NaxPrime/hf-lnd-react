import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Download } from "lucide-react";
import { getVisibleInsights, getVisibleResources, isApproved, ownerMetadata, ownerPageSchema } from "@/lib/owner-content";
import { serializeJsonLd } from "@/lib/search";
import { OwnerFrame, DecisionDiagram, DraftStatus } from "@/components/OwnerLibrary/OwnerFrame";
import styles from "@/components/OwnerLibrary/OwnerLibrary.module.css";

export const dynamicParams = false;
export function generateStaticParams() { return getVisibleResources().map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const resource = getVisibleResources().find((item) => item.slug === slug);
  if (!resource) notFound();
  return ownerMetadata(resource.title, resource.answer, resource.route, isApproved(resource));
}

export default async function ResourcePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const resource = getVisibleResources().find((item) => item.slug === slug);
  if (!resource) notFound();
  const guides = getVisibleInsights().filter((item) => item.servicePath === resource.service).slice(0, 4);
  return <OwnerFrame>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(ownerPageSchema(resource.title, resource.answer, resource.route, "Decision worksheets")) }} />
    <p className={styles.eyebrow}>Owner working document</p><h1 className={styles.title}>{resource.title}</h1>
    <p className={styles.intro}>{resource.answer}</p>{resource.reviewStatus === "editorial-draft" ? <DraftStatus /> : <p className={styles.status}>Reviewed by {resource.reviewedBy} · {resource.reviewedAt}</p>}
    <div className={styles.actions}><a className={styles.button} href={`${resource.route}/worksheet.csv`} download><Download size={18} aria-hidden="true" />Download worksheet</a></div>
    <DecisionDiagram steps={resource.sections.map(([title, detail]) => ({ title, detail: detail.split(". ")[0] + "." }))} />
    <article className={styles.article}>
      {resource.sections.map(([heading, paragraph]) => <section className={styles.section} key={heading}><h2>{heading}</h2><p>{paragraph}</p></section>)}
    </article>
    <section className={styles.section}><h2>The working register</h2><div className={styles.tableWrap} tabIndex={0} role="region" aria-label="Worksheet reference table">
      <table className={styles.table}><thead><tr>{resource.columns.map((column) => <th key={column} scope="col">{column}</th>)}</tr></thead>
        <tbody>{resource.rows.map((row) => <tr key={row[0]}>{row.map((cell, index) => <td key={index}>{cell}</td>)}</tr>)}</tbody>
      </table>
    </div></section><p className={styles.limits}>{resource.review}</p>
    <section className={styles.section}><h2>Related owner guides</h2><ul className={styles.related}>{guides.map((guide) => <li key={guide.id}>
      <Link href={`/insights/${guide.slug}`}>{guide.title}<ArrowRight size={16} aria-hidden="true" /></Link>
    </li>)}</ul></section>
    <div className={styles.actions}><Link className={styles.button} href={resource.service}>Explore the advisory service<ArrowRight size={16} aria-hidden="true" /></Link><Link className={styles.textLink} href="/Contact">Discuss your hotel decision</Link></div>
  </OwnerFrame>;
}
