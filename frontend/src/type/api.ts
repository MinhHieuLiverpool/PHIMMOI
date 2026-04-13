export interface ApiEnvelope<T> {
  status: string
  message: string
  data: T
}

export interface Pagination {
  totalItems: number
  totalItemsPerPage: number
  currentPage: number
  pageRanges: number
}

export interface MovieTaxonomy {
  id: string
  name: string
  slug: string
}

export interface MovieMetaSource {
  id: string | number | null
  vote_average: number
  vote_count: number
  type?: string
  season?: number | null
}

export interface MovieItem {
  _id: string
  name: string
  origin_name: string
  alternative_names?: string[]
  slug: string
  type: string
  thumb_url: string
  poster_url?: string
  time: string
  episode_current: string
  quality: string
  lang: string
  year: number
  category: MovieTaxonomy[]
  country: MovieTaxonomy[]
  modified?: { time: string }
  tmdb?: MovieMetaSource
  imdb?: MovieMetaSource
  sub_docquyen?: boolean
}

export interface HomeData {
  APP_DOMAIN_CDN_IMAGE: string
  APP_DOMAIN_FRONTEND: string
  items: MovieItem[]
  itemsSportsVideos?: MovieItem[]
  params: {
    pagination: Pagination
    itemsUpdateInDay: number
  }
  seoOnPage?: unknown
  type_list?: string
}

export interface ListData {
  APP_DOMAIN_CDN_IMAGE: string
  APP_DOMAIN_FRONTEND: string
  titlePage?: string
  items: MovieItem[]
  params: {
    type_slug: string
    pagination: Pagination
    filterCategory: string[]
    filterCountry: string[]
    filterYear: string
  }
  seoOnPage?: unknown
}

export interface MovieSectionConfig {
  key: string
  title: string
  slug: string
}

export interface MovieSectionData {
  key: string
  title: string
  items: MovieItem[]
}

// Movie Detail types
export interface EpisodeServer {
  server_name: string
  server_data: EpisodeItem[]
}

export interface EpisodeItem {
  name: string
  slug: string
  filename: string
  link_embed: string
  link_m3u8: string
}

export interface MovieDetailData {
  seoOnPage?: unknown
  item: MovieDetailItem
  episodes: EpisodeServer[]
}

export interface MovieDetailItem {
  _id: string
  name: string
  origin_name: string
  slug: string
  type: string
  thumb_url: string
  poster_url?: string
  time: string
  episode_current: string
  episode_total: string
  quality: string
  lang: string
  year: number
  content: string
  category: MovieTaxonomy[]
  country: MovieTaxonomy[]
  actor?: string[]
  director?: string[]
  tmdb?: MovieMetaSource
  imdb?: MovieMetaSource
  status?: string
  sub_docquyen?: boolean
  trailer_url?: string
  showtimes?: string
  notify?: string
  view?: number
}
