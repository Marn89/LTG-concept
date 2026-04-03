interface Props {
  location: { lat: number; lng: number }
  height?: number
}

export function LocationMap({ location, height = 200 }: Props) {
  const { lat, lng } = location
  const delta = 0.008
  const bbox = `${lng - delta},${lat - delta},${lng + delta},${lat + delta}`
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`

  return (
    <iframe
      src={src}
      width="100%"
      height={height}
      style={{ border: 'none', borderRadius: '8px', display: 'block' }}
      loading="lazy"
    />
  )
}
