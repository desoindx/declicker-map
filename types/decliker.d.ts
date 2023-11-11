export type Decliker = {
  id: string
  city: string
  name: string
  geometry: {
    type: 'Point',
    coordinates: [number, number]
  }
}