"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-earth-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🔗</span>
            <span className="font-serif text-xl font-bold text-earth-900">ReferralHub</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-earth-600">
            <Link href="/" className="hover:text-earth-900 transition-colors">Deals</Link>
            <Link href="/about" className="hover:text-earth-900 transition-colors">About</Link>
            <Link href="/admin" className="hover:text-earth-900 transition-colors text-earth-400">Admin</Link>
          </nav>

          <button
            className="md:hidden p-2 text-earth-600"
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
          <nav className="md:hidden pb-4 flex flex-col gap-3 text-sm font-medium text-earth-600">
            <Link href="/" className="py-2 hover:text-earth-900" onClick={() => setMobileOpen(false)}>Deals</Link>
            <Link href="/about" className="py-2 hover:text-earth-900" onClick={() => setMobileOpen(false)}>About</Link>
          </nav>
        )}
      </div>
    </header>
  );
}
