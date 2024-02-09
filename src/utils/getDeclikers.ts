import { cities } from './cities'
import { Decliker } from '../../types/decliker'

let citiesCopy = { ...cities }

export const getDeclikers = async (withName?: boolean): Promise<Decliker[]> => {
  let declikers: any[] = []
  let offset = ''
  while (declikers.length === 0 || offset) {
    const result = await fetch(
      encodeURI(`https://api.airtable.com/v0/appXVpwKTp3eNKFBT/tblRwnJk2LONwOEH9${offset ? `?offset=${offset}` : ''}`),
      {
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`,
        },
      }
    ).then((response) => response.json())
    declikers = declikers.concat(result.records)
    offset = result.offset
  }

  for (const key in declikers) {
    const city = declikers[key].fields.Ville?.trim()
    if (city === 'Je suis nomade' || city === 'France') {
      continue
    }
    if (city && !citiesCopy[city]) {
      const result: any = await fetch(
        `https://api-adresse.data.gouv.fr/search?q=${city}&limit=1&type=municipality`
      ).then((response) => response.json())
      if (result.features[0]) {
        citiesCopy[city] = { type: 'Point', coordinates: result.features[0].geometry }
      }
    }
  }

  return declikers
    .filter((decliker) => decliker.fields['Abonné?'])
    .map((decliker) => ({
      id: decliker.id,
      city: decliker.fields.Ville?.trim(),
      geometry: citiesCopy[decliker.fields.Ville?.trim()],
      name: withName ? decliker.fields.Nom_Complet_ID : undefined,
      jobs: decliker.fields.Professions,
    }))
}
