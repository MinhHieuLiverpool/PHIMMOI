import { useEffect, useMemo, useState } from 'react'

import {
  DEFAULT_SEARCH_KEYWORD,
  HOME_SECTIONS,
} from '../config/constants'
import type { MovieItem, MovieSectionData } from '../type/api'
import { fetchHomeData, fetchListData, searchMovies } from '../services/ophimService'

export function useMovieHome() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState('')

  const [cdnImageBaseUrl, setCdnImageBaseUrl] = useState('')
  const [featuredMovie, setFeaturedMovie] = useState<MovieItem | null>(null)
  const [sections, setSections] = useState<MovieSectionData[]>([])
  const [searchKeyword, setSearchKeyword] = useState(DEFAULT_SEARCH_KEYWORD)
  const [searchResults, setSearchResults] = useState<MovieItem[]>([])
  const [itemsUpdatedToday, setItemsUpdatedToday] = useState<number | null>(null)

  useEffect(() => {
    const loadHomePage = async () => {
      try {
        setError('')

        const homeData = await fetchHomeData()
        const homeItems = homeData.items ?? []

        setCdnImageBaseUrl(homeData.APP_DOMAIN_CDN_IMAGE)
        setFeaturedMovie(homeItems[0] ?? null)
        setItemsUpdatedToday(homeData.params?.itemsUpdateInDay ?? null)

        const sectionResponses = await Promise.allSettled(
          HOME_SECTIONS.map(async (sectionConfig) => {
            const sectionData = await fetchListData(sectionConfig.slug)

            return {
              key: sectionConfig.key,
              title: sectionConfig.title,
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
            title: 'De cu tren trang chu',
            items: homeItems.slice(0, 20),
          },
        ])
      } catch {
        setError('Khong tai duoc du lieu phim. Vui long kiem tra backend.')
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
      setError('Khong tim kiem duoc phim. Thu lai sau.')
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
        title: `Ket qua tim kiem (${searchResults.length})`,
        items: searchResults,
      },
    ]
  }, [sections, searchResults])

  return {
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
    hasSearchResults: searchResults.length > 0,
    itemsUpdatedToday,
  }
}
