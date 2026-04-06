# 🚀 INSTALLATION COMMANDS

Run these commands in your terminal to set up the image upload system.

---

## 📦 Step 1: Install Dependencies

```bash
npm install
```

**This installs:**
- `uuid` - for generating unique image filenames
- All existing dependencies

**Expected output:**
```
added 1 package, and audited 234 packages in 3s
```

---

## ▶️ Step 2: Start Development Server

```bash
npm start
```

**Expected output:**
```
  VITE v5.1.4  ready in 432 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

---

## 🧪 Step 3: Test the System

Open browser and go to:
```
http://localhost:3000/admin
```

**Login credentials:**
```
Username: admin
Password: admin123
```

**Test steps:**
1. Click "Images" tab
2. You should see 8 mock images
3. Click "Add Image" button
4. Select an image file
5. Choose category (Kitchen, Living, Bedroom, or Bathroom)
6. Add optional title
7. Click "Add Image" button
8. ✅ Image uploads successfully!

---

## 🔄 Alternative: Production Build

### Build for production:
```bash
npm run build
```

### Preview production build:
```bash
npm run preview
```

---

## 📝 Common Issues & Solutions

### **Issue: `npm install` fails**
**Solution:**
```bash
# Clear cache and try again
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### **Issue: Port 3000 already in use**
**Solution:**
```bash
# Use different port
PORT=3001 npm start
```

### **Issue: Changes not showing**
**Solution:**
```bash
# Hard refresh browser
Ctrl+Shift+R (Windows/Linux)
Cmd+Shift+R (Mac)

# Or restart server
Ctrl+C (stop)
npm start (restart)
```

---

## 🔧 Development Commands

### **Start development server:**
```bash
npm start
```

### **Build for production:**
```bash
npm run build
```

### **Preview production build:**
```bash
npm run preview
```

### **Run database migration (when Supabase connected):**
```bash
# Copy SQL from /database/migrations/003_create_images_table.sql
# Paste in Supabase SQL Editor
# Click "Run"
```

---

## ✅ Installation Checklist

- [ ] Run `npm install`
- [ ] Dependencies installed successfully
- [ ] Run `npm start`
- [ ] Server starts on port 3000
- [ ] Open http://localhost:3000
- [ ] Website loads correctly
- [ ] Go to /admin
- [ ] Login successful
- [ ] Click "Images" tab
- [ ] Mock images appear
- [ ] Click "Add Image" button
- [ ] Upload modal opens
- [ ] Select test image
- [ ] Image preview shows
- [ ] Click "Add Image"
- [ ] Upload completes
- [ ] New image appears in grid
- [ ] ✅ System working!

---

## 🎯 What Happens After Installation

### **With Mock Mode (Default):**
```
✅ 8 sample images pre-loaded
✅ Upload simulation (localStorage)
✅ Full CRUD functionality
✅ No R2 account needed
✅ No Supabase needed
✅ Perfect for testing!
```

### **With Real R2 (After connecting):**
```
✅ Real image uploads to Cloudflare
✅ Automatic compression
✅ WebP conversion
✅ Persistent storage
✅ Production ready!
```

---

## 📊 System Requirements

### **Minimum:**
- Node.js 16+
- npm 8+
- 2GB RAM
- Modern browser (Chrome, Firefox, Safari, Edge)

### **Recommended:**
- Node.js 18+
- npm 9+
- 4GB RAM
- Fast internet (for uploading images)

### **Check your versions:**
```bash
node --version
# Should show: v18.x.x or higher

npm --version
# Should show: 9.x.x or higher
```

---

## 🌐 Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ Fully supported |
| Firefox | 88+ | ✅ Fully supported |
| Safari | 14+ | ✅ Fully supported |
| Edge | 90+ | ✅ Fully supported |
| Opera | 76+ | ✅ Fully supported |
| IE 11 | - | ❌ Not supported |

---

## 🔐 Environment Setup

### **Current (Mock Mode):**
```bash
# .env.local exists with your personal R2 credentials
# Works in mock mode if credentials invalid
# Uses localStorage for testing
```

### **Production (Real Mode):**
```bash
# Update .env.local with office account credentials
# Connect to real Supabase database
# Run database migration
# Ready for production!
```

---

## 📁 Project Structure After Installation

```
your-project/
├── node_modules/           # ✅ Installed dependencies
│   └── uuid/              # ✅ New: UUID library
├── .env.local             # ✅ R2 credentials
├── .env.example           # ✅ Template
├── .gitignore             # ✅ Updated
├── package.json           # ✅ Updated with uuid
├── package-lock.json      # ✅ Generated
│
├── src/
│   └── services/
│       ├── r2Upload.ts    # ✅ New: R2 upload service
│       └── imageApi.ts    # ✅ New: Image API
│
├── pages/
│   └── AdminVideo.tsx     # ✅ Updated with Images tab
│
├── database/
│   └── migrations/
│       └── 003_*.sql      # ✅ New: Images table migration
│
└── INSTALLATION_COMMANDS.md  # ← You are here!
```

---

## 🚀 Quick Start (Copy-Paste)

```bash
# Install and run in 2 commands:
npm install && npm start
```

**Then open:** http://localhost:3000/admin

**Done!** 🎉

---

## 📝 Next Steps

After installation:

1. **Test in mock mode** (works immediately)
2. **Read documentation:**
   - `/QUICK_START_IMAGES.md` - Quick reference
   - `/CLOUDFLARE_R2_SETUP_COMPLETE.md` - Full docs
   - `/CREDENTIALS_CHANGE_CHECKLIST.md` - Switch to office account

3. **When ready, connect real R2:**
   - Follow `/CREDENTIALS_CHANGE_CHECKLIST.md`
   - Update `/.env.local`
   - Restart server

4. **Deploy to production:**
   - Build: `npm run build`
   - Upload to hosting (Vercel, Netlify, etc.)
   - Set environment variables
   - Run database migration

---

## 💡 Pro Tips

### **Faster Development:**
```bash
# Use nodemon for auto-restart (optional)
npm install --save-dev nodemon
# Add to package.json: "dev": "nodemon npm start"
npm run dev
```

### **Clean Install:**
```bash
# If having issues, clean install:
rm -rf node_modules package-lock.json
npm install
```

### **Check for Updates:**
```bash
# Check outdated packages
npm outdated

# Update all packages
npm update
```

---

## 🎉 Success Indicators

After running commands, you should see:

- ✅ Terminal shows "VITE ready"
- ✅ No red error messages
- ✅ Website loads at localhost:3000
- ✅ Admin panel accessible
- ✅ Images tab visible
- ✅ Mock images display
- ✅ Upload modal works
- ✅ Can preview images

**If all ✅, you're ready to go!**

---

## 📞 Help & Support

### **Installation failed?**
1. Check Node.js version: `node --version`
2. Try clean install: `rm -rf node_modules && npm install`
3. Check error messages in terminal
4. Verify internet connection

### **Server won't start?**
1. Check if port 3000 is free
2. Try different port: `PORT=3001 npm start`
3. Check for syntax errors in code
4. Restart terminal/computer

### **Still stuck?**
- Check browser console (F12)
- Review error messages
- Compare with working version
- Ask for help with specific error message

---

*Installation Guide v1.0*
*Simple commands, quick results!*
