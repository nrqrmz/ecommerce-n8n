import { useSyncExternalStore } from 'react'

export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      if (typeof matchMedia !== 'function') return () => {}
      const mq = matchMedia(query)
      mq.addEventListener('change', onChange)
      return () => {
        mq.removeEventListener('change', onChange)
      }
    },
    () => typeof matchMedia === 'function' && matchMedia(query).matches,
    () => false,
  )
}
