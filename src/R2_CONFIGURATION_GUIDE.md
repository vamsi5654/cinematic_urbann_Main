# R2 Configuration Guide for Image Uploads

## Issue: Image Upload Failing with 500 Error

The upload is failing because the R2 bucket public URL needs to be properly configured. Here's how to fix it:

## Step 1: Enable R2 Public Access

### Option A: Using R2.dev Subdomain (Easiest - Recommended for Testing)

1. **Go to Cloudflare Dashboard** → **R2** → Your bucket (`urbann-images`)

2. **Click on "Settings"** tab

3. **Scroll to "Public Access"** section

4. **Click "Connect Domain"** or **"Allow Access"**

5. **Enable R2.dev subdomain** - This will give you a URL like:
   ```
   https://pub-XXXXXXXXXXXXX.r2.dev
   ```
   Copy this URL!

### Option B: Using Custom Domain (Production - Better for SEO)

1. **Go to your R2 bucket** → **Settings** → **Public Access**

2. **Click "Connect Domain"**

3. **Enter your custom subdomain** (e.g., `images.your-domain.com`)

4. **Add the CNAME record** to your DNS as instructed

5. **Wait for DNS propagation** (usually 5-15 minutes)

---

## Step 2: Add R2 Public URL to Cloudflare Pages Environment Variables

1. **Go to Cloudflare Dashboard** → **Pages** → Your project (`cinematic-urbann`)

2. **Click "Settings"** → **Environment Variables**

3. **Add a new variable:**
   - **Variable name**: `R2_PUBLIC_URL`
   - **Value**: Your R2 public URL (from Step 1)
     - Example with R2.dev: `https://pub-abc123def456.r2.dev`
     - Example with custom domain: `https://images.theurbann.com`
   - **Environment**: Select **Production** and **Preview**

4. **Click "Save"**

5. **Redeploy your site** for changes to take effect

---

## Step 3: Verify the Configuration

After deployment, test the upload again:

1. **Login to admin panel** at `https://cinematic-urbann.pages.dev/admin`

2. **Try uploading an image**

3. **Check the browser console** - you should see a successful response with the image URL

---

## Troubleshooting

### Still getting 500 error?

1. **Check Cloudflare Pages Logs:**
   - Go to **Cloudflare Dashboard** → **Pages** → Your project
   - Click on **"Functions"** → **"Real-time logs"**
   - Upload an image and watch for errors

2. **Common Issues:**

   - **R2 bucket not found**: Make sure the bucket name in `wrangler.toml` matches your actual bucket
   - **Permissions issue**: Ensure the R2 bucket binding is properly set up
   - **Missing metadata**: Check that all required fields (customerNumber, customerName, category) are being sent

3. **Check the error details:**
   - The updated code now returns detailed error messages
   - Look at the network tab in browser DevTools
   - Check the response body for the exact error

### Database Issues?

If the upload to R2 works but database insert fails:

1. **Verify D1 database is created:**
   ```bash
   wrangler d1 list
   ```

2. **Check if database ID is set in wrangler.toml**

3. **Run the schema if not already done:**
   ```bash
   wrangler d1 execute urbann_db --file=./database/schema.sql
   ```

---

## Updated Code Changes

### What was fixed in `/functions/api/[[path]].ts`:

1. ✅ **Added proper error handling** for file upload
2. ✅ **Added metadata validation** - checks for required fields
3. ✅ **Fixed file buffer conversion** - uses `arrayBuffer()` instead of `stream()`
4. ✅ **Added R2_PUBLIC_URL environment variable** support
5. ✅ **Added detailed error messages** in responses
6. ✅ **Fixed syntax error** in contact handler
7. ✅ **Added try-catch** around the entire upload handler

### Environment Interface Update:

```typescript
interface Env {
  IMAGES_BUCKET: R2Bucket;
  DB: D1Database;
  JWT_SECRET: string;
  ALLOWED_ORIGINS?: string;
  R2_PUBLIC_URL?: string; // NEW - Add this
}
```

---

## Quick Commands Reference

### Create R2 bucket (if not exists):
```bash
wrangler r2 bucket create urbann-images
```

### Check R2 buckets:
```bash
wrangler r2 bucket list
```

### Test deployment:
```bash
npm run deploy
```

---

## Example Complete Configuration

Your `wrangler.toml` should have:
```toml
[[r2_buckets]]
binding = "IMAGES_BUCKET"
bucket_name = "urbann-images"
```

Your Cloudflare Pages Environment Variables should have:
```
R2_PUBLIC_URL = https://pub-abc123def456.r2.dev
```

---

## Need More Help?

If you're still having issues, please provide:
1. The exact error message from browser console
2. The error from Cloudflare Pages Function logs
3. Screenshot of your R2 bucket settings
4. Screenshot of your Pages environment variables
