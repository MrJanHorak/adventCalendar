import Link from 'next/link';
import { auth } from '@/lib/auth';
import IdeasSection from '@/components/IdeasSection';

export default async function Home() {
  const session = await auth();

  return (
    <div className='min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50'>
      {/* Snowflakes decoration */}
      <div className='fixed inset-0 pointer-events-none overflow-hidden'>
        <div className='snowflake'>❄</div>
        <div className='snowflake'>❅</div>
        <div className='snowflake'>❆</div>
      </div>

      {/* Navigation */}
      <nav className='bg-white/80 backdrop-blur-sm border-b border-red-100 sticky top-0 z-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            <div className='flex items-center space-x-2'>
              <span className='text-3xl'>🎄</span>
              <span className='text-2xl font-bold text-red-600'>
                Doorly Advent
              </span>
            </div>
            <div className='flex items-center space-x-4'>
              {session ? (
                <>
                  <Link
                    href='/dashboard'
                    className='text-gray-700 hover:text-red-600 font-medium transition'
                  >
                    Dashboard
                  </Link>
                  <form action='/api/auth/signout' method='POST'>
                    <button className='bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition font-medium'>
                      Sign Out
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link
                    href='/auth/signin'
                    className='text-gray-700 hover:text-red-600 font-medium transition'
                  >
                    Sign In
                  </Link>
                  <Link
                    href='/auth/signup'
                    className='bg-gradient-to-r from-red-500 to-green-500 text-white px-6 py-2 rounded-full hover:from-red-600 hover:to-green-600 transition font-medium'
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20'>
        <div className='text-center space-y-8'>
          <h1 className='text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-green-600 to-red-600 animate-gradient'>
            Create Your Magical
            <br />
            Advent Calendar
          </h1>

          <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
            Spread joy this holiday season! Create personalized advent calendars
            with pictures, poems, and special messages for your loved ones.
          </p>

          <div className='flex flex-wrap justify-center gap-4'>
            <Link
              href={session ? '/dashboard' : '/auth/signup'}
              className='bg-gradient-to-r from-red-500 to-green-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-red-600 hover:to-green-600 transition transform hover:scale-105 shadow-lg'
            >
              {session ? 'Go to Dashboard' : 'Get Started Free'}
            </Link>
            <Link
              href='/demo'
              className='bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:opacity-90 transition transform hover:scale-105 shadow-lg'
            >
              🎁 View Demo Calendar
            </Link>
            <Link
              href='#features'
              className='bg-white text-gray-700 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-50 transition border-2 border-gray-200'
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Features */}
        <div id='features' className='mt-32 grid md:grid-cols-3 gap-8'>
          <div className='bg-white p-8 rounded-2xl shadow-lg border-2 border-red-100 hover:border-red-300 transition'>
            <div className='text-5xl mb-4'>🎁</div>
            <h3 className='text-2xl font-bold text-gray-800 mb-3'>
              25 Days of Joy
            </h3>
            <p className='text-gray-600'>
              Create 25 unique entries filled with pictures, poems, or heartfelt
              messages. Each day reveals a new surprise!
            </p>
          </div>

          <div className='bg-white p-8 rounded-2xl shadow-lg border-2 border-green-100 hover:border-green-300 transition'>
            <div className='text-5xl mb-4'>🔗</div>
            <h3 className='text-2xl font-bold text-gray-800 mb-3'>
              Share with Love
            </h3>
            <p className='text-gray-600'>
              Generate a unique share link for your calendar. Send it to family,
              friends, or that special someone!
            </p>
          </div>

          <div className='bg-white p-8 rounded-2xl shadow-lg border-2 border-red-100 hover:border-red-300 transition'>
            <div className='text-5xl mb-4'>📅</div>
            <h3 className='text-2xl font-bold text-gray-800 mb-3'>
              Daily Surprises
            </h3>
            <p className='text-gray-600'>
              Each door opens only on its special day in December. Track which
              doors have been opened!
            </p>
          </div>
        </div>

        {/* Ideas & Inspiration Section */}
        <IdeasSection />

        {/* How it Works */}
        <div className='mt-32 bg-white rounded-3xl shadow-2xl p-12 border-4 border-green-200'>
          <h2 className='text-4xl font-bold text-center text-gray-800 mb-12'>
            How It Works
          </h2>
          <div className='grid md:grid-cols-4 gap-8'>
            <div className='text-center'>
              <div className='bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-red-600'>
                1
              </div>
              <h4 className='font-semibold text-lg mb-2'>Sign Up</h4>
              <p className='text-gray-600'>
                Create your free account in seconds
              </p>
            </div>
            <div className='text-center'>
              <div className='bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-green-600'>
                2
              </div>
              <h4 className='font-semibold text-lg mb-2'>Create Calendar</h4>
              <p className='text-gray-600'>Add 25 days of special content</p>
            </div>
            <div className='text-center'>
              <div className='bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-red-600'>
                3
              </div>
              <h4 className='font-semibold text-lg mb-2'>Share Link</h4>
              <p className='text-gray-600'>Send your unique calendar URL</p>
            </div>
            <div className='text-center'>
              <div className='bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-green-600'>
                4
              </div>
              <h4 className='font-semibold text-lg mb-2'>Spread Joy</h4>
              <p className='text-gray-600'>Recipients open doors each day</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className='bg-white border-t border-gray-200 mt-32'>
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
