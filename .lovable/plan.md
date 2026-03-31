

## Plan: เพิ่ม Google Login, ลืมรหัสผ่าน ในหน้า Login/Signup

### ข้อจำกัดสำคัญ: Facebook Login
Facebook OAuth **ไม่รองรับ**ใน Lovable Cloud ในตอนนี้ รองรับเฉพาะ **Google** และ **Apple** เท่านั้น จึงจะเพิ่มเฉพาะ Google Login ให้

### สิ่งที่จะทำ

**1. เปิดใช้ Google OAuth**
- ใช้ Configure Social Auth tool เพื่อสร้าง lovable module สำหรับ Google sign-in
- ใช้ `lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin })`

**2. แก้ไข `src/pages/LoginPage.tsx`**
- เพิ่มปุ่ม "เข้าสู่ระบบด้วย Google" พร้อม Google icon ด้านบนฟอร์ม
- เพิ่ม divider "หรือ" คั่นระหว่างปุ่ม Google กับฟอร์ม email/password
- เพิ่มลิงก์ "ลืมรหัสผ่าน?" ใต้ช่อง password → นำไปหน้า `/forgot-password`

**3. แก้ไข `src/pages/SignupPage.tsx`**
- เพิ่มปุ่ม "สมัครด้วย Google" เหมือนหน้า Login

**4. สร้าง `src/pages/ForgotPasswordPage.tsx`**
- ฟอร์มกรอก email → เรียก `supabase.auth.resetPasswordForEmail(email, { redirectTo: origin + '/reset-password' })`
- แสดงข้อความสำเร็จ "เราได้ส่งลิงก์รีเซ็ตรหัสผ่านไปที่อีเมลของคุณแล้ว"

**5. สร้าง `src/pages/ResetPasswordPage.tsx`**
- ตรวจ URL hash สำหรับ `type=recovery`
- ฟอร์มกรอกรหัสผ่านใหม่ → เรียก `supabase.auth.updateUser({ password })`
- เมื่อสำเร็จ นำไปหน้า `/login`

**6. แก้ไข `src/App.tsx`**
- เพิ่ม routes: `/forgot-password`, `/reset-password` (public routes)

### UI ทั้งหมดเป็นภาษาไทย
- เข้าสู่ระบบด้วย Google
- ลืมรหัสผ่าน?
- รีเซ็ตรหัสผ่าน
- กรุณากรอกอีเมลเพื่อรับลิงก์เปลี่ยนรหัสผ่าน

