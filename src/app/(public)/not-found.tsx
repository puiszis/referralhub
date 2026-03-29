import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <span className="text-5xl block mb-4">👻</span>
      <h1 className="font-serif text-4xl font-bold text-witch-100 mb-4">Page Has Vanished</h1>
      <p className="text-witch-400 mb-8">This page seems to have disappeared into thin air.</p>
      <Link href="/" className="btn-primary">Back to Home</Link>
    </div>
  );
}
