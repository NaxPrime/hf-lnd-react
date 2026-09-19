import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { loadChromium } from "./seo-browser.mjs";

const baseUrl = (process.env.SEO_BASE_URL || process.argv[2] || "http://127.0.0.1:3000").replace(/\/$/, "");
const canonicalOrigin = "https://www.hotelfirst.one";
const root = process.cwd();
const failures = [];
const passes = [];
const evidence = { baseUrl, checkedAt: new Date().toISOString(), checks: [], screenshots: [] };

function record(ok, message) {
  (ok ? passes : failures).push(message);
  evidence.checks.push({ ok, message });
}

function validateEditorialRecord(item, kind) {
  record(["editorial-draft", "approved"].includes(item.reviewStatus), kind + " " + item.id + " has a valid review status");
  if (item.reviewStatus === "approved") {
    record(Boolean(item.reviewedBy), kind + " " + item.id + " names its reviewer");
    record(/^\d{4}-\d{2}-\d{2}$/.test(item.reviewedAt || ""), kind + " " + item.id + " has a review date");
  }
}

const guideDirectory = path.join(root, "src", "Content", "insights");
const guides = readdirSync(guideDirectory)
  .filter((file) => file.endsWith(".json"))
  .map((file) => JSON.parse(readFileSync(path.join(guideDirectory, file), "utf8")))
  .sort((a, b) => a.id.localeCompare(b.id));
const resources = JSON.parse(readFileSync(path.join(root, "src", "Content", "owner-resources.json"), "utf8"));
const directFormSources = ["src/components/Home/CTA.tsx", "src/components/Services/CTA.tsx"]
  .map((file) => readFileSync(path.join(root, file), "utf8")).join("\n");
record(!directFormSources.includes("formspree.io"), "Browser CTA forms do not bypass the validated enquiry endpoint");
const servicePaths = new Set([
  "/services/BrandSelection",
  "/services/BusinessIntelligence",
  "/services/AssetManagement",
  "/services/MysteryAudit",
  "/services/AdhocConsultation",
]);
function canonicalServicePath(value) {
  try {
    const url = new URL(value, canonicalOrigin);
    return url.origin === canonicalOrigin && servicePaths.has(url.pathname) ? url.pathname : undefined;
  } catch {
    return undefined;
  }
}

record(guides.length === 40, "Exactly 40 owner guides exist (found " + guides.length + ")");
record(new Set(guides.map((item) => item.id)).size === guides.length, "Owner guide IDs are unique");
record(new Set(guides.map((item) => item.slug)).size === guides.length, "Owner guide slugs are unique");
record(new Set(guides.map((item) => item.title)).size === guides.length, "Owner guide titles are unique");
const guideIds = new Set(guides.map((item) => item.id));
for (const guide of guides) {
  record(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(guide.slug), "Guide " + guide.id + " has a valid slug");
  record(Boolean(guide.title && guide.description && guide.pillar && guide.audience && guide.answer), "Guide " + guide.id + " has complete editorial fields");
  record(Boolean(canonicalServicePath(guide.servicePath)), "Guide " + guide.id + " uses a canonical service path");
  record(Array.isArray(guide.sections) && guide.sections.length >= 3 && guide.sections.length <= 5, "Guide " + guide.id + " has 3-5 useful sections");
  record(Array.isArray(guide.decisionSteps) && guide.decisionSteps.length >= 3 && guide.decisionSteps.length <= 5, "Guide " + guide.id + " has 3-5 decision steps");
  record(Array.isArray(guide.checklist) && guide.checklist.length >= 3, "Guide " + guide.id + " has an actionable checklist");
  record(Boolean(guide.limitations), "Guide " + guide.id + " states its limitations");
  record(Array.isArray(guide.relatedIds) && guide.relatedIds.length >= 2 && guide.relatedIds.length <= 4, "Guide " + guide.id + " has 2-4 related decisions");
  record(guide.relatedIds.every((id) => guideIds.has(id) && id !== guide.id), "Guide " + guide.id + " has valid related IDs");
  validateEditorialRecord(guide, "Guide");
}

record(resources.length === 6, "Six owner worksheets exist");
record(new Set(resources.map((item) => item.slug)).size === resources.length, "Worksheet slugs are unique");
for (const resource of resources) {
  record(resource.route === "/resources/" + resource.slug, "Worksheet " + resource.id + " route matches its slug");
  record(Boolean(canonicalServicePath(resource.service)), "Worksheet " + resource.id + " uses a canonical service path");
  record(resource.sections.length >= 3 && resource.columns.length >= 2 && resource.rows.length >= 5, "Worksheet " + resource.id + " contains a decision method and working register");
  record(resource.rows.every((row) => row.length === resource.columns.length), "Worksheet " + resource.id + " table is rectangular");
  validateEditorialRecord(resource, "Worksheet");
}

const authoredPages = [
  ["/", "HotelFirst | Hotel Owner Advisory & Asset Strategy"],
  ["/Aboutus", "About HotelFirst Advisory"],
  ["/Contact", "Contact HotelFirst | Request a Consultation"],
  ["/services/BrandSelection", "Hotel Brand Selection & HMA Advisory | HotelFirst"],
  ["/services/BusinessIntelligence", "Hotel Feasibility & Market Studies | HotelFirst"],
  ["/services/AssetManagement", "Hotel Asset Management & Owner Advisory | HotelFirst"],
  ["/services/MysteryAudit", "Hotel Mystery Audits & Quality Assurance | HotelFirst"],
  ["/services/AdhocConsultation", "Hotel Performance Optimization & Turnarounds | HotelFirst"],
  ["/privacy-policy", "Privacy Policy | HotelFirst"],
  ["/terms-and-conditions", "Terms and Conditions | HotelFirst"],
];
const legacyServices = [
  "revenue-management", "ota-optimization", "hotel-marketing", "hotel-consulting", "hotel-profitability",
  "revenue-management-for-resorts", "revenue-management-for-business-hotels",
  "revenue-management-for-boutique-hotels", "revenue-management-for-3-star-hotels",
  "revenue-management-for-4-star-hotels", "revenue-management-for-5-star-hotels",
];
const legacyLocations = ["hyderabad", "bangalore", "goa", "chennai", "mumbai"];
const legacySlugs = legacyServices.flatMap((service) => [service, ...legacyLocations.map((location) => service + "-" + location)]);
function expectedLegacyDestination(slug) {
  const service = legacyServices.find((candidate) => slug === candidate || legacyLocations.some((location) => slug === candidate + "-" + location));
  if (service === "hotel-consulting") return "/";
  if (["ota-optimization", "hotel-marketing"].includes(service)) return "/services/AdhocConsultation";
  return "/services/AssetManagement";
}

const chromium = loadChromium();
const browser = await chromium.launch({ headless: true });
const origin = new URL(baseUrl).origin;
const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 1000 } });
await context.route("**/*", (route) => {
  const requestUrl = new URL(route.request().url());
  return requestUrl.origin === origin ? route.continue() : route.abort();
});
const page = await context.newPage();
const internalLinks = new Set();
const internalAssets = new Set();

async function inspectPage(route) {
  const response = await page.goto(baseUrl + route, { waitUntil: "domcontentloaded" });
  const result = await page.evaluate(() => ({
    title: document.title,
    description: document.querySelector('meta[name="description"]')?.getAttribute("content") || "",
    canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href") || "",
    robots: document.querySelector('meta[name="robots"]')?.getAttribute("content") || "",
    keywords: document.querySelector('meta[name="keywords"]')?.getAttribute("content") || "",
    h1: Array.from(document.querySelectorAll("h1")).map((node) => node.textContent?.trim() || ""),
    h2Count: document.querySelectorAll("h2").length,
    decisionSteps: document.querySelectorAll("figure ol > li").length,
    text: document.body.innerText,
    hrefs: Array.from(document.querySelectorAll("a[href]")).map((node) => node.getAttribute("href") || ""),
    assets: [
      ...Array.from(document.querySelectorAll("img[src]")).map((node) => node.getAttribute("src") || ""),
      ...Array.from(document.querySelectorAll("source[srcset]")).flatMap((node) => (node.getAttribute("srcset") || "").split(",").map((value) => value.trim().split(/\s+/)[0])),
      ...Array.from(document.querySelectorAll("body *")).flatMap((node) => [...getComputedStyle(node).backgroundImage.matchAll(/url\(["']?([^"')]+)["']?\)/g)].map((match) => match[1])),
    ],
    jsonLd: Array.from(document.querySelectorAll('script[type="application/ld+json"]')).map((node) => node.textContent || ""),
    horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
  }));
  for (const href of result.hrefs) {
    if (href.startsWith("/") && !href.startsWith("//")) internalLinks.add(href);
  }
  for (const asset of result.assets) {
    if (asset.startsWith("/") && !asset.startsWith("//")) internalAssets.add(asset);
  }
  return { status: response?.status() || 0, ...result };
}

for (const [route, title] of authoredPages) {
  const result = await inspectPage(route);
  record(result.status === 200, route + " returns HTTP 200");
  record(result.title === title, route + " has the expected unique title");
  record(result.description.length >= 50, route + " has a useful description");
  record(result.canonical === canonicalOrigin + route || (route === "/" && result.canonical === canonicalOrigin), route + " has the production canonical");
  record(!/noindex/i.test(result.robots), route + " remains indexable");
  record(!result.keywords, route + " does not rely on obsolete meta-keywords");
  record(result.h1.length === 1, route + " has exactly one H1");
}

const home = await inspectPage("/");
const homeSchemas = home.jsonLd.flatMap((value) => {
  try { return [JSON.parse(value)]; } catch { return []; }
});
const homeSchemaText = JSON.stringify(homeSchemas);
record(homeSchemaText.includes('"@type":"Organization"'), "Homepage exposes Organization structured data");
record(homeSchemaText.includes('"@type":"WebSite"'), "Homepage exposes WebSite structured data");
record(homeSchemaText.includes("https://www.linkedin.com/company/hotelfirst"), "Organization schema uses the approved LinkedIn identity");

const guidesHub = await inspectPage("/insights");
record(guidesHub.status === 200, "Draft-preview owner guide hub returns HTTP 200");
record(/noindex/i.test(guidesHub.robots), "Draft-preview owner guide hub is noindex");
record(guidesHub.text.includes("Editorial draft"), "Owner guide hub visibly identifies draft status");
record(guides.every((guide) => guidesHub.hrefs.includes("/insights/" + guide.slug)), "Owner guide hub links to all 40 preview guides");

const resourcesHub = await inspectPage("/resources");
record(resourcesHub.status === 200, "Draft-preview worksheet hub returns HTTP 200");
record(/noindex/i.test(resourcesHub.robots), "Draft-preview worksheet hub is noindex");
record(resourcesHub.text.includes("Editorial draft"), "Worksheet hub visibly identifies draft status");
record(resources.every((resource) => resourcesHub.hrefs.includes(resource.route)), "Worksheet hub links to all six preview worksheets");

for (const guide of guides) {
  const route = "/insights/" + guide.slug;
  const result = await inspectPage(route);
  record(result.status === 200, route + " returns HTTP 200 in editorial preview");
  record(result.canonical === canonicalOrigin + route, route + " has the production canonical");
  record(/noindex/i.test(result.robots), route + " is noindex before release");
  record(result.h1.length === 1 && result.h1[0] === guide.title, route + " has the intended H1");
  record(result.text.includes(guide.answer), route + " renders the direct answer as visible text");
  record(result.h2Count >= guide.sections.length + 2, route + " renders the substantive sections");
  record(result.decisionSteps === guide.decisionSteps.length, route + " renders the decision diagram");
  record(result.hrefs.includes(canonicalServicePath(guide.servicePath)), route + " links to its canonical advisory service");
  record(guide.relatedIds.every((id) => result.hrefs.includes("/insights/" + guides.find((item) => item.id === id).slug)), route + " links its related owner decisions");
}

for (const resource of resources) {
  const result = await inspectPage(resource.route);
  record(result.status === 200, resource.route + " returns HTTP 200 in editorial preview");
  record(result.canonical === canonicalOrigin + resource.route, resource.route + " has the production canonical");
  record(/noindex/i.test(result.robots), resource.route + " is noindex before release");
  record(result.h1.length === 1 && result.h1[0] === resource.title, resource.route + " has the intended H1");
  record(result.text.includes(resource.answer), resource.route + " renders its direct answer");
  record(result.decisionSteps === resource.sections.length, resource.route + " renders its decision sequence");
  record(result.hrefs.includes(resource.route + "/worksheet.csv"), resource.route + " links its worksheet download");
  record(result.hrefs.includes(resource.service), resource.route + " links to its canonical advisory service");
  const download = await fetch(baseUrl + resource.route + "/worksheet.csv", { redirect: "manual" });
  const csv = await download.text();
  record(download.status === 200, resource.route + " worksheet returns HTTP 200");
  record((download.headers.get("content-type") || "").startsWith("text/csv"), resource.route + " worksheet uses a CSV content type");
  record(/attachment/i.test(download.headers.get("content-disposition") || ""), resource.route + " worksheet is an attachment");
  record(/noindex/i.test(download.headers.get("x-robots-tag") || ""), resource.route + " worksheet is excluded from indexing");
  record(csv.split(/\r?\n/).filter(Boolean).length === resource.rows.length + 1, resource.route + " worksheet has the expected rows");
}

for (const slug of legacySlugs) {
  const response = await fetch(baseUrl + "/" + slug, { redirect: "manual" });
  record([301, 308].includes(response.status), "Legacy route /" + slug + " permanently redirects");
  record(response.headers.get("location") === expectedLegacyDestination(slug), "Legacy route /" + slug + " consolidates to its canonical service");
}
for (const topic of legacyServices) {
  const response = await fetch(baseUrl + "/faqs/" + topic, { redirect: "manual" });
  record([301, 308].includes(response.status), "Legacy FAQ /faqs/" + topic + " permanently redirects");
  record(response.headers.get("location") === expectedLegacyDestination(topic), "Legacy FAQ /faqs/" + topic + " consolidates to its canonical service");
}

for (const route of [
  "/seo-route-that-does-not-exist",
  "/faqs/not-a-real-topic",
  "/insights/not-a-real-guide",
  "/resources/not-a-real-resource",
  "/resources/not-a-real-resource/worksheet.csv",
]) {
  const response = await fetch(baseUrl + route, { redirect: "manual" });
  record(response.status === 404, route + " returns a real HTTP 404");
}

const robotsResponse = await fetch(baseUrl + "/robots.txt");
const robots = await robotsResponse.text();
record(robotsResponse.status === 200, "robots.txt returns HTTP 200");
record(/Disallow:\s*\/api\//i.test(robots), "robots.txt excludes API routes");
record(/Sitemap:\s*https:\/\/www\.hotelfirst\.one\/sitemap\.xml/i.test(robots), "robots.txt declares the production sitemap");

const sitemapResponse = await fetch(baseUrl + "/sitemap.xml");
const sitemap = await sitemapResponse.text();
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]).sort();
const approvedGuides = guides.filter((item) => item.reviewStatus === "approved");
const approvedResources = resources.filter((item) => item.reviewStatus === "approved");
const expectedSitemap = [
  ...authoredPages.map(([route]) => canonicalOrigin + route),
  ...(approvedGuides.length ? [canonicalOrigin + "/insights"] : []),
  ...approvedGuides.map((item) => canonicalOrigin + "/insights/" + item.slug),
  ...(approvedResources.length ? [canonicalOrigin + "/resources"] : []),
  ...approvedResources.map((item) => canonicalOrigin + item.route),
].sort();
record(sitemapResponse.status === 200, "sitemap.xml returns HTTP 200");
record(JSON.stringify(sitemapUrls) === JSON.stringify(expectedSitemap), "Sitemap contains only approved canonical pages");

const apiResponse = await fetch(baseUrl + "/api/meta/lead", { method: "GET", redirect: "manual" });
record(/noindex/i.test(apiResponse.headers.get("x-robots-tag") || ""), "API responses carry X-Robots-Tag");
record(!sitemap.includes("/faqs/") && legacySlugs.every((slug) => !sitemap.includes("<loc>" + canonicalOrigin + "/" + slug + "</loc>")), "Sitemap excludes legacy and FAQ routes");

const linkResults = [];
for (const href of internalLinks) {
  const response = await fetch(baseUrl + href, { redirect: "manual" });
  linkResults.push([href, response.status]);
}
const brokenLinks = linkResults.filter(([, status]) => status >= 400);
record(brokenLinks.length === 0, "Owner-library internal links are reachable" + (brokenLinks.length ? ": " + JSON.stringify(brokenLinks) : ""));
const assetResults = [];
for (const asset of internalAssets) {
  const response = await fetch(baseUrl + asset, { redirect: "follow" });
  assetResults.push([asset, response.status]);
}
const brokenAssets = assetResults.filter(([, status]) => status >= 400);
record(brokenAssets.length === 0, "Rendered same-origin images are reachable" + (brokenAssets.length ? ": " + JSON.stringify(brokenAssets) : ""));

await context.close();
const visualContext = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
await visualContext.route("**/*", (route) => {
  const requestUrl = new URL(route.request().url());
  return requestUrl.origin === origin ? route.continue() : route.abort();
});
const visualPage = await visualContext.newPage();
const artifactDirectory = path.join(root, "artifacts", "seo-acceptance");
mkdirSync(artifactDirectory, { recursive: true });
await visualPage.goto(baseUrl + "/insights", { waitUntil: "networkidle" });
await visualPage.locator('input[type="search"]').fill("brand");
const filteredText = await visualPage.locator('[role="status"]').textContent();
record(Boolean(filteredText && !filteredText.startsWith("40 of")), "Owner-library search filters the 40-guide list");
await visualPage.locator('input[type="search"]').fill("");
const desktopShot = path.join(artifactDirectory, "insights-desktop.png");
await visualPage.screenshot({ path: desktopShot, fullPage: true });
evidence.screenshots.push(desktopShot);
await visualPage.goto(baseUrl + "/", { waitUntil: "networkidle" });
record(await visualPage.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1), "Homepage has no desktop horizontal overflow after styles and hydration");
const homepageShot = path.join(artifactDirectory, "homepage-desktop.png");
await visualPage.screenshot({ path: homepageShot, fullPage: true });
evidence.screenshots.push(homepageShot);
await visualContext.close();

const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
await mobileContext.route("**/*", (route) => {
  const requestUrl = new URL(route.request().url());
  return requestUrl.origin === origin ? route.continue() : route.abort();
});
const mobilePage = await mobileContext.newPage();
await mobilePage.goto(baseUrl + "/insights/" + guides[0].slug, { waitUntil: "networkidle" });
record(await mobilePage.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1), "Representative mobile guide has no horizontal overflow");
const mobileShot = path.join(artifactDirectory, "guide-mobile.png");
await mobilePage.screenshot({ path: mobileShot, fullPage: true });
evidence.screenshots.push(mobileShot);
await mobilePage.goto(baseUrl + "/", { waitUntil: "networkidle" });
record(await mobilePage.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1), "Homepage has no mobile horizontal overflow");
const homepageMobileShot = path.join(artifactDirectory, "homepage-mobile.png");
await mobilePage.screenshot({ path: homepageMobileShot, fullPage: true });
evidence.screenshots.push(homepageMobileShot);
await mobileContext.close();
await browser.close();

evidence.summary = { passed: passes.length, failed: failures.length };
writeFileSync(path.join(artifactDirectory, "report.json"), JSON.stringify(evidence, null, 2) + "\n");
console.log("SEO acceptance for " + baseUrl + ": " + passes.length + " passed, " + failures.length + " failed.");
for (const message of failures) console.error("FAIL: " + message);
if (failures.length) process.exit(1);
