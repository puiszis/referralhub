import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-witch-800/50 bg-witch-950/80 mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🔮</span>
              <span className="font-serif text-lg font-bold text-gold-400">Bewitched Bashes</span>
            </div>
            <p className="text-sm text-witch-400 leading-relaxed">
              Spellbinding party planning ideas and curated supply links to make every bash unforgettable.
            </p>
          </div>
          <div>
            <h4 className="section-label mb-3">Navigate</h4>
            <div className="flex flex-col gap-2 text-sm text-witch-400">
              <Link href="/blog" className="hover:text-gold-400 transition-colors">Blog</Link>
              <Link href="/deals" className="hover:text-gold-400 transition-colors">Party Deals</Link>
              <Link href="/about" className="hover:text-gold-400 transition-colors">About</Link>
            </div>
          </div>
          <div>
            <h4 className="section-label mb-3">Disclosure</h4>
            <p className="text-xs text-witch-500 leading-relaxed">
              This site contains referral links. When you use these links, we may earn a commission at no extra cost to you. We only recommend products we genuinely love for your parties.
            </p>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-witch-800/40 text-center text-xs text-witch-600">
          &copy; {new Date().getFullYear()} Bewitched Bashes. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
