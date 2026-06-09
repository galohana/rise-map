import { ISRAELI_CITIES } from '@/lib/israeli-cities'

export function buildSuggestions(studios, query) {
  if (!query || query.length < 2) return []
  const q = query.trim().toLowerCase()
  const seen = new Set()
  const results = []

  const push = (label, kind) => {
    const key = label + kind
    if (seen.has(key)) return
    seen.add(key)
    results.push({ label, kind })
  }

  studios.forEach(s => { if (s.business_name?.toLowerCase().includes(q)) push(s.business_name, 'business') })
  studios.forEach(s => { if (s.city?.toLowerCase().includes(q)) push(s.city, 'city') })
  ISRAELI_CITIES.forEach(c => { if (c.includes(q)) push(c, 'city') })

  results.sort((a, b) => {
    const aS = a.label.toLowerCase().startsWith(q) ? 0 : 1
    const bS = b.label.toLowerCase().startsWith(q) ? 0 : 1
    return aS - bS
  })
  return results.slice(0, 6)
}
