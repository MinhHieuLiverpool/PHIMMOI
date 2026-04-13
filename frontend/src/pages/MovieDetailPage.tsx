import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { AppHeader } from '../component/layout/AppHeader'
import { AppFooter } from '../component/layout/AppFooter'
import { LoadingSpinner } from '../component/movie/LoadingState'
import { fetchMovieDetail, resolvePosterUrl } from '../services/ophimService'
import { FALLBACK_POSTER } from '../config/constants'
import type { MovieDetailItem, EpisodeServer } from '../type/api'

export function MovieDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [movie, setMovie] = useState<MovieDetailItem | null>(null)
  const [episodes, setEpisodes] = useState<EpisodeServer[]>([])
  const [cdnBase, setCdnBase] = useState('https://img.ophim.live')

  useEffect(() => {
    if (!slug) return

    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const result = await fetchMovieDetail(slug)
        if (!result.movie) {
          setError('Không tìm thấy phim.')
          return
        }
        setMovie(result.movie)
        setEpisodes(result.episodes)
        setCdnBase(result.cdnBase)
      } catch {
        setError('Không tải được thông tin phim.')
      } finally {
        setLoading(false)
      }
    }

    void load()
    window.scrollTo(0, 0)
  }, [slug])

  const posterUrl = movie
    ? resolvePosterUrl(cdnBase, movie.poster_url || movie.thumb_url)
    : FALLBACK_POSTER
  const thumbUrl = movie
    ? resolvePosterUrl(cdnBase, movie.thumb_url)
    : FALLBACK_POSTER

  return (
    <div className="min-h-screen bg-slate-950">
      <AppHeader />

      {loading && (
        <div className="min-h-[60vh]">
          <LoadingSpinner />
        </div>
      )}
      {error && (
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
          <div className="rounded-xl border border-rose-700/60 bg-rose-900/20 p-4 text-sm text-rose-200">
            {error}
          </div>
        </div>
      )}

      {movie && !loading && (
        <>
          {/* ===== FULL-PAGE BLURRED BACKGROUND ===== */}
          <div className="fixed inset-0 -z-10">
            <img
              src={posterUrl}
              alt=""
              className="h-full w-full object-cover blur-3xl brightness-[0.15] saturate-150 scale-110"
              onError={(e) => {
                e.currentTarget.src = FALLBACK_POSTER
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/40 to-slate-950" />
          </div>

          {/* ===== HERO SECTION ===== */}
          <section className="relative">
            {/* Hero Background Image (non-blur, fading) */}
            <div className="absolute inset-0 h-[600px] overflow-hidden md:h-[700px]">
              <img
                src={posterUrl}
                alt=""
                className="h-full w-full object-cover object-top brightness-[0.4]"
                onError={(e) => {
                  e.currentTarget.src = FALLBACK_POSTER
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/40 to-transparent" />
            </div>

            {/* Hero Content */}
            <div className="relative mx-auto w-full max-w-7xl px-4 pb-10 pt-8 md:px-8 md:pt-12">
              <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-10">
                {/* Poster */}
                <div className="shrink-0 self-center md:self-start">
                  <div className="group relative">
                    <img
                      src={thumbUrl}
                      alt={movie.name}
                      className="w-56 rounded-2xl border-2 border-white/10 shadow-2xl shadow-black/60 transition-transform duration-300 group-hover:scale-[1.02] md:w-72"
                      onError={(e) => {
                        e.currentTarget.onerror = null
                        e.currentTarget.src = FALLBACK_POSTER
                      }}
                    />
                    {/* Play overlay on hover */}
                    <div
                      className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-2xl bg-black/30 opacity-0 transition-all duration-300 group-hover:opacity-100"
                      onClick={() => episodes.length > 0 && navigate(`/xem-phim/${movie.slug}`)}
                    >
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-md transition-transform group-hover:scale-110">
                        <svg className="h-8 w-8 translate-x-0.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Movie Details */}
                <div className="flex-1 space-y-5 pt-2 md:pt-8">
                  {/* Title */}
                  <div>
                    <h1 className="text-3xl font-black leading-tight text-white drop-shadow-lg md:text-5xl">
                      {movie.name}
                    </h1>
                    <p className="mt-2 text-base text-slate-300/80 md:text-lg">{movie.origin_name}</p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 text-xs font-semibold">
                    <span className="rounded-full bg-cyan-500/25 px-3.5 py-1.5 text-cyan-200 ring-1 ring-cyan-500/30 backdrop-blur-sm">
                      {movie.quality}
                    </span>
                    <span className="rounded-full bg-emerald-500/25 px-3.5 py-1.5 text-emerald-200 ring-1 ring-emerald-500/30 backdrop-blur-sm">
                      {movie.lang}
                    </span>
                    <span className="rounded-full bg-white/10 px-3.5 py-1.5 text-slate-200 ring-1 ring-white/10 backdrop-blur-sm">
                      {movie.time}
                    </span>
                    <span className="rounded-full bg-white/10 px-3.5 py-1.5 text-slate-200 ring-1 ring-white/10 backdrop-blur-sm">
                      {movie.year}
                    </span>
                    <span className="rounded-full bg-amber-500/15 px-3.5 py-1.5 text-amber-200 ring-1 ring-amber-500/20 backdrop-blur-sm">
                      {movie.episode_current}
                    </span>
                    {movie.episode_total && (
                      <span className="rounded-full bg-white/10 px-3.5 py-1.5 text-slate-200 ring-1 ring-white/10 backdrop-blur-sm">
                        Tổng {movie.episode_total}
                      </span>
                    )}
                  </div>

                  {/* Ratings */}
                  <div className="flex gap-5">
                    {movie.tmdb && movie.tmdb.vote_average > 0 && (
                      <div className="flex items-center gap-2">
                        <div className="rounded-lg bg-amber-500/20 px-2 py-1 text-xs font-black text-amber-300 ring-1 ring-amber-500/30">
                          TMDB
                        </div>
                        <span className="text-lg font-bold text-white">
                          {movie.tmdb.vote_average.toFixed(1)}
                        </span>
                        <span className="text-xs text-slate-500">({movie.tmdb.vote_count} votes)</span>
                      </div>
                    )}
                    {movie.imdb && movie.imdb.vote_average > 0 && (
                      <div className="flex items-center gap-2">
                        <div className="rounded-lg bg-yellow-500/20 px-2 py-1 text-xs font-black text-yellow-300 ring-1 ring-yellow-500/30">
                          IMDb
                        </div>
                        <span className="text-lg font-bold text-white">
                          {movie.imdb.vote_average.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Categories */}
                  {movie.category?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {movie.category.map((cat) => (
                        <Link
                          key={cat.id || cat.slug}
                          to={`/danh-sach/${cat.slug || 'phim-bo'}`}
                          className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 backdrop-blur-sm transition hover:border-cyan-400/40 hover:bg-cyan-500/10 hover:text-cyan-300"
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Meta info */}
                  <div className="space-y-2 text-sm">
                    {movie.country?.length > 0 && (
                      <p className="text-slate-400">
                        <span className="text-slate-300">Quốc gia: </span>
                        {movie.country.map((c) => c.name).join(', ')}
                      </p>
                    )}
                    {movie.director && movie.director.filter(Boolean).length > 0 && (
                      <p className="text-slate-400">
                        <span className="text-slate-300">Đạo diễn: </span>
                        {movie.director.filter(Boolean).join(', ')}
                      </p>
                    )}
                    {movie.actor && movie.actor.filter(Boolean).length > 0 && (
                      <p className="text-slate-400">
                        <span className="text-slate-300">Diễn viên: </span>
                        {movie.actor.filter(Boolean).slice(0, 10).join(', ')}
                        {movie.actor.filter(Boolean).length > 10 && '...'}
                      </p>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-3 pt-2">
                    {episodes.length > 0 && episodes[0]?.server_data?.length > 0 && (
                      <button
                        type="button"
                        onClick={() => navigate(`/xem-phim/${movie.slug}`)}
                        className="group flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-cyan-500/25 transition-all hover:shadow-cyan-500/40 hover:brightness-110 active:scale-95"
                      >
                        <svg className="h-5 w-5 transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                        Xem phim
                      </button>
                    )}

                    {movie.trailer_url && (
                      <a
                        href={movie.trailer_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/10 active:scale-95"
                      >
                        <svg className="h-4 w-4 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                        </svg>
                        Trailer
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ===== CONTENT AREA (over blurred bg) ===== */}
          <div className="relative mx-auto w-full max-w-7xl space-y-10 px-4 pb-16 md:px-8">
            {/* Synopsis */}
            {movie.content && (
              <section className="space-y-3">
                <h2 className="flex items-center gap-2.5 text-lg font-bold text-white">
                  <div className="h-5 w-1 rounded-full bg-gradient-to-b from-cyan-400 to-emerald-400" />
                  Nội dung phim
                </h2>
                <div
                  className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm leading-relaxed text-slate-300 backdrop-blur-md"
                  dangerouslySetInnerHTML={{ __html: movie.content }}
                />
              </section>
            )}

            {/* Episodes */}
            {episodes.length > 0 && (
              <section className="space-y-4">
                <h2 className="flex items-center gap-2.5 text-lg font-bold text-white">
                  <div className="h-5 w-1 rounded-full bg-gradient-to-b from-cyan-400 to-emerald-400" />
                  Danh sách tập
                </h2>

                {episodes.map((server) => (
                  <div
                    key={server.server_name}
                    className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md"
                  >
                    <p className="text-sm font-semibold text-slate-300">{server.server_name}</p>
                    <div className="flex flex-wrap gap-2">
                      {server.server_data.map((ep) => (
                        <Link
                          key={ep.slug}
                          to={`/xem-phim/${movie.slug}?tap=${ep.slug}&sv=${encodeURIComponent(server.server_name)}`}
                          className="flex h-10 min-w-[3.5rem] items-center justify-center rounded-lg border border-white/10 bg-white/5 px-3 text-xs font-semibold text-slate-300 transition-all hover:border-cyan-400/50 hover:bg-cyan-500/15 hover:text-cyan-300 hover:shadow-lg hover:shadow-cyan-500/10 active:scale-95"
                        >
                          {ep.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </section>
            )}

            {/* Trailer embed */}
            {movie.trailer_url && (
              <section className="space-y-3">
                <h2 className="flex items-center gap-2.5 text-lg font-bold text-white">
                  <div className="h-5 w-1 rounded-full bg-gradient-to-b from-cyan-400 to-emerald-400" />
                  Trailer
                </h2>
                <div className="aspect-video overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/30">
                  <iframe
                    src={movie.trailer_url.replace('watch?v=', 'embed/')}
                    className="h-full w-full"
                    allowFullScreen
                    title="Trailer"
                  />
                </div>
              </section>
            )}
          </div>
        </>
      )}

      <AppFooter />
    </div>
  )
}
