# ⚡ Quick Start - 5 Minutes to Live Website

## 1️⃣ Install (1 min)
```bash
npm install
```

## 2️⃣ Create Supabase Project (2 min)

1. Go to: **https://supabase.com** → Sign up
2. Create new project → Save password
3. Copy **Project URL** and **anon key** from Settings → API

## 3️⃣ Configure (30 sec)

Create `.env` file:
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 4️⃣ Setup Database (1 min)

1. Supabase Dashboard → **SQL Editor**
2. Copy ALL code from `/database/supabase-migration.sql`
3. Paste and click **Run**

## 5️⃣ Create Admin User (30 sec)

1. Supabase Dashboard → **Authentication** → **Users**
2. Click **Add user** → **Create new user**
3. Email: `admin@theurbann.com`
4. Password: (your choice)
5. ✅ Check **"Auto Confirm User"**

## 6️⃣ Test (30 sec)

```bash
npm start
```

- Gallery: `http://localhost:3000/gallery` (see 3 sample videos)
- Admin: `http://localhost:3000/admin` (login with your credentials)

## 7️⃣ Deploy (2 min)

### Vercel (Recommended):
1. Go to **https://vercel.com**
2. Import project from GitHub
3. Add environment variables (same as .env)
4. Deploy!

**Done!** 🎉 Your site is live!

---

## 🎬 Add Your First Video:

1. Login to `/admin`
2. Click "Add Video"
3. Category: Kitchen
4. URL: `https://www.youtube.com/watch?v=zNTaVTMoNTE`
5. Click "Add Video"

---

## 🆘 Problems?

**"Using mock API" in console?**
→ Check `.env` file has correct Supabase keys

**Login fails?**
→ Make sure you created user in Supabase Auth (Step 5)

**Videos not showing?**
→ Refresh page after adding `.env`

---

## 📚 Full Guide:
See `SETUP_GUIDE.md` for detailed instructions

## 🎨 Your Website Includes:
- ✅ Beautiful gallery with video filtering
- ✅ Admin panel for easy management
- ✅ Contact forms
- ✅ Event scheduling
- ✅ Fully responsive design
- ✅ Cinematic moody aesthetic

**Now go make it yours!** 🚀
