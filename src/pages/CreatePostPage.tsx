import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Facebook, Instagram, Twitter, CalendarIcon, Upload, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

const platformIcons: Record<string, any> = {
  facebook: Facebook,
  facebook_page: Facebook,
  instagram: Instagram,
  x: Twitter,
  tiktok: () => <span className="text-xs font-bold">TT</span>,
};

interface ConnectedAccount {
  id: string;
  platform: string;
  username: string;
}

export default function CreatePostPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>();
  const [scheduledTime, setScheduledTime] = useState('');
  const [showScheduler, setShowScheduler] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('connected_accounts')
      .select('id, platform, username')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .then(({ data }) => setAccounts((data as ConnectedAccount[]) || []));
  }, [user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (postNow: boolean) => {
    if (!content.trim()) return;
    if (selectedAccounts.length === 0) return;
    setSubmitting(true);

    let imageUrl: string | null = null;

    if (imageFile) {
      const ext = imageFile.name.split('.').pop();
      const path = `${user!.id}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('post-images')
        .upload(path, imageFile);
      if (!uploadError) {
        const { data: urlData } = supabase.storage.from('post-images').getPublicUrl(path);
        imageUrl = urlData.publicUrl;
      }
    }

    let scheduledAt: string | null = null;
    if (!postNow && scheduledDate) {
      const d = new Date(scheduledDate);
      if (scheduledTime) {
        const [h, m] = scheduledTime.split(':');
        d.setHours(parseInt(h), parseInt(m));
      }
      scheduledAt = d.toISOString();
    }

    const { error } = await supabase.from('posts').insert({
      user_id: user!.id,
      content,
      image_url: imageUrl,
      platforms: selectedAccounts,
      scheduled_at: scheduledAt,
      status: postNow ? 'published' : 'scheduled',
    });

    setSubmitting(false);
    if (!error) {
      navigate('/posts');
    }
  };

  const toggleAccount = (id: string) => {
    setSelectedAccounts((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  return (
    <AppLayout>
      <div className="animate-fade-in space-y-6">
        <h1 className="text-2xl font-bold text-foreground">สร้างโพสต์ใหม่</h1>

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Editor */}
          <div className="space-y-4 lg:col-span-3">
            <Card className="border-border bg-card">
              <CardContent className="p-5 space-y-4">
                <div className="space-y-2">
                  <Label>ข้อความโพสต์</Label>
                  <Textarea
                    placeholder="เขียนข้อความโพสต์ของคุณ..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[150px] resize-none bg-secondary border-border"
                    maxLength={2200}
                  />
                  <p className="text-right text-xs text-muted-foreground">{content.length}/2200</p>
                </div>

                <div className="space-y-2">
                  <Label>รูปภาพ (ไม่บังคับ)</Label>
                  {imagePreview ? (
                    <div className="relative">
                      <img src={imagePreview} alt="preview" className="max-h-48 rounded-lg object-cover" />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => { setImageFile(null); setImagePreview(null); }}
                      >
                        ลบ
                      </Button>
                    </div>
                  ) : (
                    <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-border p-8 transition-colors hover:border-primary/50">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">คลิกหรือลากรูปภาพมาวาง</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    </label>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>เลือกแพลตฟอร์ม</Label>
                  {accounts.length === 0 ? (
                    <p className="text-sm text-muted-foreground">ยังไม่มีบัญชีที่เชื่อมต่อ</p>
                  ) : (
                    <div className="space-y-2">
                      {accounts.map((acc) => {
                        const Icon = platformIcons[acc.platform] || Facebook;
                        return (
                          <label
                            key={acc.id}
                            className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-accent"
                          >
                            <Checkbox
                              checked={selectedAccounts.includes(acc.id)}
                              onCheckedChange={() => toggleAccount(acc.id)}
                            />
                            <Icon className="h-4 w-4" />
                            <span className="text-sm text-foreground">@{acc.username}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                className="flex-1"
                onClick={() => handleSubmit(true)}
                disabled={submitting || !content.trim() || selectedAccounts.length === 0}
              >
                {submitting ? 'กำลังโพสต์...' : 'โพสต์เดี๋ยวนี้'}
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowScheduler(!showScheduler)}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                ตั้งเวลาโพสต์
              </Button>
            </div>

            {showScheduler && (
              <Card className="border-border bg-card">
                <CardContent className="p-5 space-y-4">
                  <Label>เลือกวันและเวลา</Label>
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn('w-full justify-start text-left', !scheduledDate && 'text-muted-foreground')}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {scheduledDate ? format(scheduledDate, 'PPP', { locale: th }) : 'เลือกวันที่'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={scheduledDate}
                          onSelect={setScheduledDate}
                          disabled={(date) => date < new Date()}
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <Input
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="w-full bg-secondary border-border sm:w-40"
                    />
                  </div>
                  <Button
                    onClick={() => handleSubmit(false)}
                    disabled={submitting || !content.trim() || selectedAccounts.length === 0 || !scheduledDate}
                    className="w-full"
                  >
                    {submitting ? 'กำลังตั้งเวลา...' : 'ยืนยันตั้งเวลาโพสต์'}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Preview */}
          <div className="lg:col-span-2">
            <Card className="sticky top-20 border-border bg-card">
              <CardContent className="p-5">
                <h3 className="mb-4 text-sm font-medium text-muted-foreground">ตัวอย่างโพสต์</h3>
                <div className="rounded-lg border border-border bg-secondary p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/20" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{user?.email?.split('@')[0]}</p>
                      <p className="text-xs text-muted-foreground">เมื่อสักครู่</p>
                    </div>
                  </div>
                  {content ? (
                    <p className="whitespace-pre-wrap text-sm text-foreground">{content}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">ข้อความโพสต์จะแสดงที่นี่...</p>
                  )}
                  {imagePreview && (
                    <img src={imagePreview} alt="preview" className="mt-3 rounded-lg" />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
