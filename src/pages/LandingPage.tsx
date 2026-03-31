import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowRight, Check, Facebook, Instagram, Youtube, MessageCircle, Clock, Send, Layers, CalendarDays, FileText, Image, Video } from 'lucide-react';
import logo from '@/assets/logo.png';

/* ───── Platform icons (custom SVGs for TikTok & LINE, X) ───── */
const XIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.72a8.26 8.26 0 0 0 4.76 1.5v-3.4a4.84 4.84 0 0 1-1-.13z" />
  </svg>
);

const LINEIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
  </svg>
);

/* ───── Data ───── */
const platforms = [
  { name: 'Facebook', icon: Facebook, color: 'text-blue-500' },
  { name: 'Instagram', icon: Instagram, color: 'text-pink-500' },
  { name: 'X (Twitter)', icon: XIcon, color: 'text-foreground' },
  { name: 'TikTok', icon: TikTokIcon, color: 'text-foreground' },
  { name: 'YouTube', icon: Youtube, color: 'text-red-500' },
  { name: 'LINE', icon: LINEIcon, color: 'text-green-500' },
];

const plans = [
  {
    name: 'Creator',
    monthlyPrice: 899,
    yearlyPrice: 799,
    description: 'สำหรับครีเอเตอร์และธุรกิจขนาดเล็ก',
    features: ['เชื่อมต่อได้ 15 บัญชี', 'โพสต์ไม่จำกัด', 'ตั้งเวลาโพสต์', 'Carousel Post', 'Video Post', 'แบบร่างไม่จำกัด'],
  },
  {
    name: 'Pro',
    monthlyPrice: 1499,
    yearlyPrice: 1299,
    description: 'สำหรับทีมและเอเจนซี่',
    features: ['บัญชีไม่จำกัด', 'ทุกอย่างใน Creator', 'วิเคราะห์ขั้นสูง', 'จัดการทีม', 'Priority Support', 'API Access'],
    popular: true,
  },
];

const faqs = [
  { q: 'Post2Flow รองรับแพลตฟอร์มอะไรบ้าง?', a: 'ปัจจุบันรองรับ Facebook, Instagram, X (Twitter), TikTok, YouTube และ LINE โดยเราจะเพิ่มแพลตฟอร์มใหม่อย่างต่อเนื่อง' },
  { q: 'สามารถโพสต์ไปหลายบัญชีพร้อมกันได้ไหม?', a: 'ได้ครับ คุณสามารถเลือกหลายบัญชีและหลายแพลตฟอร์มแล้วโพสต์พร้อมกันในคลิกเดียว' },
  { q: 'มีแพ็กเกจฟรีไหม?', a: 'เรามีช่วงทดลองใช้งานฟรี 14 วัน โดยไม่ต้องใส่บัตรเครดิต สามารถใช้ฟีเจอร์ทั้งหมดได้เลย' },
  { q: 'ตั้งเวลาโพสต์ล่วงหน้าได้ไหม?', a: 'ได้ครับ คุณสามารถตั้งเวลาโพสต์ล่วงหน้าได้ทั้งวันและเวลา ระบบจะโพสต์ให้อัตโนมัติ' },
  { q: 'รองรับโพสต์แบบไหนบ้าง?', a: 'รองรับทั้งโพสต์ข้อความ, รูปภาพ (รวม Carousel), และวิดีโอ โดยปรับขนาดให้เหมาะกับแต่ละแพลตฟอร์มอัตโนมัติ' },
  { q: 'สามารถยกเลิกสมัครได้ตลอดเวลาไหม?', a: 'ได้ครับ คุณสามารถยกเลิกได้ทุกเมื่อ โดยจะยังใช้งานได้จนถึงสิ้นรอบบิล' },
];

/* ───── Component ───── */
export default function LandingPage() {
  const [yearly, setYearly] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background scroll-smooth">
      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Post2Flow" className="h-9 w-9 rounded-lg" />
            <span className="text-xl font-bold text-foreground">Post2Flow</span>
          </div>
          <div className="hidden items-center gap-6 md:flex">
            {[
              { label: 'Features', id: 'features' },
              { label: 'Platforms', id: 'platforms' },
              { label: 'Pricing', id: 'pricing' },
              { label: 'FAQ', id: 'faq' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </button>
            ))}
          </div>
          <Link to="/login">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              เข้าสู่ระบบ
            </Button>
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="flex flex-col items-center px-6 pt-20 pb-16 text-center md:pt-32">
        {/* Platform icons */}
        <div className="mb-8 flex items-center gap-4">
          {platforms.map((p) => (
            <div key={p.name} className={`flex h-10 w-10 items-center justify-center rounded-xl bg-card border border-border ${p.color}`}>
              <p.icon />
            </div>
          ))}
        </div>
        <h1 className="max-w-3xl text-4xl font-extrabold leading-tight text-foreground md:text-6xl">
          โพสต์ทุกแพลตฟอร์ม
          <br />
          <span className="text-primary">จากที่เดียว</span>
        </h1>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">
          เชื่อมต่อทุกโซเชียลมีเดีย สร้างโพสต์ครั้งเดียว แล้วส่งไปทุกแพลตฟอร์มพร้อมกัน ตั้งเวลาล่วงหน้า จัดการได้ในที่เดียว
        </p>
        <Link to="/signup" className="mt-8">
          <Button size="lg" className="gap-2 rounded-full px-8 text-base font-semibold">
            เริ่มต้นฟรี <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </section>

      {/* ── Features ── */}
      <section id="features" className="mx-auto max-w-6xl px-6 pt-32 pb-20">
        <h2 className="mb-16 text-center text-3xl font-bold text-foreground md:text-4xl">
          ฟีเจอร์ที่ช่วยให้คุณ<span className="text-primary">ทำงานง่ายขึ้น</span>
        </h2>

        {/* Feature 1: Cross-Posting */}
        <div className="mb-20 grid items-center gap-12 md:grid-cols-2">
          <div>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Send className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-3 text-2xl font-bold text-foreground">Cross-Posting อัตโนมัติ</h3>
            <p className="mb-4 text-muted-foreground">
              เขียนโพสต์ครั้งเดียว แล้วส่งไปยังทุกแพลตฟอร์มที่เชื่อมต่อพร้อมกัน ไม่ต้องเสียเวลาก็อปวางทีละที่
            </p>
            <ul className="space-y-2">
              {['เลือกแพลตฟอร์มได้อิสระ', 'ปรับข้อความแต่ละแพลตฟอร์ม', 'รองรับข้อความ รูป และวิดีโอ'].map((t) => (
                <li key={t} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-primary shrink-0" /> {t}
                </li>
              ))}
            </ul>
          </div>
          {/* Graphic: platform diagram */}
          <div className="flex items-center justify-center">
            <div className="relative rounded-2xl border border-border bg-card p-8">
              <div className="flex flex-col items-center gap-4">
                <div className="rounded-xl border border-border bg-secondary p-4 text-center">
                  <FileText className="mx-auto mb-2 h-8 w-8 text-primary" />
                  <span className="text-sm font-medium text-foreground">โพสต์ของคุณ</span>
                </div>
                <div className="h-8 w-px bg-primary/50" />
                <div className="grid grid-cols-3 gap-3">
                  {platforms.slice(0, 6).map((p) => (
                    <div key={p.name} className={`flex h-12 w-12 items-center justify-center rounded-lg border border-border bg-secondary ${p.color}`}>
                      <p.icon />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 2: Scheduling */}
        <div className="grid items-center gap-12 md:grid-cols-2">
          {/* Graphic: schedule UI */}
          <div className="order-2 flex items-center justify-center md:order-1">
            <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6">
              <div className="mb-4 flex items-center gap-3">
                <CalendarDays className="h-5 w-5 text-primary" />
                <span className="font-medium text-foreground">ตั้งเวลาโพสต์</span>
              </div>
              <div className="space-y-3">
                {['จันทร์ 09:00 — Facebook, IG', 'พุธ 12:00 — X, TikTok', 'ศุกร์ 18:00 — ทุกแพลตฟอร์ม'].map((s, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-lg border border-border bg-secondary px-4 py-3">
                    <Clock className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-sm text-muted-foreground">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-3 text-2xl font-bold text-foreground">ตั้งเวลาโพสต์ล่วงหน้า</h3>
            <p className="mb-4 text-muted-foreground">
              วางแผนคอนเทนต์ล่วงหน้า ตั้งเวลาที่ต้องการ ระบบจะโพสต์ให้อัตโนมัติตามเวลาที่กำหนด
            </p>
            <ul className="space-y-2">
              {['ตั้งเวลาโพสต์ล่วงหน้าได้ไม่จำกัด', 'ดูปฏิทินคอนเทนต์ภาพรวม', 'แก้ไขหรือยกเลิกได้ตลอด'].map((t) => (
                <li key={t} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-primary shrink-0" /> {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Platforms ── */}
      <section id="platforms" className="border-t border-border bg-card/50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-4 text-center text-3xl font-bold text-foreground md:text-4xl">
            แพลตฟอร์มที่<span className="text-primary">รองรับ</span>
          </h2>
          <p className="mx-auto mb-12 max-w-lg text-center text-muted-foreground">
            เชื่อมต่อแพลตฟอร์มยอดนิยมและจัดการทุกบัญชีจากที่เดียว
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {platforms.map((p) => (
              <div key={p.name} className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/30">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-secondary ${p.color}`}>
                  <p.icon />
                </div>
                <span className="text-sm font-medium text-foreground">{p.name}</span>
              </div>
            ))}
            {/* Coming soon */}
            {['Threads', 'Pinterest'].map((name) => (
              <div key={name} className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-card/50 p-6 opacity-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                  <Layers className="h-6 w-6 text-muted-foreground" />
                </div>
                <span className="text-sm text-muted-foreground">{name}</span>
                <Badge variant="secondary" className="text-xs">เร็วๆ นี้</Badge>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-20">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="mb-4 text-center text-3xl font-bold text-foreground md:text-4xl">
            แพ็กเกจ<span className="text-primary">ราคา</span>
          </h2>
          <p className="mx-auto mb-8 max-w-lg text-center text-muted-foreground">
            เลือกแผนที่เหมาะกับการใช้งานของคุณ
          </p>

          {/* Toggle */}
          <div className="mb-10 flex items-center justify-center gap-3">
            <span className={`text-sm font-medium transition-colors ${!yearly ? 'text-foreground' : 'text-muted-foreground'}`}>
              รายเดือน
            </span>
            <button
              onClick={() => setYearly(!yearly)}
              className="relative h-6 w-11 rounded-full bg-secondary border border-border transition-colors shrink-0"
            >
              <span
                className="absolute rounded-full bg-primary transition-transform duration-200"
                style={{ width: 18, height: 18, top: 2, left: 2, transform: yearly ? 'translateX(20px)' : 'translateX(0)' }}
              />
            </button>
            <span className={`text-sm font-medium transition-colors ${yearly ? 'text-foreground' : 'text-muted-foreground'}`}>
              รายปี
            </span>
            {yearly && (
              <Badge className="bg-primary/15 text-primary hover:bg-primary/15 text-xs">ประหยัด 2 เดือน</Badge>
            )}
          </div>

          {/* Cards */}
          <div className="grid gap-6 md:grid-cols-2">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border bg-card p-8 ${plan.popular ? 'border-primary/50 ring-1 ring-primary/20' : 'border-border'}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">ยอดนิยม</Badge>
                  </div>
                )}
                <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-foreground">
                    ฿{(yearly ? plan.yearlyPrice : plan.monthlyPrice).toLocaleString()}
                  </span>
                  <span className="text-muted-foreground">/เดือน</span>
                </div>
                {yearly && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    เรียกเก็บ ฿{(plan.yearlyPrice * 12).toLocaleString()}/ปี
                  </p>
                )}
                {!yearly && <p className="mt-1 text-xs text-muted-foreground invisible">placeholder</p>}
                <ul className="mt-6 space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-primary shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Link to="/signup" className="mt-6 block">
                  <Button className="w-full" variant={plan.popular ? 'default' : 'outline'}>
                    เริ่มต้นใช้งาน <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="border-t border-border bg-card/50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-12 md:grid-cols-[1fr_2fr]">
            <div>
              <h2 className="text-3xl font-bold text-foreground md:text-4xl">
                คำถามที่<span className="text-primary">พบบ่อย</span>
              </h2>
              <p className="mt-3 text-muted-foreground">
                หากไม่พบคำตอบที่ต้องการ สามารถติดต่อทีมงานได้ตลอดเวลา
              </p>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border-border">
                  <AccordionTrigger className="text-left text-foreground hover:no-underline">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        © 2026 Post2Flow — สร้างขึ้นสำหรับธุรกิจขนาดเล็กในประเทศไทย
      </footer>
    </div>
  );
}
