import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { TechObject } from '../data/rokiskisObjects'
import { OBJECT_COORDS } from '../data/rokiskisCoords'

const DEFAULT_CENTER: [number, number] = [54.670618, 25.284327]
const makeIcon = (color: string) => L.divIcon({
  className: '',
  html: `<div style="width:10px;height:10px;background:${color};border:1.5px solid #fff;border-radius:2px;box-shadow:0 1px 3px rgba(0,0,0,0.4)"></div>`,
  iconSize: [10, 10],
  iconAnchor: [5, 5],
  tooltipAnchor: [5, -5],
})

interface Props {
  items: TechObject[]
  selected: TechObject[]
  center?: [number, number]
}

export function StationMap({ items, selected, center }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const layerRef = useRef<L.LayerGroup | null>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const map = L.map(containerRef.current, { zoomControl: true }).setView(center ?? DEFAULT_CENTER, 16)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map)
    const layer = L.layerGroup().addTo(map)
    mapRef.current = map
    layerRef.current = layer
    return () => { map.remove() }
  }, [])

  useEffect(() => {
    if (!mapRef.current) return
    mapRef.current.setView(center ?? DEFAULT_CENTER, 16)
  }, [center])

  useEffect(() => {
    const layer = layerRef.current
    if (!layer) return
    const selectedCodes = new Set(selected.map(s => s.code))
    layer.clearLayers()
    items.forEach(o => {
      const pos = OBJECT_COORDS[o.code]
      if (!pos) return
      const color = selectedCodes.has(o.code) ? '#2e7d32' : '#9e9e9e'
      L.marker(pos, { icon: makeIcon(color) })
        .bindTooltip(o.name, { direction: 'top', offset: [0, -8] })
        .addTo(layer)
    })
  }, [items, selected])

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
}
