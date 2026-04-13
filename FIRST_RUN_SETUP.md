# First Run Setup

After cloning and setting up the project, you must seed the database with products, categories, and sample orders.

## Required Setup Steps

### 1. Database Connection
Ensure `MONGODB_URI` is set in `.env.local`:
```
MONGODB_URI=your_mongodb_connection_string
```

### 2. Seed the Database
Visit the seed endpoint to populate the database with test products, categories, and orders:

```
GET /api/seed
```

**Easy**: In development mode, auth is skipped. Just visit:
```
http://localhost:3000/api/seed
```

**PowerShell (Windows):**
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/seed"
```

**curl (macOS/Linux):**
```bash
curl http://localhost:3000/api/seed
```

**Expected Response:** JSON list of 12 seeded products.

### 3. Verify
After seeding:
- ✅ Navigate to `/dresses` — you should see product catalog
- ✅ Click any product card — product detail page should load
- ✅ Visit `/api/health` — should return `{ status: "connected" }`

## Product IDs for Testing

After seeding, these products are available:
- `zaybaash-001` — Velvet Reverie Gown (Dresses, 28,900 PKR)
- `zaybaash-002` — Silk Whisper Set (Formal, 24,500 PKR) ← Your test URL
- `zaybaash-003` to `zaybaash-012` — Additional products

## Troubleshooting

**"Product not found" when clicking products:**
- Database is likely empty
- Run `/api/seed` first
- Check `MONGODB_URI` is correctly set

**API routes returning 500:**
- Verify MongoDB connection is working
- Check `.env.local` has `MONGODB_URI`

**Admin auth required but not configured:**
- For local development, admin auth is enforced on `/api/seed`
- Set `ADMIN_TOKEN_SECRET` and `ADMIN_PASSWORD_HASH` in `.env.local` OR
- Temporarily disable `requireAdmin` guard in [src/app/api/seed/route.ts](src/app/api/seed/route.ts) for development
