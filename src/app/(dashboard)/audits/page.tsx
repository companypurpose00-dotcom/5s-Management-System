'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Plus, Search, Filter, Download, ClipboardCheck,
  Calendar, Building2, User, ChevronRight, Eye,
  CheckCircle2, Clock, AlertTriangle, XCircle, Loader2,
  MoreHorizontal, Edit, Trash2, Copy, ArrowUpDown
} from 'lucide-react';
import { cn, formatDate, getGradeBg, getStatusColor, gradeFromPercentage } from '@/lib/utils';
import type { AuditStatus, AuditType } from '@/types';

// Demo audit data
const demoAudits = [
  {
    id: 'a1', title: 'Q2 Production 5S Audit', department: 'Production', auditor: 'Ravi Kumar',
    status: 'completed' as AuditStatus, type: 'routine' as AuditType,
    scheduled_date: '2025-05-27', compliance_percentage: 93, grade: 'excellent',
    sort_score: 95, set_in_order_score: 90, shine_score: 96, standardize_score: 92, sustain_score: 92,
    open_capas: 0
  },
  {
    id: 'a2', title: 'Warehouse Monthly Audit', department: 'Warehouse', auditor: 'Priya Sharma',
    status: 'completed' as AuditStatus, type: 'monthly' as AuditType,
    scheduled_date: '2025-05-26', compliance_percentage: 78, grade: 'good',
    sort_score: 80, set_in_order_score: 75, shine_score: 82, standardize_score: 78, sustain_score: 75,
    open_capas: 3
  },
  {
    id: 'a3', title: 'Engineering Dept Audit', department: 'Engineering', auditor: 'Arjun Menon',
    status: 'completed' as AuditStatus, type: 'quarterly' as AuditType,
    scheduled_date: '2025-05-25', compliance_percentage: 62, grade: 'average',
    sort_score: 65, set_in_order_score: 58, shine_score: 67, standardize_score: 60, sustain_score: 60,
    open_capas: 7
  },
  {
    id: 'a4', title: 'QA Lab 5S Inspection', department: 'Quality Assurance', auditor: 'Divya Rao',
    status: 'in_progress' as AuditStatus, type: 'surprise' as AuditType,
    scheduled_date: '2025-05-28', compliance_percentage: null, grade: null,
    sort_score: 0, set_in_order_score: 0, shine_score: 0, standardize_score: 0, sustain_score: 0,
    open_capas: 0
  },
  {
    id: 'a5', title: 'HR Department Audit', department: 'HR & Admin', auditor: 'Kiran Tiwari',
    status: 'overdue' as AuditStatus, type: 'routine' as AuditType,
    scheduled_date: '2025-05-22', compliance_percentage: null, grade: null,
    sort_score: 0, set_in_order_score: 0, shine_score: 0, standardize_score: 0, sustain_score: 0,
    open_capas: 0
  },
  {
    id: 'a6', title: 'Finance Dept Audit', department: 'Finance', auditor: 'Suresh P.',
    status: 'scheduled' as AuditStatus, type: 'monthly' as AuditType,
    scheduled_date: '2025-06-01', compliance_percentage: null, grade: null,
    sort_score: 0, set_in_order_score: 0, shine_score: 0, standardize_score: 0, sustain_score: 0,
    open_capas: 0
  },
  {
    id: 'a7', title: 'Logistics Hub Audit', department: 'Logistics', auditor: 'Meena K.',
    status: 'completed' as AuditStatus, type: 'routine' as AuditType,
    scheduled_date: '2025-05-20', compliance_percentage: 71, grade: 'good',
    sort_score: 72, set_in_order_score: 68, shine_score: 74, standardize_score: 70, sustain_score: 71,
    open_capas: 4
  },
  {
    id: 'a8', title: 'Kitchen Hygiene & 5S', department: 'Kitchen', auditor: 'Amit Shah',
    status: 'draft' as AuditStatus, type: 'routine' as AuditType,
    scheduled_date: '2025-05-29', compliance_percentage: null, grade: null,
    sort_score: 0, set_in_order_score: 0, shine_score: 0, standardize_score: 0, sustain_score: 0,
    open_capas: 0
  },
];

const statusConfig = {
  completed: { icon: CheckCircle2, label: 'Completed', count: demoAudits.filter(a => a.status === 'completed').length },
  in_progress: { icon: Clock, label: 'In Progress', count: demoAudits.filter(a => a.status === 'in_progress').length },
  scheduled: { icon: Calendar, label: 'Scheduled', count: demoAudits.filter(a => a.status === 'scheduled').length },
  overdue: { icon: AlertTriangle, label: 'Overdue', count: demoAudits.filter(a => a.status === 'overdue').length },
  draft: { icon: Edit, label: 'Draft', count: demoAudits.filter(a => a.status === 'draft').length },
};

export default function AuditsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState('scheduled_date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const filtered = demoAudits.filter(a => {
    const matchSearch = !search ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.department.toLowerCase().includes(search.toLowerCase()) ||
      a.auditor.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6 max-w-screen-2xl mx-auto">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Audit Management</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Manage and track all 5S audits across departments</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:bg-accent text-sm text-muted-foreground transition-colors">
            <Download className="w-3.5 h-3.5" />
            Export
          </button>
          <Link href="/audits/new">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium shadow-glow-sm hover:shadow-glow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              New Audit
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* Status Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {Object.entries(statusConfig).map(([status, config], i) => (
          <motion.button
            key={status}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => setStatusFilter(statusFilter === status ? 'all' : status)}
            className={cn(
              'flex flex-col items-start p-4 rounded-xl border transition-all duration-200 text-left',
              statusFilter === status
                ? 'border-primary bg-primary/5'
                : 'border-border bg-card hover:bg-accent/50'
            )}
          >
            <config.icon className={cn(
              'w-5 h-5 mb-2',
              status === 'completed' ? 'text-emerald-400' :
              status === 'in_progress' ? 'text-amber-400' :
              status === 'scheduled' ? 'text-blue-400' :
              status === 'overdue' ? 'text-red-400' : 'text-purple-400'
            )} />
            <div className="text-2xl font-bold text-foreground font-display">{config.count}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{config.label}</div>
          </motion.button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search audits, departments, auditors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="in_progress">In Progress</option>
            <option value="scheduled">Scheduled</option>
            <option value="overdue">Overdue</option>
            <option value="draft">Draft</option>
          </select>
          <button className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-border bg-card hover:bg-accent text-sm text-muted-foreground transition-colors">
            <Filter className="w-3.5 h-3.5" />
            Filters
          </button>
        </div>
      </div>

      {/* Audit Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-border bg-card overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr className="bg-muted/30">
                <th>Audit / Department</th>
                <th>Auditor</th>
                <th>Type</th>
                <th>Date</th>
                <th>Status</th>
                <th>Score</th>
                <th>Open CAPAs</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-muted-foreground">
                    <ClipboardCheck className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p>No audits found</p>
                  </td>
                </tr>
              ) : (
                filtered.map((audit, i) => (
                  <motion.tr
                    key={audit.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="group"
                  >
                    <td>
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          'w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0',
                          audit.status === 'completed' ? 'bg-emerald-500/10' :
                          audit.status === 'overdue' ? 'bg-red-500/10' :
                          audit.status === 'in_progress' ? 'bg-amber-500/10' : 'bg-blue-500/10'
                        )}>
                          <ClipboardCheck className={cn(
                            'w-4 h-4',
                            audit.status === 'completed' ? 'text-emerald-400' :
                            audit.status === 'overdue' ? 'text-red-400' :
                            audit.status === 'in_progress' ? 'text-amber-400' : 'text-blue-400'
                          )} />
                        </div>
                        <div>
                          <Link href={`/audits/${audit.id}`} className="font-medium text-foreground hover:text-primary transition-colors text-sm">
                            {audit.title}
                          </Link>
                          <div className="flex items-center gap-1 mt-0.5 text-xs text-muted-foreground">
                            <Building2 className="w-3 h-3" />
                            {audit.department}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                          {audit.auditor.charAt(0)}
                        </div>
                        <span className="text-muted-foreground">{audit.auditor}</span>
                      </div>
                    </td>
                    <td>
                      <span className="text-xs px-2 py-1 rounded-md bg-accent text-muted-foreground capitalize">
                        {audit.type}
                      </span>
                    </td>
                    <td>
                      <span className="text-sm text-muted-foreground">{formatDate(audit.scheduled_date)}</span>
                    </td>
                    <td>
                      <span className={cn('text-xs px-2.5 py-1 rounded-full font-medium capitalize', getStatusColor(audit.status))}>
                        {audit.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      {audit.compliance_percentage != null ? (
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className={cn(
                                'h-full rounded-full',
                                audit.compliance_percentage >= 85 ? 'bg-emerald-500' :
                                audit.compliance_percentage >= 70 ? 'bg-blue-500' :
                                audit.compliance_percentage >= 60 ? 'bg-amber-500' : 'bg-red-500'
                              )}
                              style={{ width: `${audit.compliance_percentage}%` }}
                            />
                          </div>
                          <span className={cn(
                            'text-sm font-bold',
                            audit.compliance_percentage >= 85 ? 'text-emerald-400' :
                            audit.compliance_percentage >= 70 ? 'text-blue-400' :
                            audit.compliance_percentage >= 60 ? 'text-amber-400' : 'text-red-400'
                          )}>
                            {audit.compliance_percentage}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                      )}
                    </td>
                    <td>
                      {audit.open_capas > 0 ? (
                        <span className={cn(
                          'text-xs px-2 py-1 rounded-full font-medium',
                          audit.open_capas >= 5 ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'
                        )}>
                          {audit.open_capas} open
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                      )}
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/audits/${audit.id}`}>
                          <button className="p-1.5 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100">
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </Link>
                        <button className="p-1.5 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100">
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100">
                          <MoreHorizontal className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/20 text-xs text-muted-foreground">
          <span>Showing {filtered.length} of {demoAudits.length} audits</span>
          <div className="flex items-center gap-2">
            <button className="px-2.5 py-1 rounded border border-border hover:bg-accent transition-colors">Previous</button>
            <span className="px-2.5 py-1 rounded bg-primary/10 text-primary border border-primary/20">1</span>
            <button className="px-2.5 py-1 rounded border border-border hover:bg-accent transition-colors">Next</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
