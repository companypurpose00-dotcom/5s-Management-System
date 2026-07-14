'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings, Building2, Bell, Shield, Palette, Users,
  Database, Globe, Save, ChevronRight, Check, Moon, Sun,
  Smartphone, Mail, Monitor, Key, AlertTriangle, RefreshCw
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

const settingsSections = [
  { id: 'company', icon: Building2, label: 'Company Profile' },
  { id: 'notifications', icon: Bell, label: 'Notifications' },
  { id: 'appearance', icon: Palette, label: 'Appearance' },
  { id: 'security', icon: Shield, label: 'Security & Access' },
  { id: 'audit', icon: Settings, label: 'Audit Configuration' },
  { id: 'integrations', icon: Globe, label: 'Integrations' },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('company');
  const [saved, setSaved] = useState(false);
  const { theme, setTheme } = useTheme();

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-screen-xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Configure your audit platform preferences</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Nav */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1"
        >
          <div className="rounded-2xl border border-border bg-card p-2 space-y-1">
            {settingsSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all text-left',
                  activeSection === section.id
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                )}
              >
                <section.icon className="w-4 h-4" />
                {section.label}
                {activeSection === section.id && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Settings Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-3 space-y-4"
        >
          {/* Company Profile */}
          {activeSection === 'company' && (
            <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
              <h2 className="font-display font-semibold text-foreground text-lg">Company Profile</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Company Name', value: '5S ProAudit Corp', placeholder: 'Enter company name' },
                  { label: 'Industry', value: 'Manufacturing', placeholder: 'Enter industry' },
                  { label: 'Company Email', value: 'admin@5sproaudit.com', placeholder: 'Email address' },
                  { label: 'Phone', value: '+91 98765 43210', placeholder: 'Phone number' },
                  { label: 'Website', value: 'www.5sproaudit.com', placeholder: 'Website URL' },
                  { label: 'Country', value: 'India', placeholder: 'Country' },
                ].map((field) => (
                  <div key={field.label}>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">{field.label}</label>
                    <input
                      type="text"
                      defaultValue={field.value}
                      placeholder={field.placeholder}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Company Address</label>
                <textarea
                  rows={3}
                  defaultValue="123 Industrial Area, Phase 2, Mumbai, Maharashtra 400001"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
                />
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeSection === 'notifications' && (
            <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
              <h2 className="font-display font-semibold text-foreground text-lg">Notification Preferences</h2>
              {[
                { icon: Mail, label: 'Email Notifications', desc: 'Receive audit and CAPA alerts via email', channels: ['Audit Due', 'Overdue Alerts', 'CAPA Assignments', 'Approvals', 'Weekly Summary'] },
                { icon: Monitor, label: 'In-App Notifications', desc: 'Real-time notifications within the platform', channels: ['All Alerts', 'Activity Feed', 'Mentions'] },
                { icon: Smartphone, label: 'Push Notifications', desc: 'Mobile push notifications (requires PWA)', channels: ['Critical Issues Only', 'Overdue Reminders'] },
              ].map((group) => (
                <div key={group.label} className="p-4 rounded-xl border border-border">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <group.icon className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium text-foreground">{group.label}</div>
                        <div className="text-xs text-muted-foreground">{group.desc}</div>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-10 h-5 bg-muted peer-focus:ring-2 peer-focus:ring-primary/30 rounded-full peer peer-checked:bg-primary transition-all" />
                      <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-5" />
                    </label>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {group.channels.map((ch) => (
                      <label key={ch} className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                        <input type="checkbox" defaultChecked className="w-3.5 h-3.5 rounded accent-indigo-500" />
                        {ch}
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              <div className="p-4 rounded-xl border border-border">
                <div className="text-sm font-medium text-foreground mb-3">SLA & Escalation Alerts</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: 'CAPA SLA Warning (hours before due)', value: '24' },
                    { label: 'Auto-escalate after (hours overdue)', value: '48' },
                    { label: 'Reminder frequency (hours)', value: '12' },
                    { label: 'Max escalation levels', value: '3' },
                  ].map((f) => (
                    <div key={f.label}>
                      <label className="block text-xs text-muted-foreground mb-1">{f.label}</label>
                      <input type="number" defaultValue={f.value} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Appearance */}
          {activeSection === 'appearance' && (
            <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
              <h2 className="font-display font-semibold text-foreground text-lg">Appearance</h2>
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">Theme</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'dark', label: 'Dark', icon: Moon, desc: 'Dark mode (default)' },
                    { value: 'light', label: 'Light', icon: Sun, desc: 'Light mode' },
                    { value: 'system', label: 'System', icon: Monitor, desc: 'Follow OS setting' },
                  ].map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setTheme(t.value)}
                      className={cn(
                        'flex flex-col items-center gap-2 p-4 rounded-xl border transition-all',
                        theme === t.value ? 'border-primary bg-primary/5' : 'border-border hover:bg-accent'
                      )}
                    >
                      <t.icon className={cn('w-5 h-5', theme === t.value ? 'text-primary' : 'text-muted-foreground')} />
                      <span className="text-sm font-medium">{t.label}</span>
                      <span className="text-xs text-muted-foreground">{t.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">Accent Color</label>
                <div className="flex gap-3">
                  {['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'].map((color) => (
                    <button
                      key={color}
                      className="w-8 h-8 rounded-full ring-2 ring-offset-2 ring-offset-background transition-all hover:scale-110"
                      style={{ background: color, ringColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Security */}
          {activeSection === 'security' && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-border bg-card p-6">
                <h2 className="font-display font-semibold text-foreground text-lg mb-4">Security Settings</h2>
                <div className="space-y-4">
                  {[
                    { label: 'Two-Factor Authentication', desc: 'Add an extra layer of security to your account', enabled: false },
                    { label: 'Session Timeout', desc: 'Auto logout after 8 hours of inactivity', enabled: true },
                    { label: 'Activity Logging', desc: 'Log all user actions for audit trail', enabled: true },
                    { label: 'IP Restriction', desc: 'Restrict access to whitelisted IP ranges', enabled: false },
                    { label: 'SSO / SAML', desc: 'Enable Single Sign-On via SAML 2.0', enabled: false },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/30 transition-colors">
                      <div>
                        <div className="text-sm font-medium text-foreground">{item.label}</div>
                        <div className="text-xs text-muted-foreground">{item.desc}</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked={item.enabled} className="sr-only peer" />
                        <div className="w-10 h-5 bg-muted rounded-full peer peer-checked:bg-primary transition-all" />
                        <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-5" />
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <h3 className="font-semibold text-red-400">Danger Zone</h3>
                </div>
                <p className="text-xs text-muted-foreground mb-4">These actions are irreversible. Please proceed with caution.</p>
                <button className="px-4 py-2 rounded-lg border border-red-500/30 text-red-400 text-sm hover:bg-red-500/10 transition-colors">
                  Reset All Settings to Default
                </button>
              </div>
            </div>
          )}

          {/* Audit Config */}
          {activeSection === 'audit' && (
            <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
              <h2 className="font-display font-semibold text-foreground text-lg">Audit Configuration</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Minimum passing score (%)', value: '60', type: 'number' },
                  { label: 'Default audit frequency (days)', value: '30', type: 'number' },
                  { label: 'Photo required threshold (%)', value: '75', type: 'number' },
                  { label: 'Max photos per question', value: '5', type: 'number' },
                  { label: 'Excellent grade threshold (%)', value: '90', type: 'number' },
                  { label: 'Good grade threshold (%)', value: '75', type: 'number' },
                  { label: 'Average grade threshold (%)', value: '60', type: 'number' },
                  { label: 'Poor grade threshold (%)', value: '40', type: 'number' },
                ].map((f) => (
                  <div key={f.label}>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">{f.label}</label>
                    <input
                      type={f.type}
                      defaultValue={f.value}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Allow offline audit completion', enabled: true },
                  { label: 'Require reviewer approval', enabled: true },
                  { label: 'Auto-create CAPA for failed items', enabled: true },
                  { label: 'Enable surprise audits', enabled: true },
                  { label: 'Allow draft saving', enabled: true },
                  { label: 'Require digital signature', enabled: false },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <span className="text-sm text-foreground">{item.label}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={item.enabled} className="sr-only peer" />
                      <div className="w-10 h-5 bg-muted rounded-full peer peer-checked:bg-primary transition-all" />
                      <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-5" />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Integrations */}
          {activeSection === 'integrations' && (
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
              <h2 className="font-display font-semibold text-foreground text-lg">Integrations</h2>
              {[
                { name: 'Supabase', status: 'connected', color: 'emerald', desc: 'Database, Auth & Storage' },
                { name: 'Netlify', status: 'connected', color: 'emerald', desc: 'Deployment & CDN' },
                { name: 'Gemini AI', status: 'not_connected', color: 'amber', desc: 'AI insights & recommendations' },
                { name: 'Slack', status: 'not_connected', color: 'slate', desc: 'Slack notifications' },
                { name: 'Microsoft Teams', status: 'not_connected', color: 'slate', desc: 'Teams notifications' },
                { name: 'SMTP Email', status: 'not_connected', color: 'slate', desc: 'Custom email delivery' },
              ].map((integration) => (
                <div key={integration.name} className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-accent/50 transition-colors">
                  <div>
                    <div className="text-sm font-semibold text-foreground">{integration.name}</div>
                    <div className="text-xs text-muted-foreground">{integration.desc}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      'text-xs px-2.5 py-1 rounded-full font-medium',
                      integration.status === 'connected'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-muted text-muted-foreground'
                    )}>
                      {integration.status === 'connected' ? '● Connected' : '○ Not connected'}
                    </span>
                    <button className="px-3 py-1.5 rounded-lg border border-border text-xs hover:bg-accent transition-colors">
                      {integration.status === 'connected' ? 'Configure' : 'Connect'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end">
            <motion.button
              onClick={handleSave}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={cn(
                'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all',
                saved
                  ? 'bg-emerald-500 text-white'
                  : 'bg-primary text-primary-foreground shadow-glow-sm hover:shadow-glow-md'
              )}
            >
              {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {saved ? 'Saved!' : 'Save Changes'}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
