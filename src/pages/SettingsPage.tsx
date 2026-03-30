import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบบัญชี? การกระทำนี้ไม่สามารถย้อนกลับได้')) return;
    setDeleting(true);
    await signOut();
    navigate('/');
  };

  return (
    <AppLayout>
      <div className="animate-fade-in space-y-6 max-w-2xl">
        <h1 className="text-2xl font-bold text-foreground">ตั้งค่า</h1>

        {/* Profile */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-base">โปรไฟล์</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>ชื่อแสดง</Label>
              <Input value={user?.email?.split('@')[0] || ''} disabled className="bg-secondary border-border" />
            </div>
            <div className="space-y-2">
              <Label>อีเมล</Label>
              <Input value={user?.email || ''} disabled className="bg-secondary border-border" />
            </div>
          </CardContent>
        </Card>

        {/* Subscription */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-base">แผนการสมัครสมาชิก</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">แผน Free</p>
                <p className="text-sm text-muted-foreground">เชื่อมต่อได้ 3 บัญชี, โพสต์ได้ 30 ครั้ง/เดือน</p>
              </div>
              <Button variant="outline" disabled>
                อัพเกรดเป็น Pro
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/50 bg-card">
          <CardHeader>
            <CardTitle className="text-base text-destructive">โซนอันตราย</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              การลบบัญชีจะลบข้อมูลทั้งหมดของคุณอย่างถาวร
            </p>
            <Button variant="destructive" onClick={handleDeleteAccount} disabled={deleting}>
              {deleting ? 'กำลังลบ...' : 'ลบบัญชี'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
