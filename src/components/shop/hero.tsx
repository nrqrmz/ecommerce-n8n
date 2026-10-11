import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { ArrowRight, Sparkles } from 'lucide-react'

import { ProductImage } from '@/components/shop/product-image'
import { useProducts } from '@/context/products-context'
import { TAGLINE } from '@/lib/brand'
import { formatPrice } from '@/lib/utils'

const FLOATERS = [
  { className: 'right-[4%] top-[6%] w-[46%] md:w-[58%]', depth: 30, delay: 0, rotate: -6 },
  { className: 'left-[2%] top-[38%] w-[34%] md:w-[42%]', depth: 55, delay: 0.6, rotate: 8 },
  { className: 'right-[10%] bottom-[2%] w-[30%] md:w-[36%]', depth: 80, delay: 1.2, rotate: -3 },
]

export function Hero() {
  const { products, categories } = useProducts()
  // Three random real products float in the hero.
  const picks = useMemo(() => [...products].sort(() => Math.random() - 0.5).slice(0, 3), [products])

  const mx = useSpring(useMotionValue(0), { stiffness: 60, damping: 20 })
  const my = useSpring(useMotionValue(0), { stiffness: 60, damping: 20 })

  function onMove(e: React.PointerEvent) {
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }

  return (
    <section onPointerMove={onMove} className="relative mx-auto max-w-6xl px-4 pt-8 md:pt-14">
      <div className="grid items-center gap-6 md:grid-cols-[1.1fr_1fr]">
        <div className="relative z-10 flex flex-col items-start gap-6">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold"
          >
            <Sparkles className="size-3.5 text-glow-3" />
            {products.length > 0
              ? `${products.length} products · ${categories.length} categories`
              : 'New season, new finds'}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-[2.9rem] leading-[0.95] font-extrabold tracking-[-0.04em] sm:text-6xl md:text-7xl lg:text-[5.5rem]"
          >
            {TAGLINE.split('. ').map((part, i, arr) => (
              <span key={part} className={i === arr.length - 1 ? 'block text-gradient' : 'block'}>
                {part}
                {i < arr.length - 1 ? '.' : ''}
              </span>
            ))}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="max-w-md text-base text-muted-foreground md:text-lg"
          >
            Beauty, home, tech and style, picked with care. Add to cart in a tap, check out in seconds.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="flex flex-wrap gap-3"
          >
            <Link
              to="/products"
              className="group flex h-13 items-center gap-2 rounded-full bg-gradient-to-r from-glow-1 to-glow-2 px-7 font-semibold text-white shadow-[0_0_30px_var(--glow-1)] transition-shadow hover:shadow-[0_0_45px_var(--glow-2)]"
            >
              Shop now <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#categories"
              className="glass flex h-13 items-center rounded-full px-7 font-semibold transition-colors hover:bg-white/10"
            >
              Explore categories
            </a>
          </motion.div>
        </div>

        <div className="relative aspect-[5/4] w-full md:aspect-square">
          <div className="absolute inset-[12%] rounded-full bg-glow-1/40 blur-[80px]" />
          {picks.map((p, i) => {
            const f = FLOATERS[i]
            return (
              <FloatingProduct
                key={p.id}
                id={p.id}
                src={p.thumbnail}
                title={p.title}
                price={formatPrice(p.price)}
                className={f.className}
                depth={f.depth}
                delay={f.delay}
                rotate={f.rotate}
                mx={mx}
                my={my}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}

function FloatingProduct({
  id,
  src,
  title,
  price,
  className,
  depth,
  delay,
  rotate,
  mx,
  my,
}: {
  id: number
  src: string
  title: string
  price: string
  className: string
  depth: number
  delay: number
  rotate: number
  mx: ReturnType<typeof useSpring>
  my: ReturnType<typeof useSpring>
}) {
  const x = useTransform(mx, (v) => v * depth)
  const y = useTransform(my, (v) => v * depth)
  return (
    <motion.div style={{ x, y }} className={`absolute ${className}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
        animate={{ opacity: 1, scale: 1, rotate, y: [0, -14, 0] }}
        transition={{
          opacity: { duration: 0.6, delay: delay * 0.3 },
          scale: { duration: 0.6, delay: delay * 0.3 },
          rotate: { duration: 0.8, delay: delay * 0.3 },
          y: { duration: 6, repeat: Infinity, ease: 'easeInOut', delay },
        }}
      >
        <Link
          to={`/products/${id}`}
          className="block overflow-hidden rounded-3xl shadow-[0_30px_60px_-15px_rgb(0_0_0/0.7)] ring-1 ring-white/20"
        >
          <ProductImage src={src} alt={title} eager />
          <span className="glass absolute bottom-2 left-2 rounded-full px-2.5 py-1 text-xs font-bold text-white">
            {price}
          </span>
        </Link>
      </motion.div>
    </motion.div>
  )
}
