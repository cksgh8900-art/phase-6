import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";

import Navbar from "@/components/Navbar";
import { SyncUserProvider } from "@/components/providers/sync-user-provider";
import { clerkLocalization } from "@/lib/clerk/localization";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "의류 쇼핑몰 MVP",
    template: "%s | 의류 쇼핑몰",
  },
  description: "Next.js 15 + Clerk + Supabase + Toss Payments를 활용한 의류 쇼핑몰 MVP",
  keywords: ["쇼핑몰", "의류", "온라인 쇼핑", "패션"],
  authors: [{ name: "쇼핑몰 팀" }],
  creator: "쇼핑몰 팀",
  publisher: "쇼핑몰",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com"
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com",
    title: "의류 쇼핑몰 MVP",
    description: "Next.js 15 + Clerk + Supabase + Toss Payments를 활용한 의류 쇼핑몰 MVP",
    siteName: "의류 쇼핑몰",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "의류 쇼핑몰 MVP",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "의류 쇼핑몰 MVP",
    description: "Next.js 15 + Clerk + Supabase + Toss Payments를 활용한 의류 쇼핑몰 MVP",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/icons/icon-192x192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={clerkLocalization}>
      <html lang="ko">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <SyncUserProvider>
            <Navbar />
            {children}
          </SyncUserProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
