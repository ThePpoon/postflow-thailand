import { Home, PlusCircle, CalendarDays, List, Plug } from 'lucide-react';
import { NavLink } from '@/components/NavLink';

const navItems = [
  { title: 'แดชบอร์ด', url: '/dashboard', icon: Home },
  { title: 'ปฏิทิน', url: '/posts/calendar', icon: CalendarDays },
  { title: 'สร้าง', url: '/posts/new', icon: PlusCircle },
  { title: 'โพสต์', url: '/posts', icon: List },
  { title: 'เชื่อมต่อ', url: '/accounts', icon: Plug },
];

export function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card md:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => (
          <NavLink
            key={item.url}
            to={item.url}
            end={item.url === '/dashboard' || item.url === '/posts'}
            className="flex flex-col items-center gap-1 px-2 py-1 text-muted-foreground transition-colors"
            activeClassName="text-primary"
          >
            <item.icon className={`h-5 w-5 ${item.url === '/posts/new' ? 'text-primary' : ''}`} />
            <span className="text-[10px]">{item.title}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
