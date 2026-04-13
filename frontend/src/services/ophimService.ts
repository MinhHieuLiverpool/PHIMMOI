import { API_BASE_URL, FALLBACK_POSTER } from '../config/constants'
import type { ApiEnvelope, HomeData, ListData, MovieDetailData } from '../type/api'
import { getJson } from './apiClient'

function unwrapData<T>(payload: unknown): T {
  const envelope = payload as ApiEnvelope<T>
  return envelope.data
}

export function resolvePosterUrl(cdnBase: string, imagePath?: string): string {
  if (!imagePath) {
    return FALLBACK_POSTER
  }

  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }

  const base = cdnBase.endsWith('/') ? cdnBase.slice(0, -1) : cdnBase
  // OPhim API returns just filenames like "movie-thumb.jpg"
  // The actual CDN path needs /uploads/movies/ prefix
  const path = imagePath.startsWith('/') ? imagePath : `/uploads/movies/${imagePath}`
  return `${base}${path}`
}

export async function fetchHomeData(): Promise<HomeData> {
  const result = await getJson<unknown>(`${API_BASE_URL}/home`)
  return unwrapData<HomeData>(result.data)
}

export async function fetchListData(slug: string, page = 1): Promise<ListData> {
  const result = await getJson<unknown>(`${API_BASE_URL}/danh-sach/${slug}?page=${page}`)
  return unwrapData<ListData>(result.data)
}

export async function searchMovies(keyword: string, page = 1): Promise<ListData> {
  const encodedKeyword = encodeURIComponent(keyword.trim())
  const result = await getJson<unknown>(
    `${API_BASE_URL}/tim-kiem?keyword=${encodedKeyword}&page=${page}`,
  )
  return unwrapData<ListData>(result.data)
}

/**
 * Fetch movie detail. OPhim API v1 returns:
 * { status, message, data: { item: { ...movieFields, episodes: [...] }, APP_DOMAIN_CDN_IMAGE } }
 * Episodes are NESTED inside data.item, not at data level.
 */
export async function fetchMovieDetail(slug: string): Promise<{
  movie: MovieDetailData['item']
  episodes: MovieDetailData['episodes']
  cdnBase: string
}> {
  const encodedSlug = encodeURIComponent(slug)
  const result = await getJson<unknown>(`${API_BASE_URL}/phim/${encodedSlug}`)

  // Unwrap the envelope: { status, message, data }
  const data = unwrapData<{
    item: MovieDetailData['item'] & { episodes?: MovieDetailData['episodes'] }
    APP_DOMAIN_CDN_IMAGE?: string
  }>(result.data)

  const item = data.item
  // Episodes are nested inside item in OPhim v1 API
  const episodes = item?.episodes ?? []

  return {
    movie: item,
    episodes,
    cdnBase: data.APP_DOMAIN_CDN_IMAGE || 'https://img.ophim.live',
  }
}

export async function fetchCategoryList(): Promise<unknown> {
  const result = await getJson<unknown>(`${API_BASE_URL}/the-loai`)
  return result.data
}

export async function fetchCountryList(): Promise<unknown> {
  const result = await getJson<unknown>(`${API_BASE_URL}/quoc-gia`)
  return result.data
}

export async function fetchCategoryMovies(slug: string, page = 1): Promise<ListData> {
  const result = await getJson<unknown>(`${API_BASE_URL}/the-loai/${slug}?page=${page}`)
  return unwrapData<ListData>(result.data)
}

export async function fetchCountryMovies(slug: string, page = 1): Promise<ListData> {
  const result = await getJson<unknown>(`${API_BASE_URL}/quoc-gia/${slug}?page=${page}`)
  return unwrapData<ListData>(result.data)
}
