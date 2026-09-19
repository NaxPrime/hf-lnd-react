import type { Metadata } from "next";
import { Lora } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar/navbar";
import Footer from "@/components/Footer/footer";
import "@fontsource/montaga";
import GlobalLoader from "@/components/GlobalLoader";
import AnalyticsProvider from "@/components/Analytics/AnalyticsProvider";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import { organizationGraph, pageMetadata, serializeJsonLd } from "@/lib/search";

const lora = Lora({ 
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const googleSiteVerification = process.env.GOOGLE_SITE_VERIFICATION;
const bingSiteVerification = process.env.BING_SITE_VERIFICATION;
const siteVerification: Metadata["verification"] =
  googleSiteVerification || bingSiteVerification
    ? {
        ...(googleSiteVerification ? { google: googleSiteVerification } : {}),
        ...(bingSiteVerification
          ? { other: { "msvalidate.01": bingSiteVerification } }
          : {}),
      }
    : undefined;

export const metadata: Metadata = {
  ...pageMetadata("/"),
  metadataBase: new URL("https://www.hotelfirst.one"),
  ...(siteVerification ? { verification: siteVerification } : {}),
  robots: {
    index: process.env.VERCEL_ENV !== "preview",
    follow: true,
    googleBot: { index: process.env.VERCEL_ENV !== "preview", follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const trackingConfig = {
    isProduction: process.env.VERCEL === "1" && process.env.VERCEL_ENV === "production",
    analyticsEnabled: process.env.ANALYTICS_ENABLED === "true",
    gaMeasurementId: process.env.GA_MEASUREMENT_ID || "",
    metaEnabled: process.env.META_CAPI_ENABLED === "true" && process.env.META_BROWSER_ENABLED === "true",
    metaPixelId: process.env.META_PIXEL_ID || "",
  };

  return (
    <html lang="en-IN">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeJsonLd(organizationGraph)
          }}
        />
      </head>
      <body className={`${lora.variable} antialiased`}>
        <Suspense fallback={null}>
          <AnalyticsProvider config={trackingConfig} />
        </Suspense>
        <GlobalLoader /> <Navbar />
        {children}
        <Footer />
        {trackingConfig.isProduction ? <Analytics /> : null}
      </body>
    </html>
  );
}
