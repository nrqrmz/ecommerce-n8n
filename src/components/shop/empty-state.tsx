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
      <div className="flex size-16 items-center justify-center rounded-full bg-accent text-accent-foreground">
        <Icon className="size-8" />
      </div>
      <h2 className="mt-4 text-lg font-semibold">{title}</h2>
      {description && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>}
      {children && <div className="mt-6">{children}</div>}
    </div>
  )
}
