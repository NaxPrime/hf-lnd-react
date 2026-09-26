import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const baseUrl = (process.env.SEO_BASE_URL || process.argv[2] || "http://127.0.0.1:3000").replace(/\/$/, "");
const canonicalOrigin = "https://www.hotelfirst.one";
const guides = readdirSync(path.join(process.cwd(), "src", "Content", "insights"))
  .filter((file) => file.endsWith(".json"))
  .map((file) => JSON.parse(readFileSync(path.join(process.cwd(), "src", "Content", "insights", file), "utf8")));
const resources = JSON.parse(readFileSync(path.join(process.cwd(), "src", "Content", "owner-resources.json"), "utf8"));
const approved = (item) => item.reviewStatus === "approved" && item.reviewedBy && /^\d{4}-\d{2}-\d{2}$/.test(item.reviewedAt || "");
const approvedGuides = guides.filter(approved);
const approvedResources = resources.filter(approved);
const authoredPaths = [
  "/", "/Aboutus", "/Contact", "/services/BrandSelection", "/services/BusinessIntelligence",
  "/services/AssetManagement", "/services/MysteryAudit", "/services/AdhocConsultation",
  "/privacy-policy", "/data-deletion", "/terms-and-conditions",
];
const failures = [];
let passed = 0;
function check(value, message) { if (value) passed++; else failures.push(message); }

for (const route of authoredPaths) {
  const response = await fetch(baseUrl + route, { redirect: "manual" });
  check(response.status === 200, route + " should remain public (got " + response.status + ")");
}

const draftRoutes = [
  ...(approvedGuides.length ? [] : ["/insights"]),
  ...guides.filter((item) => !approved(item)).map((item) => "/insights/" + item.slug),
  ...(approvedResources.length ? [] : ["/resources"]),
  ...resources.filter((item) => !approved(item)).flatMap((item) => [item.route, item.route + "/worksheet.csv"]),
];
for (const route of draftRoutes) {
  const response = await fetch(baseUrl + route, { redirect: "manual" });
  check(response.status === 404, route + " should fail closed before approval (got " + response.status + ")");
}

const sitemapResponse = await fetch(baseUrl + "/sitemap.xml");
const sitemap = await sitemapResponse.text();
const actual = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]).sort();
const expected = [
  ...authoredPaths.map((route) => canonicalOrigin + route),
  ...(approvedGuides.length ? [canonicalOrigin + "/insights"] : []),
  ...approvedGuides.map((item) => canonicalOrigin + "/insights/" + item.slug),
  ...(approvedResources.length ? [canonicalOrigin + "/resources"] : []),
  ...approvedResources.map((item) => canonicalOrigin + item.route),
].sort();
check(JSON.stringify(actual) === JSON.stringify(expected), "Production sitemap does not exactly match approved canonical URLs");

for (const route of ["/revenue-management", "/faqs/revenue-management"]) {
  const response = await fetch(baseUrl + route, { redirect: "manual" });
  check([301, 308].includes(response.status), route + " should permanently redirect");
}

console.log("Release-gate acceptance for " + baseUrl + ": " + passed + " passed, " + failures.length + " failed.");
for (const message of failures) console.error("FAIL: " + message);
if (failures.length) process.exit(1);
