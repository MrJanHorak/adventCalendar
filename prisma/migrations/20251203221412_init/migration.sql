-- CreateEnum
CREATE TYPE "EntryType" AS ENUM ('TEXT', 'POEM', 'IMAGE', 'VIDEO');

-- CreateEnum
CREATE TYPE "DecorationType" AS ENUM ('SNOW', 'LIGHTS', 'GLOW', 'CONFETTI', 'STARS', 'CANDLE', 'AURORA', 'RIBBONS');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "password" TEXT NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Calendar" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "shareId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "theme" TEXT DEFAULT 'classic',
    "backgroundColor" TEXT DEFAULT '#f9fafb',
    "backgroundPattern" TEXT DEFAULT 'none',
    "primaryColor" TEXT DEFAULT '#dc2626',
    "secondaryColor" TEXT DEFAULT '#16a34a',
    "textColor" TEXT DEFAULT '#111827',
    "snowflakesEnabled" BOOLEAN NOT NULL DEFAULT true,
    "customDecoration" TEXT,
    "buttonStyle" TEXT DEFAULT 'gradient',
    "buttonPrimaryColor" TEXT DEFAULT '#dc2626',
    "buttonSecondaryColor" TEXT DEFAULT '#16a34a',
    "dateButtonStyle" TEXT DEFAULT 'gradient',
    "datePrimaryColor" TEXT DEFAULT '#dc2626',
    "dateSecondaryColor" TEXT DEFAULT '#16a34a',
    "dateTextColor" TEXT DEFAULT '#ffffff',
    "dateOpenedPrimaryColor" TEXT DEFAULT '#16a34a',
    "dateOpenedSecondaryColor" TEXT DEFAULT '#22c55e',
    "dateUnavailableColor" TEXT DEFAULT '#d1d5db',
    "dateBorderRadius" TEXT DEFAULT '16px',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Calendar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CalendarEntry" (
    "id" TEXT NOT NULL,
    "day" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "imageUrl" TEXT,
    "videoUrl" TEXT,
    "linkUrl" TEXT,
    "linkText" TEXT,
    "type" "EntryType" NOT NULL DEFAULT 'TEXT',
    "isPoem" BOOLEAN NOT NULL DEFAULT false,
    "fontFamily" TEXT DEFAULT 'Inter',
    "fontSize" TEXT DEFAULT '16px',
    "textColor" TEXT DEFAULT '#000000',
    "backgroundColor" TEXT,
    "textAlign" TEXT DEFAULT 'center',
    "verticalAlign" TEXT DEFAULT 'middle',
    "borderColor" TEXT,
    "borderWidth" TEXT DEFAULT '0px',
    "borderStyle" TEXT DEFAULT 'solid',
    "borderRadius" TEXT DEFAULT '0px',
    "padding" TEXT DEFAULT '16px',
    "boxShadow" TEXT DEFAULT 'none',
    "backgroundGradientEnabled" BOOLEAN DEFAULT false,
    "backgroundGradientColor2" TEXT,
    "borderGradientEnabled" BOOLEAN DEFAULT false,
    "borderGradientColor2" TEXT,
    "decorationEnabled" BOOLEAN NOT NULL DEFAULT false,
    "decorationType" "DecorationType",
    "decorationOptions" JSONB,
    "calendarId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CalendarEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OpenedDoor" (
    "id" TEXT NOT NULL,
    "day" INTEGER NOT NULL,
    "userId" TEXT,
    "calendarId" TEXT NOT NULL,
    "openedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OpenedDoor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Calendar_shareId_key" ON "Calendar"("shareId");

-- CreateIndex
CREATE INDEX "Calendar_userId_idx" ON "Calendar"("userId");

-- CreateIndex
CREATE INDEX "Calendar_shareId_idx" ON "Calendar"("shareId");

-- CreateIndex
CREATE INDEX "CalendarEntry_calendarId_idx" ON "CalendarEntry"("calendarId");

-- CreateIndex
CREATE UNIQUE INDEX "CalendarEntry_calendarId_day_key" ON "CalendarEntry"("calendarId", "day");

-- CreateIndex
CREATE INDEX "OpenedDoor_userId_idx" ON "OpenedDoor"("userId");

-- CreateIndex
CREATE INDEX "OpenedDoor_calendarId_idx" ON "OpenedDoor"("calendarId");

-- CreateIndex
CREATE INDEX "OpenedDoor_calendarId_day_idx" ON "OpenedDoor"("calendarId", "day");

-- AddForeignKey
ALTER TABLE "Calendar" ADD CONSTRAINT "Calendar_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalendarEntry" ADD CONSTRAINT "CalendarEntry_calendarId_fkey" FOREIGN KEY ("calendarId") REFERENCES "Calendar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpenedDoor" ADD CONSTRAINT "OpenedDoor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpenedDoor" ADD CONSTRAINT "OpenedDoor_calendarId_fkey" FOREIGN KEY ("calendarId") REFERENCES "Calendar"("id") ON DELETE CASCADE ON UPDATE CASCADE;
