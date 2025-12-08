# Wedding Dashboard

Admin dashboard for bride and groom to manage guests and customize the wedding invitation.

## Features

- **Guest Management:** View, filter, search, and manage all registered guests
- **Analytics:** Real-time RSVP statistics and distribution charts
- **CSV Export:** Download guest list for planning
- **Settings:** Edit couple names, dates, venues, messages, images, and social links
- **Real-time Updates:** Changes instantly reflected in public invitation
- **Secure Authentication:** Email/password login with role-based access
- **Admin Notes:** Add notes to each guest record

## Tech Stack

- React 19 + Vite + TypeScript
- TailwindCSS 4
- Supabase (PostgreSQL + Auth)
- Framer Motion (animations)
- Recharts (analytics)
- React Hook Form + Zod (validation)

## Quick Start

```bash
# Install dependencies
npm install --legacy-peer-deps

# Create environment file
cp .env.example .env.local

# Add your Supabase credentials to .env.local
# VITE_SUPABASE_URL=your_url
# VITE_SUPABASE_ANON_KEY=your_key

# Start development server
npm run dev

# Visit http://localhost:5173/dashboard/login
```

## Database Setup (IMPORTANT)

Before deploying or using the dashboard:

1. Go to Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to "SQL Editor"
4. Copy and paste contents of `DASHBOARD_MIGRATION.sql`
5. Click "Run"
6. Create admin users (see DEPLOY_INSTRUCTIONS.md)

## Build for Production

```bash
npm run build
npm run preview
```

## Environment Variables

Create `.env.local` with:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Go to https://vercel.com
3. Import from GitHub
4. Add environment variables
5. Deploy

### Netlify

1. Push to GitHub
2. Go to https://netlify.com
3. Connect GitHub repo
4. Add environment variables
5. Deploy

## Dashboard Pages

- **Login:** `/dashboard/login` - Secure authentication
- **Guests:** `/dashboard/guests` - Guest management and analytics
- **Settings:** `/dashboard/settings` - Edit invitation details
- **Profile:** `/dashboard/profile` - Admin information

## Security

- Row-level security (RLS) on all database tables
- Supabase Auth for secure authentication
- Protected routes (authenticated users only)
- No sensitive keys in frontend
- Environment variables for configuration
- HTTPS recommended for production

## Shared Database

This dashboard shares the same Supabase database with the Wedding Invitation project.

## Support

- `DEPLOY_INSTRUCTIONS.md` - Deployment guide
- `DASHBOARD_README.md` - Feature documentation
- Supabase Docs: https://supabase.com/docs

---

**Happy wedding planning! 💍✨**
