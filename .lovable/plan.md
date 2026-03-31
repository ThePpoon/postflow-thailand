

## Plan: เพิ่มหัวข้อ "Create" ใน Sidebar และหน้าเลือกประเภทโพสต์

จากรูปตัวอย่าง (Post Bridge) ผู้ใช้ต้องการ:

1. **Sidebar** — เพิ่มกลุ่ม "Create" ที่มีเมนูย่อย "New post" แทนที่จะมีแค่ปุ่ม "สร้างโพสต์" เดียว
2. **หน้าเลือกประเภทโพสต์** (`/posts/new`) — แสดง 3 การ์ดให้เลือก: Text Post, Image Post, Video Post
3. **หน้าสร้างโพสต์แต่ละประเภท** — ปรับ layout ตามรูปตัวอย่าง โดยมี:
   - เลือก account ด้านบน (แสดงเป็น icon)
   - พื้นที่อัปโหลดรูป/วิดีโอ (สำหรับ Image/Video post)
   - Main Caption + character count (x/2200)
   - Sidebar ขวา: Media Preview, Schedule post toggle, Post now / Save to Drafts
   - ด้านล่าง: Platform Captions แยกแต่ละแพลตฟอร์ม

### Files to change

**1. `src/components/AppSidebar.tsx`**
- แยก navigation เป็น 3 กลุ่ม: **Create** (New post), **Posts** (โพสต์ทั้งหมด), primary items
- เพิ่ม "Create" group header เหมือน "Config"

**2. `src/pages/CreatePostPage.tsx` → เปลี่ยนเป็นหน้าเลือกประเภท**
- แสดง 3 การ์ดใหญ่: Text Post, Image Post, Video Post
- แต่ละการ์ดมี icon และแสดง platform icons ด้านล่าง
- คลิกแล้วนำไปหน้า `/posts/new/text`, `/posts/new/image`, `/posts/new/video`

**3. สร้าง `src/pages/CreateTextPostPage.tsx`**
- Layout: Main area (เลือก account + caption + platform captions) | Sidebar (Schedule toggle + Post now + Save to Drafts)
- Schedule post toggle → แสดง date picker + time picker

**4. สร้าง `src/pages/CreateImagePostPage.tsx`**
- เหมือน Text Post แต่เพิ่มพื้นที่อัปโหลดรูปภาพ (drag & drop, Add More Photos)
- Sidebar ขวา: Media Preview แสดงรูปที่อัปโหลด + Schedule + Post now

**5. สร้าง `src/pages/CreateVideoPostPage.tsx`**
- เหมือน Image Post แต่รับไฟล์วิดีโอแทน
- Sidebar ขวา: Media Preview แสดงวิดีโอ + Schedule + Post now

**6. `src/App.tsx`**
- เพิ่ม routes: `/posts/new/text`, `/posts/new/image`, `/posts/new/video`

### Layout ของหน้าสร้างโพสต์ (ตามรูปตัวอย่าง)

```text
┌─────────────────────────────────┬──────────────────┐
│  เลือก Account (icons)          │  Media Preview   │
│                                 │  (รูป/วิดีโอ)     │
│  [พื้นที่อัปโหลดรูป/วิดีโอ]      │                  │
│                                 │  Schedule post ○  │
│  Main Caption                   │  [Pick a time]   │
│  ┌─────────────────────────┐    │  Select date     │
│  │ เขียนข้อความ...          │    │  Select time     │
│  └─────────────────────────┘    │                  │
│  x/2200                         │  [Post now] btn  │
│                                 │  Save to Drafts  │
│  Platform Captions              │                  │
│  - Facebook: ข้อความ...          │                  │
│  - Instagram: ข้อความ...         │                  │
└─────────────────────────────────┴──────────────────┘
```

### UI ทั้งหมดเป็นภาษาไทย
- Text Post → โพสต์ข้อความ
- Image Post → โพสต์รูปภาพ  
- Video Post → โพสต์วิดีโอ
- Schedule post → ตั้งเวลาโพสต์
- Post now → โพสต์เดี๋ยวนี้
- Save to Drafts → บันทึกแบบร่าง

