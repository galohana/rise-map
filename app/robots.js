export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://rise-map.vercel.app/sitemap.xml',
  }
}
