import type { LucideIcon } from 'lucide-react'

export function EmptyState({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: LucideIcon
  title: string
  description?: string
  children?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center px-4 py-14 text-center">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-glow-1/40 blur-xl" />
        <div className="glass relative flex size-18 items-center justify-center rounded-full text-accent-foreground">
          <Icon className="size-8" />
        </div>
      </div>
      <h2 className="mt-5 font-display text-xl font-bold">{title}</h2>
      {description && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>}
      {children && <div className="mt-6">{children}</div>}
    </div>
  )
}
