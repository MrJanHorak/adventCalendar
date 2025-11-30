import Link from 'next/link';
import Image from 'next/image';

export default function PrivacyPolicy() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50'>
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
            Privacy Policy
          </h1>
          <p className='text-sm text-gray-500 mb-8'>
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className='space-y-6 text-gray-700'>
            <section>
              <h2 className='text-2xl font-semibold text-gray-800 mb-3'>
                1. Information We Collect
              </h2>
              <p className='mb-2'>
                When you use Doorly Advent, we collect the following
                information:
              </p>
              <ul className='list-disc list-inside space-y-2 ml-4'>
                <li>
                  <strong>Account Information:</strong> Email address, name, and
                  password (encrypted)
                </li>
                <li>
                  <strong>Calendar Content:</strong> Text, images, and poems you
                  add to your advent calendars
                </li>
                <li>
                  <strong>Usage Data:</strong> Which doors have been opened and
                  when
                </li>
              </ul>
            </section>

            <section>
              <h2 className='text-2xl font-semibold text-gray-800 mb-3'>
                2. How We Use Your Information
              </h2>
              <p className='mb-2'>Your information is used to:</p>
              <ul className='list-disc list-inside space-y-2 ml-4'>
                <li>Provide and maintain the calendar service</li>
                <li>Allow you to create and share advent calendars</li>
                <li>Track which calendar doors have been opened</li>
                <li>Improve our service and user experience</li>
              </ul>
            </section>

            <section>
              <h2 className='text-2xl font-semibold text-gray-800 mb-3'>
                3. Data Storage and Security
              </h2>
              <p>
                Your data is stored securely in our database. We use
                industry-standard encryption for passwords and secure
                connections (HTTPS) for all data transmission. However, no
                method of transmission over the internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className='text-2xl font-semibold text-gray-800 mb-3'>
                4. Sharing Your Information
              </h2>
              <p className='mb-2'>
                We do not sell or share your personal information with third
                parties, except:
              </p>
              <ul className='list-disc list-inside space-y-2 ml-4'>
                <li>
                  When you explicitly share a calendar link with someone (they
                  can view that calendar&apos;s content)
                </li>
                <li>If required by law or legal process</li>
              </ul>
            </section>

            <section>
              <h2 className='text-2xl font-semibold text-gray-800 mb-3'>
                5. Your Rights
              </h2>
              <p className='mb-2'>You have the right to:</p>
              <ul className='list-disc list-inside space-y-2 ml-4'>
                <li>Access your personal data</li>
                <li>Delete your account and all associated data</li>
                <li>Modify or update your information</li>
                <li>Export your calendar content</li>
              </ul>
            </section>

            <section>
              <h2 className='text-2xl font-semibold text-gray-800 mb-3'>
                6. Cookies
              </h2>
              <p>
                We use essential cookies for authentication and session
                management. These are necessary for the service to function and
                cannot be disabled.
              </p>
            </section>

            <section>
              <h2 className='text-2xl font-semibold text-gray-800 mb-3'>
                7. Children&apos;s Privacy
              </h2>
              <p>
                Our service is not directed to children under 13. We do not
                knowingly collect personal information from children under 13.
              </p>
            </section>

            <section>
              <h2 className='text-2xl font-semibold text-gray-800 mb-3'>
                8. Changes to This Policy
              </h2>
              <p>
                We may update this privacy policy from time to time. We will
                notify users of any material changes by updating the &ldquo;Last
                updated&rdquo; date.
              </p>
            </section>

            <section>
              <h2 className='text-2xl font-semibold text-gray-800 mb-3'>
                9. Contact Us
              </h2>
              <p>
                If you have questions about this Privacy Policy, please contact
                us at:{' '}
                <a
                  href='mailto:doorlyadvent@gmail.com'
                  className='text-red-600 hover:underline'
                >
                  doorlyadvent@gmail.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
