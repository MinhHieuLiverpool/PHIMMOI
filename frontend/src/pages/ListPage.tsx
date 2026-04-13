import { useEffect, useState, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { AppHeader } from '../component/layout/AppHeader'
import { AppFooter } from '../component/layout/AppFooter'
import { MovieCard } from '../component/movie/MovieCard'
import { LoadingSpinner } from '../component/movie/LoadingState'
import { PaginationBar } from '../component/movie/PaginationBar'
import { fetchListData } from '../services/ophimService'
import type { MovieItem, Pagination } from '../type/api'

const SLUG_TITLE_MAP: Record<string, string> = {
  'phim-le': 'Phim Lẻ',
  'phim-bo': 'Phim Bộ',
  'hoat-hinh': 'Hoạt Hình',
  'tv-shows': 'TV Shows',
  'phim-moi-cap-nhat': 'Phim Mới Cập Nhật',
  'phim-sap-chieu': 'Phim Sắp Chiếu',
}

export function ListPage() {
  const { slug } = useParams<{ slug: string }>()
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<MovieItem[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [cdnBase, setCdnBase] = useState('https://img.ophim.live')
  const [title, setTitle] = useState('')

  const loadPage = useCallback(
    async (page: number) => {
      if (!slug) return
      setLoading(true)
      try {
        const data = await fetchListData(slug, page)
        setItems(data.items ?? [])
        setPagination(data.params?.pagination ?? null)
        setCdnBase(data.APP_DOMAIN_CDN_IMAGE || 'https://img.ophim.live')
        setTitle(data.titlePage || SLUG_TITLE_MAP[slug] || slug)
      } catch {
        setItems([])
      } finally {
        setLoading(false)
      }
    },
    [slug],
  )

  useEffect(() => {
    void loadPage(1)
    window.scrollTo(0, 0)
  }, [loadPage])

  const handlePageChange = (page: number) => {
    void loadPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <AppHeader />

      <main className="mx-auto w-full max-w-7xl px-4 py-6 md:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
          <Link to="/" className="hover:text-cyan-400 transition">Trang chủ</Link>
          <span>/</span>
          <span className="text-slate-200">{title || 'Danh sách'}</span>
        </nav>

        {/* Title */}
        <div className="mb-8 flex items-center gap-3">
          <div className="h-7 w-1.5 rounded-full bg-gradient-to-b from-cyan-400 to-emerald-400" />
          <h1 className="text-2xl font-black text-white md:text-3xl">{title || 'Danh sách phim'}</h1>
          {pagination && (
            <span className="ml-2 rounded-full bg-slate-800/60 px-3 py-1 text-xs text-slate-400">
              {pagination.totalItems.toLocaleString()} phim
            </span>
          )}
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : items.length === 0 ? (
          <div className="py-20 text-center text-slate-500">Không tìm thấy phim nào.</div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {items.map((movie) => (
                <MovieCard key={movie._id} movie={movie} cdnImageBaseUrl={cdnBase} />
              ))}
            </div>

            {pagination && (
              <PaginationBar pagination={pagination} onPageChange={handlePageChange} />
            )}
          </>
        )}
      </main>

      <AppFooter />
    </div>
  )
}
