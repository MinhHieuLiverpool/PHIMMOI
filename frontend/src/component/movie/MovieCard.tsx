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
    <article className="group w-full min-w-[180px] max-w-[260px] shrink-0 overflow-hidden rounded-xl border border-slate-800/60 bg-slate-900/60 transition-all duration-300 hover:-translate-y-1.5 hover:border-cyan-400/40 hover:shadow-2xl hover:shadow-cyan-500/10">
      <div className="relative overflow-hidden">
        <Link to={`/phim/${movie.slug}`} className="block">
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
        </Link>

        <div className="absolute left-1.5 top-1.5 z-10">
          <img src="/logo-icon.png" alt="" className="h-8 w-8 object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] opacity-90" />
        </div>

        {/* Episode badge */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
          <span className="rounded-md bg-black/70 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm">
            {movie.episode_current}
          </span>
        </div>

        {/* Quality badge - bigger */}
        <div className="absolute right-2 top-2">
          <span className="rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 px-2.5 py-1 text-xs font-extrabold tracking-wide text-white shadow-lg shadow-cyan-500/30">
            {movie.quality}
          </span>
        </div>
      </div>

      <div className="space-y-1.5 p-2.5">
        <Link to={`/phim/${movie.slug}`}>
          <h3 className="line-clamp-2 min-h-[2.75rem] text-sm font-bold leading-tight text-white group-hover:text-cyan-300 transition-colors">
            {movie.name}
          </h3>
        </Link>
        <p className="line-clamp-1 text-xs font-bold text-slate-400" style={{ fontFamily: "'Syne', sans-serif" }}>
          {movie.origin_name}
        </p>

        <div className="flex flex-wrap gap-1.5 text-[10px]">
          <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 font-semibold text-emerald-400 border border-emerald-500/30">
            {movie.lang}
          </span>
          <span className="rounded-md bg-amber-500/20 px-2 py-0.5 font-semibold text-amber-400 border border-amber-500/30">
            {movie.year}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex gap-1.5 pt-1">
          <Link
            to={`/xem-phim/${movie.slug}`}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-white py-1.5 text-[11px] font-bold text-slate-900 transition-all hover:bg-white/90 active:scale-95"
          >
            <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Xem
          </Link>
          <Link
            to={`/phim/${movie.slug}`}
            className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-slate-600/50 bg-slate-800/60 py-1.5 text-[11px] font-semibold text-slate-300 transition-all hover:bg-slate-700/60 hover:text-white active:scale-95"
          >
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Chi tiết
          </Link>
        </div>
      </div>
    </article>
  )
}
