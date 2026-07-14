-- ============================================================
-- 5S AUDIT MANAGEMENT SYSTEM — Complete Supabase SQL Schema
-- Run this entire script in Supabase SQL Editor
-- ============================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE user_role AS ENUM (
  'super_admin', 'corporate_admin', 'area_manager',
  'dept_manager', 'auditor', 'staff', 'viewer'
);

CREATE TYPE audit_status AS ENUM (
  'scheduled', 'in_progress', 'completed', 'overdue', 'cancelled', 'draft'
);

CREATE TYPE audit_type AS ENUM (
  'routine', 'surprise', 'follow_up', 'annual', 'quarterly', 'monthly'
);

CREATE TYPE capa_status AS ENUM (
  'open', 'in_progress', 'pending_review', 'approved', 'closed', 'overdue'
);

CREATE TYPE capa_priority AS ENUM ('low', 'medium', 'high', 'critical');

CREATE TYPE score_grade AS ENUM ('excellent', 'good', 'average', 'poor', 'critical');

CREATE TYPE notification_type AS ENUM (
  'audit_due', 'audit_overdue', 'capa_assigned', 'capa_overdue',
  'capa_approved', 'escalation', 'system', 'achievement'
);

CREATE TYPE five_s_category AS ENUM (
  'sort', 'set_in_order', 'shine', 'standardize', 'sustain'
);

-- ============================================================
-- COMPANIES (Multi-tenant support)
-- ============================================================

CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  industry TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  settings JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PROFILES (extends Supabase auth.users)
-- ============================================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  employee_id TEXT,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'viewer',
  department_id UUID, -- FK added after departments table
  job_title TEXT,
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ,
  notification_preferences JSONB DEFAULT '{"email": true, "in_app": true, "push": false}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- DEPARTMENTS
-- ============================================================

CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  code TEXT,
  description TEXT,
  category TEXT,
  head_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  location TEXT,
  floor TEXT,
  area_sqft NUMERIC,
  employee_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  color TEXT DEFAULT '#6366f1',
  icon TEXT DEFAULT 'building',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_id, code)
);

-- Add FK from profiles to departments
ALTER TABLE profiles ADD CONSTRAINT profiles_department_id_fkey
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL;

-- ============================================================
-- BRANCHES / OUTLETS
-- ============================================================

CREATE TABLE branches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  country TEXT DEFAULT 'India',
  phone TEXT,
  manager_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- AUDIT TEMPLATES
-- ============================================================

CREATE TABLE audit_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  category TEXT,
  is_default BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  version INTEGER DEFAULT 1,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- AUDIT QUESTIONS
-- ============================================================

CREATE TABLE audit_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_id UUID NOT NULL REFERENCES audit_templates(id) ON DELETE CASCADE,
  five_s_category five_s_category NOT NULL,
  question_text TEXT NOT NULL,
  description TEXT,
  max_score INTEGER NOT NULL DEFAULT 5,
  weight NUMERIC DEFAULT 1.0,
  is_mandatory BOOLEAN DEFAULT true,
  requires_photo BOOLEAN DEFAULT false,
  requires_comment BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- AUDITS
-- ============================================================

CREATE TABLE audits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
  department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  template_id UUID REFERENCES audit_templates(id) ON DELETE SET NULL,
  auditor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  audit_type audit_type DEFAULT 'routine',
  status audit_status DEFAULT 'scheduled',
  scheduled_date TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  due_date TIMESTAMPTZ,
  
  -- Scores
  total_score NUMERIC,
  max_possible_score NUMERIC,
  compliance_percentage NUMERIC,
  grade score_grade,
  
  -- Scores per 5S category
  sort_score NUMERIC DEFAULT 0,
  set_in_order_score NUMERIC DEFAULT 0,
  shine_score NUMERIC DEFAULT 0,
  standardize_score NUMERIC DEFAULT 0,
  sustain_score NUMERIC DEFAULT 0,
  
  -- Meta
  notes TEXT,
  summary TEXT,
  overall_feedback TEXT,
  is_draft BOOLEAN DEFAULT false,
  geo_location JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- AUDIT RESPONSES
-- ============================================================

CREATE TABLE audit_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  audit_id UUID NOT NULL REFERENCES audits(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES audit_questions(id) ON DELETE CASCADE,
  score INTEGER NOT NULL DEFAULT 0,
  max_score INTEGER NOT NULL DEFAULT 5,
  comment TEXT,
  is_na BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(audit_id, question_id)
);

-- ============================================================
-- ATTACHMENTS (photos, documents)
-- ============================================================

CREATE TABLE attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  audit_id UUID REFERENCES audits(id) ON DELETE CASCADE,
  response_id UUID REFERENCES audit_responses(id) ON DELETE CASCADE,
  capa_id UUID, -- FK added after capa table
  uploaded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  attachment_type TEXT DEFAULT 'evidence', -- evidence, before, after, signature
  caption TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CAPA (Corrective Action & Preventive Action)
-- ============================================================

CREATE TABLE capa_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  audit_id UUID REFERENCES audits(id) ON DELETE SET NULL,
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  response_id UUID REFERENCES audit_responses(id) ON DELETE SET NULL,
  
  title TEXT NOT NULL,
  description TEXT,
  root_cause TEXT,
  corrective_action TEXT,
  preventive_action TEXT,
  
  priority capa_priority DEFAULT 'medium',
  status capa_status DEFAULT 'open',
  
  raised_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  approved_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  
  due_date TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  
  sla_hours INTEGER DEFAULT 72,
  escalation_level INTEGER DEFAULT 0,
  
  verification_notes TEXT,
  is_recurring BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add FK from attachments to capa
ALTER TABLE attachments ADD CONSTRAINT attachments_capa_id_fkey
  FOREIGN KEY (capa_id) REFERENCES capa_items(id) ON DELETE CASCADE;

-- ============================================================
-- CAPA COMMENTS
-- ============================================================

CREATE TABLE capa_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  capa_id UUID NOT NULL REFERENCES capa_items(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  action_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ACTIVITY LOGS (Full Audit Trail)
-- ============================================================

CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  entity_name TEXT,
  old_data JSONB,
  new_data JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ACHIEVEMENTS / BADGES
-- ============================================================

CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
  badge_type TEXT NOT NULL,
  badge_name TEXT NOT NULL,
  badge_description TEXT,
  badge_icon TEXT,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- ============================================================
-- SYSTEM SETTINGS
-- ============================================================

CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  value JSONB NOT NULL,
  category TEXT DEFAULT 'general',
  updated_by UUID REFERENCES profiles(id),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_id, key)
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_profiles_company ON profiles(company_id);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_department ON profiles(department_id);

CREATE INDEX idx_departments_company ON departments(company_id);
CREATE INDEX idx_departments_parent ON departments(parent_id);

CREATE INDEX idx_audits_company ON audits(company_id);
CREATE INDEX idx_audits_department ON audits(department_id);
CREATE INDEX idx_audits_auditor ON audits(auditor_id);
CREATE INDEX idx_audits_status ON audits(status);
CREATE INDEX idx_audits_scheduled_date ON audits(scheduled_date);
CREATE INDEX idx_audits_created_at ON audits(created_at DESC);

CREATE INDEX idx_audit_responses_audit ON audit_responses(audit_id);
CREATE INDEX idx_audit_responses_question ON audit_responses(question_id);

CREATE INDEX idx_capa_company ON capa_items(company_id);
CREATE INDEX idx_capa_status ON capa_items(status);
CREATE INDEX idx_capa_assigned ON capa_items(assigned_to);
CREATE INDEX idx_capa_audit ON capa_items(audit_id);
CREATE INDEX idx_capa_due_date ON capa_items(due_date);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

CREATE INDEX idx_activity_logs_company ON activity_logs(company_id);
CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_entity ON activity_logs(entity_type, entity_id);
CREATE INDEX idx_activity_logs_created ON activity_logs(created_at DESC);

CREATE INDEX idx_attachments_audit ON attachments(audit_id);
CREATE INDEX idx_attachments_capa ON attachments(capa_id);

-- ============================================================
-- TRIGGERS
-- ============================================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_audits_updated_at BEFORE UPDATE ON audits FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_capa_items_updated_at BEFORE UPDATE ON capa_items FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create profile on auth signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email,
    'viewer'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Calculate audit grade from compliance %
CREATE OR REPLACE FUNCTION calculate_audit_grade(compliance_pct NUMERIC)
RETURNS score_grade AS $$
BEGIN
  IF compliance_pct >= 90 THEN RETURN 'excellent';
  ELSIF compliance_pct >= 75 THEN RETURN 'good';
  ELSIF compliance_pct >= 60 THEN RETURN 'average';
  ELSIF compliance_pct >= 40 THEN RETURN 'poor';
  ELSE RETURN 'critical';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Update overdue CAPA statuses
CREATE OR REPLACE FUNCTION check_capa_overdue()
RETURNS VOID AS $$
BEGIN
  UPDATE capa_items
  SET status = 'overdue'
  WHERE status IN ('open', 'in_progress')
    AND due_date < NOW()
    AND status != 'overdue';
END;
$$ LANGUAGE plpgsql;

-- Update overdue audit statuses
CREATE OR REPLACE FUNCTION check_audit_overdue()
RETURNS VOID AS $$
BEGIN
  UPDATE audits
  SET status = 'overdue'
  WHERE status = 'scheduled'
    AND due_date < NOW();
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE capa_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE capa_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user's company_id
CREATE OR REPLACE FUNCTION get_user_company_id()
RETURNS UUID AS $$
  SELECT company_id FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper function to get current user's role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- COMPANIES policies
CREATE POLICY "Users can view their own company" ON companies
  FOR SELECT USING (id = get_user_company_id());

CREATE POLICY "Super admins can manage companies" ON companies
  FOR ALL USING (get_user_role() = 'super_admin');

-- PROFILES policies
CREATE POLICY "Users can view profiles in their company" ON profiles
  FOR SELECT USING (company_id = get_user_company_id() OR id = auth.uid());

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Admins can manage all profiles" ON profiles
  FOR ALL USING (get_user_role() IN ('super_admin', 'corporate_admin'));

-- DEPARTMENTS policies
CREATE POLICY "Company members can view departments" ON departments
  FOR SELECT USING (company_id = get_user_company_id());

CREATE POLICY "Admins and managers can manage departments" ON departments
  FOR ALL USING (
    company_id = get_user_company_id()
    AND get_user_role() IN ('super_admin', 'corporate_admin', 'area_manager', 'dept_manager')
  );

-- BRANCHES policies
CREATE POLICY "Company members can view branches" ON branches
  FOR SELECT USING (company_id = get_user_company_id());

CREATE POLICY "Admins and managers can manage branches" ON branches
  FOR ALL USING (
    company_id = get_user_company_id()
    AND get_user_role() IN ('super_admin', 'corporate_admin', 'area_manager')
  );

-- AUDIT TEMPLATES policies
CREATE POLICY "Company members can view templates" ON audit_templates
  FOR SELECT USING (company_id = get_user_company_id());

CREATE POLICY "Admins and managers can manage templates" ON audit_templates
  FOR ALL USING (
    company_id = get_user_company_id()
    AND get_user_role() IN ('super_admin', 'corporate_admin', 'area_manager', 'dept_manager')
  );

-- AUDIT QUESTIONS policies
CREATE POLICY "Company members can view questions" ON audit_questions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM audit_templates t
      WHERE t.id = template_id AND t.company_id = get_user_company_id()
    )
  );

CREATE POLICY "Admins and managers can manage questions" ON audit_questions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM audit_templates t
      WHERE t.id = template_id AND t.company_id = get_user_company_id()
      AND get_user_role() IN ('super_admin', 'corporate_admin', 'area_manager', 'dept_manager')
    )
  );

-- AUDITS policies
CREATE POLICY "Company members can view audits" ON audits
  FOR SELECT USING (company_id = get_user_company_id());

CREATE POLICY "Auditors can create and update audits" ON audits
  FOR INSERT WITH CHECK (
    company_id = get_user_company_id()
    AND get_user_role() IN ('super_admin', 'corporate_admin', 'area_manager', 'dept_manager', 'auditor')
  );

CREATE POLICY "Auditors can update their own audits" ON audits
  FOR UPDATE USING (
    company_id = get_user_company_id()
    AND (
      auditor_id = auth.uid()
      OR get_user_role() IN ('super_admin', 'corporate_admin', 'area_manager')
    )
  );

-- AUDIT_RESPONSES policies
CREATE POLICY "Company members can view responses" ON audit_responses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM audits a
      WHERE a.id = audit_id AND a.company_id = get_user_company_id()
    )
  );

CREATE POLICY "Auditors can manage responses" ON audit_responses
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM audits a
      WHERE a.id = audit_id
        AND a.company_id = get_user_company_id()
        AND (a.auditor_id = auth.uid() OR get_user_role() IN ('super_admin', 'corporate_admin', 'area_manager'))
    )
  );

-- CAPA policies
CREATE POLICY "Company members can view CAPA" ON capa_items
  FOR SELECT USING (company_id = get_user_company_id());

CREATE POLICY "Authorized users can create CAPA" ON capa_items
  FOR INSERT WITH CHECK (
    company_id = get_user_company_id()
    AND get_user_role() NOT IN ('viewer')
  );

CREATE POLICY "Assigned users and managers can update CAPA" ON capa_items
  FOR UPDATE USING (
    company_id = get_user_company_id()
    AND (
      assigned_to = auth.uid()
      OR raised_by = auth.uid()
      OR get_user_role() IN ('super_admin', 'corporate_admin', 'area_manager', 'dept_manager')
    )
  );

CREATE POLICY "Admins can delete CAPA" ON capa_items
  FOR DELETE USING (
    company_id = get_user_company_id()
    AND get_user_role() IN ('super_admin', 'corporate_admin')
  );

-- CAPA COMMENTS policies
CREATE POLICY "Company members can view capa comments" ON capa_comments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM capa_items c
      WHERE c.id = capa_id AND c.company_id = get_user_company_id()
    )
  );

CREATE POLICY "Users can create capa comments" ON capa_comments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM capa_items c
      WHERE c.id = capa_id AND c.company_id = get_user_company_id()
      AND get_user_role() NOT IN ('viewer')
    )
  );

CREATE POLICY "Users can update their own capa comments" ON capa_comments
  FOR UPDATE USING (author_id = auth.uid());

-- NOTIFICATIONS policies
CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications" ON notifications
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "System can insert notifications" ON notifications
  FOR INSERT WITH CHECK (company_id = get_user_company_id());

-- SETTINGS policies
CREATE POLICY "Company members can view settings" ON settings
  FOR SELECT USING (company_id = get_user_company_id());

CREATE POLICY "Admins can manage settings" ON settings
  FOR ALL USING (
    company_id = get_user_company_id()
    AND get_user_role() IN ('super_admin', 'corporate_admin')
  );

-- ATTACHMENTS policies
CREATE POLICY "Company members can view attachments" ON attachments
  FOR SELECT USING (company_id = get_user_company_id());

CREATE POLICY "Authenticated users can upload attachments" ON attachments
  FOR INSERT WITH CHECK (
    company_id = get_user_company_id()
    AND get_user_role() NOT IN ('viewer')
  );

CREATE POLICY "Users can delete their own attachments or admins can delete" ON attachments
  FOR DELETE USING (
    company_id = get_user_company_id()
    AND (uploaded_by = auth.uid() OR get_user_role() IN ('super_admin', 'corporate_admin'))
  );

-- ACTIVITY_LOGS policies
CREATE POLICY "Admins can view all logs" ON activity_logs
  FOR SELECT USING (
    company_id = get_user_company_id()
    AND get_user_role() IN ('super_admin', 'corporate_admin', 'area_manager')
  );

-- ACHIEVEMENTS policies
CREATE POLICY "Company members can view achievements" ON achievements
  FOR SELECT USING (company_id = get_user_company_id());

CREATE POLICY "System can manage achievements" ON achievements
  FOR ALL USING (
    company_id = get_user_company_id()
    AND get_user_role() IN ('super_admin', 'corporate_admin')
  );

-- ============================================================
-- SEED DATA
-- ============================================================

-- Insert demo company
INSERT INTO companies (id, name, slug, industry, email) VALUES
  ('11111111-1111-1111-1111-111111111111', '5S ProAudit Corp', '5s-proaudit', 'Manufacturing', 'admin@5sproaudit.com');

-- Departments
INSERT INTO departments (id, company_id, name, code, category, color, icon) VALUES
  ('d1000001-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'Production', 'PROD', 'Operations', '#6366f1', 'factory'),
  ('d1000001-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'Warehouse', 'WH', 'Operations', '#10b981', 'warehouse'),
  ('d1000001-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'Quality Assurance', 'QA', 'Quality', '#f59e0b', 'shield-check'),
  ('d1000001-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', 'Engineering', 'ENG', 'Technical', '#3b82f6', 'cog'),
  ('d1000001-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111', 'HR & Admin', 'HR', 'Support', '#ec4899', 'users'),
  ('d1000001-0000-0000-0000-000000000006', '11111111-1111-1111-1111-111111111111', 'Finance', 'FIN', 'Support', '#8b5cf6', 'trending-up'),
  ('d1000001-0000-0000-0000-000000000007', '11111111-1111-1111-1111-111111111111', 'Logistics', 'LOG', 'Operations', '#14b8a6', 'truck'),
  ('d1000001-0000-0000-0000-000000000008', '11111111-1111-1111-1111-111111111111', 'Sales', 'SALES', 'Commercial', '#f97316', 'bar-chart'),
  ('d1000001-0000-0000-0000-000000000009', '11111111-1111-1111-1111-111111111111', 'Kitchen', 'KIT', 'Operations', '#ef4444', 'chef-hat'),
  ('d1000001-0000-0000-0000-000000000010', '11111111-1111-1111-1111-111111111111', 'IT Department', 'IT', 'Technical', '#0ea5e9', 'monitor');

-- Default audit template
INSERT INTO audit_templates (id, company_id, name, description, is_default) VALUES
  ('t1000001-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'Standard 5S Audit', 'Comprehensive 5S audit template for all departments', true);

-- Audit questions (5 per category = 25 total)
INSERT INTO audit_questions (template_id, five_s_category, question_text, max_score, weight, requires_photo, order_index) VALUES
  -- SORT
  ('t1000001-0000-0000-0000-000000000001', 'sort', 'Are unnecessary items removed from the work area?', 5, 1.2, false, 1),
  ('t1000001-0000-0000-0000-000000000001', 'sort', 'Are all materials, tools, and equipment necessary for current work only?', 5, 1.0, false, 2),
  ('t1000001-0000-0000-0000-000000000001', 'sort', 'Are red tag items properly identified and handled?', 5, 1.0, true, 3),
  ('t1000001-0000-0000-0000-000000000001', 'sort', 'Are walkways and emergency exits free from obstruction?', 5, 1.5, true, 4),
  ('t1000001-0000-0000-0000-000000000001', 'sort', 'Is there a clear process for disposing of unneeded items?', 5, 0.8, false, 5),
  -- SET IN ORDER
  ('t1000001-0000-0000-0000-000000000001', 'set_in_order', 'Are all items labeled and in designated locations?', 5, 1.2, true, 6),
  ('t1000001-0000-0000-0000-000000000001', 'set_in_order', 'Are storage locations clearly marked and organized?', 5, 1.0, true, 7),
  ('t1000001-0000-0000-0000-000000000001', 'set_in_order', 'Is there a visual management system in place?', 5, 1.0, false, 8),
  ('t1000001-0000-0000-0000-000000000001', 'set_in_order', 'Can items be retrieved within 30 seconds?', 5, 1.3, false, 9),
  ('t1000001-0000-0000-0000-000000000001', 'set_in_order', 'Are tools and equipment returned to designated spots after use?', 5, 1.0, false, 10),
  -- SHINE
  ('t1000001-0000-0000-0000-000000000001', 'shine', 'Is the work area clean and free from debris?', 5, 1.0, true, 11),
  ('t1000001-0000-0000-0000-000000000001', 'shine', 'Are machines and equipment cleaned regularly?', 5, 1.2, false, 12),
  ('t1000001-0000-0000-0000-000000000001', 'shine', 'Is there a cleaning schedule posted and followed?', 5, 1.0, false, 13),
  ('t1000001-0000-0000-0000-000000000001', 'shine', 'Are floors, walls, and surfaces in good condition?', 5, 0.8, true, 14),
  ('t1000001-0000-0000-0000-000000000001', 'shine', 'Are waste bins available and not overflowing?', 5, 0.8, false, 15),
  -- STANDARDIZE
  ('t1000001-0000-0000-0000-000000000001', 'standardize', 'Are standard operating procedures (SOPs) posted and visible?', 5, 1.3, false, 16),
  ('t1000001-0000-0000-0000-000000000001', 'standardize', 'Is there a consistent visual standard across the department?', 5, 1.0, false, 17),
  ('t1000001-0000-0000-0000-000000000001', 'standardize', 'Are checklists and audit forms being used consistently?', 5, 1.0, false, 18),
  ('t1000001-0000-0000-0000-000000000001', 'standardize', 'Are standards communicated and understood by all staff?', 5, 1.2, false, 19),
  ('t1000001-0000-0000-0000-000000000001', 'standardize', 'Is equipment maintenance on a standardized schedule?', 5, 1.0, false, 20),
  -- SUSTAIN
  ('t1000001-0000-0000-0000-000000000001', 'sustain', 'Are employees trained on 5S principles?', 5, 1.2, false, 21),
  ('t1000001-0000-0000-0000-000000000001', 'sustain', 'Are audits conducted on schedule?', 5, 1.5, false, 22),
  ('t1000001-0000-0000-0000-000000000001', 'sustain', 'Is there management commitment and visible support for 5S?', 5, 1.3, false, 23),
  ('t1000001-0000-0000-0000-000000000001', 'sustain', 'Are improvement suggestions being acted upon?', 5, 1.0, false, 24),
  ('t1000001-0000-0000-0000-000000000001', 'sustain', 'Is 5S performance tracked and displayed?', 5, 1.0, false, 25);

-- ============================================================
-- REALTIME - Enable for key tables
-- ============================================================

ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE audits;
ALTER PUBLICATION supabase_realtime ADD TABLE capa_items;
ALTER PUBLICATION supabase_realtime ADD TABLE activity_logs;

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================

-- Run these via Supabase Storage settings or Dashboard:
-- Create bucket: 'audit-attachments' (public: false, file size limit: 50MB)
-- Create bucket: 'avatars' (public: true, file size limit: 5MB)
-- Create bucket: 'company-logos' (public: true, file size limit: 2MB)

-- ============================================================
-- VIEWS (for analytics)
-- ============================================================

CREATE OR REPLACE VIEW department_audit_summary AS
SELECT
  d.id as department_id,
  d.name as department_name,
  d.color,
  d.company_id,
  COUNT(DISTINCT a.id) as total_audits,
  COUNT(DISTINCT CASE WHEN a.status = 'completed' THEN a.id END) as completed_audits,
  ROUND(AVG(a.compliance_percentage), 1) as avg_compliance,
  MAX(a.completed_at) as last_audit_date,
  COUNT(DISTINCT CASE WHEN ci.status IN ('open', 'in_progress', 'overdue') THEN ci.id END) as open_capas
FROM departments d
LEFT JOIN audits a ON a.department_id = d.id
LEFT JOIN capa_items ci ON ci.department_id = d.id
GROUP BY d.id, d.name, d.color, d.company_id;

CREATE OR REPLACE VIEW monthly_compliance_trend AS
SELECT
  company_id,
  department_id,
  DATE_TRUNC('month', completed_at) as month,
  ROUND(AVG(compliance_percentage), 1) as avg_compliance,
  COUNT(*) as audit_count
FROM audits
WHERE status = 'completed' AND completed_at IS NOT NULL
GROUP BY company_id, department_id, DATE_TRUNC('month', completed_at)
ORDER BY month DESC;

-- ============================================================
-- DONE! Schema complete.
-- ============================================================
