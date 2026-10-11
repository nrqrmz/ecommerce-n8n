import { motion } from 'motion/react'

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

/** Fixed, slowly drifting color glows behind the whole app, plus film grain. */
export function AuroraBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute -top-40 -left-32 size-[34rem] rounded-full bg-glow-1/35 blur-[110px]"
        animate={{ x: [0, 80, -20, 0], y: [0, 60, 120, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/3 -right-40 size-[30rem] rounded-full bg-glow-2/25 blur-[120px]"
        animate={{ x: [0, -90, 30, 0], y: [0, -40, 60, 0] }}
        transition={{ duration: 32, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-48 left-1/4 size-[28rem] rounded-full bg-glow-3/20 blur-[120px]"
        animate={{ x: [0, 60, -60, 0], y: [0, -50, 0, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="absolute inset-0 opacity-[0.07] mix-blend-overlay" style={{ backgroundImage: GRAIN }} />
    </div>
  )
}
