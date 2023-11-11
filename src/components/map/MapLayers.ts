

export const structuresClusterCircleLayer: LayerSpecification = {
  id: 'structuresClusterCircle',
  source: 'structures',
  type: 'circle',
  filter: ['==', 'cluster', true],
  paint: {
    'circle-color': '#000091',
    'circle-radius': 20,
  },
}