import HomeClient from '@/components/HomeClient'
import { getStudios } from '@/lib/studios'

// Always render with fresh data so newly-added studios appear immediately.
export const dynamic = 'force-dynamic'

export default async function Page() {
  const studios = await getStudios()
  return <HomeClient studios={studios} />
}
