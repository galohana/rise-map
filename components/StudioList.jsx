'use client'
import { AnimatePresence, motion } from 'framer-motion'
import StudioCard, { cardVariants } from './StudioCard'

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      className="flex flex-col items-center justify-center py-24 px-6 text-center"
    >
      <div className="p-1.5 rounded-full bg-amber-50 ring-1 ring-amber-100 mb-5">
        <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center">
          <svg className="w-7 h-7 text-amber-400" fill="none" viewBox="0 0 24 24"
               stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round"
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
      <h3 className="font-frank text-zinc-900 text-xl font-semibold mb-1.5">לא נמצאו סטודיואים</h3>
      <p className="text-zinc-400 text-sm font-heebo">נסי לשנות את הפילטרים</p>
    </motion.div>
  )
}

export default function StudioList({ studios, selectedId, onCardClick }) {
  if (studios.length === 0) return <EmptyState />

  return (
    <div className="pt-4 pb-2">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="px-5 mb-3"
      >
        <span className="inline-block px-2.5 py-1 rounded-full bg-zinc-100
                         text-[11px] font-heebo font-medium text-zinc-500">
          {studios.length} סטודיואות
        </span>
      </motion.div>

      <motion.div
        key={studios.map(s => s.id).join(',')}
        variants={listVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence mode="popLayout">
          {studios.map(studio => (
            <StudioCard
              key={studio.id}
              studio={studio}
              isSelected={selectedId === studio.id}
              onClick={() => onCardClick(studio)}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
