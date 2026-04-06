# 🔧 Environment Setup Guide - Running Locally

## 📌 Quick Answer

**YES**, you need to create environment files to connect to real services (Supabase + Cloudflare R2).

**BUT** the website works perfectly WITHOUT them using **mock mode**! 🎉

---

## 🎯 Two Ways to Run Locally

### Option 1: Mock Mode (No Setup Needed) ⚡

```bash
npm install
npm start
```

**That's it!** The website runs with:
- ✅ 3 sample videos pre-loaded
- ✅ 8 sample images pre-loaded
- ✅ Contact form works (saves to localStorage)
- ✅ Full admin panel functionality
- ✅ No credentials required!

**Perfect for:** Testing, development, or demo

---

### Option 2: Production Mode (Real Database & Storage) 🚀

Requires creating `.env` file and setting up Supabase + Cloudflare R2.

---

## 📁 Environment Files You Need

Create **ONE** file called `.env` in your project root:

```
/
├── .env                  ← CREATE THIS
├── App.tsx
├── package.json
└── ...
```

---

## 🔑 What Goes in `.env`

### **For Video System (Supabase):**

```env
# Supabase Configuration (REQUIRED for real database)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **For Image System (Cloudflare R2):**

```env
# Cloudflare R2 Configuration (OPTIONAL - works without it)
VITE_CLOUDFLARE_ACCOUNT_ID=your_account_id_here
VITE_R2_BUCKET_NAME=the-urbann-images
VITE_R2_ACCESS_KEY_ID=your_access_key_here
VITE_R2_SECRET_ACCESS_KEY=your_secret_access_key_here
VITE_R2_PUBLIC_URL=https://pub-xxxxx.r2.dev
```

---

## 🗄️ Supabase Setup (Required for Videos)

### Step 1: Create Supabase Project (2 min)

1. Go to **https://supabase.com**
2. Sign up (free account)
3. Click **"New Project"**
4. Set name: `the-urbann`
5. Set password (save it!)
6. Wait 2 minutes for setup

### Step 2: Get Your API Keys (30 sec)

1. Go to **Settings** → **API**
2. Copy **Project URL**
3. Copy **anon/public key**
4. Paste both into `.env` file

### Step 3: Run Database Migration (1 min)

1. In Supabase Dashboard, click **SQL Editor**
2. Open `/database/supabase-migration.sql` in your code editor
3. Copy ALL the SQL code
4. Paste into SQL Editor
5. Click **Run**

✅ You should see: "Success. No rows returned"

This creates 3 tables:
- `videos` - Your YouTube videos
- `contact_submissions` - Contact form data
- `scheduled_events` - Event scheduling

### Step 4: Create Admin User (1 min)

1. Click **Authentication** → **Users**
2. Click **"Add user"** → **"Create new user"**
3. Email: `admin@theurbann.com`
4. Password: (your choice)
5. ✅ Check **"Auto Confirm User"**
6. Click **"Create user"**

**Save these credentials!** You'll use them to login.

---

## ☁️ Cloudflare R2 Setup (Optional - For Images)

### Why It's Optional:
- Images work in **mock mode** without R2
- Only needed if you want to upload REAL images
- Free forever (10 GB storage)

### Step 1: Create Cloudflare Account (1 min)

1. Go to **https://cloudflare.com**
2. Sign up (free account)
3. Verify email

### Step 2: Create R2 Bucket (2 min)

1. In Cloudflare Dashboard, click **R2**
2. Click **"Create bucket"**
3. Name: `the-urbann-images`
4. Click **"Create bucket"**

### Step 3: Make Bucket Public (1 min)

1. Click on your bucket
2. Click **Settings** tab
3. Under **Public Access**, click **"Allow Access"**
4. Copy the **Public R2.dev URL** (e.g., `https://pub-xxxxx.r2.dev`)

### Step 4: Create API Token (2 min)

1. Go back to **R2** main page
2. Click **"Manage R2 API Tokens"**
3. Click **"Create API Token"**
4. Name: `the-urbann-upload`
5. Permissions: **Object Read & Write**
6. Click **"Create API Token"**
7. Copy:
   - **Access Key ID**
   - **Secret Access Key**
   
⚠️ **Save these!** You can't view the secret again.

### Step 5: Get Account ID (30 sec)

1. In Cloudflare Dashboard, look at the URL
2. Copy the account ID from URL:
   ```
   https://dash.cloudflare.com/YOUR_ACCOUNT_ID/r2
                                 ^^^^^^^^^^^^^^^^
   ```

### Step 6: Add to `.env` (30 sec)

Paste all values into your `.env` file.

---

## 🧪 How to Test

### Test Mock Mode:
```bash
# Don't create .env file, just run:
npm install
npm start
```

Open browser console (F12), you should see:
```
⚠️ Using mock API - Supabase not configured
⚠️ Cloudflare R2 credentials not found. Using mock mode.
```

### Test Production Mode:
```bash
# Create .env file with real keys, then:
npm install
npm start
```

Open browser console (F12), you should see:
```
✅ Supabase connected!
✅ Cloudflare R2 configured
```

---

## 📊 What Works in Each Mode

| Feature | Mock Mode | Production Mode |
|---------|-----------|-----------------|
| View Videos | ✅ (3 samples) | ✅ (Your videos) |
| View Images | ✅ (8 samples) | ✅ (Your images) |
| Add Videos | ❌ (Not saved) | ✅ (Saved forever) |
| Add Images | ❌ (Not saved) | ✅ (Saved to R2) |
| Delete Videos | ✅ (localStorage) | ✅ (Real delete) |
| Delete Images | ✅ (localStorage) | ✅ (Real delete) |
| Contact Form | ✅ (localStorage) | ✅ (Saved to DB) |
| Admin Login | ❌ (Disabled) | ✅ (Real auth) |
| Multi-device Sync | ❌ | ✅ |

---

## 🔧 File Structure

```
/
├── .env                          ← YOU CREATE THIS
├── .env.example                  ← TEMPLATE (if exists)
├── /database
│   └── supabase-migration.sql    ← RUN THIS IN SUPABASE
├── /src
│   ├── /lib
│   │   └── supabaseClient.ts     ← Reads VITE_SUPABASE_*
│   └── /services
│       ├── api.ts                ← Video API (reads .env)
│       ├── imageApi.ts           ← Image API (reads .env)
│       └── r2Upload.ts           ← R2 upload (reads .env)
└── package.json
```

---

## 🚨 Common Issues

### Issue: "Cannot find module '@supabase/supabase-js'"
**Solution:**
```bash
npm install
```

### Issue: "Using mock API" in console
**Solution:**
- Create `.env` file
- Add Supabase keys
- Restart dev server: `Ctrl+C` then `npm start`

### Issue: Images don't upload
**Solution:**
- Check Cloudflare R2 credentials in `.env`
- Make sure bucket is public
- Check account ID is correct

### Issue: Admin login doesn't work
**Solution:**
- Make sure you created user in Supabase Auth
- Check email/password
- Must check "Auto Confirm User" when creating

### Issue: Videos upload but don't show
**Solution:**
- Refresh the page
- Check browser console for errors
- Verify video URL is valid YouTube link

---

## 💾 Environment Variables Reference

### Required (for production):
```env
VITE_SUPABASE_URL=             # From Supabase → Settings → API
VITE_SUPABASE_ANON_KEY=        # From Supabase → Settings → API
```

### Optional (for image uploads):
```env
VITE_CLOUDFLARE_ACCOUNT_ID=    # From Cloudflare dashboard URL
VITE_R2_BUCKET_NAME=           # Your bucket name (e.g., the-urbann-images)
VITE_R2_ACCESS_KEY_ID=         # From R2 API token creation
VITE_R2_SECRET_ACCESS_KEY=     # From R2 API token creation
VITE_R2_PUBLIC_URL=            # From bucket settings (e.g., https://pub-xxxxx.r2.dev)
```

---

## 📋 Quick Setup Checklist

### Minimum Setup (Videos Only):
- [ ] Create Supabase account
- [ ] Create new project
- [ ] Copy URL and anon key
- [ ] Create `.env` file
- [ ] Run database migration
- [ ] Create admin user
- [ ] Start server: `npm start`

### Full Setup (Videos + Images):
- [ ] ✅ All minimum setup steps above
- [ ] Create Cloudflare account
- [ ] Create R2 bucket
- [ ] Make bucket public
- [ ] Create API token
- [ ] Add R2 credentials to `.env`
- [ ] Restart server

---

## 🎯 Recommended Approach

### For Testing/Development (RIGHT NOW):
```bash
# Skip all setup, just run:
npm install
npm start
```
✅ Works immediately with mock data!

### For Production Deployment (LATER):
1. Set up Supabase (videos)
2. Set up Cloudflare R2 (images)
3. Create `.env` file
4. Test locally
5. Deploy to Vercel/Netlify

---

## 🔒 Security Notes

### `.env` File Safety:
- ✅ Already in `.gitignore` (won't be committed)
- ✅ Never share your `.env` file
- ✅ Never commit it to GitHub
- ✅ Use different keys for production vs development

### API Keys:
- **Supabase anon key**: Safe to expose (protected by RLS)
- **R2 secret key**: NEVER expose (keep in `.env` only)

---

## 📞 Support

### Check Logs:
Press `F12` in browser → Console tab

Look for:
- ✅ "Supabase connected" (good)
- ✅ "Cloudflare R2 configured" (good)
- ⚠️ "Using mock API" (no .env file)
- ❌ "Failed to connect" (wrong keys)

### Test Components:

**Videos:**
- Go to: `http://localhost:3000/gallery`
- Should see videos in "All" tab

**Images:**
- Go to: `http://localhost:3000/gallery`
- Click "Kitchen" tab
- Should see images

**Admin:**
- Go to: `http://localhost:3000/admin`
- Login with your Supabase user
- Try uploading video/image

---

## ⚡ TL;DR - Just Want to Run It?

```bash
# Option 1: Run with mock data (no setup)
npm install && npm start

# Option 2: Run with real database
# 1. Create .env file
# 2. Add Supabase keys
# 3. Run migration in Supabase SQL Editor
# 4. npm start
```

**That's it!** 🎉

---

## 📚 Related Documentation

- `/QUICK_START.md` - 5-minute production setup
- `/SETUP_GUIDE.md` - Detailed deployment guide
- `/QUICK_START_IMAGES.md` - Image system setup
- `/CLOUDFLARE_R2_SETUP_COMPLETE.md` - Full R2 documentation

---

*Last Updated: April 1, 2026*
*Questions? Check the main documentation files!*
