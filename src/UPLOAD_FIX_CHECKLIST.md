# ✅ Upload Fix Checklist - Follow This Step by Step

## 🔴 PROBLEM
Upload fails with 500 error on `localhost:3000`

## 🎯 ROOT CAUSE
Cloudflare Workers functions don't work on localhost - you MUST test on the deployed site!

---

## 📋 COMPLETE SETUP CHECKLIST

### ⬜ Step 1: Create R2 Bucket
```bash
wrangler login
wrangler r2 bucket create urbann-images
```
**Verify**: `wrangler r2 bucket list` shows `urbann-images`

---

### ⬜ Step 2: Create D1 Database
```bash
wrangler d1 create urbann_db
```
**IMPORTANT**: Copy the `database_id` from the output!

**Update** `/wrangler.toml` line 17 with your database ID:
```toml
database_id = "YOUR-DATABASE-ID-HERE"
```

**Run schema**:
```bash
wrangler d1 execute urbann_db --file=./database/schema.sql
```

**Verify**: 
```bash
wrangler d1 execute urbann_db --command="SELECT name FROM sqlite_master WHERE type='table'"
```
Should show: `images`, `admin_users`, `contact_submissions`, `scheduled_events`

---

### ⬜ Step 3: Enable R2 Public Access

1. Go to: **Cloudflare Dashboard** → **R2** → `urbann-images`
2. Click: **Settings** tab
3. Scroll to: **Public Access** section
4. Click: **"Allow Access"** or **"Connect Domain"**
5. Enable: **"R2.dev subdomain"**
6. **Copy the URL** (looks like: `https://pub-abc123def456.r2.dev`)

---

### ⬜ Step 4: Add R2 Binding to Cloudflare Pages

1. Go to: **Cloudflare Dashboard** → **Pages** → `cinematic-urbann`
2. Click: **Settings** tab → **Functions** section
3. Scroll to: **"R2 bucket bindings"**
4. Click: **"Add binding"**
5. Enter:
   - **Variable name**: `IMAGES_BUCKET`
   - **R2 bucket**: Select `urbann-images`
6. Click: **Save**

---

### ⬜ Step 5: Add D1 Binding to Cloudflare Pages

1. Still in: **Pages** → `cinematic-urbann` → **Settings** → **Functions**
2. Scroll to: **"D1 database bindings"**
3. Click: **"Add binding"**
4. Enter:
   - **Variable name**: `DB`
   - **D1 database**: Select `urbann_db`
5. Click: **Save**

---

### ⬜ Step 6: Add Environment Variable

1. Still in: **Pages** → `cinematic-urbann` → **Settings**
2. Click: **Environment variables** tab
3. Click: **"Add variable"**
4. Enter:
   - **Variable name**: `R2_PUBLIC_URL`
   - **Value**: The R2 public URL from Step 3 (e.g., `https://pub-abc123.r2.dev`)
   - **Environment**: Select **Production** AND **Preview** (both!)
5. Click: **Save**

---

### ⬜ Step 7: Deploy Your Code

```bash
git add .
git commit -m "Setup R2 and D1 for upload"
git push
```

**Wait** 1-2 minutes for deployment to complete.

**Verify**: Go to **Pages** → `cinematic-urbann` → **Deployments** - should show latest deployment with green checkmark.

---

### ⬜ Step 8: Test Upload on Deployed Site

1. **Open**: `https://cinematic-urbann.pages.dev/admin`
   (or your custom domain if you have one)

2. **Login**: 
   - Username: `admin`
   - Password: `admin123`

3. **Open another browser tab**: 
   - Cloudflare Dashboard → Pages → cinematic-urbann
   - Click on latest deployment
   - Click **"Functions"** tab
   - Click **"Real-time Logs"** or **"View real-time logs"**

4. **Go back to admin panel** and click **"Upload Image"**

5. **Fill in ALL required fields**:
   - ✅ Customer Number (e.g., "001")
   - ✅ Customer Name (e.g., "John Doe")
   - ✅ Phone Number (e.g., "1234567890")
   - ✅ Category (select one: Kitchen, Living, Bedroom, etc.)
   - ✅ Select an image file

6. **Click "Upload"**

7. **Watch the Real-time Logs** - you'll see exactly what happens!

---

## 🔍 What You Should See in Logs

### ✅ SUCCESS:
```
=== UPLOAD REQUEST STARTED ===
Auth header present: true
Parsing form data...
Form data parsed successfully
File present: true
File name: example.jpg
File size: 1234567
Metadata parsed successfully: {customerNumber: "001", ...}
Validating metadata fields...
File path: uploads/001_John_Doe/Living/1234567890-uuid.jpg
Converting file to buffer...
Uploading to R2...
R2 upload successful
Saving to database...
Database insert successful
=== UPLOAD COMPLETED SUCCESSFULLY ===
```

### ❌ ERROR EXAMPLES:

**If you see**: `IMAGES_BUCKET binding not found!`
**Fix**: Go back to Step 4 - R2 binding missing

**If you see**: `DB binding not found!`
**Fix**: Go back to Step 5 - D1 binding missing

**If you see**: `NoSuchBucket: urbann-images`
**Fix**: Go back to Step 1 - Create the bucket

**If you see**: `no such table: images`
**Fix**: Go back to Step 2 - Run the schema

---

## ✅ Final Verification

After successful upload, verify:

1. **In Browser**: Image should appear in admin dashboard
2. **In Cloudflare R2**: 
   - Go to R2 → `urbann-images` → Objects
   - You should see: `uploads/001_CustomerName/Category/filename.jpg`
3. **In Cloudflare D1**:
   ```bash
   wrangler d1 execute urbann_db --command="SELECT * FROM images LIMIT 1"
   ```
   Should show your uploaded image metadata

---

## 🎯 Common Mistakes

### ❌ Testing on localhost
**Don't do this**: `http://localhost:3000/admin`
**Do this instead**: `https://cinematic-urbann.pages.dev/admin`

### ❌ Not adding bindings
Bindings in `wrangler.toml` are NOT enough!
You MUST add them in Cloudflare Pages dashboard too.

### ❌ Not redeploying after changes
After adding bindings or environment variables, you MUST redeploy!

### ❌ Forgetting to enable R2 public access
Without public access, images won't be accessible via URL.

---

## 📊 Progress Tracker

Print this and check off as you go:

```
Setup Tasks:
[ ] Created R2 bucket 'urbann-images'
[ ] Created D1 database 'urbann_db'
[ ] Ran database schema
[ ] Updated wrangler.toml with database ID
[ ] Enabled R2 public access
[ ] Copied R2 public URL
[ ] Added R2 binding to Pages (IMAGES_BUCKET)
[ ] Added D1 binding to Pages (DB)
[ ] Added R2_PUBLIC_URL environment variable
[ ] Pushed code to Git
[ ] Verified deployment successful
[ ] Tested upload on deployed site
[ ] Checked Real-time Logs
[ ] Upload successful!
```

---

## 🆘 If Still Not Working

**After completing ALL steps above**, if upload still fails:

1. **Share the exact error** from Cloudflare Real-time Logs
2. **Share screenshot** of Pages → Settings → Functions (bindings section)
3. **Share screenshot** of Pages → Settings → Environment variables
4. **Share output** of:
   ```bash
   wrangler r2 bucket list
   wrangler d1 list
   ```

The detailed logs will show exactly what's wrong!

---

## 🚀 Summary

1. ❌ **Don't** test on localhost
2. ✅ **Do** create R2 and D1
3. ✅ **Do** add bindings in Cloudflare Pages dashboard
4. ✅ **Do** test on deployed site
5. ✅ **Do** check Real-time Logs

**That's it!** Once bindings are added, upload will work perfectly! 🎉
