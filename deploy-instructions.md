# CryptoTrack - Vercel Deploy Ko'rsatmalari

Loyihangiz Vercel uchun to'liq tayyorlandi. Quyidagi qadamlarni bajaring:

## 1. Loyihani Vercel'ga Yuklash

### GitHub orqali (Tavsiya etiladi):
```bash
git add .
git commit -m "Vercel deployment ready"
git push origin main
```

### Vercel Dashboard'da:
1. [vercel.com](https://vercel.com) ga kiring
2. "New Project" tugmasini bosing  
3. GitHub repository'ni tanlang
4. Deploy tugmasini bosing

## 2. Vercel CLI orqali (Muqobil):
```bash
# Vercel CLI o'rnatish
npm install -g vercel

# Deploy qilish
npx vercel

# Production'ga deploy
npx vercel --prod
```

## 3. Yaratilgan Serverless Functions

Quyidagi API endpoint'lar ishga tushdi:

- `/api/crypto/top25` - Top 25 kripto valyutalar
- `/api/crypto/[id]` - Individual kripto ma'lumotlari  
- `/api/crypto/[id]/chart` - Chart ma'lumotlari
- `/api/market/stats` - Bozor statistikalari

## 4. Konfiguratsiya Fayllari

✅ `vercel.json` - Vercel routing va funksiya sozlamalari
✅ `api/` papka - Serverless functions
✅ CORS - Barcha API'lar uchun sozlangan
✅ Caching - Optimal cache header'lar
✅ TypeScript - API functions uchun configured

## 5. Frontend Build

Frontend automatik build bo'lib `dist/public` papkasiga chiqadi. Vercel buni avtomatik serve qiladi.

## 6. Environment Variables (Ixtiyoriy)

Agar database kerak bo'lsa, Vercel dashboard'da qo'shing:
- `DATABASE_URL` - PostgreSQL connection string
- `NODE_ENV=production`

## 7. Deploy Status Tekshirish

Deploy bo'lgandan keyin:
- Frontend: `your-project.vercel.app`
- API: `your-project.vercel.app/api/crypto/top25`

## 8. Troubleshooting

### Agar xato bo'lsa:
1. Vercel dashboard'da Function Logs'ni tekshiring
2. Build logs'ni ko'ring
3. API endpoint'larni individual test qiling

### Performance:
- API'lar cache bilan optimized
- Frontend CDN orqali serve bo'ladi
- Automatic scaling mavjud

Har qanday savol bo'lsa, Vercel documentation'ni ko'ring yoki yordam so'rang!