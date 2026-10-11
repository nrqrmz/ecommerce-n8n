import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'

export function Pagination({
  page,
  pageCount,
  onChange,
}: {
  page: number
  pageCount: number
  onChange: (page: number) => void
}) {
  if (pageCount <= 1) return null
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === pageCount || Math.abs(p - page) <= 1,
  )
  return (
    <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Pagination">
      <Button variant="outline" className="h-11" disabled={page <= 1} onClick={() => onChange(page - 1)}>
        <ChevronLeft /> Prev
      </Button>
      <span className="px-2 text-sm md:hidden">
        Page {page} of {pageCount}
      </span>
      <div className="hidden items-center gap-1 md:flex">
        {pages.map((p, i) => (
          <span key={p} className="flex items-center gap-1">
            {i > 0 && p - pages[i - 1] > 1 && <span className="px-1">…</span>}
            <Button
              variant={p === page ? 'default' : 'outline'}
              className="size-11"
              aria-current={p === page ? 'page' : undefined}
              onClick={() => onChange(p)}
            >
              {p}
            </Button>
          </span>
        ))}
      </div>
      <Button
        variant="outline"
        className="h-11"
        disabled={page >= pageCount}
        onClick={() => onChange(page + 1)}
      >
        Next <ChevronRight />
      </Button>
    </nav>
  )
}
