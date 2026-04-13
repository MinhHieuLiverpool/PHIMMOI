export function LoadingState() {
  return (
    <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {Array.from({ length: 12 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse overflow-hidden rounded-xl border border-slate-800/50 bg-slate-900/50"
        >
          <div className="aspect-[2/3] w-full bg-slate-800/50" />
          <div className="space-y-2 p-3">
            <div className="h-3 w-3/4 rounded bg-slate-800/50" />
            <div className="h-2 w-1/2 rounded bg-slate-800/50" />
          </div>
        </div>
      ))}
    </section>
  )
}

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-400" />
    </div>
  )
}
