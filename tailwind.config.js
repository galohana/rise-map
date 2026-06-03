/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        frank: ['"Frank Ruhl Libre"', 'serif'],
        heebo: ['Heebo', 'sans-serif'],
      },
      colors: {
        'rise-bg': '#FAF8F5',
        'rise-ink': '#1C1916',
        'rise-ink-2': '#6B6460',
        'rise-ink-3': '#A09A96',
        'rise-gold': '#C9A070',
        'rise-gold-light': '#F5EDD8',
        'rise-border': '#E8E2DC',
      },
    },
  },
  plugins: [],
}
