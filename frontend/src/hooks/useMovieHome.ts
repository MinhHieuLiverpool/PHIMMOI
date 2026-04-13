import { useEffect, useMemo, useState } from 'react'

import { HOME_SECTIONS } from '../config/constants'
import type { MovieItem, MovieSectionData } from '../type/api'
import { fetchHomeData, fetchListData, searchMovies } from '../services/ophimService'

export function useMovieHome() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState('')

  const [cdnImageBaseUrl, setCdnImageBaseUrl] = useState('')
  const [featuredMovies, setFeaturedMovies] = useState<MovieItem[]>([])
  const [sections, setSections] = useState<MovieSectionData[]>([])
  const [searchKeyword, setSearchKeyword] = useState('')
  const [searchResults, setSearchResults] = useState<MovieItem[]>([])
  const [itemsUpdatedToday, setItemsUpdatedToday] = useState<number | null>(null)

  useEffect(() => {
    const loadHomePage = async () => {
      try {
        setError('')

        const homeData = await fetchHomeData()
        const homeItems = homeData.items ?? []

        setCdnImageBaseUrl(homeData.APP_DOMAIN_CDN_IMAGE)
        setFeaturedMovies(homeItems.slice(0, 6))
        setItemsUpdatedToday(homeData.params?.itemsUpdateInDay ?? null)

        const sectionResponses = await Promise.allSettled(
          HOME_SECTIONS.map(async (sectionConfig) => {
            const sectionData = await fetchListData(sectionConfig.slug)

            return {
              key: sectionConfig.key,
              title: sectionConfig.title,
              slug: sectionConfig.slug,
              items: sectionData.items?.slice(0, 18) ?? [],
            }
          }),
        )

        const loadedSections = sectionResponses
          .filter((result) => result.status === 'fulfilled')
          .map((result) => result.value)
          .filter((section) => section.items.length > 0)

        if (loadedSections.length > 0) {
          setSections(loadedSections)
          return
        }

        setSections([
          {
            key: 'home-fallback',
            title: 'Đề cử trên trang chủ',
            items: homeItems.slice(0, 20),
          },
        ])
      } catch {
        setError('Không tải được dữ liệu phim. Vui lòng kiểm tra backend.')
      } finally {
        setIsLoading(false)
      }
    }

    void loadHomePage()
  }, [])

  const handleSearch = async () => {
    const normalizedKeyword = searchKeyword.trim()

    if (!normalizedKeyword) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    setError('')

    try {
      const searchData = await searchMovies(normalizedKeyword)
      setSearchResults(searchData.items ?? [])
    } catch {
      setError('Không tìm kiếm được phim. Thử lại sau.')
    } finally {
      setIsSearching(false)
    }
  }

  const clearSearch = () => {
    setSearchResults([])
    setSearchKeyword('')
  }

  const displayedSections = useMemo(() => {
    if (searchResults.length === 0) {
      return sections
    }

    return [
      {
        key: 'search-results',
        title: `Kết quả tìm kiếm (${searchResults.length})`,
        items: searchResults,
      },
    ]
  }, [sections, searchResults])

  return {
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
    hasSearchResults: searchResults.length > 0,
    itemsUpdatedToday,
  }
}
