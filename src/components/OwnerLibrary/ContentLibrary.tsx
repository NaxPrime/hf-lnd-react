"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";
import styles from "./OwnerLibrary.module.css";

export type LibraryEntry = { id: string; title: string; description: string; group: string; href: string };

export default function ContentLibrary({ entries }: { entries: LibraryEntry[] }) {
  const [search, setSearch] = useState("");
  const [group, setGroup] = useState("");
  const groups = [...new Set(entries.map((entry) => entry.group))];
  const query = search.trim().toLocaleLowerCase("en-IN");
  const shown = entries.filter((entry) => (!group || entry.group === group) &&
    `${entry.title} ${entry.description} ${entry.group}`.toLocaleLowerCase("en-IN").includes(query));
  return <>
    <div className={styles.toolbar}>
      <label>Search the library<span className={styles.search}><Search size={18} aria-hidden="true" />
        <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} />
      </span></label>
      <label>Service focus<select value={group} onChange={(event) => setGroup(event.target.value)}>
        <option value="">All services</option>{groups.map((value) => <option key={value}>{value}</option>)}
      </select></label>
    </div>
    <p className={styles.count} role="status">{shown.length} of {entries.length} resources</p>
    {shown.length ? <ul className={styles.list}>{shown.map((entry) => <li className={styles.item} key={entry.id}>
      <small>{entry.group}</small><div><h2><Link href={entry.href}>{entry.title}</Link></h2><p>{entry.description}</p></div>
      <ArrowUpRight size={20} aria-hidden="true" />
    </li>)}</ul> : <p className={styles.intro}>No matching resources.</p>}
  </>;
}
