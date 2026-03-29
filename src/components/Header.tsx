"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-witch-950/90 backdrop-blur-lg border-b border-witch-800/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="text-2xl">🔮</span>
            <div>
              <span className="font-serif text-lg font-bold text-gold-400">Bewitched Bashes</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-witch-300">
            <Link href="/blog" className="hover:text-gold-400 transition-colors">Blog</Link>
            <Link href="/deals" className="hover:text-gold-400 transition-colors">Party Deals</Link>
            <Link href="/about" className="hover:text-gold-400 transition-colors">About</Link>
          </nav>

          <button
            className="md:hidden p-2 text-witch-300"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {mobileOpen && (
          <nav className="md:hidden pb-4 flex flex-col gap-3 text-sm font-medium text-witch-300">
            <Link href="/blog" className="py-2 hover:text-gold-400" onClick={() => setMobileOpen(false)}>Blog</Link>
            <Link href="/deals" className="py-2 hover:text-gold-400" onClick={() => setMobileOpen(false)}>Party Deals</Link>
            <Link href="/about" className="py-2 hover:text-gold-400" onClick={() => setMobileOpen(false)}>About</Link>
          </nav>
        )}
      </div>
    </header>
  );
}
