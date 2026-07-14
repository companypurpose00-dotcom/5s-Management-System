# 🏭 5S ProAudit — Enterprise Audit Management System

> **Fortune 500-quality 5S Audit & Compliance Management Platform** built with Next.js 14, TypeScript, Tailwind CSS, Supabase, and deployed on Netlify.

---

## ✨ Features

### 📊 Executive Dashboard
- Real-time KPI cards with animated counters
- Compliance trend area charts
- 5S category radar chart
- Department performance bar chart
- CAPA status donut chart
- AI-powered insights panel
- Department leaderboard
- Recent audit activity feed

### 📋 Audit Management
- Department-specific 5S audit checklists
- 5 categories: Sort, Set in Order, Shine, Standardize, Sustain
- Weighted scoring engine with auto grade calculation
- Photo evidence upload
- Draft saving & auto-sync
- Status tracking: Scheduled → In Progress → Completed

### 🔧 CAPA Management
- Kanban board + List view toggle
- Priority levels: Critical, High, Medium, Low
- SLA countdown timers
- Recurring issue detection
- Escalation workflow
- Status: Open → In Progress → Review → Approved → Closed

### 🏆 Department Leaderboard
- Animated podium (1st/2nd/3rd place)
- Trend indicators & streak tracking
- Radar comparison for top performers
- Monthly rank changes

### 📈 Reports & Analytics
- Interactive compliance heatmap (Dept × Month)
- Auditor performance metrics
- CAPA resolution trend charts
- Export: PDF, Excel, CSV, PowerPoint
- Annual/Quarterly/Monthly views

### 🔔 Notifications
- Real-time notification center
- Type-aware icons (audit, CAPA, achievement, escalation)
- Mark all read / dismiss animations
- Unread badge counter

### ⚙️ Settings
- Company profile management
- Notification preferences (Email, In-app, Push)
- Appearance: Dark/Light/System mode
- Security settings (2FA, session, audit logging)
- Audit configuration (thresholds, scoring rules)
- Integrations (Supabase, Netlify, AI, Slack, Teams)

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS + Custom CSS |
| **UI Library** | Radix UI + ShadCN pattern |
| **Animations** | Framer Motion |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **Backend** | Supabase (PostgreSQL + Auth + Storage + Realtime) |
| **Deployment** | Netlify |
| **PWA** | next-pwa |

---

## 🚀 Quick Start (Deploy to Netlify)

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) → Create new project
2. Copy your **Project URL** and **Anon Key** from Settings → API
3. Open the **SQL Editor** and run the entire contents of [`supabase/schema.sql`](./supabase/schema.sql)
4. Create Storage buckets in Supabase Storage:
   - `audit-attachments` (private, 50MB limit)
   - `avatars` (public, 5MB limit)
   - `company-logos` (public, 2MB limit)

### Step 2: Create Demo User

1. Go to Supabase → Authentication → Users
2. Click "Invite User" or "Create User"
   - Email: `demo@5sproaudit.com`
   - Password: `Demo@12345`
3. After user is created, run this in SQL Editor:
```sql
UPDATE profiles 
SET 
  full_name = 'Demo Admin',
  role = 'corporate_admin',
  company_id = '11111111-1111-1111-1111-111111111111',
  job_title = 'System Administrator'
WHERE email = 'demo@5sproaudit.com';
```

### Step 3: Deploy to Netlify

1. Push this code to a **GitHub repository**
2. Go to [netlify.com](https://netlify.com) → "Add new site" → "Import from Git"
3. Select your repository
4. Build settings are auto-detected from `netlify.toml`
5. Add **Environment Variables** in Netlify Dashboard → Site Settings → Environment:
   ```
   NEXT_PUBLIC_SUPABASE_URL = https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = your-anon-key
   ```
6. Click **Deploy Site** ✅

### Step 4: Install Netlify Next.js Plugin

In Netlify Dashboard → Plugins → search for **"@netlify/plugin-nextjs"** and install it.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   └── login/page.tsx          # Premium login page
│   ├── (dashboard)/
│   │   ├── layout.tsx               # Sidebar + header
│   │   ├── dashboard/page.tsx       # Executive dashboard
│   │   ├── audits/page.tsx          # Audit list
│   │   ├── capa/page.tsx            # CAPA kanban + list
│   │   ├── departments/page.tsx     # Department cards
│   │   ├── reports/page.tsx         # Analytics + heatmap
│   │   ├── notifications/page.tsx   # Notification center
│   │   ├── leaderboard/page.tsx     # Department rankings
│   │   └── settings/page.tsx        # System settings
│   ├── globals.css                  # Design system CSS
│   ├── layout.tsx                   # Root layout + fonts
│   └── page.tsx                     # Root → redirect
├── components/
│   ├── providers/
│   │   └── theme-provider.tsx
│   └── ui/
│       └── toaster.tsx
├── hooks/
│   └── use-toast.ts
├── lib/
│   ├── supabase/
│   │   ├── client.ts                # Browser client
│   │   └── server.ts                # Server client
│   └── utils.ts                     # Helper functions
├── middleware.ts                    # Route protection
└── types/
    └── index.ts                     # TypeScript types
supabase/
└── schema.sql                       # Complete DB schema
public/
└── manifest.json                    # PWA manifest
netlify.toml                         # Netlify config
```

---

## 🎨 Design System

### Color Palette
| Color | Usage |
|-------|-------|
| Indigo `#6366f1` | Primary brand, CTA buttons |
| Emerald `#10b981` | Success, Excellent grade |
| Amber `#f59e0b` | Warning, Average grade |
| Red `#ef4444` | Critical, Overdue |
| Blue `#3b82f6` | Good grade, Scheduled |
| Purple `#8b5cf6` | AI features, Draft status |

### Grade Thresholds
| Score | Grade |
|-------|-------|
| ≥90% | 🟢 Excellent |
| 75-89% | 🔵 Good |
| 60-74% | 🟡 Average |
| 40-59% | 🟠 Poor |
| <40% | 🔴 Critical |

---

## 🔐 User Roles

| Role | Access Level |
|------|-------------|
| Super Admin | Full system access |
| Corporate Admin | Full company access |
| Area Manager | Multiple departments |
| Dept Manager | Own department |
| Auditor | Conduct audits |
| Staff | View own dept |
| Viewer | Read-only |

---

## 📱 PWA Features

- Installable on Android/iOS/Desktop
- Offline capable (service worker)
- Home screen shortcuts (New Audit, Dashboard)
- Native-like experience

---

## 🤖 AI Features (Ready to Connect)

The AI layer in `src/lib/ai/` is scaffolded and ready for:
- **Gemini API** (Google AI)
- **OpenAI API**

Add your API key to `.env.local`:
```env
GEMINI_API_KEY=your-key-here
```

---

## 📄 License

Enterprise proprietary software. All rights reserved.

---

Made with ❤️ by the 5S ProAudit Team
