'use client'
import { useState, useEffect, useCallback } from 'react'

const KEY = 'rise_history'
const MAX = 10

/** Call this when a studio panel is opened. Prepends to history, deduplicates by id. */
export function addToHistory(studio) {
  if (typeof window === 'undefined') return
  try {
    const stored = localStorage.getItem(KEY)
    let arr = stored ? JSON.parse(stored) : []
    arr = arr.filter(x => x.id !== studio.id)
    arr.unshift({
      id: studio.id,
      slug: studio.slug,
      business_name: studio.business_name,
      logo_url: studio.logo_url || null,
      type: studio.type,
      city: studio.city || '',
      timestamp: Date.now(),
    })
    arr = arr.slice(0, MAX)
    localStorage.setItem(KEY, JSON.stringify(arr))
  } catch {}
}

/** Returns the history array and a refresh function. */
export function useHistory() {
  const [history, setHistory] = useState(() => {
    if (typeof window === 'undefined') return []
    try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] }
  })

  useEffect(() => {
    const fn = () => {
      try { setHistory(JSON.parse(localStorage.getItem(KEY) || '[]')) } catch {}
    }
    window.addEventListener('focus', fn)
    return () => window.removeEventListener('focus', fn)
  }, [])

  const refresh = useCallback(() => {
    try { setHistory(JSON.parse(localStorage.getItem(KEY) || '[]')) } catch {}
  }, [])

  return { history, refresh }
}
