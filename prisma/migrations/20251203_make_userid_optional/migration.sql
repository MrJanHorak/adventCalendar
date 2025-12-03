-- AlterTable
ALTER TABLE "OpenedDoor" ALTER COLUMN "userId" DROP NOT NULL;

-- DropIndex
DROP INDEX IF EXISTS "OpenedDoor_userId_calendarId_day_key";

-- CreateIndex
CREATE INDEX IF NOT EXISTS "OpenedDoor_calendarId_day_idx" ON "OpenedDoor"("calendarId", "day");
