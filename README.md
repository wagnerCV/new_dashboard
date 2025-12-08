# Wedding Invitation + Admin Dashboard

A luxurious, modern wedding invitation website with an integrated admin dashboard for the bride and groom to manage guests and customize their invitation.

## Features

### Public Invitation Page
- Elegant, responsive design with Mediterranean aesthetic
- Couple's story and timeline
- Guest RSVP form
- Venue and event details
- Social media integration
- Real-time guest count

### Admin Dashboard (Bride & Groom Only)
- **Guest Management:** View, filter, search, and manage all registered guests
- **Analytics:** Real-time RSVP statistics and distribution charts
- **CSV Export:** Download guest list for planning
- **Invitation Settings:** Edit couple names, dates, venues, messages, images, and social links
- **Real-time Updates:** Changes instantly reflected in public invitation
- **Secure Authentication:** Email/password login with role-based access

## Tech Stack

- **Frontend:** React 19 + Vite + TypeScript + TailwindCSS 4
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **UI Components:** Radix UI
- **Animations:** Framer Motion
- **Charts:** Recharts
- **Forms:** React Hook Form + Zod
- **Routing:** Wouter

## Quick Start

### Prerequisites
- Node.js 18+
- npm or pnpm
- Supabase account (free tier available)

### Installation

```bash
# Clone repository
git clone <your-repo-url>
cd wedding-invitation

# Install dependencies
npm install --legacy-peer-deps

# Copy environment template
cp .env.example .env.local

# Add your Supabase credentials to .env.local
# VITE_SUPABASE_URL=your_url
# VITE_SUPABASE_ANON_KEY=your_key

# Start development server
npm run dev

# Visit http://localhost:5173
```

### Database Setup

1. Create Supabase project at https://supabase.com
2. Go to SQL Editor
3. Run the SQL from `DASHBOARD_MIGRATION.sql`
4. Create admin users in Supabase Auth
5. Insert admin records in `admin_users` table

See `DEPLOY_INSTRUCTIONS.md` for detailed setup.

## Project Structure

```
wedding-invitation/
├── client/src/
│   ├── components/          # React components
│   ├── pages/              # Page components
│   ├── contexts/           # React contexts
│   ├── lib/                # Utilities and API
│   ├── types/              # TypeScript types
│   └── index.css           # Styles
├── server/                 # Optional backend
├── DASHBOARD_MIGRATION.sql # Database schema
├── DEPLOY_INSTRUCTIONS.md  # Deployment guide
├── DASHBOARD_README.md     # Feature documentation
└── package.json
```

## Usage

### Access the Invitation
- Public: `http://localhost:5173/`
- Production: `https://yoursite.com/`

### Access the Dashboard
- Login: `http://localhost:5173/dashboard/login`
- Guests: `http://localhost:5173/dashboard/guests`
- Settings: `http://localhost:5173/dashboard/settings`
- Profile: `http://localhost:5173/dashboard/profile`

### Default Credentials
- Email: bride@example.com or groom@example.com
- Password: (Set when creating Supabase auth users)

## Build & Deploy

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm run build
# Deploy dist/ folder
```

See `DEPLOY_INSTRUCTIONS.md` for more deployment options.

## Configuration

### Environment Variables
Create `.env.local` with:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Customize Colors
Edit `client/src/index.css` to change the color palette:
- Terracotta (primary)
- Emerald (success)
- Burgundy (error)
- Sand (neutral)
- Off-white (background)
- Soft-black (text)

### Customize Content
Edit `client/src/pages/Home.tsx` and use the dashboard settings to customize:
- Couple names
- Wedding date and time
- Venues and addresses
- Invitation message
- Love manifesto
- Dress code
- Social media links
- Hero image

## Security

- Row-level security (RLS) on all database tables
- Secure authentication with Supabase Auth
- Protected routes for admin pages
- No sensitive keys in frontend
- HTTPS recommended for production
- Regular security updates

## Troubleshooting

### Build Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Supabase Connection
- Verify `.env.local` has correct credentials
- Check Supabase project is active
- Verify RLS policies are enabled

### Login Issues
- Ensure user exists in Supabase Auth
- Check user is in `admin_users` table
- Verify `is_active` is `true`

See `DEPLOY_INSTRUCTIONS.md` for more troubleshooting.

## Documentation

- `DEPLOY_INSTRUCTIONS.md` - Complete deployment guide
- `DASHBOARD_README.md` - Dashboard features and usage
- `DASHBOARD_MIGRATION.sql` - Database schema

## Support

- Supabase Docs: https://supabase.com/docs
- React Docs: https://react.dev
- Vite Docs: https://vitejs.dev

## License

This project is provided as-is for wedding planning purposes.

---

**Happy wedding planning! 💍✨**
