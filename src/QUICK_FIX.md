# 🔥 QUICK FIX - Upload 500 Error

## ⚡ Do This NOW (3 Steps)

### 1️⃣ Open Browser Console
- Press **F12** in your browser
- Go to **Console** tab
- Keep it open

### 2️⃣ Open Cloudflare Logs
- Go to: https://dash.cloudflare.com/
- Navigate: **Pages** → `cinematic-urbann` → **Latest Deployment** → **Functions** → **Real-time Logs**
- Keep this window open

### 3️⃣ Try Upload & Read Logs
- Try uploading an image
- **Look at BOTH windows** (Browser Console + Cloudflare Logs)

---

## 📍 What You'll See (And What It Means)

### In Browser Console:
```
=== UPLOAD ATTEMPT ===
File: example.jpg 1234567 image/jpeg
Metadata: {customerNumber: "001", ...}
```
✅ **If you see this**: Frontend is working correctly

```
Upload error response: {
  error: "R2 bucket not configured",
  details: "IMAGES_BUCKET environment binding is missing"
}
```
❌ **If you see this**: R2 binding missing → Go to Fix #1

### In Cloudflare Logs:
```
=== UPLOAD REQUEST STARTED ===
...
IMAGES_BUCKET binding not found!
```
❌ **If you see this**: Go to Fix #1

```
=== UPLOAD REQUEST STARTED ===
...
DB binding not found!
```
❌ **If you see this**: Go to Fix #2

---

## 🔧 The Fixes

### Fix #1: Add R2 Binding
1. Cloudflare Dashboard → **Pages** → Your Project
2. **Settings** → **Functions**
3. Scroll to "**R2 bucket bindings**"
4. Click "**Add binding**"
   - **Variable name**: `IMAGES_BUCKET`
   - **R2 bucket**: `urbann-images` (create if doesn't exist)
5. Click **Save**
6. **Redeploy** your site

### Fix #2: Add D1 Binding
1. Cloudflare Dashboard → **Pages** → Your Project
2. **Settings** → **Functions**
3. Scroll to "**D1 database bindings**"
4. Click "**Add binding**"
   - **Variable name**: `DB`
   - **D1 database**: `urbann_db` (create if doesn't exist)
5. Click **Save**
6. **Redeploy** your site

### Fix #3: Create R2 Bucket (if it doesn't exist)
```bash
wrangler r2 bucket create urbann-images
```
Then enable public access in dashboard and add the binding (Fix #1)

### Fix #4: Create D1 Database (if it doesn't exist)
```bash
# Create database
wrangler d1 create urbann_db

# Copy the database ID it gives you

# Update wrangler.toml with that ID

# Run the schema
wrangler d1 execute urbann_db --file=./database/schema.sql
```
Then add the binding (Fix #2)

---

## ✅ After Fixing

1. **Redeploy** your site (push a commit or manual redeploy)
2. **Try upload** again
3. **Check logs** - should now see:
```
=== UPLOAD REQUEST STARTED ===
Uploading to R2...
R2 upload successful
Database insert successful
=== UPLOAD COMPLETED SUCCESSFULLY ===
```

---

## 🎯 99% Sure It's This

**Most likely cause**: R2 and D1 bindings not added to Cloudflare Pages

**Why**: Cloudflare Pages doesn't use `wrangler.toml` automatically - you MUST add bindings manually in the dashboard.

**The fix**: Add bindings (Fix #1 and Fix #2), then redeploy.

---

## 📞 Still Stuck?

Share:
1. Screenshot of Cloudflare Pages → Settings → Functions (bindings section)
2. The error from Cloudflare logs
3. Output of: `wrangler r2 bucket list` and `wrangler d1 list`
