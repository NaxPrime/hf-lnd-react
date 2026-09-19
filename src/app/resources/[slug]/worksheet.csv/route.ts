import { getVisibleResources } from "@/lib/owner-content";

export const dynamic = "force-static";
export const dynamicParams = false;
export function generateStaticParams() { return getVisibleResources().map(({ slug }) => ({ slug })); }

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const resource = getVisibleResources().find((item) => item.slug === slug);
  if (!resource) return new Response("Not found", { status: 404 });
  const rows = [
    [...resource.columns, "Owner notes", "Evidence / document", "Action owner", "Review date", "Status"],
    ...resource.rows.map((row) => [...row, "", "", "", "", "Open"]),
  ];
  const csv = rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")).join("\r\n");
  return new Response("\uFEFF" + csv + "\r\n", { headers: {
    "Content-Type": "text/csv; charset=utf-8",
    "Content-Disposition": `attachment; filename="${slug}.csv"`,
    "X-Robots-Tag": "noindex, nofollow",
    "X-Content-Type-Options": "nosniff",
  } });
}
