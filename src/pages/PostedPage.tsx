import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCw, MoreVertical, Facebook, Instagram, Twitter, Info, CheckCircle2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const platformIcons: Record<string, any> = {
  facebook: Facebook,
  facebook_page: Facebook,
  instagram: Instagram,
  x: Twitter,
  tiktok: () => <span className="text-[10px] font-bold">TT</span>,
};

export default function PostedPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');

  const fetchPosts = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'published')
      .order('published_at', { ascending: sortBy === 'oldest' });
    setPosts(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, [user, sortBy]);

  if (!loading && posts.length === 0) {
    return (
      <AppLayout>
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center animate-fade-in">
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">ยังไม่มีโพสต์ที่เผยแพร่</h2>
          <p className="mt-2 text-muted-foreground">โพสต์ของคุณจะปรากฏที่นี่หลังจากเผยแพร่สำเร็จ</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="animate-fade-in space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">โพสต์สำเร็จแล้ว</h1>
            <Info className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32 bg-secondary border-border text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">ใหม่สุดก่อน</SelectItem>
                <SelectItem value="oldest">เก่าสุดก่อน</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={fetchPosts}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <Card key={post.id} className="border-border bg-card">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span>
                          {post.published_at
                            ? new Date(post.published_at).toLocaleString('th-TH', {
                                day: 'numeric',
                                month: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : new Date(post.created_at).toLocaleString('th-TH', {
                                day: 'numeric',
                                month: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                        </span>
                        {post.image_url && (
                          <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px]">รูปภาพ</span>
                        )}
                      </div>
                      <p className="mt-1.5 text-sm text-foreground line-clamp-2">{post.content}</p>
                      {post.platforms && (
                        <div className="mt-2 flex gap-1.5">
                          {(post.platforms as string[]).map((p, i) => {
                            const Icon = platformIcons[p] || Facebook;
                            return (
                              <div key={i} className="relative">
                                <Icon className="h-4 w-4 text-muted-foreground" />
                                <CheckCircle2 className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 text-primary" />
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="rounded-full bg-primary/20 px-2.5 py-0.5 text-[10px] font-medium text-primary">
                        โพสต์แล้ว
                      </span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>ดูโพสต์</DropdownMenuItem>
                          <DropdownMenuItem>วิเคราะห์</DropdownMenuItem>
                          <DropdownMenuItem>ทำซ้ำ</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">ลบ</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
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
