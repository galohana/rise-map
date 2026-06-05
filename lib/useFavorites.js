'use client'
import { useState, useCallback } from 'react'

const KEY = 'rise_favorites'

function load() {
  if (typeof window === 'undefined') return new Set()
  try {
    const v = localStorage.getItem(KEY)
    return new Set(v ? JSON.parse(v) : [])
  } catch { return new Set() }
}

function save(set) {
  try { localStorage.setItem(KEY, JSON.stringify([...set])) } catch {}
}

export function useFavorites() {
  const [favs, setFavs] = useState(load)

  const toggle = useCallback(id => {
    setFavs(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      save(next)
      return next
    })
  }, [])

  return {
    isFav: id => favs.has(id),
    toggle,
    count: favs.size,
  }
}
