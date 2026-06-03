import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from '../components/Header'
import FilterBar from '../components/FilterBar'
import StudioList from '../components/StudioList'
import MapView from '../components/MapView'
import Footer from '../components/Footer'
import { useStudios } from '../hooks/useStudios'

export default function HomePage() {
  const { studios, loading, error } = useStudios()
  const [filters, setFilters] = useState({ type: 'הכל', region: 'הכל', search: '' })
  const [selectedId, setSelectedId] = useState(null)
  const [mobileView, setMobileView] = useState('list')
  const mapRef = useRef(null)

  const filtered = studios.filter(s => {
    if (filters.type !== 'הכל' && s.type !== filters.type) return false
    if (filters.region !== 'הכל' && s.region !== filters.region) return false
    if (filters.search) {
      const q = filters.search.trim()
      if (!s.business_name.includes(q) && !s.city.includes(q)) return false
    }
    return true
  })

  const handleCardClick = useCallback(studio => {
    setSelectedId(studio.id)
    const lat = Number(studio.lat)
    const lng = Number(studio.lng)
    if (mapRef.current && !isNaN(lat) && !isNaN(lng)) {
      // MapLibre: center is [lng, lat], duration in ms
      mapRef.current.flyTo({ center: [lng, lat], zoom: 15, duration: 1200, essential: true })
    }
    setMobileView('map')
  }, [])

  const handleMarkerClick = useCallback(studio => {
    setSelectedId(studio.id)
    setMobileView('list')
    setTimeout(() => {
      document.getElementById(`card-${studio.id}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }, 130)
  }, [])

  const handleMapReady = useCallback(map => {
    mapRef.current = map
  }, [])

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#FAF8F5]" dir="rtl">
        <div className="text-center">
          <p className="font-frank text-[#1C1916] text-xl mb-2">שגיאה בטעינת הנתונים</p>
          <p className="text-[#A09A96] text-sm font-heebo">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-[#FAF8F5] overflow-hidden" dir="rtl">

      <Header />
      <FilterBar filters={filters} onChange={setFilters} />

      {/* Mobile toggle */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="lg:hidden flex-shrink-0 flex justify-center py-2
                   bg-white/80 backdrop-blur-sm border-b border-[#E8E2DC]/60"
      >
        <div className="flex bg-[#F0EBE4] rounded-full p-0.5 gap-0.5">
          {['list', 'map'].map(v => (
            <button
              key={v}
              onClick={() => setMobileView(v)}
              className="relative px-7 py-1.5 rounded-full text-[12.5px] font-heebo font-medium"
            >
              {mobileView === v && (
                <motion.div
                  layoutId="mobile-tab"
                  className="absolute inset-0 bg-[#1C1916] rounded-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <span className={`relative z-10 transition-colors duration-200
                                ${mobileView === v ? 'text-white' : 'text-[#6B6460]'}`}>
                {v === 'list' ? 'רשימה' : 'מפה'}
              </span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Main split */}
      <main className="flex flex-1 overflow-hidden min-h-0">

        {/* List panel */}
        <div className={`flex-col ltr-scroll overflow-y-auto
                         ${mobileView === 'map' ? 'hidden lg:flex' : 'flex'}
                         w-full lg:w-[42%] flex-shrink-0`}>
          <StudioList
            studios={filtered}
            loading={loading}
            selectedId={selectedId}
            onCardClick={handleCardClick}
          />
          {!loading && <Footer />}
        </div>

        {/* Divider */}
        <div className="hidden lg:block w-px bg-[#E8E2DC] flex-shrink-0" />

        {/* Map */}
        <div className={`flex-1 min-w-0 h-full
                         ${mobileView === 'list' ? 'hidden lg:block' : 'block'}`}>
          <MapView
            studios={filtered}
            selectedId={selectedId}
            onMarkerClick={handleMarkerClick}
            onMapReady={handleMapReady}
          />
        </div>

      </main>
    </div>
  )
}
