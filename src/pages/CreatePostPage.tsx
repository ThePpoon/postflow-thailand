import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Image as ImageIcon, Video } from 'lucide-react';

const postTypes = [
  {
    type: 'text',
    label: 'โพสต์ข้อความ',
    labelEn: 'Text Post',
    description: 'สร้างโพสต์ข้อความอย่างเดียว',
    icon: FileText,
    url: '/posts/new/text',
  },
  {
    type: 'image',
    label: 'โพสต์รูปภาพ',
    labelEn: 'Image Post',
    description: 'สร้างโพสต์พร้อมรูปภาพ',
    icon: ImageIcon,
    url: '/posts/new/image',
  },
  {
    type: 'video',
    label: 'โพสต์วิดีโอ',
    labelEn: 'Video Post',
    description: 'สร้างโพสต์พร้อมวิดีโอ',
    icon: Video,
    url: '/posts/new/video',
  },
];

export default function CreatePostPage() {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="animate-fade-in space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/80">Create</p>
          <h1 className="text-2xl font-bold text-foreground">สร้างโพสต์ใหม่</h1>
          <p className="mt-1 text-sm text-muted-foreground">เลือกประเภทโพสต์ที่ต้องการสร้าง</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {postTypes.map((pt) => (
            <Card
              key={pt.type}
              className="group cursor-pointer border-border bg-card transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
              onClick={() => navigate(pt.url)}
            >
              <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                  <pt.icon className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-foreground">{pt.label}</p>
                  <p className="text-xs text-muted-foreground">{pt.labelEn}</p>
                </div>
                <p className="text-sm text-muted-foreground">{pt.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
