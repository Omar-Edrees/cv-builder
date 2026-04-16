# وثيقة تعريف مشروع — CV Builder Pro

**تاريخ الإصدار:** 16 أبريل 2026 | **الإصدار:** 1.2 | **حالة المشروع:** نشط — إنتاج

---

## 1. الملخص التنفيذي والرؤية

**CV Builder Pro** هو تطبيق ويب مدعوم بالذكاء الاصطناعي يتيح لأي مستخدم — بغض النظر عن مستواه التقني — بناء سيرة ذاتية احترافية من الصفر أو تحليل وتحسين سيرة ذاتية موجودة، في دقيقتين وبدون خبرة.

**المشكلة التي يحلها:** الغالبية العظمى من الباحثين عن عمل في السوق العربي لا يعرفون كيفية كتابة CV محترف، ويعتمدون على نماذج جاهزة ضعيفة أو يدفعون لمتخصصين. الأداة تحل هذه المشكلة مجاناً وفورياً.

**الهدف النهائي:** منصة SaaS متكاملة لبناء مستندات مهنية (CV، Cover Letter، Portfolio) باللغتين العربية والإنجليزية.

---

## 2. النطاق المحدد

### داخل النطاق (الإصدار الحالي)

- بناء CV من الصفر عبر 10 أسئلة موجهة
- رفع PDF موجود وتحليله وتحسينه بالذكاء الاصطناعي
- حساب نقاط جودة الـ CV (0–100) مع تقرير أخطاء ونصائح
- تصدير الـ CV بصيغتي Word (.docx) و PDF
- دعم اللغتين العربية والإنجليزية (RTL/LTR)
- أسئلة متابعة ذكية عند نقص المعلومات

### خارج النطاق حالياً (مؤجل)

- Portfolio Builder (موجود في الواجهة لكن معطّل — "قريباً")
- Cover Letter Generator
- حسابات مستخدمين / تسجيل دخول
- حفظ السير الذاتية في قاعدة بيانات
- نماذج CV متعددة التصميم

---

## 3. الأهداف والمؤشرات

| المؤشر | الهدف | طريقة القياس |
|--------|-------|-------------|
| زمن إنشاء CV كامل | أقل من 3 دقائق | تتبع تدفق الشاشات |
| معدل إكمال العملية | أكثر من 70% | Analytics |
| نسبة نجاح API calls | أكثر من 99% | Vercel Function Logs |
| وقت استجابة AI | أقل من 15 ثانية | Network timing |
| دعم الأجهزة | Mobile + Desktop | Responsive testing |

---

## 4. الهيكل التنظيمي

| الدور | المسؤول | الصلاحية |
|-------|---------|----------|
| مالك المشروع | Omar Edrees | قرارات المنتج، API Keys |
| تطوير (حالي) | Claude Code (AI) | كتابة وتعديل الكود، Push |
| استضافة | Vercel | Deploy تلقائي من main |
| مزود AI | Google (Gemini) | API استدعاء النماذج |

**Repository:** `github.com/Omar-Edrees/cv-builder`

**Production URL:** `cv-builder-two-livid.vercel.app`

---

## 5. المواصفات التقنية

### Stack

```
Frontend:    HTML5 + Vanilla JS + CSS3 (بدون Framework)
Hosting:     Vercel (Static + Serverless Functions)
AI:          Google Gemini 2.5 Flash Lite
PDF Parse:   PDF.js v3.11.174 (CDN)
Word Export: docx.js v8.5.0 (CDN)
Fonts:       Cairo + Tajawal (Google Fonts)
```

### هيكل الملفات

```
cv-builder/
├── index.html       ← كامل الـ Frontend (SPA)
├── package.json     ← v1.0.1
└── api/
    └── gemini.js    ← Vercel Serverless Function
```

### API Handler

```
Endpoint:  POST /api/gemini
Input:     { system, userMessage, maxTokens }
Model:     gemini-2.5-flash-lite-preview-06-17
Output:    { text: "..." }
CORS:      مفتوح لجميع Origins (*)
```

### تدفق المستخدم

```
Home → اختيار المسار:
  ├─ [عندي CV]  → Upload → AI Analysis → نقاط + أخطاء + CV محسّن
  └─ [مفيش CV] → 10 أسئلة → AI Generation → CV جاهز
                              ↓
                    Export: Word / PDF
```

---

## 6. خارطة الطريق

### المرحلة الأولى — MVP (مكتملة)

- [x] الواجهة الكاملة (8 شاشات)
- [x] تكامل AI (Claude ← Gemini)
- [x] تصدير Word + PDF
- [x] دعم عربي/إنجليزي
- [x] نشر على Vercel

### المرحلة الثانية — التالية (مقترحة)

- [ ] نقل API Key إلى Environment Variables
- [ ] Portfolio Builder
- [ ] نماذج CV متعددة
- [ ] Cover Letter Generator

### المرحلة الثالثة — النضج

- [ ] تسجيل دخول + حفظ السير
- [ ] Subscription model
- [ ] Analytics dashboard

---

## 7. المخاطر والافتراضات

| المخاطر | الاحتمال | التأثير | خطة التخفيف |
|---------|---------|---------|------------|
| استنفاد Gemini API quota | عالٍ (حدث فعلاً) | توقف الخدمة | مراقبة الاستخدام، ترقية الخطة |
| API Key مكشوف في الكود | متوسط | اختراق / استنزاف | نقله لـ Vercel Environment Variables |
| تغيير اسم نموذج Gemini | متوسط | 400 errors | تحديث اسم النموذج في gemini.js |
| Vercel cold start | منخفض | بطء أول request | Warming strategies |
| JSON parsing failure | متوسط | UI error | تحسين parseJSON وإضافة fallback |

**الافتراضات:**

- المستخدم لديه اتصال إنترنت مستقر
- Google Gemini API متاح ومستقر
- Vercel يعمل كـ deployment platform رئيسي

---

## 8. الموارد والتكاليف

| البند | التفاصيل | التكلفة |
|-------|---------|---------|
| Vercel Hosting | Hobby Plan | مجاني |
| Gemini API | Free Tier (محدود) | مجاني / مدفوع عند التجاوز |
| GitHub | Public Repo | مجاني |
| Domain | Vercel subdomain | مجاني |

**ملاحظة حرجة:** الـ API Key الحالي مضمن في كود مرفوع على GitHub Public repo — يجب نقله فوراً إلى Vercel Environment Variables.

---

## 9. حالة المشروع الحالية — نقطة الاستئناف

### آخر إجراء مكتمل

```
Branch: main
Commit: 9f5ac7e "Switch to gemini-2.5-flash-lite model"
الملفات المعدّلة:
  - api/gemini.js  ← النموذج: gemini-2.5-flash-lite-preview-06-17
  - index.html     ← callGemini() → /api/gemini
الملفات المحذوفة:
  - api/claude.js
```

### الحالة الحالية بالضبط

التطبيق منشور على Vercel من `main`. تم تغيير النموذج من `gemini-2.0-flash` (quota نفد) إلى `gemini-2.5-flash-lite`. التطبيق **يحتاج تأكيد** أن النموذج الجديد يعمل على الـ production.

### المهمة التالية الفورية

**1. اختبار التطبيق على production URL**

**2. نقل API Key إلى Vercel Environment Variables:**

```
GEMINI_API_KEY = AIzaSyDZKI-z099OWE09AE2xP4IlKVHS9lByJi4
```

ثم في `api/gemini.js` السطر 12:

```js
const apiKey = process.env.GEMINI_API_KEY;
```

---

*هذه الوثيقة تمثل snapshot كامل للمشروع في 16 أبريل 2026.*
*أي أداة ذكاء اصطناعي أو مطور يستلم هذا المشروع يمكنه البدء فوراً من "نقطة الاستئناف" دون أي سياق إضافي.*
