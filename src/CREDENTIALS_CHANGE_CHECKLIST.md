# ✅ CHECKLIST: Switch to Office Account

Use this when you're ready to move from personal to office Cloudflare account.

---

## 📋 Before You Start

- [ ] Office email account created
- [ ] Ready to create Cloudflare account
- [ ] 15 minutes of time available
- [ ] This checklist printed or open

---

## STEP 1: Create Office Cloudflare Account (5 min)

- [ ] Go to: https://dash.cloudflare.com/sign-up
- [ ] Enter OFFICE email (not personal)
- [ ] Create strong password
- [ ] Verify email (check inbox)
- [ ] Login successfully
- [ ] ✅ Dashboard loads

**Result:** Logged into Cloudflare dashboard

---

## STEP 2: Enable R2 Storage (2 min)

- [ ] Left sidebar → Click "R2"
- [ ] Click "Enable R2" button
- [ ] Accept Terms of Service
- [ ] ✅ R2 dashboard appears

**Result:** R2 is active on office account

---

## STEP 3: Create R2 Bucket (3 min)

- [ ] Click "Create bucket" button
- [ ] Enter name: `theurbann-gallery` (or your preferred name)
- [ ] Select location: "Automatic" (recommended)
- [ ] Click "Create bucket"
- [ ] ✅ Bucket appears in list

**Save this information:**
```
Bucket Name: _______________________________
```

---

## STEP 4: Get Account ID (1 min)

- [ ] Look at browser URL bar
- [ ] Find the long code after `.com/` and before `/r2`
- [ ] Copy the Account ID

**Example URL:**
```
https://dash.cloudflare.com/abc123def456/r2
                           ^^^^^^^^^^^^^^
                           This is Account ID
```

**Save this information:**
```
Account ID: _______________________________
```

---

## STEP 5: Create API Token (5 min)

- [ ] In R2 dashboard → "Manage R2 API Tokens"
- [ ] Click "Create API token"
- [ ] Token name: `TheUrbann Gallery Upload`
- [ ] Permissions: Select "Object Read & Write"
- [ ] (Optional) Restrict to bucket: `theurbann-gallery`
- [ ] Click "Create API Token"
- [ ] ⚠️ **COPY BOTH VALUES NOW** (shown only once!)
  - [ ] Access Key ID copied
  - [ ] Secret Access Key copied
- [ ] Click "I have copied..." to confirm
- [ ] ✅ Token created

**Save this information:**
```
Access Key ID: _______________________________

Secret Access Key: _______________________________
```

---

## STEP 6: Enable Public Access (2 min)

- [ ] Go back to R2 dashboard
- [ ] Click your bucket: `theurbann-gallery`
- [ ] Click "Settings" tab
- [ ] Scroll to "Public access"
- [ ] Click "Allow Access" (or "Connect Domain")
- [ ] Copy "Public R2.dev Subdomain" URL
- [ ] ✅ Public URL obtained

**Save this information:**
```
Public URL: _______________________________
(Example: theurbann-gallery.1234567890.r2.cloudflarestorage.com)
```

---

## STEP 7: Update .env.local File (2 min)

- [ ] Open your project in code editor
- [ ] Find file: `/.env.local`
- [ ] Replace these 5 lines with YOUR office values:

```env
VITE_CLOUDFLARE_ACCOUNT_ID=paste_account_id_here
VITE_R2_BUCKET_NAME=paste_bucket_name_here
VITE_R2_ACCESS_KEY_ID=paste_access_key_here
VITE_R2_SECRET_ACCESS_KEY=paste_secret_key_here
VITE_R2_PUBLIC_URL=paste_public_url_here
```

- [ ] Save file (Ctrl+S / Cmd+S)
- [ ] ✅ File saved with new credentials

---

## STEP 8: Test Connection (3 min)

- [ ] Open terminal in project folder
- [ ] Stop running server (Ctrl+C if running)
- [ ] Start server: `npm start`
- [ ] Go to: http://localhost:3000/admin
- [ ] Login with admin credentials
- [ ] Click "Images" tab
- [ ] Click "Add Image" button
- [ ] Select any test image
- [ ] Choose category
- [ ] Click "Add Image"
- [ ] ✅ Upload succeeds!

**Result:** Image uploaded to YOUR office R2 bucket!

---

## STEP 9: Verify in Cloudflare (2 min)

- [ ] Go back to Cloudflare dashboard
- [ ] Go to R2 → Click `theurbann-gallery`
- [ ] Click "Objects" tab
- [ ] ✅ See your uploaded image file!

**Result:** Confirmed working with office account!

---

## STEP 10: Security Cleanup (1 min)

- [ ] Delete old personal R2 bucket (if you want)
- [ ] ✅ Using office account only

---

## ✅ FINAL VERIFICATION

Check all these:

- [ ] Office Cloudflare account created
- [ ] R2 bucket `theurbann-gallery` exists
- [ ] API token created with Read & Write permissions
- [ ] Public access enabled on bucket
- [ ] All 5 values copied correctly
- [ ] `.env.local` file updated
- [ ] Server restarted
- [ ] Test upload successful
- [ ] Image appears in Cloudflare R2 dashboard
- [ ] Old personal account no longer needed

---

## 🎉 SUCCESS!

You're now using your **office Cloudflare account**!

### **What Changed:**
```
Before: Personal R2 bucket
After:  Office R2 bucket

Cost: Still $0/month! ✅
```

### **What Stayed the Same:**
```
✅ All features work identically
✅ No code changes needed
✅ Same admin panel
✅ Same upload process
✅ Same image compression
```

---

## 📝 Keep This Information Safe

**Store these credentials securely:**
- Account ID
- Bucket Name
- Access Key ID
- Secret Access Key
- Public URL

**Recommended storage:**
- Password manager (1Password, LastPass, etc.)
- Company secrets manager
- Encrypted document

**⚠️ NEVER:**
- Commit to Git
- Share publicly
- Email unencrypted
- Write on sticky notes

---

## 🐛 If Something Goes Wrong

### **Problem: "Upload fails"**
**Check:**
- [ ] All 5 values copied correctly (no extra spaces)
- [ ] Bucket name exactly matches
- [ ] API token has Read & Write permissions
- [ ] Public access is enabled

### **Problem: "Can't see uploaded image"**
**Check:**
- [ ] Public URL is correct
- [ ] No `/` at end of public URL
- [ ] Bucket has public access enabled

### **Problem: "Token doesn't work"**
**Solution:**
- [ ] Create new API token
- [ ] Make sure permissions are correct
- [ ] Update `.env.local` with new token
- [ ] Restart server

---

## 📞 Need Help?

1. **Check error in browser console** (F12 → Console tab)
2. **Verify all values in `.env.local`** (no typos)
3. **Test R2 bucket** (manually upload file in dashboard)
4. **Review main docs** (`/CLOUDFLARE_R2_SETUP_COMPLETE.md`)

---

## 🔄 Rollback to Personal Account

If you need to go back:

1. Open `/.env.local`
2. Replace with personal account credentials
3. Restart server: `npm start`
4. Done!

---

## ✨ Pro Tips

1. **Bookmark your R2 dashboard**
   ```
   https://dash.cloudflare.com/YOUR_ACCOUNT_ID/r2
   ```

2. **Set up team access**
   - Cloudflare dashboard → Account → Members
   - Invite team members
   - Set appropriate permissions

3. **Monitor usage**
   - R2 dashboard shows storage used
   - Free tier = 10 GB
   - You'll get warnings before limits

4. **Backup credentials**
   - Keep copy in password manager
   - Share with team lead (securely)
   - Document in company wiki

---

## 📊 Expected Usage

```
Your Website Stats:
- ~500 images total
- ~2 MB per image (after compression)
- Total storage: ~1 GB

R2 Free Tier:
- 10 GB storage
- Your usage: 10%
- Remaining: 90% free ✅

Bandwidth:
- UNLIMITED forever
- $0 cost ✅
```

---

## 🎯 Next Actions After Setup

- [ ] Upload all project images
- [ ] Organize by category
- [ ] Delete old mock images
- [ ] Test on production site
- [ ] Train team on image upload
- [ ] Document for future reference

---

## 📅 Maintenance Schedule

**Monthly:**
- [ ] Check R2 storage usage
- [ ] Review uploaded images
- [ ] Delete duplicates/unused

**Quarterly:**
- [ ] Rotate API tokens (security best practice)
- [ ] Update team access
- [ ] Backup important images

**Yearly:**
- [ ] Review Cloudflare account
- [ ] Optimize storage
- [ ] Update documentation

---

*Checklist Version 1.0*
*Print this when switching accounts!*
