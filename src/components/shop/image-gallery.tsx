import { useState } from 'react'
import { ZoomIn, ZoomOut } from 'lucide-react'

import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { ProductImage } from '@/components/shop/product-image'
import { cn } from '@/lib/utils'

export function ImageGallery({
  images,
  alt,
  imageRef,
}: {
  images: string[]
  alt: string
  imageRef?: React.Ref<HTMLDivElement>
}) {
  const list = images.length > 0 ? images : ['']
  const [index, setIndex] = useState(0)
  const [open, setOpen] = useState(false)
  const [zoomed, setZoomed] = useState(false)
  const current = list[Math.min(index, list.length - 1)]

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => {
          setZoomed(false)
          setOpen(true)
        }}
        className="group relative block w-full cursor-zoom-in overflow-hidden rounded-[2rem] shadow-[0_40px_80px_-20px_rgb(0_0_0/0.8)] ring-1 ring-white/15"
        aria-label="Open image in full screen"
      >
        <ProductImage
          ref={imageRef}
          src={current}
          alt={alt}
          eager
          className="transition-transform duration-700 group-hover:scale-105"
        />
        <span className="absolute right-3 bottom-3 flex items-center gap-1 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
          <ZoomIn className="size-4" /> Tap to zoom
        </span>
      </button>

      {list.length > 1 && (
        <div className="flex gap-2">
          {list.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show image ${i + 1}`}
              aria-current={i === index}
              className={cn(
                'w-20 overflow-hidden rounded-2xl ring-2 transition',
                i === index ? 'ring-glow-1 shadow-[0_0_16px_var(--glow-1)]' : 'ring-transparent opacity-60 hover:opacity-100',
              )}
            >
              <ProductImage src={src} alt="" />
            </button>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="h-[90dvh] w-[calc(100vw-2rem)] max-w-4xl gap-0 overflow-hidden p-0 sm:max-w-4xl">
          <DialogTitle className="sr-only">{alt}</DialogTitle>
          <DialogDescription className="sr-only">Tap the image to zoom in or out.</DialogDescription>
          <div className="relative h-full overflow-auto bg-white" data-testid="lightbox">
            <button
              type="button"
              onClick={() => setZoomed((z) => !z)}
              className={cn(
                'flex min-h-full items-center justify-center',
                zoomed ? 'w-[200%] cursor-zoom-out' : 'w-full cursor-zoom-in',
              )}
              aria-label={zoomed ? 'Zoom out' : 'Zoom in'}
            >
              {current && <img src={current} alt={alt} className="max-h-full w-full object-contain" />}
            </button>
            <span className="pointer-events-none fixed bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-black/70 px-3 py-1.5 text-xs text-white">
              {zoomed ? <ZoomOut className="size-4" /> : <ZoomIn className="size-4" />}
              {zoomed ? 'Tap to zoom out · drag to pan' : 'Tap to zoom in'}
            </span>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
