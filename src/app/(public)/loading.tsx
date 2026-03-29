export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="animate-pulse space-y-8">
        <div className="text-center py-12">
          <div className="h-10 bg-earth-100 rounded w-2/3 mx-auto mb-4" />
          <div className="h-5 bg-earth-100 rounded w-1/2 mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-earth-100 p-5 h-64">
              <div className="h-8 w-8 bg-earth-100 rounded mb-3" />
              <div className="h-5 bg-earth-100 rounded w-3/4 mb-2" />
              <div className="h-3 bg-earth-100 rounded w-1/2 mb-4" />
              <div className="h-3 bg-earth-100 rounded w-full mb-2" />
              <div className="h-3 bg-earth-100 rounded w-5/6" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
