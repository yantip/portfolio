# Vercel Deployment Guide

## Prerequisites

1. A Vercel account (free tier works)
2. A GitHub account with this repo pushed
3. Cloudinary account for image uploads

## Step 1: Create Vercel Postgres Database

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Storage** in the top navigation
3. Click **Create Database**
4. Select **Postgres** and click **Continue**
5. Name your database (e.g., `miki-portfolio-db`)
6. Select a region close to your users
7. Click **Create**

The database connection strings will be automatically available as environment variables.

## Step 2: Import Project to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Vercel will auto-detect Next.js

## Step 3: Configure Environment Variables

In your Vercel project settings, add these environment variables:

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `ADMIN_EMAIL` | Admin login email | `admin@mikiyaron.com` |
| `ADMIN_PASSWORD_HASH` | Bcrypt hash of admin password | (see below) |
| `NEXTAUTH_SECRET` | Random string for session encryption | (use `openssl rand -base64 32`) |
| `NEXTAUTH_URL` | Your production URL | `https://your-domain.vercel.app` |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name | `your-cloud-name` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `123456789012345` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `your-api-secret` |

### Generate Password Hash

Run this command to generate a bcrypt hash for your admin password:

```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('your-password-here', 10).then(h => console.log(h))"
```

### Postgres Variables (Auto-added by Vercel)

When you link your Postgres database to your project, Vercel automatically adds:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_USER`
- `POSTGRES_HOST`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`

## Step 4: Link Database to Project

1. In Vercel Dashboard, go to your project
2. Click **Storage** tab
3. Click **Connect** next to your Postgres database
4. Select your project and environment (Production)

## Step 5: Deploy

1. Click **Deploy** in Vercel
2. Wait for the build to complete

## Step 6: Initialize Database

After deployment, initialize the database tables:

1. Visit: `https://your-domain.vercel.app/api/db/init`
2. You should see: `{"status":"connected","tableExists":false,...}`
3. Send a POST request to create tables:
   ```bash
   curl -X POST https://your-domain.vercel.app/api/db/init
   ```
4. You should see: `{"success":true,"message":"Database initialized successfully"}`

## Step 7: Add Your First Project

1. Go to `https://your-domain.vercel.app/admin`
2. Login with your admin credentials
3. Click **+ New Project**
4. Fill in the project details and save

## Troubleshooting

### "Database connection failed"
- Make sure the Postgres database is linked to your project
- Check that environment variables are set in Vercel

### "Unauthorized" on admin pages
- Verify `ADMIN_EMAIL` and `ADMIN_PASSWORD_HASH` are set correctly
- Make sure `NEXTAUTH_SECRET` is set

### Images not uploading
- Verify Cloudinary credentials are correct
- Check Cloudinary upload preset settings

## Local Development

For local development, create a `.env.local` file:

```env
# Get these from Vercel after linking your database
POSTGRES_URL="postgres://..."

# Auth
ADMIN_EMAIL="admin@mikiyaron.com"
ADMIN_PASSWORD_HASH="$2a$10$..."
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

Then run:
```bash
npm run dev
```

