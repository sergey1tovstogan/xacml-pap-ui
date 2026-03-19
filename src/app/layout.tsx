import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { Header } from "@/components/layout";
import { FloatingAssistant } from "@/components/assistant/FloatingAssistant";
import "./globals.css";

const displayFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["500", "700"],
});

export const metadata: Metadata = {
  title: "Temenos PAP UI Explorer",
  description:
    "Documentation & AI-powered assistant for XACML Policy Administration Point",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={displayFont.variable}>
      <body className="antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-lg focus:bg-green focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-warm-blue"
        >
          Skip to content
        </a>
        <Header />
        <main id="main-content" className="pt-(--spacing-header) min-h-screen">{children}</main>
        <FloatingAssistant />
      </body>
    </html>
  );
}
