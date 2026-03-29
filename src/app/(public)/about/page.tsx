import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About | Bewitched Bashes",
  description: "The story behind Bewitched Bashes — why we conjure up the best party planning resources.",
};

export default async function AboutPage() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "default" } });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <span className="text-5xl mb-4 block">🔮</span>
      <h1 className="font-serif text-hero font-bold text-gold-400 mb-8">About Bewitched Bashes</h1>

      <section className="mb-12 space-y-4">
        {(settings?.aboutContent || "We believe every celebration deserves a touch of magic. Bewitched Bashes is your one-stop grimoire for party planning inspiration, themed decoration guides, and hand-picked supply links that make entertaining effortless.\n\nFrom spooky Halloween soirées to enchanted garden parties, we curate the best deals and share step-by-step guides so you can focus on what matters — making memories with the people you love.\n\nEvery referral link on this site is for a product or service we genuinely recommend. When you shop through our links, we earn a small commission at no extra cost to you, which helps us keep the cauldron bubbling with fresh content.").split("\n\n").map((p, i) => (
          <p key={i} className="text-witch-300 leading-relaxed">{p}</p>
        ))}
      </section>

      <section className="glass-panel p-8 mb-12">
        <h2 className="font-serif text-xl font-bold text-gold-400 mb-4">Disclosure</h2>
        <p className="text-witch-300 leading-relaxed">
          {settings?.ftcDisclosure || "This site contains referral links. When you use these links, we may earn a commission at no additional cost to you. We only recommend products we genuinely love for your parties."}
        </p>
      </section>

      <section>
        <h2 className="font-serif text-xl font-bold text-witch-100 mb-4">Get in Touch</h2>
        <p className="text-witch-300 mb-4">Have a party theme idea, deal tip, or just want to say hello?</p>
        <a href={`mailto:${settings?.operatorEmail || "hello@bewitchedbashes.com"}`} className="btn-primary">
          Send an Owl
        </a>
      </section>
    </div>
  );
}
