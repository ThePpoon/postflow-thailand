import { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { ConfigTabs } from '@/components/ConfigTabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Creator',
    monthlyPrice: 899,
    yearlyPrice: 799,
    description: 'สำหรับครีเอเตอร์และธุรกิจขนาดเล็ก',
    features: [
      'เชื่อมต่อได้ 15 บัญชี',
      'โพสต์ไม่จำกัด',
      'ตั้งเวลาโพสต์',
      'Carousel Post',
      'Video Post',
      'แบบร่างไม่จำกัด',
    ],
    current: true,
  },
  {
    name: 'Pro',
    monthlyPrice: 1499,
    yearlyPrice: 1299,
    description: 'สำหรับทีมและเอเจนซี่',
    features: [
      'บัญชีไม่จำกัด',
      'ทุกอย่างใน Creator',
      'วิเคราะห์ขั้นสูง',
      'จัดการทีม',
      'Priority Support',
      'API Access',
    ],
    current: false,
    popular: true,
  },
];

export default function BillingPage() {
  const [yearly, setYearly] = useState(false);

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto animate-fade-in space-y-6">
        <ConfigTabs />

        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-foreground">เลือกแพ็กเกจ</h2>
          <p className="text-muted-foreground">เลือกแผนที่เหมาะกับการใช้งานของคุณ</p>
        </div>

        {/* Toggle */}
        <div className="flex items-center justify-center gap-3 min-h-[32px]">
          <span className={`text-sm font-medium transition-colors ${!yearly ? 'text-foreground' : 'text-muted-foreground'}`}>
            รายเดือน
          </span>
          <button
            onClick={() => setYearly(!yearly)}
            className="relative h-6 w-11 rounded-full border border-border bg-secondary transition-colors shrink-0"
          >
            <span
              className={`absolute top-0.5 left-0.5 h-4.5 w-4.5 rounded-full bg-primary transition-transform duration-200 ${yearly ? 'translate-x-5' : 'translate-x-0'}`}
              style={{ width: 18, height: 18, top: 2, left: 2, transform: yearly ? 'translateX(20px)' : 'translateX(0)' }}
            />
          </button>
          <span className={`text-sm font-medium transition-colors ${yearly ? 'text-foreground' : 'text-muted-foreground'}`}>
            รายปี
          </span>
          <Badge
            className={`text-xs transition-opacity ${yearly ? 'opacity-100 bg-primary/15 text-primary hover:bg-primary/15' : 'opacity-0 pointer-events-none bg-primary/15 text-primary hover:bg-primary/15'}`}
          >
            ฟรี 1 เดือน
          </Badge>
        </div>

        {/* Plans */}
        <div className="grid gap-6 md:grid-cols-2">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative border-border bg-card ${plan.popular ? 'ring-1 ring-primary/50' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">ยอดนิยม</Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
                <div className="pt-2">
                  <span className="text-3xl font-bold text-foreground">
                    ฿{yearly ? plan.yearlyPrice.toLocaleString() : plan.monthlyPrice.toLocaleString()}
                  </span>
                  <span className="text-muted-foreground">/เดือน</span>
                  {yearly && (
                    <p className="text-xs text-muted-foreground mt-1">
                      เรียกเก็บ ฿{(plan.yearlyPrice * 12).toLocaleString()}/ปี
                    </p>
                  )}
                  {!yearly && (
                    <p className="text-xs text-muted-foreground mt-1 invisible">placeholder</p>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2.5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                {plan.current ? (
                  <Button variant="outline" className="w-full" disabled>
                    แผนปัจจุบัน
                  </Button>
                ) : (
                  <Button className="w-full">
                    เริ่มต้นใช้งาน →
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
