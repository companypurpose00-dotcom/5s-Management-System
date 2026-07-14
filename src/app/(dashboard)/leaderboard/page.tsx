'use client';

import { motion } from 'framer-motion';
import { Award, TrendingUp, TrendingDown, Minus, Crown, Medal, Star, ChevronRight, Flame } from 'lucide-react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';

const leaderboardData = [
  { rank: 1, dept: 'Quality Assurance', code: 'QA', score: 93, prev_rank: 1, trend: 0, change: 0, audits: 30, grade: 'excellent', color: '#10b981', icon: '🔬', streak: 5 },
  { rank: 2, dept: 'Production', code: 'PROD', score: 87, prev_rank: 3, trend: 1, change: 2.1, audits: 24, grade: 'excellent', color: '#6366f1', icon: '🏭', streak: 3 },
  { rank: 3, dept: 'IT Department', code: 'IT', score: 88, prev_rank: 2, trend: -1, change: -1.2, audits: 6, grade: 'excellent', color: '#0ea5e9', icon: '💻', streak: 2 },
  { rank: 4, dept: 'Warehouse', code: 'WH', score: 78, prev_rank: 4, trend: 0, change: -1.5, audits: 18, grade: 'good', color: '#10b981', icon: '🏪', streak: 0 },
  { rank: 5, dept: 'HR & Admin', code: 'HR', score: 76, prev_rank: 6, trend: 1, change: 1.0, audits: 16, grade: 'good', color: '#ec4899', icon: '👥', streak: 1 },
  { rank: 6, dept: 'Finance', code: 'FIN', score: 71, prev_rank: 5, trend: -1, change: 0.5, audits: 10, grade: 'good', color: '#8b5cf6', icon: '💰', streak: 0 },
  { rank: 7, dept: 'Engineering', code: 'ENG', score: 62, prev_rank: 7, trend: 0, change: -3.2, audits: 12, grade: 'average', color: '#3b82f6', icon: '⚙️', streak: 0 },
  { rank: 8, dept: 'Logistics', code: 'LOG', score: 68, prev_rank: 8, trend: 0, change: -2.0, audits: 15, grade: 'average', color: '#14b8a6', icon: '🚛', streak: 0 },
  { rank: 9, dept: 'Sales', code: 'SALES', score: 65, prev_rank: 9, trend: 0, change: -4.1, audits: 8, grade: 'average', color: '#f97316', icon: '📈', streak: 0 },
  { rank: 10, dept: 'Kitchen', code: 'KIT', score: 57, prev_rank: 10, trend: 0, change: -1.0, audits: 9, grade: 'poor', color: '#ef4444', icon: '🍳', streak: 0 },
];

const top3Radar = [
  { category: 'Sort', QA: 95, Production: 89, IT: 91 },
  { category: 'Set in Order', QA: 92, Production: 85, IT: 90 },
  { category: 'Shine', QA: 96, Production: 92, IT: 89 },
  { category: 'Standardize', QA: 91, Production: 87, IT: 86 },
  { category: 'Sustain', QA: 90, Production: 84, IT: 83 },
];

const podiumColors = ['text-amber-400', 'text-slate-400', 'text-orange-400'];
const podiumBg = ['bg-amber-400/10 border-amber-400/20', 'bg-slate-400/10 border-slate-400/20', 'bg-orange-400/10 border-orange-400/20'];

export default function LeaderboardPage() {
  return (
    <div className="space-y-6 max-w-screen-xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold text-foreground">Department Leaderboard</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Rankings based on 5S compliance scores this month</p>
      </motion.div>

      {/* Podium - Top 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border border-border bg-card p-6">
          <h3 className="font-display font-semibold text-foreground mb-6 flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-400" />
            Top Performers Podium
          </h3>
          <div className="flex items-end justify-center gap-4 h-48">
            {/* 2nd place */}
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center"
            >
              <div className="text-2xl mb-2">{leaderboardData[1].icon}</div>
              <div className="text-xs font-semibold text-foreground text-center mb-2">{leaderboardData[1].dept}</div>
              <div className="text-lg font-bold text-slate-400">{leaderboardData[1].score}%</div>
              <div className={cn('w-24 flex items-center justify-center rounded-t-xl border text-slate-400 font-bold text-2xl', podiumBg[1])} style={{ height: '80px' }}>
                <Medal className="w-6 h-6" />
              </div>
              <div className={cn('w-24 text-center py-1.5 rounded-b font-bold text-sm', 'bg-slate-400/20 text-slate-400')}>2nd</div>
            </motion.div>

            {/* 1st place */}
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center"
            >
              <div className="text-3xl mb-2">{leaderboardData[0].icon}</div>
              <div className="text-xs font-semibold text-foreground text-center mb-2">{leaderboardData[0].dept}</div>
              <div className="text-xl font-bold text-amber-400">{leaderboardData[0].score}%</div>
              <div className={cn('w-28 flex items-center justify-center rounded-t-xl border text-amber-400 font-bold text-2xl', podiumBg[0])} style={{ height: '120px' }}>
                <Crown className="w-8 h-8" />
              </div>
              <div className={cn('w-28 text-center py-1.5 rounded-b font-bold text-sm', 'bg-amber-400/20 text-amber-400')}>1st 🏆</div>
            </motion.div>

            {/* 3rd place */}
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              transition={{ delay: 0.4 }}
              className="flex flex-col items-center"
            >
              <div className="text-2xl mb-2">{leaderboardData[2].icon}</div>
              <div className="text-xs font-semibold text-foreground text-center mb-2">{leaderboardData[2].dept}</div>
              <div className="text-lg font-bold text-orange-400">{leaderboardData[2].score}%</div>
              <div className={cn('w-24 flex items-center justify-center rounded-t-xl border text-orange-400 font-bold text-2xl', podiumBg[2])} style={{ height: '60px' }}>
                <Award className="w-5 h-5" />
              </div>
              <div className={cn('w-24 text-center py-1.5 rounded-b font-bold text-sm', 'bg-orange-400/20 text-orange-400')}>3rd</div>
            </motion.div>
          </div>
        </motion.div>

        {/* Top 3 Radar Comparison */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="chart-container">
          <h3 className="font-display font-semibold text-foreground mb-1">Top 3 — 5S Comparison</h3>
          <p className="text-xs text-muted-foreground mb-4">Category-wise radar for top performing departments</p>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={top3Radar}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="category" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
              <Radar name="QA" dataKey="QA" stroke="#10b981" fill="#10b981" fillOpacity={0.15} strokeWidth={2} />
              <Radar name="Production" dataKey="Production" stroke="#6366f1" fill="#6366f1" fillOpacity={0.1} strokeWidth={2} />
              <Radar name="IT" dataKey="IT" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.1} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-4 text-xs">
            {[{ label: 'QA', color: '#10b981' }, { label: 'Production', color: '#6366f1' }, { label: 'IT', color: '#0ea5e9' }].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 rounded" style={{ background: l.color }} />
                <span className="text-muted-foreground">{l.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Full Rankings Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="p-5 border-b border-border">
          <h3 className="font-display font-semibold text-foreground">Full Department Rankings</h3>
        </div>
        <div className="divide-y divide-border">
          {leaderboardData.map((dept, i) => (
            <motion.div
              key={dept.rank}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              className="flex items-center gap-4 px-5 py-4 hover:bg-accent/50 transition-colors group"
            >
              {/* Rank */}
              <div className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0',
                dept.rank === 1 ? 'bg-amber-400/20 text-amber-400' :
                dept.rank === 2 ? 'bg-slate-400/20 text-slate-400' :
                dept.rank === 3 ? 'bg-orange-400/20 text-orange-400' :
                'bg-muted text-muted-foreground'
              )}>
                {dept.rank <= 3 ? (dept.rank === 1 ? '🥇' : dept.rank === 2 ? '🥈' : '🥉') : `#${dept.rank}`}
              </div>

              {/* Dept info */}
              <div className="flex items-center gap-3 flex-1">
                <div className="text-xl">{dept.icon}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-foreground">{dept.dept}</span>
                    {dept.streak > 0 && (
                      <span className="flex items-center gap-0.5 text-xs text-orange-400">
                        <Flame className="w-3 h-3" />
                        {dept.streak}mo streak
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">{dept.audits} audits this year</span>
                </div>
              </div>

              {/* Trend */}
              <div className="hidden sm:flex items-center gap-1 text-xs w-20 justify-center">
                {dept.trend > 0 ? (
                  <span className="flex items-center gap-1 text-emerald-400">
                    <TrendingUp className="w-3 h-3" />↑{dept.rank - dept.prev_rank}
                  </span>
                ) : dept.trend < 0 ? (
                  <span className="flex items-center gap-1 text-red-400">
                    <TrendingDown className="w-3 h-3" />↓{dept.prev_rank - dept.rank}
                  </span>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </div>

              {/* Score Bar */}
              <div className="hidden md:flex items-center gap-3 flex-1 max-w-[200px]">
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${dept.score}%` }}
                    transition={{ duration: 0.8, delay: 0.5 + i * 0.05 }}
                    className="h-full rounded-full"
                    style={{ background: dept.color }}
                  />
                </div>
              </div>

              {/* Score */}
              <div className="text-right flex-shrink-0 w-20">
                <div className={cn(
                  'text-lg font-bold font-display',
                  dept.score >= 85 ? 'text-emerald-400' :
                  dept.score >= 70 ? 'text-blue-400' :
                  dept.score >= 60 ? 'text-amber-400' : 'text-red-400'
                )}>
                  {dept.score}%
                </div>
                <div className={cn(
                  'text-xs capitalize',
                  dept.grade === 'excellent' ? 'text-emerald-400' :
                  dept.grade === 'good' ? 'text-blue-400' :
                  dept.grade === 'average' ? 'text-amber-400' : 'text-red-400'
                )}>
                  {dept.grade}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
