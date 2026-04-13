import { Link } from 'react-router-dom'
import { APP_BRAND, NAV_ITEMS } from '../../config/constants'

const POPULAR_CATEGORIES = [
  { name: 'Hành Động', slug: 'hanh-dong' },
  { name: 'Tình Cảm', slug: 'tinh-cam' },
  { name: 'Hài Hước', slug: 'hai-huoc' },
  { name: 'Kinh Dị', slug: 'kinh-di' },
  { name: 'Cổ Trang', slug: 'co-trang' },
  { name: 'Viễn Tưởng', slug: 'vien-tuong' },
]

const POPULAR_COUNTRIES = [
  { name: 'Hàn Quốc', slug: 'han-quoc' },
  { name: 'Trung Quốc', slug: 'trung-quoc' },
  { name: 'Nhật Bản', slug: 'nhat-ban' },
  { name: 'Âu Mỹ', slug: 'au-my' },
  { name: 'Thái Lan', slug: 'thai-lan' },
  { name: 'Việt Nam', slug: 'viet-nam' },
]

export function AppFooter() {
  return (
    <footer className="relative mt-16 overflow-hidden">
      {/* Top gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

      {/* Decorative glow */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-64 w-96 rounded-full bg-cyan-500/5 blur-3xl" />

      <div className="relative bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900/80">
        {/* Main footer content */}
        <div className="mx-auto w-full max-w-7xl px-4 pt-16 pb-8 md:px-8">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

            {/* Brand column */}
            <div className="lg:col-span-1 space-y-5">
              <Link to="/" className="inline-flex items-center gap-3 group">
                <img
                  src="/logo.png"
                  alt="Mê Phim"
                  className="h-12 w-auto object-contain transition-transform group-hover:scale-105"
                />
              </Link>
              <p className="text-sm leading-relaxed text-slate-400 max-w-xs">
                Trải nghiệm xem phim trực tuyến miễn phí với chất lượng Full HD, Vietsub & Thuyết minh.
                Cập nhật liên tục phim mới nhất.
              </p>
              {/* Social icons */}
              <div className="flex items-center gap-3 pt-2">
                <a href="#" className="group flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-slate-400 transition-all hover:bg-cyan-500/20 hover:text-cyan-400 hover:scale-110">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                </a>
                <a href="#" className="group flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-slate-400 transition-all hover:bg-pink-500/20 hover:text-pink-400 hover:scale-110">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                </a>
                <a href="#" className="group flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-slate-400 transition-all hover:bg-sky-500/20 hover:text-sky-400 hover:scale-110">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
                </a>
                <a href="#" className="group flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-slate-400 transition-all hover:bg-red-500/20 hover:text-red-400 hover:scale-110">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                </a>
              </div>
            </div>

            {/* Navigation column */}
            <div>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-500" style={{ fontFamily: "'Syne', sans-serif" }}>
                Danh mục
              </h4>
              <nav className="flex flex-col gap-2.5">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="group flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
                  >
                    <span className="h-1 w-1 rounded-full bg-slate-600 transition-all group-hover:w-2 group-hover:bg-cyan-400" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Categories column */}
            <div>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-500" style={{ fontFamily: "'Syne', sans-serif" }}>
                Thể loại phổ biến
              </h4>
              <nav className="flex flex-col gap-2.5">
                {POPULAR_CATEGORIES.map((cat) => (
                  <Link
                    key={cat.slug}
                    to={`/the-loai/${cat.slug}`}
                    className="group flex items-center gap-2 text-sm text-slate-400 transition hover:text-cyan-400"
                  >
                    <span className="h-1 w-1 rounded-full bg-slate-600 transition-all group-hover:w-2 group-hover:bg-cyan-400" />
                    {cat.name}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Countries column */}
            <div>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-500" style={{ fontFamily: "'Syne', sans-serif" }}>
                Quốc gia nổi bật
              </h4>
              <nav className="flex flex-col gap-2.5">
                {POPULAR_COUNTRIES.map((country) => (
                  <Link
                    key={country.slug}
                    to={`/quoc-gia/${country.slug}`}
                    className="group flex items-center gap-2 text-sm text-slate-400 transition hover:text-emerald-400"
                  >
                    <span className="h-1 w-1 rounded-full bg-slate-600 transition-all group-hover:w-2 group-hover:bg-emerald-400" />
                    {country.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-14 flex flex-col items-center gap-4 border-t border-white/5 pt-8 md:flex-row md:justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span>© {new Date().getFullYear()}</span>
              <span className="font-bold text-slate-500">{APP_BRAND}</span>
              <span className="text-slate-700">•</span>
              <span>Chỉ dùng cho mục đích học tập</span>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                Đang hoạt động
              </span>
              <span className="text-slate-700">•</span>
              <span>React + FastAPI</span>
              <span className="text-slate-700">•</span>
              <span>OPhim API</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
