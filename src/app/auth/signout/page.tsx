'use client';

import Image from 'next/image';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

export default function SignOutPage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50 flex flex-col'>
      {/* Navigation */}
      <nav className='bg-white/80 backdrop-blur-sm border-b border-red-100 sticky top-0 z-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            <Link href='/' className='flex items-center space-x-2'>
              <Image
                src='/doorlyadvent.png'
                alt='Doorly Advent Logo'
                width={40}
                height={40}
                className='object-contain'
              />
              <span className='text-2xl font-bold'>
                <span className='text-red-600'>Doorly</span>{' '}
                <span className='text-green-600'>Advent</span>
              </span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className='flex-grow max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-100 text-center'>
          <div className='text-5xl mb-4'>👋</div>
          <h1 className='text-3xl font-bold text-gray-800 mb-2'>Sign Out</h1>
          <p className='text-gray-600 mb-6'>
            Are you sure you want to sign out? You can always come back to
            create or view your calendars.
          </p>
          <div className='flex flex-col sm:flex-row justify-center gap-3'>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className='bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600 transition font-semibold'
            >
              Yes, Sign Me Out
            </button>
            <Link
              href='/'
              className='bg-white text-gray-700 px-6 py-3 rounded-full border-2 border-gray-200 hover:bg-gray-50 transition font-semibold'
            >
              Stay Signed In
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className='bg-white border-t border-gray-200'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-600'>
          Made with ❤️ for the holiday season
        </div>
      </footer>
    </div>
  );
}
