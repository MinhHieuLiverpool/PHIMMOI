import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { NAV_ITEMS } from '../../config/constants'
import { fetchCategoryList, fetchCountryList } from '../../services/ophimService'

type DropdownItem = { _id: string; name: string; slug: string }

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
  const [categories, setCategories] = useState<DropdownItem[]>([])
  const [countries, setCountries] = useState<DropdownItem[]>([])
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const keyword = externalKeyword ?? internalKeyword
  const setKeyword = externalOnChange ?? setInternalKeyword

  // Fetch categories and countries on mount
  useEffect(() => {
    fetchCategoryList()
      .then((data) => {
        const envelope = data as { status?: string; data?: { items?: DropdownItem[] }; items?: DropdownItem[] }
        const items = envelope.data?.items ?? envelope.items ?? []
        setCategories(items)
      })
      .catch(() => {})

    fetchCountryList()
      .then((data) => {
        const envelope = data as { status?: string; data?: { items?: DropdownItem[] }; items?: DropdownItem[] }
        const items = envelope.data?.items ?? envelope.items ?? []
        setCountries(items)
      })
      .catch(() => {})
  }, [])

  const handleSubmit = async () => {
    if (externalOnSearch) {
      await externalOnSearch()
    } else if (keyword.trim()) {
      navigate(`/tim-kiem?keyword=${encodeURIComponent(keyword.trim())}`)
    }
  }

  const handleDropdownEnter = (name: string) => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current)
    setOpenDropdown(name)
  }

  const handleDropdownLeave = () => {
    dropdownTimeout.current = setTimeout(() => setOpenDropdown(null), 200)
  }

  const handleDropdownItemClick = () => {
    setOpenDropdown(null)
    setMobileMenuOpen(false)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-slate-950/15 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-2 md:px-8">
        {/* Logo */}
        <Link to="/" className="flex shrink-0 items-center gap-2 group">
          <img
            src="/logo.png"
            alt="Mê Phim"
            className="h-14 w-auto object-contain transition-transform group-hover:scale-105"
          />
        </Link>

        {/* Desktop Nav - centered */}
        <nav className="hidden flex-1 items-center justify-center gap-0.5 lg:flex" style={{ fontFamily: "'Syne', sans-serif" }}>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="rounded-lg px-3 py-1.5 text-[13px] font-semibold tracking-wide text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              {item.label}
            </Link>
          ))}

          {/* Thể loại dropdown */}
          <div
            className="relative"
            onMouseEnter={() => handleDropdownEnter('category')}
            onMouseLeave={handleDropdownLeave}
          >
            <button
              type="button"
              className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-[13px] font-semibold tracking-wide text-slate-300 transition hover:bg-white/10 hover:text-white"
              onClick={() => setOpenDropdown(openDropdown === 'category' ? null : 'category')}
            >
              Thể loại
              <svg className={`h-3 w-3 transition-transform ${openDropdown === 'category' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {openDropdown === 'category' && (
              <div
                className="absolute left-1/2 top-full -translate-x-1/2 pt-2"
                onMouseEnter={() => handleDropdownEnter('category')}
                onMouseLeave={handleDropdownLeave}
              >
                <div className="max-h-[70vh] w-[520px] overflow-y-auto rounded-xl border border-white/10 bg-slate-900/95 shadow-2xl shadow-black/50 backdrop-blur-xl">
                  <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
                    <svg className="h-4 w-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                    <span className="text-sm font-bold text-white">Thể Loại Phim</span>
                  </div>
                  <div className="grid grid-cols-3 gap-0.5 p-2">
                    {categories.map((cat) => (
                      <Link
                        key={cat._id}
                        to={`/the-loai/${cat.slug}`}
                        onClick={handleDropdownItemClick}
                        className="rounded-lg px-3 py-2.5 text-[13px] text-slate-300 transition hover:bg-cyan-500/15 hover:text-cyan-300"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quốc gia dropdown */}
          <div
            className="relative"
            onMouseEnter={() => handleDropdownEnter('country')}
            onMouseLeave={handleDropdownLeave}
          >
            <button
              type="button"
              className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-[13px] font-semibold tracking-wide text-slate-300 transition hover:bg-white/10 hover:text-white"
              onClick={() => setOpenDropdown(openDropdown === 'country' ? null : 'country')}
            >
              Quốc gia
              <svg className={`h-3 w-3 transition-transform ${openDropdown === 'country' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {openDropdown === 'country' && (
              <div
                className="absolute left-1/2 top-full -translate-x-1/2 pt-2"
                onMouseEnter={() => handleDropdownEnter('country')}
                onMouseLeave={handleDropdownLeave}
              >
                <div className="max-h-[70vh] w-[520px] overflow-y-auto rounded-xl border border-white/10 bg-slate-900/95 shadow-2xl shadow-black/50 backdrop-blur-xl">
                  <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
                    <svg className="h-4 w-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span className="text-sm font-bold text-white">Quốc Gia</span>
                  </div>
                  <div className="grid grid-cols-3 gap-0.5 p-2">
                    {countries.map((c) => (
                      <Link
                        key={c._id}
                        to={`/quoc-gia/${c.slug}`}
                        onClick={handleDropdownItemClick}
                        className="rounded-lg px-3 py-2.5 text-[13px] text-slate-300 transition hover:bg-emerald-500/15 hover:text-emerald-300"
                      >
                        {c.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Search - compact */}
        <form
          className="flex w-full items-center gap-2 md:max-w-xs"
          onSubmit={(e) => {
            e.preventDefault()
            void handleSubmit()
          }}
        >
          <div className="relative w-full">
            <svg className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tìm kiếm thông tin phim..."
              className="h-9 w-full rounded-lg border border-slate-700/50 bg-slate-900/60 pl-9 pr-3 text-xs text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/20"
            />
          </div>

          <button
            type="submit"
            className="h-9 shrink-0 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 px-4 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 transition hover:shadow-cyan-500/30 hover:brightness-110 disabled:opacity-50"
            disabled={isSearching}
          >
            {isSearching ? '...' : 'Tìm'}
          </button>

          {hasSearchResults && onClearSearch ? (
            <button
              type="button"
              onClick={onClearSearch}
              className="h-9 shrink-0 rounded-lg border border-slate-700 px-2.5 text-xs font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white"
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
        <nav className="border-t border-slate-800/50 bg-slate-950/95 px-4 pb-4 pt-2 lg:hidden" style={{ fontFamily: "'Syne', sans-serif" }}>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-slate-800/80 hover:text-white"
            >
              {item.label}
            </Link>
          ))}

          {/* Mobile Thể loại */}
          <div className="mt-2 border-t border-slate-800/50 pt-2">
            <p className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-500">Thể loại</p>
            <div className="grid grid-cols-2 gap-0.5">
              {categories.map((cat) => (
                <Link
                  key={cat._id}
                  to={`/the-loai/${cat.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-cyan-500/15 hover:text-cyan-300"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Quốc gia */}
          <div className="mt-2 border-t border-slate-800/50 pt-2">
            <p className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-500">Quốc gia</p>
            <div className="grid grid-cols-2 gap-0.5">
              {countries.map((c) => (
                <Link
                  key={c._id}
                  to={`/quoc-gia/${c.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-emerald-500/15 hover:text-emerald-300"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      )}
    </header>
  )
}
