import type { MovieItem } from '../../type/api'
import { MovieCard } from './MovieCard'

type MovieSectionProps = {
  title: string
  items: MovieItem[]
  cdnImageBaseUrl: string
}

export function MovieSection({ title, items, cdnImageBaseUrl }: MovieSectionProps) {
  if (items.length === 0) {
    return null
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-white md:text-2xl">{title}</h2>
        <button
          type="button"
          className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white"
        >
          Xem tat ca
        </button>
      </div>

      <div className="movie-scroll flex gap-3 overflow-x-auto pb-2">
        {items.map((movie) => (
          <MovieCard key={movie._id} movie={movie} cdnImageBaseUrl={cdnImageBaseUrl} />
        ))}
      </div>
    </section>
  )
}
