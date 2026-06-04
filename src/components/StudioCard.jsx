import { motion } from 'framer-motion'
import { categoryMeta, pinGlyph } from '../lib/categories'

/** Adapt shared category meta to the shape this card uses. */
function cardStyle(type) {
  const m = categoryMeta(type)
  return { bg: m.soft, text: m.text, border: m.color + '55', ring: m.color }
}

export const cardVariants = {
  hidden: { opacity: 0, y: 16, filter: 'blur(4px)' },
  visible: {
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { type: 'spring', stiffness: 320, damping: 28 },
  },
  exit: { opacity: 0, scale: 0.96, transition: { duration: 0.18 } },
}

export default function StudioCard({ studio, isSelected, onClick }) {
  const s = cardStyle(studio.type)

  return (
    <motion.div
      variants={cardVariants}
      layout
      onClick={onClick}
      className="mx-4 mb-3 cursor-pointer group"
    >
      <motion.div
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.985 }}
        transition={{ type: 'spring', stiffness: 420, damping: 28 }}
        /* Outer shell */
        className={`p-[5px] rounded-[1.6rem] ring-1 transition-all duration-400
          ${isSelected
            ? 'ring-zinc-300 bg-zinc-50'
            : 'ring-zinc-200 bg-zinc-50/60 hover:ring-zinc-300 hover:shadow-[0_4px_20px_rgba(0,0,0,0.07)]'}`}
        style={isSelected ? {
          boxShadow: `0 6px 28px ${s.ring}40`,
          ringColor: s.ring,
          background: s.bg + 'cc',
        } : {}}
      >
        {/* Inner core */}
        <article
          id={`card-${studio.id}`}
          className="bg-white rounded-[1.25rem] overflow-hidden"
        >
          <div className="p-3.5 flex items-start gap-3">

            {/* Avatar */}
            <div
              className="shrink-0 w-11 h-11 rounded-[0.875rem] flex items-center justify-center ring-1"
              style={{ background: s.bg, borderColor: s.border + '80' }}
            >
              {studio.logo_url
                ? <img src={studio.logo_url} alt={studio.business_name}
                        className="w-full h-full object-cover rounded-[0.875rem]" loading="lazy" />
                : <span className="text-xl leading-none">{pinGlyph(studio)}</span>
              }
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">

              {/* Name + badge */}
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <h2 className="font-frank font-bold text-zinc-900 text-[14.5px] leading-snug truncate">
                  {studio.business_name}
                </h2>
                <span
                  className="shrink-0 px-2.5 py-0.5 rounded-full text-[11px] font-heebo font-semibold"
                  style={{ background: s.bg, color: s.text }}
                >
                  {studio.type}
                </span>
              </div>

              {/* Location */}
              <div className="flex items-center gap-1.5 text-zinc-400 text-[12px] font-heebo mb-3">
                <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="truncate text-zinc-500">{studio.address || studio.city}</span>
                {studio.region && (
                  <>
                    <span className="text-zinc-300">·</span>
                    <span className="text-zinc-400 shrink-0">{studio.region}</span>
                  </>
                )}
              </div>

              {/* Rating */}
              {studio.rating != null && (
                <div className="flex items-center gap-0.5 mb-3">
                  {[1,2,3,4,5].map(i => (
                    <svg key={i} className="w-3 h-3"
                         fill={i <= Math.round(studio.rating) ? '#F59E0B' : '#E4E4E7'}
                         viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                  <span className="text-[11px] text-zinc-400 font-heebo ms-1">{studio.rating}</span>
                </div>
              )}

              {/* CTA — Button-in-Button */}
              <a
                href={studio.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="group/cta inline-flex items-center gap-1.5 text-white
                           text-[11.5px] font-heebo font-semibold
                           px-3.5 py-1.5 rounded-full active:scale-95
                           transition-all duration-300"
                style={{
                  background: s.text,
                  boxShadow: `0 2px 10px ${s.ring}45`,
                }}
                onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.1)' }}
                onMouseLeave={e => { e.currentTarget.style.filter = '' }}
              >
                כניסה לאתר
                <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center
                                group-hover/cta:translate-x-[-2px] group-hover/cta:-translate-y-[1px]
                                group-hover/cta:scale-110 transition-all duration-300">
                  <svg className="w-2 h-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
              </a>
            </div>
          </div>

          {/* Selected gradient bar */}
          {isSelected && (
            <motion.div
              layoutId="selected-bar"
              className="h-[3px] w-full"
              style={{ background: `linear-gradient(90deg, transparent 0%, ${s.text} 30%, ${s.text} 70%, transparent 100%)` }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
        </article>
      </motion.div>
    </motion.div>
  )
}
