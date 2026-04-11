export default function DressesLoading() {
  return (
    <div className="pt-28 min-h-screen bg-cream animate-pulse">
      <div className="max-w-7xl mx-auto px-6 pb-10">
        <div className="h-4 w-40 rounded bg-nude/40 mb-4" />
        <div className="h-10 w-72 rounded bg-nude/50 mb-8" />
        <div className="h-11 w-full rounded-xl bg-white/70 mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="h-80 rounded-2xl bg-white/70" />
          ))}
        </div>
      </div>
    </div>
  );
}
