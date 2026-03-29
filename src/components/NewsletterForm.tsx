"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) { setStatus("success"); setEmail(""); }
      else setStatus("error");
    } catch { setStatus("error"); }
  };

  return (
    <section className="glass-panel p-8 text-center">
      <span className="text-3xl mb-3 block">✉️</span>
      <h2 className="font-serif text-2xl font-bold text-gold-400 mb-2">Join the Coven</h2>
      <p className="text-witch-300 mb-6 text-sm max-w-md mx-auto">
        Get party inspiration and exclusive deal alerts delivered to your cauldron — er, inbox.
      </p>
      {status === "success" ? (
        <p className="text-gold-400 font-medium">You&apos;re in! Watch for our owl.</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input type="email" required placeholder="you@email.com" value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-lg bg-witch-800/60 border border-witch-700/50 text-witch-100 placeholder:text-witch-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50" />
          <button type="submit" disabled={status === "loading"} className="btn-primary disabled:opacity-50">
            {status === "loading" ? "..." : "Subscribe"}
          </button>
        </form>
      )}
      {status === "error" && <p className="text-ember-400 text-sm mt-2">Something went wrong. Try again.</p>}
    </section>
  );
}
