'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type EntryType = 'TEXT' | 'POEM' | 'IMAGE';

interface CalendarEntry {
  id: string;
  day: number;
  title: string;
  content: string;
  imageUrl: string | null;
  type: EntryType;
  fontFamily?: string;
  fontSize?: string;
  textColor?: string;
  backgroundColor?: string;
  textAlign?: string;
}

interface Calendar {
  id: string;
  title: string;
  description: string | null;
  shareId: string;
  entries: CalendarEntry[];
}

export default function EditCalendar({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(
    null
  );
  const [calendar, setCalendar] = useState<Calendar | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    imageUrl: '',
    type: 'TEXT' as EntryType,
    fontFamily: 'Inter',
    fontSize: '16px',
    textColor: '#000000',
    backgroundColor: '',
    textAlign: 'left',
  });

  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  useEffect(() => {
    const loadCalendar = async () => {
      if (!resolvedParams) return;

      try {
        const response = await fetch(`/api/calendars/${resolvedParams.id}`);
        if (response.ok) {
          const data = await response.json();
          setCalendar(data);
        } else {
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Error fetching calendar:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCalendar();
  }, [resolvedParams, router]);

  const fetchCalendar = async () => {
    if (!resolvedParams) return;

    try {
      const response = await fetch(`/api/calendars/${resolvedParams.id}`);
      if (response.ok) {
        const data = await response.json();
        setCalendar(data);
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error fetching calendar:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDayClick = (day: number) => {
    const entry = calendar?.entries.find((e) => e.day === day);
    if (entry) {
      setFormData({
        title: entry.title,
        content: entry.content,
        imageUrl: entry.imageUrl || '',
        type: entry.type,
        fontFamily: entry.fontFamily || 'Inter',
        fontSize: entry.fontSize || '16px',
        textColor: entry.textColor || '#000000',
        backgroundColor: entry.backgroundColor || '',
        textAlign: entry.textAlign || 'left',
      });
    } else {
      setFormData({
        title: '',
        content: '',
        imageUrl: '',
        type: 'TEXT',
        fontFamily: 'Inter',
        fontSize: '16px',
        textColor: '#000000',
        backgroundColor: '',
        textAlign: 'left',
      });
    }
    setSelectedDay(day);
  };

  const handleSaveEntry = async () => {
    if (!calendar || selectedDay === null || !resolvedParams) return;

    const existingEntry = calendar.entries.find((e) => e.day === selectedDay);

    try {
      if (existingEntry) {
        // Update existing entry
        const response = await fetch(
          `/api/calendars/${resolvedParams.id}/entries/${existingEntry.id}`,
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
          }
        );
        if (response.ok) {
          fetchCalendar();
          setSelectedDay(null);
        }
      } else {
        // Create new entry
        const response = await fetch(
          `/api/calendars/${resolvedParams.id}/entries`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ day: selectedDay, ...formData }),
          }
        );
        if (response.ok) {
          fetchCalendar();
          setSelectedDay(null);
        }
      }
    } catch (error) {
      console.error('Error saving entry:', error);
    }
  };

  const handleDeleteEntry = async () => {
    if (!calendar || selectedDay === null || !resolvedParams) return;

    const existingEntry = calendar.entries.find((e) => e.day === selectedDay);
    if (!existingEntry) return;

    try {
      const response = await fetch(
        `/api/calendars/${resolvedParams.id}/entries/${existingEntry.id}`,
        {
          method: 'DELETE',
        }
      );
      if (response.ok) {
        fetchCalendar();
        setSelectedDay(null);
      }
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-green-50'>
        <div className='text-2xl text-gray-600'>Loading...</div>
      </div>
    );
  }

  if (!calendar) {
    return null;
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50'>
      {/* Navigation */}
      <nav className='bg-white/80 backdrop-blur-sm border-b border-red-100'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            <Link href='/dashboard' className='flex items-center space-x-2'>
              <span className='text-3xl'>🎄</span>
              <span className='text-2xl font-bold text-red-600'>
                Advent Calendar
              </span>
            </Link>
          </div>
        </div>
      </nav>

      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='mb-8'>
          <h1 className='text-4xl font-bold text-gray-800'>{calendar.title}</h1>
          {calendar.description && (
            <p className='text-gray-600 mt-2'>{calendar.description}</p>
          )}
          <div className='mt-4 text-sm text-gray-500 space-y-3'>
            <div>
              Share link:{' '}
              <code className='bg-white px-2 py-1 rounded'>
                {typeof window !== 'undefined' ? window.location.origin : ''}
                /share/{calendar.shareId}
              </code>
            </div>
            <div className='flex flex-wrap gap-3'>
              <Link
                href={`/share/${calendar.shareId}`}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-green-500 text-white text-sm font-semibold hover:from-blue-600 hover:to-green-600 transition'
              >
                Preview as Viewer
              </Link>
              <Link
                href={`/share/${calendar.shareId}?ownerPreview=1`}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold hover:from-purple-600 hover:to-pink-600 transition'
              >
                🔓 Owner Preview (Test All Days)
              </Link>
            </div>
            <p className='text-xs text-gray-400'>
              Save an entry before previewing to see changes reflected.
            </p>
          </div>
        </div>

        <div className='grid md:grid-cols-2 gap-8'>
          {/* Calendar Grid */}
          <div>
            <h2 className='text-2xl font-bold text-gray-800 mb-4'>
              Calendar Days
            </h2>
            <div className='grid grid-cols-5 gap-3'>
              {Array.from({ length: 25 }, (_, i) => i + 1).map((day) => {
                const hasEntry = calendar.entries.some((e) => e.day === day);
                return (
                  <button
                    key={day}
                    onClick={() => handleDayClick(day)}
                    className={`aspect-square rounded-lg font-bold text-lg transition ${
                      selectedDay === day
                        ? 'bg-red-500 text-white'
                        : hasEntry
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : 'bg-white border-2 border-gray-200 hover:border-red-300'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Entry Editor */}
          {selectedDay !== null && (
            <div className='bg-white rounded-2xl shadow-lg p-6 border-2 border-red-200'>
              <h3 className='text-2xl font-bold text-gray-800 mb-4'>
                Day {selectedDay}
              </h3>

              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Entry Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value as EntryType,
                      })
                    }
                    className='w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-400 focus:outline-none'
                  >
                    <option value='TEXT'>Text</option>
                    <option value='POEM'>Poem</option>
                    <option value='IMAGE'>Image</option>
                  </select>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Title
                  </label>
                  <input
                    type='text'
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder='Enter a title'
                    className='w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-400 focus:outline-none'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Content
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    rows={6}
                    placeholder='Enter your message, poem, or description'
                    className='w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-400 focus:outline-none resize-none'
                    style={{
                      fontFamily: formData.fontFamily,
                      fontSize: formData.fontSize,
                      color: formData.textColor,
                      backgroundColor: formData.backgroundColor || 'transparent',
                      textAlign: formData.textAlign as any,
                    }}
                  />
                </div>

                {/* Formatting Options */}
                <div className='border-t-2 border-gray-200 pt-4'>
                  <h4 className='text-sm font-semibold text-gray-700 mb-3'>
                    📝 Text Formatting
                  </h4>
                  
                  <div className='grid grid-cols-2 gap-3'>
                    <div>
                      <label className='block text-xs font-medium text-gray-600 mb-1'>
                        Font Family
                      </label>
                      <select
                        value={formData.fontFamily}
                        onChange={(e) =>
                          setFormData({ ...formData, fontFamily: e.target.value })
                        }
                        className='w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-red-400 focus:outline-none'
                      >
                        <option value='Inter'>Inter (Default)</option>
                        <option value='serif'>Serif</option>
                        <option value='Georgia'>Georgia</option>
                        <option value='Times New Roman'>Times New Roman</option>
                        <option value='monospace'>Monospace</option>
                        <option value='Courier New'>Courier New</option>
                        <option value='cursive'>Cursive</option>
                        <option value='Comic Sans MS'>Comic Sans</option>
                        <option value='Arial'>Arial</option>
                        <option value='Verdana'>Verdana</option>
                        <option value='Trebuchet MS'>Trebuchet MS</option>
                      </select>
                    </div>

                    <div>
                      <label className='block text-xs font-medium text-gray-600 mb-1'>
                        Font Size
                      </label>
                      <select
                        value={formData.fontSize}
                        onChange={(e) =>
                          setFormData({ ...formData, fontSize: e.target.value })
                        }
                        className='w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-red-400 focus:outline-none'
                      >
                        <option value='12px'>Small (12px)</option>
                        <option value='14px'>Normal (14px)</option>
                        <option value='16px'>Medium (16px)</option>
                        <option value='18px'>Large (18px)</option>
                        <option value='20px'>X-Large (20px)</option>
                        <option value='24px'>XX-Large (24px)</option>
                        <option value='28px'>Huge (28px)</option>
                      </select>
                    </div>

                    <div>
                      <label className='block text-xs font-medium text-gray-600 mb-1'>
                        Text Color
                      </label>
                      <div className='flex gap-2'>
                        <input
                          type='color'
                          value={formData.textColor}
                          onChange={(e) =>
                            setFormData({ ...formData, textColor: e.target.value })
                          }
                          className='h-10 w-16 border border-gray-300 rounded cursor-pointer'
                        />
                        <input
                          type='text'
                          value={formData.textColor}
                          onChange={(e) =>
                            setFormData({ ...formData, textColor: e.target.value })
                          }
                          placeholder='#000000'
                          className='flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-red-400 focus:outline-none'
                        />
                      </div>
                    </div>

                    <div>
                      <label className='block text-xs font-medium text-gray-600 mb-1'>
                        Background Color
                      </label>
                      <div className='flex gap-2'>
                        <input
                          type='color'
                          value={formData.backgroundColor || '#ffffff'}
                          onChange={(e) =>
                            setFormData({ ...formData, backgroundColor: e.target.value })
                          }
                          className='h-10 w-16 border border-gray-300 rounded cursor-pointer'
                        />
                        <input
                          type='text'
                          value={formData.backgroundColor || ''}
                          onChange={(e) =>
                            setFormData({ ...formData, backgroundColor: e.target.value })
                          }
                          placeholder='None'
                          className='flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-red-400 focus:outline-none'
                        />
                      </div>
                    </div>

                    <div className='col-span-2'>
                      <label className='block text-xs font-medium text-gray-600 mb-1'>
                        Text Alignment
                      </label>
                      <div className='flex gap-2'>
                        {['left', 'center', 'right', 'justify'].map((align) => (
                          <button
                            key={align}
                            type='button'
                            onClick={() => setFormData({ ...formData, textAlign: align })}
                            className={`flex-1 px-3 py-2 text-sm border rounded-lg transition ${
                              formData.textAlign === align
                                ? 'bg-red-500 text-white border-red-500'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-red-300'
                            }`}
                          >
                            {align.charAt(0).toUpperCase() + align.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {formData.type === 'IMAGE' && (
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Image URL
                    </label>
                    <input
                      type='url'
                      value={formData.imageUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, imageUrl: e.target.value })
                      }
                      placeholder='https://example.com/image.jpg'
                      className='w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-400 focus:outline-none'
                    />
                  </div>
                )}

                <div className='flex space-x-3 pt-4'>
                  <button
                    onClick={handleSaveEntry}
                    className='flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition font-semibold'
                  >
                    Save Entry
                  </button>
                  {calendar.entries.some((e) => e.day === selectedDay) && (
                    <button
                      onClick={handleDeleteEntry}
                      className='flex-1 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition font-semibold'
                    >
                      Delete
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedDay(null)}
                    className='bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition font-semibold'
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
