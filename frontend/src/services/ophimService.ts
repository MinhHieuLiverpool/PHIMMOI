import { API_BASE_URL, FALLBACK_POSTER } from '../config/constants'
import type { ApiEnvelope, HealthResponse, HomeData, ListData } from '../type/api'
import { getJson } from './apiClient'

export async function fetchBackendHealth(): Promise<HealthResponse> {
  const result = await getJson<HealthResponse>(`${API_BASE_URL}/health`)
  return result.data
}

function unwrapData<T>(payload: unknown): T {
  const envelope = payload as ApiEnvelope<T>
  return envelope.data
}

export function resolvePosterUrl(cdnBase: string, imagePath?: string): string {
  if (!imagePath) {
    return FALLBACK_POSTER
  }

  let absoluteUrl = imagePath

  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    absoluteUrl = imagePath
  } else {
    const base = cdnBase.endsWith('/') ? cdnBase.slice(0, -1) : cdnBase
    const path = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath
    absoluteUrl = `${base}/${path}`
  }

  return `${API_BASE_URL}/image?url=${encodeURIComponent(absoluteUrl)}`
}

export async function fetchHomeData(): Promise<HomeData> {
  const result = await getJson<unknown>(`${API_BASE_URL}/home`)
  return unwrapData<HomeData>(result.data)
}

export async function fetchListData(slug: string): Promise<ListData> {
  const result = await getJson<unknown>(`${API_BASE_URL}/danh-sach/${slug}`)
  return unwrapData<ListData>(result.data)
}

export async function searchMovies(keyword: string): Promise<ListData> {
  const encodedKeyword = encodeURIComponent(keyword.trim())
  const result = await getJson<unknown>(`${API_BASE_URL}/tim-kiem?keyword=${encodedKeyword}`)
  return unwrapData<ListData>(result.data)
}

export async function fetchMovieDetail(slug: string): Promise<unknown> {
  const encodedSlug = encodeURIComponent(slug)
  const result = await getJson<unknown>(`${API_BASE_URL}/phim/${encodedSlug}`)
  return result.data
}
