import { Link } from 'react-router-dom'
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
    <Link to={`/phim/${movie.slug}`} className="block">
      <article className="group w-[220px] shrink-0 overflow-hidden rounded-xl border border-slate-800/60 bg-slate-900/60 transition-all duration-300 hover:-translate-y-1.5 hover:border-cyan-400/40 hover:shadow-2xl hover:shadow-cyan-500/10">
        <div className="relative overflow-hidden">
          <img
            src={posterUrl}
            alt={movie.name}
            loading="lazy"
            className="aspect-[2/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(event) => {
              event.currentTarget.onerror = null
              event.currentTarget.src = FALLBACK_POSTER
            }}
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {/* Play button on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-400/90 text-slate-900 shadow-lg shadow-cyan-400/30 backdrop-blur">
              <svg className="h-5 w-5 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>

          {/* Episode badge */}
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
            <span className="rounded-md bg-black/70 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm">
              {movie.episode_current}
            </span>
          </div>

          {/* Quality badge */}
          <div className="absolute right-2 top-2">
            <span className="rounded-md bg-cyan-500/90 px-1.5 py-0.5 text-[10px] font-bold text-white">
              {movie.quality}
            </span>
          </div>
        </div>

        <div className="space-y-1.5 p-2.5">
          <h3 className="line-clamp-2 min-h-[2.75rem] text-sm font-bold leading-tight text-white group-hover:text-cyan-300 transition-colors">
            {movie.name}
          </h3>
          <p className="line-clamp-1 text-xs text-slate-500">{movie.origin_name}</p>

          <div className="flex flex-wrap gap-1 text-[10px]">
            <span className="rounded bg-slate-800/80 px-1.5 py-0.5 text-slate-400">{movie.lang}</span>
            <span className="rounded bg-slate-800/80 px-1.5 py-0.5 text-slate-400">{movie.year}</span>
          </div>
        </div>
      </article>
    </Link>
  )
}
