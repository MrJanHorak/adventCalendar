import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import CopyShareLink from '@/components/CopyShareLink';

export default async function Dashboard() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/signin');
  }

  let calendars: {
    id: string;
    title: string;
    description: string | null;
    shareId: string;
    _count: { entries: number };
  }[] = [];
  try {
    calendars = await prisma.calendar.findMany({
      where: { userId: session.user.id },
      include: {
        _count: {
          select: { entries: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  } catch (e: unknown) {
    // Surface connection or query issues in server logs.
    const error = e as { message?: string; code?: string; stack?: string };
    console.error('[Dashboard] prisma.calendar.findMany failed', {
      message: error?.message,
      code: error?.code,
      stack: error?.stack,
    });
    throw e;
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50 flex flex-col'>
      {/* Navigation */}
      <nav className='bg-white/80 backdrop-blur-sm border-b border-red-100 sticky top-0 z-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            <Link href='/' className='flex items-center space-x-2'>
              <span className='text-3xl'>🎄</span>
              <span className='text-2xl font-bold text-red-600'>
                Doorly Advent
              </span>
            </Link>
            <div className='flex items-center space-x-4'>
              <span className='text-gray-700'>
                Hello, {session.user.name || session.user.email}!
              </span>
              <form action='/api/auth/signout' method='POST'>
                <button className='bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition font-medium'>
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow'>
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-4xl font-bold text-gray-800'>My Calendars</h1>
          <Link
            href='/calendar/create'
            className='bg-gradient-to-r from-red-500 to-green-500 text-white px-6 py-3 rounded-full hover:from-red-600 hover:to-green-600 transition font-semibold shadow-lg'
          >
            + Create New Calendar
          </Link>
        </div>

        {calendars.length === 0 ? (
          <div className='space-y-8'>
            <div className='bg-white rounded-2xl shadow-lg p-12 text-center border-2 border-gray-100'>
              <div className='text-6xl mb-4'>🎁</div>
              <h2 className='text-2xl font-bold text-gray-800 mb-3'>
                No calendars yet
              </h2>
              <p className='text-gray-600 mb-6'>
                Create your first advent calendar and start spreading holiday
                joy!
              </p>
              <Link
                href='/calendar/create'
                className='inline-block bg-gradient-to-r from-red-500 to-green-500 text-white px-8 py-3 rounded-full hover:from-red-600 hover:to-green-600 transition font-semibold'
              >
                Create Your First Calendar
              </Link>
            </div>

            {/* Quick Start Guide */}
            <div className='bg-gradient-to-r from-red-50 to-green-50 rounded-2xl p-8 border-2 border-red-200'>
              <h2 className='text-2xl font-bold text-gray-800 mb-6 text-center'>
                🚀 Quick Start Guide
              </h2>
              <div className='grid md:grid-cols-3 gap-6'>
                <div className='bg-white p-6 rounded-xl shadow-sm'>
                  <div className='text-4xl mb-3'>1️⃣</div>
                  <h3 className='font-bold text-lg mb-2'>Create Calendar</h3>
                  <p className='text-sm text-gray-600'>
                    Give it a name and choose a festive theme
                  </p>
                </div>
                <div className='bg-white p-6 rounded-xl shadow-sm'>
                  <div className='text-4xl mb-3'>2️⃣</div>
                  <h3 className='font-bold text-lg mb-2'>Add 25 Days</h3>
                  <p className='text-sm text-gray-600'>
                    Fill each door with text, images, poems, or videos
                  </p>
                </div>
                <div className='bg-white p-6 rounded-xl shadow-sm'>
                  <div className='text-4xl mb-3'>3️⃣</div>
                  <h3 className='font-bold text-lg mb-2'>Share & Enjoy</h3>
                  <p className='text-sm text-gray-600'>
                    Send the link and watch the magic unfold daily!
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {calendars.map(
              (calendar: {
                id: string;
                title: string;
                description: string | null;
                shareId: string;
                _count: { entries: number };
              }) => (
                <div
                  key={calendar.id}
                  className='bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100 hover:border-red-300 transition'
                >
                  <h3 className='text-xl font-bold text-gray-800 mb-2'>
                    {calendar.title}
                  </h3>
                  {calendar.description && (
                    <p className='text-gray-600 mb-4'>{calendar.description}</p>
                  )}
                  <div className='flex items-center justify-between mb-4'>
                    <span className='text-sm text-gray-500'>
                      {calendar._count.entries} / 25 days filled
                    </span>
                    <div className='w-24 bg-gray-200 rounded-full h-2'>
                      <div
                        className='bg-gradient-to-r from-red-500 to-green-500 h-2 rounded-full'
                        style={{
                          width: `${(calendar._count.entries / 25) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className='flex space-x-2'>
                    <Link
                      href={`/calendar/${calendar.id}/edit`}
                      className='flex-1 text-center bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition font-medium'
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/share/${calendar.shareId}`}
                      className='flex-1 text-center bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition font-medium'
                    >
                      View
                    </Link>
                  </div>
                  <div className='mt-3 pt-3 border-t border-gray-100'>
                    <p className='text-xs text-gray-500 mb-2'>Share:</p>
                    <CopyShareLink
                      shareId={calendar.shareId}
                      className='w-full'
                    />
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className='bg-white border-t border-gray-200 mt-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <div className='flex flex-col md:flex-row justify-between items-center gap-4 text-gray-600'>
            <p className='text-center md:text-left'>
              Made with ❤️ for the holiday season
            </p>
            <div className='flex flex-wrap justify-center gap-6 text-sm'>
              <Link href='/privacy' className='hover:text-red-600 transition'>
                Privacy Policy
              </Link>
              <Link href='/terms' className='hover:text-red-600 transition'>
                Terms of Service
              </Link>
              <Link href='/imprint' className='hover:text-red-600 transition'>
                Imprint
              </Link>
            </div>
          </div>
          <div className='text-center text-sm text-gray-500 mt-4'>
            © {new Date().getFullYear()} Doorly Advent. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
