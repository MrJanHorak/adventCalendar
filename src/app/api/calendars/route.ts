import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const calendars = await prisma.calendar.findMany({
      where: { userId: session.user.id },
      include: {
        entries: true,
        _count: {
          select: { entries: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(calendars);
  } catch (error) {
    console.error('Error fetching calendars:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      title,
      description,
      theme,
      backgroundColor,
      backgroundPattern,
      primaryColor,
      secondaryColor,
      textColor,
      snowflakesEnabled,
      customDecoration,
      buttonStyle,
      buttonPrimaryColor,
      buttonSecondaryColor,
    } = await req.json();

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const calendar = await prisma.calendar.create({
      data: {
        title,
        description,
        userId: session.user.id,
        ...(theme !== undefined && { theme }),
        ...(backgroundColor !== undefined && { backgroundColor }),
        ...(backgroundPattern !== undefined && { backgroundPattern }),
        ...(primaryColor !== undefined && { primaryColor }),
        ...(secondaryColor !== undefined && { secondaryColor }),
        ...(textColor !== undefined && { textColor }),
        ...(snowflakesEnabled !== undefined && { snowflakesEnabled }),
        ...(customDecoration !== undefined && { customDecoration }),
        ...(buttonStyle !== undefined && { buttonStyle }),
        ...(buttonPrimaryColor !== undefined && { buttonPrimaryColor }),
        ...(buttonSecondaryColor !== undefined && { buttonSecondaryColor }),
      },
    });

    return NextResponse.json(calendar, { status: 201 });
  } catch (error) {
    console.error('Error creating calendar:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
