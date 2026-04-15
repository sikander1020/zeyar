import AppShell from '@/components/layout/AppShell';

export default function ProductLoading() {
  return (
    <AppShell>
      <div className="pt-24 min-h-screen bg-cream animate-pulse">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="h-3 w-48 rounded bg-nude/35 mb-4" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
            <div className="space-y-4">
              <div className="aspect-square rounded-2xl bg-white/70" />
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="aspect-square rounded-lg bg-white/60" />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-4 w-24 rounded bg-nude/35" />
              <div className="h-10 w-4/5 rounded bg-nude/45" />
              <div className="h-4 w-1/2 rounded bg-nude/30" />
              <div className="h-12 w-40 rounded bg-nude/35 mt-8" />
              <div className="h-12 w-full rounded bg-nude/30" />
              <div className="h-12 w-full rounded bg-nude/30" />
            </div>
          </div>
          <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="h-80 rounded-2xl bg-white/70" />
            <div className="h-80 rounded-2xl bg-white/70" />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
