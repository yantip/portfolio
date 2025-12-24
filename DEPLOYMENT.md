# Vercel Deployment Guide

## Prerequisites

1. A Vercel account (free tier works)
2. A GitHub account with this repo pushed
3. Cloudinary account for image uploads

---

## Step 1: Push Your Code to GitHub

Make sure your code is pushed to a GitHub repository.

```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

---

## Step 2: Import Project to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. Click **Import** next to your GitHub repository
4. Vercel will auto-detect it's a Next.js project
5. **Don't deploy yet!** - First add environment variables (Step 4)

---

## Step 3: Create Postgres Database

### Option A: From Your Project (Recommended)

1. In your Vercel project dashboard, click the **Storage** tab
2. Click **Connect Database**
3. Select **Create New** tab
4. Choose **Postgres** → Click **Continue**
5. Choose a provider (Neon is recommended - free tier available)
6. Name your database (e.g., `miki-portfolio-db`)
7. Select a region close to your users (e.g., `iad1` for US East)
8. Click **Create**

The database connection strings will be **automatically added** as environment variables!

### Option B: From Vercel Storage (Alternative)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Storage** in the top navigation
3. Click **Create** → **Postgres**
4. Follow the prompts to create a database
5. After creation, go to **Connect to Project** and link it to your project

---

## Step 4: Configure Environment Variables

In Vercel: **Project Settings** → **Environment Variables**

Add these variables:

| Variable | Value | Notes |
|----------|-------|-------|
| `ADMIN_EMAIL` | `your-email@example.com` | Your admin login email |
| `ADMIN_PASSWORD_HASH` | `$2a$10$...` | See "Generate Password Hash" below |
| `NEXTAUTH_SECRET` | Random 32+ char string | See "Generate Secret" below |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` | Your production URL |
| `CLOUDINARY_CLOUD_NAME` | Your cloud name | From Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | Your API key | From Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | Your API secret | From Cloudinary dashboard |

### Generate Password Hash

Run this in your terminal:

```bash
node -e "require('bcryptjs').hash('YOUR_PASSWORD_HERE', 10).then(h => console.log(h))"
```

Replace `YOUR_PASSWORD_HERE` with your desired admin password.

### Generate Secret

Run this in your terminal:

```bash
openssl rand -base64 32
```

Or use: https://generate-secret.vercel.app/32

---

## Step 5: Deploy

1. Go back to your Vercel project
2. Click **Deploy** (or push a new commit to trigger auto-deploy)
3. Wait for the build to complete (~2-3 minutes)

---

## Step 6: Initialize Database Tables

After your first deployment, create the database tables:

### Option A: Using curl (Terminal)

```bash
curl -X POST https://YOUR-APP.vercel.app/api/db/init
```

### Option B: Using browser console

1. Open your deployed site
2. Open browser DevTools (F12)
3. In Console, run:
   ```javascript
   fetch('/api/db/init', { method: 'POST' }).then(r => r.json()).then(console.log)
   ```

You should see: `{"success":true,"message":"Database initialized successfully"}`

---

## Step 7: Verify & Add Content

1. Visit `https://YOUR-APP.vercel.app/admin`
2. Login with your admin email and password
3. Click **+ New Project** to add your first project
4. Check the homepage to see your project!

---

## 🎉 You're Done!

Your portfolio is now live on Vercel with a real database.

---

## Troubleshooting

### "Database connection failed" or "POSTGRES_URL not found"
- Make sure you created a Postgres database in the Storage tab
- Verify the database is **connected** to your project
- Check Environment Variables - Postgres variables should be auto-added

### "Unauthorized" on admin login
- Double-check `ADMIN_EMAIL` matches exactly what you're typing
- Regenerate `ADMIN_PASSWORD_HASH` with the correct password
- Make sure `NEXTAUTH_SECRET` is set

### "Table does not exist" errors
- Run the database init: `POST /api/db/init`
- Check the response for errors

### Images not uploading
- Verify all 3 Cloudinary variables are set correctly
- Check Cloudinary dashboard for upload presets

---

## Local Development

To develop locally with the production database:

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Link your project:
   ```bash
   vercel link
   ```

3. Pull environment variables:
   ```bash
   vercel env pull .env.local
   ```

4. Run dev server:
   ```bash
   npm run dev
   ```

---

## Useful Links

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Vercel Postgres Docs](https://vercel.com/docs/storage/vercel-postgres)
- [Cloudinary Dashboard](https://cloudinary.com/console)
- [NextAuth.js Docs](https://next-auth.js.org/)
