import AppShell from '@/components/layout/AppShell';

export default function ShopLoading() {
  return (
    <AppShell>
      <div className="pt-24 min-h-screen bg-cream animate-pulse">
        <div className="bg-beige py-16 text-center mb-0">
          <div className="h-3 w-36 mx-auto rounded bg-nude/40" />
          <div className="h-10 w-64 mx-auto rounded bg-nude/50 mt-4" />
          <div className="h-4 w-80 max-w-[80%] mx-auto rounded bg-nude/35 mt-4" />
        </div>

        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-72 rounded-2xl bg-white/70" />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
