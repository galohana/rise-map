'use client'
import { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { categoryMeta, pinGlyph } from '@/lib/categories'

/* Build a clean teardrop divIcon with the studio glyph centered on a white disc. */
function makeIcon(studio, selected) {
  const { color } = categoryMeta(studio.type)
  const glyph = pinGlyph(studio)
  const w = selected ? 50 : 38
  const h = selected ? 64 : 49
  const discCy = (18.5 / 49) * h
  const glyphSize = selected ? 16 : 13
  const ring = selected
    ? `<circle cx="19" cy="18.5" r="14.5" fill="none" stroke="${color}" stroke-width="2" opacity="0.45"/>`
    : ''

  const html = `
    <div style="position:relative;width:${w}px;height:${h}px;filter:drop-shadow(0 ${selected ? 5 : 3}px ${selected ? 6 : 4}px rgba(20,18,16,0.30))">
      <svg width="${w}" height="${h}" viewBox="0 0 38 49" style="position:absolute;inset:0">
        <path d="M19 1 C9.06 1 1 9.06 1 19 C1 32 19 48 19 48 C19 48 37 32 37 19 C37 9.06 28.94 1 19 1 Z" fill="${color}"/>
        <circle cx="19" cy="18.5" r="${selected ? 12 : 10}" fill="#ffffff"/>
        ${ring}
      </svg>
      <span style="position:absolute;left:0;right:0;top:${discCy - glyphSize / 2}px;text-align:center;font-size:${glyphSize}px;line-height:1">${glyph}</span>
    </div>`

  return L.divIcon({
    html,
    className: 'rise-pin',
    iconSize: [w, h],
    iconAnchor: [w / 2, h],
    popupAnchor: [0, -h],
  })
}

/* Imperatively fly to the focused studio whenever it changes. */
function FlyTo({ target }) {
  const map = useMap()
  useEffect(() => {
    if (!target) return
    const lat = Number(target.lat)
    const lng = Number(target.lng)
    if (Number.isNaN(lat) || Number.isNaN(lng)) return
    map.flyTo([lat, lng], 14, { duration: 1.1 })
  }, [target, map])
  return null
}

/* Custom zoom + geolocate controls. */
function MapControls() {
  const map = useMap()
  const [geo, setGeo] = useState(false)

  const locate = () => {
    if (!navigator.geolocation) return
    setGeo(true)
    navigator.geolocation.getCurrentPosition(
      pos => { setGeo(false); map.flyTo([pos.coords.latitude, pos.coords.longitude], 14, { duration: 1.4 }) },
      () => setGeo(false),
      { timeout: 8000 }
    )
  }

  return (
    <>
      <div className="absolute bottom-24 left-4 z-[900] flex flex-col gap-1.5">
        {[['+', () => map.zoomIn(), 'הגדל'], ['−', () => map.zoomOut(), 'הקטן']].map(([label, fn, aria]) => (
          <button key={label} onClick={fn} aria-label={aria}
            className="w-9 h-9 rounded-xl bg-white ring-1 ring-zinc-200 shadow-[0_2px_10px_rgba(0,0,0,0.12)]
                       flex items-center justify-center text-zinc-700 text-lg font-light leading-none
                       hover:bg-zinc-50 active:scale-90 transition select-none">
            {label}
          </button>
        ))}
      </div>
      <div className="absolute bottom-6 left-4 z-[900]">
        <button onClick={locate} disabled={geo}
          className="flex items-center gap-2 bg-white rounded-full ring-1 ring-zinc-200 px-4 py-2
                     text-[13px] font-heebo font-medium text-zinc-700
                     shadow-[0_4px_16px_rgba(0,0,0,0.12)] hover:shadow-lg active:scale-95 transition disabled:opacity-60">
          {geo
            ? <span className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            : <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>}
          קרוב אליי
        </button>
      </div>
    </>
  )
}

export default function MapClient({ studios, selectedId, focus, onMarkerClick }) {
  const markersRef = useRef({})

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={[31.5, 34.82]}
        zoom={8}
        zoomControl={false}
        scrollWheelZoom
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          subdomains="abcd"
          maxZoom={20}
        />

        {studios.map(studio => {
          const lat = Number(studio.lat)
          const lng = Number(studio.lng)
          if (Number.isNaN(lat) || Number.isNaN(lng)) return null
          return (
            <Marker
              key={studio.id}
              position={[lat, lng]}
              icon={makeIcon(studio, selectedId === studio.id)}
              ref={el => { if (el) markersRef.current[studio.id] = el }}
              eventHandlers={{ click: () => onMarkerClick(studio) }}
            />
          )
        })}

        <FlyTo target={focus} />
        <MapControls />
      </MapContainer>

      <div className="absolute bottom-1 right-1 z-[800] pointer-events-none">
        <span className="text-[10px] font-heebo text-zinc-500 bg-white/80 rounded px-1.5 py-0.5">
          © OpenStreetMap · CARTO
        </span>
      </div>
    </div>
  )
}
