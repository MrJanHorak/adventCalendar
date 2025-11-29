# Holiday Advent Calendar Project Setup

## Project Overview

Full-stack holiday advent calendar website with user authentication and personalized calendars.

## Completed Steps

- [x] Create copilot-instructions.md
- [x] Scaffold Next.js project
- [x] Setup database and authentication
- [x] Create calendar features
- [x] Build UI components
- [x] Test and compile project

## Technology Stack

- Next.js 14+ with TypeScript and App Router
- NextAuth.js for authentication
- Prisma ORM with PostgreSQL
- Tailwind CSS for styling
- File upload support for images

## Features

- User authentication (login/register)
- Create personalized advent calendars with 25 entries
- Support for pictures, poems, and text entries
- Date-restricted door opening (December 1-25)
- Track which doors users have opened
- Shareable URLs for calendars
- Holiday themed UI with animations

## Setup Instructions

### 1. Database Setup

Configure your `.env` file with your PostgreSQL database:

```
DATABASE_URL="postgresql://user:password@localhost:5432/advent_calendar"
```

Or start a local Prisma Postgres instance:

```bash
npx prisma dev
```

### 2. Generate Prisma Client & Push Schema

```bash
npx prisma generate
npx prisma db push
```

### 3. Configure Environment Variables

Update `.env` with:

- `NEXTAUTH_URL` - Your app URL (http://localhost:3000 for development)
- `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`
- `UPLOADTHING_TOKEN` - Optional, for image uploads

### 4. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## Project Status

✅ **Complete and ready to use!**

The project has been successfully built and tested. All features are implemented and working.
