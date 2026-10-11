import { CloudOff } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/shop/empty-state'

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="glass rounded-3xl border-destructive/30">
      <EmptyState icon={CloudOff} title="We could not load the products" description={message}>
        <Button className="h-11" onClick={onRetry}>
          Try again
        </Button>
      </EmptyState>
    </div>
  )
}
