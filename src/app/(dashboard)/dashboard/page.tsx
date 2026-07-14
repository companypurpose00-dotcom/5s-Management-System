'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ClipboardCheck, AlertTriangle, TrendingUp, Award,
  ArrowUpRight, ArrowDownRight, Activity, Zap, Target,
  Building2, ChevronRight, CheckCircle2, Clock, XCircle,
  BarChart2, Sparkles, Calendar, Shield, RefreshCw
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, ResponsiveContainer,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, Area, AreaChart
} from 'recharts';
import { createClient } from '@/lib/supabase/client';
import { cn, formatDate, getGradeColor } from '@/lib/utils';
import type { DashboardStats, DepartmentSummary } from '@/types';

// ===== DEMO DATA =====
const monthlyTrend = [
  { month: 'Jan', compliance: 72, audits: 18, capa: 12 },
  { month: 'Feb', compliance: 68, audits: 22, capa: 15 },
  { month: 'Mar', compliance: 75, audits: 25, capa: 10 },
  { month: 'Apr', compliance: 79, audits: 20, capa: 8 },
  { month: 'May', compliance: 83, audits: 28, capa: 6 },
  { month: 'Jun', compliance: 81, audits: 24, capa: 9 },
  { month: 'Jul', compliance: 86, audits: 30, capa: 5 },
  { month: 'Aug', compliance: 88, audits: 32, capa: 4 },
  { month: 'Sep', compliance: 85, audits: 27, capa: 7 },
  { month: 'Oct', compliance: 91, audits: 35, capa: 3 },
  { month: 'Nov', compliance: 89, audits: 31, capa: 5 },
  { month: 'Dec', compliance: 93, audits: 38, capa: 2 },
];

const fiveSRadar = [
  { category: 'Sort', score: 88, fullMark: 100 },
  { category: 'Set in Order', score: 76, fullMark: 100 },
  { category: 'Shine', score: 92, fullMark: 100 },
  { category: 'Standardize', score: 81, fullMark: 100 },
  { category: 'Sustain', score: 74, fullMark: 100 },
];

const deptPerformance = [
  { dept: 'QA', score: 93, color: '#10b981' },
  { dept: 'Production', score: 87, color: '#6366f1' },
  { dept: 'Warehouse', score: 82, color: '#3b82f6' },
  { dept: 'Engineering', score: 79, color: '#8b5cf6' },
  { dept: 'HR', score: 76, color: '#ec4899' },
  { dept: 'Finance', score: 71, color: '#f59e0b' },
  { dept: 'Logistics', score: 68, color: '#14b8a6' },
  { dept: 'Sales', score: 65, color: '#f97316' },
];

const capaBreakdown = [
  { name: 'Closed', value: 45, color: '#10b981' },
  { name: 'In Progress', value: 23, color: '#f59e0b' },
  { name: 'Open', value: 18, color: '#6366f1' },
  { name: 'Overdue', value: 8, color: '#ef4444' },
];

const recentAudits = [
  { id: '1', dept: 'Production', auditor: 'Ravi Kumar', score: 93, grade: 'excellent', date: '2025-05-27', status: 'completed' },
  { id: '2', dept: 'Warehouse', auditor: 'Priya S.', score: 78, grade: 'good', date: '2025-05-26', status: 'completed' },
  { id: '3', dept: 'Engineering', auditor: 'Arjun M.', score: 61, grade: 'average', date: '2025-05-25', status: 'completed' },
  { id: '4', dept: 'QA', auditor: 'Divya R.', score: null, grade: null, date: '2025-05-28', status: 'in_progress' },
  { id: '5', dept: 'HR', auditor: 'Kiran T.', score: null, grade: null, date: '2025-05-24', status: 'overdue' },
];

const aiInsights = [
  {
    type: 'warning',
    icon: AlertTriangle,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/20',
    title: 'Sustain Score Declining',
    desc: 'Sustain (Shitsuke) scores dropped 8% vs last month across 3 departments. Schedule refresher training.',
  },
  {
    type: 'success',
    icon: TrendingUp,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    title: 'QA Department Leading',
    desc: 'QA achieved 93% compliance — highest in company history. Consider sharing best practices.',
  },
  {
    type: 'info',
    icon: Target,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
    title: 'Sales Needs Attention',
    desc: '3 consecutive months below 70%. Recommend immediate corrective audit and CAPA review.',
  },
];

// ===== ANIMATED KPI CARD =====
function KpiCard({
  title, value, subtitle, trend, icon: Icon, color, suffix = '', delay = 0
}: {
  title: string;
  value: number | string;
  subtitle?: string;
  trend?: number;
  icon: React.ElementType;
  color: string;
  suffix?: string;
  delay?: number;
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const numValue = typeof value === 'number' ? value : parseFloat(value as string) || 0;

  useEffect(() => {
    const duration = 1200;
    const steps = 60;
    const increment = numValue / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= numValue) {
        setDisplayValue(numValue);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [numValue]);

  const colorMap: Record<string, { icon: string; glow: string; badge: string }> = {
    indigo: { icon: 'bg-indigo-500/20 text-indigo-400', glow: 'group-hover:shadow-glow-sm', badge: 'text-indigo-400' },
    emerald: { icon: 'bg-emerald-500/20 text-emerald-400', glow: 'group-hover:shadow-glow-sm', badge: 'text-emerald-400' },
    amber: { icon: 'bg-amber-500/20 text-amber-400', glow: 'group-hover:shadow-glow-sm', badge: 'text-amber-400' },
    red: { icon: 'bg-red-500/20 text-red-400', glow: 'group-hover:shadow-glow-sm', badge: 'text-red-400' },
    blue: { icon: 'bg-blue-500/20 text-blue-400', glow: 'group-hover:shadow-glow-sm', badge: 'text-blue-400' },
    purple: { icon: 'bg-purple-500/20 text-purple-400', glow: 'group-hover:shadow-glow-sm', badge: 'text-purple-400' },
  };
  const c = colorMap[color] || colorMap.indigo;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cn('metric-card group', c.glow)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', c.icon)}>
          <Icon className="w-5 h-5" />
        </div>
        {trend !== undefined && (
          <div className={cn(
            'flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full',
            trend >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
          )}>
            {trend >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className="space-y-1">
        <div className="text-3xl font-bold font-display text-foreground">
          {typeof value === 'string' && isNaN(parseFloat(value)) ? value : displayValue}{suffix}
        </div>
        <div className="text-sm font-medium text-foreground/80">{title}</div>
        {subtitle && <div className="text-xs text-muted-foreground">{subtitle}</div>}
      </div>
    </motion.div>
  );
}

// ===== CUSTOM TOOLTIP =====
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-xl p-3 shadow-card text-xs">
        <p className="font-semibold text-foreground mb-2">{label}</p>
        {payload.map((p: any) => (
          <div key={p.name} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-muted-foreground">{p.name}:</span>
            <span className="font-semibold text-foreground">{p.value}{p.name === 'compliance' ? '%' : ''}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// ===== MAIN DASHBOARD =====
export default function DashboardPage() {
  const [lastUpdated, setLastUpdated] = useState(new Date());

  return (
    <div className="space-y-6 max-w-screen-2xl mx-auto">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Executive Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Real-time 5S compliance overview · Last updated {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLastUpdated(new Date())}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:bg-accent text-sm text-muted-foreground transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium shadow-glow-sm hover:shadow-glow-md transition-all">
            <Sparkles className="w-3.5 h-3.5" />
            AI Report
          </button>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Overall Compliance" value={89} suffix="%" trend={4.2} icon={Shield} color="indigo" subtitle="vs last month: 85%" delay={0} />
        <KpiCard title="Audits Completed" value={247} trend={12} icon={ClipboardCheck} color="emerald" subtitle="This year" delay={0.05} />
        <KpiCard title="Open CAPAs" value={41} trend={-8} icon={AlertTriangle} color="amber" subtitle="18 critical" delay={0.1} />
        <KpiCard title="Avg Audit Score" value={82} suffix="%" trend={2.1} icon={Award} color="blue" subtitle="Across all depts" delay={0.15} />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Audits Overdue" value={5} trend={-3} icon={XCircle} color="red" subtitle="Needs immediate action" delay={0.2} />
        <KpiCard title="Scheduled Audits" value={14} icon={Calendar} color="purple" subtitle="Next 30 days" delay={0.25} />
        <KpiCard title="Departments Audited" value={10} icon={Building2} color="indigo" subtitle="All active" delay={0.3} />
        <KpiCard title="CAPA Closure Rate" value={87} suffix="%" trend={5} icon={CheckCircle2} color="emerald" subtitle="Last 90 days" delay={0.35} />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Compliance Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="xl:col-span-2 chart-container"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display font-semibold text-foreground">Compliance Trend</h3>
              <p className="text-muted-foreground text-xs mt-0.5">Monthly compliance % and audit volume</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-indigo-500 inline-block rounded" /> Compliance</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-emerald-500 inline-block rounded" /> Audits</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={monthlyTrend} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="complianceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="auditsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="compliance" name="compliance" stroke="#6366f1" strokeWidth={2} fill="url(#complianceGrad)" dot={{ fill: '#6366f1', strokeWidth: 2, r: 3 }} />
              <Area type="monotone" dataKey="audits" name="audits" stroke="#10b981" strokeWidth={2} fill="url(#auditsGrad)" dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* 5S Radar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="chart-container"
        >
          <div className="mb-4">
            <h3 className="font-display font-semibold text-foreground">5S Category Scores</h3>
            <p className="text-muted-foreground text-xs mt-0.5">Average across all departments</p>
          </div>
          <ResponsiveContainer width="100%" height={230}>
            <RadarChart data={fiveSRadar}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="category" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
              <Radar name="Score" dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} strokeWidth={2} dot={{ fill: '#6366f1', r: 3 }} />
            </RadarChart>
          </ResponsiveContainer>
          {/* Category breakdown */}
          <div className="space-y-2 mt-2">
            {fiveSRadar.map((item) => (
              <div key={item.category} className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-20 truncate">{item.category}</span>
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.score}%` }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className={cn('h-full rounded-full', item.score >= 85 ? 'bg-emerald-500' : item.score >= 70 ? 'bg-indigo-500' : 'bg-amber-500')}
                  />
                </div>
                <span className="text-xs font-semibold text-foreground w-8 text-right">{item.score}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Department Performance Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="xl:col-span-2 chart-container"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display font-semibold text-foreground">Department Performance</h3>
              <p className="text-muted-foreground text-xs mt-0.5">Compliance scores by department</p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1 text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" /> ≥85%</span>
              <span className="flex items-center gap-1 text-amber-400"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> 70-84%</span>
              <span className="flex items-center gap-1 text-red-400"><span className="w-2 h-2 rounded-full bg-red-400 inline-block" /> &lt;70%</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={deptPerformance} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="dept" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <YAxis domain={[50, 100]} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="score" name="score" radius={[6, 6, 0, 0]}>
                {deptPerformance.map((entry) => (
                  <Cell
                    key={entry.dept}
                    fill={entry.score >= 85 ? '#10b981' : entry.score >= 70 ? '#6366f1' : '#ef4444'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* CAPA Pie */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="chart-container"
        >
          <div className="mb-4">
            <h3 className="font-display font-semibold text-foreground">CAPA Status</h3>
            <p className="text-muted-foreground text-xs mt-0.5">Current action items breakdown</p>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={capaBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {capaBreakdown.map((entry, index) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [`${value} items`, name]} contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2">
            {capaBreakdown.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                  <span className="text-muted-foreground">{item.name}</span>
                </div>
                <span className="font-semibold text-foreground">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Audits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="xl:col-span-2 rounded-2xl border border-border bg-card p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display font-semibold text-foreground">Recent Audits</h3>
            <a href="/audits" className="text-xs text-primary hover:underline flex items-center gap-1">
              View all <ChevronRight className="w-3 h-3" />
            </a>
          </div>
          <div className="space-y-3">
            {recentAudits.map((audit, i) => (
              <motion.div
                key={audit.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.05 }}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-accent/50 transition-colors cursor-pointer"
              >
                <div className={cn(
                  'w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold',
                  audit.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                  audit.status === 'in_progress' ? 'bg-amber-500/10 text-amber-400' :
                  'bg-red-500/10 text-red-400'
                )}>
                  {audit.status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> :
                   audit.status === 'in_progress' ? <Activity className="w-4 h-4" /> :
                   <Clock className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-foreground">{audit.dept}</span>
                    <span className={cn(
                      'text-xs px-2 py-0.5 rounded-full font-medium',
                      `status-${audit.status}`
                    )}>
                      {audit.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">{audit.auditor} · {audit.date}</div>
                </div>
                {audit.score && (
                  <div className="text-right flex-shrink-0">
                    <div className={cn(
                      'text-sm font-bold',
                      audit.score >= 85 ? 'text-emerald-400' :
                      audit.score >= 70 ? 'text-blue-400' : 'text-amber-400'
                    )}>
                      {audit.score}%
                    </div>
                    <div className={cn('text-xs capitalize', `badge-${audit.grade}`)}>{audit.grade}</div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* AI Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="rounded-2xl border border-border bg-card p-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <h3 className="font-display font-semibold text-foreground">AI Insights</h3>
            <span className="ml-auto text-xs bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-full">Live</span>
          </div>
          <div className="space-y-3">
            {aiInsights.map((insight, i) => (
              <motion.div
                key={insight.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className={cn('p-3.5 rounded-xl border', insight.bg)}
              >
                <div className="flex items-start gap-2.5">
                  <insight.icon className={cn('w-4 h-4 flex-shrink-0 mt-0.5', insight.color)} />
                  <div>
                    <div className="text-sm font-semibold text-foreground">{insight.title}</div>
                    <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{insight.desc}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <button className="w-full mt-4 py-2.5 rounded-xl border border-border text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
            Generate Full AI Report
          </button>
        </motion.div>
      </div>

      {/* Department Leaderboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-2xl border border-border bg-card p-6"
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-display font-semibold text-foreground">Department Leaderboard</h3>
            <p className="text-muted-foreground text-xs mt-0.5">Ranked by 5S compliance score this month</p>
          </div>
          <a href="/leaderboard" className="text-xs text-primary hover:underline flex items-center gap-1">
            Full Rankings <ChevronRight className="w-3 h-3" />
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {deptPerformance.slice(0, 8).map((dept, i) => (
            <motion.div
              key={dept.dept}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + i * 0.05 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-accent/50 border border-border"
            >
              <div className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0',
                i === 0 ? 'bg-amber-400/20 text-amber-400' :
                i === 1 ? 'bg-slate-400/20 text-slate-400' :
                i === 2 ? 'bg-orange-400/20 text-orange-400' :
                'bg-muted text-muted-foreground'
              )}>
                #{i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground truncate">{dept.dept}</div>
                <div className="mt-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${dept.score}%` }}
                    transition={{ duration: 0.8, delay: 0.8 + i * 0.05 }}
                    className="h-full rounded-full"
                    style={{ background: dept.color }}
                  />
                </div>
              </div>
              <div className={cn(
                'text-sm font-bold flex-shrink-0',
                dept.score >= 85 ? 'text-emerald-400' :
                dept.score >= 70 ? 'text-blue-400' : 'text-amber-400'
              )}>
                {dept.score}%
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
