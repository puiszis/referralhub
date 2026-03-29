import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About | ReferralHub",
  description: "Learn about ReferralHub — who I am, why I curate deals, and our FTC disclosure.",
};

export default async function AboutPage() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "default" } });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-serif text-hero font-bold text-earth-900 mb-8">About ReferralHub</h1>

      {/* About Content */}
      <section className="mb-12">
        <div className="space-y-4">
          {(settings?.aboutContent || "").split("\n\n").map((paragraph, i) => (
            <p key={i} className="text-earth-700 leading-relaxed text-[16px]">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      {/* FTC Disclosure */}
      <section className="bg-amber-50 rounded-xl p-8 mb-12">
        <h2 className="font-serif text-xl font-bold text-earth-900 mb-4">FTC Disclosure</h2>
        <p className="text-earth-700 leading-relaxed">
          {settings?.ftcDisclosure ||
            "This site contains referral links. When you use these links, I may earn a commission or credit at no additional cost to you. I only recommend products and services I personally use."}
        </p>
      </section>

      {/* Contact */}
      <section>
        <h2 className="font-serif text-xl font-bold text-earth-900 mb-4">Get in Touch</h2>
        <p className="text-earth-600 leading-relaxed mb-4">
          Have a deal tip, question, or just want to say hello?
        </p>
        <a
          href={`mailto:${settings?.operatorEmail || "hello@referralhub.com"}`}
          className="btn-primary"
        >
          Send an Email
        </a>
      </section>
    </div>
  );
}
