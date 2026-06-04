'use client'
import { useState, useCallback, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import Header from './Header'
import FilterBar from './FilterBar'
import StudioPanel from './StudioPanel'
import StudioDrawer from './StudioDrawer'
import PromoModal from './PromoModal'

const MapClient = dynamic(() => import('./MapClient'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-[#eae6df] animate-pulse" />,
})

const isMobile = () =>
  typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches

export default function HomeClient({ studios }) {
  const [filters, setFilters] = useState({ type: 'הכל', search: '' })
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const [panelStudio, setPanelStudio] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [promoOpen, setPromoOpen] = useState(false)
  const mapRef = useRef(null)

  // Debounce the search box (300ms) → drives filtering of list + pins.
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(filters.search.trim()), 300)
    return () => clearTimeout(t)
  }, [filters.search])

  const filtered = studios.filter(s => {
    if (filters.type !== 'הכל' && s.type !== filters.type) return false
    if (debouncedSearch) {
      const q = debouncedSearch
      const hay = `${s.business_name || ''} ${s.city || ''} ${s.owner_name || ''}`
      if (!hay.includes(q)) return false
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
    setSelectedId(studio.id)
    setPanelStudio(studio)
    setDrawerOpen(false)
    setTimeout(() => flyToStudio(studio), isMobile() ? 120 : 0)
  }, [flyToStudio])

  const handleClose = useCallback(studio => {
    setPanelStudio(null)
    const map = mapRef.current
    if (isMobile() && map && studio) {
      const lat = Number(studio.lat)
      const lng = Number(studio.lng)
      if (!Number.isNaN(lat) && !Number.isNaN(lng)) map.flyTo([lat, lng], 13, { duration: 0.8 })
    }
  }, [])

  const handleMapReady = useCallback(map => { mapRef.current = map }, [])

  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden bg-[#FAF8F5]" dir="rtl">
      <Header onOpenPromo={() => setPromoOpen(true)} />
      <FilterBar filters={filters} onChange={setFilters} />

      {/* Full-screen map */}
      <main className="relative flex-1 min-h-0">
        <MapClient
          studios={filtered}
          selectedId={selectedId}
          onMarkerClick={openStudio}
          onReady={handleMapReady}
        />
      </main>

      {/* Floating list button (bottom-left) */}
      <motion.button
        onClick={() => setDrawerOpen(true)}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: 'spring', stiffness: 400, damping: 24, delay: 0.4 }}
        aria-label="רשימת הסטודיואות"
        className="fixed bottom-5 left-5 z-[950] w-12 h-12 rounded-full flex items-center justify-center text-xl"
        style={{
          background: 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.6)',
          boxShadow: '0 6px 20px rgba(0,0,0,0.18)',
        }}
      >
        📋
      </motion.button>

      {/* List drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <StudioDrawer
            studios={filtered}
            selectedId={selectedId}
            onCardClick={openStudio}
            onClose={() => setDrawerOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Studio detail panel */}
      <AnimatePresence>
        {panelStudio && (
          <StudioPanel
            key={panelStudio.id}
            studio={panelStudio}
            onClose={() => handleClose(panelStudio)}
          />
        )}
      </AnimatePresence>

      {/* Promo modal */}
      <AnimatePresence>
        {promoOpen && <PromoModal onClose={() => setPromoOpen(false)} />}
      </AnimatePresence>
    </div>
  )
}
