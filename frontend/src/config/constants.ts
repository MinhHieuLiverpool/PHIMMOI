import type { MovieSectionConfig } from '../type/api'

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api'

export const APP_BRAND = 'PHIMMOI'
export const DEFAULT_SEARCH_KEYWORD = ''

export const NAV_ITEMS = [
  { label: 'Trang chủ', path: '/' },
  { label: 'Phim lẻ', path: '/danh-sach/phim-le' },
  { label: 'Phim bộ', path: '/danh-sach/phim-bo' },
  { label: 'Hoạt hình', path: '/danh-sach/hoat-hinh' },
  { label: 'TV Shows', path: '/danh-sach/tv-shows' },
]

export const HOME_SECTIONS: MovieSectionConfig[] = [
  { key: 'latest', title: 'Phim mới cập nhật', slug: 'phim-moi-cap-nhat' },
  { key: 'single', title: 'Phim lẻ hot', slug: 'phim-le' },
  { key: 'series', title: 'Phim bộ nổi bật', slug: 'phim-bo' },
  { key: 'tvshows', title: 'TV Shows', slug: 'tv-shows' },
  { key: 'anime', title: 'Hoạt hình đề cử', slug: 'hoat-hinh' },
]

export const FALLBACK_POSTER =
  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=80'
