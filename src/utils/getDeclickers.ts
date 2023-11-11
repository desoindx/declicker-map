import { cities } from "@/components/map/cities"
import { Decliker } from "../../types/decliker"

export const getDeclikers = async (): Promise<Decliker[]> => {
  let declikers: any[] = []
  let offset = ''
  while (declikers.length === 0 || offset) {
    const result = await fetch(encodeURI(`https://api.airtable.com/v0/appXVpwKTp3eNKFBT/tblRwnJk2LONwOEH9${offset ? `?offset=${offset}` : ''}`), {
      headers: {
        Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`
      }
    }).then(response => response.json())
    declikers = declikers.concat(result.records)
    offset = result.offset
  }
  return declikers.filter(decliker => decliker.fields["Abonné?"]).map(decliker => ({
    id: decliker.id,
    city: decliker.fields.Ville?.trim(),
    geometry: cities[decliker.fields.Ville?.trim()],
    name: decliker.fields.Nom_Complet_ID
  }))
}