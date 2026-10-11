import { useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import confetti from 'canvas-confetti'

import { useCart } from '@/context/cart-context'
import { STORE_NAME } from '@/lib/brand'
import { formatPrice } from '@/lib/utils'

const COLORS = ['#818cf8', '#a78bfa', '#c084fc', '#67e8f9', '#f0abfc', '#ffffff']

function celebrate() {
  const base = { colors: COLORS, ticks: 260, zIndex: 60, disableForReducedMotion: true }
  confetti({ ...base, particleCount: 90, spread: 75, startVelocity: 48, origin: { x: 0.5, y: 0.35 } })
  setTimeout(() => {
    confetti({ ...base, particleCount: 60, angle: 60, spread: 60, origin: { x: 0, y: 0.7 } })
    confetti({ ...base, particleCount: 60, angle: 120, spread: 60, origin: { x: 1, y: 0.7 } })
  }, 250)
}

function AnimatedCheck() {
  return (
    <div className="relative mx-auto size-24">
      <motion.div
        className="absolute inset-0 rounded-full bg-emerald-400/30 blur-xl"
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1.3, opacity: 1 }}
        transition={{ duration: 0.8 }}
      />
      <svg viewBox="0 0 96 96" className="relative size-24" aria-hidden>
        <motion.circle
          cx="48"
          cy="48"
          r="42"
          fill="none"
          stroke="rgb(52 211 153)"
          strokeWidth="5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
        <motion.path
          d="M30 50 L43 62 L67 36"
          fill="none"
          stroke="rgb(52 211 153)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.4, delay: 0.5, ease: 'easeOut' }}
        />
      </svg>
    </div>
  )
}

export default function OrderConfirmedPage() {
  const { lastOrder } = useCart()
  const reduce = useReducedMotion()

  useEffect(() => {
    if (!lastOrder || reduce) return
    const t = setTimeout(celebrate, 350)
    return () => {
      clearTimeout(t)
      confetti.reset()
    }
  }, [lastOrder, reduce])

  if (!lastOrder) return <Navigate to="/" replace />
  const date = new Date(lastOrder.date)

  return (
    <div className="mx-auto max-w-md px-4 py-12 text-center md:py-16">
      <AnimatedCheck />
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-6 font-display text-3xl font-extrabold tracking-tight md:text-4xl"
      >
        Payment <span className="text-gradient">complete</span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.75 }}
        className="mt-2 text-muted-foreground"
      >
        This was a simulated payment, so nothing was charged.
      </motion.p>

      {/* Receipt "printing" out of a slot */}
      <div className="relative mt-10">
        <div className="relative z-10 mx-auto h-3 w-[calc(100%+1rem)] -translate-x-2 rounded-full bg-white/15 shadow-[inset_0_2px_6px_rgb(0_0_0/0.6)]" />
        <div className="-mt-1.5 overflow-hidden px-2 pb-6">
          <motion.div
            data-testid="receipt"
            initial={{ y: '-102%' }}
            animate={{ y: 0 }}
            transition={{ duration: 1.6, delay: 0.9, ease: [0.3, 0.7, 0.4, 1] }}
            className="relative bg-[#f6f5fb] px-5 pt-6 pb-8 text-left font-mono text-[13px] text-slate-800 shadow-2xl [mask-image:linear-gradient(transparent,black_12px)] [clip-path:polygon(0_0,100%_0,100%_calc(100%-8px),95%_100%,90%_calc(100%-8px),85%_100%,80%_calc(100%-8px),75%_100%,70%_calc(100%-8px),65%_100%,60%_calc(100%-8px),55%_100%,50%_calc(100%-8px),45%_100%,40%_calc(100%-8px),35%_100%,30%_calc(100%-8px),25%_100%,20%_calc(100%-8px),15%_100%,10%_calc(100%-8px),5%_100%,0_calc(100%-8px))]"
          >
            <p className="text-center font-display text-base font-bold tracking-widest">{STORE_NAME.toUpperCase()}</p>
            <p className="text-center text-xs text-slate-500">
              {date.toLocaleDateString()} · {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
            <p className="mt-1 text-center text-xs text-slate-500">
              Order <span className="font-semibold text-slate-900">{lastOrder.id}</span>
            </p>
            <div className="my-3 border-t border-dashed border-slate-400" />
            <ul className="space-y-1.5">
              {lastOrder.lines.map(({ product, quantity }) => (
                <li key={product.id} className="flex justify-between gap-3">
                  <span className="min-w-0 truncate">
                    {quantity} × {product.title}
                  </span>
                  <span className="shrink-0 tabular-nums">{formatPrice(product.price * quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="my-3 border-t border-dashed border-slate-400" />
            <div className="flex justify-between text-base font-bold">
              <span>TOTAL</span>
              <span className="tabular-nums">{formatPrice(lastOrder.total)}</span>
            </div>
            <p className="mt-4 text-center text-xs text-slate-500">Thank you for shopping with us ✦</p>
          </motion.div>
        </div>
      </div>

      <Link
        to="/products"
        className="mt-4 inline-flex h-12 items-center rounded-full bg-gradient-to-r from-glow-1 to-glow-2 px-8 font-semibold text-white shadow-[0_0_30px_var(--glow-1)]"
      >
        Continue shopping
      </Link>
    </div>
  )
}
