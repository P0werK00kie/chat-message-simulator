export interface GeoPoint {
  lat: number
  lng: number
}

const GEOCODE_ENDPOINT = "https://api.mapbox.com/geocoding/v5/mapbox.places"
const STATIC_ENDPOINT = "https://api.mapbox.com/styles/v1/mapbox/streets-v11/static"

// Mapbox Geocoding API: look up coordinates for a free-text address.
export const geocodeAddress = async (address: string, token: string): Promise<GeoPoint> => {
  const url = `${GEOCODE_ENDPOINT}/${encodeURIComponent(address)}.json?limit=1&access_token=${encodeURIComponent(token)}`
  let response: Response
  try {
    response = await fetch(url)
  } catch {
    throw new Error("Could not reach Mapbox. Check your connection.")
  }
  if (!response.ok) {
    throw new Error(response.status === 401 ? "That Mapbox access token was rejected." : "Could not look up that address.")
  }
  const data = (await response.json()) as { features?: Array<{ center: [number, number] }> }
  const feature = data.features?.[0]
  if (!feature) throw new Error("No matching address found.")
  const [lng, lat] = feature.center
  return { lat, lng }
}

// Mapbox Static Images API: a plain <img> url, so it exports the same way as any other photo.
export const getStaticMapUrl = (
  point: GeoPoint,
  token: string,
  options: { width?: number; height?: number; zoom?: number; pinColor?: string } = {},
) => {
  const { width = 320, height = 160, zoom = 14, pinColor = "ff385c" } = options
  const marker = `pin-s+${pinColor.replace("#", "")}(${point.lng},${point.lat})`
  return `${STATIC_ENDPOINT}/${marker}/${point.lng},${point.lat},${zoom},0/${width}x${height}@2x?access_token=${encodeURIComponent(token)}`
}
