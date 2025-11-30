import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
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
      day,
      title,
      content,
      imageUrl,
      videoUrl,
      linkUrl,
      linkText,
      type, // retained for backward compatibility
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

    if (!day || day < 1 || day > 25) {
      return NextResponse.json(
        { error: 'Day must be between 1 and 25' },
        { status: 400 }
      );
    }

    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // Require at least one of text, image, video, or link (check trimmed values)
    const hasContent = content && content.trim();
    const hasImage = imageUrl && imageUrl.trim();
    const hasVideo = videoUrl && videoUrl.trim();
    const hasLink = linkUrl && linkUrl.trim();

    if (!hasContent && !hasImage && !hasVideo && !hasLink) {
      return NextResponse.json(
        {
          error: 'Provide at least one of text, imageUrl, videoUrl, or linkUrl',
        },
        { status: 400 }
      );
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

    const entry = await prisma.calendarEntry.create({
      data: {
        day,
        title,
        content,
        imageUrl,
        videoUrl,
        linkUrl,
        linkText,
        type: type || 'TEXT',
        isPoem: !!isPoem,
        fontFamily: fontFamily || 'Inter',
        fontSize: fontSize || '16px',
        textColor: textColor || '#000000',
        backgroundColor,
        textAlign: textAlign || 'center',
        verticalAlign: verticalAlign || 'middle',
        borderColor,
        borderWidth: borderWidth || '0px',
        borderStyle: borderStyle || 'solid',
        borderRadius: borderRadius || '0px',
        padding: padding || '16px',
        boxShadow: boxShadow || 'none',
        backgroundGradientEnabled: !!backgroundGradientEnabled,
        backgroundGradientColor2,
        borderGradientEnabled: !!borderGradientEnabled,
        borderGradientColor2,
        ...(decorationEnabled !== undefined && {
          decorationEnabled: !!decorationEnabled,
        }),
        ...(decorationType !== undefined && {
          decorationType: decorationType || null,
        }),
        ...(decorationOptions !== undefined && {
          decorationOptions: decorationOptions || null,
        }),
        calendarId: id,
      },
    });

    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    console.error('Error creating entry:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
