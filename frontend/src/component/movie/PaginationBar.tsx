import type { Pagination } from '../../type/api'

type PaginationBarProps = {
  pagination: Pagination
  onPageChange: (page: number) => void
}

export function PaginationBar({ pagination, onPageChange }: PaginationBarProps) {
  const { totalItems, totalItemsPerPage, currentPage } = pagination
  const totalPages = Math.ceil(totalItems / totalItemsPerPage)

  if (totalPages <= 1) return null

  const pages: (number | '...')[] = []

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    pages.push(1)
    if (currentPage > 3) pages.push('...')
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i)
    }
    if (currentPage < totalPages - 2) pages.push('...')
    pages.push(totalPages)
  }

  return (
    <div className="flex items-center justify-center gap-1.5 pt-6">
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700/50 text-sm text-slate-400 transition hover:border-cyan-400/40 hover:text-cyan-300 disabled:opacity-30 disabled:pointer-events-none"
      >
        ‹
      </button>

      {pages.map((page, idx) =>
        page === '...' ? (
          <span key={`dots-${idx}`} className="px-1.5 text-slate-600">…</span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={`flex h-9 min-w-[2.25rem] items-center justify-center rounded-lg text-sm font-semibold transition ${
              page === currentPage
                ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-lg shadow-cyan-500/20'
                : 'border border-slate-700/50 text-slate-400 hover:border-cyan-400/40 hover:text-cyan-300'
            }`}
          >
            {page}
          </button>
        ),
      )}

      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700/50 text-sm text-slate-400 transition hover:border-cyan-400/40 hover:text-cyan-300 disabled:opacity-30 disabled:pointer-events-none"
      >
        ›
      </button>
    </div>
  )
}
