export type UserRole = 'super_admin' | 'corporate_admin' | 'area_manager' | 'dept_manager' | 'auditor' | 'staff' | 'viewer';
export type AuditStatus = 'scheduled' | 'in_progress' | 'completed' | 'overdue' | 'cancelled' | 'draft';
export type AuditType = 'routine' | 'surprise' | 'follow_up' | 'annual' | 'quarterly' | 'monthly';
export type CapaStatus = 'open' | 'in_progress' | 'pending_review' | 'approved' | 'closed' | 'overdue';
export type CapaPriority = 'low' | 'medium' | 'high' | 'critical';
export type ScoreGrade = 'excellent' | 'good' | 'average' | 'poor' | 'critical';
export type NotificationType = 'audit_due' | 'audit_overdue' | 'capa_assigned' | 'capa_overdue' | 'capa_approved' | 'escalation' | 'system' | 'achievement';
export type FiveSCategory = 'sort' | 'set_in_order' | 'shine' | 'standardize' | 'sustain';

export interface Company {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  industry?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  settings: Record<string, unknown>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  company_id?: string;
  employee_id?: string;
  full_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  role: UserRole;
  department_id?: string;
  job_title?: string;
  is_active: boolean;
  last_login?: string;
  notification_preferences: {
    email: boolean;
    in_app: boolean;
    push: boolean;
  };
  created_at: string;
  updated_at: string;
  // Relations
  department?: Department;
  company?: Company;
}

export interface Department {
  id: string;
  company_id: string;
  parent_id?: string;
  name: string;
  code?: string;
  description?: string;
  category?: string;
  head_id?: string;
  location?: string;
  floor?: string;
  area_sqft?: number;
  employee_count: number;
  is_active: boolean;
  color: string;
  icon: string;
  created_at: string;
  updated_at: string;
  // Relations
  head?: Profile;
  children?: Department[];
  parent?: Department;
}

export interface Branch {
  id: string;
  company_id: string;
  name: string;
  code?: string;
  address?: string;
  city?: string;
  state?: string;
  country: string;
  phone?: string;
  manager_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  manager?: Profile;
}

export interface AuditTemplate {
  id: string;
  company_id: string;
  name: string;
  description?: string;
  department_id?: string;
  category?: string;
  is_default: boolean;
  is_active: boolean;
  version: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
  questions?: AuditQuestion[];
}

export interface AuditQuestion {
  id: string;
  template_id: string;
  five_s_category: FiveSCategory;
  question_text: string;
  description?: string;
  max_score: number;
  weight: number;
  is_mandatory: boolean;
  requires_photo: boolean;
  requires_comment: boolean;
  order_index: number;
  is_active: boolean;
  created_at: string;
}

export interface Audit {
  id: string;
  company_id: string;
  branch_id?: string;
  department_id: string;
  template_id?: string;
  auditor_id: string;
  reviewer_id?: string;
  title: string;
  audit_type: AuditType;
  status: AuditStatus;
  scheduled_date?: string;
  started_at?: string;
  completed_at?: string;
  due_date?: string;
  total_score?: number;
  max_possible_score?: number;
  compliance_percentage?: number;
  grade?: ScoreGrade;
  sort_score: number;
  set_in_order_score: number;
  shine_score: number;
  standardize_score: number;
  sustain_score: number;
  notes?: string;
  summary?: string;
  overall_feedback?: string;
  is_draft: boolean;
  geo_location?: { lat: number; lng: number };
  created_at: string;
  updated_at: string;
  // Relations
  department?: Department;
  auditor?: Profile;
  reviewer?: Profile;
  template?: AuditTemplate;
  responses?: AuditResponse[];
  capa_items?: CapaItem[];
}

export interface AuditResponse {
  id: string;
  audit_id: string;
  question_id: string;
  score: number;
  max_score: number;
  comment?: string;
  is_na: boolean;
  created_at: string;
  updated_at: string;
  question?: AuditQuestion;
  attachments?: Attachment[];
}

export interface CapaItem {
  id: string;
  company_id: string;
  audit_id?: string;
  department_id?: string;
  response_id?: string;
  title: string;
  description?: string;
  root_cause?: string;
  corrective_action?: string;
  preventive_action?: string;
  priority: CapaPriority;
  status: CapaStatus;
  raised_by: string;
  assigned_to?: string;
  approved_by?: string;
  due_date?: string;
  started_at?: string;
  completed_at?: string;
  approved_at?: string;
  sla_hours: number;
  escalation_level: number;
  verification_notes?: string;
  is_recurring: boolean;
  created_at: string;
  updated_at: string;
  // Relations
  audit?: Audit;
  department?: Department;
  raiser?: Profile;
  assignee?: Profile;
  approver?: Profile;
  comments?: CapaComment[];
  attachments?: Attachment[];
}

export interface CapaComment {
  id: string;
  capa_id: string;
  author_id: string;
  comment: string;
  is_internal: boolean;
  created_at: string;
  updated_at: string;
  author?: Profile;
}

export interface Attachment {
  id: string;
  company_id: string;
  audit_id?: string;
  response_id?: string;
  capa_id?: string;
  uploaded_by?: string;
  file_name: string;
  file_url: string;
  file_type?: string;
  file_size?: number;
  attachment_type: 'evidence' | 'before' | 'after' | 'signature';
  caption?: string;
  created_at: string;
  uploader?: Profile;
}

export interface Notification {
  id: string;
  company_id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  metadata: Record<string, unknown>;
  is_read: boolean;
  read_at?: string;
  action_url?: string;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  company_id?: string;
  user_id?: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  entity_name?: string;
  old_data?: Record<string, unknown>;
  new_data?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  user?: Profile;
}

// Dashboard types
export interface DashboardStats {
  totalAudits: number;
  completedAudits: number;
  scheduledAudits: number;
  overdueAudits: number;
  avgCompliance: number;
  openCapas: number;
  criticalCapas: number;
  totalDepartments: number;
  auditCompletionRate: number;
  complianceTrend: number; // % change from last month
}

export interface DepartmentSummary {
  department_id: string;
  department_name: string;
  color: string;
  company_id: string;
  total_audits: number;
  completed_audits: number;
  avg_compliance: number;
  last_audit_date?: string;
  open_capas: number;
}

export interface MonthlyTrend {
  month: string;
  avg_compliance: number;
  audit_count: number;
  department_id?: string;
}

export interface KpiCard {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: number;
  trendLabel?: string;
  icon: string;
  color: 'indigo' | 'emerald' | 'amber' | 'red' | 'blue' | 'purple';
  suffix?: string;
}

// Form types
export interface CreateAuditForm {
  title: string;
  department_id: string;
  branch_id?: string;
  template_id: string;
  audit_type: AuditType;
  scheduled_date: string;
  due_date: string;
  notes?: string;
}

export interface CreateCapaForm {
  title: string;
  description: string;
  audit_id?: string;
  department_id: string;
  priority: CapaPriority;
  assigned_to: string;
  due_date: string;
  root_cause?: string;
  corrective_action?: string;
  preventive_action?: string;
}
