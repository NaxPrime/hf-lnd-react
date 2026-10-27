import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { GoogleAuth } from "google-auth-library";

const here = path.dirname(fileURLToPath(import.meta.url));
const schema = JSON.parse(await readFile(path.join(here, "../src/Content/contact-sheet-schema.json"), "utf8"));
const sheetId = process.argv[2];
if (!/^[A-Za-z0-9_-]{20,}$/.test(sheetId || "")) {
  throw new Error("Usage: node scripts/setup-contact-sheet.mjs <HotelFirst spreadsheet ID>");
}
const credentialPath = process.env.HOTELFIRST_GOOGLE_CREDENTIAL_PATH ||
  path.resolve(here, "../../../local-private/credentials/google/crea.env");
const credentialText = await readFile(credentialPath, "utf8");
const begin = credentialText.indexOf("{");
const end = credentialText.lastIndexOf("}");
if (begin < 0 || end < begin) throw new Error("Service-account JSON missing from credential file");
const credentials = JSON.parse(credentialText.slice(begin, end + 1));
if (credentials.type !== "service_account" || !credentials.client_email || !credentials.private_key) {
  throw new Error("Invalid service-account credential");
}
const auth = new GoogleAuth({ credentials, scopes: ["https://www.googleapis.com/auth/spreadsheets"] });
const token = await auth.getAccessToken();
if (!token) throw new Error("Could not authorize Google Sheets");
const root = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}`;
async function api(endpoint, method = "GET", body) {
  const response = await fetch(root + endpoint, { method, headers: {
    Authorization: `Bearer ${token}`, ...(body ? { "Content-Type": "application/json" } : {}),
  }, body: body ? JSON.stringify(body) : undefined, signal: AbortSignal.timeout(12000) });
  if (!response.ok) {
    const detail = await response.json().catch(() => ({}));
    throw new Error(`Google Sheets ${method} failed: HTTP ${response.status}: ${String(detail.error?.message || "unknown error").slice(0, 400)}`);
  }
  return response.json();
}

const metadata = await api("?fields=properties(title,locale,timeZone),sheets(properties(sheetId,title,gridProperties),basicFilter,bandedRanges)");
if (metadata.sheets.length !== 1 || !["Sheet1", schema.tab].includes(metadata.sheets[0].properties.title)) {
  throw new Error("Expected one blank Sheet1/Enquiries tab; refusing to overwrite existing workbook structure");
}
const oldTab = metadata.sheets[0].properties.title;
const firstRow = await api(`/values/${encodeURIComponent(`${oldTab}!A1:U1`)}`);
const existingHeader = firstRow.values?.[0] || [];
if (existingHeader.length && JSON.stringify(existingHeader) !== JSON.stringify(schema.headers)) {
  throw new Error("Existing first row differs from HotelFirst schema; refusing to overwrite it");
}
const sheet = metadata.sheets[0].properties.sheetId;
const charcoal = { red: 0.12, green: 0.13, blue: 0.14 };
const orange = { red: 0.94, green: 0.31, blue: 0.13 };
const pale = { red: 0.99, green: 0.97, blue: 0.96 };
const white = { red: 1, green: 1, blue: 1 };
const requests = [
  { updateSpreadsheetProperties: { properties: { title: schema.title, locale: "en_GB", timeZone: "Asia/Kolkata" },
    fields: "title,locale,timeZone" } },
  { updateSheetProperties: { properties: { sheetId: sheet, title: schema.tab,
    gridProperties: { frozenRowCount: 1, frozenColumnCount: 3, hideGridlines: true } },
    fields: "title,gridProperties.frozenRowCount,gridProperties.frozenColumnCount,gridProperties.hideGridlines" } },
  { repeatCell: { range: { sheetId: sheet, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 21 },
    cell: { userEnteredFormat: { backgroundColor: charcoal, horizontalAlignment: "LEFT",
      verticalAlignment: "MIDDLE", textFormat: { foregroundColor: white, bold: true, fontSize: 10 } } },
    fields: "userEnteredFormat" } },
  { repeatCell: { range: { sheetId: sheet, startRowIndex: 1, startColumnIndex: 0, endColumnIndex: 21 },
    cell: { userEnteredFormat: { verticalAlignment: "TOP", textFormat: { fontSize: 10 } } },
    fields: "userEnteredFormat.verticalAlignment,userEnteredFormat.textFormat.fontSize" } },
  { repeatCell: { range: { sheetId: sheet, startRowIndex: 1, startColumnIndex: 7, endColumnIndex: 8 },
    cell: { userEnteredFormat: { backgroundColor: pale, textFormat: { foregroundColor: orange, bold: true } } },
    fields: "userEnteredFormat.backgroundColor,userEnteredFormat.textFormat" } },
  { updateDimensionProperties: { range: { sheetId: sheet, dimension: "ROWS", startIndex: 0, endIndex: 1 },
    properties: { pixelSize: 42 }, fields: "pixelSize" } },
  { updateDimensionProperties: { range: { sheetId: sheet, dimension: "COLUMNS", startIndex: 0, endIndex: 21 },
    properties: { pixelSize: 150 }, fields: "pixelSize" } },
  { updateDimensionProperties: { range: { sheetId: sheet, dimension: "COLUMNS", startIndex: 0, endIndex: 1 },
    properties: { pixelSize: 290 }, fields: "pixelSize" } },
  { updateDimensionProperties: { range: { sheetId: sheet, dimension: "COLUMNS", startIndex: 1, endIndex: 3 },
    properties: { pixelSize: 205 }, fields: "pixelSize" } },
  { updateDimensionProperties: { range: { sheetId: sheet, dimension: "COLUMNS", startIndex: 3, endIndex: 5 },
    properties: { pixelSize: 225 }, fields: "pixelSize" } },
  { updateDimensionProperties: { range: { sheetId: sheet, dimension: "COLUMNS", startIndex: 6, endIndex: 7 },
    properties: { pixelSize: 390 }, fields: "pixelSize" } },
  { updateDimensionProperties: { range: { sheetId: sheet, dimension: "COLUMNS", startIndex: 10, endIndex: 11 },
    properties: { pixelSize: 320 }, fields: "pixelSize" } },
  { setBasicFilter: { filter: { range: { sheetId: sheet, startRowIndex: 0, startColumnIndex: 0, endColumnIndex: 21 } } } },
  { setDataValidation: { range: { sheetId: sheet, startRowIndex: 1, startColumnIndex: 7, endColumnIndex: 8 },
    rule: { condition: { type: "ONE_OF_LIST", values: ["New", "Contacted", "Qualified", "Proposal", "Won", "Closed"].map((userEnteredValue) => ({ userEnteredValue })) },
      strict: true, showCustomUi: true } } },
];
if (!metadata.sheets[0].bandedRanges?.length) {
  requests.push({ addBanding: { bandedRange: { range: { sheetId: sheet, startRowIndex: 1, startColumnIndex: 0, endColumnIndex: 21 },
    rowProperties: { firstBandColor: white, secondBandColor: pale } } } });
}
await api(":batchUpdate", "POST", { requests });
if (!existingHeader.length) {
  await api(`/values/${encodeURIComponent(`${schema.tab}!A1:U1`)}?valueInputOption=RAW`, "PUT", { values: [schema.headers] });
}
const verified = await api(`/values/${encodeURIComponent(`${schema.tab}!A1:U2`)}`);
if (JSON.stringify(verified.values?.[0]) !== JSON.stringify(schema.headers) || verified.values?.[1]) {
  throw new Error("Post-format verification failed: header mismatch or unexpected data row");
}
console.log(`Configured ${schema.title} (${schema.tab}); ${schema.headers.length} columns; no lead rows.`);
