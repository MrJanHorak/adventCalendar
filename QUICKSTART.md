# 🎄 Quick Start Guide - Holiday Advent Calendar

## Welcome! 

You now have a fully functional holiday advent calendar application. Here's how to get started:

## 🚀 Getting Started

### 1. Set Up Your Database

You have two options:

**Option A: Use Prisma Local Postgres (Easiest)**
```bash
npx prisma dev
```
This starts a local PostgreSQL database automatically.

**Option B: Use Your Own PostgreSQL Database**
Update `.env` with your database URL:
```
DATABASE_URL="postgresql://username:password@localhost:5432/advent_calendar"
```

### 2. Initialize the Database

```bash
npx prisma generate
npx prisma db push
```

### 3. Configure Environment Variables

Open `.env` and update:

```env
DATABASE_URL="your-database-url"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-this-with-openssl"
```

Generate a secure secret:
```bash
openssl rand -base64 32
```

### 4. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## 📝 First Steps

1. **Create an Account**
   - Go to `/auth/signup`
   - Register with your email and password

2. **Create Your First Calendar**
   - Click "Create New Calendar"
   - Add a title and description
   - Start filling in the 25 days!

3. **Add Entries**
   - Click on any day number (1-25)
   - Choose entry type: Text, Poem, or Image
   - Add your content
   - Save!

4. **Share Your Calendar**
   - Copy the share link from your dashboard
   - Send it to family and friends
   - They can open doors starting December 1st!

## 🎯 Key Features

- **Date Restrictions**: Doors can only be opened on their date (Dec 1-25)
- **Progress Tracking**: See which doors have been opened
- **Multiple Calendars**: Create as many calendars as you want
- **Shareable**: Each calendar gets a unique URL
- **Beautiful UI**: Holiday-themed with snowflake animations

## 🔧 Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

npx prisma studio    # Open Prisma database viewer
npx prisma generate  # Regenerate Prisma client
npx prisma db push   # Push schema changes to database
```

## 📖 Project Structure

```
src/
├── app/
│   ├── api/              # API routes for backend
│   ├── auth/             # Sign in/up pages
│   ├── calendar/         # Calendar management
│   ├── dashboard/        # User dashboard
│   ├── share/            # Public calendar viewing
│   └── page.tsx          # Landing page
├── lib/
│   ├── auth.ts           # NextAuth config
│   └── prisma.ts         # Database client
└── types/                # TypeScript definitions

prisma/
└── schema.prisma         # Database schema
```

## 🎨 Customizing

### Change Colors
Edit the Tailwind classes in components:
- Red: `bg-red-500`, `text-red-600`
- Green: `bg-green-500`, `text-green-600`

### Add More Entry Types
1. Update `prisma/schema.prisma`
2. Run `npx prisma db push`
3. Update the UI components

## 🐛 Troubleshooting

### "Can't connect to database"
- Check your DATABASE_URL in `.env`
- Make sure PostgreSQL is running
- Try `npx prisma db push`

### "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build errors
```bash
rm -rf .next
npm run build
```

## 🌟 Tips

1. **Test in December**: The date restrictions work based on the current date
2. **Images**: Use image URLs (e.g., from Imgur, Cloudinary)
3. **Poems**: Use line breaks for better formatting
4. **Share Early**: Send links before December starts!

## 📚 Next Steps

- Deploy to Vercel, Railway, or another hosting platform
- Add your own styling and branding
- Customize the entry types
- Add email notifications
- Implement image upload with UploadThing

## 🎁 Have Fun!

Create magical advent calendars and spread holiday joy! 

If you need help, check the full README.md for more details.

---

**Happy Holidays! 🎄✨**
