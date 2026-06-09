# PROJECT_CONTEXT — rise-map

## מה המוצר

**rise-map** הוא מפה אינטראקטיבית של סטודיואי יופי RISE בישראל (גבות / לק / מספרה).

**מה הוא עושה:**
- מציג סטודיואי RISE על מפה אינטראקטיבית לפי קטגוריה
- מאפשר חיפוש, סינון, ומיקום גאוגרפי
- מציג כרטיסי פרטי סטודיו עם ניווט ל-Waze, קישור לאתר, וטלפון
- כל סטודיו מקבל עמוד נחיתה ייעודי בכתובת /studio/[slug]
- פאנל אדמין ב-/admin לניהול מלא של ספריית הסטודיואים

**מי משתמש:**
1. לקוחות קצה — חיפוש סטודיו RISE קרוב בישראל
2. גל (RISE admin) — ניהול ספריית הסטודיואים דרך פאנל מוגן בסיסמה

**מטרה עסקית:**
hub מרכזי לגילוי רשת RISE — כל אתר לקוח מקושר חזרה למפה, מניב תנועה cross-studio. מותאם SEO עם עמודי סטודיו ייעודיים, JSON-LD structured data, sitemap, ו-Google Search Console.

---

## סטאק טכני

| שכבה | טכנולוגיה |
|------|-----------|
| Framework | Next.js 16.2.7 (App Router) |
| UI | React 19 |
| Styling | Tailwind CSS 4 |
| Animation | Framer Motion 12 |
| DB / Storage | Supabase JS 2 |
| Map | Leaflet + React-Leaflet |
| Map tiles | MapTiler |
| Language | JavaScript (ללא TypeScript) |
| Hosting | Vercel |

---

## מבנה תיקיות

```
rise-map/
├── app/
│   ├── page.js                        — עמוד הבית (server component)
│   ├── layout.js                      — layout ראשי, RTL, metadata גלובלי
│   ├── admin/
│   │   └── page.js                    — פאנל אדמין, מוגן סיסמה
│   ├── studio/
│   │   └── [slug]/
│   │       └── page.js                — עמוד נחיתה לכל סטודיו (ISR 3600s)
│   ├── api/
│   │   ├── admin/
│   │   │   └── route.js               — CRUD API לסטודיואים (service_role)
│   │   ├── upload-logo/
│   │   │   └── route.js               — העלאת לוגו ל-Supabase Storage
│   │   └── upload-gallery/
│   │       └── route.js               — העלאת גלריה ל-Supabase Storage
│   ├── sitemap.js                     — sitemap.xml דינמי
│   └── robots.js                      — robots.txt
├── components/
│   ├── HomeClient.jsx                 — shell ראשי של עמוד הבית (client)
│   ├── MapClient.jsx                  — מפת Leaflet (dynamic, ssr:false)
│   ├── FilterBar.jsx                  — רצועת סינון לפי קטגוריה
│   ├── SearchHome.jsx                 — חיפוש עם autocomplete ערים
│   ├── ResultsList.jsx                — רשימת תוצאות (view חלופי למפה)
│   ├── StudioPanel.jsx                — פאנל פרטים (bottom sheet על המפה)
│   ├── StudioDrawer.jsx               — drawer פרטי סטודיו
│   ├── StudioCard.jsx                 — כרטיס סטודיו ברשימה
│   ├── StudioList.jsx                 — רשימת סטודיואים
│   ├── Header.jsx                     — header עם לוגו RISE
│   ├── Footer.jsx                     — footer
│   ├── PromoModal.jsx                 — מודל פרומו (תוכן לא ברור)
│   └── admin/
│       └── StudioForm.jsx             — טופס יצירה/עריכת סטודיו
├── lib/
│   ├── studios.js                     — קריאות Supabase server-side (anon, read-only)
│   ├── adminApi.js                    — API wrapper לצד client (admin actions)
│   ├── categories.js                  — הגדרות קטגוריות וצבעים
│   ├── useFavorites.js                — hook מועדפים (localStorage)
│   ├── useHistory.js                  — hook היסטוריה (localStorage)
│   └── israeli-cities.js             — נתוני autocomplete ערים ישראל
├── public/
│   └── [SVG assets]
├── PROJECT_CONTEXT.md
├── CURRENT_STATE.md
├── TASKS.md
├── AGENTS.md
├── CLAUDE.md
├── .env.local                         — משתני סביבה (לא ב-git)
├── .env.example                       — תבנית משתני סביבה
└── vercel.json
```

---

## קבצים קריטיים

| קובץ | תיאור |
|------|-------|
| `app/page.js` | עמוד הבית — server component שמביא סטודיואים מ-Supabase ומרנדר HomeClient |
| `app/layout.js` | layout גלובלי — RTL, fonts, metadata, Open Graph |
| `app/admin/page.js` | פאנל אדמין — password gate + ממשק CRUD מלא |
| `app/studio/[slug]/page.js` | עמוד נחיתה לסטודיו — ISR, JSON-LD, SEO, Waze link |
| `app/api/admin/route.js` | Route Handler ל-CRUD — service_role key, WRITABLE columns whitelist |
| `app/api/upload-logo/route.js` | העלאת לוגו ל-Storage — מגבלת 3MB |
| `app/api/upload-gallery/route.js` | העלאת גלריה ל-Storage — מגבלת 8MB, תיקיית logos/gallery/ |
| `components/HomeClient.jsx` | shell ראשי — state, view switching (map/list), geolocation |
| `components/MapClient.jsx` | מפת Leaflet — dynamic import, ssr:false, pins עם צבעי קטגוריה |
| `components/admin/StudioForm.jsx` | טופס אדמין — כל שדות הסטודיו, upload preview, validation |
| `lib/studios.js` | קריאות DB server-side — anon key, read-only, active=true בלבד |
| `lib/adminApi.js` | wrapper לקריאות /api/admin מהclient — שולח x-admin-password header |
| `lib/categories.js` | הגדרות קטגוריות (שמות, צבעים, icons) — single source of truth |
| `vercel.json` | הגדרות Vercel — alias חייב להיות rise-map.vercel.app בלבד |
| `.env.local` | משתני סביבה — לא ב-git, קבל מגל |

---

## API Routes

| Route | Method | תיאור |
|-------|--------|-------|
| `/api/admin` | GET | שליפת כל הסטודיואים (כולל inactive), מוגן x-admin-password |
| `/api/admin` | POST | יצירת סטודיו חדש, מוגן x-admin-password |
| `/api/admin` | PUT | עדכון סטודיו קיים לפי id, מוגן x-admin-password |
| `/api/admin` | DELETE | מחיקת סטודיו לפי id, מוגן x-admin-password |
| `/api/upload-logo` | POST | העלאת תמונת לוגו ל-Supabase Storage bucket 'logos', מחזיר public URL, מגבלת 3MB |
| `/api/upload-gallery` | POST | העלאת תמונת גלריה ל-logos/gallery/, מחזיר public URL, מגבלת 8MB |

---

## החלטות ארכיטקטורה — אסור לשנות

1. **service_role key שרת בלבד** — רק ב-/api/* Route Handlers, לעולם לא בcomponents או lib/studios.js
2. **כל כתיבות דרך /api/admin** — lib/studios.js הוא read-only עם anon key בלבד
3. **סיסמת אדמין ב-sessionStorage בלבד** — נמחקת עם סגירת tab, נשלחת כ-x-admin-password header
4. **RLS על rise_directory** — SELECT ציבורי רק כשactive=true; כל כתיבה מחייבת service_role
5. **MapClient — dynamic import עם ssr:false** — Leaflet לא עובד בצד שרת
6. **vercel.json alias = rise-map.vercel.app** — אסור לשנות ל-eyebrowsweb-app.vercel.app
7. **RTL תמיד** — dir=rtl על html element, logical CSS properties בלבד (ps/pe/ms/me)
8. **שם טבלת DB: rise_directory** — לא studios, לא appointments
9. **WRITABLE columns ב-/api/admin/route.js** — single source of truth לשדות שניתן לכתוב — לא לעקוף

---

## URL חשובים

| שם | כתובת |
|----|-------|
| Supabase Project | https://gvsqiwrhuhlikdvazsqi.supabase.co |
| Vercel (production) | https://rise-map.vercel.app |
| Admin panel | https://rise-map.vercel.app/admin |
| Local dev | http://localhost:3000 |
