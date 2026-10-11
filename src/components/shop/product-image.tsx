import { useState } from 'react'
import { ImageOff } from 'lucide-react'

import { cn } from '@/lib/utils'

/**
 * Product photo on a softly lit "studio" tile. The product images have white backgrounds, so the
 * image is multiplied onto the light tile: the white disappears and the product looks spot-lit.
 */
export function ProductImage({
  src,
  alt,
  className,
  eager = false,
  ref,
}: {
  src: string
  alt: string
  className?: string
  eager?: boolean
  ref?: React.Ref<HTMLDivElement>
}) {
  const [failed, setFailed] = useState(false)
  return (
    <div
      ref={ref}
      className={cn(
        'relative flex aspect-square items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_30%,#ffffff_0%,#eceaf7_55%,#cfcce6_100%)]',
        className,
      )}
    >
      {src && !failed ? (
        <img
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setFailed(true)}
          className="size-full object-contain p-[8%] mix-blend-multiply"
        />
      ) : (
        <ImageOff className="size-8 text-slate-400" aria-label="No image" />
      )}
    </div>
  )
}
