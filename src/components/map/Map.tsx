'use client'

import React, { useEffect, useRef, useState } from 'react'
import maplibregl, { GeoJSONSource } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import styles from './Map.module.css'
import Popup from './Popup'
import { Decliker } from '../../../types/decliker'

const Map = ({ declikers }: { declikers: Decliker[] }) => {
  const map = useRef<maplibregl.Map>()
  const mapContainer = useRef<HTMLDivElement>(null)
  const [selectedDeclikers, setSelectedDeclikers] = useState<Decliker[] | null>(null)

  useEffect(() => {
    if (map.current || !mapContainer.current) {
      return
    }

    map.current = new maplibregl.Map({
      attributionControl: false,
      container: mapContainer.current,
      style: 'https://openmaptiles.geo.data.gouv.fr/styles/osm-bright/style.json',
      minZoom: 2,
      maxZoom: 18,
      zoom: 5,
      center: {
        lat: 46,
        lon: 2,
      },
    })

    map.current.on('load', () => {
      if (!map.current) {
        return
      }

      try {
        const navControl = new maplibregl.NavigationControl({
          showZoom: true,
          showCompass: false,
        })
        map.current.addControl(navControl, 'top-right')

        const scaleControl = new maplibregl.ScaleControl({
          maxWidth: 100,
          unit: 'metric',
        })
        map.current.addControl(scaleControl, 'bottom-left')

        map.current.addSource('declikers', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: declikers.map((decliker) => ({
              type: 'Feature',
              properties: { name: decliker.name, id: decliker.id },
              geometry: decliker.geometry,
            })),
          },
          cluster: true,
          clusterRadius: 25,
          clusterProperties: {
            count: ['+', 1],
          },
        })

        map.current.addLayer({
          id: 'declikersCluster',
          source: 'declikers',
          type: 'circle',
          filter: ['==', 'cluster', true],
          paint: {
            'circle-color': '#f7c744',
            'circle-stroke-color': '#284f42',
            'circle-radius': ['interpolate', ['linear'], ['get', 'count'], 1, 4, 50, 20],
            'circle-stroke-width': 2,
          },
        })

        map.current.addLayer({
          id: 'declikers',
          source: 'declikers',
          type: 'circle',
          filter: ['!=', 'cluster', true],
          paint: {
            'circle-color': '#f7c744',
            'circle-stroke-color': '#284f42',
            'circle-radius': 4,
            'circle-stroke-width': 2,
          },
        })

        map.current.on('mouseenter', 'declikers', () => {
          if (map.current) {
            map.current.getCanvas().style.cursor = 'pointer'
          }
        })
        map.current.on('mouseleave', 'declikers', () => {
          if (map.current) {
            map.current.getCanvas().style.cursor = ''
          }
        })
        map.current.on('click', 'declikers', (e) => {
          setSelectedDeclikers(e.features?.map((feature) => feature.properties as Decliker) || null)
        })

        map.current.on('mouseenter', 'declikersCluster', () => {
          if (map.current) {
            map.current.getCanvas().style.cursor = 'pointer'
          }
        })
        map.current.on('mouseleave', 'declikersCluster', () => {
          if (map.current) {
            map.current.getCanvas().style.cursor = ''
          }
        })
        map.current.on('click', 'declikersCluster', (e) => {
          if (map.current && e.features) {
            let clusterId = e.features[0].properties.cluster_id;
            let pointCount = e.features[0].properties.point_count;
            (map.current.getSource('declikers') as GeoJSONSource).getClusterLeaves(clusterId, pointCount, 0, (errors, features) => {
              if (features) {
                setSelectedDeclikers(features.map((feature) => feature.properties as Decliker) || null)
              }
            })
          }
        })
      } catch (error) {
        console.error('Could not load map', error)
      }
    })
  }, [])

  return (
    <div ref={mapContainer} className={styles.container}>
      {selectedDeclikers && <Popup declikers={selectedDeclikers} onClose={() => setSelectedDeclikers(null)} />}
    </div>
  )
}

export default Map
