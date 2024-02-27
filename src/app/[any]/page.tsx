import Map from '@/components/map/Map'
import { getDeclikers } from '@/utils/getDeclikers'
import { getProfessions } from '@/utils/getProfessions'

export const revalidate = 3600 * 24

export default async function Home() {
  const declikers = await getDeclikers()
  const professions = await getProfessions()

  return <Map declikers={declikers} professions={professions} />
}
