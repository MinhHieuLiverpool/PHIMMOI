export function LoadingState() {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="h-52 animate-pulse rounded-2xl border border-slate-800 bg-slate-900/70"
        />
      ))}
    </section>
  )
}
