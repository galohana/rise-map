'use client'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import StudioList from './StudioList'

export default function StudioDrawer({ studios, selectedId, onCardClick, onClose }) {
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <>
      {/* Overlay */}
      <motion.div
        className="fixed inset-0 z-[1150] bg-black"
        initial={{ opacity: 0 }} animate={{ opacity: 0.2 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
      />

      {/* Drawer — slides in from the right; swipe right to dismiss */}
      <motion.aside
        dir="rtl"
        className="fixed top-0 right-0 bottom-0 z-[1151] w-[85vw] max-w-[420px]
                   bg-[#FAF8F5] shadow-[-8px_0_40px_rgba(0,0,0,0.18)] flex flex-col"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 350, damping: 35 }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={{ left: 0, right: 0.5 }}
        onDragEnd={(e, info) => { if (info.offset.x > 90) onClose() }}
      >
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-5 h-14 border-b border-[#E8E2DC]">
          <h2 className="font-frank text-[18px] font-bold text-[#1C1916]">הסטודיואות</h2>
          <button onClick={onClose} aria-label="סגור"
            className="w-8 h-8 rounded-full hover:bg-[#EDE8E2] flex items-center justify-center text-[#6B6460] transition">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto ltr-scroll">
          <StudioList
            studios={studios}
            selectedId={selectedId}
            onCardClick={onCardClick}
          />
        </div>
      </motion.aside>
    </>
  )
}
