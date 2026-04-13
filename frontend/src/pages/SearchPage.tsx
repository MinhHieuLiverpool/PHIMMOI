import { useEffect, useState, useCallback } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { AppHeader } from '../component/layout/AppHeader'
import { AppFooter } from '../component/layout/AppFooter'
import { MovieCard } from '../component/movie/MovieCard'
import { LoadingSpinner } from '../component/movie/LoadingState'
import { PaginationBar } from '../component/movie/PaginationBar'
import { searchMovies } from '../services/ophimService'
import type { MovieItem, Pagination } from '../type/api'

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const keyword = searchParams.get('keyword') || ''
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<MovieItem[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [cdnBase, setCdnBase] = useState('https://img.ophim.live')
  const [searchInput, setSearchInput] = useState(keyword)

  const doSearch = useCallback(
    async (q: string, page: number) => {
      if (!q.trim()) {
        setItems([])
        return
      }
      setLoading(true)
      try {
        const data = await searchMovies(q, page)
        setItems(data.items ?? [])
        setPagination(data.params?.pagination ?? null)
        setCdnBase(data.APP_DOMAIN_CDN_IMAGE || 'https://img.ophim.live')
      } catch {
        setItems([])
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  useEffect(() => {
    if (keyword) {
      setSearchInput(keyword)
      void doSearch(keyword, 1)
    }
  }, [keyword, doSearch])

  const handleSubmit = () => {
    if (searchInput.trim()) {
      setSearchParams({ keyword: searchInput.trim() })
    }
  }

  const handlePageChange = (page: number) => {
    void doSearch(keyword, page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <AppHeader
        searchKeyword={searchInput}
        onSearchKeywordChange={setSearchInput}
        onSearch={handleSubmit}
      />

      <main className="mx-auto w-full max-w-7xl px-4 pt-24 pb-6 md:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
          <Link to="/" className="hover:text-cyan-400 transition">Trang chủ</Link>
          <span>/</span>
          <span className="text-slate-200">Tìm kiếm</span>
        </nav>

        <div className="mb-8 flex items-center gap-3">
          <div className="h-7 w-1.5 rounded-full bg-gradient-to-b from-cyan-400 to-emerald-400" />
          <h1 className="text-2xl font-black text-white md:text-3xl">
            {keyword
              ? `Kết quả tìm kiếm: "${keyword}"`
              : 'Tìm kiếm phim'}
          </h1>
          {pagination && items.length > 0 && (
            <span className="ml-2 rounded-full bg-slate-800/60 px-3 py-1 text-xs text-slate-400">
              {pagination.totalItems.toLocaleString()} kết quả
            </span>
          )}
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : !keyword ? (
          <div className="py-20 text-center">
            <p className="text-4xl mb-4">🎬</p>
            <p className="text-slate-400">Nhập từ khóa để tìm kiếm phim</p>
          </div>
        ) : items.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-4xl mb-4">😔</p>
            <p className="text-slate-400">Không tìm thấy phim nào cho "{keyword}"</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
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
