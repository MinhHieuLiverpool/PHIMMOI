import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import type { MovieItem } from '../../type/api'
import { FALLBACK_POSTER } from '../../config/constants'
import { resolvePosterUrl, fetchMovieDetail } from '../../services/ophimService'

type HeroBannerProps = {
  movies: MovieItem[]
  cdnImageBaseUrl: string
  itemsUpdatedToday: number | null
}

const SLIDE_INTERVAL = 5000

export function HeroBanner({ movies, cdnImageBaseUrl, itemsUpdatedToday }: HeroBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [movieContent, setMovieContent] = useState<string>('')
  const contentCache = useRef<Record<string, string>>({})

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning || index === currentIndex) return
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentIndex(index)
        setTimeout(() => setIsTransitioning(false), 100)
      }, 500)
    },
    [currentIndex, isTransitioning],
  )

  useEffect(() => {
    if (movies.length <= 1) return
    const timer = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % movies.length)
        setTimeout(() => setIsTransitioning(false), 100)
      }, 500)
    }, SLIDE_INTERVAL)
    return () => clearInterval(timer)
  }, [movies.length])

  // Fetch movie content/description for current banner movie
  useEffect(() => {
    if (movies.length === 0) return
    const slug = movies[currentIndex]?.slug
    if (!slug) return

    // Use cache if available
    if (contentCache.current[slug]) {
      setMovieContent(contentCache.current[slug])
      return
    }

    let cancelled = false
    fetchMovieDetail(slug)
      .then(({ movie: detail }) => {
        if (cancelled) return
        // Strip HTML tags from content
        const raw = detail.content?.replace(/<[^>]*>/g, '') || ''
        contentCache.current[slug] = raw
        setMovieContent(raw)
      })
      .catch(() => {
        if (!cancelled) setMovieContent('')
      })
    return () => { cancelled = true }
  }, [movies, currentIndex])

  if (movies.length === 0) return null

  const movie = movies[currentIndex]
  // thumb_url = portrait thumbnail (used for poster card in corner)
  const posterCardUrl = resolvePosterUrl(cdnImageBaseUrl, movie.thumb_url)
  // poster_url = wider backdrop (used for full-screen background)
  // If poster_url not available, derive from thumb_url by replacing -thumb with -poster
  const backdropPath = movie.poster_url
    || (movie.thumb_url ? movie.thumb_url.replace('-thumb', '-poster') : movie.thumb_url)
  const backdropUrl = resolvePosterUrl(cdnImageBaseUrl, backdropPath)

  return (
    <section className="relative w-full overflow-hidden bg-slate-950" style={{ height: 'clamp(650px, 100vh, 950px)' }}>
      {/* === BACKDROP IMAGE (full cover) === */}
      <div className={`absolute inset-0 transition-opacity duration-700 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        <img
          src={backdropUrl}
          alt=""
          className="h-full w-full scale-110 object-cover object-[center_35%]"
          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_POSTER }}
        />
      </div>

      {/* === GRADIENT OVERLAYS === */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/60 to-slate-950/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-950 to-transparent" />

      {/* === CONTENT === */}
      <div className={`relative flex h-full items-end transition-all duration-700 ${isTransitioning ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'}`}>
        <div className="flex w-full items-end justify-between gap-8 px-6 pb-20 md:px-12 lg:px-16">
          {/* LEFT - Movie Info */}
          <div className="max-w-2xl space-y-4">
            {/* Category tag */}
            {movie.category && movie.category.length > 0 && (
              <span className="inline-block rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold text-white backdrop-blur-sm">
                {movie.category[0].name}
              </span>
            )}

            {/* Title */}
            <h1 className="text-4xl font-black leading-[1.05] text-white drop-shadow-2xl md:text-5xl lg:text-6xl">
              {movie.name}
            </h1>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
              <span className="flex items-center gap-1.5">
                <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                {movie.year}
              </span>
              {movie.time && (
                <span className="flex items-center gap-1.5">
                  <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {movie.time}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                {movie.quality}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                {movie.lang}
              </span>
              {itemsUpdatedToday !== null && (
                <span className="text-emerald-400">
                  🔥 {itemsUpdatedToday} phim mới hôm nay
                </span>
              )}
            </div>

            {/* Movie Description */}
            {movieContent && (
              <p className="line-clamp-2 text-sm leading-relaxed text-slate-300/90 md:text-base">
                {movieContent}
              </p>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <Link
                to={`/xem-phim/${movie.slug}`}
                className="group flex items-center gap-2.5 rounded-full bg-white px-7 py-3 text-sm font-bold text-slate-900 shadow-xl transition-all hover:bg-white/90 hover:shadow-white/20 active:scale-95"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Xem Ngay
              </Link>
              <Link
                to={`/phim/${movie.slug}`}
                className="flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 active:scale-95"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Chi tiết
              </Link>
            </div>
          </div>

          {/* RIGHT - Poster card */}
          <div className="hidden shrink-0 md:block">
            <div className="relative">
              <img
                src={posterCardUrl}
                alt={movie.name}
                className="h-[280px] w-auto rounded-2xl border-2 border-white/10 object-cover shadow-2xl shadow-black/50 transition-transform duration-700 hover:scale-105 lg:h-[320px]"
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_POSTER }}
              />
              {/* Glow effect */}
              <div className="absolute -inset-4 -z-10 rounded-3xl bg-cyan-500/10 blur-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* === SCROLL DOWN BUTTON === */}
      <button
        type="button"
        onClick={() => document.getElementById('movie-sections')?.scrollIntoView({ behavior: 'smooth' })}
        className="absolute bottom-16 left-1/2 z-20 -translate-x-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-110 animate-bounce"
        aria-label="Cuộn xuống"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </button>

      {/* === SLIDE INDICATORS === */}
      {movies.length > 1 && (
        <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {movies.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => goToSlide(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex
                ? 'w-8 bg-white'
                : 'w-3 bg-white/30 hover:bg-white/50'
                }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      )}

    </section>
  )
}
