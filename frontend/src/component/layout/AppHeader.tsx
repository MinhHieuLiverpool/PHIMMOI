import { APP_BRAND, NAV_ITEMS } from '../../config/constants'

type AppHeaderProps = {
  searchKeyword: string
  onSearchKeywordChange: (value: string) => void
  onSearch: () => Promise<void>
  onClearSearch: () => void
  isSearching: boolean
  hasSearchResults: boolean
}

export function AppHeader({
  searchKeyword,
  onSearchKeywordChange,
  onSearch,
  onClearSearch,
  isSearching,
  hasSearchResults,
}: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-4 px-4 py-4 md:px-8">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 text-base font-black text-slate-900">
            P
          </div>
          <div>
            <p className="text-lg font-extrabold tracking-wide text-white">{APP_BRAND}</p>
            <p className="text-xs text-slate-400">Watch everywhere</p>
          </div>
        </div>

        <nav className="hidden items-center gap-4 text-sm text-slate-300 lg:flex">
          {NAV_ITEMS.map((item) => (
            <button
              key={item}
              type="button"
              className="rounded-lg px-3 py-1.5 transition hover:bg-slate-800 hover:text-white"
            >
              {item}
            </button>
          ))}
        </nav>

        <form
          className="ml-auto flex w-full items-center gap-2 md:max-w-md"
          onSubmit={(event) => {
            event.preventDefault()
            void onSearch()
          }}
        >
          <input
            value={searchKeyword}
            onChange={(event) => onSearchKeywordChange(event.target.value)}
            placeholder="Tim phim, dien vien, dao dien..."
            className="h-10 w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-400"
          />

          <button
            type="submit"
            className="h-10 shrink-0 rounded-xl bg-cyan-400 px-4 text-sm font-bold text-slate-900 transition hover:bg-cyan-300"
            disabled={isSearching}
          >
            {isSearching ? 'Dang tim...' : 'Tim'}
          </button>

          {hasSearchResults ? (
            <button
              type="button"
              onClick={onClearSearch}
              className="h-10 shrink-0 rounded-xl border border-slate-700 px-3 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:text-white"
            >
              Xoa
            </button>
          ) : null}
        </form>
      </div>
    </header>
  )
}
