'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus, Search, Filter, AlertTriangle, Clock, CheckCircle2,
  ChevronRight, MoreHorizontal, Edit, Eye, User, Calendar,
  Building2, Flag, ArrowUpDown, Kanban, List, Timer, Zap
} from 'lucide-react';
import { cn, formatDate, formatRelativeTime, getPriorityColor, getStatusColor } from '@/lib/utils';
import type { CapaStatus, CapaPriority } from '@/types';

const demoCapa = [
  {
    id: 'c1', title: 'Aisle markings faded in Warehouse Zone B',
    description: 'Yellow floor markings in Zone B are completely worn out creating safety hazard.',
    department: 'Warehouse', priority: 'high' as CapaPriority, status: 'in_progress' as CapaStatus,
    assigned_to: 'Ramesh V.', raised_by: 'Priya S.',
    due_date: '2025-06-05', created_at: '2025-05-26', audit_title: 'Warehouse Monthly Audit',
    sla_hours: 72, is_recurring: false
  },
  {
    id: 'c2', title: 'Unlabeled chemical containers in Production',
    description: 'Multiple chemical containers found without hazard labels in production area.',
    department: 'Production', priority: 'critical' as CapaPriority, status: 'open' as CapaStatus,
    assigned_to: 'Sunil K.', raised_by: 'Ravi Kumar',
    due_date: '2025-06-01', created_at: '2025-05-27', audit_title: 'Q2 Production 5S Audit',
    sla_hours: 24, is_recurring: false
  },
  {
    id: 'c3', title: 'Tools not returned to shadow boards',
    description: 'Engineering team repeatedly leaving tools on workbenches instead of shadow boards.',
    department: 'Engineering', priority: 'medium' as CapaPriority, status: 'pending_review' as CapaStatus,
    assigned_to: 'Arjun M.', raised_by: 'Divya R.',
    due_date: '2025-06-10', created_at: '2025-05-23', audit_title: 'Engineering Dept Audit',
    sla_hours: 120, is_recurring: true
  },
  {
    id: 'c4', title: 'SOP documents outdated — Finance Dept',
    description: 'Finance SOPs are 2 versions behind. Team is operating on outdated procedures.',
    department: 'Finance', priority: 'medium' as CapaPriority, status: 'open' as CapaStatus,
    assigned_to: 'Anita S.', raised_by: 'Kiran T.',
    due_date: '2025-06-15', created_at: '2025-05-22', audit_title: 'Finance Dept Audit',
    sla_hours: 168, is_recurring: false
  },
  {
    id: 'c5', title: 'Expired fire extinguisher — Kitchen',
    description: 'Kitchen area fire extinguisher expiry date has passed. Immediate replacement required.',
    department: 'Kitchen', priority: 'critical' as CapaPriority, status: 'overdue' as CapaStatus,
    assigned_to: 'Amit Shah', raised_by: 'Safety Officer',
    due_date: '2025-05-20', created_at: '2025-05-18', audit_title: 'Kitchen Hygiene & 5S',
    sla_hours: 24, is_recurring: false
  },
  {
    id: 'c6', title: 'Poor lighting in Logistics storage area',
    description: 'Insufficient lighting in rear storage causing workers to use phone flashlights.',
    department: 'Logistics', priority: 'high' as CapaPriority, status: 'approved' as CapaStatus,
    assigned_to: 'Meena K.', raised_by: 'Logistics Lead',
    due_date: '2025-06-20', created_at: '2025-05-20', audit_title: 'Logistics Hub Audit',
    sla_hours: 96, is_recurring: false
  },
  {
    id: 'c7', title: 'QA lab cleaning schedule not maintained',
    description: 'Weekly cleaning log for QA lab is incomplete for past 3 weeks.',
    department: 'Quality Assurance', priority: 'low' as CapaPriority, status: 'closed' as CapaStatus,
    assigned_to: 'Divya R.', raised_by: 'QA Manager',
    due_date: '2025-05-31', created_at: '2025-05-15', audit_title: 'QA Lab 5S Inspection',
    sla_hours: 48, is_recurring: true
  },
];

const kanbanColumns: { status: CapaStatus; label: string; color: string; bg: string }[] = [
  { status: 'open', label: 'Open', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
  { status: 'in_progress', label: 'In Progress', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  { status: 'pending_review', label: 'Review', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
  { status: 'approved', label: 'Approved', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  { status: 'closed', label: 'Closed', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
];

function CapaCard({ capa }: { capa: typeof demoCapa[0] }) {
  const isOverdue = capa.status === 'overdue';
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        'bg-card border rounded-xl p-4 cursor-pointer hover:shadow-card-hover transition-all duration-200 group',
        isOverdue ? 'border-red-500/30' : 'border-border'
      )}
    >
      {/* Priority + recurring */}
      <div className="flex items-center justify-between mb-3">
        <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium capitalize', getPriorityColor(capa.priority))}>
          <Flag className="w-3 h-3 inline mr-1" />
          {capa.priority}
        </span>
        <div className="flex items-center gap-1">
          {capa.is_recurring && (
            <span className="text-xs px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400">Recurring</span>
          )}
          <button className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-accent transition-all">
            <MoreHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Title */}
      <h4 className="text-sm font-semibold text-foreground leading-snug mb-2 line-clamp-2">{capa.title}</h4>
      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-3">{capa.description}</p>

      {/* Meta */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Building2 className="w-3 h-3 flex-shrink-0" />
          {capa.department}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <User className="w-3 h-3 flex-shrink-0" />
          {capa.assigned_to}
        </div>
        <div className={cn('flex items-center gap-1.5 text-xs', isOverdue ? 'text-red-400 font-medium' : 'text-muted-foreground')}>
          <Timer className="w-3 h-3 flex-shrink-0" />
          Due: {formatDate(capa.due_date)}
          {isOverdue && ' · OVERDUE'}
        </div>
      </div>
    </motion.div>
  );
}

export default function CapaPage() {
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [search, setSearch] = useState('');

  const filtered = demoCapa.filter(c =>
    !search ||
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.department.toLowerCase().includes(search.toLowerCase()) ||
    c.assigned_to.toLowerCase().includes(search.toLowerCase())
  );

  const statCounts = {
    total: demoCapa.length,
    critical: demoCapa.filter(c => c.priority === 'critical').length,
    overdue: demoCapa.filter(c => c.status === 'overdue').length,
    open: demoCapa.filter(c => ['open', 'in_progress'].includes(c.status)).length,
  };

  return (
    <div className="space-y-6 max-w-screen-2xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">CAPA Management</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Corrective & Preventive Action tracking</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-xl border border-border bg-card p-0.5">
            <button
              onClick={() => setView('kanban')}
              className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all', view === 'kanban' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground')}
            >
              <Kanban className="w-3.5 h-3.5" /> Kanban
            </button>
            <button
              onClick={() => setView('list')}
              className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all', view === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground')}
            >
              <List className="w-3.5 h-3.5" /> List
            </button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium shadow-glow-sm hover:shadow-glow-md transition-all">
            <Plus className="w-4 h-4" />
            New CAPA
          </button>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total CAPAs', value: statCounts.total, color: 'text-foreground', bg: 'bg-card' },
          { label: 'Critical', value: statCounts.critical, color: 'text-red-400', bg: 'bg-red-500/5' },
          { label: 'Overdue', value: statCounts.overdue, color: 'text-orange-400', bg: 'bg-orange-500/5' },
          { label: 'Open/Active', value: statCounts.open, color: 'text-amber-400', bg: 'bg-amber-500/5' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={cn('p-4 rounded-xl border border-border', stat.bg)}
          >
            <div className={cn('text-2xl font-bold font-display', stat.color)}>{stat.value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search CAPA items, departments, assignees..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
        />
      </div>

      {/* Kanban View */}
      {view === 'kanban' && (
        <div className="overflow-x-auto -mx-1 px-1 pb-4">
          <div className="flex gap-4 min-w-max">
            {kanbanColumns.map((col) => {
              const colItems = filtered.filter(c => c.status === col.status || (col.status === 'open' && c.status === 'overdue' && false));
              const actualItems = filtered.filter(c => c.status === col.status);
              return (
                <div key={col.status} className="w-72 flex-shrink-0">
                  {/* Column Header */}
                  <div className={cn('flex items-center justify-between p-3 rounded-xl border mb-3', col.bg)}>
                    <div className="flex items-center gap-2">
                      <span className={cn('font-semibold text-sm', col.color)}>{col.label}</span>
                      <span className={cn('text-xs px-1.5 py-0.5 rounded-full font-bold', col.bg, col.color)}>
                        {actualItems.length}
                      </span>
                    </div>
                    <button className={cn('p-1 rounded-lg hover:bg-white/10 transition-colors', col.color)}>
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {/* Cards */}
                  <div className="space-y-3">
                    {actualItems.map((capa) => (
                      <CapaCard key={capa.id} capa={capa} />
                    ))}
                    {actualItems.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground text-xs border border-dashed border-border rounded-xl">
                        No items
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Overdue column */}
            <div className="w-72 flex-shrink-0">
              <div className="flex items-center justify-between p-3 rounded-xl border mb-3 bg-red-600/10 border-red-600/20">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-red-400">Overdue</span>
                  <span className="text-xs px-1.5 py-0.5 rounded-full font-bold bg-red-600/20 text-red-400">
                    {filtered.filter(c => c.status === 'overdue').length}
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                {filtered.filter(c => c.status === 'overdue').map((capa) => (
                  <CapaCard key={capa.id} capa={capa} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* List View */}
      {view === 'list' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl border border-border bg-card overflow-hidden"
        >
          <table className="data-table">
            <thead>
              <tr className="bg-muted/30">
                <th>Issue</th>
                <th>Department</th>
                <th>Priority</th>
                <th>Assigned To</th>
                <th>Due Date</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((capa, i) => (
                <motion.tr
                  key={capa.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="group"
                >
                  <td>
                    <div>
                      <div className="font-medium text-sm text-foreground">{capa.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                        {capa.is_recurring && <span className="text-indigo-400">↻ Recurring ·</span>}
                        {capa.audit_title}
                      </div>
                    </div>
                  </td>
                  <td><span className="text-sm text-muted-foreground">{capa.department}</span></td>
                  <td>
                    <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium capitalize', getPriorityColor(capa.priority))}>
                      {capa.priority}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs">
                        {capa.assigned_to.charAt(0)}
                      </div>
                      {capa.assigned_to}
                    </div>
                  </td>
                  <td>
                    <span className={cn('text-sm', capa.status === 'overdue' ? 'text-red-400 font-medium' : 'text-muted-foreground')}>
                      {formatDate(capa.due_date)}
                    </span>
                  </td>
                  <td>
                    <span className={cn('text-xs px-2.5 py-1 rounded-full font-medium capitalize',
                      capa.status === 'overdue' ? 'capa-overdue' : getStatusColor(capa.status)
                    )}>
                      {capa.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-accent transition-colors text-muted-foreground opacity-0 group-hover:opacity-100">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-accent transition-colors text-muted-foreground opacity-0 group-hover:opacity-100">
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
    </div>
  );
}
