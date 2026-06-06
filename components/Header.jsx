'use client'
import { motion } from 'framer-motion'

/** Renders the RISE logo with black-to-teal recoloring via screen blend mode.
 *  The overlay approach: white parts of logo stay white, black parts become teal. */
export function RiseLogo({ height = 26 }) {
  return (
    <div style={{ isolation: 'isolate', position: 'relative', display: 'inline-flex' }}>
      <img
        src="/rise-logo.webp"
        alt="RISE"
        style={{ height, width: 'auto', display: 'block' }}
      />
      <div style={{
        position: 'absolute', inset: 0,
        background: '#1a6b7a',
        mixBlendMode: 'screen',
        pointerEvents: 'none',
      }} />
    </div>
  )
}

export default function Header({ onOpenPromo }) {
  return (
    <div
      className="flex-shrink-0 h-12 flex items-center justify-center relative z-50"
      style={{
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        borderBottom: '1px solid rgba(26,107,122,0.12)',
      }}
    >
      <motion.button
        onClick={onOpenPromo}
        whileHover={{ opacity: 0.75 }}
        whileTap={{ scale: 0.96 }}
        aria-label="אודות RISE"
        className="flex items-center justify-center"
      >
        <RiseLogo height={26} />
      </motion.button>
    </div>
  )
}
