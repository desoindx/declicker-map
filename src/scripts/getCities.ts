import { getDeclikers } from "../utils/getDeclikers"

const getCities = async () => {
  const declikers = await getDeclikers()

  let results = ''
  const cities: string[] = []
  for (const key in declikers) {
    const city = declikers[key].city
    if (city && !cities.includes(city)) {
      cities.push(city)
      const result: string = await fetch(`https://api-adresse.data.gouv.fr/search?q=${city}&limit=1&type=municipality`)
        .then(response => response.json())
        .then(body => body.features && body.features.length > 0 ? `"${city}": ${JSON.stringify(body.features[0].geometry)}` : '')
      results = results + ',' + result
    }
  }
  console.log(results)
}

getCities()