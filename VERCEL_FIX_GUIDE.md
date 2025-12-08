# Vercel Dashboard Fix Guide

## Problem
Your dashboard deployed to Vercel but shows a 404 error when you visit the URL.

## Root Cause
The dashboard was missing:
1. Proper root route redirect to `/dashboard/login`
2. Environment variables in Vercel
3. Supabase database setup

---

## Solution - Step by Step

### Step 1: Add Environment Variables to Vercel

**IMPORTANT:** Without these, the dashboard cannot connect to Supabase!

1. Go to your Vercel project: https://vercel.com/dashboard
2. Click on your "new-dashboard" project
3. Go to **Settings** → **Environment Variables**
4. Add these two variables:

```
VITE_SUPABASE_URL = https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY = your_anon_key_here
```

**Where to find these values:**
- Go to https://supabase.com
- Open your project
- Click **Settings** → **API**
- Copy the values from there

5. Click **Save**

### Step 2: Redeploy Your Project

1. In Vercel, go to **Deployments**
2. Find the latest deployment
3. Click the **three dots** menu
4. Click **Redeploy**
5. Wait for the new deployment to complete

### Step 3: Setup Supabase Database

**IMPORTANT:** The dashboard needs a database to store admin users!

1. Go to https://supabase.com
2. Open your project
3. Go to **SQL Editor**
4. Create a new query
5. Copy and paste the entire contents of `DASHBOARD_MIGRATION.sql`
6. Click **Run**
7. Wait for it to complete

### Step 4: Create Admin Users

1. In Supabase, go to **Authentication** → **Users**
2. Click **Add User**
3. Create two users:
   - Email: `bride@example.com` (password: any secure password)
   - Email: `groom@example.com` (password: any secure password)
4. Note their **User IDs** (you'll need them)

### Step 5: Add Admin Users to Database

1. In Supabase, go to **SQL Editor**
2. Create a new query
3. Paste this SQL (replace the USER_IDs with actual values from step 4):

```sql
INSERT INTO admin_users (auth_user_id, email, full_name, role, is_active)
VALUES 
  ('PASTE_BRIDE_USER_ID_HERE', 'bride@example.com', 'Bride Name', 'bride', true),
  ('PASTE_GROOM_USER_ID_HERE', 'groom@example.com', 'Groom Name', 'groom', true);
```

4. Click **Run**

### Step 6: Test Your Dashboard

1. Visit your Vercel URL: `https://new-dashboard-mu-seven.vercel.app`
2. You should now see the **Login Page**
3. Try logging in with:
   - Email: `bride@example.com`
   - Password: (the password you set in step 4)
4. You should see the **Guest Dashboard**

---

## Troubleshooting

### Still Seeing 404?
- Check that environment variables are set in Vercel
- Click **Redeploy** again
- Wait 2-3 minutes for the new deployment
- Clear your browser cache (Ctrl+Shift+Delete)

### Login Not Working?
- Verify admin users were created in Supabase
- Check that the email and password are correct
- Verify the database migration ran successfully

### Can't See Guest Data?
- Make sure the RSVP table has data
- Check that RLS policies are enabled in Supabase
- Verify Supabase credentials are correct

### Getting Errors in Browser Console?
- Open browser DevTools (F12)
- Check the **Console** tab for error messages
- Common errors:
  - "Cannot read property 'from' of undefined" = Supabase not initialized
  - "User is not an admin" = Admin user not created in database
  - "VITE_SUPABASE_URL is not defined" = Environment variables not set

---

## Quick Checklist

- [ ] Supabase project created
- [ ] Environment variables added to Vercel
- [ ] Vercel project redeployed
- [ ] Database migration SQL executed
- [ ] Admin users created in Supabase Auth
- [ ] Admin users added to admin_users table
- [ ] Dashboard shows login page
- [ ] Can login with admin credentials
- [ ] Guest list displays

---

## What Changed in This Version

1. **Fixed App.tsx** - Now redirects `/` to `/dashboard/login`
2. **Fixed Dashboard.tsx** - Better route handling and loading states
3. **Better error handling** - More informative error messages

---

## Need Help?

If you're still having issues:

1. Check the browser console (F12) for error messages
2. Check Vercel deployment logs for build errors
3. Verify all environment variables are set
4. Verify database migration completed successfully
5. Verify admin users exist in Supabase

---

## Next Steps

Once the dashboard is working:

1. Deploy the invitation website to Vercel (same process)
2. Test that RSVP form submits data to Supabase
3. Verify the dashboard shows the submitted RSVPs
4. Configure custom domains (optional)

---

**Your dashboard should now work! 🎉**
