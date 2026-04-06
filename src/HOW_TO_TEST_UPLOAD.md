# 🎯 How to Test Image Upload - IMPORTANT

## ⚠️ CRITICAL: Why localhost:3000 Doesn't Work

You're getting this error on `localhost:3000`:
```
POST http://localhost:3000/api/upload 500 (Internal Server Error)
```

**Reason**: The upload function is a **Cloudflare Workers function** that requires:
- ✅ R2 bucket (cloud storage)
- ✅ D1 database (cloud database)
- ✅ Cloudflare Workers runtime

These **DON'T EXIST** on your local machine when you run `npm run dev`.

---

## ✅ CORRECT WAY: Test on Deployed Site

### Step 1: Make Sure Code is Deployed
```bash
git add .
git commit -m "Update upload handler"
git push
```

Wait 1-2 minutes for Cloudflare Pages to deploy.

### Step 2: Add Bindings (MUST DO THIS FIRST!)

**Go to Cloudflare Dashboard:**
1. Navigate to: **Pages** → `cinematic-urbann` → **Settings** → **Functions**

2. **Add R2 Bucket Binding:**
   - Scroll to "R2 bucket bindings"
   - Click "Add binding"
   - Variable name: `IMAGES_BUCKET`
   - R2 bucket: `urbann-images` (select or create)
   - Click Save

3. **Add D1 Database Binding:**
   - Scroll to "D1 database bindings"  
   - Click "Add binding"
   - Variable name: `DB`
   - D1 database: `urbann_db` (select or create)
   - Click Save

4. **Trigger Redeploy:**
   - Go to **Deployments** tab
   - Click "Retry deployment" on the latest one
   - OR make a small code change and push

### Step 3: Enable R2 Public Access

1. **Go to**: R2 → `urbann-images` bucket → Settings
2. **Enable**: "R2.dev subdomain" under Public Access
3. **Copy** the public URL (e.g., `https://pub-abc123.r2.dev`)

### Step 4: Add Environment Variable

1. **Go to**: Pages → `cinematic-urbann` → Settings → Environment variables
2. **Click**: "Add variable"
3. **Add**:
   - Name: `R2_PUBLIC_URL`
   - Value: Your R2 public URL from Step 3
   - Environment: Production **AND** Preview
4. **Save** and redeploy

### Step 5: Test Upload

1. **Open**: `https://cinematic-urbann.pages.dev/admin` (or your custom domain)
2. **Login**: with your admin credentials
3. **Open another tab**: Cloudflare Dashboard → Pages → Functions → Real-time Logs
4. **Try uploading** an image
5. **Watch the logs** - you'll see exactly what happens!

---

## 🔍 What to Look For in Logs

### ✅ SUCCESS - You'll See:
```
=== UPLOAD REQUEST STARTED ===
Auth header present: true
Parsing form data...
Form data parsed successfully
File present: true
File name: example.jpg
Metadata parsed successfully
Uploading to R2...
R2 upload successful
Saving to database...
Database insert successful
=== UPLOAD COMPLETED SUCCESSFULLY ===
```

### ❌ ERROR - You'll See One Of These:

#### Error 1: IMAGES_BUCKET binding not found
```
=== UPLOAD REQUEST STARTED ===
...
IMAGES_BUCKET binding not found!
```
**Fix**: Add R2 binding in Pages → Settings → Functions (Step 2 above)

#### Error 2: DB binding not found
```
=== UPLOAD REQUEST STARTED ===
...
DB binding not found!
```
**Fix**: Add D1 binding in Pages → Settings → Functions (Step 2 above)

#### Error 3: R2 bucket doesn't exist
```
Error uploading to R2: NoSuchBucket
```
**Fix**: Create the bucket
```bash
wrangler r2 bucket create urbann-images
```
Then add the binding.

#### Error 4: D1 database doesn't exist or no tables
```
Error: D1_ERROR: no such table: images
```
**Fix**: Create database and run schema
```bash
wrangler d1 create urbann_db
wrangler d1 execute urbann_db --file=./database/schema.sql
```
Then add the binding.

---

## 🛠️ Create R2 and D1 (If They Don't Exist)

### Create R2 Bucket:
```bash
# Login to Cloudflare
wrangler login

# Create bucket
wrangler r2 bucket create urbann-images

# Verify
wrangler r2 bucket list
```

### Create D1 Database:
```bash
# Create database (it will give you an ID - copy it!)
wrangler d1 create urbann_db

# You'll get output like:
# database_id = "abc-123-def-456"

# Update wrangler.toml with that ID

# Create tables
wrangler d1 execute urbann_db --file=./database/schema.sql

# Verify tables exist
wrangler d1 execute urbann_db --command="SELECT name FROM sqlite_master WHERE type='table'"
```

---

## 📊 Verification Checklist

Before testing upload, verify:

### In Cloudflare Dashboard → Pages → Settings → Functions:
- [ ] R2 bucket binding exists: `IMAGES_BUCKET` → `urbann-images`
- [ ] D1 database binding exists: `DB` → `urbann_db`

### In Cloudflare Dashboard → Pages → Settings → Environment variables:
- [ ] `R2_PUBLIC_URL` is set with your R2 public URL
- [ ] Applied to both Production and Preview

### In Cloudflare Dashboard → R2:
- [ ] Bucket `urbann-images` exists
- [ ] Public access enabled (Settings → Public Access → R2.dev subdomain)

### In Cloudflare Dashboard → D1:
- [ ] Database `urbann_db` exists
- [ ] Tables created (run schema command above)

### Latest Deployment:
- [ ] Code is pushed to Git
- [ ] Cloudflare Pages shows latest deployment
- [ ] Deployment is successful (green checkmark)

---

## 🚀 After Everything is Set Up

1. ✅ Upload works on deployed site
2. ✅ Images save to R2 bucket
3. ✅ Metadata saves to D1 database
4. ✅ Images show in gallery
5. ✅ Everything works!

---

## ⚡ Quick Command Summary

```bash
# Create R2 bucket
wrangler r2 bucket create urbann-images

# Create D1 database
wrangler d1 create urbann_db

# Run database schema
wrangler d1 execute urbann_db --file=./database/schema.sql

# Check everything exists
wrangler r2 bucket list
wrangler d1 list

# Deploy
git add .
git commit -m "Setup complete"
git push
```

**Then add bindings in Cloudflare Dashboard!**

---

## 🎯 TL;DR - Do This Now

1. ❌ **STOP** testing on `localhost:3000` - it won't work!
2. ✅ **CREATE** R2 bucket and D1 database (commands above)
3. ✅ **ADD** bindings in Cloudflare Pages Settings → Functions
4. ✅ **ADD** `R2_PUBLIC_URL` environment variable
5. ✅ **REDEPLOY** your site
6. ✅ **TEST** on `https://cinematic-urbann.pages.dev/admin`
7. ✅ **CHECK** Cloudflare Pages Real-time Logs

The logs will tell you exactly what's wrong! 🔥
