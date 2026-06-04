'use client'
import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import Header from './Header'
import FilterBar from './FilterBar'
import StudioList from './StudioList'
import StudioPanel from './StudioPanel'
import Footer from './Footer'

/* Leaflet touches `window` → must be client-only. ssr:false is allowed here
   because HomeClient is itself a Client Component. */
const MapClient = dynamic(() => import('./MapClient'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-[#eae6df] animate-pulse" />,
})

export default function HomeClient({ studios }) {
  const [filters, setFilters] = useState({ type: 'הכל', region: 'הכל', search: '' })
  const [selectedId, setSelectedId] = useState(null)
  const [panelStudio, setPanelStudio] = useState(null)
  const [focus, setFocus] = useState(null)
  const [mobileView, setMobileView] = useState('list')

  const filtered = studios.filter(s => {
    if (filters.type !== 'הכל' && s.type !== filters.type) return false
    if (filters.region !== 'הכל' && s.region !== filters.region) return false
    if (filters.search) {
      const q = filters.search.trim()
      if (!s.business_name.includes(q) && !s.city.includes(q)) return false
    }
    return true
  })

  const openStudio = useCallback(studio => {
    setSelectedId(studio.id)
    setPanelStudio(studio)
    setFocus({ ...studio, _t: Date.now() }) // new ref each time → re-fly even if same studio
  }, [])

  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden bg-[#FAF8F5]" dir="rtl">
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
        {/* List */}
        <div className={`flex-col ltr-scroll overflow-y-auto
                         ${mobileView === 'map' ? 'hidden lg:flex' : 'flex'}
                         w-full lg:w-[42%] flex-shrink-0`}>
          <StudioList
            studios={filtered}
            selectedId={selectedId}
            onCardClick={openStudio}
          />
          <Footer />
        </div>

        <div className="hidden lg:block w-px bg-[#E8E2DC] flex-shrink-0" />

        {/* Map */}
        <div className={`flex-1 min-w-0 h-full
                         ${mobileView === 'list' ? 'hidden lg:block' : 'block'}`}>
          <MapClient
            studios={filtered}
            selectedId={selectedId}
            focus={focus}
            onMarkerClick={openStudio}
          />
        </div>
      </main>

      {/* Detail panel */}
      <AnimatePresence>
        {panelStudio && (
          <StudioPanel
            key={panelStudio.id}
            studio={panelStudio}
            onClose={() => setPanelStudio(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
