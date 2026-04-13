import { useEffect, useState, useMemo } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { AppHeader } from '../component/layout/AppHeader'
import { AppFooter } from '../component/layout/AppFooter'
import { LoadingSpinner } from '../component/movie/LoadingState'
import { MovieCard } from '../component/movie/MovieCard'
import { fetchMovieDetail, fetchCategoryMovies, resolvePosterUrl } from '../services/ophimService'
import { FALLBACK_POSTER } from '../config/constants'
import type { MovieDetailItem, MovieItem, EpisodeServer, EpisodeItem } from '../type/api'

export function WatchPage() {
  const { slug } = useParams<{ slug: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [movie, setMovie] = useState<MovieDetailItem | null>(null)
  const [episodes, setEpisodes] = useState<EpisodeServer[]>([])
  const [cdnBase, setCdnBase] = useState('https://img.ophim.live')
  const [lightOff, setLightOff] = useState(false)
  const [relatedMovies, setRelatedMovies] = useState<MovieItem[]>([])

  const activeEpSlug = searchParams.get('tap') || ''
  const activeServer = searchParams.get('sv') || ''

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
        setError('Không tải được dữ liệu phim.')
      } finally {
        setLoading(false)
      }
    }

    void load()
    window.scrollTo(0, 0)
  }, [slug])

  // Fetch related movies based on first category
  useEffect(() => {
    if (!movie?.category?.length) return
    const firstCat = movie.category[0]
    if (!firstCat?.slug) return

    fetchCategoryMovies(firstCat.slug, 1)
      .then((data) => {
        // Filter out the current movie and take 12
        const filtered = (data.items ?? []).filter((m) => m.slug !== slug).slice(0, 12)
        setRelatedMovies(filtered)
      })
      .catch(() => {})
  }, [movie, slug])

  // Determine which episode to play
  const currentEpisode: EpisodeItem | null = useMemo(() => {
    if (episodes.length === 0) return null

    if (activeEpSlug) {
      for (const server of episodes) {
        if (activeServer && server.server_name !== activeServer) continue
        const found = server.server_data.find((ep) => ep.slug === activeEpSlug)
        if (found) return found
      }
      for (const server of episodes) {
        const found = server.server_data.find((ep) => ep.slug === activeEpSlug)
        if (found) return found
      }
    }

    return episodes[0]?.server_data?.[0] ?? null
  }, [episodes, activeEpSlug, activeServer])

  const currentServerName = useMemo(() => {
    if (activeServer) return activeServer
    return episodes[0]?.server_name ?? ''
  }, [episodes, activeServer])

  const embedUrl = currentEpisode?.link_embed || ''

  const posterUrl = movie
    ? resolvePosterUrl(cdnBase, movie.poster_url || movie.thumb_url)
    : FALLBACK_POSTER
  const thumbUrl = movie
    ? resolvePosterUrl(cdnBase, movie.thumb_url)
    : FALLBACK_POSTER

  return (
    <div className={`min-h-screen ${lightOff ? 'bg-black' : ''}`}>
      {!lightOff && <AppHeader />}

      {/* Background thumbnail */}
      {movie && !lightOff && (
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <img
            src={posterUrl}
            alt=""
            className="h-full w-full object-cover blur-xl brightness-[0.25] saturate-150 scale-125"
            onError={(e) => { e.currentTarget.src = FALLBACK_POSTER }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/30 via-slate-950/50 to-slate-950/90" />
        </div>
      )}

      <main className={`mx-auto w-full max-w-7xl px-4 ${lightOff ? 'pt-8' : 'pt-24'} pb-4 md:px-8`}>
        {loading && <LoadingSpinner />}
        {error && (
          <div className="rounded-xl border border-rose-700/60 bg-rose-900/20 p-4 text-sm text-rose-200">
            {error}
          </div>
        )}

        {movie && !loading && (
          <>
            {/* Breadcrumb */}
            {!lightOff && (
              <nav className="mb-4 flex items-center gap-2 text-sm text-slate-500">
                <Link to="/" className="transition hover:text-cyan-400">
                  Trang chủ
                </Link>
                <span>/</span>
                <Link to={`/phim/${movie.slug}`} className="transition hover:text-cyan-400">
                  {movie.name}
                </Link>
                <span>/</span>
                <span className="text-cyan-400">{currentEpisode?.name ? `Tập ${currentEpisode.name}` : 'Xem phim'}</span>
              </nav>
            )}

            {/* Player */}
            <div className="relative">
              <div className="aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl shadow-black/60">
                {embedUrl ? (
                  <iframe
                    key={embedUrl}
                    src={embedUrl}
                    className="h-full w-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    title={currentEpisode?.filename || movie.name}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-500">
                    <p>Không có nguồn phát cho tập này</p>
                  </div>
                )}
              </div>

              {/* Light toggle - floating on player */}
              <button
                type="button"
                onClick={() => setLightOff(!lightOff)}
                className={`absolute top-3 right-3 z-10 flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold shadow-lg backdrop-blur-md transition-all ${
                  lightOff
                    ? 'bg-amber-500/90 text-black hover:bg-amber-400'
                    : 'bg-black/60 text-white/80 hover:bg-black/80 hover:text-white'
                }`}
              >
                {lightOff ? (
                  <>
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.06 1.06c.39.39 1.03.39 1.41 0a.996.996 0 000-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 000-1.41.996.996 0 00-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36a.996.996 0 000-1.41.996.996 0 00-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z" /></svg>
                    Bật đèn
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9.37 5.51A7.35 7.35 0 009.1 7.5c0 4.08 3.32 7.4 7.4 7.4.68 0 1.35-.09 1.99-.27A7.014 7.014 0 0112 19c-3.86 0-7-3.14-7-7 0-2.93 1.81-5.45 4.37-6.49zM12 3a9 9 0 109 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 01-4.4 2.26 5.403 5.403 0 01-3.14-9.8c-.44-.06-.9-.1-1.36-.1z" /></svg>
                    Tắt đèn
                  </>
                )}
              </button>
            </div>

            {/* Movie info below player */}
            <div className="mt-6 space-y-2">
              <h1 className="text-2xl font-black text-white md:text-3xl">
                {movie.name}
                {currentEpisode?.name ? ` - Tập ${currentEpisode.name}` : ''}
              </h1>
              <p className="text-sm text-slate-400" style={{ fontFamily: "'Syne', sans-serif" }}>
                {movie.origin_name} ({movie.year})
              </p>
              <div className="flex flex-wrap gap-2 pt-1 text-xs">
                <span className="rounded-full bg-cyan-500/20 px-3 py-1 font-semibold text-cyan-300">
                  {movie.quality}
                </span>
                <span className="rounded-full bg-emerald-500/20 px-3 py-1 font-semibold text-emerald-300">
                  {movie.lang}
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-slate-300">
                  {movie.episode_current}
                </span>
              </div>
            </div>

            {/* Server tabs + Episode list */}
            {episodes.length > 0 && (
              <section className="mt-8 space-y-4">
                <h2 className="flex items-center gap-2 text-lg font-bold text-white">
                  <div className="h-5 w-1 rounded-full bg-gradient-to-b from-cyan-400 to-emerald-400" />
                  Chọn tập phim
                </h2>

                {/* Server tabs */}
                {episodes.length > 1 && (
                  <div className="flex gap-2">
                    {episodes.map((server) => (
                      <button
                        key={server.server_name}
                        type="button"
                        onClick={() => {
                          const firstEp = server.server_data[0]
                          if (firstEp) {
                            setSearchParams({ tap: firstEp.slug, sv: server.server_name })
                          }
                        }}
                        className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${
                          currentServerName === server.server_name
                            ? 'border border-cyan-500/30 bg-cyan-500/20 text-cyan-300'
                            : 'border border-slate-700/50 text-slate-400 hover:text-white'
                        }`}
                      >
                        {server.server_name}
                      </button>
                    ))}
                  </div>
                )}

                {/* Episodes grid */}
                {episodes.map((server) => (
                  <div
                    key={server.server_name}
                    className={server.server_name === currentServerName ? '' : 'hidden'}
                  >
                    <div className="flex flex-wrap gap-2">
                      {server.server_data.map((ep) => {
                        const isActive = ep.slug === (currentEpisode?.slug ?? '')
                        return (
                          <button
                            key={ep.slug}
                            type="button"
                            onClick={() =>
                              setSearchParams({ tap: ep.slug, sv: server.server_name })
                            }
                            className={`flex h-10 min-w-[3.5rem] items-center justify-center rounded-lg px-3 text-xs font-semibold transition ${
                              isActive
                                ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-lg shadow-cyan-500/20'
                                : 'border border-slate-700/50 bg-slate-900/40 text-slate-300 hover:border-cyan-400/40 hover:bg-cyan-500/10 hover:text-cyan-300'
                            }`}
                          >
                            {ep.name}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </section>
            )}

            {/* Movie detail section at the bottom */}
            <section className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <div className="flex flex-col gap-6 md:flex-row">
                {/* Poster thumbnail */}
                <div className="shrink-0">
                  <img
                    src={thumbUrl}
                    alt={movie.name}
                    className="w-40 rounded-xl border border-white/10 shadow-lg md:w-48"
                    onError={(e) => { e.currentTarget.src = FALLBACK_POSTER }}
                  />
                </div>

                {/* Details */}
                <div className="flex-1 space-y-3">
                  <Link
                    to={`/phim/${movie.slug}`}
                    className="text-xl font-bold text-white transition hover:text-cyan-400"
                  >
                    {movie.name}
                  </Link>
                  <p className="text-sm text-slate-400">{movie.origin_name}</p>

                  <div className="space-y-1.5 text-sm text-slate-400">
                    {movie.category?.length > 0 && (
                      <p>
                        <span className="text-slate-300">Thể loại: </span>
                        {movie.category.map((c) => c.name).join(', ')}
                      </p>
                    )}
                    {movie.country?.length > 0 && (
                      <p>
                        <span className="text-slate-300">Quốc gia: </span>
                        {movie.country.map((c) => c.name).join(', ')}
                      </p>
                    )}
                    {movie.director && movie.director.filter(Boolean).length > 0 && (
                      <p>
                        <span className="text-slate-300">Đạo diễn: </span>
                        {movie.director.filter(Boolean).join(', ')}
                      </p>
                    )}
                    {movie.actor && movie.actor.filter(Boolean).length > 0 && (
                      <p>
                        <span className="text-slate-300">Diễn viên: </span>
                        {movie.actor.filter(Boolean).slice(0, 8).join(', ')}
                        {movie.actor.filter(Boolean).length > 8 && '...'}
                      </p>
                    )}
                  </div>

                  {movie.content && (
                    <div
                      className="line-clamp-3 text-sm leading-relaxed text-slate-400"
                      dangerouslySetInnerHTML={{ __html: movie.content }}
                    />
                  )}
                </div>
              </div>
            </section>
            {relatedMovies.length > 0 && movie?.category?.[0] && (
              <section className="mt-12">
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-6 w-1.5 rounded-full bg-gradient-to-b from-cyan-400 to-emerald-400" />
                  <h2 className="text-xl font-black text-white" style={{ fontFamily: "'Syne', sans-serif" }}>Phim liên quan</h2>
                </div>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                  {relatedMovies.map((m) => (
                    <MovieCard key={m._id} movie={m} cdnImageBaseUrl={cdnBase} />
                  ))}
                </div>
                <div className="mt-6 flex justify-center">
                  <Link
                    to={`/the-loai/${movie.category[0].slug}`}
                    className="group flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-8 py-3 text-sm font-semibold text-slate-200 backdrop-blur-sm transition-all hover:bg-cyan-500/15 hover:border-cyan-400/40 hover:text-cyan-300"
                  >
                    Xem thêm phim {movie.category[0].name}
                    <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </Link>
                </div>
              </section>
            )}
          </>
        )}
      </main>

      {!lightOff && <AppFooter />}
    </div>
  )
}
