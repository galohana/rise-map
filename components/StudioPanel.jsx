'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { categoryMeta, pinGlyph } from '@/lib/categories'

/* Mobile = <=768px → floating side card. Desktop = slide-in right. */
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
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.12 } },
}
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 380, damping: 30 } },
}

function SectionDivider() {
  return <div className="h-px bg-zinc-200/70 mx-1" />
}

/* ── Social + Waze icon row (each shown only when a link exists; Waze always) ── */
function SocialLinks({ studio }) {
  const lat = Number(studio.lat)
  const lng = Number(studio.lng)
  const hasGeo = !Number.isNaN(lat) && !Number.isNaN(lng)
  const wa = studio.whatsapp ? String(studio.whatsapp).replace(/\D/g, '').replace(/^0/, '') : ''

  const icons = []

  if (studio.facebook_url)
    icons.push({
      key: 'fb', href: studio.facebook_url, label: 'Facebook', bg: '#1877F2',
      svg: <path fill="#fff" d="M13.5 21v-7h2.3l.4-2.8h-2.7V9.4c0-.8.2-1.4 1.4-1.4h1.4V5.6c-.7-.1-1.4-.1-2.1-.1-2.1 0-3.5 1.3-3.5 3.6v2.1H8.3V14h2.3v7h2.9z"/>,
    })
  if (studio.instagram_url)
    icons.push({
      key: 'ig', href: studio.instagram_url, label: 'Instagram',
      bg: 'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)',
      svg: <><rect x="6" y="6" width="12" height="12" rx="3.5" fill="none" stroke="#fff" strokeWidth="1.8"/><circle cx="12" cy="12" r="3" fill="none" stroke="#fff" strokeWidth="1.8"/><circle cx="15.6" cy="8.4" r="1" fill="#fff"/></>,
    })
  if (studio.google_url)
    icons.push({
      key: 'g', href: studio.google_url, label: 'Google', bg: '#ffffff', ring: true,
      svg: <><path fill="#4285F4" d="M21.6 12.2c0-.6-.1-1.2-.2-1.8H12v3.4h5.4c-.2 1.2-.9 2.3-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.1z"/><path fill="#34A853" d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 .9-3.4.9-2.6 0-4.8-1.7-5.6-4.1H3.1v2.6C4.7 19.8 8.1 22 12 22z"/><path fill="#FBBC05" d="M6.4 13.9c-.2-.6-.3-1.2-.3-1.9s.1-1.3.3-1.9V7.5H3.1C2.4 8.9 2 10.4 2 12s.4 3.1 1.1 4.5l3.3-2.6z"/><path fill="#EA4335" d="M12 6c1.5 0 2.8.5 3.8 1.5l2.8-2.8C16.9 3.1 14.7 2 12 2 8.1 2 4.7 4.2 3.1 7.5l3.3 2.6C7.2 7.7 9.4 6 12 6z"/></>,
    })
  if (wa)
    icons.push({
      key: 'wa', href: `https://wa.me/972${wa}`, label: 'WhatsApp', bg: '#25D366',
      svg: <path fill="#fff" d="M12 4a8 8 0 00-6.9 12l-1 3.6 3.7-1A8 8 0 1012 4zm0 1.6a6.4 6.4 0 11-3.3 11.9l-.3-.2-2.2.6.6-2.1-.2-.3A6.4 6.4 0 0112 5.6zm3.6 8c-.2-.1-1.2-.6-1.3-.6-.2-.1-.3-.1-.4.1l-.6.7c-.1.1-.2.1-.4 0a5.2 5.2 0 01-2.6-2.3c-.2-.3.2-.3.5-1 0-.1 0-.2 0-.3l-.6-1.4c-.1-.3-.3-.3-.4-.3h-.4a.8.8 0 00-.6.3c-.2.2-.7.7-.7 1.7s.8 2 .9 2.1c.1.2 1.6 2.5 3.9 3.4 1.5.6 2 .6 2.7.5.4 0 1.2-.5 1.4-1 .2-.5.2-.9.1-1z"/>,
    })
  if (hasGeo)
    icons.push({
      key: 'waze', href: `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`, label: 'Waze',
      bg: 'linear-gradient(135deg,#2D9CDB 0%,#5B5BD6 100%)',
      svg: <path fill="#fff" d="M12 3C7.6 3 4 6.1 4 10c0 1.5.5 2.9 1.4 4-.1.8-.5 1.7-1.2 2.3-.3.2-.1.7.2.8 1.4.4 2.9.1 4-.6 1.1.5 2.4.7 3.6.7 4.4 0 8-3.1 8-7.2S16.4 3 12 3zM9.2 11a1 1 0 110-2 1 1 0 010 2zm5.6 0a1 1 0 110-2 1 1 0 010 2z"/>,
    })

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
    ? {
        initial: { x: '100%' },
        animate: { x: 0 },
        exit: { x: '100%' },
        transition: { type: 'spring', stiffness: 350, damping: 35 },
      }
    : {
        initial: { x: 400, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: 400, opacity: 0 },
        transition: { type: 'spring', stiffness: 300, damping: 30 },
      }

  const glass = {
    background: 'rgba(255,255,255,0.78)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: `1.5px solid ${color}`,
    boxShadow: `0 8px 40px ${color}33, 0 2px 12px rgba(0,0,0,0.08)`,
  }

  // Mobile: floating card on the right, mid-screen. Desktop: full-height slide-in.
  const mobileStyle = {
    position: 'fixed', right: 0, top: '25vh', width: '75vw', height: '50vh',
    borderRadius: '20px 0 0 20px', zIndex: 1101,
  }
  const desktopClass = 'fixed z-[1101] top-3 bottom-3 right-3 w-[380px] rounded-[20px]'

  return (
    <>
      {/* Overlay — desktop only (mobile keeps the map visible/tappable on the left) */}
      {!isMobile && (
        <motion.div
          className="fixed inset-0 z-[1100] bg-black"
          initial={{ opacity: 0 }} animate={{ opacity: 0.15 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <motion.aside
        dir="rtl"
        className={`overflow-hidden flex flex-col ${isMobile ? '' : desktopClass}`}
        style={isMobile ? { ...glass, ...mobileStyle } : glass}
        {...panelMotion}
      >
        <button
          onClick={onClose}
          aria-label="סגור"
          className="absolute top-3 left-3 z-10 w-8 h-8 rounded-full bg-white/70 hover:bg-white
                     flex items-center justify-center text-zinc-600 shadow-sm transition"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex-1 overflow-y-auto px-6 pt-6 pb-7 space-y-4"
        >
          {/* 1. HERO */}
          <motion.div variants={item} className="flex flex-col items-center text-center pt-1 relative">
            <span className="absolute top-0 right-0 px-2.5 py-0.5 rounded-full text-[11px] font-heebo font-semibold"
                  style={{ background: soft, color }}>
              {studio.type}
            </span>

            {studio.logo_url ? (
              <img src={studio.logo_url} alt={studio.business_name}
                   className="w-20 h-20 rounded-full object-cover shadow-md"
                   style={{ border: `2px solid ${color}` }} />
            ) : (
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-md"
                   style={{ background: soft, border: `2px solid ${color}` }}>
                {glyph}
              </div>
            )}

            <h2 className="mt-3 font-frank text-[22px] font-bold text-zinc-900 leading-tight">
              {studio.business_name}
            </h2>
          </motion.div>

          {/* 2. SOCIAL ROW (under the name) */}
          <motion.div variants={item}>
            <SocialLinks studio={studio} />
          </motion.div>

          {/* 3. OWNER */}
          {studio.owner_name && (
            <motion.div variants={item} className="text-center">
              <p className="font-heebo text-[15px] text-zinc-700">
                {studio.owner_name}{hasAge ? `, ${studio.owner_age}` : ''}
              </p>
            </motion.div>
          )}

          <motion.div variants={item}><SectionDivider /></motion.div>

          {/* 4. LOCATION */}
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

          {/* 5. EXPERTISE */}
          {(hasYears || hasSpecialty) && (
            <>
              <motion.div variants={item}><SectionDivider /></motion.div>
              <motion.div variants={item} className="text-center">
                <p className="font-heebo text-[13.5px] text-zinc-600">
                  {hasYears && `${studio.years_experience} שנות ניסיון`}
                  {hasYears && hasSpecialty && ' · '}
                  {hasSpecialty && <span style={{ color }} className="font-medium">{studio.specialty}</span>}
                </p>
              </motion.div>
            </>
          )}

          {/* 6. DESCRIPTION */}
          {hasDescription && (
            <motion.div variants={item}>
              <p className="font-heebo text-[13.5px] leading-relaxed italic text-[#6B5E4F] text-center px-1"
                 style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {studio.custom_description}
              </p>
            </motion.div>
          )}

          {/* 7. CTA */}
          {hasUrl && (
            <motion.div variants={item} className="pt-1">
              <a href={studio.url} target="_blank" rel="noopener noreferrer"
                 className="flex items-center justify-center gap-2 w-full py-3 rounded-xl
                            font-heebo font-semibold text-[14.5px] text-white
                            transition-transform active:scale-[0.98]"
                 style={{ background: color, boxShadow: `0 4px 16px ${color}55` }}>
                כניסה לאתר
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[11px]">↗</span>
              </a>
            </motion.div>
          )}
        </motion.div>
      </motion.aside>
    </>
  )
}
