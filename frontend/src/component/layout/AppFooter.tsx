import { Link } from 'react-router-dom'
import { APP_BRAND, NAV_ITEMS } from '../../config/constants'

export function AppFooter() {
  return (
    <footer className="border-t border-slate-800/50 bg-slate-950">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 md:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 text-base font-black text-slate-900">
                P
              </div>
              <p className="text-lg font-extrabold text-white">{APP_BRAND}</p>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Xem phim online miễn phí chất lượng cao.<br />
              Vietsub, Thuyết minh, Full HD.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-400">Danh mục</h4>
            <nav className="flex flex-col gap-2">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="text-sm text-slate-500 transition hover:text-cyan-400"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Info */}
          <div>
            <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-400">Thông tin</h4>
            <div className="space-y-2 text-sm text-slate-500">
              <p>Được xây dựng với React + FastAPI</p>
              <p>Nguồn dữ liệu: OPhim API</p>
              <p className="text-xs text-slate-600 pt-2">© 2026 {APP_BRAND}. Chỉ dùng cho mục đích học tập.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
