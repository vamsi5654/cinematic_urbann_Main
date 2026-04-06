# 🚀 Local Setup - Quick Reference Card

## ⚡ FASTEST WAY TO RUN (30 seconds)

```bash
npm install
npm start
```

✅ **Done!** Opens at `http://localhost:3000` with mock data.

---

## 🎯 Do I Need `.env` File?

| What You Want | Need .env? | What to Setup |
|---------------|------------|---------------|
| Just test the website | ❌ NO | Nothing! |
| See sample videos/images | ❌ NO | Nothing! |
| Save data permanently | ✅ YES | Supabase |
| Upload real images | ✅ YES | Supabase + R2 |
| Production deployment | ✅ YES | Both |

---

## 📁 Create `.env` File (If Needed)

**Location:** Root folder (same level as `package.json`)

```env
# For Videos (Required)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# For Images (Optional)
VITE_CLOUDFLARE_ACCOUNT_ID=your_account_id
VITE_R2_BUCKET_NAME=the-urbann-images
VITE_R2_ACCESS_KEY_ID=your_access_key
VITE_R2_SECRET_ACCESS_KEY=your_secret_key
VITE_R2_PUBLIC_URL=https://pub-xxxxx.r2.dev
```

💡 **Tip:** Copy from `.env.example` template

---

## 🗄️ Supabase Setup (5 min)

### 1. Create Account
- Go to: https://supabase.com
- Sign up (free)

### 2. Create Project
- Click "New Project"
- Name: `the-urbann`
- Save password!

### 3. Get Keys
- Settings → API
- Copy URL and anon key
- Paste in `.env`

### 4. Run Migration
- Open SQL Editor
- Copy from `/database/supabase-migration.sql`
- Paste & Run

### 5. Create Admin User
- Authentication → Users → Add user
- Email: `admin@theurbann.com`
- Check "Auto Confirm User"

---

## ☁️ Cloudflare R2 Setup (Optional, 5 min)

### 1. Create Account
- Go to: https://cloudflare.com
- Sign up (free)

### 2. Create Bucket
- R2 → Create bucket
- Name: `the-urbann-images`

### 3. Make Public
- Bucket Settings → Allow Public Access
- Copy public URL

### 4. Create API Token
- R2 → Manage API Tokens → Create
- Copy Access Key ID + Secret

### 5. Get Account ID
- From dashboard URL: `https://dash.cloudflare.com/[ACCOUNT_ID]/r2`

### 6. Add to `.env`

---

## 🧪 How to Test

### Test Without Any Setup:
```bash
npm start
# ✅ Should see sample videos and images
```

### Test With Supabase Only:
```bash
# 1. Create .env with Supabase keys
# 2. npm start
# ✅ Videos save permanently
# ⚠️ Images use mock mode (not saved)
```

### Test With Full Setup:
```bash
# 1. Create .env with ALL keys
# 2. npm start
# ✅ Everything saves permanently
```

---

## 🔍 Check What Mode You're In

Press `F12` → Console tab

### Mock Mode (No .env):
```
⚠️ Using mock API - Supabase not configured
⚠️ Cloudflare R2 credentials not found
```

### Production Mode (With .env):
```
✅ Supabase connected!
✅ Cloudflare R2 configured
```

---

## 🐛 Common Issues

| Problem | Solution |
|---------|----------|
| Port 3000 in use | Kill process or use different port |
| Module not found | Run `npm install` |
| "Using mock API" | Create `.env` with correct keys |
| Admin login fails | Create user in Supabase Auth |
| Images don't upload | Add R2 credentials to `.env` |
| Videos don't save | Run Supabase migration |

---

## 📂 File Locations

```
/
├── .env                              ← CREATE THIS (not committed)
├── .env.example                      ← TEMPLATE
├── .gitignore                        ← Already ignores .env
├── package.json
├── /database
│   └── supabase-migration.sql        ← RUN IN SUPABASE
├── /src
│   ├── /lib
│   │   └── supabaseClient.ts         ← Reads .env
│   └── /services
│       ├── api.ts                    ← Video API
│       ├── imageApi.ts               ← Image API
│       └── r2Upload.ts               ← R2 Upload
```

---

## 🎯 Environment Variables Needed

### Supabase (Videos + Database):
- `VITE_SUPABASE_URL` - From Supabase → Settings → API
- `VITE_SUPABASE_ANON_KEY` - From Supabase → Settings → API

### Cloudflare R2 (Images):
- `VITE_CLOUDFLARE_ACCOUNT_ID` - From dashboard URL
- `VITE_R2_BUCKET_NAME` - Your bucket name
- `VITE_R2_ACCESS_KEY_ID` - From API token
- `VITE_R2_SECRET_ACCESS_KEY` - From API token
- `VITE_R2_PUBLIC_URL` - From bucket settings

---

## 💡 Pro Tips

### Don't Want to Setup Now?
```bash
# Just run without .env file
npm start
# Works perfectly with sample data!
```

### Want Persistent Data?
```bash
# Only setup Supabase (skip R2)
# Videos will save, images use mock mode
```

### Production Ready?
```bash
# Setup both Supabase + R2
# Everything saves permanently
```

---

## 📋 Commands

```bash
# Install dependencies
npm install

# Start dev server (with or without .env)
npm start

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🔗 Related Docs

- `/ENV_SETUP_GUIDE.md` - Full detailed guide
- `/QUICK_START.md` - Production deployment
- `/SETUP_GUIDE.md` - Complete setup walkthrough
- `/QUICK_START_IMAGES.md` - Image system guide

---

## ✅ Decision Tree

```
Do you want to run locally?
    ├─ Yes, just test → Run `npm start` (no .env needed)
    │
    ├─ Yes, save data → Need Supabase
    │   ├─ Videos only → Add Supabase to .env
    │   └─ Videos + Images → Add Supabase + R2 to .env
    │
    └─ Deploy to production → Need both Supabase + R2
```

---

## 🎊 That's It!

**Minimum to run:** Nothing! Just `npm start`

**For real data:** Create `.env` with Supabase keys

**For images:** Add R2 credentials too

---

*Last Updated: April 1, 2026*
