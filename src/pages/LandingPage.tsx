import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Link2, Edit3, Clock, Send } from 'lucide-react';
import logo from '@/assets/logo.png';

const features = [
  {
    icon: Link2,
    title: 'เชื่อมต่อบัญชี',
    desc: 'เชื่อมต่อ Facebook, Instagram, X, TikTok ได้ในที่เดียว',
  },
  {
    icon: Edit3,
    title: 'เขียนครั้งเดียว',
    desc: 'สร้างโพสต์เพียงครั้งเดียว แล้วส่งไปทุกแพลตฟอร์ม',
  },
  {
    icon: Send,
    title: 'โพสต์ทุกที่',
    desc: 'โพสต์ไปยังทุกแพลตฟอร์มที่เชื่อมต่อพร้อมกัน',
  },
  {
    icon: Clock,
    title: 'ตั้งเวลาโพสต์',
    desc: 'ตั้งเวลาโพสต์ล่วงหน้าเพื่อเข้าถึงลูกค้าได้ตรงเวลา',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 md:px-12">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Post2Flow" className="h-9 w-9 rounded-lg" />
          <span className="text-xl font-bold text-foreground">Post2Flow</span>
        </div>
        <Link to="/login">
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
            เข้าสู่ระบบ
          </Button>
        </Link>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center px-6 pt-20 pb-16 text-center md:pt-32">
        <div className="mb-4 inline-flex items-center rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground">
          🚀 จัดการโซเชียลมีเดียทั้งหมดในที่เดียว
        </div>
        <h1 className="max-w-3xl text-4xl font-extrabold leading-tight text-foreground md:text-6xl">
          โพสต์ทุกแพลตฟอร์ม
          <br />
          <span className="text-primary">ในคลิกเดียว</span>
        </h1>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">
          Post to all platforms in one click — เชื่อมต่อ Facebook, Instagram, X และ TikTok
          แล้วโพสต์ไปทุกที่พร้อมกัน
        </p>
        <Link to="/signup" className="mt-8">
          <Button size="lg" className="gap-2 rounded-full px-8 text-base font-semibold">
            เริ่มต้นฟรี <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/30"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mb-2 text-base font-semibold text-foreground">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        © 2026 Post2Flow — สร้างขึ้นสำหรับธุรกิจขนาดเล็กในประเทศไทย
      </footer>
    </div>
  );
}
