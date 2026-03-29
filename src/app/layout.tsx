import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "Bewitched Bashes — Spellbinding Party Planning & Curated Supplies",
  description: "Enchanting party ideas, themed decorations, and curated supply links to make every bash unforgettable.",
  openGraph: {
    title: "Bewitched Bashes",
    description: "Spellbinding party planning & curated supplies",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
