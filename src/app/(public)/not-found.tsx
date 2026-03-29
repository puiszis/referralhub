import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <h1 className="font-serif text-4xl font-bold text-earth-900 mb-4">Page Not Found</h1>
      <p className="text-earth-500 mb-8">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
      <Link href="/" className="btn-primary">Back to Deals</Link>
    </div>
  );
}
