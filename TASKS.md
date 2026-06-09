# TASKS — rise-map

## משימות ממתינות — לפי עדיפות

---

### 1. הוספת גלריה לעמוד /studio/[slug]

**תיאור:** gallery_urls כבר מאוחסנות ב-DB ועולות דרך פאנל האדמין, אך עמוד הנחיתה הציבורי /studio/[slug] לא מציג אותן כלל. יש להוסיף רכיב גלריה (grid או carousel) מתחת לפרטי הסטודיו.

**קבצים רלוונטיים:**
- `app/studio/[slug]/page.js` — עמוד שיש להוסיף בו את רכיב הגלריה
- `lib/studios.js` — לוודא שgallery_urls מוחזרות ב-query
- `components/StudioPanel.jsx` — לבחון כיצד הגלריה מוצגת שם כהפניה

**הגדרת Done:**
- גולש שנכנס ל-/studio/[slug] רואה תמונות גלריה אם קיימות
- אם אין תמונות — אין section גלריה בכלל (לא placeholder ריק)
- עיצוב mobile-first, RTL
- npm run build עובר ללא שגיאות

**מותר לגעת:** `app/studio/[slug]/page.js`, `lib/studios.js`, הוספת component חדש לגלריה בתיקיית components/

**אסור בלי אישור גל:** DB schema, ENV variables, ארכיטקטורה

---

### 2. אימות carousel vs fanned ב-StudioPanel/StudioDrawer

**תיאור:** שדה gallery_display_type קיים ב-DB עם ערך 'carousel' אפשרי, אך לא ברור אם ה-UI מבדיל בפועל בין carousel לfanned. יש לבדוק ולתקן אם נדרש.

**קבצים רלוונטיים:**
- `components/StudioPanel.jsx`
- `components/StudioDrawer.jsx`
- `app/api/admin/route.js` — לוודא שgallery_display_type נמצא ב-WRITABLE columns

**הגדרת Done:**
- gallery_display_type='carousel' מציג carousel אמיתי (swipe/arrows)
- gallery_display_type='fanned' מציג תצוגת fan/grid
- בדיקה על mobile ו-desktop

**מותר לגעת:** `components/StudioPanel.jsx`, `components/StudioDrawer.jsx`

**אסור בלי אישור גל:** DB, Auth, ENV, ארכיטקטורה

---

### 3. הוספת קטגוריית קוסמטיקה

**תיאור:** קוסמטיקה מוגדרת ב-CATEGORY_META (comment) אך לא נכללת במערך CATEGORIES הפעיל. יש להחליט אם להפעיל ולהוסיף כקטגוריה ד'.

**קבצים רלוונטיים:**
- `lib/categories.js` — הגדרת הקטגוריות
- `components/FilterBar.jsx` — chips הסינון
- `components/MapClient.jsx` — צבע pin לקטגוריה חדשה

**הגדרת Done:**
- קוסמטיקה מופיעה כ-chip בFilterBar
- Pin בצבע ייחודי על המפה
- סינון עובד כמצופה

**מותר לגעת:** `lib/categories.js`, `components/FilterBar.jsx`, `components/MapClient.jsx`

**אסור בלי אישור גל:** DB schema, AUTH, ENV, ארכיטקטורה — **קבל אישור מגל לפני הפעלת הקטגוריה**

---

### 4. Clustering של pins במפה

**תיאור:** כשיש ריכוז גבוה של סטודיואים באזור אחד (תל אביב, ירושלים) חוויית המובייל נפגעת — pins חופפים ולא ניתן ללחוץ עליהם בקלות. יש להוסיף map clustering.

**קבצים רלוונטיים:**
- `components/MapClient.jsx` — כל לוגיקת המפה

**הגדרת Done:**
- pins צמודים מתקבצים ל-cluster עם ספירה
- לחיצה על cluster מזמין ל-zoom in
- חוויה mobile תקינה
- npm run build עובר

**מותר לגעת:** `components/MapClient.jsx`, הוספת חבילת clustering (react-leaflet-markercluster או דומה) — בדוק תאימות ל-Next.js 16 לפני

**אסור בלי אישור גל:** DB, Auth, ENV, ארכיטקטורה, החלפת ספריית מפה ראשית

---

### 5. עמוד רשימה ציבורי /studios לSEO

**תיאור:** כרגע רק המפה ועמודי studio/[slug] בודדים מאונדקסים. עמוד /studios עם רשימת כל הסטודיואים יאפשר SEO נוסף ואינדוקס של מילות מפתח כלליות.

**קבצים רלוונטיים:**
- `app/` — יצירת `studios/page.js` חדש
- `lib/studios.js` — שליפת כל הסטודיואים
- `app/sitemap.js` — הוספת /studios לsitemap

**הגדרת Done:**
- /studios מציג רשימת כל הסטודיואים הפעילים
- עמוד server-rendered עם ISR
- נוסף ל-sitemap.xml
- SEO metadata מתאים

**מותר לגעת:** `app/studios/page.js` (קובץ חדש), `lib/studios.js`, `app/sitemap.js`

**אסור בלי אישור גל:** DB schema, Auth, ENV, ארכיטקטורה
