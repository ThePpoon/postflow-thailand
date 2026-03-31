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
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Facebook, Instagram, Twitter, CalendarIcon, Upload, Video, ArrowLeft } from 'lucide-react';
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

type PostType = 'text' | 'image' | 'video';

interface PostEditorLayoutProps {
  postType: PostType;
}

export default function PostEditorLayout({ postType }: PostEditorLayoutProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [platformCaptions, setPlatformCaptions] = useState<Record<string, string>>({});
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>();
  const [scheduledTime, setScheduledTime] = useState('');
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
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setImageFiles((prev) => [...prev, ...files]);
    setImagePreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleAccount = (id: string) => {
    setSelectedAccounts((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (postNow: boolean) => {
    if (!content.trim() || selectedAccounts.length === 0) return;
    setSubmitting(true);

    let imageUrl: string | null = null;
    if (imageFiles.length > 0) {
      const file = imageFiles[0];
      const ext = file.name.split('.').pop();
      const path = `${user!.id}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from('post-images').upload(path, file);
      if (!uploadError) {
        const { data: urlData } = supabase.storage.from('post-images').getPublicUrl(path);
        imageUrl = urlData.publicUrl;
      }
    }

    if (videoFile) {
      const ext = videoFile.name.split('.').pop();
      const path = `${user!.id}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from('post-images').upload(path, videoFile);
      if (!uploadError) {
        const { data: urlData } = supabase.storage.from('post-images').getPublicUrl(path);
        imageUrl = urlData.publicUrl;
      }
    }

    let scheduledAt: string | null = null;
    if (!postNow && scheduleEnabled && scheduledDate) {
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
      status: postNow ? 'published' : scheduledAt ? 'scheduled' : 'draft',
    });

    setSubmitting(false);
    if (!error) navigate('/posts');
  };

  const selectedAccountObjects = accounts.filter((a) => selectedAccounts.includes(a.id));

  const typeLabels: Record<PostType, string> = {
    text: 'โพสต์ข้อความ',
    image: 'โพสต์รูปภาพ',
    video: 'โพสต์วิดีโอ',
  };

  return (
    <AppLayout>
      <div className="animate-fade-in space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/posts/new')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/80">Create</p>
            <h1 className="text-2xl font-bold text-foreground">{typeLabels[postType]}</h1>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Editor */}
          <div className="space-y-4 lg:col-span-2">
            {/* Account Selector */}
            <Card className="border-border bg-card">
              <CardContent className="p-4">
                <Label className="mb-3 block">เลือกบัญชี</Label>
                {accounts.length === 0 ? (
                  <p className="text-sm text-muted-foreground">ยังไม่มีบัญชีที่เชื่อมต่อ</p>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {accounts.map((acc) => {
                      const Icon = platformIcons[acc.platform] || Facebook;
                      const selected = selectedAccounts.includes(acc.id);
                      return (
                        <button
                          key={acc.id}
                          onClick={() => toggleAccount(acc.id)}
                          className={cn(
                            'flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all',
                            selected
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-border text-muted-foreground hover:border-primary/50'
                          )}
                        >
                          <Icon className="h-4 w-4" />
                          <span>@{acc.username}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Upload Area (Image/Video) */}
            {postType === 'image' && (
              <Card className="border-border bg-card">
                <CardContent className="p-4 space-y-3">
                  <Label>อัปโหลดรูปภาพ</Label>
                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      {imagePreviews.map((src, i) => (
                        <div key={i} className="group relative">
                          <img src={src} alt="" className="h-24 w-full rounded-lg object-cover" />
                          <button
                            onClick={() => removeImage(i)}
                            className="absolute right-1 top-1 rounded-full bg-destructive p-1 text-xs text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-border p-6 transition-colors hover:border-primary/50">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {imagePreviews.length > 0 ? 'เพิ่มรูปภาพอีก' : 'คลิกหรือลากรูปภาพมาวาง'}
                    </span>
                    <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange} />
                  </label>
                </CardContent>
              </Card>
            )}

            {postType === 'video' && (
              <Card className="border-border bg-card">
                <CardContent className="p-4 space-y-3">
                  <Label>อัปโหลดวิดีโอ</Label>
                  {videoPreview ? (
                    <div className="relative">
                      <video src={videoPreview} controls className="max-h-48 w-full rounded-lg" />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute right-2 top-2"
                        onClick={() => { setVideoFile(null); setVideoPreview(null); }}
                      >
                        ลบ
                      </Button>
                    </div>
                  ) : (
                    <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-border p-6 transition-colors hover:border-primary/50">
                      <Video className="h-8 w-8 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">คลิกหรือลากวิดีโอมาวาง</span>
                      <input type="file" accept="video/*" className="hidden" onChange={handleVideoChange} />
                    </label>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Main Caption */}
            <Card className="border-border bg-card">
              <CardContent className="p-4 space-y-3">
                <Label>Main Caption</Label>
                <Textarea
                  placeholder="เขียนข้อความโพสต์ของคุณ..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[120px] resize-none bg-secondary border-border"
                  maxLength={2200}
                />
                <p className="text-right text-xs text-muted-foreground">{content.length}/2200</p>
              </CardContent>
            </Card>

            {/* Platform Captions */}
            {selectedAccountObjects.length > 0 && (
              <Card className="border-border bg-card">
                <CardContent className="p-4 space-y-4">
                  <Label>Platform Captions</Label>
                  <p className="text-xs text-muted-foreground">ปรับข้อความสำหรับแต่ละแพลตฟอร์ม (ไม่บังคับ)</p>
                  {selectedAccountObjects.map((acc) => {
                    const Icon = platformIcons[acc.platform] || Facebook;
                    return (
                      <div key={acc.id} className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Icon className="h-4 w-4" />
                          <span>@{acc.username}</span>
                        </div>
                        <Textarea
                          placeholder={`ข้อความสำหรับ ${acc.platform}...`}
                          value={platformCaptions[acc.id] || ''}
                          onChange={(e) =>
                            setPlatformCaptions((prev) => ({ ...prev, [acc.id]: e.target.value }))
                          }
                          className="min-h-[60px] resize-none bg-secondary border-border"
                        />
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            {/* Media Preview */}
            {(imagePreviews.length > 0 || videoPreview) && (
              <Card className="border-border bg-card">
                <CardContent className="p-4">
                  <h3 className="mb-3 text-sm font-medium text-muted-foreground">Media Preview</h3>
                  {imagePreviews.length > 0 && (
                    <div className="space-y-2">
                      {imagePreviews.map((src, i) => (
                        <img key={i} src={src} alt="" className="w-full rounded-lg object-cover" />
                      ))}
                    </div>
                  )}
                  {videoPreview && (
                    <video src={videoPreview} controls className="w-full rounded-lg" />
                  )}
                </CardContent>
              </Card>
            )}

            {/* Schedule */}
            <Card className="border-border bg-card">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <Label>ตั้งเวลาโพสต์</Label>
                  <Switch checked={scheduleEnabled} onCheckedChange={setScheduleEnabled} />
                </div>

                {scheduleEnabled && (
                  <div className="space-y-3">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn('w-full justify-start text-left', !scheduledDate && 'text-muted-foreground')}
                        >
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
                      className="bg-secondary border-border"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                className="w-full"
                onClick={() => handleSubmit(true)}
                disabled={submitting || !content.trim() || selectedAccounts.length === 0}
              >
                {submitting ? 'กำลังโพสต์...' : 'โพสต์เดี๋ยวนี้'}
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleSubmit(false)}
                disabled={submitting || !content.trim() || selectedAccounts.length === 0}
              >
                บันทึกแบบร่าง
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
