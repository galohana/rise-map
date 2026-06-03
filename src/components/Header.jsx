import { motion } from 'framer-motion'

export default function Header() {
  return (
    <div className="flex-shrink-0 flex justify-center px-4 pt-3 pb-1 relative z-50">
      <motion.header
        initial={{ y: -28, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 340, damping: 28, delay: 0.05 }}
        className="w-full max-w-[680px] flex items-center justify-between gap-4
                   px-4 py-2.5 rounded-full
                   bg-white/95 backdrop-blur-xl
                   ring-1 ring-zinc-200/80
                   shadow-[0_4px_24px_rgba(0,0,0,0.08),0_1px_3px_rgba(0,0,0,0.04)]"
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-zinc-900 flex items-center justify-center
                          shadow-[inset_0_1px_2px_rgba(255,255,255,0.08)]">
            <span className="font-frank text-[11px] font-black text-amber-400 leading-none">R</span>
          </div>
          <span className="font-frank text-[21px] font-bold text-zinc-900 tracking-tight leading-none">RISE</span>
          <div className="h-3.5 w-px bg-zinc-200" />
          <span className="text-zinc-400 text-[12px] font-heebo hidden sm:block leading-none">רשת הסטודיואים</span>
        </div>

        {/* CTA */}
        <motion.a
          href="https://rise-builder.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="group flex items-center gap-2 bg-zinc-900 text-white
                     text-[12px] font-heebo font-semibold
                     px-3.5 py-2 rounded-full
                     shadow-[0_2px_10px_rgba(0,0,0,0.22)]
                     hover:bg-amber-500 transition-colors duration-500"
        >
          <span className="hidden sm:inline">רוצה אתר משלך?</span>
          <span className="sm:hidden">הצטרפי</span>
          <div className="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center
                          group-hover:translate-x-[-2px] group-hover:-translate-y-[1px] group-hover:scale-105
                          transition-all duration-300">
            <svg className="w-2.5 h-2.5 rotate-180" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </motion.a>
      </motion.header>
    </div>
  )
}
