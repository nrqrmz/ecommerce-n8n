import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const KEY = 'favorites:v1'

function load(): number[] {
  try {
    const data = JSON.parse(localStorage.getItem(KEY) ?? '[]')
    return Array.isArray(data) ? data.filter((v): v is number => typeof v === 'number') : []
  } catch {
    return []
  }
}

interface FavoritesState {
  ids: number[]
  count: number
  has: (id: number) => boolean
  toggle: (id: number) => void
}

const FavoritesContext = createContext<FavoritesState | null>(null)

// Favorites are saved in localStorage and shared between tabs.
export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<number[]>(load)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(ids))
    } catch {
      // Storage blocked: favorites last until reload.
    }
  }, [ids])

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === KEY) setIds(load())
    }
    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  const toggle = useCallback((id: number) => {
    setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [id, ...prev]))
  }, [])

  const value = useMemo(() => {
    const set = new Set(ids)
    return { ids, count: ids.length, has: (id: number) => set.has(id), toggle }
  }, [ids, toggle])

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites must be used inside FavoritesProvider')
  return ctx
}
