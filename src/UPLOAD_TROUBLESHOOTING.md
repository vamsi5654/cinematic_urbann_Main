# Image Upload Troubleshooting Guide

## Current Issue: 500 Internal Server Error on Upload

You're getting a 500 error when uploading images. The code has been updated with **extensive logging** to help diagnose the exact issue.

---

## 🔍 Step 1: Check Cloudflare Pages Function Logs

This is the **MOST IMPORTANT** step. The logs will show you exactly where the upload is failing.

### How to Access Logs:

1. **Go to Cloudflare Dashboard** → **Pages**
2. **Select your project**: `cinematic-urbann`
3. **Click on the latest deployment**
4. **Go to "Functions" tab** → **"Real-time Logs"**
5. **Try uploading an image** while watching the logs
6. **Look for the console.log messages** from the upload handler

### What to Look For in Logs:

```
=== UPLOAD REQUEST STARTED ===
Auth header present: true
Parsing form data...
Form data parsed successfully
File present: true
File name: example.jpg
File size: 1234567
File type: image/jpeg
Metadata string present: true
Metadata string: {"customerNumber":"001",...}
Metadata parsed successfully: {...}
Validating metadata fields...
customerNumber: 001
customerName: John Doe
category: LivingRoom
File path: uploads/001_John_Doe/LivingRoom/1234567890-uuid.jpg
Converting file to buffer...
File buffer size: 1234567
Uploading to R2...
```

### Common Error Messages and Solutions:

#### ❌ Error: "IMAGES_BUCKET binding not found!"
**Problem**: R2 bucket is not properly bound to your Cloudflare Pages project.

**Solution**:
1. Go to Cloudflare Dashboard → Pages → Your Project → Settings → Functions
2. Scroll to "R2 bucket bindings"
3. Add binding:
   - Variable name: `IMAGES_BUCKET`
   - R2 bucket: Select `urbann-images` (or create it first)
4. Save and redeploy

#### ❌ Error: "DB binding not found!"
**Problem**: D1 database is not properly bound.

**Solution**:
1. Go to Cloudflare Dashboard → Pages → Your Project → Settings → Functions
2. Scroll to "D1 database bindings"
3. Add binding:
   - Variable name: `DB`
   - D1 database: Select `urbann_db` (or create it first)
4. Save and redeploy

#### ❌ Error: "Missing required fields: customerNumber, customerName, or category"
**Problem**: The admin form is not sending all required data.

**Solution**: Check that all fields in the admin upload form are filled in:
- Customer Number (required)
- Customer Name (required)
- Category/Room Type (required)

#### ❌ Error: "R2 upload failed" or R2-related errors
**Problem**: R2 bucket doesn't exist or permissions issue.

**Solution**:
```bash
# Check if bucket exists
wrangler r2 bucket list

# Create bucket if it doesn't exist
wrangler r2 bucket create urbann-images
```

#### ❌ Error: "Database insert failed" or SQL errors
**Problem**: Database table doesn't exist or schema mismatch.

**Solution**:
```bash
# Create the database if it doesn't exist
wrangler d1 create urbann_db

# Run the schema
wrangler d1 execute urbann_db --file=./database/schema.sql

# Verify tables exist
wrangler d1 execute urbann_db --command="SELECT name FROM sqlite_master WHERE type='table'"
```

---

## 🔧 Step 2: Verify Configuration

### Check wrangler.toml

Your `/wrangler.toml` should have:

```toml
[[r2_buckets]]
binding = "IMAGES_BUCKET"
bucket_name = "urbann-images"

[[d1_databases]]
binding = "DB"
database_name = "urbann_db"
database_id = "your-actual-database-id"
```

### Check Cloudflare Pages Bindings

**R2 Bucket Binding:**
1. Pages → Project → Settings → Functions
2. "R2 bucket bindings" section should show:
   - `IMAGES_BUCKET` → `urbann-images`

**D1 Database Binding:**
1. Pages → Project → Settings → Functions
2. "D1 database bindings" section should show:
   - `DB` → `urbann_db`

**Environment Variables:**
1. Pages → Project → Settings → Environment variables
2. Should have:
   - `R2_PUBLIC_URL` = Your R2 public URL (e.g., `https://pub-abc123.r2.dev`)

---

## 🏗️ Step 3: Setup R2 and D1 (If Not Done)

### Create R2 Bucket:

```bash
# Login to Cloudflare
wrangler login

# Create R2 bucket
wrangler r2 bucket create urbann-images

# Enable public access (IMPORTANT!)
# Go to Cloudflare Dashboard → R2 → urbann-images → Settings
# Enable "R2.dev subdomain" under Public Access
# Copy the public URL (e.g., https://pub-abc123def456.r2.dev)
```

### Create D1 Database:

```bash
# Create database
wrangler d1 create urbann_db

# This will output a database ID like: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
# Copy this ID and update it in wrangler.toml

# Run the schema
wrangler d1 execute urbann_db --file=./database/schema.sql

# Verify it worked
wrangler d1 execute urbann_db --command="SELECT * FROM images LIMIT 1"
```

### Update wrangler.toml with Database ID:

```toml
[[d1_databases]]
binding = "DB"
database_name = "urbann_db"
database_id = "YOUR-COPIED-DATABASE-ID-HERE"  # ← Update this!
```

---

## 📝 Step 4: Test Upload Again

1. **Push changes to deploy:**
   ```bash
   git add .
   git commit -m "Fix upload configuration"
   git push
   ```

2. **Wait for deployment** to complete

3. **Open Cloudflare Pages Real-time Logs**

4. **Try uploading** an image from the admin panel

5. **Watch the logs** - you'll see exactly where it's failing

---

## 🐛 Step 5: Debug Output

When you upload, the browser console will now show detailed error messages like:

```
Upload error response: {
  error: "R2 bucket not configured",
  details: "IMAGES_BUCKET environment binding is missing"
}
```

Or:

```
Upload error response: {
  error: "Upload failed",
  details: "Specific error message here",
  errorType: "TypeError"
}
```

**Copy this error and:**
1. Check the error message
2. Look it up in this guide
3. Follow the solution steps

---

## 📊 Common Cloudflare Pages Setup Issues

### Issue: "Functions bindings not working"

**Cause**: Cloudflare Pages doesn't automatically use wrangler.toml bindings.

**Solution**: You MUST manually add bindings in the Cloudflare Dashboard:
1. Pages → Project → Settings → Functions
2. Add each binding manually (R2, D1, Environment Variables)
3. Redeploy

### Issue: "Environment variables not found"

**Cause**: Environment variables are separate from bindings.

**Solution**:
1. Pages → Project → Settings → Environment variables
2. Add `R2_PUBLIC_URL` with your R2 public URL
3. Select both "Production" and "Preview" environments
4. Save and redeploy

### Issue: "Changes not reflecting"

**Cause**: Using cached deployment.

**Solution**:
1. Make a small code change (add a comment)
2. Commit and push
3. Or manually trigger redeploy in Cloudflare Dashboard

---

## ✅ Verification Checklist

Before uploading, verify:

- [ ] R2 bucket `urbann-images` exists
- [ ] R2 public access is enabled (R2.dev subdomain)
- [ ] D1 database `urbann_db` exists
- [ ] Database schema has been run (tables exist)
- [ ] `IMAGES_BUCKET` binding added in Cloudflare Pages
- [ ] `DB` binding added in Cloudflare Pages
- [ ] `R2_PUBLIC_URL` environment variable set
- [ ] Latest code is deployed
- [ ] Real-time logs are open and ready

---

## 🆘 Still Having Issues?

**Copy and share:**
1. The FULL error message from browser console
2. The FULL logs from Cloudflare Pages Functions
3. Screenshot of your Pages Function bindings
4. Screenshot of your environment variables

The enhanced logging will show you **exactly** where the process is failing!

---

## 📌 Quick Fix Commands

```bash
# Create everything from scratch
wrangler r2 bucket create urbann-images
wrangler d1 create urbann_db
wrangler d1 execute urbann_db --file=./database/schema.sql

# Check everything exists
wrangler r2 bucket list
wrangler d1 list
wrangler d1 execute urbann_db --command="SELECT name FROM sqlite_master WHERE type='table'"

# Deploy
git add .
git commit -m "Setup R2 and D1"
git push
```

Then manually add bindings in Cloudflare Dashboard!
