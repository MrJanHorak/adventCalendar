import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
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
      include: {
        entries: {
          orderBy: { day: 'asc' },
        },
      },
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
      dateButtonStyle,
      datePrimaryColor,
      dateSecondaryColor,
      dateTextColor,
      dateOpenedPrimaryColor,
      dateOpenedSecondaryColor,
      dateUnavailableColor,
      dateBorderRadius,
    } = await req.json();

    const calendar = await prisma.calendar.findUnique({
      where: { id },
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

    const updateData: Record<string, unknown> = {};

    if (title !== undefined && title !== '') updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (theme !== undefined && theme !== '') updateData.theme = theme;
    if (backgroundColor !== undefined && backgroundColor !== '')
      updateData.backgroundColor = backgroundColor;
    if (backgroundPattern !== undefined && backgroundPattern !== '')
      updateData.backgroundPattern = backgroundPattern;
    if (primaryColor !== undefined && primaryColor !== '')
      updateData.primaryColor = primaryColor;
    if (secondaryColor !== undefined && secondaryColor !== '')
      updateData.secondaryColor = secondaryColor;
    if (textColor !== undefined && textColor !== '')
      updateData.textColor = textColor;
    if (snowflakesEnabled !== undefined)
      updateData.snowflakesEnabled = snowflakesEnabled;
    if (customDecoration !== undefined && customDecoration !== '')
      updateData.customDecoration = customDecoration;
    if (buttonStyle !== undefined && buttonStyle !== '')
      updateData.buttonStyle = buttonStyle;
    if (buttonPrimaryColor !== undefined && buttonPrimaryColor !== '')
      updateData.buttonPrimaryColor = buttonPrimaryColor;
    if (buttonSecondaryColor !== undefined && buttonSecondaryColor !== '')
      updateData.buttonSecondaryColor = buttonSecondaryColor;
    if (dateButtonStyle !== undefined && dateButtonStyle !== '')
      updateData.dateButtonStyle = dateButtonStyle;
    if (datePrimaryColor !== undefined && datePrimaryColor !== '')
      updateData.datePrimaryColor = datePrimaryColor;
    if (dateSecondaryColor !== undefined && dateSecondaryColor !== '')
      updateData.dateSecondaryColor = dateSecondaryColor;
    if (dateTextColor !== undefined && dateTextColor !== '')
      updateData.dateTextColor = dateTextColor;
    if (dateOpenedPrimaryColor !== undefined && dateOpenedPrimaryColor !== '')
      updateData.dateOpenedPrimaryColor = dateOpenedPrimaryColor;
    if (
      dateOpenedSecondaryColor !== undefined &&
      dateOpenedSecondaryColor !== ''
    )
      updateData.dateOpenedSecondaryColor = dateOpenedSecondaryColor;
    if (dateUnavailableColor !== undefined && dateUnavailableColor !== '')
      updateData.dateUnavailableColor = dateUnavailableColor;
    if (dateBorderRadius !== undefined && dateBorderRadius !== '')
      updateData.dateBorderRadius = dateBorderRadius;

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
  req: NextRequest,
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

    await prisma.calendar.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Calendar deleted' });
  } catch (error) {
    console.error('Error deleting calendar:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
