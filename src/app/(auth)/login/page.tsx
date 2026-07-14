'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, Shield, Loader2, AlertCircle, CheckCircle2, BarChart3, ClipboardCheck, TrendingUp } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

const features = [
  { icon: ClipboardCheck, label: 'Smart 5S Audits', desc: 'Dynamic checklists with photo evidence' },
  { icon: BarChart3, label: 'Executive Analytics', desc: 'Real-time compliance dashboards' },
  { icon: TrendingUp, label: 'CAPA Management', desc: 'End-to-end corrective action workflows' },
];

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState<number | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (lockoutTime && Date.now() < lockoutTime) {
      setError(`Too many attempts. Try again in ${Math.ceil((lockoutTime - Date.now()) / 1000)}s.`);
      return;
    }
    
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError('');

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      if (newAttempts >= 5) {
        setLockoutTime(Date.now() + 30000); // 30s lockout
        setError('Too many failed attempts. Locked out for 30s.');
      } else {
        setError(authError.message || 'Invalid credentials. Please try again.');
      }
      setLoading(false);
      return;
    }

    setSuccess('Login successful! Redirecting...');
    setTimeout(() => {
      router.refresh();
      router.push('/dashboard');
    }, 800);
  };

  const handleDemoLogin = async () => {
    if (process.env.NEXT_PUBLIC_ENABLE_DEMO !== 'true') {
      setError('Demo login is disabled in this environment.');
      return;
    }

    if (lockoutTime && Date.now() < lockoutTime) {
      setError(`Too many attempts. Try again in ${Math.ceil((lockoutTime - Date.now()) / 1000)}s.`);
      return;
    }

    setEmail('demo@5sproaudit.com');
    setPassword('Demo@12345');
    setLoading(true);
    setError('');

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: 'demo@5sproaudit.com',
      password: 'Demo@12345',
    });

    if (authError) {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      if (newAttempts >= 5) {
        setLockoutTime(Date.now() + 30000); // 30s lockout
        setError('Too many failed attempts. Locked out for 30s.');
      } else {
        setError('Demo account not yet configured. Please set up Supabase first.');
      }
      setLoading(false);
      return;
    }

    setSuccess('Login successful! Redirecting...');
    setTimeout(() => {
      router.refresh();
      router.push('/dashboard');
    }, 800);
  };

  return (
    <div className="min-h-screen flex overflow-hidden bg-slate-950">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-[55%] relative flex-col justify-between p-12 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950" />
        <div className="absolute inset-0 bg-gradient-mesh opacity-60" />

        {/* Floating orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.2, 1], x: [0, 20, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #10b981 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.3, 1], x: [0, -15, 0], y: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />

        <div className="relative z-10">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-16"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-glow-sm">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-white font-display font-bold text-xl leading-none">5S ProAudit</div>
              <div className="text-indigo-400 text-xs font-medium tracking-wider">ENTERPRISE PLATFORM</div>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h1 className="text-5xl font-display font-bold text-white leading-tight mb-4">
              Audit Smarter.
              <br />
              <span className="gradient-text">Achieve Excellence.</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed max-w-md">
              Enterprise-grade 5S audit management with real-time analytics, AI insights, and comprehensive compliance tracking.
            </p>
          </motion.div>
        </div>

        {/* Feature cards */}
        <div className="relative z-10 space-y-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
              className="flex items-center gap-4 p-4 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                <feature.icon className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <div className="text-white font-semibold text-sm">{feature.label}</div>
                <div className="text-slate-400 text-xs">{feature.desc}</div>
              </div>
            </motion.div>
          ))}

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10"
          >
            {[
              { value: '99.9%', label: 'Uptime SLA' },
              { value: '50K+', label: 'Audits Done' },
              { value: '200+', label: 'Departments' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-white font-display">{stat.value}</div>
                <div className="text-slate-500 text-xs">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative">
        <div className="absolute inset-0 bg-slate-950" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-display font-bold text-lg">5S ProAudit</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-display font-bold text-white mb-2">Welcome back</h2>
            <p className="text-slate-400 text-sm">Sign in to your audit management console</p>
          </div>

          {/* Error / Success alerts */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 mb-6"
              >
                <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                <p className="text-red-400 text-sm">{error}</p>
              </motion.div>
            )}
            {success && (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-start gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 mb-6"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <p className="text-emerald-400 text-sm">{success}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className={cn(
                    'w-full pl-10 pr-4 py-3 rounded-xl text-sm',
                    'bg-white/5 border border-white/10 text-white placeholder:text-slate-500',
                    'focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50',
                    'transition-all duration-200'
                  )}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-slate-300">Password</label>
                <Link href="/forgot-password" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={cn(
                    'w-full pl-10 pr-12 py-3 rounded-xl text-sm',
                    'bg-white/5 border border-white/10 text-white placeholder:text-slate-500',
                    'focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50',
                    'transition-all duration-200'
                  )}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={cn(
                'w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200',
                'bg-gradient-to-r from-indigo-600 to-purple-600 text-white',
                'hover:from-indigo-500 hover:to-purple-500 shadow-glow-sm hover:shadow-glow-md',
                'disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2'
              )}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </motion.button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-slate-950 text-slate-500">or</span>
              </div>
            </div>

            {/* Demo Login */}
            <motion.button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={cn(
                'w-full py-3 rounded-xl font-medium text-sm transition-all duration-200',
                'bg-white/5 border border-white/10 text-slate-300',
                'hover:bg-white/10 hover:border-white/20',
                'disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2'
              )}
            >
              <Shield className="w-4 h-4 text-indigo-400" />
              Try Demo Account
            </motion.button>
          </form>

          {/* Footer */}
          <p className="text-center text-slate-600 text-xs mt-8">
            © 2025 5S ProAudit Enterprise Platform. All rights reserved.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
