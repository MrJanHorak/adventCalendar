import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const name = (body?.name ?? '').trim();
    if (!name || name.length < 2 || name.length > 60) {
      return NextResponse.json(
        { error: 'Name must be 2-60 characters.' },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { name },
      select: { id: true, name: true, email: true },
    });

    return NextResponse.json({ user });
  } catch (e) {
    console.error('[API:user:update] Error', e);
    return NextResponse.json(
      { error: 'Failed to update profile.' },
      { status: 500 }
    );
  }
}
