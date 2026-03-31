import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MoreVertical, Facebook, Instagram, Twitter, PlusCircle, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

const platformIcons: Record<string, any> = {
  facebook: Facebook,
  facebook_page: Facebook,
  instagram: Instagram,
  x: Twitter,
  tiktok: () => <span className="text-[10px] font-bold">TT</span>,
};

export default function DraftsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
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
      .eq('status', 'draft')
      .order('created_at', { ascending: sortBy === 'oldest' });
    setPosts(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, [user, sortBy]);

  const handleDelete = async (id: string) => {
    await supabase.from('posts').delete().eq('id', id);
    fetchPosts();
    toast({ title: 'ลบแบบร่างแล้ว' });
  };

  const handleDeleteAll = async () => {
    if (!user) return;
    await supabase.from('posts').delete().eq('user_id', user.id).eq('status', 'draft');
    fetchPosts();
    toast({ title: 'ลบแบบร่างทั้งหมดแล้ว' });
  };

  if (!loading && posts.length === 0) {
    return (
      <AppLayout>
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center animate-fade-in">
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">ไม่มีแบบร่างโพสต์</h2>
          <p className="mt-2 text-muted-foreground max-w-md">
            แบบร่างจะปรากฏที่นี่เมื่อคุณสร้างโพสต์ที่ตั้งเวลาแต่ไม่ได้ระบุเวลา หรือเมื่อคุณทำซ้ำโพสต์
          </p>
          <Link to="/posts/new" className="mt-6">
            <Button className="gap-2">
              <PlusCircle className="h-4 w-4" /> สร้างโพสต์
            </Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="animate-fade-in space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold text-foreground">แบบร่าง</h1>
          <div className="flex flex-wrap items-center gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32 bg-secondary border-border text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">แก้ไขล่าสุด</SelectItem>
                <SelectItem value="oldest">เก่าสุดก่อน</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/10" onClick={handleDeleteAll}>
              <Trash2 className="h-3.5 w-3.5" /> ลบทั้งหมด
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
                          แก้ไขล่าสุด:{' '}
                          {new Date(post.created_at).toLocaleString('th-TH', {
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
                            return <Icon key={i} className="h-4 w-4 text-muted-foreground" />;
                          })}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                        แบบร่าง
                      </span>
                      <Link to="/posts/new">
                        <Button size="sm" className="text-xs">แก้ไข</Button>
                      </Link>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>ทำซ้ำ</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(post.id)}>
                            ลบ
                          </DropdownMenuItem>
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
