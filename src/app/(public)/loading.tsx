export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="animate-pulse space-y-8">
        <div className="text-center py-12">
          <div className="h-10 bg-witch-800/60 rounded w-2/3 mx-auto mb-4" />
          <div className="h-5 bg-witch-800/60 rounded w-1/2 mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-witch-900/40 rounded-xl border border-witch-800/30 p-6 h-64" />
          ))}
        </div>
      </div>
    </div>
  );
}
