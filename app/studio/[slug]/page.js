import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getStudios, getStudioBySlug } from '@/lib/studios'
import { categoryMeta, pinGlyph } from '@/lib/categories'

// Pre-render every studio at build time; allow new slugs at runtime (ISR).
export const dynamicParams = true
export const revalidate = 3600

export async function generateStaticParams() {
  const studios = await getStudios()
  return studios.map(s => ({ slug: s.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const studio = await getStudioBySlug(slug)
  if (!studio) return { title: 'סטודיו לא נמצא | RISE' }

  const years = studio.years_experience ? `${studio.years_experience} שנות ניסיון` : ''
  const descParts = [`${studio.type} ב${studio.city}`, years, studio.specialty].filter(Boolean)
  return {
    title: `${studio.business_name} | ${studio.city} | RISE`,
    description: descParts.join(' — '),
    alternates: { canonical: `/studio/${studio.slug}` },
    openGraph: {
      title: `${studio.business_name} | ${studio.city}`,
      description: descParts.join(' — '),
      url: `https://rise-map.vercel.app/studio/${studio.slug}`,
      images: studio.logo_url ? [studio.logo_url] : undefined,
    },
  }
}

export default async function StudioPage({ params }) {
  const { slug } = await params
  const studio = await getStudioBySlug(slug)
  if (!studio) notFound()

  const m = categoryMeta(studio.type)
  const glyph = pinGlyph(studio)
  const lat = Number(studio.lat)
  const lng = Number(studio.lng)
  const wazeUrl = `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`

  const hasAge = studio.owner_age != null && studio.owner_age !== ''
  const hasYears = studio.years_experience != null && studio.years_experience !== ''
  const hasSpecialty = Boolean(studio.specialty && String(studio.specialty).trim())
  const hasDescription = Boolean(studio.custom_description && String(studio.custom_description).trim())

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: studio.business_name,
    address: {
      '@type': 'PostalAddress',
      streetAddress: studio.address || '',
      addressLocality: studio.city,
      addressCountry: 'IL',
    },
    geo: { '@type': 'GeoCoordinates', latitude: studio.lat, longitude: studio.lng },
    url: studio.url || undefined,
    telephone: studio.phone || undefined,
    image: studio.logo_url || undefined,
  }

  return (
    <main className="min-h-[100dvh] bg-[#FAF8F5] font-heebo" dir="rtl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-xl mx-auto px-5 py-10">
        <Link href="/"
          className="inline-flex items-center gap-1.5 text-[13px] font-heebo text-[#A09A96] hover:text-[#1C1916] transition mb-8">
          <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
          חזרה למפה
        </Link>

        <article
          className="bg-white rounded-[24px] border p-7 text-center"
          style={{ borderColor: m.color, boxShadow: `0 8px 40px ${m.color}22` }}
        >
          {/* Hero */}
          <div className="flex flex-col items-center">
            {studio.logo_url ? (
              <img src={studio.logo_url} alt={studio.business_name}
                   className="w-24 h-24 rounded-full object-cover shadow-md"
                   style={{ border: `2px solid ${m.color}` }} />
            ) : (
              <div className="w-24 h-24 rounded-full flex items-center justify-center text-5xl shadow-md"
                   style={{ background: m.soft, border: `2px solid ${m.color}` }}>
                {glyph}
              </div>
            )}
            <span className="mt-3 px-3 py-0.5 rounded-full text-[12px] font-semibold"
                  style={{ background: m.soft, color: m.color }}>
              {studio.type}
            </span>
            <h1 className="mt-2 font-frank text-[28px] font-bold text-zinc-900 leading-tight">
              {studio.business_name}
            </h1>
            {studio.owner_name && (
              <p className="mt-1 text-[15px] text-zinc-600">
                {studio.owner_name}{hasAge ? `, ${studio.owner_age}` : ''}
              </p>
            )}
          </div>

          <div className="my-6 h-px bg-zinc-200/70" />

          {/* Location */}
          <div className="flex items-center justify-center gap-1.5 text-zinc-700 mb-4">
            <svg className="w-4 h-4 shrink-0" style={{ color: m.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-[15px] font-medium">{studio.address || studio.city}</span>
          </div>

          {/* Expertise */}
          {(hasYears || hasSpecialty) && (
            <p className="text-[14px] text-zinc-600 mb-2">
              {hasYears && `${studio.years_experience} שנות ניסיון`}
              {hasYears && hasSpecialty && ' · '}
              {hasSpecialty && <span style={{ color: m.color }} className="font-medium">{studio.specialty}</span>}
            </p>
          )}

          {/* Description */}
          {hasDescription && (
            <p className="text-[14px] leading-relaxed italic text-[#6B5E4F] mt-3">
              {studio.custom_description}
            </p>
          )}

          {/* CTAs */}
          <div className="mt-7 space-y-3">
            <a href={wazeUrl} target="_blank" rel="noopener noreferrer"
               className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-[14px] text-white"
               style={{ background: 'linear-gradient(135deg, #2D9CDB 0%, #5B5BD6 100%)', boxShadow: '0 3px 14px rgba(91,91,214,0.35)' }}>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C7.03 2 3 5.6 3 10c0 1.7.6 3.27 1.62 4.57-.13.9-.5 1.9-1.3 2.6-.3.27-.2.78.18.9 1.6.5 3.3.1 4.5-.7C9.1 17.78 10.5 18 12 18c4.97 0 9-3.6 9-8s-4.03-8-9-8zm-3 8a1.2 1.2 0 110-2.4A1.2 1.2 0 019 10zm6 0a1.2 1.2 0 110-2.4A1.2 1.2 0 0115 10z"/>
              </svg>
              נווט ב-Waze
            </a>

            {studio.url && (
              <a href={studio.url} target="_blank" rel="noopener noreferrer"
                 className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-[15px] text-white"
                 style={{ background: m.color, boxShadow: `0 4px 16px ${m.color}55` }}>
                כניסה לאתר
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[11px]">↗</span>
              </a>
            )}

            {studio.phone && (
              <a href={`tel:${studio.phone}`}
                 className="block w-full py-2.5 rounded-xl font-medium text-[14px] text-zinc-700 border border-zinc-200 hover:bg-zinc-50 transition">
                {studio.phone}
              </a>
            )}
          </div>
        </article>

        <p className="text-center text-[11px] text-zinc-400 mt-6 font-heebo">
          חלק מרשת הסטודיואים של RISE
        </p>
      </div>
    </main>
  )
}
