# 🎯 START HERE - Your Website in 5 Minutes

## 👋 Welcome!

Your beautiful interior design website is ready. I chose **Supabase** for you because it's the fastest and easiest way to get online.

---

## ⚡ 5-Minute Setup

### 1. Install (1 min)

Open terminal and run:

```bash
npm install
```

### 2. Get Supabase Keys (2 min)

#### a) Create Account
- Go to: **https://supabase.com**
- Click "Start your project"
- Sign up (free)

#### b) Create Project
- Click "New Project"
- Name: `the-urbann`
- Password: (save it!)
- Region: Choose closest
- Click "Create"
- Wait 2 minutes ⏳

#### c) Copy Keys
- Click "Settings" (gear icon)
- Click "API"
- Copy:
  - **Project URL**
  - **anon public key**

### 3. Create .env File (30 sec)

Create a file named `.env` in your project folder:

```
VITE_SUPABASE_URL=paste-your-url-here
VITE_SUPABASE_ANON_KEY=paste-your-key-here
```

### 4. Setup Database (1 min)

#### a) Open SQL Editor
- In Supabase dashboard
- Click "SQL Editor" (left sidebar)
- Click "New query"

#### b) Run Migration
- Open `database/supabase-migration.sql` file
- Copy ALL the code
- Paste in Supabase SQL Editor
- Click "Run"

### 5. Create Admin User (30 sec)

- Click "Authentication" (left sidebar)
- Click "Users" tab
- Click "Add user" → "Create new user"
- Email: `admin@theurbann.com`
- Password: `your-password`
- ✅ Check "Auto Confirm User"
- Click "Create user"

### 6. Test It! (30 sec)

```bash
npm start
```

Open browser:
- **Gallery:** http://localhost:3000/gallery
- **Admin:** http://localhost:3000/admin

Login with your email/password from step 5!

---

## 🎉 That's It!

You should now see:
- ✅ 3 sample videos in gallery
- ✅ Working admin panel
- ✅ Beautiful design

---

## 🚀 Next: Go Live

### Deploy to Vercel (2 min):

1. Go to **https://vercel.com**
2. Click "Import Project"
3. Connect your GitHub (or upload folder)
4. Add environment variables:
   - `VITE_SUPABASE_URL` = (from step 2)
   - `VITE_SUPABASE_ANON_KEY` = (from step 2)
5. Click "Deploy"

**Your website is now live!** 🎊

---

## 🎬 Add Your First Video

1. Go to your-site.com/admin
2. Login
3. Click "Add Video"
4. Category: Kitchen
5. URL: `https://www.youtube.com/watch?v=zNTaVTMoNTE`
6. Title: "Modern Kitchen" (optional)
7. Click "Add Video"

Check the gallery - it's there! ✨

---

## 📚 Need More Help?

- **Quick guide:** `/QUICK_START.md`
- **Detailed guide:** `/SETUP_GUIDE.md`
- **What changed:** `/WHAT_CHANGED.md`
- **Deployment checklist:** `/DEPLOYMENT_CHECKLIST.md`

---

## 🆘 Problems?

### "Cannot find module"
```bash
npm install
```

### "Using mock API" in console
- Create `.env` file with Supabase keys

### Login doesn't work
- Make sure you created user in Supabase Auth (step 5)
- Check "Auto Confirm User" was checked

### Videos not showing
- Run database migration (step 4)
- Refresh page

---

## ✨ What You Get

Your website has:
- 🎬 Video gallery with YouTube embeds
- 🎨 Category filtering
- 🔐 Secure admin panel
- 📱 Mobile responsive
- ⚡ Fast performance
- 🎭 Beautiful cinematic design

---

## 🎯 Summary

1. ✅ Install packages
2. ✅ Create Supabase project
3. ✅ Add keys to .env
4. ✅ Run database migration
5. ✅ Create admin user
6. ✅ Test locally
7. ✅ Deploy to Vercel

**That's it!** Your premium interior design portfolio is online! 🚀

---

**Ready? Let's do step 1:** `npm install`

Then follow the steps above! 💪
