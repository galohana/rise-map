'use client'
import { motion } from 'framer-motion'

export default function Header({ onOpenPromo }) {
  return (
    <div
      className="flex-shrink-0 h-12 flex items-center justify-center relative z-50"
      style={{
        background: 'rgba(255,254,249,0.82)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        borderBottom: '1px solid rgba(160,124,48,0.14)',
      }}
    >
      <motion.button
        onClick={onOpenPromo}
        whileHover={{ opacity: 0.72 }}
        whileTap={{ scale: 0.96 }}
        className="font-frank font-bold leading-none"
        style={{
          fontSize: '18px',
          letterSpacing: '0.26em',
          paddingInlineStart: '0.26em', /* optical centering */
          color: '#a07c30',
        }}
        aria-label="אודות RISE"
      >
        RISE
      </motion.button>
    </div>
  )
}
