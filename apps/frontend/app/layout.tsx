import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BetterUpTime",
  description: "Monitors your website uptime and performance with real-time alerts",
  icons: {
    icon: "https://cdn.prod.website-files.com/5e9dc792e1210c5325f7ebbc/64354680f3f50b5758e2cb0d_1642608434799.webp",
    shortcut: "https://cdn.prod.website-files.com/5e9dc792e1210c5325f7ebbc/64354680f3f50b5758e2cb0d_1642608434799.webp",
    apple: "https://cdn.prod.website-files.com/5e9dc792e1210c5325f7ebbc/64354680f3f50b5758e2cb0d_1642608434799.webp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950`}
      >
        <Navigation />
        {children}
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
