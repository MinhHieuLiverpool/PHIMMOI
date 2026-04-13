import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { APP_BRAND, NAV_ITEMS } from '../../config/constants'

type AppHeaderProps = {
  searchKeyword?: string
  onSearchKeywordChange?: (value: string) => void
  onSearch?: () => Promise<void> | void
  onClearSearch?: () => void
  isSearching?: boolean
  hasSearchResults?: boolean
}

export function AppHeader({
  searchKeyword: externalKeyword,
  onSearchKeywordChange: externalOnChange,
  onSearch: externalOnSearch,
  onClearSearch,
  isSearching = false,
  hasSearchResults = false,
}: AppHeaderProps) {
  const navigate = useNavigate()
  const [internalKeyword, setInternalKeyword] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const keyword = externalKeyword ?? internalKeyword
  const setKeyword = externalOnChange ?? setInternalKeyword

  const handleSubmit = async () => {
    if (externalOnSearch) {
      await externalOnSearch()
    } else if (keyword.trim()) {
      navigate(`/tim-kiem?keyword=${encodeURIComponent(keyword.trim())}`)
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-slate-950/15 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-4 px-4 py-2 md:px-8">
        {/* Logo */}
        <Link to="/" className="flex shrink-0 items-center gap-2 group">
          <img
            src="/logo.png"
            alt="Mê Phim"
            className="h-14 w-auto object-contain transition-transform group-hover:scale-105"
          />
        </Link>

        {/* Desktop Nav - centered */}
        <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex" style={{ fontFamily: "'Syne', sans-serif" }}>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="rounded-lg px-4 py-1.5 text-sm font-semibold tracking-wide text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Search */}
        <form
          className="ml-auto flex w-full items-center gap-2 md:max-w-md"
          onSubmit={(e) => {
            e.preventDefault()
            void handleSubmit()
          }}
        >
          <div className="relative w-full">
            <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tìm phim, diễn viên..."
              className="h-10 w-full rounded-xl border border-slate-700/50 bg-slate-900/60 pl-10 pr-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/20"
            />
          </div>

          <button
            type="submit"
            className="h-10 shrink-0 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 px-5 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition hover:shadow-cyan-500/30 hover:brightness-110 disabled:opacity-50"
            disabled={isSearching}
          >
            {isSearching ? '...' : 'Tìm'}
          </button>

          {hasSearchResults && onClearSearch ? (
            <button
              type="button"
              onClick={onClearSearch}
              className="h-10 shrink-0 rounded-xl border border-slate-700 px-3 text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white"
            >
              ✕
            </button>
          ) : null}
        </form>

        {/* Mobile menu button */}
        <button
          type="button"
          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white lg:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <nav className="border-t border-slate-800/50 bg-slate-950/95 px-4 pb-4 pt-2 lg:hidden">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm text-slate-300 transition hover:bg-slate-800/80 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
