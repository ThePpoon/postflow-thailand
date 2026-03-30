import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link2, FileText, Clock, PlusCircle } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [accountsCount, setAccountsCount] = useState(0);
  const [postsThisMonth, setPostsThisMonth] = useState(0);
  const [scheduledCount, setScheduledCount] = useState(0);
  const [recentPosts, setRecentPosts] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      // Connected accounts
      const { count: ac } = await supabase
        .from('connected_accounts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_active', true);
      setAccountsCount(ac || 0);

      // Posts this month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      const { count: pc } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', startOfMonth.toISOString());
      setPostsThisMonth(pc || 0);

      // Scheduled posts
      const { count: sc } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'scheduled');
      setScheduledCount(sc || 0);

      // Recent posts
      const { data: rp } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      setRecentPosts(rp || []);
    };

    fetchStats();
  }, [user]);

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      draft: 'bg-muted text-muted-foreground',
      scheduled: 'bg-info/20 text-info',
      published: 'bg-primary/20 text-primary',
      failed: 'bg-destructive/20 text-destructive',
    };
    const labels: Record<string, string> = {
      draft: 'แบบร่าง',
      scheduled: 'ตั้งเวลาแล้ว',
      published: 'เผยแพร่แล้ว',
      failed: 'ล้มเหลว',
    };
    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${map[status] || ''}`}>
        {labels[status] || status}
      </span>
    );
  };

  const stats = [
    { label: 'บัญชีที่เชื่อมต่อ', value: accountsCount, icon: Link2 },
    { label: 'โพสต์เดือนนี้', value: postsThisMonth, icon: FileText },
    { label: 'โพสต์ที่ตั้งเวลา', value: scheduledCount, icon: Clock },
  ];

  return (
    <AppLayout>
      <div className="animate-fade-in space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              สวัสดี, {user?.email?.split('@')[0]} 👋
            </h1>
            <p className="text-sm text-muted-foreground">ภาพรวมการจัดการโซเชียลมีเดียของคุณ</p>
          </div>
          <Link to="/posts/new">
            <Button className="gap-2">
              <PlusCircle className="h-4 w-4" /> สร้างโพสต์ใหม่
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((s) => (
            <Card key={s.label} className="border-border bg-card">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
                  <s.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{s.value}</p>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Posts */}
        <Card className="border-border bg-card">
          <CardContent className="p-5">
            <h2 className="mb-4 text-lg font-semibold text-foreground">โพสต์ล่าสุด</h2>
            {recentPosts.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                ยังไม่มีโพสต์ — <Link to="/posts/new" className="text-primary hover:underline">สร้างโพสต์แรกของคุณ</Link>
              </p>
            ) : (
              <div className="space-y-3">
                {recentPosts.map((post) => (
                  <div
                    key={post.id}
                    className="flex items-center justify-between rounded-lg border border-border p-3"
                  >
                    <div className="flex-1 overflow-hidden">
                      <p className="truncate text-sm text-foreground">{post.content}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(post.created_at).toLocaleDateString('th-TH')}
                      </p>
                    </div>
                    {statusBadge(post.status)}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
