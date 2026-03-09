import type { Metadata } from "next";
import { Header } from "@/components/layout";
import { FloatingAssistant } from "@/components/assistant/FloatingAssistant";
import "./globals.css";

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
    <html lang="en">
      <body className="antialiased">
        <Header />
        <main className="pt-(--spacing-header) min-h-screen">{children}</main>
        <FloatingAssistant />
      </body>
    </html>
  );
}
