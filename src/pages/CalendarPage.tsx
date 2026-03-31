import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DAYS = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];

export default function CalendarPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [posts, setPosts] = useState<any[]>([]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleDateString('th-TH', { month: 'long', year: 'numeric' });

  useEffect(() => {
    if (!user) return;
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0, 23, 59, 59);
    supabase
      .from('posts')
      .select('*')
      .eq('user_id', user.id)
      .gte('scheduled_at', start.toISOString())
      .lte('scheduled_at', end.toISOString())
      .then(({ data }) => setPosts(data || []));
  }, [user, year, month]);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const getPostsForDay = (day: number) =>
    posts.filter((p) => {
      if (!p.scheduled_at) return false;
      const d = new Date(p.scheduled_at);
      return d.getDate() === day && d.getMonth() === month;
    });

  const prev = () => setCurrentDate(new Date(year, month - 1, 1));
  const next = () => setCurrentDate(new Date(year, month + 1, 1));

  return (
    <AppLayout>
      <div className="animate-fade-in space-y-4">
        {/* Header */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">ปฏิทิน</h1>
            <Info className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={prev}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="min-w-[140px] text-center font-semibold text-foreground">
                {monthName}
              </span>
              <Button variant="ghost" size="icon" onClick={next}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex rounded-lg border border-border overflow-hidden">
              <button
                onClick={() => setViewMode('month')}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  viewMode === 'month'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground hover:text-foreground'
                }`}
              >
                เดือน
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  viewMode === 'week'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground hover:text-foreground'
                }`}
              >
                สัปดาห์
              </button>
            </div>
          </div>
        </div>

        {/* Calendar grid */}
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="grid grid-cols-7">
            {DAYS.map((d) => (
              <div key={d} className="border-b border-r border-border px-2 py-2 text-center text-xs font-semibold text-muted-foreground">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {cells.map((day, i) => {
              const dayPosts = day ? getPostsForDay(day) : [];
              const hasPosts = dayPosts.length > 0;
              const isToday =
                day === new Date().getDate() &&
                month === new Date().getMonth() &&
                year === new Date().getFullYear();

              return (
                <div
                  key={i}
                  onClick={() => day && navigate('/posts/new')}
                  className={`min-h-[90px] border-b border-r border-border p-2 cursor-pointer transition-colors hover:bg-primary/5 ${
                    hasPosts ? 'bg-primary/5' : ''
                  } ${!day ? 'bg-secondary/30' : ''}`}
                >
                  {day && (
                    <>
                      <span
                        className={`text-xs font-medium ${
                          isToday
                            ? 'inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground'
                            : hasPosts
                            ? 'text-primary'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {day}
                      </span>
                      {dayPosts.length > 0 ? (
                        <div className="mt-1 space-y-1">
                          {dayPosts.slice(0, 2).map((p) => (
                            <div key={p.id} className="truncate rounded bg-primary/10 px-1.5 py-0.5 text-[10px] text-primary">
                              {new Date(p.scheduled_at).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          ))}
                          {dayPosts.length > 2 && (
                            <div className="text-[10px] text-muted-foreground">+{dayPosts.length - 2} เพิ่มเติม</div>
                          )}
                        </div>
                      ) : (
                        <p className="mt-2 text-[10px] text-muted-foreground/50">ไม่มีโพสต์</p>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
