'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus, Search, Building2, Users, BarChart3, Edit,
  Trash2, ChevronRight, TrendingUp, TrendingDown, Award,
  Activity, AlertTriangle, CheckCircle2, MoreHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';

const demoDepartments = [
  {
    id: 'd1', name: 'Production', code: 'PROD', category: 'Operations', color: '#6366f1', icon: '🏭',
    head: 'Ravi Kumar', employee_count: 45, last_audit: '2025-05-27',
    compliance: 93, trend: 2.1, open_capas: 0, grade: 'excellent', total_audits: 24
  },
  {
    id: 'd2', name: 'Warehouse', code: 'WH', category: 'Operations', color: '#10b981', icon: '🏪',
    head: 'Priya Sharma', employee_count: 28, last_audit: '2025-05-26',
    compliance: 78, trend: -1.5, open_capas: 3, grade: 'good', total_audits: 18
  },
  {
    id: 'd3', name: 'Quality Assurance', code: 'QA', category: 'Quality', color: '#f59e0b', icon: '🔬',
    head: 'Divya Rao', employee_count: 15, last_audit: '2025-05-28',
    compliance: 93, trend: 4.0, open_capas: 1, grade: 'excellent', total_audits: 30
  },
  {
    id: 'd4', name: 'Engineering', code: 'ENG', category: 'Technical', color: '#3b82f6', icon: '⚙️',
    head: 'Arjun Menon', employee_count: 22, last_audit: '2025-05-25',
    compliance: 62, trend: -3.2, open_capas: 7, grade: 'average', total_audits: 12
  },
  {
    id: 'd5', name: 'HR & Admin', code: 'HR', category: 'Support', color: '#ec4899', icon: '👥',
    head: 'Kiran Tiwari', employee_count: 12, last_audit: '2025-05-22',
    compliance: 76, trend: 1.0, open_capas: 2, grade: 'good', total_audits: 16
  },
  {
    id: 'd6', name: 'Finance', code: 'FIN', category: 'Support', color: '#8b5cf6', icon: '💰',
    head: 'Suresh P.', employee_count: 10, last_audit: '2025-05-15',
    compliance: 71, trend: 0.5, open_capas: 4, grade: 'good', total_audits: 10
  },
  {
    id: 'd7', name: 'Logistics', code: 'LOG', category: 'Operations', color: '#14b8a6', icon: '🚛',
    head: 'Meena K.', employee_count: 35, last_audit: '2025-05-20',
    compliance: 68, trend: -2.0, open_capas: 4, grade: 'average', total_audits: 15
  },
  {
    id: 'd8', name: 'Sales', code: 'SALES', category: 'Commercial', color: '#f97316', icon: '📈',
    head: 'Rajan D.', employee_count: 20, last_audit: '2025-05-10',
    compliance: 65, trend: -4.1, open_capas: 5, grade: 'average', total_audits: 8
  },
  {
    id: 'd9', name: 'Kitchen', code: 'KIT', category: 'Operations', color: '#ef4444', icon: '🍳',
    head: 'Amit Shah', employee_count: 18, last_audit: '2025-05-18',
    compliance: 57, trend: -1.0, open_capas: 3, grade: 'poor', total_audits: 9
  },
  {
    id: 'd10', name: 'IT Department', code: 'IT', category: 'Technical', color: '#0ea5e9', icon: '💻',
    head: 'Nisha K.', employee_count: 8, last_audit: '2025-05-12',
    compliance: 88, trend: 3.5, open_capas: 0, grade: 'excellent', total_audits: 6
  },
];

export default function DepartmentsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const categories = ['all', ...Array.from(new Set(demoDepartments.map(d => d.category)))];

  const filtered = demoDepartments.filter(d => {
    const matchSearch = !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.code.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'all' || d.category === category;
    return matchSearch && matchCat;
  });

  const sortedByRank = [...demoDepartments].sort((a, b) => b.compliance - a.compliance);

  return (
    <div className="space-y-6 max-w-screen-2xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Departments</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Manage department hierarchy and 5S performance</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium shadow-glow-sm hover:shadow-glow-md transition-all self-start"
        >
          <Plus className="w-4 h-4" />
          Add Department
        </button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Departments', value: demoDepartments.length, icon: Building2, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
          { label: 'Total Employees', value: demoDepartments.reduce((s, d) => s + d.employee_count, 0), icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Avg Compliance', value: `${Math.round(demoDepartments.reduce((s, d) => s + d.compliance, 0) / demoDepartments.length)}%`, icon: BarChart3, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Open CAPAs', value: demoDepartments.reduce((s, d) => s + d.open_capas, 0), icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="metric-card"
          >
            <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center mb-3', stat.bg)}>
              <stat.icon className={cn('w-4 h-4', stat.color)} />
            </div>
            <div className="text-2xl font-bold text-foreground font-display">{stat.value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search departments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn(
                'px-3 py-2 rounded-xl border text-xs font-medium capitalize transition-all',
                category === cat
                  ? 'bg-primary/10 border-primary/30 text-primary'
                  : 'border-border bg-card text-muted-foreground hover:bg-accent'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Department Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((dept, i) => {
          const rank = sortedByRank.findIndex(d => d.id === dept.id) + 1;
          return (
            <motion.div
              key={dept.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-border bg-card overflow-hidden hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 group cursor-pointer"
            >
              {/* Color bar */}
              <div className="h-1.5 w-full" style={{ background: dept.color }} />

              <div className="p-5">
                {/* Top row */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{dept.icon}</div>
                    <div>
                      <h3 className="font-semibold text-sm text-foreground">{dept.name}</h3>
                      <span className="text-xs text-muted-foreground">{dept.code} · {dept.category}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={cn(
                      'text-xs px-1.5 py-0.5 rounded font-bold',
                      rank <= 3 ? 'bg-amber-400/10 text-amber-400' : 'bg-muted text-muted-foreground'
                    )}>
                      #{rank}
                    </span>
                    <button className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-accent transition-all">
                      <MoreHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                  </div>
                </div>

                {/* Compliance */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-muted-foreground">Compliance Score</span>
                    <div className="flex items-center gap-1">
                      {dept.trend >= 0 ? (
                        <TrendingUp className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-red-400" />
                      )}
                      <span className={cn('text-xs font-medium', dept.trend >= 0 ? 'text-emerald-400' : 'text-red-400')}>
                        {dept.trend > 0 ? '+' : ''}{dept.trend}%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${dept.compliance}%` }}
                        transition={{ duration: 0.8, delay: 0.3 + i * 0.05 }}
                        className="h-full rounded-full"
                        style={{ background: dept.color }}
                      />
                    </div>
                    <span className={cn(
                      'text-sm font-bold flex-shrink-0',
                      dept.compliance >= 85 ? 'text-emerald-400' :
                      dept.compliance >= 70 ? 'text-blue-400' :
                      dept.compliance >= 60 ? 'text-amber-400' : 'text-red-400'
                    )}>
                      {dept.compliance}%
                    </span>
                  </div>
                </div>

                {/* Meta */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="text-center p-2 rounded-lg bg-muted/50">
                    <div className="text-sm font-bold text-foreground">{dept.employee_count}</div>
                    <div className="text-xs text-muted-foreground">Staff</div>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-muted/50">
                    <div className="text-sm font-bold text-foreground">{dept.total_audits}</div>
                    <div className="text-xs text-muted-foreground">Audits</div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs">
                      {dept.head.charAt(0)}
                    </div>
                    <span className="text-xs text-muted-foreground">{dept.head}</span>
                  </div>
                  {dept.open_capas > 0 ? (
                    <span className="text-xs text-amber-400 font-medium">{dept.open_capas} CAPAs</span>
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
