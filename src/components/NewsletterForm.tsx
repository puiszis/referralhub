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
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="bg-olive-600 rounded-2xl p-8 text-center text-white">
      <h2 className="font-serif text-2xl font-bold mb-2">Get Deal Alerts</h2>
      <p className="text-olive-100 mb-6 text-sm max-w-md mx-auto">
        New deals land every week. Subscribe for a quick email when something great drops.
      </p>
      {status === "success" ? (
        <p className="text-olive-100 font-medium">You&apos;re in! Watch your inbox.</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            required
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-olive-200 focus:outline-none focus:ring-2 focus:ring-white/40"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="px-6 py-2.5 bg-white text-olive-700 font-semibold rounded-lg hover:bg-olive-50 transition-colors disabled:opacity-50"
          >
            {status === "loading" ? "..." : "Subscribe"}
          </button>
        </form>
      )}
      {status === "error" && (
        <p className="text-red-200 text-sm mt-2">Something went wrong. Try again.</p>
      )}
    </section>
  );
}
