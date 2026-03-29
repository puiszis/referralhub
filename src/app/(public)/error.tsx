"use client";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <span className="text-5xl block mb-4">💥</span>
      <h1 className="font-serif text-4xl font-bold text-witch-100 mb-4">Spell Gone Wrong</h1>
      <p className="text-witch-400 mb-8">Something unexpected happened. Let&apos;s try that again.</p>
      <button onClick={reset} className="btn-primary">Try Again</button>
    </div>
  );
}
