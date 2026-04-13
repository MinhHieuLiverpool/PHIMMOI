import { useEffect, useState, useMemo } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { AppHeader } from '../component/layout/AppHeader'
import { AppFooter } from '../component/layout/AppFooter'
import { LoadingSpinner } from '../component/movie/LoadingState'
import { fetchMovieDetail } from '../services/ophimService'
import type { MovieDetailItem, EpisodeServer, EpisodeItem } from '../type/api'

export function WatchPage() {
  const { slug } = useParams<{ slug: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [movie, setMovie] = useState<MovieDetailItem | null>(null)
  const [episodes, setEpisodes] = useState<EpisodeServer[]>([])
  const [lightOff, setLightOff] = useState(false)

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
      } catch {
        setError('Không tải được dữ liệu phim.')
      } finally {
        setLoading(false)
      }
    }

    void load()
    window.scrollTo(0, 0)
  }, [slug])

  // Determine which episode to play
  const currentEpisode: EpisodeItem | null = useMemo(() => {
    if (episodes.length === 0) return null

    // If we have a specific episode slug
    if (activeEpSlug) {
      for (const server of episodes) {
        if (activeServer && server.server_name !== activeServer) continue
        const found = server.server_data.find((ep) => ep.slug === activeEpSlug)
        if (found) return found
      }
      // Fallback: search all servers
      for (const server of episodes) {
        const found = server.server_data.find((ep) => ep.slug === activeEpSlug)
        if (found) return found
      }
    }

    // Default: first episode of first server
    return episodes[0]?.server_data?.[0] ?? null
  }, [episodes, activeEpSlug, activeServer])

  const currentServerName = useMemo(() => {
    if (activeServer) return activeServer
    return episodes[0]?.server_name ?? ''
  }, [episodes, activeServer])

  const embedUrl = currentEpisode?.link_embed || ''

  return (
    <div className={`min-h-screen bg-slate-950 ${lightOff ? 'lights-off' : ''}`}>
      {!lightOff && <AppHeader />}

      <main className="mx-auto w-full max-w-7xl px-4 py-4 md:px-8">
        {loading && <LoadingSpinner />}
        {error && (
          <div className="rounded-xl border border-rose-700/60 bg-rose-900/20 p-4 text-sm text-rose-200">
            {error}
          </div>
        )}

        {movie && !loading && (
          <>
            {/* Breadcrumb */}
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

            {/* Player */}
            <div className="relative">
              <div className="aspect-video w-full overflow-hidden rounded-xl border border-slate-800/50 bg-black shadow-2xl shadow-black/40">
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
            </div>

            {/* Controls bar */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setLightOff(!lightOff)}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                  lightOff
                    ? 'border-cyan-400/50 bg-cyan-500/10 text-cyan-300'
                    : 'border-slate-700/50 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                }`}
              >
                💡 {lightOff ? 'Bật đèn' : 'Tắt đèn'}
              </button>

              <Link
                to={`/phim/${movie.slug}`}
                className="flex items-center gap-1.5 rounded-lg border border-slate-700/50 px-3 py-2 text-xs font-semibold text-slate-400 transition hover:border-slate-600 hover:text-slate-200"
              >
                ℹ️ Chi tiết phim
              </Link>
            </div>

            {/* Movie title */}
            <div className="mt-6 space-y-1">
              <h1 className="text-2xl font-black text-white md:text-3xl">
                {movie.name}
                {currentEpisode?.name ? ` - Tập ${currentEpisode.name}` : ''}
              </h1>
              <p className="text-sm text-slate-400">
                {movie.origin_name} ({movie.year})
              </p>
              <div className="flex flex-wrap gap-2 pt-1 text-xs">
                <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-cyan-300">
                  {movie.quality}
                </span>
                <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-emerald-300">
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
          </>
        )}
      </main>

      {!lightOff && <AppFooter />}
    </div>
  )
}
