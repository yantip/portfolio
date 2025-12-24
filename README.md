# Miki Yaron Portfolio

A clean, typography-driven portfolio website built with Next.js 14, Tailwind CSS, and Prisma.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Database**: SQLite with Prisma ORM
- **Auth**: NextAuth.js with Credentials provider
- **Images**: Cloudinary

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the example environment file and update with your values:

```bash
cp .env.example .env
```

Required variables:

```env
# Database
DATABASE_URL="file:./dev.db"

# Auth - Generate hash with: node scripts/generate-hash.js "your-password"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD_HASH="$2b$10$..."
NEXTAUTH_SECRET="your-random-secret-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### 3. Generate Admin Password Hash

```bash
node scripts/generate-hash.js "your-secure-password"
```

Copy the output hash to your `.env` file.

### 4. Set Up Database

```bash
npx prisma migrate dev
npm run db:seed
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Project Structure

```
├── app/
│   ├── (site)/             # Public routes
│   │   ├── page.tsx        # Home (works grid)
│   │   ├── about/          # About page
│   │   └── work/[slug]/    # Project pages
│   ├── admin/              # Protected admin routes
│   │   ├── login/          # Login page
│   │   └── projects/       # Project management
│   └── api/                # API routes
├── components/             # React components
├── lib/                    # Utilities (prisma, auth, cloudinary)
├── prisma/                 # Database schema and migrations
└── public/                 # Static assets
```

## Pages

- **Home** (`/`): Hero intro + project grid
- **About** (`/about`): Bio, clients, contact
- **Project** (`/work/[slug]`): Video embed + 3 images
- **Admin** (`/admin`): Project management dashboard

## Admin Dashboard

Access the admin dashboard at `/admin/login` with your configured credentials.

Features:
- Add/edit/delete projects
- Upload images to Cloudinary
- Toggle project visibility
- Set display order

## Deployment

This project is optimized for Vercel deployment:

1. Push to GitHub
2. Import to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

**Note**: SQLite resets on each Vercel deploy. For production, consider migrating to:
- Turso (SQLite edge)
- PlanetScale (MySQL)
- Supabase (PostgreSQL)

## Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run db:seed    # Seed database with sample data
npm run db:reset   # Reset database
```

## License

MIT
