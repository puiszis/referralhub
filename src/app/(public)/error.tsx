"use client";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <h1 className="font-serif text-4xl font-bold text-earth-900 mb-4">Something went wrong</h1>
      <p className="text-earth-500 mb-8">An unexpected error occurred. Please try again.</p>
      <button onClick={reset} className="btn-primary">Try Again</button>
    </div>
  );
}
