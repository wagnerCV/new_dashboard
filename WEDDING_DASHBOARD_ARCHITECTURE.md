# 💍 Wedding Dashboard - Architecture Plan

**Project:** Digital Luxury Wedding Invitation with Admin Dashboard  
**Status:** Architecture Planning Phase  
**Date:** December 8, 2025

---

## 📋 Executive Summary

This document outlines the complete architecture for integrating a **Wedding Dashboard** into the existing wedding invitation website. The dashboard will enable the bride and groom to manage guest RSVPs and dynamically edit invitation content with real-time synchronization to the public invitation page.

### Key Objectives
- ✅ Create a secure, password-protected dashboard accessible only to bride and groom
- ✅ Build a real-time guest management system with filtering and search
- ✅ Enable dynamic invitation content editing with instant public page updates
- ✅ Maintain the luxurious, elegant design aesthetic of the invitation
- ✅ Ensure scalability and security with Supabase Row Level Security (RLS)

---

## 🏗️ Current Project Analysis

### Existing Technology Stack
| Component | Technology | Version |
|-----------|-----------|---------|
| **Frontend Framework** | React | 19.1.1 |
| **Build Tool** | Vite | 7.1.7 |
| **Styling** | TailwindCSS | 4.1.14 |
| **UI Components** | Radix UI | Latest |
| **Database** | Supabase (PostgreSQL) | 2.86.0 |
| **Routing** | Wouter | 3.3.5 |
| **Forms** | React Hook Form + Zod | Latest |
| **Animations** | Framer Motion | 12.23.22 |
| **State Management** | React Context + React Query | 5.90.2 |
| **Backend** | Express.js | 4.21.2 |
| **ORM** | Drizzle ORM | 0.44.5 |
| **Database Driver** | MySQL2 | 3.15.0 |

### Existing Database Structure
```
Current Tables:
├── rsvps (Supabase)
│   ├── id (UUID)
│   ├── name, email, phone
│   ├── status ('yes', 'no', 'maybe')
│   ├── party_size, going_to_reception
│   ├── dietary_restrictions, message
│   └── created_at
│
├── event_settings (Supabase)
│   ├── id (UUID)
│   ├── groom_name, bride_name
│   ├── wedding_date, wedding_time
│   ├── ceremony_location, ceremony_address
│   ├── reception_location, reception_address
│   └── countdown_target
│
└── users (MySQL/Drizzle)
    ├── id (int)
    ├── openId, name, email
    ├── loginMethod, role
    └── timestamps
```

### Design System
- **Color Palette:** Terracotta (#B45309), Emerald (#0F766E), Burgundy (#7C1D2F), Sand (#D6BFA8), Off-white (#FAF7F5), Soft Black (#0B0B0C)
- **Typography:** Playfair Display (serif, headings), Inter (sans-serif, body)
- **Design Philosophy:** "The Terracotta Portal" - Modern Mediterranean, architectural minimalism with cinematic lighting
- **Animation Library:** Framer Motion for scroll-triggered reveals and parallax effects

### Current Routing
```
Routes:
├── / (Home - Public Invitation)
├── /404 (Not Found)
└── (All routes fallback to Home)
```

---

## 🎯 Dashboard Architecture Overview

### 1. Authentication & Authorization Strategy

#### Approach: **Supabase Auth + Custom Admin Table**

We'll implement a **dual-layer authentication system**:

1. **Primary Layer:** Supabase Email/Password Auth
   - Simple, secure, no external dependencies
   - Built-in session management
   - Row Level Security integration

2. **Secondary Layer:** Admin Users Table
   - Store bride/groom profiles with roles
   - Track login history
   - Enable future admin management

#### Database Schema Addition

```sql
-- Admin Users Table
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,  -- Bcrypt hash
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'admin',    -- 'bride', 'groom', 'admin'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Policy: Only authenticated admins can read
CREATE POLICY "Admin read policy" ON admin_users
  FOR SELECT USING (auth.uid() = id);

-- Policy: Only authenticated admins can update their own profile
CREATE POLICY "Admin update policy" ON admin_users
  FOR UPDATE USING (auth.uid() = id);
```

#### Authentication Flow
```
1. User visits /dashboard
   ↓
2. Check if authenticated (Supabase session)
   ├─ YES → Check admin_users table for role
   │   ├─ BRIDE/GROOM → Allow access
   │   └─ OTHER → Redirect to 403
   └─ NO → Redirect to /dashboard/login
3. Login page: Email + Password form
   ↓
4. Verify credentials against Supabase Auth
   ↓
5. Create session + Set secure cookie
   ↓
6. Redirect to /dashboard/guests
```

---

### 2. Database Structure Enhancements

#### New Tables Required

**Table 1: Enhanced Event Settings**
```sql
CREATE TABLE event_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Couple Information
  groom_name TEXT NOT NULL DEFAULT 'Jorge Borges',
  bride_name TEXT NOT NULL DEFAULT 'Ana Oliveira',
  groom_email TEXT,
  bride_email TEXT,
  
  -- Wedding Details
  wedding_date DATE NOT NULL DEFAULT '2026-09-05',
  wedding_time TIME NOT NULL DEFAULT '10:00',
  ceremony_location TEXT NOT NULL,
  ceremony_address TEXT NOT NULL,
  reception_location TEXT NOT NULL,
  reception_address TEXT NOT NULL,
  
  -- Invitation Content
  invitation_message TEXT,
  love_manifesto TEXT,
  dress_code TEXT,
  rsvp_deadline DATE,
  
  -- Media
  hero_image_url TEXT,
  background_theme TEXT DEFAULT 'terracotta',
  
  -- Social Links
  instagram_url TEXT,
  facebook_url TEXT,
  
  -- Metadata
  countdown_target TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES admin_users(id)
);

-- RLS Policies
ALTER TABLE event_settings ENABLE ROW LEVEL SECURITY;

-- Public read access (for invitation page)
CREATE POLICY "Public read event settings" ON event_settings
  FOR SELECT USING (true);

-- Admin update access
CREATE POLICY "Admin update event settings" ON event_settings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid() 
      AND admin_users.is_active = true
    )
  );
```

**Table 2: Enhanced RSVPs with Analytics**
```sql
-- Modify existing rsvps table
ALTER TABLE rsvps ADD COLUMN IF NOT EXISTS:
  - confirmed_at TIMESTAMP WITH TIME ZONE
  - updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  - notes TEXT (for bride/groom notes)
  - dietary_notes TEXT (additional notes)
  - plus_one_name TEXT
  - table_assignment TEXT
  - response_source TEXT DEFAULT 'web' -- 'web', 'phone', 'manual'
```

**Table 3: Invitation Timeline Stories (Editable)**
```sql
CREATE TABLE timeline_stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_name TEXT NOT NULL, -- 'heart', 'map-pin', 'calendar', 'gem'
  display_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE timeline_stories ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Public read timeline" ON timeline_stories
  FOR SELECT USING (true);

-- Admin update
CREATE POLICY "Admin update timeline" ON timeline_stories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid()
    )
  );
```

---

### 3. Component Architecture

#### Route Structure
```
/dashboard
├── /login                          (Public - Login Page)
├── /guests                         (Protected - Guest Dashboard)
│   ├── /guests/list               (Guest List View)
│   ├── /guests/[id]               (Guest Detail View)
│   └── /guests/analytics          (RSVP Analytics)
├── /settings                       (Protected - Invitation Settings)
│   ├── /settings/general           (Couple info, dates)
│   ├── /settings/content           (Messages, manifesto)
│   ├── /settings/media             (Images, theme)
│   ├── /settings/timeline          (Story timeline)
│   └── /settings/social            (Social links)
├── /profile                        (Protected - Admin Profile)
└── /logout                         (Protected - Logout)
```

#### Component Breakdown

**Authentication Components**
```
components/
├── auth/
│   ├── LoginPage.tsx              (Login form with email/password)
│   ├── ProtectedRoute.tsx         (Route guard component)
│   ├── AuthContext.tsx            (Auth state management)
│   └── useAdminAuth.ts            (Custom hook)
```

**Dashboard Layout Components**
```
components/
├── dashboard/
│   ├── DashboardLayout.tsx        (Main layout with sidebar)
│   ├── Sidebar.tsx                (Navigation sidebar)
│   ├── Header.tsx                 (Top bar with user info)
│   └── DashboardCard.tsx          (Reusable card component)
```

**Guest Management Components**
```
components/
├── guests/
│   ├── GuestDashboard.tsx         (Main guest view)
│   ├── GuestTable.tsx             (Sortable, filterable table)
│   ├── GuestFilters.tsx           (Search, status filters)
│   ├── GuestStats.tsx             (Summary cards)
│   ├── GuestDetail.tsx            (Individual guest modal)
│   ├── GuestExport.tsx            (Export to CSV)
│   └── GuestRealTimeSync.tsx      (Real-time updates)
```

**Settings Components**
```
components/
├── settings/
│   ├── SettingsLayout.tsx         (Settings page layout)
│   ├── GeneralSettings.tsx        (Couple info, dates)
│   ├── ContentSettings.tsx        (Messages, manifesto)
│   ├── MediaSettings.tsx          (Image uploads, theme)
│   ├── TimelineSettings.tsx       (Story editor)
│   ├── SocialSettings.tsx         (Social links)
│   └── SettingsPreview.tsx        (Live preview)
```

**Shared Dashboard Components**
```
components/
├── dashboard-ui/
│   ├── StatCard.tsx               (Statistics card)
│   ├── ChartCard.tsx              (Chart wrapper)
│   ├── FormSection.tsx            (Form section wrapper)
│   ├── ConfirmDialog.tsx          (Confirmation modal)
│   └── LoadingState.tsx           (Loading skeleton)
```

---

### 4. State Management Strategy

#### Context-Based Approach (Preferred for simplicity)

```typescript
// contexts/DashboardAuthContext.tsx
interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: 'bride' | 'groom' | 'admin';
  last_login?: Date;
}

interface AuthContextType {
  user: AdminUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

// contexts/EventSettingsContext.tsx
interface EventSettingsContextType {
  settings: EventSettings;
  loading: boolean;
  updateSettings: (updates: Partial<EventSettings>) => Promise<void>;
  syncWithPublic: () => void;
}

// contexts/GuestDataContext.tsx
interface GuestDataContextType {
  guests: RSVP[];
  loading: boolean;
  filters: GuestFilters;
  setFilters: (filters: GuestFilters) => void;
  refreshGuests: () => Promise<void>;
  updateGuest: (id: string, updates: Partial<RSVP>) => Promise<void>;
  deleteGuest: (id: string) => Promise<void>;
  exportGuests: () => void;
}
```

#### Real-Time Updates with Supabase Subscriptions

```typescript
// hooks/useRealtimeGuests.ts
export function useRealtimeGuests() {
  const [guests, setGuests] = useState<RSVP[]>([]);
  
  useEffect(() => {
    // Subscribe to rsvps table changes
    const subscription = supabase
      .from('rsvps')
      .on('*', payload => {
        if (payload.eventType === 'INSERT') {
          setGuests(prev => [payload.new, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          setGuests(prev => 
            prev.map(g => g.id === payload.new.id ? payload.new : g)
          );
        } else if (payload.eventType === 'DELETE') {
          setGuests(prev => prev.filter(g => g.id !== payload.old.id));
        }
      })
      .subscribe();
    
    return () => subscription.unsubscribe();
  }, []);
  
  return guests;
}
```

---

### 5. Security Implementation

#### Row Level Security (RLS) Policies

```sql
-- 1. Admin Users: Only admins can access their own data
CREATE POLICY "Admins read own profile" ON admin_users
  FOR SELECT USING (auth.uid() = id);

-- 2. Event Settings: Public read, admin write
CREATE POLICY "Public read settings" ON event_settings
  FOR SELECT USING (true);

CREATE POLICY "Admin update settings" ON event_settings
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT id FROM admin_users 
      WHERE is_active = true
    )
  );

-- 3. RSVPs: Public insert, public read, admin update
CREATE POLICY "Public insert rsvp" ON rsvps
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read rsvps" ON rsvps
  FOR SELECT USING (true);

CREATE POLICY "Admin update rsvp" ON rsvps
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT id FROM admin_users 
      WHERE is_active = true
    )
  );

-- 4. Timeline Stories: Public read, admin write
CREATE POLICY "Public read timeline" ON timeline_stories
  FOR SELECT USING (true);

CREATE POLICY "Admin manage timeline" ON timeline_stories
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM admin_users 
      WHERE is_active = true
    )
  );
```

#### Frontend Security Practices

1. **Protected Routes:** Wrap dashboard routes with `ProtectedRoute` component
2. **Session Management:** Use Supabase session tokens stored in secure HTTP-only cookies
3. **Environment Variables:** Never expose Supabase service role key in frontend
4. **Input Validation:** Use Zod schemas for all form inputs
5. **CSRF Protection:** Implement CSRF tokens for state-changing operations
6. **Rate Limiting:** Implement rate limiting on login attempts

---

### 6. UI/UX Design Specifications

#### Design Consistency

The dashboard will maintain the wedding invitation's luxurious aesthetic:

| Element | Style |
|---------|-------|
| **Color Scheme** | Terracotta primary, Sand secondary, Off-white backgrounds |
| **Typography** | Playfair Display (headings), Inter (body) |
| **Spacing** | 4px grid system (TailwindCSS default) |
| **Borders** | Subtle 1px sand-colored borders |
| **Shadows** | Soft, minimal shadows for depth |
| **Animations** | Smooth transitions (300-500ms), no jarring effects |
| **Icons** | Lucide React icons, consistent sizing |

#### Dashboard Layout

```
┌─────────────────────────────────────────────────────────┐
│  Logo/Brand    Navigation Menu      User Profile    ⚙️   │
├──────────────┬──────────────────────────────────────────┤
│              │                                          │
│  Sidebar     │         Main Content Area               │
│  - Guests    │                                          │
│  - Settings  │  ┌─────────────────────────────────────┐ │
│  - Profile   │  │                                     │ │
│  - Logout    │  │  Dashboard Page Content             │ │
│              │  │                                     │ │
│              │  └─────────────────────────────────────┘ │
│              │                                          │
└──────────────┴──────────────────────────────────────────┘
```

#### Guest Dashboard Design

**Guest List View:**
- Sortable table with columns: Name, Status, Party Size, Email, Phone, RSVP Date
- Real-time row highlighting for new RSVPs
- Inline quick actions: View, Edit, Delete, Notes
- Filter bar: Status (Confirmed/Not Confirmed), Search, Date Range
- Summary stats: Total Guests, Confirmed, Pending, Declined

**Guest Detail Modal:**
- Full guest information
- Edit capability for bride/groom notes
- Dietary restrictions display
- Plus-one information
- Message from guest
- Action buttons: Mark as Confirmed, Add Notes, Delete

#### Settings Page Design

**Tabbed Interface:**
- Tab 1: General (Couple names, wedding date/time, venues)
- Tab 2: Content (Invitation message, manifesto, dress code)
- Tab 3: Media (Hero image, background theme)
- Tab 4: Timeline (Story cards editor)
- Tab 5: Social (Instagram, Facebook links)

**Live Preview:**
- Split-screen or side-by-side preview of invitation
- Auto-updates as settings change
- "View Live" button to open public page

---

### 7. Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    PUBLIC INVITATION                        │
│  (Home Page - Reads from event_settings & timeline_stories) │
└─────────────────────────────────────────────────────────────┘
                            ↑
                    (Real-time sync)
                            ↑
┌─────────────────────────────────────────────────────────────┐
│                    SUPABASE DATABASE                        │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ event_settings (Editable by admin)                      │ │
│ │ - Couple info, dates, venues, messages, media          │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ rsvps (Insertable by public, updatable by admin)        │ │
│ │ - Guest responses, dietary restrictions, messages      │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ admin_users (Authenticated admin data)                  │ │
│ │ - Email, password hash, role, login history            │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ timeline_stories (Editable by admin)                    │ │
│ │ - Couple's love story timeline                          │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↑
                    (Supabase Client)
                            ↑
┌─────────────────────────────────────────────────────────────┐
│                    DASHBOARD (Protected)                    │
├─────────────────────────────────────────────────────────────┤
│ ┌──────────────────┐  ┌──────────────────┐                 │
│ │ Guest Dashboard  │  │ Settings Editor  │                 │
│ │ - List guests    │  │ - Edit content   │                 │
│ │ - Filter/Search  │  │ - Upload images  │                 │
│ │ - View details   │  │ - Edit timeline  │                 │
│ │ - Real-time sync │  │ - Live preview   │                 │
│ └──────────────────┘  └──────────────────┘                 │
└─────────────────────────────────────────────────────────────┘
```

---

### 8. File Structure

```
wedding-invitation/
├── client/src/
│   ├── pages/
│   │   ├── Home.tsx                    (Existing)
│   │   ├── Dashboard.tsx               (NEW - Dashboard wrapper)
│   │   ├── DashboardLogin.tsx          (NEW - Login page)
│   │   ├── DashboardGuests.tsx         (NEW - Guest management)
│   │   ├── DashboardSettings.tsx       (NEW - Settings editor)
│   │   └── DashboardProfile.tsx        (NEW - Admin profile)
│   │
│   ├── components/
│   │   ├── auth/                       (NEW)
│   │   │   ├── LoginForm.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   └── AuthGuard.tsx
│   │   │
│   │   ├── dashboard/                  (NEW)
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── DashboardCard.tsx
│   │   │
│   │   ├── guests/                     (NEW)
│   │   │   ├── GuestTable.tsx
│   │   │   ├── GuestFilters.tsx
│   │   │   ├── GuestStats.tsx
│   │   │   ├── GuestDetail.tsx
│   │   │   └── GuestExport.tsx
│   │   │
│   │   └── settings/                   (NEW)
│   │       ├── GeneralSettings.tsx
│   │       ├── ContentSettings.tsx
│   │       ├── MediaSettings.tsx
│   │       ├── TimelineSettings.tsx
│   │       ├── SocialSettings.tsx
│   │       └── SettingsPreview.tsx
│   │
│   ├── contexts/
│   │   ├── EventContext.tsx            (Existing - will enhance)
│   │   ├── RSVPContext.tsx             (Existing)
│   │   ├── DashboardAuthContext.tsx    (NEW)
│   │   ├── GuestDataContext.tsx        (NEW)
│   │   └── EventSettingsContext.tsx    (NEW)
│   │
│   ├── hooks/
│   │   ├── useAuth.ts                  (Existing)
│   │   ├── useAdminAuth.ts             (NEW)
│   │   ├── useRealtimeGuests.ts        (NEW)
│   │   ├── useEventSettings.ts         (Existing - enhance)
│   │   └── useDashboardData.ts         (NEW)
│   │
│   ├── lib/
│   │   ├── supabaseClient.ts           (Existing)
│   │   ├── dashboardAuth.ts            (NEW - Auth utilities)
│   │   ├── validators.ts               (NEW - Zod schemas)
│   │   └── api.ts                      (NEW - API calls)
│   │
│   ├── App.tsx                         (Update routing)
│   └── index.css                       (Existing)
│
├── server/                             (Existing - may enhance)
│
├── shared/
│   ├── types.ts                        (Existing - add dashboard types)
│   └── const.ts                        (Existing)
│
├── drizzle/
│   └── schema.ts                       (Existing - may add)
│
├── DASHBOARD_SETUP.md                  (NEW - Setup instructions)
├── DASHBOARD_DATABASE.sql              (NEW - Database migrations)
└── package.json                        (Update dependencies if needed)
```

---

### 9. Implementation Phases

#### Phase 1: Database & Authentication (Week 1)
- [ ] Create admin_users table with RLS policies
- [ ] Enhance event_settings table
- [ ] Add timeline_stories table
- [ ] Set up Supabase Auth
- [ ] Create database migration scripts

#### Phase 2: Authentication UI & Routes (Week 1-2)
- [ ] Build LoginPage component
- [ ] Implement ProtectedRoute wrapper
- [ ] Create DashboardAuthContext
- [ ] Set up session management
- [ ] Add logout functionality

#### Phase 3: Dashboard Layout & Navigation (Week 2)
- [ ] Create DashboardLayout component
- [ ] Build Sidebar navigation
- [ ] Design Header with user info
- [ ] Set up route structure
- [ ] Add responsive mobile layout

#### Phase 4: Guest Dashboard (Week 2-3)
- [ ] Build GuestTable component
- [ ] Implement filtering and search
- [ ] Create GuestStats cards
- [ ] Add real-time sync with Supabase
- [ ] Implement guest detail modal
- [ ] Add export to CSV functionality

#### Phase 5: Settings Editor (Week 3-4)
- [ ] Create tabbed settings interface
- [ ] Build form components for each section
- [ ] Implement image upload
- [ ] Add live preview
- [ ] Set up auto-save functionality
- [ ] Sync changes to public page

#### Phase 6: Polish & Testing (Week 4)
- [ ] End-to-end testing
- [ ] Security audit
- [ ] Performance optimization
- [ ] Mobile responsiveness testing
- [ ] Documentation

---

### 10. Technology Recommendations

#### Why These Choices?

| Technology | Reason |
|-----------|--------|
| **Supabase Auth** | Native PostgreSQL integration, built-in RLS, no extra backend needed |
| **React Context** | Simple state management, no extra dependencies, sufficient for this scale |
| **Zod** | Type-safe validation, already in project, excellent DX |
| **React Hook Form** | Lightweight, performant, already in project |
| **Framer Motion** | Smooth animations, consistent with existing design |
| **Supabase Realtime** | Built-in websocket support, automatic subscriptions |
| **TailwindCSS** | Utility-first, already in project, rapid UI development |
| **Radix UI** | Accessible components, already in project |

#### Dependencies to Add (if needed)
```json
{
  "recharts": "^2.15.2",           // Charts for RSVP analytics
  "react-csv": "^2.2.2",           // CSV export
  "date-fns": "^4.1.0",            // Date formatting (already present)
  "bcryptjs": "^2.4.3",            // Password hashing
  "jose": "^5.1.0"                 // JWT handling (already present)
}
```

---

### 11. Security Checklist

- [ ] Implement Supabase Row Level Security (RLS) policies
- [ ] Use secure HTTP-only cookies for session storage
- [ ] Validate all inputs with Zod schemas
- [ ] Implement CSRF protection
- [ ] Add rate limiting on login endpoint
- [ ] Hash passwords with bcrypt (minimum 10 rounds)
- [ ] Implement session timeout (30 minutes)
- [ ] Add audit logging for admin actions
- [ ] Sanitize all user inputs
- [ ] Implement proper error handling (no sensitive data in errors)
- [ ] Use HTTPS only in production
- [ ] Implement proper CORS policies

---

### 12. Performance Considerations

1. **Lazy Loading:** Load dashboard components only when accessed
2. **Pagination:** Implement pagination for guest list (50 guests per page)
3. **Caching:** Cache event_settings in memory with 5-minute TTL
4. **Debouncing:** Debounce search/filter inputs (300ms)
5. **Image Optimization:** Compress uploaded images server-side
6. **Code Splitting:** Separate dashboard bundle from public site
7. **Database Indexes:** Add indexes on frequently queried columns

---

### 13. Deployment Strategy

#### Environment Setup

```env
# .env.local (Development)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# .env.production (Vercel)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

#### Deployment Checklist

- [ ] Set environment variables in Vercel
- [ ] Run database migrations in Supabase
- [ ] Create initial admin users
- [ ] Test authentication flow
- [ ] Verify RLS policies are active
- [ ] Test real-time sync
- [ ] Monitor error logs
- [ ] Set up backup strategy

---

## 📊 Success Metrics

| Metric | Target |
|--------|--------|
| **Page Load Time** | < 2 seconds |
| **Dashboard Response Time** | < 500ms |
| **Real-time Sync Latency** | < 1 second |
| **Mobile Responsiveness** | 100% on all breakpoints |
| **Security Score** | A+ (SSL Labs) |
| **Accessibility** | WCAG 2.1 AA |
| **Uptime** | 99.9% |

---

## 🎨 Design System Integration

The dashboard will seamlessly integrate with the existing invitation design:

1. **Color Palette:** Use existing terracotta, sand, emerald colors
2. **Typography:** Maintain Playfair Display + Inter combination
3. **Component Library:** Leverage existing Radix UI components
4. **Animations:** Use Framer Motion for consistent motion language
5. **Spacing:** Follow TailwindCSS 4px grid
6. **Iconography:** Use Lucide React consistently

---

## 📝 Next Steps

### Upon Approval:

1. **Phase 1 Implementation**
   - Set up Supabase tables and RLS policies
   - Create authentication system
   - Build database migration scripts

2. **Phase 2 Implementation**
   - Build authentication UI
   - Implement protected routes
   - Create session management

3. **Phase 3-5 Implementation**
   - Build dashboard components
   - Implement guest management
   - Create settings editor
   - Add real-time features

4. **Testing & Deployment**
   - Comprehensive testing
   - Security audit
   - Deploy to production

---

## 📞 Questions for Clarification

Before implementation, please confirm:

1. **Admin Credentials:** Should we pre-create admin accounts or allow self-registration?
2. **Guest Export:** What format? (CSV, PDF, Excel)
3. **Analytics:** Do you want charts/graphs for RSVP statistics?
4. **Notifications:** Should admins receive email notifications for new RSVPs?
5. **Backup:** Should we implement automated database backups?
6. **Customization:** Any additional fields beyond the standard RSVP form?

---

## 📄 Appendix: Database Migration Script

See `DASHBOARD_DATABASE.sql` for complete SQL schema.

---

**Document Version:** 1.0  
**Last Updated:** December 8, 2025  
**Status:** Awaiting Approval
