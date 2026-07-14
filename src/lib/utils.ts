import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow, isBefore } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date | null | undefined, fmt = 'MMM d, yyyy') {
  if (!date) return '—';
  return format(new Date(date), fmt);
}

export function formatRelativeTime(date: string | Date | null | undefined) {
  if (!date) return '—';
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function formatDateTime(date: string | Date | null | undefined) {
  if (!date) return '—';
  return format(new Date(date), 'MMM d, yyyy · h:mm a');
}

export function getGradeColor(grade: string | null | undefined) {
  switch (grade) {
    case 'excellent': return 'text-emerald-400';
    case 'good': return 'text-blue-400';
    case 'average': return 'text-amber-400';
    case 'poor': return 'text-orange-400';
    case 'critical': return 'text-red-400';
    default: return 'text-muted-foreground';
  }
}

export function getGradeBg(grade: string | null | undefined) {
  switch (grade) {
    case 'excellent': return 'badge-excellent';
    case 'good': return 'badge-good';
    case 'average': return 'badge-average';
    case 'poor': return 'badge-poor';
    case 'critical': return 'badge-critical';
    default: return 'bg-muted text-muted-foreground';
  }
}

export function getComplianceColor(pct: number | null | undefined) {
  if (!pct) return 'text-muted-foreground';
  if (pct >= 90) return 'text-emerald-400';
  if (pct >= 75) return 'text-blue-400';
  if (pct >= 60) return 'text-amber-400';
  if (pct >= 40) return 'text-orange-400';
  return 'text-red-400';
}

export function gradeFromPercentage(pct: number): string {
  if (pct >= 90) return 'excellent';
  if (pct >= 75) return 'good';
  if (pct >= 60) return 'average';
  if (pct >= 40) return 'poor';
  return 'critical';
}

export function getStatusColor(status: string) {
  const map: Record<string, string> = {
    scheduled: 'status-scheduled',
    in_progress: 'status-in_progress',
    completed: 'status-completed',
    overdue: 'status-overdue',
    cancelled: 'status-cancelled',
    draft: 'status-draft',
    open: 'capa-open',
    pending_review: 'capa-pending_review',
    approved: 'capa-approved',
    closed: 'capa-closed',
  };
  return map[status] || 'bg-muted text-muted-foreground';
}

export function getPriorityColor(priority: string) {
  switch (priority) {
    case 'critical': return 'bg-red-500/10 text-red-400 border border-red-500/20';
    case 'high': return 'bg-orange-500/10 text-orange-400 border border-orange-500/20';
    case 'medium': return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
    case 'low': return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
    default: return 'bg-muted text-muted-foreground';
  }
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function isOverdue(dueDate: string | null | undefined) {
  if (!dueDate) return false;
  return isBefore(new Date(dueDate), new Date());
}

export function calcCompliancePercentage(totalScore: number, maxScore: number) {
  if (!maxScore) return 0;
  return Math.round((totalScore / maxScore) * 100);
}

export function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
  return arr.reduce((groups, item) => {
    const groupKey = String(item[key]);
    if (!groups[groupKey]) groups[groupKey] = [];
    groups[groupKey].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

export function fiveSCategoryLabel(cat: string) {
  const labels: Record<string, string> = {
    sort: 'Sort (Seiri)',
    set_in_order: 'Set in Order (Seiton)',
    shine: 'Shine (Seiso)',
    standardize: 'Standardize (Seiketsu)',
    sustain: 'Sustain (Shitsuke)',
  };
  return labels[cat] || cat;
}

export function roleLabel(role: string) {
  const labels: Record<string, string> = {
    super_admin: 'Super Admin',
    corporate_admin: 'Corporate Admin',
    area_manager: 'Area Manager',
    dept_manager: 'Dept. Manager',
    auditor: 'Auditor',
    staff: 'Staff',
    viewer: 'Viewer',
  };
  return labels[role] || role;
}

export function truncate(str: string, maxLen: number) {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen) + '...';
}
