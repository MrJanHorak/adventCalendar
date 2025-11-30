import Link from 'next/link';
import Image from 'next/image';

export default function TermsOfService() {
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
            Terms of Service
          </h1>
          <p className='text-sm text-gray-500 mb-8'>
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className='space-y-6 text-gray-700'>
            <section>
              <h2 className='text-2xl font-semibold text-gray-800 mb-3'>
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing and using Doorly Advent, you accept and agree to be
                bound by these Terms of Service. If you do not agree to these
                terms, please do not use our service.
              </p>
            </section>

            <section>
              <h2 className='text-2xl font-semibold text-gray-800 mb-3'>
                2. Service Description
              </h2>
              <p>
                Doorly Advent provides a platform for creating and sharing
                personalized advent calendars with 25 days of content including
                pictures, poems, and text messages.
              </p>
            </section>

            <section>
              <h2 className='text-2xl font-semibold text-gray-800 mb-3'>
                3. User Accounts
              </h2>
              <ul className='list-disc list-inside space-y-2 ml-4'>
                <li>You must provide accurate registration information</li>
                <li>
                  You are responsible for maintaining the security of your
                  account
                </li>
                <li>
                  You are responsible for all activities under your account
                </li>
                <li>One person or entity may not maintain multiple accounts</li>
              </ul>
            </section>

            <section>
              <h2 className='text-2xl font-semibold text-gray-800 mb-3'>
                4. Content Guidelines
              </h2>
              <p className='mb-2'>
                You agree not to upload or share content that:
              </p>
              <ul className='list-disc list-inside space-y-2 ml-4'>
                <li>Is illegal, harmful, or offensive</li>
                <li>Infringes on intellectual property rights</li>
                <li>Contains malware or malicious code</li>
                <li>Violates privacy rights of others</li>
                <li>Is spam or unsolicited advertising</li>
              </ul>
            </section>

            <section>
              <h2 className='text-2xl font-semibold text-gray-800 mb-3'>
                5. Intellectual Property
              </h2>
              <ul className='list-disc list-inside space-y-2 ml-4'>
                <li>
                  You retain ownership of content you upload to Doorly Advent
                </li>
                <li>
                  You grant us a license to store and display your content as
                  necessary to provide the service
                </li>
                <li>You must have the right to use any content you upload</li>
              </ul>
            </section>

            <section>
              <h2 className='text-2xl font-semibold text-gray-800 mb-3'>
                6. Service Availability
              </h2>
              <p>
                We strive to provide reliable service but do not guarantee
                uninterrupted access. We may modify, suspend, or discontinue the
                service at any time without notice.
              </p>
            </section>

            <section>
              <h2 className='text-2xl font-semibold text-gray-800 mb-3'>
                7. Limitation of Liability
              </h2>
              <p>
                Doorly Advent is provided "as is" without warranties of any
                kind. We are not liable for any damages arising from your use of
                the service, including but not limited to data loss, service
                interruptions, or content disputes.
              </p>
            </section>

            <section>
              <h2 className='text-2xl font-semibold text-gray-800 mb-3'>
                8. Termination
              </h2>
              <p className='mb-2'>We reserve the right to:</p>
              <ul className='list-disc list-inside space-y-2 ml-4'>
                <li>Suspend or terminate accounts that violate these terms</li>
                <li>Remove content that violates our guidelines</li>
                <li>Refuse service to anyone for any reason</li>
              </ul>
            </section>

            <section>
              <h2 className='text-2xl font-semibold text-gray-800 mb-3'>
                9. Changes to Terms
              </h2>
              <p>
                We may update these terms at any time. Continued use of the
                service after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className='text-2xl font-semibold text-gray-800 mb-3'>
                10. Governing Law
              </h2>
              <p>
                These terms are governed by the laws of [Your Jurisdiction]. Any
                disputes will be resolved in the courts of [Your Jurisdiction].
              </p>
            </section>

            <section>
              <h2 className='text-2xl font-semibold text-gray-800 mb-3'>
                11. Contact
              </h2>
              <p>
                For questions about these Terms of Service, contact us at:{' '}
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
