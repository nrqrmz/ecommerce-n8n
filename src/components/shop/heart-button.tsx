import { useId } from 'react'
import { AnimatePresence, motion } from 'motion/react'
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
  const gradientId = useId()
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.8 }}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggle(productId)
      }}
      aria-pressed={active}
      aria-label={active ? `Remove ${title} from favorites` : `Add ${title} to favorites`}
      className={cn(
        'relative z-10 flex size-11 items-center justify-center rounded-full border border-white/15 bg-black/35 text-white backdrop-blur-md transition hover:bg-black/50 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none',
        className,
      )}
    >
      {/* Brand gradient (same violet to fuchsia as the add-to-cart button) for the filled heart. */}
      <svg width="0" height="0" className="absolute" aria-hidden>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" style={{ stopColor: 'var(--glow-1)' }} />
            <stop offset="100%" style={{ stopColor: 'var(--glow-2)' }} />
          </linearGradient>
        </defs>
      </svg>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={active ? 'on' : 'off'}
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.3, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 18 }}
        >
          <Heart
            className={cn('size-5', active && 'drop-shadow-[0_0_8px_var(--glow-2)]')}
            style={active ? { fill: `url(#${gradientId})`, stroke: `url(#${gradientId})` } : undefined}
          />
        </motion.span>
      </AnimatePresence>
    </motion.button>
  )
}
