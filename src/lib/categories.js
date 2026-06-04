/*
  Single source of truth for RISE studio categories.
  Used by: map pins, list cards, filter chips, studio landing page, admin form.

  Pin color spec (per brief):
    גבות  = שחור (black)
    לק    = ורוד (pink)
    מספרה = זהב  (gold)
    קוסמטיקה = פלbackground (plum) — chosen to round out the palette
*/

export const CATEGORIES = ['גבות', 'לק', 'מספרה', 'קוסמטיקה']

export const CATEGORY_META = {
  'גבות': {
    color: '#1a1a1a',   // black — pin + accents
    soft:  '#ECEAE8',   // soft bg for badges/avatars
    text:  '#1C1916',   // readable text on soft bg
    emoji: '👁️',        // default icon when studio has no emoji
    label: 'גבות',
  },
  'לק': {
    color: '#e8729a',   // pink
    soft:  '#FCE7EF',
    text:  '#C0336A',
    emoji: '💅',
    label: 'לק',
  },
  'מספרה': {
    color: '#c9a84c',   // gold
    soft:  '#F6EFDD',
    text:  '#917226',
    emoji: '✂️',
    label: 'מספרה',
  },
  'קוסמטיקה': {
    color: '#9b59b6',   // plum
    soft:  '#F1E9F5',
    text:  '#7B4F92',
    emoji: '💄',
    label: 'קוסמטיקה',
  },
}

const FALLBACK = CATEGORY_META['גבות']

/** Returns the meta object for a category, never null. */
export function categoryMeta(type) {
  return CATEGORY_META[type] || FALLBACK
}

/** Emoji to render inside a pin: studio's own emoji, else category default. */
export function pinGlyph(studio) {
  if (studio?.emoji && studio.emoji.trim()) return studio.emoji.trim()
  return categoryMeta(studio?.type).emoji
}
