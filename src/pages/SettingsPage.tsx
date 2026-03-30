import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/components/AppLayout';
import { ConfigTabs } from '@/components/ConfigTabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
      <div className="max-w-3xl animate-fade-in space-y-6">
        <ConfigTabs />

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-base">โปรไฟล์</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>ชื่อแสดง</Label>
              <Input value={user?.email?.split('@')[0] || ''} disabled className="border-border bg-secondary" />
            </div>
            <div className="space-y-2">
              <Label>อีเมล</Label>
              <Input value={user?.email || ''} disabled className="border-border bg-secondary" />
            </div>
          </CardContent>
        </Card>

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
