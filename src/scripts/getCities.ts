import { getDeclikers } from "@/utils/getDeclikers"

const getCities = async () => {
  const declikers = await getDeclikers()

  let results = ''
  const cities: string[] = []
  for (const key in declikers) {
    const city = declikers[key].city
    if (city && !cities.includes(city)) {
      cities.push(city)
      const result: string = await fetch(`https://api-adresse.data.gouv.fr/search?q=${city}&limit=1`)
        .then(response => response.json())
        .then(body => `"${city}": ${JSON.stringify(body.features[0].geometry)}`)
      results = results + ',' + result
    }
  }
  console.log(results)
}

getCities()