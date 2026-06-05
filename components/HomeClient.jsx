'use client'
import { useState, useCallback, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import Header from './Header'
import FilterBar from './FilterBar'
import StudioPanel from './StudioPanel'
import StudioDrawer from './StudioDrawer'
import PromoModal from './PromoModal'
import SearchHome from './SearchHome'
import ResultsList from './ResultsList'

const MapClient = dynamic(() => import('./MapClient'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-[#eae6df] animate-pulse" />,
})

const isMobile = () =>
  typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches

export default function HomeClient({ studios }) {
  // 'home' | 'results' | 'map'
  const [view, setView] = useState('home')
  const [filters, setFilters] = useState({ type: 'הכל', search: '' })
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const [panelStudio, setPanelStudio] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [promoOpen, setPromoOpen] = useState(false)
  const [geoError, setGeoError] = useState('')
  const mapRef = useRef(null)

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(filters.search.trim()), 300)
    return () => clearTimeout(t)
  }, [filters.search])

  const filtered = studios.filter(s => {
    if (filters.type !== 'הכל' && s.type !== filters.type) return false
    if (debouncedSearch) {
      const hay = `${s.business_name || ''} ${s.city || ''} ${s.owner_name || ''}`
      if (!hay.includes(debouncedSearch)) return false
    }
    return true
  })

  const flyToStudio = useCallback(studio => {
    const map = mapRef.current
    if (!map) return
    const lat = Number(studio.lat)
    const lng = Number(studio.lng)
    if (Number.isNaN(lat) || Number.isNaN(lng)) return

    if (isMobile()) {
      map.flyTo([lat, lng], 15, { duration: 1 })
      map.once('moveend', () => {
        map.panBy([Math.round(window.innerWidth * 0.35), 0], { animate: true, duration: 0.4 })
      })
    } else {
      map.flyTo([lat, lng], 14, { duration: 1.1 })
    }
  }, [])

  const openStudio = useCallback(studio => {
    setView('map')
    setSelectedId(studio.id)
    setPanelStudio(studio)
    setDrawerOpen(false)
    setTimeout(() => flyToStudio(studio), isMobile() ? 200 : 50)
  }, [flyToStudio])

  // Close panel → always go back to home (not map)
  const handleClose = useCallback(() => {
    setPanelStudio(null)
    setSelectedId(null)
    setView('home')
  }, [])

  const handleMapReady = useCallback(map => { mapRef.current = map }, [])

  const handleSearch = useCallback(query => {
    setFilters(prev => ({ ...prev, search: query }))
    setView('results')
  }, [])

  const handleCategorySelect = useCallback(cat => {
    setFilters({ type: cat, search: '' })
    setView('results')
  }, [])

  const handleGeolocate = useCallback((onError) => {
    if (!navigator.geolocation) {
      onError?.('הדפדפן אינו תומך באיתור מיקום')
      return
    }

    // iOS Safari REQUIRES getCurrentPosition to be called synchronously
    // within the user-gesture handler — do NOT defer it behind a promise.
    // Call it immediately, then handle the result.
    navigator.geolocation.getCurrentPosition(
      pos => {
        setGeoError('')
        setView('map')
        setTimeout(() => {
          mapRef.current?.flyTo(
            [pos.coords.latitude, pos.coords.longitude], 14, { duration: 1.2 }
          )
        }, 420)
      },
      err => {
        if (err.code === 1 /* PERMISSION_DENIED */) {
          const msg = 'לאיתור מיקום — אפשר גישה בהגדרות הדפדפן'
          setGeoError(msg)
          onError?.(msg)
        } else {
          // Timeout / unavailable → just show the map
          setView('map')
        }
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 }
    )
  }, [])

  const showMap = view === 'map'

  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden bg-[#FAF8F5]" dir="rtl">
      {/* Map header + filter — always in DOM so map height stays constant */}
      <Header onOpenPromo={() => setPromoOpen(true)} />
      <FilterBar filters={filters} onChange={setFilters} />

      {/* Full-screen map — always rendered (covered by overlays when not in map view) */}
      <main className="relative flex-1 min-h-0">
        <MapClient
          studios={filtered}
          selectedId={selectedId}
          onMarkerClick={openStudio}
          onReady={handleMapReady}
        />
      </main>

      {/* ── View overlays ── */}
      <AnimatePresence mode="wait">
        {view === 'home' && (
          <SearchHome
            key="home"
            studios={studios}
            filters={filters}
            onSearch={handleSearch}
            onCategorySelect={handleCategorySelect}
            onGeolocate={handleGeolocate}
            geoError={geoError}
            onClearGeoError={() => setGeoError('')}
            onOpenPromo={() => setPromoOpen(true)}
          />
        )}
        {view === 'results' && (
          <ResultsList
            key="results"
            studios={filtered}
            filters={filters}
            onBack={() => setView('home')}
            onCardClick={openStudio}
            onFiltersChange={setFilters}
          />
        )}
      </AnimatePresence>

      {/* ── Floating dynamic button (bottom-left) ── */}
      <motion.button
        onClick={() => setView(showMap ? 'home' : 'map')}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.91 }}
        transition={{ type: 'spring', stiffness: 400, damping: 24, delay: 0.4 }}
        aria-label={showMap ? 'חזרה לחיפוש' : 'פתיחת מפה'}
        className="fixed bottom-5 left-5 z-[1050] w-[52px] h-[52px] rounded-full flex items-center justify-center"
        style={{
          background: 'rgba(255,255,255,0.76)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.65)',
          boxShadow: '0 6px 24px rgba(0,0,0,0.15)',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={showMap ? 'search-icon' : 'map-icon'}
            initial={{ opacity: 0, scale: 0.55, rotate: -18 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.55, rotate: 18 }}
            transition={{ duration: 0.18 }}
            className="text-[22px] leading-none select-none"
          >
            {showMap ? '🔍' : '🗺️'}
          </motion.span>
        </AnimatePresence>
      </motion.button>

      {/* ── List drawer (map view only) ── */}
      <AnimatePresence>
        {drawerOpen && showMap && (
          <StudioDrawer
            studios={filtered}
            selectedId={selectedId}
            onCardClick={openStudio}
            onClose={() => setDrawerOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Studio detail panel ── */}
      <AnimatePresence>
        {panelStudio && (
          <StudioPanel
            key={panelStudio.id}
            studio={panelStudio}
            onClose={handleClose}
          />
        )}
      </AnimatePresence>

      {/* ── Promo modal ── */}
      <AnimatePresence>
        {promoOpen && <PromoModal onClose={() => setPromoOpen(false)} />}
      </AnimatePresence>
    </div>
  )
}
