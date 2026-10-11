import { Button } from '@/components/ui/button'

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="rounded-xl border border-destructive/40 p-6 text-center">
      <p className="font-medium">We could not load the products</p>
      <p className="mt-1 text-sm text-muted-foreground">{message}</p>
      <Button className="mt-4 h-11" onClick={onRetry}>
        Try again
      </Button>
    </div>
  )
}
