import { useRef } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'

import { useMediaQuery } from '@/hooks/use-media-query'
import { cn } from '@/lib/utils'

const MAX_TILT = 7

/**
 * Glass card with a glow that follows the pointer (or finger) and, on desktop, a soft 3D tilt.
 */
export function InteractiveCard({ className, children }: { className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)')
  const tilt = finePointer && !reduce
  const rx = useSpring(useMotionValue(0), { stiffness: 200, damping: 18 })
  const ry = useSpring(useMotionValue(0), { stiffness: 200, damping: 18 })

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    el.style.setProperty('--x', `${px * 100}%`)
    el.style.setProperty('--y', `${py * 100}%`)
    if (tilt) {
      rx.set((0.5 - py) * MAX_TILT * 2)
      ry.set((px - 0.5) * MAX_TILT * 2)
    }
  }

  function onLeave() {
    rx.set(0)
    ry.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerDown={onMove}
      onPointerLeave={onLeave}
      style={tilt ? { rotateX: rx, rotateY: ry, transformPerspective: 900 } : undefined}
      className={cn('group/card glass relative isolate overflow-hidden rounded-3xl', className)}
    >
      <div className="spotlight pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100 group-active/card:opacity-100" />
      {children}
    </motion.div>
  )
}
