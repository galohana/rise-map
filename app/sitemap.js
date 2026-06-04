import { getStudios } from '@/lib/studios'

const BASE = 'https://rise-map.vercel.app'

export const dynamic = 'force-dynamic'

export default async function sitemap() {
  const studios = await getStudios()
  return [
    { url: BASE, changeFrequency: 'weekly', priority: 1 },
    ...studios.map(s => ({
      url: `${BASE}/studio/${s.slug}`,
      changeFrequency: 'monthly',
      priority: 0.8,
    })),
  ]
}
