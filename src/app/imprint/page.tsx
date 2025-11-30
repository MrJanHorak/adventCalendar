import Link from 'next/link';

export default function Imprint() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50'>
      <nav className='bg-white/80 backdrop-blur-sm border-b border-red-100 sticky top-0 z-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            <Link href='/' className='flex items-center space-x-2'>
              <span className='text-3xl'>🎄</span>
              <span className='text-2xl font-bold text-red-600'>
                Doorly Advent
              </span>
            </Link>
            <Link
              href='/'
              className='text-gray-700 hover:text-red-600 font-medium transition'
            >
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      <main className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='bg-white rounded-2xl shadow-lg p-8 md:p-12'>
          <h1 className='text-4xl font-bold text-gray-800 mb-6'>
            Imprint / Impressum
          </h1>

          <div className='space-y-6 text-gray-700'>
            <section>
              <h2 className='text-2xl font-semibold text-gray-800 mb-3'>
                Information According to § 5 TMG
              </h2>
              <div className='space-y-1'>
                <p>
                  <strong>Service Provider:</strong>
                </p>
                <p>Jan horak</p>
                <p>179 Headwaters Drive</p>
                <p>Harlem, GA , 30814</p>
                <p>USA</p>
              </div>
            </section>

            <section>
              <h2 className='text-2xl font-semibold text-gray-800 mb-3'>
                Contact
              </h2>
              <div className='space-y-1'>
                <p>
                  <strong>Email:</strong>{' '}
                  <a
                    href='mailto:jan-horak@gmx.de'
                    className='text-red-600 hover:underline'
                  >
                    jan-horak@gmx.de
                  </a>
                </p>
                {/* <p>
                  <strong>Phone:</strong> [Your Phone Number] (optional)
                </p> */}
              </div>
            </section>

            <section>
              <h2 className='text-2xl font-semibold text-gray-800 mb-3'>
                Represented By
              </h2>
              <p>Jan Horak</p>
            </section>

            <section>
              <h2 className='text-2xl font-semibold text-gray-800 mb-3'>
                VAT Identification Number
              </h2>
              <p>I am not a company. Not making any profit off of this site.</p>
            </section>

            <section>
              <h2 className='text-2xl font-semibold text-gray-800 mb-3'>
                Dispute Resolution
              </h2>
              <p className='mb-2'>
                The European Commission provides a platform for online dispute
                resolution (ODR):{' '}
                <a
                  href='https://ec.europa.eu/consumers/odr/'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-red-600 hover:underline'
                >
                  https://ec.europa.eu/consumers/odr/
                </a>
              </p>
              <p>
                We are not willing or obliged to participate in dispute
                resolution proceedings before a consumer arbitration board.
              </p>
            </section>

            <section>
              <h2 className='text-2xl font-semibold text-gray-800 mb-3'>
                Liability for Content
              </h2>
              <p>
                As a service provider, we are responsible for our own content on
                these pages under general law. However, we are not obliged to
                monitor transmitted or stored third-party information or to
                investigate circumstances that indicate illegal activity.
              </p>
            </section>

            <section>
              <h2 className='text-2xl font-semibold text-gray-800 mb-3'>
                Liability for Links
              </h2>
              <p>
                Our website contains links to external websites. We have no
                influence on the content of these websites and therefore cannot
                accept any liability for them. The respective provider or
                operator of the linked pages is always responsible for their
                content.
              </p>
            </section>

            <section>
              <h2 className='text-2xl font-semibold text-gray-800 mb-3'>
                Copyright
              </h2>
              <p>
                The content and works created by the site operators on these
                pages are subject to copyright law. Duplication, processing,
                distribution, and any form of commercialization beyond the scope
                of copyright law requires written consent from the respective
                author or creator.
              </p>
            </section>

            <div className='mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg'>
              <p className='text-sm text-gray-600'>
                <strong>Note:</strong> This entire site is just a freely shared
                work for free and fun for the holidays. I make no financial
                profit from this site.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
