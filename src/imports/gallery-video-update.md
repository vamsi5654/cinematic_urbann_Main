PROJECT: Modify Existing Cinematic Website (Keep UI Same – Change Gallery to Video System)

IMPORTANT
The current website design, layout, colors, and UI must remain exactly the same.
Only the functionality of the **Gallery Page and Admin Upload Form** should be modified.

---

1. GALLERY PAGE (VIDEO PORTFOLIO)

The current gallery shows images.
Change it to display **YouTube videos instead of images**.

The page layout must stay **exactly the same as the current design**:

• Same Portfolio title
• Same category buttons
• Same grid layout
• Same hover style
• Same dark theme design

Categories must remain:

• All
• Kitchen
• Living
• Bedroom
• Full Home
• Bathroom
• Office

---

2. VIDEO DISPLAY BEHAVIOR

Each gallery item must display a **YouTube video preview**.

Requirements:

• Videos must **autoplay when visible on screen**
• Videos must be **muted by default** (required by browsers for autoplay)
• Videos must **loop continuously**
• Videos must **pause automatically when not visible on screen**

Use YouTube embed format:

https://www.youtube.com/embed/VIDEO_ID?autoplay=1&mute=1&loop=1&playlist=VIDEO_ID

Videos should appear exactly where images previously appeared.

---

3. VIDEO GRID STYLE

Each video card should include:

• Video preview (autoplay muted)
• Category label
• Optional project title

The grid layout must stay **exactly the same as current gallery cards**.

---

4. ADMIN PANEL CHANGES

Current admin panel allows **image upload**.

Replace this with **Video Entry Form**.

Remove:

• Image upload area
• Drag and drop upload

Replace with a **simple form**.

---

5. SIMPLE ADMIN FORM

The admin form should contain only:

Category (Dropdown)

Options:
• Kitchen
• Living
• Bedroom
• Full Home
• Bathroom
• Office

Video URL (YouTube link)

Example:
https://www.youtube.com/watch?v=VIDEO_ID

Optional Field:

Project Title

---

6. VIDEO STORAGE

When admin submits the form:

Extract the YouTube Video ID from the URL.

Example:

Input:
https://www.youtube.com/watch?v=abc123xyz

Store:
abc123xyz

Database fields:

id
video_id
category
title
created_at

---

7. ADMIN DASHBOARD SECTIONS

Keep current sections but rename **Images → Videos**

Admin tabs:

Videos
Events
Contacts

Existing contact form data must remain unchanged.

---

8. SCHEDULED POPUP EVENTS (KEEP EXISTING)

The current event popup system should remain the same.

Admin should still be able to:

• Create popup
• Add image or video
• Set start date
• Set end date

Popup should automatically:

• Show on start date
• Stop showing after end date

---

9. FRONTEND PERFORMANCE

For better performance:

• Load videos using lazy loading
• Only autoplay when video enters viewport
• Pause videos when scrolled away

---

10. FINAL RESULT

The portfolio page should look exactly the same as before, but instead of static images it should show **autoplaying YouTube design videos categorized by room type**.

Admin panel should have a **very simple form to add videos using only category and YouTube link**.
