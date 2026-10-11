import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merge class names, resolving Tailwind conflicts (shadcn/ui convention). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const priceFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

export function formatPrice(value: number) {
  return priceFormatter.format(value)
}
