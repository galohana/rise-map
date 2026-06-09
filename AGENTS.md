<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# AGENTS.md — הוראות עבודה לכל AI
## (GPT-4o / Gemini / Claude Code)

---

## סדר קריאה חובה

לפני כל עבודה — קרא לפי הסדר:

1. **PROJECT_CONTEXT.md** — הבן את המוצר והארכיטקטורה
2. **CURRENT_STATE.md** — הבן מה עובד ומה שבור
3. **TASKS.md** — בחר משימה ספציפית
4. **AGENTS.md** — קרא הוראות עבודה (קובץ זה)

---

## הרצה מקומית

```bash
# Clone & install
git clone [repo-url]
cd rise-map
npm install

# פיתוח מקומי
npm run dev

# .env — העתק והגדר ערכים
cp .env.example .env.local
# ערכים — קבל מגל
```

## Deploy

```bash
# Build לפני deploy
npm run build

# Deploy production — רק אחרי אישור גל
vercel --prod
```

---

## מה אסור בלי אישור גל

- DB schema / Supabase / RLS / Auth — כל שינוי DB
- ENV variables — שמות, ערכים, הוספה/מחיקה
- החלפת ספרייה ראשית (React, Next.js, Supabase, Leaflet)
- שינוי ארכיטקטורה בסיסית (routing, API structure, auth flow)
- Push ישיר ל-main/master ללא build נקי
- `vercel --prod` — תמיד לפני מתין לאישור מגל

---

## כללי עבודה

**RTL תמיד:**
- `dir="rtl"` על html element
- logical CSS properties בלבד: `ps`/`pe` (padding), `ms`/`me` (margin), `inset-inline-start`/`end`
- לא `left`/`right` ישירות בCSS

**Mobile-first תמיד:**
- כתוב breakpoints מקטן לגדול (`sm:`, `md:`, `lg:`)

**לשון נקבה** בכל הטקסטים הפרונטאליים (ממשק מול גולשות)

**אחרי כל שינוי:**
```bash
npm run build
```
חייב לעבור ללא שגיאות לפני כל דיווח

**Double verification:**
- אחרי DELETE → בצע SELECT ואשר שהשורה לא קיימת
- אחרי UPDATE → בצע SELECT ואשר שהערך החדש שמור
- אחרי יצירת קובץ → קרא חזרה ואשר תוכן

---

## כללי ארכיטקטורה (חזרה מ-PROJECT_CONTEXT)

1. **service_role key** — שרת בלבד, רק ב-/api/* Route Handlers
2. **כל כתיבות** — דרך /api/admin בלבד, לא ישירות מהclient
3. **סיסמת אדמין** — sessionStorage בלבד, header x-admin-password
4. **MapClient** — dynamic import עם `ssr: false`
5. **vercel.json alias** — `rise-map.vercel.app` בלבד
6. **שם טבלה** — `rise_directory` (לא studios)
7. **WRITABLE columns** — מוגדרות ב-/api/admin/route.js בלבד

---

## Next.js — אזהרה חשובה

גרסה זו (16.2.7) עם breaking changes ביחס לגרסאות ישנות יותר.
לפני כתיבת Next.js-specific code: קרא תיעוד מ-`node_modules/next/dist/docs/` או השתמש ב-Context7 MCP לתיעוד עדכני.

---

## חוק סיכום חובה — בסוף כל session

לפני סגירה, עדכן:
1. **CURRENT_STATE.md** — מה השתנה (הוסף לרשימת מה עובד, עדכן שבור/חסר)
2. **TASKS.md** — סמן משימות שהושלמו (checkbox), הוסף משימות חדשות שנגלו

דווח:
1. אילו קבצים שונו (רשימה מלאה)
2. מה בוצע (תיאור קצר)
3. מה לבדוק (עמודים, flows ספציפיים)
4. סיכונים / דברים פתוחים
5. האם `npm run build` עבר ✅ / נכשל ❌
