'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TEAL } from '@/lib/theme'

function useIsDesktop() {
  const [d, setD] = useState(false)
  useEffect(() => {
    setD(window.matchMedia('(min-width: 1024px)').matches)
    const mq = window.matchMedia('(min-width: 1024px)')
    const fn = e => setD(e.matches)
    mq.addEventListener('change', fn)
    return () => mq.removeEventListener('change', fn)
  }, [])
  return d
}

export function RiseLogo({ height = 26 }) {
  return (
    <div style={{ isolation: 'isolate', position: 'relative', display: 'inline-flex' }}>
      <img
        src="/rise-logo-mini.webp"
        alt="RISE"
        style={{ height, width: 'auto', display: 'block' }}
      />
      <div style={{
        position: 'absolute', inset: 0,
        background: TEAL,
        mixBlendMode: 'screen',
        pointerEvents: 'none',
      }} />
    </div>
  )
}

export default function Header({ onOpenPromo }) {
  const isDesktop = useIsDesktop()
  return (
    <div
      className="flex-shrink-0 flex items-center justify-center relative z-50"
      style={{
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        borderBottom: '1px solid rgba(26,107,122,0.12)',
        padding: '0',
      }}
    >
      <motion.button
        onClick={onOpenPromo}
        whileHover={{ opacity: 0.75 }}
        whileTap={{ scale: 0.96 }}
        aria-label="אודות RISE"
        style={{ padding: 0, lineHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <RiseLogo height={90} />
      </motion.button>
    </div>
  )
}
