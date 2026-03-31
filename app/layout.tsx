import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "@/components/providers";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-mono",
  weight: "100 900",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Euro Reel - Watch the Best Facebook Reels",
  description:
    "Discover and watch trending Facebook Reels curated by category. Entertainment, sports, comedy, and more - all in one place.",
  keywords: ["facebook reels", "euro reel", "video", "entertainment"],
  openGraph: {
    title: "Euro Reel - Watch the Best Facebook Reels",
    description: "Discover trending Facebook Reels curated by category.",
    type: "website",
  },
};

import { BottomNav } from "@/components/bottom-nav";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans pb-16 md:pb-0`}>
        <Providers>
          {children}
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
