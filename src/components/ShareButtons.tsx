"use client";

import { useState } from "react";

export default function ShareButtons({ title, slug }: { title: string; slug: string }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? `${window.location.origin}/${slug}` : `/${slug}`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2">
      <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
        target="_blank" rel="noopener noreferrer" className="btn-ghost text-sm">Share on X</a>
      <button onClick={copyLink} className="btn-ghost text-sm">{copied ? "Copied!" : "Copy Link"}</button>
    </div>
  );
}
