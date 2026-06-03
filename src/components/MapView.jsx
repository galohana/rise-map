import { useRef, useCallback, useState, useEffect } from 'react'
import { Map, Marker, Popup } from 'react-map-gl/maplibre'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { motion, AnimatePresence } from 'framer-motion'

/*
  MapTiler Streets-v2 — vector tiles, Hebrew labels, Waze-like appearance.
  language=he → MapTiler renders all place-name layers in Hebrew natively.
*/
const MAP_STYLE =
  'https://api.maptiler.com/maps/streets-v2/style.json?key=wXHoK6SYPWqyuCIbsG5e&language=he'

const MAP_ATTRIBUTION =
  '&copy; <a href="https://www.maptiler.com/" target="_blank">MapTiler</a> ' +
  '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'

const TYPE_COLORS = {
  'גבות':     '#C2714F',
  'לק':       '#E84C78',
  'מספרה':    '#2F80C0',
  'קוסמטיקה': '#9B59D0',
}

/* ── RTL plugin — must run once before any Map renders ── */
let rtlPluginLoaded = false

function ensureRTL() {
  if (rtlPluginLoaded) return
  rtlPluginLoaded = true
  try {
    // Always attempt to load — in v5 this is a no-op if built-in RTL is active.
    // In v4 it loads the external plugin for correct Hebrew/Arabic shaping.
    maplibregl.setRTLTextPlugin(
      'https://unpkg.com/@mapbox/mapbox-gl-rtl-text@0.2.3/mapbox-gl-rtl-text.min.js',
      null,
      true  // lazy: only loads when RTL text is actually encountered
    )
  } catch (_) {
    // Already loaded or built-in — safe to ignore
  }
}

/* ── Pin component ── */
function StudioPin({ type, isSelected }) {
  const color = TYPE_COLORS[type] || '#C2714F'
  const w = isSelected ? 48 : 36
  const h = isSelected ? 62 : 48

  return (
    <motion.div
      animate={{ scale: isSelected ? 1.2 : 1, y: isSelected ? -4 : 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      whileHover={{ scale: isSelected ? 1.25 : 1.15 }}
      style={{ cursor: 'pointer', display: 'block' }}
    >
      <svg width={w} height={h} viewBox="0 0 36 48" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id={`gr-${type}`} cx="38%" cy="28%" r="68%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.30"/>
            <stop offset="100%" stopColor="#fff" stopOpacity="0"/>
          </radialGradient>
          <filter id={`fs-${type}-${isSelected ? 1 : 0}`} x="-80%" y="-50%" width="260%" height="240%">
            <feDropShadow dx="0" dy={isSelected ? 6 : 3} stdDeviation={isSelected ? 7 : 4.5}
              floodColor={color} floodOpacity={isSelected ? 0.52 : 0.34}/>
            <feDropShadow dx="0" dy="1" stdDeviation="1.5"
              floodColor="rgba(0,0,0,0.15)" floodOpacity="1"/>
          </filter>
        </defs>
        <path
          d="M18 1 C8.611 1 1 8.611 1 18 C1 30.5 18 47 18 47 C18 47 35 30.5 35 18 C35 8.611 27.389 1 18 1 Z"
          fill={color}
          filter={`url(#fs-${type}-${isSelected ? 1 : 0})`}
        />
        <path
          d="M18 1 C8.611 1 1 8.611 1 18 C1 30.5 18 47 18 47 C18 47 35 30.5 35 18 C35 8.611 27.389 1 18 1 Z"
          fill={`url(#gr-${type})`}
        />
        <circle cx="18" cy="18" r={isSelected ? 10.5 : 8.5} fill="rgba(255,255,255,0.95)"/>
        <circle cx="18" cy="18" r={isSelected ? 5.5 : 4} fill={color}/>
        {isSelected && (
          <circle cx="18" cy="18" r="8.5" fill="none"
            stroke={color} strokeWidth="1.8" strokeDasharray="2.5 2" opacity="0.5"/>
        )}
      </svg>
    </motion.div>
  )
}

/* ── Popup content ── */
function PopupContent({ studio }) {
  const color = TYPE_COLORS[studio.type] || '#C2714F'
  return (
    <div dir="rtl" style={{ fontFamily: "'Heebo', sans-serif", minWidth: 195 }}>
      <div style={{ padding: '14px 16px 13px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div style={{
            width: 9, height: 9, borderRadius: '50%',
            background: color, flexShrink: 0,
            boxShadow: `0 0 0 2.5px ${color}33`,
          }}/>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#18181B', margin: 0, lineHeight: 1.3 }}>
            {studio.business_name}
          </p>
        </div>
        <p style={{ fontSize: 11.5, color: '#71717A', margin: '0 17px 12px', lineHeight: 1.4 }}>
          {studio.city}{studio.address ? ' — ' + studio.address : ''}
        </p>
        <a
          href={studio.url} target="_blank" rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            fontSize: 12, color: 'white', fontWeight: 600,
            textDecoration: 'none', background: color,
            padding: '7px 16px', borderRadius: 100,
            boxShadow: `0 2px 10px ${color}50`,
          }}
        >
          כניסה לאתר
          <span style={{
            width: 18, height: 18, borderRadius: '50%',
            background: 'rgba(255,255,255,0.22)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10, lineHeight: 1,
          }}>↗</span>
        </a>
      </div>
    </div>
  )
}

/* ── Main component ── */
export default function MapView({ studios, selectedId, onMarkerClick, onMapReady }) {
  const [popupStudio, setPopupStudio] = useState(null)
  const [geoLoading, setGeoLoading] = useState(false)
  const mapRef = useRef(null)

  // Ensure RTL plugin is loaded before any map renders
  useEffect(() => { ensureRTL() }, [])

  const handleMapLoad = useCallback(() => {
    if (!mapRef.current) return
    const map = mapRef.current.getMap?.() || mapRef.current

    // MapTiler's language=he URL hint + runtime patch:
    // Walk every label layer and replace name:en → name:he so that
    // roads, rivers, and cities show Hebrew where available.
    // "Place labels" already uses {name} which is Hebrew for Israel.
    try {
      const style = map.getStyle()
      if (style?.layers) {
        style.layers.forEach(layer => {
          const tf = layer.layout?.['text-field']
          if (!tf) return
          const str = JSON.stringify(tf)
          if (str.includes('name:en')) {
            const fixed = JSON.parse(str.replace(/name:en/g, 'name:he'))
            map.setLayoutProperty(layer.id, 'text-field', fixed)
          }
        })
      }
    } catch (_) { /* style not yet ready */ }

    if (onMapReady) onMapReady(mapRef.current)
  }, [onMapReady])

  const handleGeolocate = () => {
    if (!navigator.geolocation) return
    setGeoLoading(true)
    navigator.geolocation.getCurrentPosition(
      pos => {
        setGeoLoading(false)
        mapRef.current?.flyTo({
          center: [pos.coords.longitude, pos.coords.latitude],
          zoom: 14, duration: 1600, essential: true,
        })
      },
      () => setGeoLoading(false),
      { timeout: 8000 }
    )
  }

  return (
    <div className="relative w-full h-full">
      <Map
        ref={mapRef}
        initialViewState={{ longitude: 34.82, latitude: 31.5, zoom: 9 }}
        style={{ width: '100%', height: '100%' }}
        mapStyle={MAP_STYLE}
        onLoad={handleMapLoad}
        attributionControl={false}
      >
        {studios.map(studio => {
          const lat = Number(studio.lat)
          const lng = Number(studio.lng)
          if (isNaN(lat) || isNaN(lng)) return null
          return (
            <Marker
              key={studio.id}
              longitude={lng}
              latitude={lat}
              anchor="bottom"
              onClick={e => {
                e.originalEvent?.stopPropagation()
                onMarkerClick(studio)
                setPopupStudio(studio)
              }}
            >
              <StudioPin type={studio.type} isSelected={selectedId === studio.id} />
            </Marker>
          )
        })}

        <AnimatePresence>
          {popupStudio && (
            <Popup
              longitude={Number(popupStudio.lng)}
              latitude={Number(popupStudio.lat)}
              anchor="bottom"
              closeButton={false}
              onClose={() => setPopupStudio(null)}
              offset={[0, -50]}
              maxWidth="280px"
            >
              <PopupContent studio={popupStudio} />
            </Popup>
          )}
        </AnimatePresence>
      </Map>

      {/* Attribution */}
      <div className="absolute bottom-1 right-1 z-[800]">
        <span className="text-[10px] font-heebo text-zinc-500 bg-white/80 rounded px-1.5 py-0.5 opacity-60 hover:opacity-100 transition-opacity"
              dangerouslySetInnerHTML={{ __html: MAP_ATTRIBUTION }} />
      </div>

      {/* Zoom */}
      <div className="absolute bottom-24 left-4 z-[900] flex flex-col gap-1.5">
        {[
          { label: '+', action: () => mapRef.current?.zoomIn(), aria: 'הגדל' },
          { label: '−', action: () => mapRef.current?.zoomOut(), aria: 'הקטן' },
        ].map(({ label, action, aria }) => (
          <motion.button
            key={label}
            onClick={action}
            aria-label={aria}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 500, damping: 28 }}
            className="p-[4px] rounded-xl bg-white/90 ring-1 ring-zinc-200
                       shadow-[0_2px_10px_rgba(0,0,0,0.1)]"
          >
            <div className="w-8 h-8 rounded-[0.6rem] bg-white flex items-center justify-center
                            text-zinc-700 text-xl font-light leading-none select-none">
              {label}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Geolocate */}
      <div className="absolute bottom-6 left-4 z-[900]">
        <motion.button
          onClick={handleGeolocate}
          disabled={geoLoading}
          whileHover={{ scale: 1.04, y: -1 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="flex items-center gap-2 bg-white/95 rounded-full
                     ring-1 ring-zinc-200 px-4 py-2
                     text-[13px] font-heebo font-medium text-zinc-700
                     shadow-[0_4px_16px_rgba(0,0,0,0.10)] disabled:opacity-60"
        >
          {geoLoading
            ? <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"/>
            : <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24"
                   stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
          }
          קרוב אליי
        </motion.button>
      </div>
    </div>
  )
}
