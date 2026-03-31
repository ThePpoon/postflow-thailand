

## Plan: แก้บัค outline เขียว, ลบ PromoBanner, ปรับ Billing เป็นหน้า Pricing, ปรับ Settings/Profile

### 1. แก้บัค green outline
- ใน `src/index.css` ค่า `--ring: 145 100% 39%` ทำให้ focus ring เป็นสีเขียว
- แก้ `--ring` เป็นสีที่ไม่เด่น หรือเพิ่ม global CSS `*:focus { outline: none }` ตามความเหมาะสม
- ตรวจสอบ component ที่มี `focus-visible:ring` แล้วปรับ

### 2. ลบ PromoBanner
- ลบการ import และใช้งาน `<PromoBanner />` ออกจาก `src/components/AppLayout.tsx`
- ลบไฟล์ `src/components/PromoBanner.tsx`

### 3. ปรับหน้า Billing → Pricing Plans (ตามรูปตัวอย่าง)
- แก้ `src/pages/BillingPage.tsx` ให้แสดง:
  - Toggle สลับ **รายเดือน / รายปี** (รายปีมีป้าย "ฟรี 1 เดือน")
  - 2 แพ็กเกจ:
    - **Creator** (฿899/เดือน, ฿799/เดือน รายปี) — 15 บัญชี, โพสต์ไม่จำกัด, ตั้งเวลาโพสต์, Carousel, วิดีโอ
    - **Pro** (฿1,499/เดือน, ฿1,299/เดือน รายปี) — บัญชีไม่จำกัด, ทุกอย่างใน Creator + วิเคราะห์, ทีม, Priority support
  - แต่ละแพ็กเกจแสดง feature list พร้อม checkmark สีเขียว
  - ปุ่ม "แผนปัจจุบัน" (disabled) สำหรับ Creator, ปุ่ม "เริ่มต้นใช้งาน →" สำหรับ Pro

### 4. ปรับหน้า Settings/Profile (ตามรูปตัวอย่าง)
แก้ `src/pages/SettingsPage.tsx` ให้มี 4 sections:

- **Profile**: รูปโปรไฟล์ (อัปโหลดได้) + ช่อง Display Name (แก้ไขได้) + แสดง Email
- **Email Address**: แสดง Current Email + ปุ่ม "เปลี่ยนอีเมล" (เรียก `supabase.auth.updateUser({ email })`)
- **Password**: ปุ่ม "เปลี่ยนรหัสผ่าน" + ลิงก์ "ลืมรหัสผ่าน? ส่งลิงก์รีเซ็ต"
- **Security**: ปุ่ม "ออกจากระบบทุกอุปกรณ์" (เรียก `supabase.auth.signOut({ scope: 'global' })`)

### 5. Database: สร้าง profiles table + avatar storage
- Migration: สร้างตาราง `profiles` (id uuid PK → auth.users, display_name text, avatar_url text) พร้อม RLS
- สร้าง storage bucket `avatars` (public)
- Trigger: auto-create profile on new user signup

### Files ที่แก้ไข
| File | Action |
|------|--------|
| `src/index.css` | แก้ `--ring` |
| `src/components/AppLayout.tsx` | ลบ PromoBanner |
| `src/components/PromoBanner.tsx` | ลบไฟล์ |
| `src/pages/BillingPage.tsx` | Redesign เป็น pricing plans |
| `src/pages/SettingsPage.tsx` | Redesign เป็น profile + email + password + security |
| DB migration | สร้าง profiles table + avatars bucket |

