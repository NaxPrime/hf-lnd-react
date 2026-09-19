import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const SITE_URL = "https://www.hotelfirst.one";
const INDEXNOW_KEY = process.env.INDEXNOW_KEY || "7d6b3e7f4a214a67bdb92c0a2f16e3b8";
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

const authoredPaths = [
  "/",
  "/Aboutus",
  "/Contact",
  "/services/BrandSelection",
  "/services/BusinessIntelligence",
  "/services/AssetManagement",
  "/services/MysteryAudit",
  "/services/AdhocConsultation",
  "/privacy-policy",
  "/terms-and-conditions",
];
const approved = (item) => item.reviewStatus === "approved" && item.reviewedBy && /^\d{4}-\d{2}-\d{2}$/.test(item.reviewedAt || "");
const guideDirectory = path.join(process.cwd(), "src", "Content", "insights");
const guides = readdirSync(guideDirectory).filter((file) => file.endsWith(".json"))
  .map((file) => JSON.parse(readFileSync(path.join(guideDirectory, file), "utf8"))).filter(approved);
const resources = JSON.parse(readFileSync(path.join(process.cwd(), "src", "Content", "owner-resources.json"), "utf8")).filter(approved);
const canonicalUrls = [...new Set([
  ...authoredPaths,
  ...(guides.length ? ["/insights"] : []),
  ...guides.map((guide) => "/insights/" + guide.slug),
  ...(resources.length ? ["/resources"] : []),
  ...resources.map((resource) => resource.route),
].map((route) => SITE_URL + route))];

const payload = {
  host: new URL(SITE_URL).host,
  key: INDEXNOW_KEY,
  keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
  urlList: canonicalUrls,
};

if (!process.argv.includes("--send")) {
  console.log("Dry run only. Deploy first, then add --send to notify IndexNow.");
  console.log(JSON.stringify(payload, null, 2));
  process.exit(0);
}

const keyResponse = await fetch(payload.keyLocation, { redirect: "follow" });
if (!keyResponse.ok || (await keyResponse.text()).trim() !== INDEXNOW_KEY) {
  throw new Error(
    `IndexNow key verification failed at ${payload.keyLocation}. Deploy the key file before submitting.`,
  );
}

const sitemapResponse = await fetch(SITE_URL + "/sitemap.xml", { redirect: "follow" });
const sitemap = await sitemapResponse.text();
if (!sitemapResponse.ok || canonicalUrls.some((url) => !sitemap.includes(`<loc>${url}</loc>`))) {
  throw new Error("The live sitemap does not yet contain every approved local URL. Deploy and verify before submitting.");
}

const response = await fetch(INDEXNOW_ENDPOINT, {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify(payload),
});

if (!response.ok) {
  throw new Error(`IndexNow returned HTTP ${response.status}: ${await response.text()}`);
}

console.log(`IndexNow accepted ${canonicalUrls.length} canonical URLs (HTTP ${response.status}).`);
