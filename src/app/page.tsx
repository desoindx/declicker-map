import Map from '@/components/map/Map'
import { getDeclikers } from '@/utils/getDeclikers'

export const revalidate = 3600 * 24

export default async function Home() {
  const declikers = await getDeclikers()
  return <Map declikers={declikers} />
}
