import type { MovieSectionConfig } from '../type/api'

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api'

export const APP_BRAND = 'PHIMMOI'
export const DEFAULT_SEARCH_KEYWORD = 'avengers'

export const NAV_ITEMS = ['Trang chu', 'Phim le', 'Phim bo', 'Hoat hinh', 'Bang xep hang']

export const HOME_SECTIONS: MovieSectionConfig[] = [
  { key: 'latest', title: 'Phim moi cap nhat', slug: 'phim-moi-cap-nhat' },
  { key: 'single', title: 'Phim le hot', slug: 'phim-le' },
  { key: 'series', title: 'Phim bo noi bat', slug: 'phim-bo' },
  { key: 'tvshows', title: 'TV Shows', slug: 'tv-shows' },
  { key: 'anime', title: 'Hoat hinh de cu', slug: 'hoat-hinh' },
]

export const FALLBACK_POSTER =
  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=80'
