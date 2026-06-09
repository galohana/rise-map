# CURRENT_STATE — rise-map
> עדכון אחרון: יוני 2026

## מה עובד

- [x] מפת Leaflet אינטראקטיבית עם pins צבעוניים לפי קטגוריה (גבות / לק / מספרה)
- [x] עמוד הבית עם חיפוש, chips סינון לפי קטגוריה, כפתור מיקום גאוגרפי, קיצורי מועדפים/היסטוריה
- [x] view רשימת תוצאות עם ניווט חזרה למפה
- [x] פאנל פרטי סטודיו (bottom sheet) בלחיצה על pin
- [x] עמודי נחיתה ייעודיים לכל סטודיו ב-/studio/[slug] עם SEO metadata, JSON-LD, ניווט Waze, קישור לאתר, CTA טלפון
- [x] פאנל אדמין ב-/admin עם password gate (sessionStorage) וCRUD מלא לסטודיואים
- [x] העלאת לוגו + גלריה (עד 5 תמונות לסטודיו)
- [x] toggle active/inactive לכל סטודיו
- [x] חיפוש וסינון לפי קטגוריה בממשק האדמין
- [x] מועדפים (localStorage) והיסטוריה (localStorage)
- [x] SEO: sitemap.xml, robots.txt, OpenGraph, Google Search Console verification
- [x] ISR על עמודי סטודיו (revalidate 3600s)

---

## שבור / חצי גמור

- [ ] **gallery_display_type 'carousel'** — אופציה זו קיימת ב-schema אך לא ברור אם ה-UI מבדיל בין carousel לfanned ב-StudioPanel/StudioDrawer — טעון אימות
- [ ] **AGENTS.md מזהיר** — גרסת Next.js זו עם breaking changes; חלק מה-APIs עלולים להתנהג שונה מהצפוי

---

## חסר

- [ ] **קוסמטיקה** — קטגוריה זו מוגדרת בcomment של CATEGORY_META אך **לא** נמצאת במערך CATEGORIES הפעיל — רק גבות/לק/מספרה פעילות
- [ ] **גלריה בעמוד הציבורי** — gallery_urls שמורות ב-DB ועולות דרך אדמין אך **לא מוצגות** בעמוד /studio/[slug] לצד קצה
- [ ] **אין clustering של pins** — בריכוז גבוה של סטודיואים באזור אחד חוויית המובייל נפגעת
- [ ] **אין עמוד רשימה ציבורי** — /studios לא קיים; רק המפה + עמודים ייעודיים מאונדקסים ב-SEO
- [ ] **PromoModal** — הקומפוננטה קיימת אך לא ברור מה היא מקדמת

---

## Priority קרוב

**הוספת גלריה לעמוד /studio/[slug]** — הנתונים כבר קיימים ב-DB ועולים דרך האדמין, אין UI שמציג אותם לגולשים. זוהי המשימה בעדיפות הגבוהה ביותר.
