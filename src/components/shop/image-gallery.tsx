import { useState } from 'react'
import { ZoomIn, ZoomOut } from 'lucide-react'

import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { ProductImage } from '@/components/shop/product-image'
import { cn } from '@/lib/utils'

export function ImageGallery({ images, alt }: { images: string[]; alt: string }) {
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
        className="group relative block w-full cursor-zoom-in overflow-hidden rounded-2xl border bg-muted"
        aria-label="Open image in full screen"
      >
        <ProductImage src={current} alt={alt} eager className="bg-transparent" />
        <span className="absolute right-3 bottom-3 flex items-center gap-1 rounded-full bg-background/90 px-3 py-1.5 text-xs font-medium shadow-sm">
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
                'w-20 overflow-hidden rounded-xl border-2 bg-muted transition',
                i === index ? 'border-primary' : 'border-transparent opacity-70 hover:opacity-100',
              )}
            >
              <ProductImage src={src} alt="" className="bg-transparent" />
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
