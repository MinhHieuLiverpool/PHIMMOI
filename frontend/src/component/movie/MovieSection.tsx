import { Link } from 'react-router-dom'
import type { MovieItem } from '../../type/api'
import { MovieCard } from './MovieCard'

type MovieSectionProps = {
  title: string
  items: MovieItem[]
  cdnImageBaseUrl: string
  slug?: string
  reverse?: boolean
}

export function MovieSection({ title, items, cdnImageBaseUrl, slug, reverse = false }: MovieSectionProps) {
  if (items.length === 0) {
    return null
  }

  return (
    <section className="space-y-4 overflow-hidden">
      <div className="flex items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-3">
          <div className="h-6 w-1 rounded-full bg-gradient-to-b from-cyan-400 to-emerald-400" />
          <h2 className="text-xl font-extrabold text-white md:text-2xl">{title}</h2>
        </div>
        {slug ? (
          <Link
            to={`/danh-sach/${slug}`}
            className="flex items-center gap-1 rounded-lg border border-slate-700/50 px-3 py-1.5 text-xs font-semibold text-slate-400 transition hover:border-cyan-400/40 hover:text-cyan-300"
          >
            Xem tất cả
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ) : null}
      </div>

      {/* Auto-scroll container */}
      <div className="group relative">
        {/* Fade edges */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-slate-950 to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-slate-950 to-transparent" />

        <div
          className={`flex w-max gap-4 px-4 py-2 md:px-8 ${reverse ? 'animate-scroll-reverse' : 'animate-scroll'} group-hover:[animation-play-state:paused]`}
        >
          {/* Render items twice for seamless loop */}
          {[...items, ...items].map((movie, idx) => (
            <MovieCard
              key={`${movie._id}-${idx}`}
              movie={movie}
              cdnImageBaseUrl={cdnImageBaseUrl}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
