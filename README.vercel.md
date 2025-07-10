# CryptoTrack - Vercel Deploy Guide

Bu loyihani Vercel platformasiga deploy qilish uchun qo'llanma.

## Deploy Qilish Bosqichlari

### 1. GitHub Repository Tayyorlash
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Vercel CLI bilan Deploy
```bash
# Vercel CLI o'rnatish
npm i -g vercel

# Loyihani deploy qilish
vercel

# Production deploy
vercel --prod
```

### 3. Vercel Dashboard orqali Deploy
1. [vercel.com](https://vercel.com) saytiga kiring
2. "New Project" tugmasini bosing
3. GitHub repository'ni tanlang
4. Deploy tugmasini bosing

## Loyiha Tuzilishi

```
├── api/                    # Vercel Serverless Functions
│   ├── crypto/
│   │   ├── [id].ts        # Individual crypto data
│   │   ├── [id]/
│   │   │   └── chart.ts   # Chart data
│   │   └── top25.ts       # Top 25 cryptos
│   └── market/
│       └── stats.ts       # Market statistics
├── client/                 # React Frontend
├── dist/public/           # Build output
├── vercel.json            # Vercel configuration
└── package.json
```

## API Endpoints

Production'da quyidagi endpoint'lar mavjud:

- `GET /api/crypto/top25` - Top 25 cryptocurrency list
- `GET /api/crypto/{id}` - Individual cryptocurrency data
- `GET /api/crypto/{id}/chart?days={days}` - Chart data
- `GET /api/market/stats` - Global market statistics

## Environment Variables

Vercel dashboard'da quyidagi environment variable'larni sozlang:

- `NODE_ENV=production`
- `DATABASE_URL` (agar database ishlatayotgan bo'lsangiz)

## CORS Configuration

Barcha API endpoint'lar CORS header'lari bilan sozlangan:
- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type, Authorization`

## Caching

API response'lar optimallashtirilgan cache header'lari bilan:
- Market data: 5 daqiqa cache
- Individual crypto: 1 daqiqa cache  
- Chart data: 30 soniya cache

## Troubleshooting

### Build Xatolari
1. `npm run build` local'da ishlashini tekshiring
2. Dependencies to'liq o'rnatilganini tasdiqlang
3. TypeScript xatolari yo'qligini tekshiring

### API Xatolari
1. Vercel Functions logs'ini tekshiring
2. CoinGecko API limit'larini tekshiring
3. CORS header'larni tekshiring

### Performance
1. Images optimized bo'lishini tekshiring
2. Bundle size'ni kuzating
3. CDN cache'ni tekshiring

## Support

Yordam kerak bo'lsa, quyidagi resurslardan foydalaning:
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [CoinGecko API Docs](https://coingecko.com/api/documentation)