'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function CharityBanner() {
  const [hidden, setHidden] = useState(false);
  const pathname = usePathname();
  
  // Hide banner entirely on publicly shared calendar pages
  if (pathname?.startsWith('/share/')) {
    return null;
  }
  
  if (hidden) return null;

  return (
    <div className='z-[90]'>
      {/* Mobile: full-width sticky bottom bar */}
      <div
        className='fixed inset-x-0 bottom-0 md:hidden'
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className='mx-3 mb-3 rounded-2xl bg-white/95 backdrop-blur-md shadow-lg border border-red-200 px-4 py-3 flex items-center justify-between gap-3'>
          <span className='text-sm text-gray-700'>
            Don&apos;t buy me coffee — buy someone a meal
          </span>
          <div className='flex items-center gap-2'>
            <Link
              href='https://www.feedingamerica.org/'
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center rounded-full bg-gradient-to-r from-red-500 to-green-500 text-white text-sm px-3 py-1 hover:from-red-600 hover:to-green-600 transition shadow'
            >
              Donate
            </Link>
            <button
              aria-label='Dismiss donation banner'
              onClick={() => setHidden(true)}
              className='text-gray-500 hover:text-gray-700 rounded-full px-2 py-1'
            >
              ×
            </button>
          </div>
        </div>
      </div>

      {/* Desktop: floating pill bottom center */}
      <div className='hidden md:block fixed bottom-4 left-1/2 -translate-x-1/2'>
        <div className='bg-white/90 backdrop-blur-md shadow-lg border border-red-200 rounded-full px-5 py-2 flex items-center gap-3'>
          <span className='text-base text-gray-700'>
            Don&apos;t buy me coffee — buy someone a meal
          </span>
          <Link
            href='https://www.feedingamerica.org/'
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center rounded-full bg-gradient-to-r from-red-500 to-green-500 text-white text-base px-4 py-1.5 hover:from-red-600 hover:to-green-600 transition shadow'
          >
            Donate
          </Link>
          <button
            aria-label='Dismiss donation banner'
            onClick={() => setHidden(true)}
            className='text-gray-500 hover:text-gray-700 rounded-full px-2'
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
