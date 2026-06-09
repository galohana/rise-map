/*
  Single source of truth for RISE studio categories.
  Used by: map pins, list cards, filter chips, studio landing page, admin form.

  Pin / panel color palette:
    גבות  = שחור #1a1a1a
    לק    = ורוד #e8729a
    מספרה = זהב  #c9a84c
    קוסמטיקה = סגול #9b59b6
*/

export const CATEGORIES = ['גבות', 'לק', 'מספרה']

export const CATEGORY_META = {
  'גבות': {
    color: '#1a1a1a',
    soft:  '#ECEAE8',
    text:  '#1C1916',
    emoji: '👁️',
    label: 'גבות',
  },
  'לק': {
    color: '#e8729a',
    soft:  '#FCE7EF',
    text:  '#C0336A',
    emoji: '💅',
    label: 'לק',
  },
  'מספרה': {
    color: '#c9a84c',
    soft:  '#F6EFDD',
    text:  '#917226',
    emoji: '✂️',
    label: 'מספרה',
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
