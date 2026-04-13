import { AppFooter } from '../component/layout/AppFooter'
import { AppHeader } from '../component/layout/AppHeader'
import { HeroBanner } from '../component/movie/HeroBanner'
import { LoadingState } from '../component/movie/LoadingState'
import { MovieSection } from '../component/movie/MovieSection'
import { useMovieHome } from '../hooks/useMovieHome'

export function HomePage() {
  const {
    isLoading,
    isSearching,
    error,
    cdnImageBaseUrl,
    featuredMovies,
    displayedSections,
    searchKeyword,
    setSearchKeyword,
    handleSearch,
    clearSearch,
    hasSearchResults,
    itemsUpdatedToday,
  } = useMovieHome()

  return (
    <div className="min-h-screen bg-slate-950">
      <AppHeader
        searchKeyword={searchKeyword}
        onSearchKeywordChange={setSearchKeyword}
        onSearch={handleSearch}
        onClearSearch={clearSearch}
        isSearching={isSearching}
        hasSearchResults={hasSearchResults}
      />

      {/* Hero banner - full width */}
      {!hasSearchResults && (
        <HeroBanner
          movies={featuredMovies}
          cdnImageBaseUrl={cdnImageBaseUrl}
          itemsUpdatedToday={itemsUpdatedToday}
        />
      )}

      {/* Error / Loading */}
      {error && (
        <div className="mx-auto max-w-7xl px-4 pt-6 md:px-8">
          <div className="rounded-xl border border-rose-700/60 bg-rose-900/20 p-4 text-sm font-semibold text-rose-200 backdrop-blur">
            {error}
          </div>
        </div>
      )}

      {isLoading && (
        <div className="mx-auto max-w-7xl px-4 pt-8 md:px-8">
          <LoadingState />
        </div>
      )}

      {/* Movie sections - full width for auto-scroll */}
      <main className="flex flex-col gap-10 py-8">
        {!isLoading
          ? displayedSections.map((section, idx) => (
              <MovieSection
                key={section.key}
                title={section.title}
                items={section.items}
                cdnImageBaseUrl={cdnImageBaseUrl}
                slug={'slug' in section ? (section as { slug?: string }).slug : undefined}
                reverse={idx % 2 === 1}
              />
            ))
          : null}
      </main>

      <AppFooter />
    </div>
  )
}
