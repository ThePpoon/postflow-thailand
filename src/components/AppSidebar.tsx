import {
  Home,
  Link2,
  PlusCircle,
  FileText,
  Paintbrush,
  Layers,
  CalendarDays,
  List,
  Clock,
  CheckCircle2,
  FileEdit,
  BarChart3,
  Lock,
  Plug,
  Users,
  Settings,
  Key,
  CreditCard,
  LogOut,
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import logo from '@/assets/logo.png';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';

const createSubItems = [
  { title: 'โพสต์ใหม่', url: '/posts/new', icon: FileText },
  { title: 'สตูดิโอ', url: '#', icon: Paintbrush, locked: true },
  { title: 'เครื่องมือแบบกลุ่ม', url: '#', icon: Layers, locked: true },
];

const postItems = [
  { title: 'ปฏิทิน', url: '/posts/calendar', icon: CalendarDays },
  { title: 'ทั้งหมด', url: '/posts', icon: List },
  { title: 'ตั้งเวลา', url: '/posts/scheduled', icon: Clock },
  { title: 'โพสต์แล้ว', url: '/posts/posted', icon: CheckCircle2 },
  { title: 'แบบร่าง', url: '/posts/drafts', icon: FileEdit },
  { title: 'วิเคราะห์', url: '#', icon: BarChart3, locked: true },
];

const workspaceItems = [
  { title: 'การเชื่อมต่อ', url: '/accounts', icon: Plug },
  { title: 'ทีม', url: '#', icon: Users, locked: true },
];

const configItems = [
  { title: 'ตั้งค่า', url: '/settings', icon: Settings },
  { title: 'การเรียกเก็บเงิน', url: '/billing', icon: CreditCard },
];

export function AppSidebar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const renderItems = (items: typeof createSubItems) =>
    items.map((item) => (
      <SidebarMenuItem key={item.title}>
        <SidebarMenuButton asChild>
          <NavLink
            to={item.url}
            end={item.url === '/posts'}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            activeClassName="bg-sidebar-accent text-sidebar-accent-foreground"
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {!collapsed && <span className="text-sm">{item.title}</span>}
            {!collapsed && 'locked' in item && (item as any).locked && (
              <Lock className="ml-auto h-3.5 w-3.5 text-muted-foreground" />
            )}
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    ));

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        {/* Logo */}
        <div className="flex items-center gap-2 px-4 py-5">
          <img src={logo} alt="Post2Flow" className="h-8 w-8 rounded-lg" />
          {!collapsed && (
            <span className="text-lg font-bold text-foreground">Post2Flow</span>
          )}
        </div>

        {/* Dashboard */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/dashboard"
                    end
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    activeClassName="bg-sidebar-accent text-sidebar-accent-foreground"
                  >
                    <Home className="h-4 w-4 shrink-0" />
                    {!collapsed && <span className="text-sm">แดชบอร์ด</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Create */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {!collapsed && (
                <div className="px-3 mb-2">
                  <button
                    onClick={() => navigate('/posts/new')}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    <PlusCircle className="h-4 w-4" />
                    สร้างโพสต์
                  </button>
                </div>
              )}
              {collapsed && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to="/posts/new"
                      className="flex items-center justify-center text-primary"
                      activeClassName=""
                    >
                      <PlusCircle className="h-5 w-5" />
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              {renderItems(createSubItems)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Posts */}
        <SidebarGroup>
          {!collapsed && (
            <div className="px-4 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/60">
              โพสต์
            </div>
          )}
          <SidebarGroupContent>
            <SidebarMenu>{renderItems(postItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Workspace */}
        <SidebarGroup>
          {!collapsed && (
            <div className="px-4 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/60">
              พื้นที่ทำงาน
            </div>
          )}
          <SidebarGroupContent>
            <SidebarMenu>{renderItems(workspaceItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Config */}
        <SidebarGroup>
          {!collapsed && (
            <div className="px-4 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/60">
              การตั้งค่า
            </div>
          )}
          <SidebarGroupContent>
            <SidebarMenu>{renderItems(configItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-primary text-sm font-semibold shrink-0">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
          {!collapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium text-foreground">
                {user?.email?.split('@')[0]}
              </p>
              <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
            </div>
          )}
          {!collapsed && (
            <button onClick={handleLogout} className="text-muted-foreground transition-colors hover:text-foreground">
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
