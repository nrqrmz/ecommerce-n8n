import { Loader2, Lock } from 'lucide-react'
import { motion } from 'motion/react'

import { formatPrice } from '@/lib/utils'

export function PayButton({ total, paying, onPay }: { total: number; paying: boolean; onPay: () => void }) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.97 }}
      disabled={paying}
      onClick={onPay}
      className="relative flex h-13 w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-glow-1 via-glow-2 to-glow-1 text-base font-semibold text-white shadow-[0_0_30px_var(--glow-1)] transition-shadow hover:shadow-[0_0_45px_var(--glow-2)] disabled:cursor-wait"
    >
      {paying && <span className="animate-shimmer absolute inset-0" />}
      {paying ? <Loader2 className="size-5 animate-spin" /> : <Lock className="size-4" />}
      <span className="relative">{paying ? 'Processing payment…' : `Pay ${formatPrice(total)}`}</span>
    </motion.button>
  )
}
