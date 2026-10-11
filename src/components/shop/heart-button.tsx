import { Heart } from 'lucide-react'

import { useFavorites } from '@/context/favorites-context'
import { cn } from '@/lib/utils'

export function HeartButton({
  productId,
  title,
  className,
}: {
  productId: number
  title: string
  className?: string
}) {
  const { has, toggle } = useFavorites()
  const active = has(productId)
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggle(productId)
      }}
      aria-pressed={active}
      aria-label={active ? `Remove ${title} from favorites` : `Add ${title} to favorites`}
      className={cn(
        'flex size-11 items-center justify-center rounded-full bg-background/90 shadow-sm backdrop-blur transition hover:scale-105 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none',
        className,
      )}
    >
      <Heart
        className={cn('size-5 transition-colors', active ? 'fill-rose-500 text-rose-500' : 'text-foreground/70')}
      />
    </button>
  )
}
