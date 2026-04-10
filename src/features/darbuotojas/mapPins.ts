export const MY_LOCATION = { lat: 54.640204, lng: 25.227166 }

export function distanceM(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371000
  const dLat = (b.lat - a.lat) * Math.PI / 180
  const dLng = (b.lng - a.lng) * Math.PI / 180
  const sin2 = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * Math.PI / 180) * Math.cos(b.lat * Math.PI / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.asin(Math.sqrt(sin2))
}

export function formatDistance(m: number): string {
  if (m < 1000) return `${Math.round(m / 10) * 10} m`
  return `${(m / 1000).toLocaleString('lt-LT', { maximumFractionDigits: 1 })} km`
}

export interface MapPin {
  lat: number
  lng: number
  title: string
  desc: string
  type: 'notification' | 'wo'
}

export const MAP_PINS: MapPin[] = [
  { lat: 54.639997, lng: 25.226488, title: 'WO-00422',                 desc: 'Bėgių patikrinimas — REL',           type: 'wo'           },
  { lat: 54.640442, lng: 25.227803, title: 'Bėgių apžiūra',            desc: 'Įtrūkęs bėgis',                     type: 'notification' },
  { lat: 54.640704, lng: 25.228993, title: 'Iešmo patikrinimas',       desc: 'Neveikia automatinis iešmas',        type: 'notification' },
  { lat: 54.640115, lng: 25.226794, title: 'WO-00423',                 desc: 'Kontaktinio tinklo remontas — MSGS', type: 'wo'           },
  { lat: 54.639713, lng: 25.225366, title: 'Semaforo lempos keitimas', desc: 'Gedusi signalinė lempa',             type: 'notification' },
]
