# Wedding Invitation + Dashboard - Deployment Instructions

## Overview

This is a complete wedding invitation website with an integrated admin dashboard for the bride and groom to manage guests and customize the invitation.

**Tech Stack:**
- Frontend: React 19 + Vite + TypeScript + TailwindCSS
- Backend: Node.js (optional, for server functions)
- Database: Supabase (PostgreSQL)
- Authentication: Supabase Auth

---

## Required Environment Variables

### Create a `.env.local` file in the root directory with:

```env
# Supabase Configuration (PUBLIC - safe to expose)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional: Server-side variables (if using backend)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### How to Get These Values:

1. **Create Supabase Project:**
   - Go to https://supabase.com
   - Click "New Project"
   - Fill in project details and wait for creation

2. **Get Credentials:**
   - Go to Project Settings → API
   - Copy `Project URL` → `VITE_SUPABASE_URL`
   - Copy `anon public` key → `VITE_SUPABASE_ANON_KEY`
   - (Optional) Copy `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

---

## Build Commands

### Development

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev

# Visit http://localhost:5173
```

### Production Build

```bash
# Build for production
npm install --legacy-peer-deps
npm run build

# Output will be in ./dist directory
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Or with environment variables
vercel --env VITE_SUPABASE_URL=your_url --env VITE_SUPABASE_ANON_KEY=your_key
```

---

## Database Setup

### Step 1: Run Migration SQL

1. Open Supabase Dashboard
2. Go to SQL Editor
3. Create new query
4. Copy and paste contents of `DASHBOARD_MIGRATION.sql`
5. Click "Run"
6. Wait for completion

### Step 2: Create Admin Users

In Supabase SQL Editor, run:

```sql
-- First, create auth users in Supabase Auth
-- Go to Authentication → Users → Add User
-- Create two users:
--   - bride@example.com
--   - groom@example.com
-- Note their User IDs

-- Then insert into admin_users table:
INSERT INTO admin_users (auth_user_id, email, full_name, role, is_active)
VALUES 
  ('USER_ID_FROM_BRIDE_AUTH', 'bride@example.com', 'Bride Name', 'bride', true),
  ('USER_ID_FROM_GROOM_AUTH', 'groom@example.com', 'Groom Name', 'groom', true);
```

### Step 3: Initialize Event Settings

```sql
INSERT INTO event_settings (
  groom_name,
  bride_name,
  wedding_date,
  wedding_time,
  ceremony_location,
  ceremony_address,
  reception_location,
  reception_address,
  invitation_message,
  love_manifesto,
  dress_code,
  background_theme
) VALUES (
  'Groom Name',
  'Bride Name',
  '2025-06-15',
  '15:00',
  'Church Name',
  'Address Line 1',
  'Venue Name',
  'Venue Address',
  'Welcome to our wedding celebration!',
  'Our love story begins...',
  'Black Tie',
  'terracotta'
);
```

---

## Dashboard Access

### Login Page
- URL: `http://localhost:5173/dashboard/login` (development)
- URL: `https://yoursite.com/dashboard/login` (production)

### Default Credentials
- Email: bride@example.com or groom@example.com
- Password: (Set when creating auth users in Supabase)

### Dashboard Pages
- **Guests:** `/dashboard/guests` - View and manage guest list
- **Settings:** `/dashboard/settings` - Edit invitation details
- **Profile:** `/dashboard/profile` - View admin profile

---

## Project Structure

```
wedding-invitation/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── guests/          # Guest management components
│   │   │   ├── settings/        # Settings form components
│   │   │   ├── dashboard/       # Dashboard layout
│   │   │   └── auth/            # Authentication components
│   │   ├── pages/
│   │   │   ├── Home.tsx         # Public invitation page
│   │   │   ├── Dashboard.tsx    # Dashboard router
│   │   │   ├── DashboardGuests.tsx
│   │   │   ├── DashboardSettings.tsx
│   │   │   └── DashboardLogin.tsx
│   │   ├── contexts/
│   │   │   ├── DashboardAuthContext.tsx
│   │   │   ├── EventContext.tsx
│   │   │   └── RSVPContext.tsx
│   │   ├── lib/
│   │   │   ├── dashboardAuth.ts
│   │   │   ├── dashboardApi.ts
│   │   │   ├── supabaseClient.ts
│   │   │   └── validators.ts
│   │   ├── types/
│   │   │   └── dashboard.ts
│   │   ├── App.tsx
│   │   └── index.css
│   ├── index.html
│   └── vite.config.ts
├── server/
│   └── index.ts                 # Optional backend
├── drizzle/
│   └── schema.ts                # Database schema
├── DASHBOARD_MIGRATION.sql      # Database setup
├── DEPLOY_INSTRUCTIONS.md       # This file
├── DASHBOARD_README.md          # Feature documentation
├── package.json
├── tsconfig.json
├── vite.config.ts
└── .env.local                   # Create this file
```

---

## Verification Checklist

Before deploying to production:

- [ ] `.env.local` file created with Supabase credentials
- [ ] Database migration SQL executed successfully
- [ ] Admin users created in Supabase Auth and admin_users table
- [ ] Event settings initialized
- [ ] `npm run build` completes without errors
- [ ] No TypeScript errors: `npx tsc --noEmit`
- [ ] Can login to dashboard with test credentials
- [ ] Guest list loads correctly
- [ ] Settings can be edited and saved
- [ ] Public invitation page displays correctly
- [ ] Real-time updates work (add test guest while logged in)

---

## Deployment Platforms

### Vercel (Recommended)

```bash
# Connect GitHub repo
# Add environment variables in Vercel dashboard
# Deploy automatically on push
```

### Netlify

```bash
# Connect GitHub repo
# Add environment variables
# Build command: npm run build
# Publish directory: dist
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

### Self-Hosted

```bash
# Build
npm install --legacy-peer-deps
npm run build

# Serve with any static server
# Copy dist/ to web server
# Configure reverse proxy if needed
```

---

## Troubleshooting

### Build Errors

**Error:** `vite: not found`
```bash
npm install --legacy-peer-deps
```

**Error:** Dependency conflicts
```bash
npm install --legacy-peer-deps --force
```

### Runtime Errors

**Error:** `Cannot find Supabase credentials`
- Check `.env.local` file exists
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
- Restart dev server after adding env vars

**Error:** `User is not authorized as admin`
- Verify user exists in `admin_users` table
- Check `is_active` is `true`
- Verify `auth_user_id` matches Supabase Auth user ID

**Error:** `RLS policy violation`
- Check RLS policies are enabled in Supabase
- Verify user is authenticated
- Check user role in `admin_users` table

### Database Issues

**Error:** `relation "admin_users" does not exist`
- Run `DASHBOARD_MIGRATION.sql` in Supabase SQL Editor

**Error:** `permission denied for schema public`
- Ensure you're using correct Supabase credentials
- Check RLS policies are configured correctly

---

## Security Notes

- Never commit `.env.local` to version control
- Use `VITE_SUPABASE_ANON_KEY` (public key) in frontend
- Use `SUPABASE_SERVICE_ROLE_KEY` only on server (if needed)
- Enable RLS on all Supabase tables
- Configure CORS in Supabase if needed
- Use HTTPS in production
- Regularly update dependencies: `npm audit fix`

---

## Support & Documentation

- **Supabase Docs:** https://supabase.com/docs
- **React Docs:** https://react.dev
- **Vite Docs:** https://vitejs.dev
- **TailwindCSS:** https://tailwindcss.com

For detailed feature documentation, see `DASHBOARD_README.md`

---

## Next Steps

1. Set up Supabase project
2. Configure environment variables
3. Run database migration
4. Create admin users
5. Test locally: `npm run dev`
6. Build: `npm run build`
7. Deploy to Vercel/Netlify/your server
8. Configure custom domain (optional)
9. Set up SSL certificate (if self-hosted)
10. Monitor and maintain

---

**Happy wedding planning! 💍**
