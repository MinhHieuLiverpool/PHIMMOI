import type { MovieItem } from '../../type/api'
import { FALLBACK_POSTER } from '../../config/constants'
import { resolvePosterUrl } from '../../services/ophimService'

type HeroBannerProps = {
  movie: MovieItem | null
  cdnImageBaseUrl: string
  itemsUpdatedToday: number | null
}

export function HeroBanner({
  movie,
  cdnImageBaseUrl,
  itemsUpdatedToday,
}: HeroBannerProps) {
  if (!movie) {
    return null
  }

  const backdropUrl = resolvePosterUrl(
    cdnImageBaseUrl,
    movie.poster_url || movie.thumb_url,
  )

  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-800/80">
      <img
        src={backdropUrl}
        alt={movie.name}
        className="h-[420px] w-full object-cover md:h-[520px]"
        onError={(event) => {
          event.currentTarget.onerror = null
          event.currentTarget.src = FALLBACK_POSTER
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
        <div className="max-w-2xl space-y-4">
          <p className="inline-flex rounded-full bg-cyan-400/20 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-cyan-200">
            Dang hot hom nay
          </p>

          <h1 className="text-3xl font-black leading-tight text-white md:text-5xl">
            {movie.name}
          </h1>

          <p className="text-sm text-slate-300 md:text-base">{movie.origin_name}</p>

          <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-200">
            <span className="rounded-full bg-slate-900/70 px-3 py-1">{movie.quality}</span>
            <span className="rounded-full bg-slate-900/70 px-3 py-1">{movie.lang}</span>
            <span className="rounded-full bg-slate-900/70 px-3 py-1">{movie.time}</span>
            <span className="rounded-full bg-slate-900/70 px-3 py-1">{movie.year}</span>
            {itemsUpdatedToday !== null ? (
              <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-emerald-200">
                {itemsUpdatedToday} phim cap nhat hom nay
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
