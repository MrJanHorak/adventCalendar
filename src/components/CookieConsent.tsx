'use client';

import { useEffect, useState } from 'react';

const loadGoogleAnalytics = () => {
  // Load gtag script if not already loaded
  if (!window.gtag) {
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = 'https://www.googletagmanager.com/gtag/js?id=G-F7Q8ZBCPYJ';
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-F7Q8ZBCPYJ', {
        'anonymize_ip': true,
        'cookie_flags': 'SameSite=None;Secure'
      });
    `;
    document.head.appendChild(script2);
  }
};

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent');

    if (consent) {
      // User already made a choice
      if (consent === 'accepted') {
        loadGoogleAnalytics();
      }
      return;
    }

    // Detect if user is in EU/EEA region
    fetch('https://ipapi.co/json/')
      .then((res) => res.json())
      .then((data) => {
        const euCountries = [
          'AT',
          'BE',
          'BG',
          'HR',
          'CY',
          'CZ',
          'DK',
          'EE',
          'FI',
          'FR',
          'DE',
          'GR',
          'HU',
          'IE',
          'IT',
          'LV',
          'LT',
          'LU',
          'MT',
          'NL',
          'PL',
          'PT',
          'RO',
          'SK',
          'SI',
          'ES',
          'SE',
          'IS',
          'LI',
          'NO',
        ];

        const userInEU = euCountries.includes(data.country_code);

        if (userInEU) {
          setShowBanner(true);
        } else {
          // Non-EU users: load analytics immediately
          loadGoogleAnalytics();
        }
      })
      .catch(() => {
        // If geolocation fails, show banner to be safe
        setShowBanner(true);
      });
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    loadGoogleAnalytics();
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className='fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-2xl z-[200] p-4 md:p-6'>
      <div className='max-w-6xl mx-auto'>
        <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
          <div className='flex-1'>
            <h3 className='font-bold text-gray-900 mb-2'>
              🍪 We value your privacy
            </h3>
            <p className='text-sm text-gray-600'>
              We use cookies and analytics to improve your experience and
              understand how our site is used. You can choose to accept or
              decline. For more information, see our{' '}
              <a
                href='/privacy'
                className='text-green-600 hover:text-green-700 underline'
              >
                Privacy Policy
              </a>
              .
            </p>
          </div>
          <div className='flex gap-3 flex-shrink-0'>
            <button
              onClick={handleDecline}
              className='px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-semibold transition'
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className='px-6 py-2 bg-gradient-to-r from-red-500 to-green-600 text-white rounded-lg font-semibold hover:opacity-90 transition shadow-lg'
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Type declaration for gtag
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}
