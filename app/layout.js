import { Frank_Ruhl_Libre, Heebo } from 'next/font/google'
import './globals.css'

const frank = Frank_Ruhl_Libre({
  subsets: ['hebrew', 'latin'],
  weight: ['300', '400', '500', '700', '900'],
  variable: '--ff-frank',
  display: 'swap',
})

const heebo = Heebo({
  subsets: ['hebrew', 'latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--ff-heebo',
  display: 'swap',
})

export const metadata = {
  metadataBase: new URL('https://rise-map.vercel.app'),
  title: 'רשת סטודיואים RISE — גבות, לק ומספרות בישראל',
  description:
    'ספרייה מלאה של מכוני גבות, לק, מספרות וקוסמטיקה ברשת RISE. מצאי סטודיו מקצועי בעיר שלך על המפה.',
  keywords: ['מכון גבות', 'לק ג׳ל', 'מספרה', 'קוסמטיקה', 'ישראל', 'RISE', 'סטודיו יופי'],
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    title: 'רשת סטודיואים RISE — גבות, לק ומספרות בישראל',
    description: 'ספרייה של מכוני יופי מקצועיים ברחבי ישראל. מצאי את הסטודיו הקרוב אליך.',
    url: 'https://rise-map.vercel.app',
    locale: 'he_IL',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'רשת סטודיואים RISE',
    description: 'ספרייה של מכוני יופי מקצועיים ברחבי ישראל',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="he" dir="rtl" className={`${frank.variable} ${heebo.variable}`}>
      <body>{children}</body>
    </html>
  )
}
