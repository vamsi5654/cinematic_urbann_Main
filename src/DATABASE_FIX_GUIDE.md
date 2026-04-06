# Database Schema Fix Guide

## Problem
Your database is missing the `project_id` column (and possibly other columns), causing this error:
```
D1_ERROR: table images has no column named project_id: SQLITE_ERROR
```

## Solution: Run Database Migration

### Step 1: Locate Your D1 Database

First, find your D1 database name:
```bash
npx wrangler d1 list
```

Look for your database (likely named `urbann_db`).

### Step 2: Run the Migration

Execute the migration SQL to add missing columns:

```bash
npx wrangler d1 execute urbann_db --file=database/migration-add-missing-columns.sql --local
```

**For production database:**
```bash
npx wrangler d1 execute urbann_db --file=database/migration-add-missing-columns.sql
```

### Step 3: Verify the Migration

Check if columns were added successfully:

```bash
npx wrangler d1 execute urbann_db --local --command="PRAGMA table_info(images);"
```

You should see these columns:
- `id`
- `public_id`
- `image_url`
- `video_url` ← Should be here now
- `customer_number`
- `customer_name`
- `phone`
- `category`
- `tags`
- `description`
- `status`
- `project_id` ← Should be here now
- `before_image_url` ← Should be here now
- `after_image_url` ← Should be here now
- `uploaded_by`
- `uploaded_at`
- `updated_at`

### Alternative: Manual Migration (If wrangler doesn't work)

If you have access to your D1 database console in Cloudflare Dashboard:

1. Go to **Cloudflare Dashboard** → **Workers & Pages** → **D1**
2. Select your database (`urbann_db`)
3. Click **Console** tab
4. Run these commands one by one:

```sql
ALTER TABLE images ADD COLUMN project_id TEXT;
ALTER TABLE images ADD COLUMN video_url TEXT;
ALTER TABLE images ADD COLUMN before_image_url TEXT;
ALTER TABLE images ADD COLUMN after_image_url TEXT;
```

**Note:** If you get "duplicate column name" errors, it means that column already exists - you can ignore those errors.

---

## About Customer API Endpoints

### Do You Need Them?

**Short Answer: No, not right now.**

The current system works with the legacy `/api/images` endpoint. The 404 errors for `/api/customers` are **expected and harmless** - they're being caught and the app falls back to the legacy API.

### When Would You Need Them?

You'd only need to create the customer API endpoints if you want:
- True customer-centric data storage (one document per customer)
- Better performance with large datasets
- Cleaner separation between customers and their media
- To match the Firestore-like structure you originally requested

### How to Implement (Optional - Future Enhancement)

If you decide to implement them later, here's what you'd need to add to `/functions/api/[[path]].ts`:

1. **POST /api/customers/upload** - Upload media for a customer
2. **GET /api/customers** - List all customers with filters
3. **GET /api/customers/:id** - Get single customer
4. **DELETE /api/customers/:id** - Delete customer

The implementation details are in `/IMPLEMENTATION_SUMMARY.md`.

---

## Quick Test After Migration

Once you've run the migration, try uploading an image through the admin panel:

1. Go to `http://localhost:3000/admin` (or `/adminsimple`)
2. Click "Upload Media"
3. Fill in:
   - Customer Number: `12345`
   - Category: `Kitchen`
   - Upload an image
4. Click Upload

If it works without errors, your migration was successful! ✅

---

## Common Issues

### Issue: "wrangler: command not found"
**Solution:** Install Wrangler CLI:
```bash
npm install -g wrangler
# or
npx wrangler --version
```

### Issue: "Database not found"
**Solution:** Create the D1 database first:
```bash
npx wrangler d1 create urbann_db
```

Then update `wrangler.toml` with the database_id from the output.

### Issue: Migration file not found
**Solution:** Make sure you're running the command from the project root directory where the `database/` folder exists.

---

## Summary

1. ✅ **Run the migration** to add missing columns
2. ✅ **Test the upload** to confirm it works
3. ❌ **Don't worry about customer API endpoints** - they're optional
4. ❌ **Don't worry about 404 errors** - they're expected and handled

The simplified admin panel works perfectly with your existing backend once the database schema is updated!
