import { Minus, Plus } from 'lucide-react'

import { cn } from '@/lib/utils'

const btn =
  'flex size-11 items-center justify-center rounded-full transition-colors hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-transparent'

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  className,
}: {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  className?: string
}) {
  return (
    <div className={cn('glass inline-flex items-center rounded-full', className)}>
      <button type="button" className={btn} aria-label="Decrease quantity" disabled={value <= min} onClick={() => onChange(value - 1)}>
        <Minus className="size-4" />
      </button>
      <span className="w-8 text-center text-sm font-bold tabular-nums" aria-live="polite">
        {value}
      </span>
      <button type="button" className={btn} aria-label="Increase quantity" disabled={value >= max} onClick={() => onChange(value + 1)}>
        <Plus className="size-4" />
      </button>
    </div>
  )
}
