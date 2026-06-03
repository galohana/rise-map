import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const TYPE_STYLE = {
  'גבות':     { bg: '#F2ECE4', text: '#7B6550' },
  'לק':       { bg: '#F5E8E8', text: '#B87070' },
  'מספרה':    { bg: '#E6EEF2', text: '#527080' },
  'קוסמטיקה': { bg: '#EDE6ED', text: '#7B607B' },
}

export default function StudioPage() {
  const { slug } = useParams()
  const [studio, setStudio] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('rise_directory')
      .select('*')
      .eq('slug', slug)
      .eq('active', true)
      .single()
      .then(({ data }) => {
        setStudio(data)
        if (data) {
          document.title = `${data.business_name} — RISE`
        }
        setLoading(false)
      })
  }, [slug])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#FAF8F5]" dir="rtl">
        <div className="w-7 h-7 border-2 border-[#C9A070] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!studio) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#FAF8F5] gap-4" dir="rtl">
        <h1 className="font-frank text-2xl text-[#1C1916]">הסטודיו לא נמצא</h1>
        <Link to="/" className="text-[#C9A070] font-heebo text-sm hover:text-[#1C1916] transition-colors">
          ← חזרה לרשימה
        </Link>
      </div>
    )
  }

  const style = TYPE_STYLE[studio.type] || TYPE_STYLE['גבות']

  return (
    <div className="min-h-screen bg-[#FAF8F5] font-heebo" dir="rtl">
      {/* JSON-LD for this studio */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": studio.business_name,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": studio.address || '',
          "addressLocality": studio.city,
          "addressCountry": "IL"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": studio.lat,
          "longitude": studio.lng
        },
        "url": studio.url,
        "telephone": studio.phone || undefined,
      })}} />

      <div className="max-w-2xl mx-auto px-5 py-10">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-[#C9A070] text-sm font-heebo hover:text-[#1C1916] transition-colors mb-8"
        >
          <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
          כל הסטודיואים
        </Link>

        <div className="bg-white rounded-3xl border border-[#E8E2DC] shadow-sm p-8">
          {/* Header */}
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0"
                 style={{ background: style.bg }}>
              {studio.logo_url ? (
                <img src={studio.logo_url} alt={studio.business_name} className="w-full h-full object-cover rounded-2xl" />
              ) : (
                <span className="font-frank font-bold text-2xl" style={{ color: style.text }}>
                  {studio.business_name.charAt(0)}
                </span>
              )}
            </div>
            <div>
              <h1 className="font-frank text-3xl font-bold text-[#1C1916] mb-1">{studio.business_name}</h1>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-heebo font-medium"
                      style={{ background: style.bg, color: style.text }}>
                  {studio.type}
                </span>
                <span className="text-[#A09A96] text-sm">{studio.city}{studio.region ? ` · ${studio.region}` : ''}</span>
              </div>
            </div>
          </div>

          {/* Address */}
          {studio.address && (
            <div className="flex items-start gap-2 mb-4 text-[#6B6460] text-sm">
              <svg className="w-4 h-4 shrink-0 mt-0.5 text-[#C9A070]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {studio.address}
            </div>
          )}

          {/* CTA */}
          <a
            href={studio.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#C9A070] text-white font-heebo font-semibold px-6 py-3 rounded-full hover:bg-[#1C1916] transition-colors text-sm"
          >
            כניסה לאתר הסטודיו
            <span>↗</span>
          </a>
        </div>
      </div>
    </div>
  )
}
