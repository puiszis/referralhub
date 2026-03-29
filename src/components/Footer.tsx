import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-earth-100 bg-white mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🔗</span>
              <span className="font-serif text-lg font-bold text-earth-900">ReferralHub</span>
            </div>
            <p className="text-sm text-earth-500 leading-relaxed">
              Hand-picked deals from products I personally use. No spam, no fluff — just honest recommendations.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-earth-400 mb-3">Navigation</h4>
            <div className="flex flex-col gap-2 text-sm text-earth-600">
              <Link href="/" className="hover:text-earth-900 transition-colors">All Deals</Link>
              <Link href="/about" className="hover:text-earth-900 transition-colors">About</Link>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-earth-400 mb-3">Disclosure</h4>
            <p className="text-xs text-earth-400 leading-relaxed">
              This site contains referral links. When you use these links, I may earn a commission or credit at no additional cost to you. I only recommend products and services I personally use.
            </p>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-earth-100 text-center text-xs text-earth-400">
          &copy; {new Date().getFullYear()} ReferralHub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
