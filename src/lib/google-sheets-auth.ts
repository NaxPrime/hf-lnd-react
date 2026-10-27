import { GoogleAuth } from "google-auth-library";

let cached: { encoded: string; auth: GoogleAuth } | undefined;

export async function getGoogleAccessToken(env: Record<string, string | undefined>): Promise<string> {
  const encoded = env.GOOGLE_SERVICE_ACCOUNT_JSON_BASE64;
  if (!encoded) throw new Error("sheets_credentials_missing");
  if (!cached || cached.encoded !== encoded) {
    const credentials = JSON.parse(Buffer.from(encoded, "base64").toString("utf8"));
    if (credentials.type !== "service_account" || !credentials.client_email || !credentials.private_key) {
      throw new Error("sheets_credentials_invalid");
    }
    cached = { encoded, auth: new GoogleAuth({ credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"] }) };
  }
  const token = await cached.auth.getAccessToken();
  if (!token) throw new Error("sheets_token_unavailable");
  return token;
}
