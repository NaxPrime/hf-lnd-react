import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import type { DecisionStep } from "@/lib/owner-content";
import styles from "./OwnerLibrary.module.css";

export function OwnerFrame({ children }: { children: ReactNode }) {
  return <main className={styles.shell}>
    <nav className={styles.navigation} aria-label="Owner library">
      <Link href="/">HotelFirst Advisory</Link><Link href="/insights">Owner guides</Link>
      <Link href="/resources">Decision worksheets</Link><Link href="/Contact">Request consultation</Link>
    </nav>{children}
  </main>;
}

export function DecisionDiagram({ steps }: { steps: DecisionStep[] }) {
  return <figure className={styles.diagram} aria-label="Owner decision sequence">
    <figcaption>Decision sequence</figcaption>
    <ol className={styles.steps} style={{ "--steps": steps.length } as CSSProperties}>
      {steps.map((step, index) => <li key={step.title}>
        <div className={styles.stepNumber}>{String(index + 1).padStart(2, "0")}<span />
          {index < steps.length - 1 && <ArrowRight size={16} aria-hidden="true" />}
        </div><h3>{step.title}</h3><p>{step.detail}</p>
      </li>)}
    </ol>
  </figure>;
}

export function DraftStatus() {
  return <p className={styles.status}>Editorial draft · Subject-matter review pending</p>;
}
