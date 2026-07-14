'use client';

import { useState, createContext, useContext, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, ClipboardCheck, AlertTriangle, Building2,
  BarChart3, Bell, Settings, Users, ChevronLeft, ChevronRight,
  Shield, LogOut, Moon, Sun, Search, Plus, Menu, X,
  TrendingUp, Calendar, Award, Zap, ChevronDown
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import type { Profile } from '@/types';

interface SidebarContextType {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}
const SidebarContext = createContext<SidebarContextType>({ collapsed: false, setCollapsed: () => {} });
export const useSidebar = () => useContext(SidebarContext);

const navItems = [
  {
    group: 'Overview',
    items: [
      { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', badge: null },
    ],
  },
  {
    group: 'Audit Management',
    items: [
      { href: '/audits', icon: ClipboardCheck, label: 'Audits', badge: null },
      { href: '/capa', icon: AlertTriangle, label: 'CAPA', badge: 'New' },
      { href: '/schedule', icon: Calendar, label: 'Schedule', badge: null },
    ],
  },
  {
    group: 'Organization',
    items: [
      { href: '/departments', icon: Building2, label: 'Departments', badge: null },
      { href: '/users', icon: Users, label: 'Users', badge: null },
    ],
  },
  {
    group: 'Analytics',
    items: [
      { href: '/reports', icon: BarChart3, label: 'Reports', badge: null },
      { href: '/leaderboard', icon: Award, label: 'Leaderboard', badge: null },
    ],
  },
  {
    group: 'System',
    items: [
      { href: '/notifications', icon: Bell, label: 'Notifications', badge: '3' },
      { href: '/settings', icon: Settings, label: 'Settings', badge: null },
    ],
  },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [notificationCount, setNotificationCount] = useState(3);
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*, department:departments(name)')
          .eq('id', user.id)
          .single();
        if (data) setProfile(data);
      }
    };
    fetchProfile();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const roleColors: Record<string, string> = {
    super_admin: 'text-red-400',
    corporate_admin: 'text-purple-400',
    area_manager: 'text-blue-400',
    dept_manager: 'text-indigo-400',
    auditor: 'text-emerald-400',
    staff: 'text-amber-400',
    viewer: 'text-slate-400',
  };

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      <div className="flex h-screen bg-background overflow-hidden">

        {/* Mobile overlay */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <motion.aside
          animate={{ width: collapsed ? 72 : 260 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className={cn(
            'fixed lg:relative z-50 flex flex-col h-full overflow-hidden',
            'bg-card border-r border-border flex-shrink-0',
            'lg:translate-x-0 transition-transform duration-300',
            mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          )}
        >
          {/* Sidebar Header */}
          <div className="flex items-center gap-3 px-4 py-4 border-b border-border flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-glow-sm">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 min-w-0"
                >
                  <div className="font-display font-bold text-sm text-foreground leading-none">5S ProAudit</div>
                  <div className="text-muted-foreground text-xs mt-0.5">Enterprise Platform</div>
                </motion.div>
              )}
            </AnimatePresence>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 rounded-lg hover:bg-accent transition-colors hidden lg:flex"
            >
              {collapsed ? (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronLeft className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-hide">
            {navItems.map((group) => (
              <div key={group.group}>
                {!collapsed && (
                  <div className="text-xs font-semibold text-muted-foreground/50 uppercase tracking-wider px-2 mb-2">
                    {group.group}
                  </div>
                )}
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                    return (
                      <Link key={item.href} href={item.href}>
                        <motion.div
                          whileHover={{ x: collapsed ? 0 : 2 }}
                          className={cn(
                            'nav-item relative',
                            collapsed && 'justify-center px-2',
                            isActive && 'active'
                          )}
                          title={collapsed ? item.label : undefined}
                        >
                          <item.icon className={cn('w-4.5 h-4.5 flex-shrink-0 nav-icon', 'w-[18px] h-[18px]')} />
                          {!collapsed && (
                            <>
                              <span className="flex-1">{item.label}</span>
                              {item.badge && (
                                <span className={cn(
                                  'text-xs px-1.5 py-0.5 rounded-full font-semibold',
                                  item.badge === 'New' 
                                    ? 'bg-emerald-500/20 text-emerald-400' 
                                    : 'bg-red-500/20 text-red-400 min-w-[20px] text-center'
                                )}>
                                  {item.badge}
                                </span>
                              )}
                            </>
                          )}
                          {collapsed && item.badge && (
                            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
                          )}
                        </motion.div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Sidebar Footer - User Profile */}
          <div className={cn('border-t border-border p-3', collapsed && 'p-2')}>
            {!collapsed ? (
              <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-accent transition-colors cursor-pointer group">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
                  {profile?.full_name?.charAt(0) || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">{profile?.full_name || 'User'}</div>
                  <div className={cn('text-xs capitalize', roleColors[profile?.role || 'viewer'])}>
                    {profile?.role?.replace('_', ' ') || 'Viewer'}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-destructive/10 transition-all"
                  title="Sign out"
                >
                  <LogOut className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
                </button>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold cursor-pointer">
                  {profile?.full_name?.charAt(0) || 'U'}
                </div>
              </div>
            )}
          </div>
        </motion.aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* Top Header */}
          <header className="h-16 flex items-center justify-between px-6 border-b border-border bg-card/50 backdrop-blur-sm flex-shrink-0">
            {/* Left: Mobile menu + Breadcrumb */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileOpen(true)}
                className="p-2 rounded-lg hover:bg-accent transition-colors lg:hidden"
              >
                <Menu className="w-4 h-4" />
              </button>
              <BreadcrumbNav pathname={pathname} />
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <button className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-accent hover:bg-accent/80 text-muted-foreground text-sm transition-colors">
                <Search className="w-3.5 h-3.5" />
                <span className="hidden md:block">Search...</span>
                <kbd className="hidden md:block text-xs bg-background px-1.5 py-0.5 rounded border border-border">⌘K</kbd>
              </button>

              {/* New Audit FAB */}
              <Link href="/audits/new">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium shadow-glow-sm hover:shadow-glow-md transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  New Audit
                </motion.button>
              </Link>

              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Notifications */}
              <Link href="/notifications">
                <button className="relative p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground">
                  <Bell className="w-4 h-4" />
                  {notificationCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-card" />
                  )}
                </button>
              </Link>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-auto bg-background">
            <div className="p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarContext.Provider>
  );
}

function BreadcrumbNav({ pathname }: { pathname: string }) {
  const segments = pathname.split('/').filter(Boolean);
  const labels: Record<string, string> = {
    dashboard: 'Dashboard',
    audits: 'Audits',
    capa: 'CAPA',
    departments: 'Departments',
    reports: 'Reports',
    settings: 'Settings',
    users: 'Users',
    notifications: 'Notifications',
    leaderboard: 'Leaderboard',
    schedule: 'Schedule',
    new: 'New',
  };

  return (
    <nav className="flex items-center gap-1 text-sm">
      {segments.map((seg, i) => (
        <span key={seg} className="flex items-center gap-1">
          {i > 0 && <span className="text-muted-foreground/30">/</span>}
          <span className={cn(
            i === segments.length - 1
              ? 'text-foreground font-semibold'
              : 'text-muted-foreground'
          )}>
            {labels[seg] || seg.charAt(0).toUpperCase() + seg.slice(1)}
          </span>
        </span>
      ))}
    </nav>
  );
}
