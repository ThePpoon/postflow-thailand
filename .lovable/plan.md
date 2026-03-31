

## Plan: Redesign Landing Page แบบ Post Bridge

จากรูปตัวอย่าง Post Bridge จะทำ Landing Page แบบ single-page scroll มี navbar sticky พร้อมลิงก์ anchor ไปแต่ละ section

### โครงสร้างหน้า (ทั้งหมดอยู่ใน `src/pages/LandingPage.tsx`)

**1. Navbar (sticky)**
- โลโก้ Post2Flow + ลิงก์: Pricing, Features, Platforms, FAQ
- ลิงก์เป็น anchor scroll (`#pricing`, `#features`, `#platforms`, `#faq`)
- ปุ่ม "เข้าสู่ระบบ" ด้านขวา
- ธีมสีเข้มตามที่มีอยู่

**2. Hero Section**
- ไอคอนแพลตฟอร์ม (Facebook, Instagram, X, TikTok, YouTube, LINE) แสดงเป็นแถว
- หัวข้อใหญ่: "โพสต์ทุกแพลตฟอร์ม จากที่เดียว"
- คำอธิบายย่อย
- ปุ่ม CTA "เริ่มต้นฟรี"

**3. Features Section** (`#features`)
- แบ่ง 2 section ย่อยสลับซ้าย-ขวา:
  - **Cross-Posting**: ข้อความซ้าย + กราฟิกขวา (แสดง diagram เชื่อมต่อแพลตฟอร์ม คล้ายรูปตัวอย่าง)
  - **Scheduling**: กราฟิกซ้าย + ข้อความขวา (แสดง UI ตั้งเวลาโพสต์)
- ข้อความเป็นภาษาไทย, คำ highlight เป็นสีเขียว primary

**4. Platforms Section** (`#platforms`)
- หัวข้อ "แพลตฟอร์มที่รองรับ"
- Grid แสดงการ์ดแต่ละแพลตฟอร์ม: Facebook, Instagram, X, TikTok, LINE, YouTube + "เพิ่มเติมเร็วๆ นี้"
- ใช้ไอคอนจาก lucide หรือ SVG

**5. Pricing Section** (`#pricing`)
- หัวข้อ "แพ็กเกจราคา"
- Toggle รายเดือน/รายปี (reuse data จาก BillingPage)
- 2 การ์ด: Creator (฿899/เดือน) และ Pro (฿1,499/เดือน)
- ปุ่ม "เริ่มต้น" ในแต่ละการ์ด → ลิงก์ไป `/signup`

**6. FAQ Section** (`#faq`)
- หัวข้อ "คำถามที่พบบ่อย" ซ้าย + Accordion ขวา
- คำถาม 6-8 ข้อเกี่ยวกับแพลตฟอร์ม, โพสต์, แพ็กเกจ, ยกเลิก
- ใช้ Accordion component ที่มีอยู่แล้ว

**7. Footer**
- ข้อความ copyright

### รายละเอียดทางเทคนิค

| File | Action |
|------|--------|
| `src/pages/LandingPage.tsx` | Rewrite ทั้งหมด — เพิ่ม sections ทั้ง 7 |

- ใช้ smooth scroll behavior (`scroll-behavior: smooth` ใน CSS)
- Navbar ใช้ `sticky top-0` พร้อม backdrop blur
- Platform icons ใช้ lucide-react + custom SVG สำหรับ TikTok, LINE
- FAQ ใช้ `Accordion` จาก `@/components/ui/accordion`
- ไม่แก้ไฟล์อื่น ไม่สร้าง route ใหม่

