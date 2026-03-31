import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/components/AppLayout';
import { ConfigTabs } from '@/components/ConfigTabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Camera, LogOut, Mail, Lock, Shield, Plug, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [displayName, setDisplayName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Change email
  const [newEmail, setNewEmail] = useState('');
  const [changingEmail, setChangingEmail] = useState(false);

  // Change password
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    if (!user) return;
    const loadProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('display_name, avatar_url')
        .eq('id', user.id)
        .single();
      if (data) {
        setDisplayName(data.display_name || '');
        setAvatarUrl(data.avatar_url || '');
      }
    };
    loadProfile();
  }, [user]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `${user.id}/avatar.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path);
      const url = `${publicUrl}?t=${Date.now()}`;

      await supabase.from('profiles').update({ avatar_url: url, updated_at: new Date().toISOString() }).eq('id', user.id);
      setAvatarUrl(url);
      toast.success('อัปโหลดรูปโปรไฟล์สำเร็จ');
    } catch (err: any) {
      toast.error(err.message || 'อัปโหลดไม่สำเร็จ');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ display_name: displayName, updated_at: new Date().toISOString() })
        .eq('id', user.id);
      if (error) throw error;
      toast.success('บันทึกโปรไฟล์สำเร็จ');
    } catch (err: any) {
      toast.error(err.message || 'บันทึกไม่สำเร็จ');
    } finally {
      setSaving(false);
    }
  };

  const handleChangeEmail = async () => {
    if (!newEmail) return;
    setChangingEmail(true);
    try {
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      if (error) throw error;
      toast.success('เราได้ส่งลิงก์ยืนยันไปที่อีเมลใหม่แล้ว');
      setNewEmail('');
    } catch (err: any) {
      toast.error(err.message || 'เปลี่ยนอีเมลไม่สำเร็จ');
    } finally {
      setChangingEmail(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('รหัสผ่านไม่ตรงกัน');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
      return;
    }
    setChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast.success('เปลี่ยนรหัสผ่านสำเร็จ');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      toast.error(err.message || 'เปลี่ยนรหัสผ่านไม่สำเร็จ');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleSendResetLink = async () => {
    if (!user?.email) return;
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('ส่งลิงก์รีเซ็ตรหัสผ่านไปที่อีเมลแล้ว');
    }
  };

  const handleSignOutAll = async () => {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบทุกอุปกรณ์?')) return;
    await supabase.auth.signOut({ scope: 'global' });
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบบัญชี? การกระทำนี้ไม่สามารถย้อนกลับได้')) return;
    await signOut();
    navigate('/');
  };

  const initials = (displayName || user?.email || '?').slice(0, 2).toUpperCase();

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto animate-fade-in space-y-6">
        <ConfigTabs />

        {/* Profile */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Camera className="h-4 w-4" /> โปรไฟล์
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <Avatar className="h-16 w-16">
                  <AvatarImage src={avatarUrl} />
                  <AvatarFallback className="text-lg bg-primary/20 text-primary">{initials}</AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="h-5 w-5 text-foreground" />
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
              </div>
              <div className="text-sm text-muted-foreground">
                {uploading ? 'กำลังอัปโหลด...' : 'คลิกที่รูปเพื่อเปลี่ยนรูปโปรไฟล์'}
              </div>
            </div>
            <div className="space-y-2">
              <Label>ชื่อที่แสดง</Label>
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="ชื่อที่แสดง"
                className="border-border bg-secondary"
              />
            </div>
            <div className="space-y-2">
              <Label>อีเมล</Label>
              <Input value={user?.email || ''} disabled className="border-border bg-secondary" />
            </div>
            <Button onClick={handleSaveProfile} disabled={saving} size="sm">
              {saving ? 'กำลังบันทึก...' : 'บันทึกโปรไฟล์'}
            </Button>
          </CardContent>
        </Card>

        {/* Email */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Mail className="h-4 w-4" /> เปลี่ยนอีเมล
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              อีเมลปัจจุบัน: <span className="text-foreground">{user?.email}</span>
            </p>
            <div className="space-y-2">
              <Label>อีเมลใหม่</Label>
              <Input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="email@example.com"
                className="border-border bg-secondary"
              />
            </div>
            <Button onClick={handleChangeEmail} disabled={changingEmail || !newEmail} size="sm">
              {changingEmail ? 'กำลังดำเนินการ...' : 'เปลี่ยนอีเมล'}
            </Button>
          </CardContent>
        </Card>

        {/* Password */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Lock className="h-4 w-4" /> เปลี่ยนรหัสผ่าน
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>รหัสผ่านใหม่</Label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="อย่างน้อย 6 ตัวอักษร"
                className="border-border bg-secondary"
              />
            </div>
            <div className="space-y-2">
              <Label>ยืนยันรหัสผ่านใหม่</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="กรอกรหัสผ่านอีกครั้ง"
                className="border-border bg-secondary"
              />
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={handleChangePassword} disabled={changingPassword || !newPassword} size="sm">
                {changingPassword ? 'กำลังเปลี่ยน...' : 'เปลี่ยนรหัสผ่าน'}
              </Button>
              <button
                onClick={handleSendResetLink}
                className="text-sm text-primary hover:underline"
              >
                ลืมรหัสผ่าน? ส่งลิงก์รีเซ็ต
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Connected Accounts - visible on mobile */}
        <Card className="border-border bg-card md:hidden">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Plug className="h-4 w-4" /> การเชื่อมต่อแพลตฟอร์ม
            </CardTitle>
          </CardHeader>
          <CardContent>
            <button
              onClick={() => navigate('/accounts')}
              className="flex w-full items-center justify-between rounded-lg border border-border bg-secondary/30 px-4 py-3 transition-colors hover:bg-secondary/50"
            >
              <div>
                <p className="text-sm font-medium text-foreground text-left">จัดการบัญชีที่เชื่อมต่อ</p>
                <p className="text-xs text-muted-foreground text-left">Facebook, Instagram และอื่นๆ</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4" /> ความปลอดภัย
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-foreground">ออกจากระบบทุกอุปกรณ์</p>
                <p className="text-xs text-muted-foreground">ออกจากระบบในทุกอุปกรณ์ที่เข้าสู่ระบบไว้</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleSignOutAll}>
                <LogOut className="h-4 w-4 mr-1" /> ออกจากระบบทั้งหมด
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
            <Button variant="destructive" onClick={handleDeleteAccount}>
              ลบบัญชี
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
