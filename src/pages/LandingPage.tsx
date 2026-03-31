import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowRight, Check, Facebook, Instagram, Youtube, MessageCircle, Clock, Send, Layers, CalendarDays, FileText, Image, Video, Zap, BarChart3, Shield, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import logo from '@/assets/logo.png';

/* ───── Platform icons ───── */
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

/* ───── Animation variants ───── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

/* ───── Data ───── */
const platforms = [
  { name: 'Facebook', icon: Facebook, color: 'text-blue-500' },
  { name: 'Instagram', icon: Instagram, color: 'text-pink-500' },
  { name: 'X (Twitter)', icon: XIcon, color: 'text-foreground' },
  { name: 'TikTok', icon: TikTokIcon, color: 'text-foreground' },
  { name: 'YouTube', icon: Youtube, color: 'text-red-500' },
  { name: 'LINE', icon: LINEIcon, color: 'text-green-500' },
];

const features = [
  {
    icon: Send,
    title: 'Cross-Posting อัตโนมัติ',
    desc: 'เขียนโพสต์ครั้งเดียว ส่งไปยังทุกแพลตฟอร์มพร้อมกัน',
  },
  {
    icon: Clock,
    title: 'ตั้งเวลาโพสต์ล่วงหน้า',
    desc: 'วางแผนคอนเทนต์ล่วงหน้า ระบบจะโพสต์ให้อัตโนมัติ',
  },
  {
    icon: Image,
    title: 'Carousel & Media',
    desc: 'รองรับรูปภาพ Carousel และวิดีโอ ปรับขนาดอัตโนมัติ',
  },
  {
    icon: BarChart3,
    title: 'วิเคราะห์ผลลัพธ์',
    desc: 'ดูสถิติ Engagement ของทุกแพลตฟอร์มในที่เดียว',
  },
  {
    icon: Layers,
    title: 'จัดการหลายบัญชี',
    desc: 'เชื่อมต่อหลายบัญชี หลายแบรนด์ จัดการง่ายในที่เดียว',
  },
  {
    icon: Shield,
    title: 'ปลอดภัย & น่าเชื่อถือ',
    desc: 'เข้ารหัสข้อมูล OAuth ที่ปลอดภัย ไม่เก็บรหัสผ่าน',
  },
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
    <div className="min-h-screen bg-background scroll-smooth overflow-x-hidden">
      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 border-b border-border/30 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          <div className="flex items-center gap-2.5">
            <img src={logo} alt="Post2Flow" className="h-9 w-9 rounded-lg" />
            <span className="text-xl font-bold text-foreground tracking-tight">Post2Flow</span>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            {[
              { label: 'Features', id: 'features' },
              { label: 'Platforms', id: 'platforms' },
              { label: 'Pricing', id: 'pricing' },
              { label: 'FAQ', id: 'faq' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-primary after:transition-all hover:after:w-full"
              >
                {item.label}
              </button>
            ))}
          </div>
          <Link to="/login">
            <Button variant="outline" size="sm" className="rounded-full border-border/50 text-foreground hover:bg-card">
              เข้าสู่ระบบ
            </Button>
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative flex min-h-[calc(100vh-57px)] flex-col items-center justify-center px-6 text-center overflow-hidden">
        {/* Background effects */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[800px] rounded-full bg-primary/5 blur-[120px]" />
          <div className="absolute right-0 top-0 h-[300px] w-[300px] rounded-full bg-primary/3 blur-[80px]" />
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="relative z-10 flex flex-col items-center"
        >
          {/* Badge */}
          <motion.div variants={fadeUp}>
            <Badge variant="secondary" className="mb-8 gap-2 rounded-full border border-border/50 bg-card/80 px-4 py-2 text-sm backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              จัดการโซเชียลมีเดียทุกแพลตฟอร์ม
            </Badge>
          </motion.div>

          {/* Platform icons */}
          <motion.div variants={fadeUp} className="mb-10 flex items-center gap-3">
            {platforms.map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.08, duration: 0.5 }}
                className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-card/80 border border-border/50 backdrop-blur-sm ${p.color} transition-transform hover:scale-110 hover:-translate-y-1`}
              >
                <p.icon />
              </motion.div>
            ))}
          </motion.div>

          {/* Heading */}
          <motion.h1 variants={fadeUp} className="max-w-4xl text-5xl font-extrabold leading-[1.1] tracking-tight text-foreground md:text-7xl">
            โพสต์ทุกแพลตฟอร์ม
            <br />
            <span className="bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
              จากที่เดียว
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p variants={fadeUp} className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            เชื่อมต่อทุกโซเชียลมีเดีย สร้างโพสต์ครั้งเดียว แล้วส่งไปทุกแพลตฟอร์มพร้อมกัน
            <br className="hidden md:block" />
            ตั้งเวลาล่วงหน้า จัดการได้ในที่เดียว
          </motion.p>

          {/* CTA */}
          <motion.div variants={fadeUp} className="mt-10 flex items-center gap-4">
            <Link to="/signup">
              <Button size="lg" className="gap-2 rounded-full px-8 text-base font-semibold shadow-lg shadow-primary/25 transition-shadow hover:shadow-xl hover:shadow-primary/30">
                เริ่มต้นฟรี <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <button
              onClick={() => scrollTo('features')}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground"
            >
              ดูฟีเจอร์ทั้งหมด
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div variants={fadeUp} className="mt-16 flex items-center gap-8 md:gap-12">
            {[
              { value: '6+', label: 'แพลตฟอร์ม' },
              { value: '1K+', label: 'ผู้ใช้งาน' },
              { value: '99.9%', label: 'Uptime' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-foreground md:text-3xl">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="relative py-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-0 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-primary/3 blur-[100px]" />
        </div>
        <div className="relative mx-auto max-w-6xl px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.div variants={fadeUp}>
              <Badge variant="secondary" className="mb-4 rounded-full border border-border/50 bg-card/80 px-4 py-1.5 text-xs">
                FEATURES
              </Badge>
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-3xl font-bold text-foreground md:text-5xl tracking-tight">
              ฟีเจอร์ที่ช่วยให้คุณ
              <span className="bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent"> ทำงานง่ายขึ้น</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-4 text-muted-foreground max-w-lg mx-auto">
              เครื่องมือครบครันสำหรับจัดการโซเชียลมีเดียของคุณ
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={stagger}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((f) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                className="group rounded-2xl border border-border/50 bg-card/50 p-7 backdrop-blur-sm transition-all hover:border-primary/20 hover:bg-card/80 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/15">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Platforms ── */}
      <section id="platforms" className="relative py-28 border-t border-border/30">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.div variants={fadeUp}>
              <Badge variant="secondary" className="mb-4 rounded-full border border-border/50 bg-card/80 px-4 py-1.5 text-xs">
                PLATFORMS
              </Badge>
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-3xl font-bold text-foreground md:text-5xl tracking-tight">
              แพลตฟอร์มที่<span className="bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent"> รองรับ</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-4 text-muted-foreground max-w-lg mx-auto">
              เชื่อมต่อแพลตฟอร์มยอดนิยมและจัดการทุกบัญชีจากที่เดียว
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={stagger}
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4"
          >
            {platforms.map((p) => (
              <motion.div
                key={p.name}
                variants={scaleIn}
                className="group flex flex-col items-center gap-4 rounded-2xl border border-border/50 bg-card/50 p-8 backdrop-blur-sm transition-all hover:border-primary/20 hover:bg-card/80 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1"
              >
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/80 ${p.color} transition-transform group-hover:scale-110`}>
                  <p.icon />
                </div>
                <span className="text-sm font-medium text-foreground">{p.name}</span>
              </motion.div>
            ))}
            {['Threads', 'Pinterest'].map((name) => (
              <motion.div
                key={name}
                variants={scaleIn}
                className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border/40 bg-card/20 p-8 opacity-40"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/50">
                  <Layers className="h-6 w-6 text-muted-foreground" />
                </div>
                <span className="text-sm text-muted-foreground">{name}</span>
                <Badge variant="secondary" className="text-xs bg-secondary/50">เร็วๆ นี้</Badge>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="relative py-28 border-t border-border/30">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-0 top-1/3 h-[400px] w-[400px] rounded-full bg-primary/3 blur-[100px]" />
        </div>
        <div className="relative mx-auto max-w-4xl px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
            className="text-center mb-12"
          >
            <motion.div variants={fadeUp}>
              <Badge variant="secondary" className="mb-4 rounded-full border border-border/50 bg-card/80 px-4 py-1.5 text-xs">
                PRICING
              </Badge>
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-3xl font-bold text-foreground md:text-5xl tracking-tight">
              แพ็กเกจ<span className="bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent"> ราคา</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-4 text-muted-foreground max-w-lg mx-auto">
              เลือกแผนที่เหมาะกับการใช้งานของคุณ
            </motion.p>
          </motion.div>

          {/* Toggle */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-12 flex items-center justify-center gap-3"
          >
            <span className={`text-sm font-medium transition-colors ${!yearly ? 'text-foreground' : 'text-muted-foreground'}`}>
              รายเดือน
            </span>
            <button
              onClick={() => setYearly(!yearly)}
              className={`relative h-7 w-12 rounded-full border transition-colors shrink-0 ${yearly ? 'bg-primary border-primary' : 'bg-secondary border-border'}`}
            >
              <span
                className={`absolute rounded-full transition-all duration-200 ${yearly ? 'bg-background' : 'bg-muted-foreground'}`}
                style={{ width: 20, height: 20, top: 2.5, left: 2, transform: yearly ? 'translateX(20px)' : 'translateX(0)' }}
              />
            </button>
            <span className={`text-sm font-medium transition-colors ${yearly ? 'text-foreground' : 'text-muted-foreground'}`}>
              รายปี
            </span>
            {yearly && (
              <Badge className="bg-primary/15 text-primary hover:bg-primary/15 text-xs rounded-full border-0">ประหยัด 2 เดือน</Badge>
            )}
          </motion.div>

          {/* Cards */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid gap-6 md:grid-cols-2"
          >
            {plans.map((plan) => (
              <motion.div
                key={plan.name}
                variants={scaleIn}
                className={`relative rounded-2xl border bg-card/50 backdrop-blur-sm p-8 transition-all hover:shadow-lg ${
                  plan.popular
                    ? 'border-primary/40 shadow-lg shadow-primary/10'
                    : 'border-border/50 hover:border-border'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground rounded-full px-4 shadow-lg shadow-primary/25">ยอดนิยม</Badge>
                  </div>
                )}
                <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-5xl font-bold tracking-tight text-foreground">
                    ฿{(yearly ? plan.yearlyPrice : plan.monthlyPrice).toLocaleString()}
                  </span>
                  <span className="text-muted-foreground">/เดือน</span>
                </div>
                <div className="h-5 mt-1">
                  {yearly && (
                    <p className="text-xs text-muted-foreground">
                      เรียกเก็บ ฿{(plan.yearlyPrice * 12).toLocaleString()}/ปี
                    </p>
                  )}
                </div>
                <div className="my-6 h-px bg-border/50" />
                <ul className="space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 shrink-0">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/signup" className="mt-8 block">
                  <Button
                    className={`w-full rounded-xl h-12 text-base font-medium ${
                      plan.popular
                        ? 'shadow-lg shadow-primary/20'
                        : ''
                    }`}
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    เริ่มต้นใช้งาน <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-28 border-t border-border/30">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
            className="grid gap-12 md:grid-cols-[1fr_2fr]"
          >
            <motion.div variants={fadeUp}>
              <Badge variant="secondary" className="mb-4 rounded-full border border-border/50 bg-card/80 px-4 py-1.5 text-xs">
                FAQ
              </Badge>
              <h2 className="text-3xl font-bold text-foreground md:text-4xl tracking-tight">
                คำถามที่
                <span className="bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent"> พบบ่อย</span>
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                หากไม่พบคำตอบที่ต้องการ สามารถติดต่อทีมงานได้ตลอดเวลา
              </p>
            </motion.div>
            <motion.div variants={fadeUp}>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, i) => (
                  <AccordionItem key={i} value={`faq-${i}`} className="border-border/50">
                    <AccordionTrigger className="text-left text-foreground hover:no-underline py-5">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="relative py-28 border-t border-border/30">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[600px] rounded-full bg-primary/5 blur-[120px]" />
        </div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="relative mx-auto max-w-3xl px-6 text-center"
        >
          <motion.h2 variants={fadeUp} className="text-3xl font-bold text-foreground md:text-5xl tracking-tight">
            พร้อมเริ่มต้น
            <span className="bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent"> แล้วหรือยัง?</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-lg text-muted-foreground">
            ทดลองใช้งานฟรี 14 วัน ไม่ต้องใส่บัตรเครดิต
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8">
            <Link to="/signup">
              <Button size="lg" className="gap-2 rounded-full px-10 text-base font-semibold shadow-lg shadow-primary/25 transition-shadow hover:shadow-xl hover:shadow-primary/30">
                สมัครฟรี <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border/30 py-10">
        <div className="mx-auto max-w-6xl px-6 flex flex-col items-center gap-4 md:flex-row md:justify-between">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Post2Flow" className="h-7 w-7 rounded-md" />
            <span className="text-sm font-semibold text-foreground">Post2Flow</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 Post2Flow — สร้างขึ้นสำหรับธุรกิจขนาดเล็กในประเทศไทย
          </p>
        </div>
      </footer>
    </div>
  );
}
