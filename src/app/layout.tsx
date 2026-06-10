import type { Metadata } from "next";
import { Lora } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar/navbar";
import Footer from "@/components/Footer/footer";
import "@fontsource/montaga";
import GlobalLoader from "@/components/GlobalLoader";
import AnalyticsProvider from "@/components/Analytics/AnalyticsProvider";
import { Suspense } from "react";

const lora = Lora({ 
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.hotelfirst.one"),
  title: {
    template: "%s | HotelFirst",
    default: "HotelFirst | Hotel Revenue Management & Hospitality Solutions",
  },
  description: "HotelFirst helps hotels increase revenue, occupancy and profitability through revenue management, OTA optimization and hospitality consulting.",
  alternates: {
    canonical: "./",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-4TXDJ8D50N"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-4TXDJ8D50N');
            `
          }}
        />
        
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "HotelFirst",
              "url": "https://www.hotelfirst.one"
            })
          }}
        />
      </head>
      <body className={`${lora.variable} antialiased`}>
        <Suspense fallback={null}>
          <AnalyticsProvider />
        </Suspense>
        <GlobalLoader /> <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
