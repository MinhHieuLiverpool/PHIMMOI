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
    featuredMovie,
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

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 md:px-8 md:py-8">
        <HeroBanner
          movie={featuredMovie}
          cdnImageBaseUrl={cdnImageBaseUrl}
          itemsUpdatedToday={itemsUpdatedToday}
        />

        {error ? (
          <div className="rounded-xl border border-rose-700/60 bg-rose-900/30 p-4 text-sm font-semibold text-rose-200">
            {error}
          </div>
        ) : null}

        {isLoading ? <LoadingState /> : null}

        {!isLoading
          ? displayedSections.map((section) => (
              <MovieSection
                key={section.key}
                title={section.title}
                items={section.items}
                cdnImageBaseUrl={cdnImageBaseUrl}
              />
            ))
          : null}
      </main>

      <AppFooter />
    </div>
  )
}
