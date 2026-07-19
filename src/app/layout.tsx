import React from "react";
import type { Metadata } from "next";
import { Providers } from "./providers";
import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aetheris | AI-Driven Luxury Spatial Design & Architectural Hub",
  description:
    "Explore elite minimalist spaces, analyze interior aesthetics, and consult autonomous design agents.",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({
  children,
}: RootLayoutProps): React.JSX.Element {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-[#040404] text-neutral-100 antialiased selection:bg-[#e5ba73] selection:text-black">
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
