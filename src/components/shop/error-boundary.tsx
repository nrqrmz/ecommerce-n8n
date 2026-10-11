import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'

import { Button } from '@/components/ui/button'

interface Props {
  children: ReactNode
  /** When this value changes, the boundary clears its error and tries to render again. */
  resetKey?: string
}

interface State {
  error: Error | null
}

/** Shows a friendly message instead of a blank page if something crashes while rendering. */
class Boundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Render error:', error, info.componentStack)
  }

  componentDidUpdate(prev: Props) {
    if (this.state.error && prev.resetKey !== this.props.resetKey) this.setState({ error: null })
  }

  render() {
    const { error } = this.state
    if (!error) return this.props.children
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p className="mt-2 text-muted-foreground">The page could not be displayed. Please try again.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Button className="h-11" onClick={() => window.location.reload()}>
            Reload
          </Button>
          <Button asChild variant="outline" className="h-11">
            <Link to="/">Back to store</Link>
          </Button>
        </div>
        <details className="mt-6 text-left text-xs text-muted-foreground">
          <summary className="cursor-pointer text-center">Technical details</summary>
          <pre className="mt-2 max-h-60 overflow-auto rounded-md bg-muted p-3 break-words whitespace-pre-wrap">
            {error.name}: {error.message}
            {'\n'}
            {error.stack?.split('\n').slice(1, 6).join('\n')}
          </pre>
        </details>
      </div>
    )
  }
}

/** Resets automatically when the user navigates to another page. Must be inside the router. */
export function ErrorBoundary({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  return <Boundary resetKey={pathname}>{children}</Boundary>
}
