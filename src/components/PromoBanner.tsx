import { useState } from 'react';
import { Gift, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

export function PromoBanner() {
  const [visible, setVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 40 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.hours === 0 && prev.minutes === 0) return prev;
        const totalMinutes = prev.hours * 60 + prev.minutes - 1;
        return {
          hours: Math.floor(totalMinutes / 60),
          minutes: totalMinutes % 60,
        };
      });
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  return (
    <div className="relative flex items-center gap-4 bg-primary/10 border-b border-primary/20 px-4 py-3 text-sm">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 shrink-0">
        <Gift className="h-4 w-4 text-primary" />
      </div>
      <div className="flex flex-1 flex-wrap items-center gap-x-4 gap-y-1">
        <span className="font-semibold text-foreground">ข้อเสนอพิเศษ: ฟรี 2 เดือน</span>
        <span className="text-warning font-medium">
          ⏱️ เหลือ {timeLeft.hours}ชม. {timeLeft.minutes}นาที
        </span>
        <span className="text-muted-foreground hidden lg:inline">
          สำหรับผู้ใช้ใหม่ รับฟรี 2 เดือนเมื่อคุณสมัครแผน Pro รายปี
        </span>
      </div>
      <Button size="sm" className="shrink-0 gap-1">
        รับฟรี 2 เดือน →
      </Button>
      <button
        onClick={() => setVisible(false)}
        className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
