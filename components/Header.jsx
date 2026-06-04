'use client'
import { motion } from 'framer-motion'

export default function Header({ onOpenPromo }) {
  return (
    <div
      className="flex-shrink-0 h-12 flex items-center justify-center relative z-50 border-b border-white/30"
      style={{
        background: 'rgba(255,255,255,0.08)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
      <motion.button
        onClick={onOpenPromo}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className="font-frank text-[20px] font-bold text-zinc-900 tracking-[0.18em] leading-none px-4"
        aria-label="אודות RISE"
      >
        RISE
      </motion.button>
    </div>
  )
}
