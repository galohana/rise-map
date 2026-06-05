'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { categoryMeta, pinGlyph } from '@/lib/categories'

function useIsMobile() {
  const [mobile, setMobile] = useState(
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 768px)').matches : false
  )
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    const fn = e => setMobile(e.matches)
    mq.addEventListener('change', fn)
    return () => mq.removeEventListener('change', fn)
  }, [])
  return mobile
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
}
const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 380, damping: 30 } },
}

function SectionDivider() {
  return <div className="h-px bg-zinc-200/70" />
}

/* ── Fanned cards gallery ── */
function GalleryFan({ images, onExpand }) {
  const STRIP = 20
  const CARD_H = 140
  const count = Math.min(images.length, 3)
  const containerH = CARD_H + (count - 1) * STRIP
  const rotations = [1.5, -3, -7]

  return (
    <motion.div
      className="relative mx-auto cursor-pointer"
      style={{ height: `${containerH}px`, maxWidth: '260px', width: '100%' }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={onExpand}
    >
      {images.slice(0, count).map((url, i) => {
        // i=0 → front card (highest z, lowest top position)
        // i=count-1 → back card (lowest z, top=0, only strip visible)
        const topOffset = (count - 1 - i) * STRIP
        const zIdx = i + 1
        const rot = rotations[count - 1 - i] ?? 0
        const isFront = i === 0
        return (
          <motion.div
            key={i}
            className="absolute left-0 right-0 rounded-xl overflow-hidden"
            style={{
              top: `${topOffset}px`,
              height: `${CARD_H}px`,
              zIndex: zIdx,
              transform: `rotate(${rot}deg)`,
              border: '2.5px solid white',
              boxShadow: isFront
                ? '0 6px 24px rgba(0,0,0,0.22)'
                : '0 2px 8px rgba(0,0,0,0.1)',
              opacity: isFront ? 1 : 0.88,
            }}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: isFront ? 1 : 0.88, y: 0 }}
            transition={{ delay: i * 0.07, type: 'spring', stiffness: 300, damping: 28 }}
          >
            <img src={url} alt="" className="w-full h-full object-cover" />
          </motion.div>
        )
      })}

      {images.length > 3 && (
        <div className="absolute z-[10] bg-black/55 text-white text-[10px] rounded-full px-2 py-0.5 font-heebo"
             style={{ bottom: 8, left: 8 }}>
          +{images.length - 3}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="absolute z-[10] text-[10px] font-heebo text-white rounded-full px-2 py-0.5"
        style={{ bottom: 8, right: 8, background: 'rgba(0,0,0,0.38)' }}
      >
        הקש לצפייה
      </motion.div>
    </motion.div>
  )
}

/* ── Carousel (shown after clicking fan) ── */
function GalleryCarousel({ images, onClose, color }) {
  const [idx, setIdx] = useState(0)

  const prev = () => setIdx(i => (i - 1 + images.length) % images.length)
  const next = () => setIdx(i => (i + 1) % images.length)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-xl overflow-hidden"
      style={{ height: '180px' }}
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={idx}
          src={images[idx]}
          alt=""
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.22 }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />

      {images.length > 1 && (
        <>
          <button onClick={prev} aria-label="הקודם"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full
                       bg-black/40 hover:bg-black/60 flex items-center justify-center text-white
                       text-lg transition-colors leading-none">
            ›
          </button>
          <button onClick={next} aria-label="הבא"
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full
                       bg-black/40 hover:bg-black/60 flex items-center justify-center text-white
                       text-lg transition-colors leading-none">
            ‹
          </button>

          {/* Dots */}
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5 items-center">
            {images.map((_, i) => (
              <motion.button
                key={i}
                onClick={() => setIdx(i)}
                animate={{ width: i === idx ? 14 : 6, opacity: i === idx ? 1 : 0.55 }}
                transition={{ duration: 0.2 }}
                className="rounded-full bg-white"
                style={{ height: 6 }}
              />
            ))}
          </div>
        </>
      )}

      {/* Counter */}
      <div className="absolute top-2 left-2 text-[10px] font-heebo text-white bg-black/40 rounded-full px-2 py-0.5">
        {idx + 1}/{images.length}
      </div>

      {/* Close */}
      <button onClick={onClose} aria-label="סגור גלריה"
        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/40 hover:bg-black/60
                   flex items-center justify-center text-white text-base transition-colors leading-none">
        ×
      </button>
    </motion.div>
  )
}

/* ── Social links ── */
function SocialLinks({ studio }) {
  const lat = Number(studio.lat)
  const lng = Number(studio.lng)
  const hasGeo = !Number.isNaN(lat) && !Number.isNaN(lng)
  const wa = studio.whatsapp ? String(studio.whatsapp).replace(/\D/g, '').replace(/^0/, '') : ''

  const icons = []

  if (studio.facebook_url)
    icons.push({ key: 'fb', href: studio.facebook_url, label: 'Facebook', bg: '#1877F2',
      svg: <path fill="#fff" d="M13.5 21v-7h2.3l.4-2.8h-2.7V9.4c0-.8.2-1.4 1.4-1.4h1.4V5.6c-.7-.1-1.4-.1-2.1-.1-2.1 0-3.5 1.3-3.5 3.6v2.1H8.3V14h2.3v7h2.9z"/> })
  if (studio.instagram_url)
    icons.push({ key: 'ig', href: studio.instagram_url, label: 'Instagram',
      bg: 'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)',
      svg: <><rect x="6" y="6" width="12" height="12" rx="3.5" fill="none" stroke="#fff" strokeWidth="1.8"/><circle cx="12" cy="12" r="3" fill="none" stroke="#fff" strokeWidth="1.8"/><circle cx="15.6" cy="8.4" r="1" fill="#fff"/></> })
  if (studio.google_url)
    icons.push({ key: 'g', href: studio.google_url, label: 'Google', bg: '#ffffff', ring: true,
      svg: <><path fill="#4285F4" d="M21.6 12.2c0-.6-.1-1.2-.2-1.8H12v3.4h5.4c-.2 1.2-.9 2.3-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.1z"/><path fill="#34A853" d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 .9-3.4.9-2.6 0-4.8-1.7-5.6-4.1H3.1v2.6C4.7 19.8 8.1 22 12 22z"/><path fill="#FBBC05" d="M6.4 13.9c-.2-.6-.3-1.2-.3-1.9s.1-1.3.3-1.9V7.5H3.1C2.4 8.9 2 10.4 2 12s.4 3.1 1.1 4.5l3.3-2.6z"/><path fill="#EA4335" d="M12 6c1.5 0 2.8.5 3.8 1.5l2.8-2.8C16.9 3.1 14.7 2 12 2 8.1 2 4.7 4.2 3.1 7.5l3.3 2.6C7.2 7.7 9.4 6 12 6z"/></> })
  if (wa)
    icons.push({ key: 'wa', href: `https://wa.me/972${wa}`, label: 'WhatsApp', bg: '#25D366',
      svg: <path fill="#fff" d="M12 4a8 8 0 00-6.9 12l-1 3.6 3.7-1A8 8 0 1012 4zm0 1.6a6.4 6.4 0 11-3.3 11.9l-.3-.2-2.2.6.6-2.1-.2-.3A6.4 6.4 0 0112 5.6zm3.6 8c-.2-.1-1.2-.6-1.3-.6-.2-.1-.3-.1-.4.1l-.6.7c-.1.1-.2.1-.4 0a5.2 5.2 0 01-2.6-2.3c-.2-.3.2-.3.5-1 0-.1 0-.2 0-.3l-.6-1.4c-.1-.3-.3-.3-.4-.3h-.4a.8.8 0 00-.6.3c-.2.2-.7.7-.7 1.7s.8 2 .9 2.1c.1.2 1.6 2.5 3.9 3.4 1.5.6 2 .6 2.7.5.4 0 1.2-.5 1.4-1 .2-.5.2-.9.1-1z"/> })
  if (hasGeo)
    icons.push({ key: 'waze', href: `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`, label: 'Waze',
      bg: 'linear-gradient(135deg,#2D9CDB 0%,#5B5BD6 100%)',
      svg: <path fill="#fff" d="M12 3C7.6 3 4 6.1 4 10c0 1.5.5 2.9 1.4 4-.1.8-.5 1.7-1.2 2.3-.3.2-.1.7.2.8 1.4.4 2.9.1 4-.6 1.1.5 2.4.7 3.6.7 4.4 0 8-3.1 8-7.2S16.4 3 12 3zM9.2 11a1 1 0 110-2 1 1 0 010 2zm5.6 0a1 1 0 110-2 1 1 0 010 2z"/> })

  if (icons.length === 0) return null

  return (
    <div className="flex items-center justify-center gap-2.5 flex-wrap">
      {icons.map(ic => (
        <a key={ic.key} href={ic.href} target="_blank" rel="noopener noreferrer" aria-label={ic.label}
           className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform
                       hover:scale-110 active:scale-95 ${ic.ring ? 'ring-1 ring-zinc-200' : ''}`}
           style={{ background: ic.bg, boxShadow: '0 2px 8px rgba(0,0,0,0.14)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24">{ic.svg}</svg>
        </a>
      ))}
    </div>
  )
}

export default function StudioPanel({ studio, onClose }) {
  const isMobile = useIsMobile()
  const { color, soft } = categoryMeta(studio.type)
  const glyph = pinGlyph(studio)
  const [galleryOpen, setGalleryOpen] = useState(false)

  const galleryImages = Array.isArray(studio.gallery_urls)
    ? studio.gallery_urls.filter(Boolean)
    : []

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const hasAge = studio.owner_age != null && studio.owner_age !== ''
  const hasYears = studio.years_experience != null && studio.years_experience !== ''
  const hasSpecialty = Boolean(studio.specialty && String(studio.specialty).trim())
  const hasDescription = Boolean(studio.custom_description && String(studio.custom_description).trim())
  const hasUrl = Boolean(studio.url && String(studio.url).trim())

  const panelMotion = isMobile
    ? { initial: { x: '100%' }, animate: { x: 0 }, exit: { x: '100%' },
        transition: { type: 'spring', stiffness: 350, damping: 35 } }
    : { initial: { x: 400, opacity: 0 }, animate: { x: 0, opacity: 1 }, exit: { x: 400, opacity: 0 },
        transition: { type: 'spring', stiffness: 300, damping: 30 } }

  const glass = {
    background: 'rgba(255,255,255,0.82)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: `1.5px solid ${color}`,
    boxShadow: `0 8px 40px ${color}33, 0 2px 12px rgba(0,0,0,0.08)`,
  }

  const mobileStyle = {
    position: 'fixed', right: 0, top: '104px', width: '75vw', height: '52vh',
    borderRadius: '20px 0 0 20px', zIndex: 1101,
  }
  const desktopClass = 'fixed z-[1101] top-3 bottom-3 right-3 w-[380px] rounded-[20px]'

  return (
    <>
      {!isMobile && (
        <motion.div
          className="fixed inset-0 z-[1100] bg-black"
          initial={{ opacity: 0 }} animate={{ opacity: 0.15 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        />
      )}

      <motion.aside
        dir="rtl"
        className={`overflow-hidden flex flex-col ${isMobile ? '' : desktopClass}`}
        style={isMobile ? { ...glass, ...mobileStyle } : glass}
        {...panelMotion}
      >
        {/* Close */}
        <button onClick={onClose} aria-label="סגור"
          className="absolute top-3 left-3 z-10 w-8 h-8 rounded-full bg-white/70 hover:bg-white
                     flex items-center justify-center text-zinc-600 shadow-sm transition">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* ── COMPACT HERO ── */}
        <div className="flex-shrink-0 px-5 pt-5 pb-3 pe-12">
          <div className="flex items-center gap-3">
            {studio.logo_url ? (
              <img src={studio.logo_url} alt={studio.business_name}
                   className="w-12 h-12 rounded-full object-cover shrink-0 shadow-sm"
                   style={{ border: `2px solid ${color}` }} />
            ) : (
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shrink-0 shadow-sm"
                   style={{ background: soft, border: `2px solid ${color}` }}>
                {glyph}
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="font-frank text-[18px] font-bold text-zinc-900 leading-tight truncate">
                  {studio.business_name}
                </h2>
                <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-heebo font-semibold"
                      style={{ background: soft, color }}>
                  {studio.type}
                </span>
              </div>
              {studio.owner_name && (
                <p className="font-heebo text-[13px] text-zinc-500 truncate mt-0.5">
                  {studio.owner_name}{hasAge ? `, ${studio.owner_age}` : ''}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── SCROLLABLE CONTENT ── */}
        <motion.div
          variants={container} initial="hidden" animate="show"
          className="flex-1 overflow-y-auto px-5 pb-4 space-y-3"
        >
          {/* Gallery — fanned cards or carousel */}
          {galleryImages.length > 0 && (
            <motion.div variants={item}>
              <AnimatePresence mode="wait">
                {galleryOpen ? (
                  <GalleryCarousel
                    key="carousel"
                    images={galleryImages}
                    onClose={() => setGalleryOpen(false)}
                    color={color}
                  />
                ) : (
                  <GalleryFan
                    key="fan"
                    images={galleryImages}
                    onExpand={() => setGalleryOpen(true)}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {galleryImages.length > 0 && (
            <motion.div variants={item}><SectionDivider /></motion.div>
          )}

          <motion.div variants={item}><SocialLinks studio={studio} /></motion.div>

          <motion.div variants={item}><SectionDivider /></motion.div>

          {/* Location */}
          <motion.div variants={item} className="flex items-center justify-center gap-1.5 text-zinc-600">
            <svg className="w-4 h-4 shrink-0" style={{ color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="font-heebo text-[14px] font-medium text-zinc-800">
              {studio.address || studio.city}
            </span>
          </motion.div>

          {/* Expertise */}
          {(hasYears || hasSpecialty) && (
            <motion.div variants={item} className="text-center">
              <p className="font-heebo text-[13.5px] text-zinc-600">
                {hasYears && `${studio.years_experience} שנות ניסיון`}
                {hasYears && hasSpecialty && ' · '}
                {hasSpecialty && <span style={{ color }} className="font-medium">{studio.specialty}</span>}
              </p>
            </motion.div>
          )}

          {/* Description */}
          {hasDescription && (
            <motion.div variants={item}>
              <p className="font-heebo text-[13.5px] leading-relaxed italic text-[#6B5E4F] text-center px-1">
                {studio.custom_description}
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* ── STICKY CTA ── */}
        {hasUrl && (
          <div className="flex-shrink-0 p-4 border-t border-zinc-200/70 bg-white/40">
            <a href={studio.url} target="_blank" rel="noopener noreferrer"
               className="flex items-center justify-center gap-2 w-full h-12 rounded-xl
                          font-heebo font-bold text-[15px] text-white
                          transition-transform active:scale-[0.98]"
               style={{ background: color, boxShadow: `0 4px 16px ${color}55` }}>
              כניסה לאתר
              <span className="text-[17px] leading-none">←</span>
            </a>
          </div>
        )}
      </motion.aside>
    </>
  )
}
