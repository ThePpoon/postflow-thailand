import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const platformIcons: Record<string, any> = {
  facebook: Facebook,
  facebook_page: Facebook,
  instagram: Instagram,
  x: Twitter,
  tiktok: () => <span className="text-xs font-bold">TT</span>,
};

const statusLabels: Record<string, string> = {
  draft: 'แบบร่าง',
  scheduled: 'ตั้งเวลาแล้ว',
  published: 'เผยแพร่แล้ว',
  failed: 'ล้มเหลว',
};

const statusStyles: Record<string, string> = {
  draft: 'bg-muted text-muted-foreground',
  scheduled: 'bg-info/20 text-info',
  published: 'bg-primary/20 text-primary',
  failed: 'bg-destructive/20 text-destructive',
};

export default function PostsPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchPosts = async () => {
      let query = supabase
        .from('posts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data } = await query;
      setPosts(data || []);
      setLoading(false);
    };
    fetchPosts();
  }, [user, filter]);

  return (
    <AppLayout>
      <div className="animate-fade-in space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">โพสต์ทั้งหมด</h1>
            <p className="text-sm text-muted-foreground">ดูประวัติโพสต์ทั้งหมดของคุณ</p>
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40 bg-secondary border-border">
              <SelectValue placeholder="กรองสถานะ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ทั้งหมด</SelectItem>
              <SelectItem value="draft">แบบร่าง</SelectItem>
              <SelectItem value="scheduled">ตั้งเวลาแล้ว</SelectItem>
              <SelectItem value="published">เผยแพร่แล้ว</SelectItem>
              <SelectItem value="failed">ล้มเหลว</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : posts.length === 0 ? (
          <Card className="border-border bg-card">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">ยังไม่มีโพสต์</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <Card key={post.id} className="border-border bg-card transition-colors hover:border-primary/20">
                <CardContent className="p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1 overflow-hidden">
                      <p className="truncate text-sm text-foreground">{post.content}</p>
                      <div className="mt-1 flex items-center gap-3">
                        <span className="text-xs text-muted-foreground">
                          {new Date(post.created_at).toLocaleDateString('th-TH', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        {post.platforms && (
                          <div className="flex gap-1">
                            {(post.platforms as string[]).slice(0, 3).map((p, i) => {
                              const Icon = platformIcons[p] || Facebook;
                              return <Icon key={i} className="h-3.5 w-3.5 text-muted-foreground" />;
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[post.status] || ''}`}>
                      {statusLabels[post.status] || post.status}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
