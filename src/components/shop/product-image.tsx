import { useState } from 'react'
import { ImageOff } from 'lucide-react'

import { cn } from '@/lib/utils'

export function ProductImage({
  src,
  alt,
  className,
  eager = false,
}: {
  src: string
  alt: string
  className?: string
  eager?: boolean
}) {
  const [failed, setFailed] = useState(false)
  return (
    <div className={cn('flex aspect-square items-center justify-center bg-muted', className)}>
      {src && !failed ? (
        <img
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          onError={() => setFailed(true)}
          className="size-full object-contain"
        />
      ) : (
        <ImageOff className="size-8 text-muted-foreground" aria-label="No image" />
      )}
    </div>
  )
}
