import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; entryId: string }> }
) {
  try {
    const { entryId } = await params;
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      title,
      content,
      imageUrl,
      videoUrl,
      linkUrl,
      linkText,
      type,
      isPoem,
      fontFamily,
      fontSize,
      textColor,
      backgroundColor,
      textAlign,
      verticalAlign,
      borderColor,
      borderWidth,
      borderStyle,
      borderRadius,
      padding,
      boxShadow,
      backgroundGradientEnabled,
      backgroundGradientColor2,
      borderGradientEnabled,
      borderGradientColor2,
      decorationEnabled,
      decorationType,
      decorationOptions,
    } = await req.json();

    const entry = await prisma.calendarEntry.findUnique({
      where: { id: entryId },
      include: { calendar: true },
    });

    if (!entry) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    }

    if (entry.calendar.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Only include defined values in the update
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (videoUrl !== undefined) updateData.videoUrl = videoUrl;
    if (linkUrl !== undefined) updateData.linkUrl = linkUrl;
    if (linkText !== undefined) updateData.linkText = linkText;
    if (type !== undefined) updateData.type = type;
    if (isPoem !== undefined) updateData.isPoem = !!isPoem;
    if (fontFamily !== undefined && fontFamily !== '')
      updateData.fontFamily = fontFamily;
    if (fontSize !== undefined && fontSize !== '')
      updateData.fontSize = fontSize;
    if (textColor !== undefined && textColor !== '')
      updateData.textColor = textColor;
    if (backgroundColor !== undefined && backgroundColor !== '')
      updateData.backgroundColor = backgroundColor;
    if (textAlign !== undefined && textAlign !== '')
      updateData.textAlign = textAlign;
    if (verticalAlign !== undefined && verticalAlign !== '')
      updateData.verticalAlign = verticalAlign;
    if (borderColor !== undefined && borderColor !== '')
      updateData.borderColor = borderColor;
    if (borderWidth !== undefined && borderWidth !== '')
      updateData.borderWidth = borderWidth;
    if (borderStyle !== undefined && borderStyle !== '')
      updateData.borderStyle = borderStyle;
    if (borderRadius !== undefined && borderRadius !== '')
      updateData.borderRadius = borderRadius;
    if (padding !== undefined && padding !== '') updateData.padding = padding;
    if (boxShadow !== undefined && boxShadow !== '')
      updateData.boxShadow = boxShadow;
    if (backgroundGradientEnabled !== undefined)
      updateData.backgroundGradientEnabled = !!backgroundGradientEnabled;
    if (backgroundGradientColor2 !== undefined)
      updateData.backgroundGradientColor2 = backgroundGradientColor2;
    if (borderGradientEnabled !== undefined)
      updateData.borderGradientEnabled = !!borderGradientEnabled;
    if (borderGradientColor2 !== undefined)
      updateData.borderGradientColor2 = borderGradientColor2;
    if (decorationEnabled !== undefined)
      updateData.decorationEnabled = !!decorationEnabled;
    if (decorationType !== undefined && decorationType !== null)
      updateData.decorationType = decorationType;
    if (decorationOptions !== undefined)
      updateData.decorationOptions =
        decorationOptions === null ? null : decorationOptions;

    const updatedEntry = await prisma.calendarEntry.update({
      where: { id: entryId },
      data: updateData,
    });

    return NextResponse.json(updatedEntry);
  } catch (error) {
    console.error('Error updating entry:', error);
    return NextResponse.json(
      {
        error: 'Something went wrong',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; entryId: string }> }
) {
  try {
    const { entryId } = await params;
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const entry = await prisma.calendarEntry.findUnique({
      where: { id: entryId },
      include: { calendar: true },
    });

    if (!entry) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    }

    if (entry.calendar.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.calendarEntry.delete({
      where: { id: entryId },
    });

    return NextResponse.json({ message: 'Entry deleted' });
  } catch (error) {
    console.error('Error deleting entry:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
