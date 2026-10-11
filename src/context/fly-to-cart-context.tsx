import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, useReducedMotion } from 'motion/react'

interface Flight {
  id: number
  src: string
  from: DOMRect
  dx: number
  dy: number
}

interface FlyState {
  /** Header cart button registers itself as the landing target. */
  setTarget: (el: HTMLElement | null) => void
  /** Animate a product image from `source` into the cart icon. */
  fly: (source: HTMLElement | null | undefined, src: string) => void
  /** Increments every time something lands, so the cart icon can bounce. */
  landed: number
}

const FlyContext = createContext<FlyState | null>(null)

function onScreen(r: DOMRect) {
  return r.width > 0 && r.bottom > 0 && r.right > 0 && r.top < innerHeight && r.left < innerWidth
}

export function FlyToCartProvider({ children }: { children: React.ReactNode }) {
  const target = useRef<HTMLElement | null>(null)
  const [flights, setFlights] = useState<Flight[]>([])
  const [landed, setLanded] = useState(0)
  const reduce = useReducedMotion()
  const nextId = useRef(0)

  const setTarget = useCallback((el: HTMLElement | null) => {
    target.current = el
  }, [])

  const fly = useCallback(
    (source: HTMLElement | null | undefined, src: string) => {
      const to = target.current?.getBoundingClientRect()
      const from = source?.getBoundingClientRect()
      if (reduce || !src || !from || !to || !onScreen(from) || !onScreen(to)) {
        setLanded((n) => n + 1)
        return
      }
      const size = Math.min(from.width, from.height)
      const dx = to.left + to.width / 2 - (from.left + from.width / 2)
      const dy = to.top + to.height / 2 - (from.top + from.height / 2)
      const box = new DOMRect(from.left + (from.width - size) / 2, from.top + (from.height - size) / 2, size, size)
      nextId.current += 1
      setFlights((f) => [...f, { id: nextId.current, src, from: box, dx, dy }])
    },
    [reduce],
  )

  const finish = useCallback((id: number) => {
    setFlights((f) => f.filter((x) => x.id !== id))
    setLanded((n) => n + 1)
  }, [])

  const value = useMemo(() => ({ setTarget, fly, landed }), [setTarget, fly, landed])

  return (
    <FlyContext.Provider value={value}>
      {children}
      {createPortal(
        flights.map((f) => (
          <motion.div
            key={f.id}
            data-testid="fly-to-cart"
            aria-hidden
            className="pointer-events-none fixed z-[100] overflow-hidden rounded-2xl bg-[radial-gradient(circle_at_50%_30%,#fff,#dcd9f0)] shadow-[0_0_40px_var(--glow-1)]"
            style={{ left: f.from.left, top: f.from.top, width: f.from.width, height: f.from.height }}
            initial={{ x: 0, y: 0, scale: 1, opacity: 1, rotate: 0 }}
            animate={{
              x: [0, f.dx * 0.45, f.dx],
              y: [0, Math.min(f.dy * 0.45, 0) - 120, f.dy],
              scale: [1, 0.55, 0.12],
              rotate: [0, -8, 12],
              opacity: [1, 1, 0.4],
            }}
            transition={{ duration: 0.85, times: [0, 0.45, 1], ease: ['easeOut', 'easeIn'] }}
            onAnimationComplete={() => finish(f.id)}
          >
            <img src={f.src} alt="" className="size-full object-contain p-[10%] mix-blend-multiply" />
          </motion.div>
        )),
        document.body,
      )}
    </FlyContext.Provider>
  )
}

export function useFlyToCart() {
  const ctx = useContext(FlyContext)
  if (!ctx) throw new Error('useFlyToCart must be used inside FlyToCartProvider')
  return ctx
}
