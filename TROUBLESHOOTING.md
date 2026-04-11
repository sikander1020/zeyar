# Dashboard Troubleshooting Guide

## Issues Fixed

### 1. ✅ Loading Screen Stuck Issue
**Problem:** Dashboard stuck on "Loading dashboard data…"

**Fix Applied:**
- Added detailed error handling to show what's actually failing
- Added loading spinner animation
- Added error message display with "Try Again" button
- Added console logging for debugging

### 2. ✅ Lock Button Not Visible
**Problem:** Lock button covered with white background

**Fix Applied:**
- Changed sidebar from `position: sticky` to `position: fixed`
- Added `z-index: 100` to ensure sidebar stays on top
- Added `marginLeft: 220` to main content to prevent overlap
- Added `overflowY: auto` for scrollable sidebar

---

## How to Debug

### Step 1: Open Browser Console
1. Go to `http://localhost:3000/dashboard`
2. Press `F12` or `Ctrl+Shift+I`
3. Click on the **Console** tab
4. Refresh the page
5. Look for error messages

### Step 2: Check What Error You See

#### Common Errors:

**Error: "HTTP 401: Unauthorized"**
- **Cause:** Admin token expired or invalid
- **Solution:** 
  1. Click "Lock Dashboard" button
  2. Re-enter password: `admin123`
  3. Try again

**Error: "HTTP 500: Internal Server Error"**
- **Cause:** Database connection issue
- **Solution:**
  1. Check if MongoDB is accessible
  2. Verify `MONGODB_URI` in `.env.local`
  3. Restart dev server

**Error: "Failed to fetch"**
- **Cause:** Server not running or network issue
- **Solution:**
  1. Make sure `npm run dev` is running
  2. Check terminal for errors
  3. Try `http://localhost:3000/api/health` to test server

**Error: "Server configuration error"**
- **Cause:** Missing environment variables
- **Solution:**
  1. Check `.env.local` has both:
     - `ADMIN_PASSWORD_HASH`
     - `ADMIN_TOKEN_SECRET`
  2. Restart dev server after adding them

---

## Quick Tests

### Test 1: Check if Server is Running
Open browser and go to:
```
http://localhost:3000/api/health
```
Should return: `{"status": "ok"}`

### Test 2: Check Database Connection
Open browser console and run:
```javascript
fetch('/api/powerbi', {
  headers: {
    'x-admin-token': localStorage.getItem('zaybaash_admin_token') || '',
    'x-admin-ts': localStorage.getItem('zaybaash_admin_ts') || ''
  }
})
.then(r => r.json())
.then(d => console.log('Data:', d))
.catch(e => console.error('Error:', e))
```

### Test 3: Check Environment Variables
In your terminal, run:
```bash
cd "g:\zeyar  antigravity\zeyar"
node -e "console.log('PASSWORD HASH SET:', !!process.env.ADMIN_PASSWORD_HASH)"
node -e "console.log('TOKEN SECRET SET:', !!process.env.ADMIN_TOKEN_SECRET)"
```

---

## What to Check If Still Not Working

### 1. Verify Environment Variables
Open `.env.local` and make sure it has:
```env
MONGODB_URI=mongodb+srv://sik1020:Sikander1020@cluster0.i2cm3j2.mongodb.net/zaybaash?appName=Cluster0
ADMIN_PASSWORD_HASH=240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9
ADMIN_TOKEN_SECRET=zaybaash-admin-secret-key-2024-change-this-in-production
```

### 2. Restart Dev Server
```bash
# Stop current server (Ctrl+C)
# Then restart:
npm run dev
```

### 3. Clear Browser Cache
1. Press `Ctrl+Shift+Delete`
2. Select "Cached images and files"
3. Click "Clear data"
4. Refresh dashboard page

### 4. Check MongoDB Connection
Your MongoDB URI should be valid and accessible. Test it:
```bash
# Install mongo shell if needed
# Then test connection:
mongo "mongodb+srv://sik1020:Sikander1020@cluster0.i2cm3j2.mongodb.net/zaybaash"
```

### 5. Check Terminal Output
Look at your terminal where `npm run dev` is running. You should see:
```
✓ Ready in XXXXms
```

If you see errors there, share them with me.

---

## Expected Behavior After Fix

1. **Login Screen:**
   - Navigate to `/dashboard`
   - Enter password: `admin123`
   - Click "Enter Dashboard"

2. **Dashboard Loads:**
   - See loading spinner briefly
   - Then see the Overview tab with:
     - KPI cards (Revenue, Orders, etc.)
     - Charts
     - Order status breakdown

3. **Sidebar:**
   - Fixed on the left
   - All tabs visible
   - Lock button visible at bottom with brown background

4. **If No Orders Yet:**
   - You'll see "No data yet. Place your first order to see stats."
   - This is normal for new installations

---

## Still Having Issues?

Share these details:
1. **Browser console errors** (F12 → Console tab)
2. **Terminal errors** (where npm run dev is running)
3. **What you see on screen** (screenshot or description)
4. **URL you're accessing** (should be `http://localhost:3000/dashboard`)

---

## Quick Fix Commands

```bash
# 1. Stop all Node processes
taskkill /F /IM node.exe

# 2. Clean next.js cache
cd "g:\zeyar  antigravity\zeyar"
rm -Recurse -Force .next

# 3. Reinstall dependencies
npm install

# 4. Start fresh
npm run dev
```

---

**Last Updated:** After implementing error handling and sidebar fixes
