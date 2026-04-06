# 🚀 The Urbann - Complete Setup Guide

## ✨ Your Website Will Be Online in 5 Minutes!

Follow these simple steps to get your beautiful interior design website working online.

---

## 📋 Step 1: Install Dependencies (1 minute)

```bash
npm install
```

This installs Supabase and all required packages.

---

## 🗄️ Step 2: Create Supabase Project (2 minutes)

### A. Go to Supabase

1. Visit: **https://supabase.com**
2. Click **"Start your project"**
3. Sign up with GitHub/Email (free account)

### B. Create New Project

1. Click **"New Project"**
2. Enter project details:
   - **Name:** `the-urbann-interior`
   - **Database Password:** (save this!)
   - **Region:** Choose closest to you
3. Click **"Create new project"**
4. Wait 2 minutes for setup to complete ⏳

### C. Get Your API Keys

Once your project is ready:

1. Click **"Settings"** (gear icon on left sidebar)
2. Click **"API"**
3. You'll see:
   - **Project URL** - Copy this
   - **anon/public key** - Copy this

---

## 🔑 Step 3: Configure Environment Variables (30 seconds)

### Create `.env` file in your project root:

```bash
# Copy .env.example to .env
cp .env.example .env
```

### Edit `.env` and paste your keys:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **Important:** Replace with YOUR actual values from Supabase!

---

## 🗃️ Step 4: Setup Database (1 minute)

### A. Open Supabase SQL Editor

1. In your Supabase dashboard, click **"SQL Editor"** on left sidebar
2. Click **"New query"**

### B. Run Migration

1. Open the file `/database/supabase-migration.sql` in your code editor
2. **Copy ALL the SQL code**
3. **Paste** into Supabase SQL Editor
4. Click **"Run"** (or press Ctrl/Cmd + Enter)

✅ You should see: "Success. No rows returned"

This creates all tables: `videos`, `contact_submissions`, `scheduled_events`

---

## 👤 Step 5: Create Admin User (1 minute)

### In Supabase Dashboard:

1. Click **"Authentication"** on left sidebar
2. Click **"Users"**
3. Click **"Add user"** dropdown → **"Create new user"**
4. Enter:
   - **Email:** `admin@theurbann.com` (or your email)
   - **Password:** Choose a strong password
   - ✅ Check **"Auto Confirm User"**
5. Click **"Create user"**

**Save these credentials!** You'll use them to login to your admin panel.

---

## 🧪 Step 6: Test Locally (30 seconds)

```bash
npm start
```

Your website opens at `http://localhost:3000`

### Test the gallery:

1. Go to: `http://localhost:3000/gallery`
2. You should see 3 sample videos! 🎬

### Test the admin:

1. Go to: `http://localhost:3000/admin`
2. Login with the email/password you created in Step 5
3. Try adding a video:
   - Category: `Kitchen`
   - URL: `https://www.youtube.com/watch?v=zNTaVTMoNTE`
   - Title: `Modern Kitchen Design`
4. Click "Add Video"
5. Check the gallery - your video should appear! ✨

---

## 🌐 Step 7: Deploy Online (2 minutes)

Choose your preferred hosting platform:

### Option A: Vercel (Easiest - Recommended)

1. Go to **https://vercel.com**
2. Click **"Import Project"**
3. Connect your GitHub repository (or upload folder)
4. Add Environment Variables:
   - `VITE_SUPABASE_URL` = your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key
5. Click **"Deploy"**
6. Done! Your site is live at `your-project.vercel.app` 🎉

### Option B: Netlify

1. Go to **https://netlify.com**
2. Drag and drop your `dist` folder (after running `npm run build`)
3. Go to **Site settings** → **Environment variables**
4. Add your Supabase keys
5. Done! 🎉

### Option C: Cloudflare Pages

```bash
npm run deploy
```

Add environment variables in Cloudflare dashboard.

---

## ✅ Verification Checklist

After deployment, verify everything works:

- [ ] Gallery page shows videos
- [ ] Videos autoplay when visible
- [ ] Category filters work (Kitchen, Living, Bedroom, etc.)
- [ ] Admin login works
- [ ] Can add new videos from admin panel
- [ ] New videos appear in gallery immediately
- [ ] Can delete videos
- [ ] Contact form works
- [ ] Events scheduling works (if implemented)

---

## 🎬 Adding Your Own Videos

### In Admin Panel:

1. Login to `/admin`
2. Click **"Add Video"**
3. Choose category
4. Paste YouTube URL (any format works):
   ```
   https://www.youtube.com/watch?v=VIDEO_ID
   https://youtu.be/VIDEO_ID
   VIDEO_ID
   ```
5. Add optional project title
6. Click **"Add Video"**

### Finding Good Interior Design Videos:

Search YouTube for:
- "luxury kitchen tour"
- "modern interior design"
- "home transformation"
- "bedroom makeover"
- "living room design"

⚠️ Make sure videos allow embedding (most do)

---

## 🎨 Customization

### Change Categories:

Edit `/pages/AdminVideo.tsx` and `/pages/Gallery.tsx`:

```typescript
const categories = ['Kitchen', 'Living', 'Bedroom', 'Your Category'];
```

### Change Colors/Styles:

Edit `/styles/globals.css` - All design tokens are there!

### Change Logo/Text:

Edit respective component files in `/components` and `/pages`

---

## 🐛 Troubleshooting

### "Cannot read properties of undefined"
**Solution:** Make sure you created `.env` file with correct Supabase keys

### Videos not showing
**Solution:** Check Supabase SQL Editor - make sure migration ran successfully

### Admin login fails
**Solution:** 
- Check you created user in Supabase Auth
- Make sure you checked "Auto Confirm User"
- Try the email/password you set

### "CORS error" or "Network error"
**Solution:** 
- Check your Supabase URL/key are correct
- Make sure your Supabase project is active (not paused)

### Still using mock data
**Solution:** 
- Restart your dev server: `Ctrl+C` then `npm start`
- Check console logs - should say "Supabase connected"

---

## 📞 Support

### Check Console Logs

Press `F12` in browser → Console tab

Look for:
- ✅ "Supabase connected" (good)
- ⚠️ "Using mock API" (means .env not configured)

### Supabase Dashboard

Check:
- **Table Editor** → See your data
- **API Logs** → See requests
- **Database** → Check table structure

---

## 🎉 You're Done!

Your website is now:
- ✅ **Fast** - Supabase is globally distributed
- ✅ **Beautiful** - Your design is already perfect
- ✅ **Live** - Anyone can visit your URL
- ✅ **Manageable** - Easy admin panel for videos

### Share Your Website:

Send your live URL to clients: `https://your-site.vercel.app`

### Keep Adding Content:

Login to admin panel anytime to add more videos!

---

## 📊 What You Get:

### Public Pages (No Login Required):
- **Home** - Cinematic hero with your brand
- **Gallery** - Video portfolio with filters
- **Services** - Your offerings
- **About** - Your story
- **Contact** - Contact form

### Admin Panel (Login Required):
- **Videos** - Manage your portfolio
- **Events** - View scheduled consultations
- **Contacts** - View form submissions

---

## 🔒 Security Notes:

- ✅ Row Level Security (RLS) enabled
- ✅ Admin actions require authentication
- ✅ Public can view gallery (as intended)
- ✅ Environment variables never exposed
- ✅ Supabase handles all backend security

---

## 💡 Pro Tips:

1. **Backup:** Supabase automatically backs up your database
2. **Analytics:** Add Vercel Analytics for visitor tracking
3. **Custom Domain:** Connect your own domain in hosting dashboard
4. **SEO:** Your site is already optimized for search engines
5. **Performance:** Videos lazy-load automatically

---

## 🚀 Next Steps:

1. Add 10-20 high-quality project videos
2. Customize about page with your story
3. Add your contact details
4. Share your website link!
5. Start getting clients! 💼

---

**Congratulations! Your premium interior design website is live! 🎊**

Need help? Check the console logs or review this guide.
