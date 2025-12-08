# 🚀 Deployment Guide: Wedding Invitation

Follow these steps to deploy your wedding invitation website to Vercel.

## Prerequisites

1.  A **GitHub** account (to host your code).
2.  A **Vercel** account (to host your website).
3.  A **Supabase** project (for the database).

---

## Step 1: Push Your Code to GitHub

1.  **Create a new repository** on GitHub (e.g., named `wedding-invitation`).
2.  **Upload your files** to this repository.
    *   If you are using the command line:
        ```bash
        git init
        git add .
        git commit -m "Initial commit"
        git branch -M main
        git remote add origin https://github.com/YOUR_USERNAME/wedding-invitation.git
        git push -u origin main
        ```
    *   If you downloaded the ZIP: Unzip it, and upload the files via the GitHub website or GitHub Desktop.

---

## Step 2: Import Project to Vercel

1.  Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **"Add New..."** -> **"Project"**.
3.  Find your `wedding-invitation` repository in the list and click **"Import"**.

---

## Step 3: Configure Project Settings

Vercel will detect that this is a Vite/React project. You usually don't need to change the build settings, but double-check:
*   **Framework Preset:** Vite
*   **Root Directory:** `./` (leave empty/default)

---

## Step 4: Add Environment Variables (CRITICAL)

**Before clicking Deploy**, you must add the environment variables so the site can connect to your database.

1.  Expand the **"Environment Variables"** section.
2.  Add the following variables (get these from your Supabase Project Settings -> API):

| Key | Value |
| :--- | :--- |
| `VITE_SUPABASE_URL` | Your Supabase Project URL (e.g., `https://xyz.supabase.co`) |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase `anon` / `public` key |

3.  Click **"Add"** for each one.

---

## Step 5: Deploy

1.  Click **"Deploy"**.
2.  Wait for a minute while Vercel builds your site.
3.  **Success!** You will get a live URL (e.g., `wedding-invitation.vercel.app`).

---

## Step 6: Verify

1.  Open your new website URL.
2.  Check if the content loads correctly (this confirms the database connection).
3.  Try submitting an RSVP to ensure it saves to Supabase.
