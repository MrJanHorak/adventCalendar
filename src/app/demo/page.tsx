'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getThemeStyles, getThemePreset } from '@/lib/themes';

// Demo calendar data
const demoCalendar = {
  id: 'demo',
  title: '🎄 Holiday Magic Advent Calendar 2024',
  description:
    'Experience the joy of a personalized advent calendar! This demo showcases poems, images, videos, and special messages.',
  theme: 'classic',
  entries: [
    {
      day: 1,
      title: 'Welcome to December! 🎅',
      content:
        'The holiday season has begun!\n\nLet the countdown to Christmas fill your days with joy, wonder, and magical moments.',
      fontFamily: 'Georgia',
      fontSize: '18px',
      textColor: '#1e293b',
      backgroundColor: '#fef3c7',
      textAlign: 'center',
      verticalAlign: 'middle',
      borderColor: '#fbbf24',
      borderWidth: '3px',
      borderStyle: 'solid',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 4px 12px rgba(251, 191, 36, 0.3)',
    },
    {
      day: 2,
      title: 'A Holiday Poem ✨',
      content:
        'Twas the season of wonder and light,\nWhen snowflakes danced through the night.\nWith joy in our hearts and stars above,\nWe celebrate this season of love.',
      isPoem: true,
      fontFamily: 'Georgia',
      fontSize: '16px',
      textColor: '#4a5568',
      backgroundColor: '#fef3c7',
      textAlign: 'center',
      verticalAlign: 'middle',
      borderColor: '#dc2626',
      borderWidth: '2px',
      borderStyle: 'dashed',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    },
    {
      day: 3,
      title: 'Winter Wonderland 🏔️',
      content:
        "Behold the beauty of winter! Nature's artistry on full display.",
      imageUrl:
        'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800',
      fontFamily: 'Inter',
      fontSize: '16px',
      textColor: '#1e293b',
      backgroundColor: '#ffffff',
      textAlign: 'center',
      verticalAlign: 'top',
      borderRadius: '16px',
      padding: '16px',
    },
    {
      day: 4,
      title: 'Classic Holiday Song 🎵',
      content:
        'Listen to this timeless Christmas classic that brings warmth to every heart.',
      videoUrl: 'https://www.youtube.com/embed/yXQViqx6GMY',
      fontFamily: 'Inter',
      fontSize: '14px',
      textColor: '#4a5568',
      backgroundColor: '#fef3c7',
      textAlign: 'center',
      verticalAlign: 'top',
      borderRadius: '12px',
      padding: '16px',
    },
    {
      day: 5,
      title: 'Hot Cocoa Recipe ☕',
      content: 'Warm up with this delicious homemade hot chocolate recipe!',
      linkUrl: 'https://www.allrecipes.com/recipe/20211/creamy-hot-cocoa/',
      linkText: 'Get the Recipe',
      fontFamily: 'Inter',
      fontSize: '16px',
      textColor: '#1e293b',
      backgroundColor: '#fecaca',
      textAlign: 'center',
      verticalAlign: 'middle',
      borderRadius: '16px',
      padding: '20px',
      boxShadow: '0 4px 12px rgba(220, 38, 38, 0.2)',
    },
    {
      day: 6,
      title: 'Cozy Moments 🔥',
      content: "There's nothing quite like the warmth of the season.",
      imageUrl:
        'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=800',
      fontFamily: 'Inter',
      fontSize: '16px',
      textColor: '#1e293b',
      backgroundColor: '#ffffff',
      textAlign: 'center',
      verticalAlign: 'bottom',
      borderRadius: '16px',
      padding: '16px',
    },
    {
      day: 7,
      title: 'Week One Complete! 🌟',
      content:
        "You're already one week into the holiday countdown!\n\nEach day brings us closer to the magic of Christmas. Keep the spirit alive!",
      fontFamily: 'Arial',
      fontSize: '16px',
      textColor: '#ffffff',
      backgroundColor: '#dc2626',
      textAlign: 'center',
      verticalAlign: 'middle',
      borderRadius: '20px',
      padding: '24px',
      boxShadow: '0 8px 16px rgba(220, 38, 38, 0.4)',
    },
    {
      day: 8,
      title: 'Gingerbread Joy 🍪',
      content: 'Sweet treats make everything better!',
      imageUrl:
        'https://images.unsplash.com/photo-1514517521153-1be72277b32f?w=800',
      fontFamily: 'Inter',
      fontSize: '14px',
      textColor: '#4a5568',
      backgroundColor: '#ffffff',
      textAlign: 'center',
      verticalAlign: 'top',
      borderRadius: '12px',
      padding: '16px',
    },
    {
      day: 9,
      title: 'Holiday Inspiration 💫',
      content:
        '"Christmas waves a magic wand over this world, and behold, everything is softer and more beautiful."\n\n- Norman Vincent Peale',
      isPoem: true,
      fontFamily: 'Georgia',
      fontSize: '16px',
      textColor: '#1e293b',
      backgroundColor: '#fef3c7',
      textAlign: 'center',
      verticalAlign: 'middle',
      borderColor: '#fbbf24',
      borderWidth: '2px',
      borderStyle: 'solid',
      borderRadius: '12px',
      padding: '20px',
    },
    {
      day: 10,
      title: 'Christmas Carol 🎶',
      content: 'Enjoy this beautiful rendition of a holiday favorite.',
      videoUrl: 'https://www.youtube.com/embed/WSUFzC6_fp8',
      fontFamily: 'Inter',
      fontSize: '14px',
      textColor: '#4a5568',
      backgroundColor: '#fef3c7',
      textAlign: 'center',
      verticalAlign: 'top',
      borderRadius: '12px',
      padding: '16px',
    },
    {
      day: 11,
      title: 'Festive Lights ✨',
      content:
        'The glow of holiday lights brings warmth to the coldest nights.',
      imageUrl:
        'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=800',
      fontFamily: 'Inter',
      fontSize: '16px',
      textColor: '#ffffff',
      backgroundColor: '#1e293b',
      textAlign: 'center',
      verticalAlign: 'bottom',
      borderRadius: '16px',
      padding: '16px',
    },
    {
      day: 12,
      title: 'DIY Ornament Craft 🎨',
      content: 'Create your own beautiful ornaments with this easy tutorial!',
      linkUrl:
        'https://www.hgtv.com/lifestyle/crafts/diy-christmas-ornaments-pictures',
      linkText: 'View Tutorial',
      fontFamily: 'Inter',
      fontSize: '16px',
      textColor: '#1e293b',
      backgroundColor: '#bfdbfe',
      textAlign: 'center',
      verticalAlign: 'middle',
      borderRadius: '16px',
      padding: '20px',
    },
    {
      day: 13,
      title: 'Gratitude Moment 🙏',
      content:
        'Take a moment today to appreciate the people who make your life special.\n\nThe greatest gift is the love we share.',
      fontFamily: 'Georgia',
      fontSize: '16px',
      textColor: '#4a5568',
      backgroundColor: '#fef3c7',
      textAlign: 'center',
      verticalAlign: 'middle',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    },
    {
      day: 14,
      title: 'Winter Forest 🌲',
      content: 'The quiet beauty of winter trees.',
      imageUrl:
        'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=800',
      fontFamily: 'Inter',
      fontSize: '14px',
      textColor: '#ffffff',
      backgroundColor: '#1e293b',
      textAlign: 'center',
      verticalAlign: 'top',
      borderRadius: '12px',
      padding: '16px',
    },
    {
      day: 15,
      title: 'Halfway There! 🎉',
      content:
        "You're halfway through the advent journey!\n\nOnly 10 more days until Christmas. The excitement is building!",
      fontFamily: 'Arial',
      fontSize: '18px',
      textColor: '#ffffff',
      backgroundColor: '#16a34a',
      textAlign: 'center',
      verticalAlign: 'middle',
      borderRadius: '20px',
      padding: '24px',
      boxShadow: '0 8px 16px rgba(22, 163, 74, 0.4)',
    },
  ],
};

export default function DemoCalendar() {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [openedDoors, setOpenedDoors] = useState<number[]>([]);

  const theme = getThemePreset(demoCalendar.theme) || null;
  const themeStyles = getThemeStyles(theme);

  const handleDoorClick = (day: number) => {
    if (!openedDoors.includes(day)) {
      setOpenedDoors([...openedDoors, day]);
    }
    setSelectedDay(day);
  };

  const selectedEntry = selectedDay
    ? demoCalendar.entries.find((e) => e.day === selectedDay)
    : null;

  const isDoorOpened = (day: number) => openedDoors.includes(day);

  return (
    <div className='min-h-screen' style={themeStyles}>
      {/* Snowflakes */}
      {theme?.snowflakesEnabled && (
        <div className='fixed inset-0 pointer-events-none overflow-hidden z-0'>
          <div className='snowflake'>❄</div>
          <div className='snowflake'>❅</div>
          <div className='snowflake'>❆</div>
          <div className='snowflake'>❄</div>
          <div className='snowflake'>❅</div>
        </div>
      )}

      {/* Navigation */}
      <nav className='bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            <Link href='/' className='flex items-center space-x-2'>
              <span className='text-3xl'>🎄</span>
              <span className='text-2xl font-bold text-red-600'>
                Advent Calendar
              </span>
            </Link>
            <div className='flex items-center gap-4'>
              <span className='text-sm text-gray-600 bg-purple-100 px-3 py-1 rounded-full font-medium'>
                📋 Demo Mode
              </span>
              <Link
                href='/auth/signup'
                className='bg-gradient-to-r from-red-500 to-green-500 text-white px-6 py-2 rounded-full hover:opacity-90 transition font-medium'
              >
                Create Your Own
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10'>
        {/* Header */}
        <div className='text-center mb-12'>
          <h1 className='text-5xl font-bold mb-4'>{demoCalendar.title}</h1>
          {demoCalendar.description && (
            <p className='text-xl opacity-90'>{demoCalendar.description}</p>
          )}
          <div className='mt-6 inline-block bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg'>
            <p className='text-gray-700 font-medium'>
              ✨ All doors are unlocked in demo mode - click any day to explore!
            </p>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className='grid grid-cols-5 gap-4 mb-12'>
          {Array.from({ length: 25 }, (_, i) => i + 1).map((day) => {
            const hasEntry = demoCalendar.entries.some((e) => e.day === day);
            const opened = isDoorOpened(day);

            // Compute style for day button based on theme date styling
            const style: React.CSSProperties = {};
            if (theme) {
              style.borderRadius = theme.dateBorderRadius || '16px';
              if (hasEntry) {
                const isGradient =
                  (theme.dateButtonStyle || 'gradient') === 'gradient';
                if (opened) {
                  if (
                    isGradient &&
                    theme.dateOpenedPrimaryColor &&
                    theme.dateOpenedSecondaryColor
                  ) {
                    style.backgroundImage = `linear-gradient(135deg, ${theme.dateOpenedPrimaryColor}, ${theme.dateOpenedSecondaryColor})`;
                  } else if (theme.dateOpenedPrimaryColor) {
                    style.backgroundColor = theme.dateOpenedPrimaryColor;
                  }
                } else {
                  if (
                    isGradient &&
                    theme.datePrimaryColor &&
                    theme.dateSecondaryColor
                  ) {
                    style.backgroundImage = `linear-gradient(135deg, ${theme.datePrimaryColor}, ${theme.dateSecondaryColor})`;
                  } else if (theme.datePrimaryColor) {
                    style.backgroundColor = theme.datePrimaryColor;
                  }
                }
              }
            }

            const numberStyle: React.CSSProperties = {
              color: theme?.dateTextColor || '#ffffff',
            };

            return (
              <button
                key={day}
                onClick={() => hasEntry && handleDoorClick(day)}
                disabled={!hasEntry}
                className={`aspect-square rounded-2xl shadow-lg transition-all duration-300 ${
                  !hasEntry
                    ? 'bg-gray-300 cursor-not-allowed opacity-50'
                    : opened
                    ? 'transform scale-95'
                    : 'hover:scale-110 hover:shadow-2xl cursor-pointer'
                }`}
                style={style}
              >
                <div className='flex flex-col items-center justify-center h-full'>
                  <span className='text-3xl font-bold' style={numberStyle}>
                    {day}
                  </span>
                  {opened && (
                    <span className='text-lg mt-1' style={numberStyle}>
                      ✓
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Try It CTA */}
        <div className='text-center bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl'>
          <h2 className='text-3xl font-bold text-gray-800 mb-4'>
            Love what you see? Create yours now!
          </h2>
          <p className='text-gray-600 mb-6 max-w-2xl mx-auto'>
            Build your own personalized advent calendar with photos, videos,
            poems, and links. It's free and takes just minutes to set up!
          </p>
          <Link
            href='/auth/signup'
            className='inline-block bg-gradient-to-r from-red-500 to-green-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:opacity-90 transition transform hover:scale-105 shadow-lg'
          >
            Get Started Free
          </Link>
        </div>
      </main>

      {/* Entry Modal */}
      {selectedDay && selectedEntry && (
        <div
          className='fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50'
          onClick={() => setSelectedDay(null)}
        >
          {/* Outer container keeps rounded corners and clips inner scrollbar */}
          <div
            className='bg-white rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden'
            onClick={(e) => e.stopPropagation()}
            role='dialog'
            aria-modal='true'
          >
            {/* Inner scroll area inherits rounded corners so scrollbar sits inside */}
            <div className='max-h-[90vh] overflow-y-auto p-8 scrollbar-rounded'>
              <div className='flex justify-between items-start mb-6'>
                <h2 className='text-3xl font-bold text-gray-800'>
                  Day {selectedDay}: {selectedEntry.title}
                </h2>
                <button
                  onClick={() => setSelectedDay(null)}
                  className='text-gray-500 hover:text-gray-700 text-3xl'
                >
                  ×
                </button>
              </div>

              {/* Video */}
              {selectedEntry.videoUrl && (
                <div className='mb-6 rounded-xl overflow-hidden'>
                  <div className='aspect-video'>
                    <iframe
                      src={selectedEntry.videoUrl}
                      title={selectedEntry.title}
                      className='w-full h-full'
                      allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              {/* Image */}
              {selectedEntry.imageUrl && (
                <div className='mb-6 rounded-xl overflow-hidden'>
                  <img
                    src={selectedEntry.imageUrl}
                    alt={selectedEntry.title}
                    className='w-full h-auto'
                  />
                </div>
              )}

              {/* Content */}
              {selectedEntry.content && (
                <div
                  className='whitespace-pre-wrap flex flex-col mb-6'
                  style={{
                    fontFamily: selectedEntry.fontFamily || 'Inter',
                    fontSize: selectedEntry.fontSize || '16px',
                    color: selectedEntry.textColor || '#000000',
                    backgroundColor:
                      selectedEntry.backgroundColor || 'transparent',
                    textAlign: (selectedEntry.textAlign as any) || 'center',
                    borderColor: selectedEntry.borderColor || 'transparent',
                    borderWidth: selectedEntry.borderWidth || '0px',
                    borderStyle: (selectedEntry.borderStyle as any) || 'solid',
                    borderRadius: selectedEntry.borderRadius || '0px',
                    padding: selectedEntry.padding || '16px',
                    boxShadow: selectedEntry.boxShadow || 'none',
                    alignItems:
                      selectedEntry.textAlign === 'left'
                        ? 'flex-start'
                        : selectedEntry.textAlign === 'right'
                        ? 'flex-end'
                        : 'center',
                    justifyContent:
                      selectedEntry.verticalAlign === 'top'
                        ? 'flex-start'
                        : selectedEntry.verticalAlign === 'bottom'
                        ? 'flex-end'
                        : 'center',
                    minHeight: '200px',
                    ...(selectedEntry.isPoem && {
                      fontStyle: 'italic',
                      lineHeight: '1.75',
                    }),
                  }}
                >
                  {selectedEntry.content}
                </div>
              )}

              {/* Link Button */}
              {selectedEntry.linkUrl && (
                <div className='mt-6'>
                  <a
                    href={selectedEntry.linkUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='inline-block w-full text-center bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-4 rounded-xl hover:opacity-90 transition font-semibold text-lg shadow-lg'
                  >
                    🔗 {selectedEntry.linkText || 'Visit Link'}
                  </a>
                </div>
              )}

              {null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
