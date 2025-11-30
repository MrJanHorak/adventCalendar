import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const calendar = await prisma.calendar.findUnique({
      where: { id },
      include: { entries: { orderBy: { day: 'asc' } } },
    });

    if (!calendar) {
      return NextResponse.json(
        { error: 'Calendar not found' },
        { status: 404 }
      );
    }

    if (calendar.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(calendar);
  } catch (error) {
    console.error('Error fetching calendar:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const updateData: Record<string, unknown> = {};

    const fields = [
      'title',
      'description',
      'theme',
      'backgroundColor',
      'backgroundPattern',
      'primaryColor',
      'secondaryColor',
      'textColor',
      'snowflakesEnabled',
      'customDecoration',
      'buttonStyle',
      'buttonPrimaryColor',
      'buttonSecondaryColor',
      'dateButtonStyle',
      'datePrimaryColor',
      'dateSecondaryColor',
      'dateTextColor',
      'dateOpenedPrimaryColor',
      'dateOpenedSecondaryColor',
      'dateUnavailableColor',
      'dateBorderRadius',
    ];

    for (const key of fields) {
      if (key in body) {
        const val = body[key];
        if (val !== undefined && val !== '') updateData[key] = val;
      }
    }

    const calendar = await prisma.calendar.findUnique({ where: { id } });
    if (!calendar) {
      return NextResponse.json(
        { error: 'Calendar not found' },
        { status: 404 }
      );
    }
    if (calendar.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updatedCalendar = await prisma.calendar.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedCalendar);
  } catch (error) {
    console.error('Error updating calendar:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const calendar = await prisma.calendar.findUnique({ where: { id } });
    if (!calendar) {
      return NextResponse.json(
        { error: 'Calendar not found' },
        { status: 404 }
      );
    }
    if (calendar.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.calendar.delete({ where: { id } });
    return NextResponse.json({ message: 'Calendar deleted' });
  } catch (error) {
    console.error('Error deleting calendar:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
