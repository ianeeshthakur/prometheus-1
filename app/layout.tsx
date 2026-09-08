import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "G-VISTA | Gujarat Video Intelligence & Surveillance Technology Architecture",
  description: "Statewide interoperable AI-driven video intelligence and investigation platform for Gujarat Police. 80,000+ cameras, real-time AI analytics, watchlist matching, and investigation workspace.",
  keywords: ["Gujarat Police", "CCTV", "Video Intelligence", "ANPR", "AI Analytics", "Surveillance", "G-VISTA"],
};

import { ThemeProvider } from "next-themes";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light">
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
