import { Link } from 'react-router-dom'
import { SearchX } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/shop/empty-state'

export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <EmptyState icon={SearchX} title="Page not found" description="This address does not match any page of the store.">
        <Button asChild className="h-11">
          <Link to="/">Go home</Link>
        </Button>
      </EmptyState>
    </div>
  )
}
