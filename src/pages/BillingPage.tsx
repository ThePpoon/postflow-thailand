import { AppLayout } from '@/components/AppLayout';
import { ConfigTabs } from '@/components/ConfigTabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function BillingPage() {
  return (
    <AppLayout>
      <div className="max-w-3xl animate-fade-in space-y-6">
        <ConfigTabs />

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
            <div className="space-y-2">
              <CardTitle className="text-base">แผนปัจจุบัน</CardTitle>
              <p className="text-sm text-muted-foreground">
                ตอนนี้บัญชีของคุณอยู่ในแพ็กเกจเริ่มต้นสำหรับการใช้งาน Post2Flow
              </p>
            </div>
            <Badge variant="secondary" className="bg-primary/15 text-primary hover:bg-primary/15">
              Free
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl border border-border bg-secondary/40 p-4">
              <p className="text-2xl font-semibold text-foreground">฿0/เดือน</p>
              <p className="mt-2 text-sm text-muted-foreground">
                เชื่อมต่อได้ 3 บัญชี และสร้างโพสต์ได้ 30 ครั้งต่อเดือน
              </p>
            </div>
            <Button variant="outline" disabled>
              อัปเกรดเร็ว ๆ นี้
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-base">สิทธิ์การใช้งาน</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-secondary/30 px-4 py-3">
              <span>บัญชีโซเชียลที่เชื่อมต่อได้</span>
              <span className="font-medium text-foreground">3 บัญชี</span>
            </div>
            <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-secondary/30 px-4 py-3">
              <span>จำนวนโพสต์ต่อเดือน</span>
              <span className="font-medium text-foreground">30 โพสต์</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
