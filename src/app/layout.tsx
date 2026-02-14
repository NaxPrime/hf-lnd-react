import type { Metadata } from "next";
import { Lora } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar/navbar";
import Footer from "@/components/Footer/footer";
import "@fontsource/montaga";
import GlobalLoader from "@/components/GlobalLoader";

const lora = Lora({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Hotel First",
  description: "HotelFirst Services",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className={`${lora.variable} antialiased`}>
        <GlobalLoader /> <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
