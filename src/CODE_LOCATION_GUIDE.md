# 🗺️ Code Location Guide - The Urbann

## Your Questions Answered

### ❓ 1. Where is the LOGIN POPUP code?

**Location:** `/pages/AdminVideo.tsx`

**Lines:** 106-139

**Code Snippet:**
```tsx
if (showLoginModal) {
  return (
    <div className={styles.loginContainer}>
      <motion.div
        className={styles.loginBox}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin}>
          <div className={styles.formGroup}>
            <label>Username</label>
            <input
              type="text"
              value={loginForm.username}
              onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Password</label>
            <input
              type="password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              required
            />
          </div>
          <Button type="submit">Login</Button>
        </form>
      </motion.div>
    </div>
  );
}
```

**How it works:**
1. When user visits `/admin`, it checks if they're authenticated
2. If not authenticated, `showLoginModal` is set to `true`
3. The login form appears in the center of the screen
4. After successful login, it calls `api.login()` which saves the session
5. Modal disappears and admin panel shows

**CSS Styles:** `/pages/Admin.module.css` (lines for `.loginContainer` and `.loginBox`)

---

### ❓ 2. Where is the IMAGE/VIDEO UPLOAD FORM?

**Location:** `/pages/AdminVideo.tsx`

**Lines:** 237-348 (Upload Modal)

**Code Snippet:**
```tsx
<AnimatePresence>
  {showUploadModal && (
    <motion.div
      className={styles.modalOverlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setShowUploadModal(false)}
    >
      <motion.div
        className={styles.modalContent}
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h2>Add New Video</h2>
          <button
            className={styles.closeButton}
            onClick={() => setShowUploadModal(false)}
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleUpload} className={styles.uploadForm}>
          {/* Category Dropdown */}
          <div className={styles.formGroup}>
            <label>Category *</label>
            <select
              value={uploadForm.category}
              onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Video URL Input */}
          <div className={styles.formGroup}>
            <label>YouTube Video URL *</label>
            <input
              type="text"
              placeholder="https://www.youtube.com/watch?v=VIDEO_ID"
              value={uploadForm.videoUrl}
              onChange={(e) => setUploadForm({ ...uploadForm, videoUrl: e.target.value })}
              required
            />
          </div>

          {/* Project Title (Optional) */}
          <div className={styles.formGroup}>
            <label>Project Title (Optional)</label>
            <input
              type="text"
              placeholder="e.g., Modern Minimalist Kitchen"
              value={uploadForm.title}
              onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
            />
          </div>

          {/* Submit Buttons */}
          <div className={styles.modalActions}>
            <Button type="button" variant="ghost" onClick={() => setShowUploadModal(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isUploading || !uploadForm.videoUrl || !uploadForm.category}
              icon={<Upload size={20} />}
            >
              {isUploading ? 'Adding...' : 'Add Video'}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
```

**How to open the form:**
- Click the "Add Video" button in the admin panel header
- The modal appears centered on screen
- Fill in Category, Video URL, and optional Title
- Click "Add Video" to submit

**Form Handler:** Lines 68-93 in `/pages/AdminVideo.tsx` (`handleUpload` function)

---

### ❓ 3. Where does CONTACT FORM DATA SAVE after clicking Submit?

**Form Location:** `/pages/Contact.tsx`

**Save Function Location:** `/src/services/api.ts` (Line 199)

**Full Flow:**

#### Step 1: User Fills Form
File: `/pages/Contact.tsx`
```tsx
const [formData, setFormData] = useState({
  name: '',
  email: '',
  phone: '',
  projectType: '',
  budget: '',
  timeline: '',
  message: ''
});
```

#### Step 2: User Clicks "Send Message"
File: `/pages/Contact.tsx` (handleSubmit function - you'll see it references line 1)
```tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Validate CAPTCHA
  if (captchaAnswer.toLowerCase() !== captchaExpected.toLowerCase()) {
    setCaptchaError(true);
    generateCaptcha();
    return;
  }
  
  setIsSubmitting(true);
  
  // Calls the API service
  await submitContactForm(formData).then(() => {
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    // ... success handling
  });
};
```

#### Step 3: Data Sent to API
File: `/src/services/api.ts` (Lines 199-216)
```tsx
export async function submitContactForm(data: ContactFormData): Promise<void> {
  if (!isSupabaseConfigured()) {
    // If Supabase not configured, just log it (mock mode)
    console.log('Mock: Contact form submitted', data);
    return;
  }

  // Save to Supabase database
  const { error } = await supabase
    .from('contact_submissions')  // Table name
    .insert({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      message: data.message,
      status: 'new'
    });

  if (error) throw error;
}
```

#### Step 4: Data Saved to Database

**Without Supabase (Mock Mode):**
- Data is only logged to browser console
- Not saved anywhere permanent
- You see: `Mock: Contact form submitted {name: "...", email: "..."}`

**With Supabase (Production Mode):**
- Data saved to `contact_submissions` table in Supabase database
- Table columns:
  - `id` (auto-generated UUID)
  - `name` (text)
  - `email` (text)
  - `phone` (text, optional)
  - `message` (text)
  - `status` (text: 'new', 'read', or 'responded')
  - `created_at` (timestamp)

#### Step 5: View Submissions in Admin Panel

File: `/pages/AdminVideo.tsx` (Contacts Tab - Lines after the videos tab)

**How Admin Sees the Data:**
1. Login to `/admin`
2. Click "Contacts" tab
3. See all submissions with:
   - Name
   - Email
   - Phone (if provided)
   - Message
   - Submission date/time
   - Status badge (new/read/responded)

**Data Fetch Function:**
File: `/src/services/api.ts` (Lines 218-239)
```tsx
export async function getContactSubmissions(): Promise<ContactSubmission[]> {
  if (!isSupabaseConfigured()) {
    return []; // Empty array in mock mode
  }

  const { data, error } = await supabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false }); // Newest first

  if (error) throw error;

  return (data || []).map((submission) => ({
    id: submission.id,
    name: submission.name,
    email: submission.email,
    phone: submission.phone || undefined,
    message: submission.message,
    status: submission.status as 'new' | 'read' | 'responded',
    createdAt: new Date(submission.created_at),
  }));
}
```

---

## 📊 Complete Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    USER SUBMITS CONTACT FORM                │
│                     /pages/Contact.tsx                      │
│                                                             │
│  1. User fills: name, email, phone, message                │
│  2. Solves CAPTCHA                                          │
│  3. Clicks "Send Message"                                   │
│  4. handleSubmit() called                                   │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────────────┐
│              SUBMIT TO API SERVICE                          │
│              /src/services/api.ts                           │
│                                                             │
│  submitContactForm(data)                                    │
│                                                             │
│  ┌─────────────────────┬──────────────────────┐           │
│  │                     │                      │           │
│  │  Mock Mode          │  Supabase Mode      │           │
│  │  (No Database)      │  (Real Database)    │           │
│  │                     │                      │           │
│  │  • console.log()    │  • supabase.insert() │           │
│  │  • Not saved        │  • Saved to DB       │           │
│  └─────────────────────┴──────────────────────┘           │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                  SUPABASE DATABASE                          │
│            Table: contact_submissions                       │
│                                                             │
│  Columns:                                                   │
│  • id (UUID)                                                │
│  • name (text)                                              │
│  • email (text)                                             │
│  • phone (text, nullable)                                   │
│  • message (text)                                           │
│  • status (text: new/read/responded)                        │
│  • created_at (timestamp)                                   │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                  ADMIN VIEWS SUBMISSIONS                    │
│               /pages/AdminVideo.tsx                         │
│                    (Contacts Tab)                           │
│                                                             │
│  1. Admin clicks "Contacts" tab                             │
│  2. Calls getContactSubmissions()                           │
│  3. Fetches data from Supabase                              │
│  4. Displays list of all submissions                        │
│  5. Shows: Name, Email, Phone, Message, Date                │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Quick Reference Summary

| What | File Location | Key Lines |
|------|--------------|-----------|
| **Login Popup** | `/pages/AdminVideo.tsx` | 106-139 |
| **Login Styles** | `/pages/Admin.module.css` | `.loginContainer`, `.loginBox` |
| **Login Handler** | `/pages/AdminVideo.tsx` | 51-61 (`handleLogin`) |
| **Upload Form Modal** | `/pages/AdminVideo.tsx` | 237-348 |
| **Upload Handler** | `/pages/AdminVideo.tsx` | 68-93 (`handleUpload`) |
| **Contact Form UI** | `/pages/Contact.tsx` | 117-268 |
| **Contact Submit Handler** | `/pages/Contact.tsx` | Line 1 references (handleSubmit) |
| **Contact Save API** | `/src/services/api.ts` | 199-216 (`submitContactForm`) |
| **Contact Fetch API** | `/src/services/api.ts` | 218-239 (`getContactSubmissions`) |
| **Contacts Display** | `/pages/AdminVideo.tsx` | After videos tab (Contacts Tab) |
| **Database Table** | Supabase | `contact_submissions` |

---

## 🔍 How to Find Code Quickly

### Search Tips:

1. **Find Login Code:**
   ```bash
   # Search for login modal
   grep -r "Admin Login" pages/
   ```

2. **Find Upload Form:**
   ```bash
   # Search for upload modal
   grep -r "Add New Video" pages/
   ```

3. **Find Contact Save:**
   ```bash
   # Search for contact submission
   grep -r "submitContactForm" src/
   ```

---

## 💡 Key Points

1. **Login Popup** = Shown when not authenticated in `/admin`
2. **Upload Form** = Opens when clicking "Add Video" in admin panel
3. **Contact Data** = Saves to `contact_submissions` table in Supabase
4. **View Contacts** = Go to Admin → Contacts tab to see all submissions
5. **Mock Mode** = Without Supabase, contact forms only log to console

---

All three features are fully implemented and working! 🎉
