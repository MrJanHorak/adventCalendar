'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { themePresets, getThemePreset } from '@/lib/themes';
import { convertToEmbedUrl } from '@/lib/videoUtils';
import HelpModal from '@/components/HelpModal';

// Legacy entry type retained for backward compatibility with existing records
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
  type?: EntryType; // optional legacy
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
  entries: CalendarEntry[];
  theme?: string;
  backgroundColor?: string;
  backgroundPattern?: string;
  primaryColor?: string;
  secondaryColor?: string;
  textColor?: string;
  snowflakesEnabled?: boolean;
  customDecoration?: string;
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
  const [showThemeEditor, setShowThemeEditor] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showQuickTips, setShowQuickTips] = useState(false);
  const [themeData, setThemeData] = useState({
    theme: 'classic',
    backgroundColor: '#f9fafb',
    backgroundPattern: 'none',
    primaryColor: '#dc2626',
    secondaryColor: '#16a34a',
    textColor: '#111827',
    snowflakesEnabled: true,
  });
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    imageUrl: '',
    videoUrl: '',
    linkUrl: '',
    linkText: '',
    isPoem: false,
    fontFamily: 'Inter',
    fontSize: '16px',
    textColor: '#000000',
    backgroundColor: '',
    textAlign: 'center',
    verticalAlign: 'middle',
    borderColor: '',
    borderWidth: '0px',
    borderStyle: 'solid',
    borderRadius: '0px',
    padding: '16px',
    boxShadow: 'none',
  });
  const [showImageField, setShowImageField] = useState(false);
  const [showVideoField, setShowVideoField] = useState(false);
  const [showLinkField, setShowLinkField] = useState(false);

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
          // Load theme data
          setThemeData({
            theme: data.theme || 'classic',
            backgroundColor: data.backgroundColor || '#f9fafb',
            backgroundPattern: data.backgroundPattern || 'none',
            primaryColor: data.primaryColor || '#dc2626',
            secondaryColor: data.secondaryColor || '#16a34a',
            textColor: data.textColor || '#111827',
            snowflakesEnabled: data.snowflakesEnabled !== false,
          });
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
        content: entry.content || '',
        imageUrl: entry.imageUrl || '',
        videoUrl: entry.videoUrl || '',
        linkUrl: entry.linkUrl || '',
        linkText: entry.linkText || '',
        isPoem: entry.isPoem || false,
        fontFamily: entry.fontFamily || 'Inter',
        fontSize: entry.fontSize || '16px',
        textColor: entry.textColor || '#000000',
        backgroundColor: entry.backgroundColor || '',
        textAlign: entry.textAlign || 'center',
        verticalAlign: entry.verticalAlign || 'middle',
        borderColor: entry.borderColor || '',
        borderWidth: entry.borderWidth || '0px',
        borderStyle: entry.borderStyle || 'solid',
        borderRadius: entry.borderRadius || '0px',
        padding: entry.padding || '16px',
        boxShadow: entry.boxShadow || 'none',
      });
      setShowImageField(!!entry.imageUrl);
      setShowVideoField(!!entry.videoUrl);
      setShowLinkField(!!entry.linkUrl);
    } else {
      setFormData({
        title: '',
        content: '',
        imageUrl: '',
        videoUrl: '',
        linkUrl: '',
        linkText: '',
        isPoem: false,
        fontFamily: 'Inter',
        fontSize: '16px',
        textColor: '#000000',
        backgroundColor: '',
        textAlign: 'center',
        verticalAlign: 'middle',
        borderColor: '',
        borderWidth: '0px',
        borderStyle: 'solid',
        borderRadius: '0px',
        padding: '16px',
        boxShadow: 'none',
      });
      setShowImageField(false);
      setShowVideoField(false);
      setShowLinkField(false);
    }
    setSelectedDay(day);
  };

  const handleSaveEntry = async () => {
    if (!calendar || selectedDay === null || !resolvedParams) return;

    const existingEntry = calendar.entries.find((e) => e.day === selectedDay);

    // Validate required fields
    if (!formData.title) {
      alert('Title is required');
      return;
    }

    if (
      !formData.content.trim() &&
      !formData.imageUrl.trim() &&
      !formData.videoUrl.trim() &&
      !formData.linkUrl.trim()
    ) {
      alert('Please add at least some content (text, image, video, or link)');
      return;
    }

    // Prepare data with converted video URL
    const dataToSave = {
      ...formData,
      content: formData.content.trim() || null,
      imageUrl:
        showImageField && formData.imageUrl.trim()
          ? formData.imageUrl.trim()
          : null,
      videoUrl:
        showVideoField && formData.videoUrl.trim()
          ? convertToEmbedUrl(formData.videoUrl.trim())
          : null,
      linkUrl:
        showLinkField && formData.linkUrl.trim()
          ? formData.linkUrl.trim()
          : null,
      linkText:
        showLinkField && formData.linkText.trim()
          ? formData.linkText.trim()
          : null,
    };

    try {
      if (existingEntry) {
        // Update existing entry
        const response = await fetch(
          `/api/calendars/${resolvedParams.id}/entries/${existingEntry.id}`,
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToSave),
          }
        );

        if (!response.ok) {
          const error = await response.json();
          console.error('Save error:', error);
          alert(error.error || 'Failed to save entry');
          return;
        }

        fetchCalendar();
        setSelectedDay(null);
      } else {
        // Create new entry
        const response = await fetch(
          `/api/calendars/${resolvedParams.id}/entries`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ day: selectedDay, ...dataToSave }),
          }
        );

        if (!response.ok) {
          const error = await response.json();
          console.error('Save error:', error);
          alert(error.error || 'Failed to save entry');
          return;
        }

        fetchCalendar();
        setSelectedDay(null);
      }
    } catch (error) {
      console.error('Error saving entry:', error);
      alert('Failed to save entry');
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

  const handleApplyPreset = (presetId: string) => {
    const preset = getThemePreset(presetId);
    if (preset) {
      setThemeData({
        theme: preset.id,
        backgroundColor: preset.backgroundColor,
        backgroundPattern: preset.backgroundPattern,
        primaryColor: preset.primaryColor,
        secondaryColor: preset.secondaryColor,
        textColor: preset.textColor,
        snowflakesEnabled: preset.snowflakesEnabled,
      });
    }
  };

  const handleSaveTheme = async () => {
    if (!resolvedParams) return;

    try {
      const response = await fetch(`/api/calendars/${resolvedParams.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(themeData),
      });

      if (response.ok) {
        await fetchCalendar();
        alert('Theme saved successfully!');
      }
    } catch (error) {
      console.error('Error saving theme:', error);
      alert('Failed to save theme');
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

  // Get theme styles for edit page
  const themeStyles: React.CSSProperties = {
    backgroundColor: themeData.backgroundColor,
    color: themeData.textColor,
  };

  // Add background pattern styles
  if (themeData.backgroundPattern && themeData.backgroundPattern !== 'none') {
    switch (themeData.backgroundPattern) {
      case 'snowflakes':
        themeStyles.backgroundImage =
          "url(\"data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='10' y='30' font-size='20' fill='%23cbd5e1' opacity='0.4'%3E❄%3C/text%3E%3Ctext x='60' y='70' font-size='16' fill='%23cbd5e1' opacity='0.3'%3E❅%3C/text%3E%3Ctext x='80' y='20' font-size='14' fill='%23cbd5e1' opacity='0.35'%3E❆%3C/text%3E%3C/svg%3E\")";
        break;
      case 'stars':
        themeStyles.backgroundImage =
          "url(\"data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='15' y='35' font-size='18' fill='%23fbbf24' opacity='0.4'%3E⭐%3C/text%3E%3Ctext x='65' y='75' font-size='14' fill='%23fbbf24' opacity='0.35'%3E✨%3C/text%3E%3Ctext x='85' y='25' font-size='12' fill='%23fbbf24' opacity='0.3'%3E⭐%3C/text%3E%3Ctext x='40' y='55' font-size='10' fill='%23fbbf24' opacity='0.25'%3E✨%3C/text%3E%3C/svg%3E\")";
        break;
      case 'woodgrain':
        themeStyles.backgroundImage =
          'linear-gradient(90deg, rgba(92,77,66,0.05) 25%, transparent 25%, transparent 50%, rgba(92,77,66,0.05) 50%, rgba(92,77,66,0.05) 75%, transparent 75%, transparent)';
        themeStyles.backgroundSize = '40px 40px';
        break;
      case 'dots':
        themeStyles.backgroundImage =
          'radial-gradient(circle, rgba(15,23,42,0.1) 1px, transparent 1px)';
        themeStyles.backgroundSize = '20px 20px';
        break;
      case 'stripes':
        themeStyles.backgroundImage = `linear-gradient(45deg, ${themeData.primaryColor}15 25%, transparent 25%, transparent 50%, ${themeData.primaryColor}15 50%, ${themeData.primaryColor}15 75%, transparent 75%, transparent)`;
        themeStyles.backgroundSize = '40px 40px';
        break;
    }
  }

  return (
    <div className='min-h-screen' style={themeStyles}>
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />

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
            <button
              onClick={() => setShowHelp(true)}
              className='flex items-center gap-2 text-gray-700 hover:text-red-600 font-medium transition'
            >
              <span className='text-xl'>❓</span>
              <span>Help</span>
            </button>
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

        {/* Theme Customization Section */}
        <div className='mb-8 bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-200'>
          <button
            onClick={() => setShowThemeEditor(!showThemeEditor)}
            className='w-full flex items-center justify-between text-left'
          >
            <div>
              <h2 className='text-2xl font-bold text-gray-800'>
                🎨 Calendar Theme & Styling
              </h2>
              <p className='text-sm text-gray-600 mt-1'>
                Customize the overall look and feel of your calendar
              </p>
            </div>
            <span className='text-2xl text-purple-600'>
              {showThemeEditor ? '▼' : '▶'}
            </span>
          </button>

          {showThemeEditor && (
            <div className='mt-6 space-y-6'>
              {/* Theme Presets */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-3'>
                  Choose a Theme Preset
                </label>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
                  {themePresets.map((preset) => (
                    <button
                      key={preset.id}
                      type='button'
                      onClick={() => handleApplyPreset(preset.id)}
                      className={`p-4 rounded-lg border-2 text-left transition ${
                        themeData.theme === preset.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <h3 className='font-semibold text-gray-800 mb-1'>
                        {preset.name}
                      </h3>
                      <p className='text-xs text-gray-600 mb-2'>
                        {preset.description}
                      </p>
                      <div className='flex gap-2'>
                        <div
                          className='w-6 h-6 rounded border'
                          style={{ backgroundColor: preset.primaryColor }}
                        />
                        <div
                          className='w-6 h-6 rounded border'
                          style={{ backgroundColor: preset.secondaryColor }}
                        />
                        <div
                          className='w-6 h-6 rounded border'
                          style={{ backgroundColor: preset.backgroundColor }}
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Colors */}
              <div className='grid md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Background Color
                  </label>
                  <input
                    type='color'
                    value={themeData.backgroundColor}
                    onChange={(e) =>
                      setThemeData({
                        ...themeData,
                        backgroundColor: e.target.value,
                      })
                    }
                    className='h-12 w-full rounded border-2 border-gray-200 cursor-pointer'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Text Color
                  </label>
                  <input
                    type='color'
                    value={themeData.textColor}
                    onChange={(e) =>
                      setThemeData({ ...themeData, textColor: e.target.value })
                    }
                    className='h-12 w-full rounded border-2 border-gray-200 cursor-pointer'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Primary Color (Accent)
                  </label>
                  <input
                    type='color'
                    value={themeData.primaryColor}
                    onChange={(e) =>
                      setThemeData({
                        ...themeData,
                        primaryColor: e.target.value,
                      })
                    }
                    className='h-12 w-full rounded border-2 border-gray-200 cursor-pointer'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Secondary Color
                  </label>
                  <input
                    type='color'
                    value={themeData.secondaryColor}
                    onChange={(e) =>
                      setThemeData({
                        ...themeData,
                        secondaryColor: e.target.value,
                      })
                    }
                    className='h-12 w-full rounded border-2 border-gray-200 cursor-pointer'
                  />
                </div>
              </div>

              {/* Background Pattern */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Background Pattern
                </label>
                <select
                  value={themeData.backgroundPattern}
                  onChange={(e) =>
                    setThemeData({
                      ...themeData,
                      backgroundPattern: e.target.value,
                    })
                  }
                  className='w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-400 focus:outline-none'
                >
                  <option value='none'>None</option>
                  <option value='snowflakes'>Snowflakes</option>
                  <option value='stars'>Stars</option>
                  <option value='woodgrain'>Woodgrain</option>
                  <option value='dots'>Dots</option>
                  <option value='stripes'>Diagonal Stripes</option>
                </select>
              </div>

              {/* Snowflakes Toggle */}
              <div>
                <label className='flex items-center gap-3 cursor-pointer'>
                  <input
                    type='checkbox'
                    checked={themeData.snowflakesEnabled}
                    onChange={(e) =>
                      setThemeData({
                        ...themeData,
                        snowflakesEnabled: e.target.checked,
                      })
                    }
                    className='w-5 h-5 rounded border-2 border-gray-300 text-purple-600 focus:ring-purple-500'
                  />
                  <span className='text-sm font-medium text-gray-700'>
                    Enable Animated Snowflakes
                  </span>
                </label>
              </div>

              {/* Save Button */}
              <div className='pt-4 border-t'>
                <button
                  onClick={handleSaveTheme}
                  className='w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition'
                >
                  💾 Save Theme Settings
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Tips Section */}
        <div className='mb-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl shadow-lg p-6 border-2 border-blue-200'>
          <button
            onClick={() => setShowQuickTips(!showQuickTips)}
            className='w-full flex items-center justify-between text-left'
          >
            <div>
              <h2 className='text-2xl font-bold text-gray-800'>
                💡 Quick Tips & Help
              </h2>
              <p className='text-sm text-gray-600 mt-1'>
                Learn how to add images, videos, and more
              </p>
            </div>
            <span className='text-2xl text-blue-600'>
              {showQuickTips ? '▼' : '▶'}
            </span>
          </button>

          {showQuickTips && (
            <div className='mt-6 grid md:grid-cols-2 gap-4'>
              <div className='bg-white p-4 rounded-lg shadow-sm border border-blue-100'>
                <h3 className='font-bold text-lg mb-2 flex items-center gap-2'>
                  <span>🖼️</span> Adding Images
                </h3>
                <ol className='text-sm text-gray-700 space-y-1 list-decimal list-inside'>
                  <li>
                    Upload your image to{' '}
                    <a
                      href='https://imgur.com/upload'
                      target='_blank'
                      rel='noopener'
                      className='text-blue-600 hover:underline'
                    >
                      Imgur
                    </a>
                  </li>
                  <li>Right-click → "Copy image address"</li>
                  <li>Paste the URL (should end in .jpg or .png)</li>
                </ol>
              </div>

              <div className='bg-white p-4 rounded-lg shadow-sm border border-purple-100'>
                <h3 className='font-bold text-lg mb-2 flex items-center gap-2'>
                  <span>🎥</span> Adding Videos
                </h3>
                <ol className='text-sm text-gray-700 space-y-1 list-decimal list-inside'>
                  <li>Find your video on YouTube or Vimeo</li>
                  <li>Copy the URL from the address bar</li>
                  <li>Paste it - we'll convert it automatically!</li>
                </ol>
              </div>

              <div className='bg-white p-4 rounded-lg shadow-sm border border-yellow-100'>
                <h3 className='font-bold text-lg mb-2 flex items-center gap-2'>
                  <span>🔗</span> Adding Links
                </h3>
                <ol className='text-sm text-gray-700 space-y-1 list-decimal list-inside'>
                  <li>Click "Add Link" in the entry editor</li>
                  <li>Paste any website URL</li>
                  <li>Optionally customize the button text</li>
                  <li>Great for recipes, playlists, or gifts!</li>
                </ol>
              </div>

              <div className='bg-white p-4 rounded-lg shadow-sm border border-green-100'>
                <h3 className='font-bold text-lg mb-2 flex items-center gap-2'>
                  <span>🎨</span> Formatting Tips
                </h3>
                <ul className='text-sm text-gray-700 space-y-1 list-disc list-inside'>
                  <li>Enable Poem Styling for automatic italics</li>
                  <li>Customize each entry's colors independently</li>
                  <li>Try different border styles for variety</li>
                </ul>
              </div>

              <div className='bg-white p-4 rounded-lg shadow-sm border border-red-100'>
                <h3 className='font-bold text-lg mb-2 flex items-center gap-2'>
                  <span>👀</span> Preview & Test
                </h3>
                <ul className='text-sm text-gray-700 space-y-1 list-disc list-inside'>
                  <li>Use "Owner Preview" to test all doors</li>
                  <li>Check how it looks on mobile too</li>
                  <li>Save before previewing to see changes</li>
                </ul>
              </div>
            </div>
          )}
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
                {/* Entry Controls */}
                <div className='space-y-4'>
                  <div className='flex flex-wrap gap-3'>
                    <label className='inline-flex items-center gap-2 px-3 py-2 border-2 rounded-lg cursor-pointer bg-white hover:border-red-300 transition'>
                      <input
                        type='checkbox'
                        checked={formData.isPoem}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isPoem: e.target.checked,
                          })
                        }
                        className='w-4 h-4'
                      />
                      <span className='text-sm font-medium'>Poem Styling</span>
                    </label>
                    <button
                      type='button'
                      onClick={() => setShowImageField((v) => !v)}
                      className={`px-3 py-2 border-2 rounded-lg text-sm font-medium transition ${
                        showImageField
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 bg-white hover:border-green-400'
                      }`}
                    >
                      {showImageField ? 'Remove Image' : 'Add Image'}
                    </button>
                    <button
                      type='button'
                      onClick={() => setShowVideoField((v) => !v)}
                      className={`px-3 py-2 border-2 rounded-lg text-sm font-medium transition ${
                        showVideoField
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 bg-white hover:border-blue-400'
                      }`}
                    >
                      {showVideoField ? 'Remove Video' : 'Add Video'}
                    </button>
                    <button
                      type='button'
                      onClick={() => setShowLinkField((v) => !v)}
                      className={`px-3 py-2 border-2 rounded-lg text-sm font-medium transition ${
                        showLinkField
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 bg-white hover:border-purple-400'
                      }`}
                    >
                      {showLinkField ? 'Remove Link' : 'Add Link'}
                    </button>
                  </div>
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
                      backgroundColor:
                        formData.backgroundColor || 'transparent',
                      textAlign: formData.textAlign as any,
                      borderColor: formData.borderColor || '#e5e7eb',
                      borderWidth: formData.borderWidth,
                      borderStyle: formData.borderStyle as any,
                      borderRadius: formData.borderRadius,
                      padding: formData.padding,
                      boxShadow: formData.boxShadow,
                      display: 'flex',
                      alignItems:
                        formData.verticalAlign === 'top'
                          ? 'flex-start'
                          : formData.verticalAlign === 'bottom'
                          ? 'flex-end'
                          : 'center',
                      ...(formData.isPoem && {
                        fontStyle: 'italic',
                        lineHeight: '1.75',
                      }),
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
                          setFormData({
                            ...formData,
                            fontFamily: e.target.value,
                          })
                        }
                        className='w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-red-400 focus:outline-none'
                      >
                        <option value='Inter'>Inter (Default)</option>
                        <option value='serif'>Serif</option>
                        <option value='Georgia'>Georgia</option>
                        <option value='Times New Roman'>Times New Roman</option>
                        <option value='monospace'>Monospace</option>
                        <option value='Courier New'>Courier New</option>
                        <option value='Brush Script MT, cursive'>
                          Cursive
                        </option>
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
                      <input
                        type='color'
                        value={formData.textColor}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            textColor: e.target.value,
                          })
                        }
                        className='h-12 w-full border border-gray-300 rounded cursor-pointer'
                      />
                    </div>

                    <div>
                      <label className='block text-xs font-medium text-gray-600 mb-1'>
                        Background Color
                      </label>
                      <input
                        type='color'
                        value={formData.backgroundColor || '#ffffff'}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            backgroundColor: e.target.value,
                          })
                        }
                        className='h-12 w-full border border-gray-300 rounded cursor-pointer'
                      />
                    </div>

                    <div className='col-span-2'>
                      <label className='block text-xs font-medium text-gray-600 mb-1'>
                        Horizontal Alignment
                      </label>
                      <div className='flex gap-2'>
                        {['left', 'center', 'right', 'justify'].map((align) => (
                          <button
                            key={align}
                            type='button'
                            onClick={() =>
                              setFormData({ ...formData, textAlign: align })
                            }
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

                    <div className='col-span-2'>
                      <label className='block text-xs font-medium text-gray-600 mb-1'>
                        Vertical Alignment
                      </label>
                      <div className='flex gap-2'>
                        {[
                          { value: 'top', label: 'Top' },
                          { value: 'middle', label: 'Middle' },
                          { value: 'bottom', label: 'Bottom' },
                        ].map((align) => (
                          <button
                            key={align.value}
                            type='button'
                            onClick={() =>
                              setFormData({
                                ...formData,
                                verticalAlign: align.value,
                              })
                            }
                            className={`flex-1 px-3 py-2 text-sm border rounded-lg transition ${
                              formData.verticalAlign === align.value
                                ? 'bg-red-500 text-white border-red-500'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-red-300'
                            }`}
                          >
                            {align.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Container Styling Options */}
                <div className='border-t-2 border-gray-200 pt-4'>
                  <h4 className='text-sm font-semibold text-gray-700 mb-3'>
                    🎨 Container Styling
                  </h4>

                  <div className='grid grid-cols-2 gap-3'>
                    <div>
                      <label className='block text-xs font-medium text-gray-600 mb-1'>
                        Border Style
                      </label>
                      <select
                        value={formData.borderStyle}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            borderStyle: e.target.value,
                          })
                        }
                        className='w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-red-400 focus:outline-none'
                      >
                        <option value='solid'>Solid</option>
                        <option value='dashed'>Dashed</option>
                        <option value='dotted'>Dotted</option>
                        <option value='double'>Double</option>
                        <option value='none'>None</option>
                      </select>
                    </div>

                    <div>
                      <label className='block text-xs font-medium text-gray-600 mb-1'>
                        Border Width
                      </label>
                      <select
                        value={formData.borderWidth}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            borderWidth: e.target.value,
                          })
                        }
                        className='w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-red-400 focus:outline-none'
                      >
                        <option value='0px'>None (0px)</option>
                        <option value='1px'>Thin (1px)</option>
                        <option value='2px'>Medium (2px)</option>
                        <option value='3px'>Thick (3px)</option>
                        <option value='4px'>Extra Thick (4px)</option>
                        <option value='6px'>Very Thick (6px)</option>
                      </select>
                    </div>

                    <div>
                      <label className='block text-xs font-medium text-gray-600 mb-1'>
                        Border Color
                      </label>
                      <input
                        type='color'
                        value={formData.borderColor || '#000000'}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            borderColor: e.target.value,
                          })
                        }
                        className='h-12 w-full border border-gray-300 rounded cursor-pointer'
                      />
                    </div>

                    <div>
                      <label className='block text-xs font-medium text-gray-600 mb-1'>
                        Corner Roundness
                      </label>
                      <select
                        value={formData.borderRadius}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            borderRadius: e.target.value,
                          })
                        }
                        className='w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-red-400 focus:outline-none'
                      >
                        <option value='0px'>Sharp (0px)</option>
                        <option value='4px'>Slightly Rounded (4px)</option>
                        <option value='8px'>Rounded (8px)</option>
                        <option value='12px'>Very Rounded (12px)</option>
                        <option value='16px'>Extra Rounded (16px)</option>
                        <option value='24px'>Pill-Shaped (24px)</option>
                      </select>
                    </div>

                    <div>
                      <label className='block text-xs font-medium text-gray-600 mb-1'>
                        Inner Padding
                      </label>
                      <select
                        value={formData.padding}
                        onChange={(e) =>
                          setFormData({ ...formData, padding: e.target.value })
                        }
                        className='w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-red-400 focus:outline-none'
                      >
                        <option value='0px'>None (0px)</option>
                        <option value='8px'>Compact (8px)</option>
                        <option value='12px'>Cozy (12px)</option>
                        <option value='16px'>Normal (16px)</option>
                        <option value='20px'>Comfortable (20px)</option>
                        <option value='24px'>Spacious (24px)</option>
                        <option value='32px'>Extra Spacious (32px)</option>
                      </select>
                    </div>

                    <div>
                      <label className='block text-xs font-medium text-gray-600 mb-1'>
                        Shadow Effect
                      </label>
                      <select
                        value={formData.boxShadow}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            boxShadow: e.target.value,
                          })
                        }
                        className='w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-red-400 focus:outline-none'
                      >
                        <option value='none'>None</option>
                        <option value='0 1px 3px rgba(0,0,0,0.1)'>
                          Subtle
                        </option>
                        <option value='0 2px 8px rgba(0,0,0,0.15)'>
                          Light
                        </option>
                        <option value='0 4px 12px rgba(0,0,0,0.2)'>
                          Medium
                        </option>
                        <option value='0 8px 24px rgba(0,0,0,0.25)'>
                          Strong
                        </option>
                        <option value='0 12px 32px rgba(0,0,0,0.3)'>
                          Very Strong
                        </option>
                        <option value='0 4px 12px rgba(255,0,0,0.3)'>
                          Red Glow
                        </option>
                        <option value='0 4px 12px rgba(0,255,0,0.3)'>
                          Green Glow
                        </option>
                        <option value='0 4px 12px rgba(255,215,0,0.5)'>
                          Gold Glow
                        </option>
                      </select>
                    </div>
                  </div>
                </div>

                {showImageField && (
                  <div className='image-url-input'>
                    <label className='block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2'>
                      Image URL
                      <div className='group relative'>
                        <span className='text-blue-500 cursor-help text-lg'>
                          ℹ️
                        </span>
                        <div className='invisible group-hover:visible absolute left-0 top-6 bg-gray-900 text-white text-xs rounded p-3 w-64 z-10 shadow-lg'>
                          <p className='font-semibold mb-1'>
                            Need an image URL?
                          </p>
                          <p className='mb-2'>
                            Upload to Imgur.com (free, no signup)
                          </p>
                          <p className='text-gray-300'>
                            Right-click the uploaded image → "Copy image
                            address"
                          </p>
                        </div>
                      </div>
                    </label>
                    <input
                      type='url'
                      value={formData.imageUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, imageUrl: e.target.value })
                      }
                      placeholder='https://i.imgur.com/example.jpg'
                      className='w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-400 focus:outline-none'
                    />
                    <p className='text-xs text-gray-500 mt-1'>
                      💡 Tip: Use a direct image link ending in .jpg, .png, or
                      .gif
                    </p>
                  </div>
                )}

                {showVideoField && (
                  <div className='video-url-input'>
                    <label className='block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2'>
                      Video URL
                      <div className='group relative'>
                        <span className='text-blue-500 cursor-help text-lg'>
                          ℹ️
                        </span>
                        <div className='invisible group-hover:visible absolute left-0 top-6 bg-gray-900 text-white text-xs rounded p-3 w-64 z-10 shadow-lg'>
                          <p className='font-semibold mb-1'>
                            Supported platforms:
                          </p>
                          <p className='mb-1'>✓ YouTube</p>
                          <p className='text-gray-300'>✓ Vimeo</p>
                          <p className='mt-2 text-gray-300'>
                            Just paste any YouTube or Vimeo URL!
                          </p>
                        </div>
                      </div>
                    </label>
                    <input
                      type='url'
                      value={formData.videoUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, videoUrl: e.target.value })
                      }
                      placeholder='https://www.youtube.com/watch?v=...'
                      className='w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-400 focus:outline-none'
                    />
                    <p className='text-xs text-gray-500 mt-1'>
                      💡 Paste a YouTube or Vimeo link - we'll convert it
                      automatically
                    </p>
                  </div>
                )}

                {showLinkField && (
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      External Link URL
                    </label>
                    <input
                      type='url'
                      value={formData.linkUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, linkUrl: e.target.value })
                      }
                      placeholder='https://example.com'
                      className='w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-400 focus:outline-none'
                    />
                    <label className='block text-sm font-medium text-gray-700 mb-2 mt-3'>
                      Link Button Text (optional)
                    </label>
                    <input
                      type='text'
                      value={formData.linkText}
                      onChange={(e) =>
                        setFormData({ ...formData, linkText: e.target.value })
                      }
                      placeholder='Visit Website'
                      className='w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-400 focus:outline-none'
                    />
                    <p className='text-xs text-gray-500 mt-1'>
                      💡 Add links to websites, recipes, playlists, or anything
                      else!
                    </p>
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
