# MongoDB Connection Fix Guide

## 🔴 Current Issue

Your dashboard is showing "Internal server error" because it cannot connect to MongoDB Atlas.

**Error:** `querySrv ECONNREFUSED _mongodb._tcp.cluster0.i2cm3j2.mongodb.net`

---

## ✅ Quick Fix (Dashboard Now Works!)

I've updated the dashboard to **work even without database connection**. Now you'll see:
- ✅ Dashboard loads successfully
- ⚠️ Warning message about database issue
- 📊 Empty data (all zeros)
- 📝 Instructions on how to fix

---

## 🔧 How to Fix MongoDB Connection

### **Option 1: Whitelist Your IP Address in MongoDB Atlas** (Most Common Fix)

1. **Go to MongoDB Atlas:**
   - Visit: https://cloud.mongodb.com/
   - Login with your credentials

2. **Navigate to Network Access:**
   - Click "Network Access" in the left sidebar
   - Or go to: Security → Network Access

3. **Add Your IP Address:**
   - Click "+ ADD IP ADDRESS"
   - Choose one:
     - **Add Current IP Address** (recommended for development)
     - **Allow Access from Anywhere** (click "Allow Access from Anywhere" - less secure but easiest)
   
4. **Save:**
   - Click "Confirm"
   - Wait 1-2 minutes for changes to apply

5. **Restart Dev Server:**
   ```bash
   # Stop server (Ctrl+C)
   # Then restart:
   npm run dev
   ```

---

### **Option 2: Verify MongoDB Credentials**

Your current MongoDB URI:
```
mongodb+srv://sik1020:Sikander1020@cluster0.i2cm3j2.mongodb.net/zaybaash?appName=Cluster0
```

**Check if:**
1. ✅ Username is correct: `sik1020`
2. ✅ Password is correct: `Sikander1020`
3. ✅ Cluster name is correct: `cluster0.i2cm3j2`
4. ✅ Database name: `zaybaash`

**To reset password if forgotten:**
1. Go to MongoDB Atlas
2. Click "Database Access" (left sidebar)
3. Click "EDIT" next to `sik1020` user
4. Click "Edit Password"
5. Set new password
6. Update `.env.local` with new password

---

### **Option 3: Test Your Internet Connection**

Make sure you can reach MongoDB Atlas:

```bash
# Test connection
ping cluster0.i2cm3j2.mongodb.net
```

If you can't ping it, check:
- ✅ Internet connection is working
- ✅ Firewall is not blocking MongoDB
- ✅ DNS is working properly

---

### **Option 4: Create a New MongoDB Database** (If Current One Has Issues)

1. **Go to MongoDB Atlas:**
   - https://cloud.mongodb.com/

2. **Create New Cluster:**
   - Click "Build a Database"
   - Choose FREE tier (M0)
   - Select cloud provider and region
   - Click "Create"

3. **Create Database User:**
   - Go to "Database Access"
   - Click "+ Add New Database User"
   - Set username and password
   - Set role to "Read and write to any database"
   - Click "Add User"

4. **Whitelist IP:**
   - Go to "Network Access"
   - Click "+ Add IP Address"
   - Click "Allow Access from Anywhere"
   - Click "Confirm"

5. **Get Connection String:**
   - Go to "Database"
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password

6. **Update .env.local:**
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/zaybaash?retryWrites=true&w=majority
   ```

7. **Restart Server:**
   ```bash
   npm run dev
   ```

---

## 🧪 Test MongoDB Connection

### **Test 1: Using Terminal**
```bash
# Install MongoDB shell if needed
# Then test:
mongosh "mongodb+srv://sik1020:Sikander1020@cluster0.i2cm3j2.mongodb.net/zaybaash"
```

### **Test 2: Using Node.js**
Create a test file `test-mongo.js`:
```javascript
const mongoose = require('mongoose');

async function test() {
  try {
    await mongoose.connect('mongodb+srv://sik1020:Sikander1020@cluster0.i2cm3j2.mongodb.net/zaybaash');
    console.log('✅ MongoDB connected successfully!');
    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
  }
}

test();
```

Run it:
```bash
node test-mongo.js
```

### **Test 3: Check Dashboard**
After fixing, go to:
```
http://localhost:3000/dashboard
```

You should see:
- ✅ No error message
- ✅ Real data (if you have orders)
- ✅ Charts loading properly

---

## 📊 What You'll See Now

### **Before Fix (Current):**
```
⚠️ Database Connection Issue
Could not connect to MongoDB. Dashboard is showing empty data.
Error: querySrv ECONNREFUSED _mongodb._tcp.cluster0.i2cm3j2.mongodb.net

To fix this:
- Check your internet connection
- Verify MongoDB Atlas IP whitelist includes your IP
- Check MongoDB credentials in .env.local
- Restart the dev server after fixing
```

### **After Fix:**
```
Total Revenue: PKR 0
Total Orders: 0
Gross Profit: PKR 0
Profit Margin: 0%
```
(Or real data if you have orders)

---

## 🚀 Quick Checklist

- [ ] MongoDB Atlas account is active
- [ ] IP address is whitelisted (or allow from anywhere)
- [ ] Username and password are correct
- [ ] Cluster is running (not paused)
- [ ] Internet connection is working
- [ ] `.env.local` file has correct MONGODB_URI
- [ ] Dev server restarted after changes

---

## 💡 Common Issues

### **"IP not whitelisted"**
→ Add your IP in MongoDB Atlas Network Access

### **"Authentication failed"**
→ Check username/password in connection string

### **"Cluster not found"**
→ Verify cluster name is correct

### **"Network is unreachable"**
→ Check internet connection or firewall

---

## 📞 Need Help?

If you're still having issues:

1. **Check MongoDB Atlas:**
   - Is cluster running?
   - Is IP whitelisted?
   - Are credentials correct?

2. **Share the exact error message** from:
   - Browser console (F12)
   - Terminal output

3. **Test with this URL:**
   ```
   http://localhost:3000/api/health
   ```
   Should return: `{"status":"ok"}`

---

**Good news:** Your dashboard now works even without database! You can use all the management features (Products, Categories, Coupons, Reviews) once the database is connected. 🎉
