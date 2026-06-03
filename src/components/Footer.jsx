import { motion } from 'framer-motion'

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="px-5 py-8 mt-2 border-t border-zinc-100"
    >
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-5 h-5 rounded-full bg-zinc-900 flex items-center justify-center">
            <span className="text-amber-400 text-[8px] font-black font-frank">R</span>
          </div>
          <span className="font-frank text-zinc-900 text-base font-semibold">RISE</span>
        </div>
        <p className="text-zinc-400 text-[12px] font-heebo">
          כל הסטודיואים פועלים תחת מערכת ניהול RISE
        </p>
        <div className="pt-1">
          <motion.a
            href="https://rise-builder.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 bg-zinc-900 text-white
                       text-[12px] font-heebo font-semibold px-5 py-2 rounded-full
                       hover:bg-amber-500 transition-colors duration-500"
          >
            רוצה אתר עסקי משלך?
            <div className="w-4 h-4 rounded-full bg-white/15 flex items-center justify-center text-[9px]">↗</div>
          </motion.a>
        </div>
      </div>
    </motion.footer>
  )
}
