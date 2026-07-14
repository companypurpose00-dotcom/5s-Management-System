'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, BellOff, CheckCheck, ClipboardCheck, AlertTriangle,
  Award, Shield, TrendingUp, Clock, X, Filter, Search,
  Circle, CheckCircle2
} from 'lucide-react';
import { cn, formatRelativeTime } from '@/lib/utils';
import type { NotificationType } from '@/types';

const demoNotifications = [
  {
    id: 'n1', type: 'audit_overdue' as NotificationType, is_read: false,
    title: 'Audit Overdue: HR Department',
    message: 'The HR & Admin department audit scheduled for May 22nd is now overdue. Please take immediate action.',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    action_url: '/audits',
  },
  {
    id: 'n2', type: 'capa_assigned' as NotificationType, is_read: false,
    title: 'New CAPA Assigned to You',
    message: 'You have been assigned a critical CAPA: "Unlabeled chemical containers in Production". Due date: June 1, 2025.',
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    action_url: '/capa',
  },
  {
    id: 'n3', type: 'achievement' as NotificationType, is_read: false,
    title: '🏆 QA Department — Excellent Grade!',
    message: 'Quality Assurance team achieved an outstanding 93% compliance score this month. Congratulations!',
    created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    action_url: '/departments',
  },
  {
    id: 'n4', type: 'audit_due' as NotificationType, is_read: true,
    title: 'Upcoming Audit: Finance Department',
    message: 'Finance department audit is scheduled for June 1, 2025. Please ensure all preparations are complete.',
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    action_url: '/audits',
  },
  {
    id: 'n5', type: 'capa_overdue' as NotificationType, is_read: true,
    title: 'CAPA Overdue: Kitchen Fire Extinguisher',
    message: 'The critical CAPA for expired fire extinguisher replacement in Kitchen is now 8 days overdue. Escalating to Area Manager.',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    action_url: '/capa',
  },
  {
    id: 'n6', type: 'capa_approved' as NotificationType, is_read: true,
    title: 'CAPA Approved: Logistics Lighting',
    message: 'Your corrective action for "Poor lighting in Logistics storage area" has been approved by the Area Manager.',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    action_url: '/capa',
  },
  {
    id: 'n7', type: 'escalation' as NotificationType, is_read: true,
    title: 'Escalation: Engineering CAPA Overdue',
    message: 'CAPA #ENGc-003 "Tools not returned to shadow boards" has been escalated. 7 days since assignment with no progress.',
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    action_url: '/capa',
  },
  {
    id: 'n8', type: 'system' as NotificationType, is_read: true,
    title: 'Monthly Report Generated',
    message: 'May 2025 Monthly Compliance Report is ready for download. Overall compliance: 89% (+4% vs April).',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    action_url: '/reports',
  },
];

const typeConfig: Record<NotificationType, { icon: React.ElementType; color: string; bg: string }> = {
  audit_due: { icon: Clock, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  audit_overdue: { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10' },
  capa_assigned: { icon: ClipboardCheck, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  capa_overdue: { icon: AlertTriangle, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  capa_approved: { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  escalation: { icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  system: { icon: Shield, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
  achievement: { icon: Award, color: 'text-amber-400', bg: 'bg-amber-500/10' },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(demoNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [search, setSearch] = useState('');

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const filtered = notifications.filter(n => {
    const matchFilter = filter === 'all' || !n.is_read;
    const matchSearch = !search || n.title.toLowerCase().includes(search.toLowerCase()) || n.message.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const dismiss = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Notifications</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:bg-accent text-sm text-muted-foreground transition-colors"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Mark all read
          </button>
        )}
      </motion.div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search notifications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
        </div>
        <div className="flex items-center rounded-xl border border-border bg-card p-0.5">
          <button
            onClick={() => setFilter('all')}
            className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-all', filter === 'all' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground')}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5', filter === 'unread' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground')}
          >
            Unread
            {unreadCount > 0 && (
              <span className={cn('text-xs px-1.5 py-0.5 rounded-full', filter === 'unread' ? 'bg-white/20' : 'bg-red-500/20 text-red-400')}>
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Notification List */}
      <div className="space-y-2">
        <AnimatePresence>
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 text-muted-foreground"
            >
              <BellOff className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>No notifications found</p>
            </motion.div>
          ) : (
            filtered.map((notification, i) => {
              const config = typeConfig[notification.type];
              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => markRead(notification.id)}
                  className={cn(
                    'flex items-start gap-4 p-4 rounded-xl border transition-all duration-200 cursor-pointer group',
                    notification.is_read
                      ? 'border-border bg-card hover:bg-accent/50'
                      : 'border-primary/20 bg-primary/5 hover:bg-primary/8'
                  )}
                >
                  {/* Icon */}
                  <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5', config.bg)}>
                    <config.icon className={cn('w-4.5 h-4.5', 'w-[18px] h-[18px]', config.color)} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {!notification.is_read && (
                          <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                        )}
                        <p className="text-sm font-semibold text-foreground">{notification.title}</p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); dismiss(notification.id); }}
                        className="p-1 rounded-lg hover:bg-accent opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
                      >
                        <X className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{notification.message}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-muted-foreground/60">{formatRelativeTime(notification.created_at)}</span>
                      <a href={notification.action_url} className="text-xs text-primary hover:underline" onClick={(e) => e.stopPropagation()}>
                        View details →
                      </a>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
