import type { MovieItem } from '../../type/api'
import { FALLBACK_POSTER } from '../../config/constants'
import { resolvePosterUrl } from '../../services/ophimService'

type MovieCardProps = {
  movie: MovieItem
  cdnImageBaseUrl: string
}

export function MovieCard({ movie, cdnImageBaseUrl }: MovieCardProps) {
  const posterUrl = resolvePosterUrl(cdnImageBaseUrl, movie.poster_url || movie.thumb_url)

  return (
    <article className="group w-[175px] shrink-0 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 transition hover:-translate-y-1 hover:border-cyan-400/50 hover:shadow-2xl hover:shadow-cyan-500/10 sm:w-[200px]">
      <div className="relative">
        <img
          src={posterUrl}
          alt={movie.name}
          loading="lazy"
          className="aspect-[2/3] w-full object-cover"
          onError={(event) => {
            event.currentTarget.onerror = null
            event.currentTarget.src = FALLBACK_POSTER
          }}
        />

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-xs text-white">
          <p>{movie.episode_current}</p>
        </div>
      </div>

      <div className="space-y-2 p-3">
        <h3 className="min-h-10 overflow-hidden text-sm font-bold text-white">{movie.name}</h3>
        <p className="overflow-hidden text-xs text-slate-400">{movie.origin_name}</p>

        <div className="flex flex-wrap gap-1.5 text-[11px] text-slate-300">
          <span className="rounded bg-slate-800 px-1.5 py-0.5">{movie.quality}</span>
          <span className="rounded bg-slate-800 px-1.5 py-0.5">{movie.lang}</span>
          <span className="rounded bg-slate-800 px-1.5 py-0.5">{movie.year}</span>
        </div>
      </div>
    </article>
  )
}
