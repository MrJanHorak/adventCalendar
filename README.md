# 🎄 Doorly Advent

A festive web application that allows users to create personalized online advent calendars to share with family, friends, and loved ones. Each calendar contains 25 special entries that can be opened one day at a time throughout December!

Branding: The site is branded as "Doorly Advent" with a red/green split title and a header logo image (`/public/doorlyadvent.png`).

## Table of Contents

- Features
- Tech Stack
- Prerequisites
- Setup Instructions
- Usage Guide
- Project Structure
- Customization
  - Decorations & Themes
- Responsive Design
- Screenshots
- Security Features
- Troubleshooting
- Deployment
- Contributing
- License
- Credits

## ✨ Features

- **User Authentication**: Secure sign-up and login with NextAuth.js
- **Create Calendars**: Design personalized advent calendars with custom titles and descriptions
- **Multi-Content Entries**: Combine text, images, and videos in a single day's entry
- **Flexible Entry Styling**: Apply poem formatting, customize fonts, colors, borders, and shadows per entry
- **Calendar Theming**: Choose from 6 preset themes or create custom color schemes with background patterns
- **25 Days of Content**: Add pictures, poems, or text entries for each day (December 1-25)
- **Video Embedding**: Support for YouTube and Vimeo videos with automatic URL conversion
- **Date-Restricted Access**: Doors can only be opened on their corresponding date
- **Track Progress**: Monitor which doors users have opened
- **Shareable Links**: Generate unique URLs to share calendars with others
- **Owner Preview Mode**: Test all doors before sharing
- **Holiday Theme**: Beautiful festive UI with snowflake animations and holiday colors
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Built-in Help System**: Comprehensive tooltips, quick tips, and help modal
- **Decorations System**: Optional animated decorations including Snowfall, Lights, Glow, Confetti, Stars, Candle, Aurora, and Ribbons
- **Owner/Share Views Polished**: Modal titles, close buttons, and backgrounds dynamically respect entry text/background colors
- **Mobile UX**: Dashboard cards, modals, and share view tuned for small screens

## 🚀 Tech Stack

- **Framework**: Next.js 14+ (currently testing on 16.x Turbopack) with TypeScript and App Router
- **Authentication**: NextAuth.js v5
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS
- **File Uploads**: UploadThing (optional for image uploads)

## 📋 Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud-hosted)
- npm or yarn package manager

## 🛠️ Setup Instructions

### 1. Clone and Install

```bash
cd adventCalendar
npm install
```

### 2. Set Up Database

Update the `.env` file with your database credentials:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/advent_calendar"
```

For local development, you can start a Prisma Postgres instance:

```bash
npx prisma dev
```

Or use your own PostgreSQL database.

### 3. Initialize Database

Generate Prisma client and run migrations:

```bash
npx prisma generate
npx prisma db push
```

### 4. Configure Environment Variables

Update `.env` with required values:

```env
DATABASE_URL="your-database-url"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-secure-random-string"
UPLOADTHING_TOKEN="optional-for-image-uploads"
```

Generate a secure secret for NEXTAUTH_SECRET:

```bash
openssl rand -base64 32
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage Guide

### Creating Your First Calendar

1. **Sign Up**: Create an account at `/auth/signup`
2. **Login**: Sign in at `/auth/signin`
3. **Dashboard**: Access your dashboard to see all calendars
4. **Create Calendar**: Click "Create New Calendar"
5. **Add Entries**: Fill in all 25 days with content
6. **Share**: Copy the share link and send it to recipients!

### Opening Calendar Doors

Recipients can visit the shared link and:

- View all 25 doors
- Open doors starting December 1st
- Each door reveals its content on the corresponding date
- Track which doors they've already opened

## 🗂️ Project Structure

```
adventCalendar/
├── src/
│   ├── app/
│   │   ├── api/              # API routes
│   │   ├── auth/             # Authentication pages
│   │   ├── calendar/         # Calendar management
│   │   ├── dashboard/        # User dashboard
│   │   ├── share/            # Shared calendar viewing
│   │   └── page.tsx          # Landing page
│   ├── lib/
│   │   ├── auth.ts           # NextAuth configuration
│   │   └── prisma.ts         # Prisma client
│   └── types/                # TypeScript definitions
├── prisma/
│   └── schema.prisma         # Database schema
└── .env                      # Environment variables
```

## 🎨 Customization

### Changing Theme Colors

Edit Tailwind classes in components to customize the color scheme. Current theme uses:

- Red (#EF4444) for primary actions
- Green (#10B981) for success states
- Gradient combinations for festive feel

### Adding More Entry Types

The application now supports multi-content entries (text + image + video simultaneously) through a flexible toggle-based UI:

- Users can enable/disable Image and Video fields independently
- Poem styling is applied via a checkbox (`isPoem` field)
- The legacy `type` enum in `schema.prisma` is retained for backward compatibility

**Migration Note**: In a future release, the `type` field may be removed entirely as it's no longer used by the UI. All entry rendering is now based on the presence of `content`, `imageUrl`, `videoUrl`, and the `isPoem` boolean flag.

### Decorations & Themes

Detailed docs on decorations and theme options:

- `DECORATION_EXPANSION.md` — overview of animated decorations and their controls
- `THEME_FEATURES.md` — theme presets, backgrounds, and customization guidance

You can enable decorations per calendar and preview them live in the editor.

## 🔒 Security Features

- Passwords hashed with bcrypt
- JWT-based session management
- Protected routes with middleware
- CSRF protection via NextAuth
- Input validation on all forms

## 📱 Responsive Design

The application is fully responsive and works on:

- Desktop computers
- Tablets
- Mobile phones

Notes:

- Modals use visual viewport units (`svh`) and grid centering for consistent phone behavior.
- Dashboard cards are width-constrained and button stacks adapt on small screens.

## 🖼️ Screenshots

Add screenshots to the `public/` folder and reference them here:

- Dashboard (desktop): `![Dashboard Desktop](public/screenshots/dashboard-desktop.png)`
- Dashboard (mobile): `![Dashboard Mobile](public/screenshots/dashboard-mobile.png)`
- Share view with modal: `![Share Modal](public/screenshots/share-modal.png)`
- Decorations examples: `![Decorations](public/screenshots/decorations.png)`

Optional: include a short GIF showcasing opening doors and animations.

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Test database connection
npx prisma db pull

# Reset database if needed
npx prisma migrate reset
```

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

If you use Turbopack (Next.js 16), you may see non-breaking source map warnings during dev; these do not affect functionality.

## 📦 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Other Platforms

The app can be deployed to any platform supporting Node.js:

- Netlify
- Railway
- Render
- AWS
- DigitalOcean

Make sure to:

- Set all environment variables
- Run database migrations
- Configure proper DATABASE_URL

## 🤝 Contributing

This is a personal project, but suggestions and improvements are welcome!

## 📄 License

MIT License - Feel free to use this for your own holiday celebrations!

## 🎁 Credits

Made with ❤️ for spreading holiday joy!

---

**Happy Holidays! 🎄✨**

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
