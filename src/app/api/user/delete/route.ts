import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const confirm = !!body?.confirm;
    if (!confirm) {
      return NextResponse.json(
        { error: 'Confirmation required.' },
        { status: 400 }
      );
    }

    // Deleting the user will cascade to calendars and openedDoors per schema
    await prisma.user.delete({ where: { id: session.user.id } });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[API:user:delete] Error', e);
    return NextResponse.json(
      { error: 'Failed to delete account.' },
      { status: 500 }
    );
  }
}
