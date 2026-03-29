import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "ReferralHub — Hand-Picked Deals & Referral Links",
  description: "Curated referral deals from products I personally use. Outdoor gear, tech, home products, finance, and lifestyle.",
  openGraph: {
    title: "ReferralHub",
    description: "Hand-picked deals from products I personally use",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
