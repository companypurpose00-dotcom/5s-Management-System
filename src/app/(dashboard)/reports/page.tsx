'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3, Download, FileText, TrendingUp, Shield,
  AlertTriangle, Users, Building2, Calendar, Filter,
  RefreshCw, Printer, FileSpreadsheet, Presentation
} from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis, Cell
} from 'recharts';
import { cn } from '@/lib/utils';

const monthlyData = [
  { month: 'Jan', compliance: 72, audits: 18, closed_capa: 8, open_capa: 12 },
  { month: 'Feb', compliance: 68, audits: 22, closed_capa: 11, open_capa: 15 },
  { month: 'Mar', compliance: 75, audits: 25, closed_capa: 16, open_capa: 10 },
  { month: 'Apr', compliance: 79, audits: 20, closed_capa: 14, open_capa: 8 },
  { month: 'May', compliance: 83, audits: 28, closed_capa: 22, open_capa: 6 },
  { month: 'Jun', compliance: 81, audits: 24, closed_capa: 18, open_capa: 9 },
  { month: 'Jul', compliance: 86, audits: 30, closed_capa: 25, open_capa: 5 },
  { month: 'Aug', compliance: 88, audits: 32, closed_capa: 28, open_capa: 4 },
  { month: 'Sep', compliance: 85, audits: 27, closed_capa: 22, open_capa: 7 },
  { month: 'Oct', compliance: 91, audits: 35, closed_capa: 32, open_capa: 3 },
  { month: 'Nov', compliance: 89, audits: 31, closed_capa: 27, open_capa: 5 },
  { month: 'Dec', compliance: 93, audits: 38, closed_capa: 36, open_capa: 2 },
];

const deptHeatmap = [
  { dept: 'Production', Jan: 72, Feb: 68, Mar: 76, Apr: 81, May: 87, Jun: 89, Jul: 91, Aug: 93, Sep: 90, Oct: 93, Nov: 92, Dec: 93 },
  { dept: 'Warehouse', Jan: 65, Feb: 62, Mar: 68, Apr: 71, May: 75, Jun: 73, Jul: 78, Aug: 80, Sep: 77, Oct: 79, Nov: 78, Dec: 78 },
  { dept: 'QA', Jan: 80, Feb: 78, Mar: 82, Apr: 85, May: 88, Jun: 87, Jul: 90, Aug: 92, Sep: 91, Oct: 93, Nov: 92, Dec: 93 },
  { dept: 'Engineering', Jan: 55, Feb: 52, Mar: 58, Apr: 61, May: 64, Jun: 62, Jul: 65, Aug: 67, Sep: 63, Oct: 62, Nov: 61, Dec: 62 },
  { dept: 'HR', Jan: 68, Feb: 70, Mar: 72, Apr: 74, May: 76, Jun: 75, Jul: 77, Aug: 78, Sep: 76, Oct: 76, Nov: 76, Dec: 76 },
];

const auditorPerformance = [
  { name: 'Ravi Kumar', audits: 28, avg_score: 91, on_time: 100, capa_raised: 12 },
  { name: 'Divya Rao', audits: 24, avg_score: 89, on_time: 96, capa_raised: 8 },
  { name: 'Priya Sharma', audits: 20, avg_score: 82, on_time: 90, capa_raised: 15 },
  { name: 'Arjun Menon', audits: 18, avg_score: 75, on_time: 83, capa_raised: 22 },
  { name: 'Meena K.', audits: 15, avg_score: 79, on_time: 87, capa_raised: 10 },
];

const fiveSBreakdown = [
  { category: 'Sort', score: 88, prev: 82, target: 90 },
  { category: 'Set in Order', score: 76, prev: 74, target: 85 },
  { category: 'Shine', score: 92, prev: 88, target: 90 },
  { category: 'Standardize', score: 81, prev: 79, target: 88 },
  { category: 'Sustain', score: 74, prev: 78, target: 85 },
];

const reportTypes = [
  { id: 'monthly', icon: Calendar, label: 'Monthly Compliance Report', desc: 'Full compliance overview with trend analysis', tag: 'Popular' },
  { id: 'dept', icon: Building2, label: 'Department Audit Report', desc: 'Per-department audit scores and CAPA status', tag: null },
  { id: 'capa', icon: AlertTriangle, label: 'CAPA Status Report', desc: 'Open/closed corrective actions summary', tag: null },
  { id: 'auditor', icon: Users, label: 'Auditor Performance', desc: 'Auditor-wise performance and completion rates', tag: null },
  { id: 'executive', icon: Shield, label: 'Executive Summary', desc: 'High-level KPIs for management review', tag: 'New' },
  { id: 'risk', icon: TrendingUp, label: 'Risk Analysis Report', desc: 'Departments at risk with predictive scoring', tag: null },
];

function getHeatmapColor(value: number) {
  if (value >= 88) return 'bg-emerald-500 text-emerald-900';
  if (value >= 78) return 'bg-blue-500 text-blue-900';
  if (value >= 68) return 'bg-amber-400 text-amber-900';
  if (value >= 58) return 'bg-orange-500 text-orange-900';
  return 'bg-red-500 text-red-900';
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function ReportsPage() {
  const [activeReport, setActiveReport] = useState('monthly');
  const [dateRange, setDateRange] = useState('2025');

  return (
    <div className="space-y-6 max-w-screen-2xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Generate and export enterprise audit reports</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="2025">Year 2025</option>
            <option value="2024">Year 2024</option>
            <option value="q2-2025">Q2 2025</option>
            <option value="q1-2025">Q1 2025</option>
          </select>
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium shadow-glow-sm hover:shadow-glow-md transition-all">
            <Download className="w-3.5 h-3.5" />
            Export All
          </button>
        </div>
      </motion.div>

      {/* Report Type Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {reportTypes.map((report, i) => (
          <motion.button
            key={report.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => setActiveReport(report.id)}
            className={cn(
              'relative flex flex-col items-start p-4 rounded-xl border transition-all duration-200 text-left',
              activeReport === report.id
                ? 'border-primary bg-primary/5 shadow-glow-sm'
                : 'border-border bg-card hover:bg-accent/50'
            )}
          >
            {report.tag && (
              <span className="absolute top-2 right-2 text-xs px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-medium">
                {report.tag}
              </span>
            )}
            <report.icon className={cn('w-5 h-5 mb-3', activeReport === report.id ? 'text-primary' : 'text-muted-foreground')} />
            <div className="text-xs font-semibold text-foreground leading-tight">{report.label}</div>
          </motion.button>
        ))}
      </div>

      {/* Export Actions */}
      <div className="flex items-center gap-2 p-4 rounded-xl border border-border bg-card">
        <span className="text-sm font-medium text-foreground mr-2">Export as:</span>
        {[
          { icon: FileText, label: 'PDF', color: 'text-red-400' },
          { icon: FileSpreadsheet, label: 'Excel', color: 'text-emerald-400' },
          { icon: FileText, label: 'CSV', color: 'text-blue-400' },
          { icon: Presentation, label: 'PPT', color: 'text-orange-400' },
        ].map((fmt) => (
          <button
            key={fmt.label}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border hover:bg-accent text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <fmt.icon className={cn('w-3.5 h-3.5', fmt.color)} />
            {fmt.label}
          </button>
        ))}
        <button className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border hover:bg-accent text-sm text-muted-foreground transition-colors">
          <Printer className="w-3.5 h-3.5" />
          Print
        </button>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Compliance Trend */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="chart-container">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-display font-semibold text-foreground">Annual Compliance Trend</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Monthly average compliance %</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="repGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: 12 }} />
              <Area type="monotone" dataKey="compliance" stroke="#6366f1" strokeWidth={2.5} fill="url(#repGrad)" dot={{ fill: '#6366f1', r: 4 }} activeDot={{ r: 6 }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* CAPA Trend */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="chart-container">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-display font-semibold text-foreground">CAPA Resolution Trend</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Open vs closed corrective actions</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData} barSize={16} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="closed_capa" name="Closed" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="open_capa" name="Open" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Heatmap */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="chart-container">
        <div className="mb-5">
          <h3 className="font-display font-semibold text-foreground">Department × Month Compliance Heatmap</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Color coded compliance scores across departments and months</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="text-left py-2 pr-4 text-muted-foreground font-medium w-32">Department</th>
                {months.map(m => (
                  <th key={m} className="text-center py-2 px-1 text-muted-foreground font-medium">{m}</th>
                ))}
                <th className="text-center py-2 px-2 text-muted-foreground font-medium">Avg</th>
              </tr>
            </thead>
            <tbody>
              {deptHeatmap.map((row, i) => {
                const values = months.map(m => row[m as keyof typeof row] as number);
                const avg = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
                return (
                  <tr key={row.dept}>
                    <td className="py-1.5 pr-4 font-medium text-foreground whitespace-nowrap">{row.dept}</td>
                    {months.map(m => {
                      const val = row[m as keyof typeof row] as number;
                      return (
                        <td key={m} className="px-1 py-1">
                          <div className={cn('rounded-lg text-center py-1.5 font-bold text-xs', getHeatmapColor(val))}>
                            {val}
                          </div>
                        </td>
                      );
                    })}
                    <td className="px-2 py-1">
                      <div className={cn('rounded-lg text-center py-1.5 font-bold text-xs border-2', getHeatmapColor(avg))}>
                        {avg}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
            <span className="text-xs text-muted-foreground">Legend:</span>
            {[
              { color: 'bg-emerald-500', label: '≥88% Excellent' },
              { color: 'bg-blue-500', label: '78-87% Good' },
              { color: 'bg-amber-400', label: '68-77% Average' },
              { color: 'bg-orange-500', label: '58-67% Poor' },
              { color: 'bg-red-500', label: '<58% Critical' },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className={cn('w-3 h-3 rounded', l.color)} />
                <span className="text-xs text-muted-foreground">{l.label}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Auditor Performance Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="p-5 border-b border-border">
          <h3 className="font-display font-semibold text-foreground">Auditor Performance</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Individual auditor metrics and completion rates</p>
        </div>
        <table className="data-table">
          <thead>
            <tr className="bg-muted/30">
              <th>Auditor</th>
              <th>Audits Done</th>
              <th>Avg Score</th>
              <th>On-Time %</th>
              <th>CAPAs Raised</th>
              <th>Performance</th>
            </tr>
          </thead>
          <tbody>
            {auditorPerformance.map((a, i) => (
              <tr key={a.name} className="group">
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                      {a.name.charAt(0)}
                    </div>
                    <span className="font-medium text-sm">{a.name}</span>
                  </div>
                </td>
                <td><span className="text-sm font-semibold">{a.audits}</span></td>
                <td>
                  <span className={cn('text-sm font-bold', a.avg_score >= 85 ? 'text-emerald-400' : a.avg_score >= 70 ? 'text-blue-400' : 'text-amber-400')}>
                    {a.avg_score}%
                  </span>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${a.on_time}%` }} />
                    </div>
                    <span className="text-sm text-muted-foreground">{a.on_time}%</span>
                  </div>
                </td>
                <td><span className="text-sm text-muted-foreground">{a.capa_raised}</span></td>
                <td>
                  <div className="flex gap-1">
                    {['★', '★', '★', '★', '★'].map((star, si) => (
                      <span key={si} className={si < Math.round(a.avg_score / 20) ? 'text-amber-400' : 'text-muted-foreground/30'}>★</span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
