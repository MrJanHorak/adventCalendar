import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ shareId: string }> }
) {
  try {
    const { shareId } = await params;
    const session = await auth();

    // Allow anonymous users to open doors (null for anonymous)
    const userId = session?.user?.id || null;

    const { day, force } = await req.json();

    if (!day || day < 1 || day > 25) {
      return NextResponse.json({ error: 'Invalid day' }, { status: 400 });
    }

    const calendar = await prisma.calendar.findUnique({
      where: { shareId },
    });

    if (!calendar) {
      return NextResponse.json(
        { error: 'Calendar not found' },
        { status: 404 }
      );
    }

    // Check if user is owner trying to force open
    const isOwner = session?.user?.id === calendar.userId;
    const allowForceOpen = force === true && isOwner;

    // Date gating rules:
    // - During December: allow doors up to today's date.
    // - After December (any other month): allow catch-up (all days).
    // - Before December (earlier months before the season): keep locked.
    // Skip this check if owner is forcing open.
    if (!allowForceOpen) {
      const now = new Date();
      const month = now.getMonth(); // 0-based (11 = December)
      const today = now.getDate();

      let allowed = false;
      if (month === 11) {
        // December window
        allowed = day <= today;
      } else if (month !== 11 && month > 11) {
        // This condition would never hit (month > 11 invalid). Left for clarity.
        allowed = true;
      } else if (month !== 11 && month < 11) {
        // Months after the season has passed (Jan-Nov of following year): allow catch-up.
        // We treat any non-December month as post-season for simplicity.
        allowed = true;
      }

      if (!allowed) {
        return NextResponse.json(
          { error: 'This door cannot be opened yet!' },
          { status: 403 }
        );
      }
    }

    // Check if already opened
    // For anonymous users, we check by calendar and day only
    // For logged-in users, we check by userId, calendar, and day
    let existing;
    if (userId) {
      existing = await prisma.openedDoor.findFirst({
        where: {
          userId,
          calendarId: calendar.id,
          day,
        },
      });
    } else {
      // For anonymous users, we'll still create a record but won't prevent duplicates
      // since we can't track them uniquely. Could use session/cookies for better tracking.
      existing = null;
    }

    if (existing) {
      return NextResponse.json({
        alreadyOpened: true,
        openedAt: existing.openedAt,
      });
    }

    // Mark as opened
    const openedDoor = await prisma.openedDoor.create({
      data: {
        day,
        userId: userId || undefined, // Use undefined for Prisma to handle null
        calendarId: calendar.id,
      },
    });

    return NextResponse.json({
      alreadyOpened: false,
      openedAt: openedDoor.openedAt,
    });
  } catch (error) {
    console.error('Error opening door:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ shareId: string }> }
) {
  try {
    const { shareId } = await params;
    const session = await auth();

    const userId = session?.user?.id || null;

    const calendar = await prisma.calendar.findUnique({
      where: { shareId },
    });

    if (!calendar) {
      return NextResponse.json(
        { error: 'Calendar not found' },
        { status: 404 }
      );
    }

    // Only fetch opened doors for logged-in users
    if (!userId) {
      return NextResponse.json([]);
    }

    const openedDoors = await prisma.openedDoor.findMany({
      where: {
        userId,
        calendarId: calendar.id,
      },
      select: {
        day: true,
        openedAt: true,
      },
    });

    return NextResponse.json(openedDoors);
  } catch (error) {
    console.error('Error fetching opened doors:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
