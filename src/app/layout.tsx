import type { Metadata } from "next";
import "./globals.css";

// 1. Import the LanguageProvider we created
import { LanguageProvider } from "@/context/LanguageContext";

export const metadata: Metadata = {
  title: "SME Promoter IPO Dashboard | Neha Fashion",
  description: "High-fidelity promoter dashboard for tracking Neha Fashion Private Limited IPO filings, SEBI compliance checklists, and Annexure vault document submissions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">
        {/* 2. Wrap the children inside the LanguageProvider */}
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}