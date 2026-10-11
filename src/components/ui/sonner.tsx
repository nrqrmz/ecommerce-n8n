import { Toaster as Sonner, type ToasterProps } from 'sonner'

/** shadcn-style Toaster, fixed to the dark theme with glass styling. */
function Toaster(props: ToasterProps) {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: '!rounded-2xl !border-white/10 !bg-[oklch(0.2_0.03_278/0.85)] !backdrop-blur-xl !shadow-2xl',
          actionButton: '!rounded-full !bg-primary !px-3 !font-semibold',
        },
      }}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
