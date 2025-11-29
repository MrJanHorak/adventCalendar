'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getThemeStyles } from '@/lib/themes';

type EntryType = 'TEXT' | 'POEM' | 'IMAGE' | 'VIDEO';

interface CalendarEntry {
  id: string;
  day: number;
  title: string;
  content: string | null;
  imageUrl: string | null;
  videoUrl: string | null;
  linkUrl: string | null;
  linkText: string | null;
  type: EntryType; // retained for backward compatibility
  isPoem?: boolean;
  fontFamily?: string;
  fontSize?: string;
  textColor?: string;
  backgroundColor?: string;
  textAlign?: string;
  verticalAlign?: string;
  borderColor?: string;
  borderWidth?: string;
  borderStyle?: string;
  borderRadius?: string;
  padding?: string;
  boxShadow?: string;
}

interface Calendar {
  id: string;
  title: string;
  description: string | null;
  shareId: string;
  userId: string;
  entries: CalendarEntry[];
  user: {
    id: string;
    name: string | null;
  };
  theme?: string;
  backgroundColor?: string;
  backgroundPattern?: string;
  primaryColor?: string;
  secondaryColor?: string;
  textColor?: string;
  snowflakesEnabled?: boolean;
  customDecoration?: string;
}

interface OpenedDoor {
  day: number;
  openedAt: string;
}

export default function SharedCalendar({
  params,
}: {
  params: Promise<{ shareId: string }>;
}) {
  const searchParams = useSearchParams();
  const ownerPreview = searchParams.get('ownerPreview') === '1';
  const [resolvedParams, setResolvedParams] = useState<{
    shareId: string;
  } | null>(null);
  const [calendar, setCalendar] = useState<Calendar | null>(null);
  const [openedDoors, setOpenedDoors] = useState<OpenedDoor[]>([]);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  useEffect(() => {
    const loadData = async () => {
      if (!resolvedParams) return;

      // Fetch current user session if in owner preview mode
      if (ownerPreview) {
        try {
          const sessionResponse = await fetch('/api/auth/session');
          if (sessionResponse.ok) {
            const sessionData = await sessionResponse.json();
            if (sessionData?.user?.id) {
              setCurrentUserId(sessionData.user.id);
            }
          }
        } catch {
          // Silently fail if can't fetch session
        }
      }

      // Fetch calendar
      try {
        const response = await fetch(`/api/share/${resolvedParams.shareId}`);
        if (response.ok) {
          const data = await response.json();
          setCalendar(data);
          // Check if current user is the owner
          if (ownerPreview && currentUserId && data.userId === currentUserId) {
            setIsOwner(true);
          }
        } else {
          setError('Calendar not found');
        }
      } catch {
        setError('Failed to load calendar');
      } finally {
        setLoading(false);
      }

      // Fetch opened doors
      try {
        const response = await fetch(
          `/api/share/${resolvedParams.shareId}/open`
        );
        if (response.ok) {
          const data = await response.json();
          setOpenedDoors(data);
        }
      } catch {
        // Silently fail if can't fetch opened doors
      }
    };

    loadData();
  }, [resolvedParams, ownerPreview, currentUserId]);

  const fetchOpenedDoors = async () => {
    if (!resolvedParams) return;

    try {
      const response = await fetch(`/api/share/${resolvedParams.shareId}/open`);
      if (response.ok) {
        const data = await response.json();
        setOpenedDoors(data);
      }
    } catch {
      // Silently fail if can't fetch opened doors
    }
  };

  const handleDayClick = async (day: number) => {
    if (!calendar || !resolvedParams) return;

    const entry = calendar.entries.find((e) => e.day === day);
    if (!entry) {
      setError("This day doesn't have content yet!");
      setTimeout(() => setError(''), 3000);
      return;
    }

    // Check if already opened
    const alreadyOpened = openedDoors.some((d) => d.day === day);

    if (!alreadyOpened) {
      // Try to open the door
      try {
        const response = await fetch(
          `/api/share/${resolvedParams.shareId}/open`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ day, force: ownerPreview && isOwner }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || 'Cannot open this door yet!');
          setTimeout(() => setError(''), 3000);
          return;
        }

        // Refresh opened doors
        fetchOpenedDoors();
      } catch {
        setError('Something went wrong');
        setTimeout(() => setError(''), 3000);
        return;
      }
    }

    setSelectedDay(day);
  };

  const isDoorOpenable = (day: number) => {
    // Owner can always open doors in preview mode
    if (ownerPreview && isOwner) {
      return true;
    }

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentDay = now.getDate();

    // Allow opening if it's December and the day has arrived
    return currentMonth === 12 && day <= currentDay;
  };

  const isDoorOpened = (day: number) => {
    return openedDoors.some((d) => d.day === day);
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-green-50'>
        <div className='text-2xl text-gray-600'>
          Loading your advent calendar...
        </div>
      </div>
    );
  }

  if (error && !calendar) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-green-50'>
        <div className='text-center'>
          <div className='text-6xl mb-4'>🎄</div>
          <div className='text-2xl text-red-600 mb-4'>{error}</div>
          <Link
            href='/'
            className='inline-block bg-gradient-to-r from-red-500 to-green-500 text-white px-8 py-3 rounded-full hover:from-red-600 hover:to-green-600 transition font-semibold'
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  if (!calendar) return null;

  const selectedEntry = selectedDay
    ? calendar.entries.find((e) => e.day === selectedDay)
    : null;

  // Get theme styles
  const themeStyles = getThemeStyles(
    calendar.theme
      ? {
          id: calendar.theme,
          name: '',
          description: '',
          backgroundColor: calendar.backgroundColor || '#f9fafb',
          backgroundPattern: calendar.backgroundPattern || 'none',
          primaryColor: calendar.primaryColor || '#dc2626',
          secondaryColor: calendar.secondaryColor || '#16a34a',
          textColor: calendar.textColor || '#111827',
          snowflakesEnabled: calendar.snowflakesEnabled !== false,
        }
      : null
  );

  return (
    <div
      className='min-h-screen'
      style={{
        ...themeStyles,
        minHeight: '100vh',
      }}
    >
      {/* Snowflakes - conditionally rendered */}
      {calendar.snowflakesEnabled !== false && (
        <div className='fixed inset-0 pointer-events-none overflow-hidden'>
          <div className='snowflake'>❄</div>
          <div className='snowflake'>❅</div>
          <div className='snowflake'>❆</div>
        </div>
      )}

      {/* Navigation */}
      <nav className='bg-white/80 backdrop-blur-sm border-b border-red-100'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            <Link href='/' className='flex items-center space-x-2'>
              <span className='text-3xl'>🎄</span>
              <span className='text-2xl font-bold text-red-600'>
                Advent Calendar
              </span>
            </Link>
          </div>
        </div>
      </nav>

      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10'>
        <div className='text-center mb-12'>
          <h1
            className='text-5xl font-bold mb-4'
            style={{
              color: calendar.textColor || '#111827',
            }}
          >
            {calendar.title}
          </h1>
          {calendar.description && (
            <p
              className='text-xl mb-2'
              style={{ color: calendar.textColor || '#4b5563' }}
            >
              {calendar.description}
            </p>
          )}
          {calendar.user.name && (
            <p style={{ color: calendar.textColor || '#6b7280' }}>
              Created by {calendar.user.name}
            </p>
          )}
          {ownerPreview && isOwner && (
            <div className='mt-4 inline-block bg-blue-100 border-2 border-blue-300 text-blue-700 px-6 py-3 rounded-lg font-semibold'>
              🔓 Owner Preview Mode - All doors unlocked for testing
            </div>
          )}
        </div>

        {error && (
          <div className='mb-6 bg-red-50 border-2 border-red-200 text-red-600 px-6 py-4 rounded-lg text-center font-semibold'>
            {error}
          </div>
        )}

        {/* Calendar Grid */}
        <div className='grid grid-cols-5 gap-4 mb-12 max-w-4xl mx-auto'>
          {Array.from({ length: 25 }, (_, i) => i + 1).map((day) => {
            const hasEntry = calendar.entries.some((e) => e.day === day);
            const isOpened = isDoorOpened(day);
            const canOpen = isDoorOpenable(day);

            return (
              <button
                key={day}
                onClick={() => handleDayClick(day)}
                disabled={!hasEntry || (!canOpen && !isOpened)}
                style={{
                  backgroundColor: isOpened
                    ? calendar.secondaryColor || '#16a34a'
                    : canOpen && hasEntry
                    ? calendar.primaryColor || '#dc2626'
                    : 'rgba(255, 255, 255, 0.8)',
                  color:
                    isOpened || (canOpen && hasEntry)
                      ? '#ffffff'
                      : calendar.textColor || '#9ca3af',
                  borderColor: calendar.primaryColor || '#dc2626',
                }}
                className={`aspect-square rounded-2xl font-bold text-2xl transition-all transform hover:scale-105 shadow-lg border-2 ${
                  !hasEntry || (!canOpen && !isOpened)
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>

        {/* Entry Modal */}
        {selectedDay && selectedEntry && (
          <div className='fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50'>
            <div className='bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8 border-4 border-red-200'>
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

              {/* Video (if present) */}
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

              {/* Image (if present) */}
              {selectedEntry.imageUrl && (
                <div className='mb-6 rounded-xl overflow-hidden'>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedEntry.imageUrl}
                    alt={selectedEntry.title}
                    className='w-full h-auto'
                  />
                </div>
              )}

              {/* Text / Poem (if present) */}
              {selectedEntry.content && (
                <div
                  className='whitespace-pre-wrap flex flex-col'
                  style={{
                    fontFamily: selectedEntry.fontFamily || 'Inter',
                    fontSize: selectedEntry.fontSize || '16px',
                    color: selectedEntry.textColor || '#374151',
                    backgroundColor:
                      selectedEntry.backgroundColor || 'transparent',
                    textAlign: (selectedEntry.textAlign || 'center') as any,
                    borderColor: selectedEntry.borderColor,
                    borderWidth: selectedEntry.borderWidth || '0px',
                    borderStyle: (selectedEntry.borderStyle || 'solid') as any,
                    borderRadius: selectedEntry.borderRadius || '0px',
                    padding: selectedEntry.padding || '16px',
                    boxShadow: selectedEntry.boxShadow || 'none',
                    alignItems:
                      selectedEntry.textAlign === 'left'
                        ? 'flex-start'
                        : selectedEntry.textAlign === 'right'
                        ? 'flex-end'
                        : selectedEntry.textAlign === 'justify'
                        ? 'stretch'
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

              {/* External Link Button */}
              {selectedEntry.linkUrl && (
                <div className='mt-6'>
                  <a
                    href={selectedEntry.linkUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='inline-block w-full text-center bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-4 rounded-xl hover:from-purple-600 hover:to-blue-600 transition font-semibold text-lg shadow-lg'
                  >
                    🔗 {selectedEntry.linkText || 'Visit Link'}
                  </a>
                </div>
              )}

              {/* Fallback if no content at all (should be rare) */}
              {!selectedEntry.content &&
                !selectedEntry.imageUrl &&
                !selectedEntry.videoUrl &&
                !selectedEntry.linkUrl && (
                  <div className='text-center text-gray-500 italic'>
                    No content available for this entry.
                  </div>
                )}

              <button
                onClick={() => setSelectedDay(null)}
                className='mt-8 w-full bg-gradient-to-r from-red-500 to-green-500 text-white py-4 rounded-full hover:from-red-600 hover:to-green-600 transition font-semibold text-lg'
              >
                Close
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
