'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { themePresets, getThemePreset, getButtonStyles } from '@/lib/themes';
import { convertToEmbedUrl } from '@/lib/videoUtils';
import HelpModal from '@/components/HelpModal';
import IdeasModal from '@/components/IdeasModal';
import SnowfallDecoration from '@/components/decorations/SnowfallDecoration';
import LightsDecoration from '@/components/decorations/LightsDecoration';
import GlowDecoration from '@/components/decorations/GlowDecoration';
import ConfettiDecoration from '@/components/decorations/ConfettiDecoration';
import StarsDecoration from '@/components/decorations/StarsDecoration';
import CandleDecoration from '@/components/decorations/CandleDecoration';
import AuroraDecoration from '@/components/decorations/AuroraDecoration';
import RibbonsDecoration from '@/components/decorations/RibbonsDecoration';

// Legacy entry type retained for backward compatibility with existing records
type EntryType = 'TEXT' | 'POEM' | 'IMAGE' | 'VIDEO';

// Decoration options type
interface DecorationOptions {
  density?: number;
  speed?: number;
  colors?: string[];
  color?: string;
  intensity?: number;
  pulse?: boolean;
  size?: number;
  twinkleSpeed?: number;
  count?: number;
  flameColor?: string;
  brightness?: number;
}

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
  backgroundGradientEnabled?: boolean;
  backgroundGradientColor2?: string;
  textAlign?: string;
  verticalAlign?: string;
  borderColor?: string;
  borderGradientEnabled?: boolean;
  borderGradientColor2?: string;
  borderWidth?: string;
  borderStyle?: string;
  borderRadius?: string;
  padding?: string;
  boxShadow?: string;
  decorationEnabled?: boolean;
  decorationType?: string | null;
  decorationOptions?: DecorationOptions;
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
  buttonStyle?: string;
  buttonPrimaryColor?: string;
  buttonSecondaryColor?: string;
  dateButtonStyle?: string;
  datePrimaryColor?: string;
  dateSecondaryColor?: string;
  dateTextColor?: string;
  dateOpenedPrimaryColor?: string;
  dateOpenedSecondaryColor?: string;
  dateUnavailableColor?: string;
  dateBorderRadius?: string;
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
  const [showIdeas, setShowIdeas] = useState(false);
  const [showQuickTips, setShowQuickTips] = useState(false);
  const [themeData, setThemeData] = useState({
    theme: 'classic',
    backgroundColor: '#f9fafb',
    backgroundPattern: 'none',
    primaryColor: '#dc2626',
    secondaryColor: '#16a34a',
    textColor: '#111827',
    snowflakesEnabled: true,
    buttonStyle: 'gradient',
    buttonPrimaryColor: '#dc2626',
    buttonSecondaryColor: '#16a34a',
    dateButtonStyle: 'gradient',
    datePrimaryColor: '#dc2626',
    dateSecondaryColor: '#16a34a',
    dateTextColor: '#ffffff',
    dateOpenedPrimaryColor: '#16a34a',
    dateOpenedSecondaryColor: '#22c55e',
    dateUnavailableColor: '#d1d5db',
    dateBorderRadius: '16px',
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
    backgroundGradientEnabled: false,
    backgroundGradientColor2: '#ffffff',
    textAlign: 'center',
    verticalAlign: 'middle',
    borderColor: '',
    borderGradientEnabled: false,
    borderGradientColor2: '#000000',
    borderWidth: '0px',
    borderStyle: 'solid',
    borderRadius: '0px',
    padding: '16px',
    boxShadow: 'none',
    // Decorations (Phase 1)
    decorationEnabled: false,
    decorationType: 'SNOW' as string | null,
    decorationOptions: { density: 0.6, speed: 1 } as DecorationOptions | null,
  });
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [calendarTitle, setCalendarTitle] = useState('');
  const [calendarDescription, setCalendarDescription] = useState('');
  const [showImageField, setShowImageField] = useState(false);
  const [showVideoField, setShowVideoField] = useState(false);
  const [showLinkField, setShowLinkField] = useState(false);
  const [isSavingEntry, setIsSavingEntry] = useState(false);
  const [isSavingTheme, setIsSavingTheme] = useState(false);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ show: false, message: '', type: 'success' });
  const [validationModal, setValidationModal] = useState<{
    show: boolean;
    message: string;
  }>({ show: false, message: '' });

  const showToast = (
    message: string,
    type: 'success' | 'error' = 'success'
  ) => {
    setToast({ show: true, message, type });
    setTimeout(
      () => setToast({ show: false, message: '', type: 'success' }),
      3000
    );
  };

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
          setCalendarTitle(data.title || '');
          setCalendarDescription(data.description || '');
          // Load theme data
          setThemeData({
            theme: data.theme || 'classic',
            backgroundColor: data.backgroundColor || '#f9fafb',
            backgroundPattern: data.backgroundPattern || 'none',
            primaryColor: data.primaryColor || '#dc2626',
            secondaryColor: data.secondaryColor || '#16a34a',
            textColor: data.textColor || '#111827',
            snowflakesEnabled: data.snowflakesEnabled !== false,
            buttonStyle: data.buttonStyle || 'gradient',
            buttonPrimaryColor: data.buttonPrimaryColor || '#dc2626',
            buttonSecondaryColor: data.buttonSecondaryColor || '#16a34a',
            dateButtonStyle: data.dateButtonStyle || 'gradient',
            datePrimaryColor: data.datePrimaryColor || '#dc2626',
            dateSecondaryColor: data.dateSecondaryColor || '#16a34a',
            dateTextColor: data.dateTextColor || '#ffffff',
            dateOpenedPrimaryColor: data.dateOpenedPrimaryColor || '#16a34a',
            dateOpenedSecondaryColor:
              data.dateOpenedSecondaryColor || '#22c55e',
            dateUnavailableColor: data.dateUnavailableColor || '#d1d5db',
            dateBorderRadius: data.dateBorderRadius || '16px',
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
        backgroundGradientEnabled: entry.backgroundGradientEnabled || false,
        backgroundGradientColor2: entry.backgroundGradientColor2 || '#ffffff',
        textAlign: entry.textAlign || 'center',
        verticalAlign: entry.verticalAlign || 'middle',
        borderColor: entry.borderColor || '',
        borderGradientEnabled: entry.borderGradientEnabled || false,
        borderGradientColor2: entry.borderGradientColor2 || '#000000',
        borderWidth: entry.borderWidth || '0px',
        borderStyle: entry.borderStyle || 'solid',
        borderRadius: entry.borderRadius || '0px',
        padding: entry.padding || '16px',
        boxShadow: entry.boxShadow || 'none',
        decorationEnabled:
          (entry as unknown as CalendarEntry).decorationEnabled || false,
        decorationType:
          (entry as unknown as CalendarEntry).decorationType || 'SNOW',
        decorationOptions: (entry as unknown as CalendarEntry)
          .decorationOptions || {
          density: 0.6,
          speed: 1,
        },
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
        backgroundGradientEnabled: false,
        backgroundGradientColor2: '#ffffff',
        textAlign: 'center',
        verticalAlign: 'middle',
        borderColor: '',
        borderGradientEnabled: false,
        borderGradientColor2: '#000000',
        borderWidth: '0px',
        borderStyle: 'solid',
        borderRadius: '0px',
        padding: '16px',
        boxShadow: 'none',
        decorationEnabled: false,
        decorationType: 'SNOW',
        decorationOptions: { density: 0.6, speed: 1 },
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
      setValidationModal({ show: true, message: 'Title is required' });
      return;
    }

    if (
      !formData.content.trim() &&
      !formData.imageUrl.trim() &&
      !formData.videoUrl.trim() &&
      !formData.linkUrl.trim()
    ) {
      setValidationModal({
        show: true,
        message:
          'Please add at least some content (text, image, video, or link)',
      });
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

    setIsSavingEntry(true);
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
          showToast(error.error || 'Failed to save entry', 'error');
          setIsSavingEntry(false);
          return;
        }

        await fetchCalendar();
        showToast('Entry saved successfully!');
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
          showToast(error.error || 'Failed to save entry', 'error');
          setIsSavingEntry(false);
          return;
        }

        await fetchCalendar();
        showToast('Entry created successfully!');
        setSelectedDay(null);
      }
    } catch (error) {
      console.error('Error saving entry:', error);
      showToast('Failed to save entry', 'error');
    } finally {
      setIsSavingEntry(false);
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
        buttonStyle: preset.buttonStyle || 'gradient',
        buttonPrimaryColor: preset.buttonPrimaryColor || preset.primaryColor,
        buttonSecondaryColor:
          preset.buttonSecondaryColor || preset.secondaryColor,
        dateButtonStyle: preset.dateButtonStyle || 'gradient',
        datePrimaryColor: preset.datePrimaryColor || preset.primaryColor,
        dateSecondaryColor: preset.dateSecondaryColor || preset.secondaryColor,
        dateTextColor: preset.dateTextColor || '#ffffff',
        dateOpenedPrimaryColor:
          preset.dateOpenedPrimaryColor || preset.secondaryColor,
        dateOpenedSecondaryColor: preset.dateOpenedSecondaryColor || '#22c55e',
        dateUnavailableColor: preset.dateUnavailableColor || '#d1d5db',
        dateBorderRadius: preset.dateBorderRadius || '16px',
      });
    }
  };

  const handleSaveTheme = async () => {
    if (!resolvedParams) return;

    setIsSavingTheme(true);
    try {
      const response = await fetch(`/api/calendars/${resolvedParams.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(themeData),
      });

      if (response.ok) {
        await fetchCalendar();
        showToast('Theme saved successfully!');
      } else {
        showToast('Failed to save theme', 'error');
      }
    } catch (error) {
      console.error('Error saving theme:', error);
      showToast('Failed to save theme', 'error');
    } finally {
      setIsSavingTheme(false);
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
      <IdeasModal isOpen={showIdeas} onClose={() => setShowIdeas(false)} />

      {/* Validation Modal */}
      {validationModal.show && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border-4 border-red-200'>
            <div className='text-center mb-4'>
              <div className='text-5xl mb-3'>⚠️</div>
              <h3 className='text-xl font-bold text-gray-800 mb-2'>
                Validation Error
              </h3>
              <p className='text-gray-600'>{validationModal.message}</p>
            </div>
            <button
              onClick={() => setValidationModal({ show: false, message: '' })}
              className='w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition'
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className='bg-white/80 backdrop-blur-sm border-b border-red-100'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            <Link href='/dashboard' className='flex items-center space-x-2'>
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
            <div className='flex items-center gap-4'>
              <button
                onClick={() => setShowIdeas(true)}
                className='flex items-center gap-2 text-gray-700 hover:text-purple-600 font-medium transition'
              >
                <span className='text-xl'>💡</span>
                <span className='hidden sm:inline'>Ideas</span>
              </button>
              <button
                onClick={() => setShowHelp(true)}
                className='flex items-center gap-2 text-gray-700 hover:text-red-600 font-medium transition'
              >
                <span className='text-xl'>❓</span>
                <span className='hidden sm:inline'>Help</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='mb-8'>
          <h1 className='text-4xl font-bold text-gray-800 mb-4'>
            Edit Calendar Details
          </h1>
          <div className='bg-white rounded-2xl shadow-lg p-6 border-2 border-red-200'>
            <div className='grid gap-4 md:grid-cols-2'>
              <div>
                <label
                  htmlFor='calendarTitle'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  Calendar Title
                </label>
                <input
                  id='calendarTitle'
                  type='text'
                  value={calendarTitle}
                  onChange={(e) => setCalendarTitle(e.target.value)}
                  className='w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-400 focus:outline-none transition text-gray-900'
                  placeholder='e.g., Christmas 2025 for Sarah'
                />
              </div>
              <div>
                <label
                  htmlFor='calendarDescription'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  Description (optional)
                </label>
                <textarea
                  id='calendarDescription'
                  value={calendarDescription}
                  onChange={(e) => setCalendarDescription(e.target.value)}
                  rows={3}
                  className='w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-400 focus:outline-none transition resize-none text-gray-900'
                  placeholder='Add a special message or description'
                />
              </div>
            </div>
            <div className='mt-4 flex gap-3'>
              <button
                type='button'
                onClick={async () => {
                  try {
                    const res = await fetch(`/api/calendars/${calendar.id}`, {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        title: calendarTitle,
                        description: calendarDescription,
                      }),
                    });
                    if (res.ok) {
                      const updated = await res.json();
                      setCalendar(updated);
                      showToast('Calendar details saved', 'success');
                    } else {
                      const err = await res
                        .json()
                        .catch(() => ({ error: 'Failed to save' }));
                      showToast(
                        err.error || 'Failed to save calendar',
                        'error'
                      );
                    }
                  } catch (e) {
                    showToast('Network error while saving', 'error');
                  }
                }}
                className='inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-green-500 text-white text-sm font-semibold hover:from-red-600 hover:to-green-600 transition'
              >
                Save Details
              </button>
              <button
                type='button'
                onClick={() => {
                  setCalendarTitle(calendar?.title || '');
                  setCalendarDescription(calendar?.description || '');
                }}
                className='inline-flex items-center px-4 py-2 rounded-lg border-2 border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition'
              >
                Reset
              </button>
            </div>
          </div>
          <div className='mt-6 text-sm text-gray-500 space-y-3'>
            <div>
              Share link:{' '}
              <code className='bg-white px-2 py-1 rounded'>
                {typeof window !== 'undefined' ? window.location.origin : ''}
                /share/{calendar.shareId}
              </code>
              <button
                type='button'
                onClick={() => {
                  const shareUrl = `${window.location.origin}/share/${calendar.shareId}`;
                  if (navigator?.clipboard?.writeText) {
                    navigator.clipboard.writeText(shareUrl).then(() => {
                      setCopyFeedback(true);
                      setTimeout(() => setCopyFeedback(false), 1800);
                    });
                  } else {
                    // Fallback for very old browsers
                    const tempInput = document.createElement('input');
                    tempInput.value = shareUrl;
                    document.body.appendChild(tempInput);
                    tempInput.select();
                    document.execCommand('copy');
                    document.body.removeChild(tempInput);
                    setCopyFeedback(true);
                    setTimeout(() => setCopyFeedback(false), 1800);
                  }
                }}
                className='ml-2 inline-flex items-center px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400'
                aria-label='Copy share link to clipboard'
              >
                {copyFeedback ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div>
              <Link
                href={`/share/${calendar.shareId}?ownerPreview=1`}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-green-500 text-white text-sm font-semibold hover:from-blue-600 hover:to-green-600 transition'
              >
                Preview Calendar
              </Link>
              <p className='text-xs text-gray-400 mt-2'>
                Save an entry before previewing to see changes reflected. As the
                owner, you can test all doors.
              </p>
            </div>
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

              {/* Button Style Section */}
              <div className='border-t-2 border-gray-200 pt-6'>
                <h3 className='text-lg font-semibold text-gray-800 mb-4'>
                  🔘 Button Styling
                </h3>

                <div className='space-y-4'>
                  {/* Button Style Type */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Button Style
                    </label>
                    <div className='grid grid-cols-3 gap-3'>
                      {[
                        { value: 'gradient', label: 'Gradient', emoji: '🌈' },
                        { value: 'solid', label: 'Solid', emoji: '⬛' },
                        { value: 'outline', label: 'Outline', emoji: '⬜' },
                      ].map((style) => (
                        <button
                          key={style.value}
                          type='button'
                          onClick={() =>
                            setThemeData({
                              ...themeData,
                              buttonStyle: style.value,
                            })
                          }
                          className={`p-3 rounded-lg border-2 text-center transition ${
                            themeData.buttonStyle === style.value
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className='text-2xl mb-1'>{style.emoji}</div>
                          <div className='text-xs font-medium'>
                            {style.label}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Button Colors */}
                  <div className='grid md:grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Button Primary Color
                      </label>
                      <input
                        type='color'
                        value={themeData.buttonPrimaryColor}
                        onChange={(e) =>
                          setThemeData({
                            ...themeData,
                            buttonPrimaryColor: e.target.value,
                          })
                        }
                        className='h-12 w-full rounded border-2 border-gray-200 cursor-pointer'
                      />
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Button Secondary Color
                        {themeData.buttonStyle === 'gradient' &&
                          ' (Gradient End)'}
                      </label>
                      <input
                        type='color'
                        value={themeData.buttonSecondaryColor}
                        onChange={(e) =>
                          setThemeData({
                            ...themeData,
                            buttonSecondaryColor: e.target.value,
                          })
                        }
                        className='h-12 w-full rounded border-2 border-gray-200 cursor-pointer'
                        disabled={themeData.buttonStyle === 'outline'}
                      />
                    </div>
                  </div>

                  {/* Button Preview */}
                  <div className='bg-gray-50 p-4 rounded-lg'>
                    <p className='text-sm font-medium text-gray-700 mb-3'>
                      Button Preview:
                    </p>
                    <button
                      type='button'
                      style={getButtonStyles(
                        themeData.buttonStyle,
                        themeData.buttonPrimaryColor,
                        themeData.buttonSecondaryColor
                      )}
                      className='px-6 py-3 rounded-lg font-semibold transition hover:opacity-90'
                    >
                      Sample Button
                    </button>
                  </div>
                </div>
              </div>

              {/* Calendar Date Button Styling Section */}
              <div className='border-t-2 border-gray-200 pt-6'>
                <h3 className='text-lg font-semibold text-gray-800 mb-4'>
                  📅 Calendar Date Styling
                </h3>
                <p className='text-sm text-gray-600 mb-4'>
                  Customize how the calendar day buttons look
                </p>

                <div className='space-y-4'>
                  {/* Date Button Style Type */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Date Button Style
                    </label>
                    <div className='grid grid-cols-3 gap-3'>
                      {[
                        { value: 'gradient', label: 'Gradient', emoji: '🌈' },
                        { value: 'solid', label: 'Solid', emoji: '⬛' },
                      ].map((style) => (
                        <button
                          key={style.value}
                          type='button'
                          onClick={() =>
                            setThemeData({
                              ...themeData,
                              dateButtonStyle: style.value,
                            })
                          }
                          className={`p-3 rounded-lg border-2 text-center transition ${
                            themeData.dateButtonStyle === style.value
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className='text-2xl mb-1'>{style.emoji}</div>
                          <div className='text-xs font-medium'>
                            {style.label}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Unopened Date Colors */}
                  <div>
                    <h4 className='text-sm font-semibold text-gray-700 mb-3'>
                      Unopened Dates (Available to Open)
                    </h4>
                    <div className='grid md:grid-cols-3 gap-4'>
                      <div>
                        <label className='block text-xs font-medium text-gray-600 mb-2'>
                          Primary Color
                        </label>
                        <input
                          type='color'
                          value={themeData.datePrimaryColor}
                          onChange={(e) =>
                            setThemeData({
                              ...themeData,
                              datePrimaryColor: e.target.value,
                            })
                          }
                          className='h-10 w-full rounded border-2 border-gray-200 cursor-pointer'
                        />
                      </div>

                      {themeData.dateButtonStyle === 'gradient' && (
                        <div>
                          <label className='block text-xs font-medium text-gray-600 mb-2'>
                            Secondary Color (Gradient)
                          </label>
                          <input
                            type='color'
                            value={themeData.dateSecondaryColor}
                            onChange={(e) =>
                              setThemeData({
                                ...themeData,
                                dateSecondaryColor: e.target.value,
                              })
                            }
                            className='h-10 w-full rounded border-2 border-gray-200 cursor-pointer'
                          />
                        </div>
                      )}

                      <div>
                        <label className='block text-xs font-medium text-gray-600 mb-2'>
                          Text Color
                        </label>
                        <input
                          type='color'
                          value={themeData.dateTextColor}
                          onChange={(e) =>
                            setThemeData({
                              ...themeData,
                              dateTextColor: e.target.value,
                            })
                          }
                          className='h-10 w-full rounded border-2 border-gray-200 cursor-pointer'
                        />
                      </div>
                    </div>
                  </div>

                  {/* Opened Date Colors */}
                  <div>
                    <h4 className='text-sm font-semibold text-gray-700 mb-3'>
                      Opened Dates (Already Viewed)
                    </h4>
                    <div className='grid md:grid-cols-2 gap-4'>
                      <div>
                        <label className='block text-xs font-medium text-gray-600 mb-2'>
                          Primary Color
                        </label>
                        <input
                          type='color'
                          value={themeData.dateOpenedPrimaryColor}
                          onChange={(e) =>
                            setThemeData({
                              ...themeData,
                              dateOpenedPrimaryColor: e.target.value,
                            })
                          }
                          className='h-10 w-full rounded border-2 border-gray-200 cursor-pointer'
                        />
                      </div>

                      {themeData.dateButtonStyle === 'gradient' && (
                        <div>
                          <label className='block text-xs font-medium text-gray-600 mb-2'>
                            Secondary Color (Gradient)
                          </label>
                          <input
                            type='color'
                            value={themeData.dateOpenedSecondaryColor}
                            onChange={(e) =>
                              setThemeData({
                                ...themeData,
                                dateOpenedSecondaryColor: e.target.value,
                              })
                            }
                            className='h-10 w-full rounded border-2 border-gray-200 cursor-pointer'
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Unavailable Date Color */}
                  <div>
                    <h4 className='text-sm font-semibold text-gray-700 mb-3'>
                      Unavailable Dates (Future Days)
                    </h4>
                    <div className='grid md:grid-cols-2 gap-4'>
                      <div>
                        <label className='block text-xs font-medium text-gray-600 mb-2'>
                          Background Color
                        </label>
                        <input
                          type='color'
                          value={themeData.dateUnavailableColor}
                          onChange={(e) =>
                            setThemeData({
                              ...themeData,
                              dateUnavailableColor: e.target.value,
                            })
                          }
                          className='h-10 w-full rounded border-2 border-gray-200 cursor-pointer'
                        />
                      </div>

                      <div>
                        <label className='block text-xs font-medium text-gray-600 mb-2'>
                          Border Radius: {themeData.dateBorderRadius}
                        </label>
                        <input
                          type='range'
                          min='0'
                          max='32'
                          step='2'
                          value={parseInt(themeData.dateBorderRadius) || 16}
                          onChange={(e) =>
                            setThemeData({
                              ...themeData,
                              dateBorderRadius: `${e.target.value}px`,
                            })
                          }
                          className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500'
                        />
                        <div className='flex justify-between text-xs text-gray-500 mt-1'>
                          <span>Sharp</span>
                          <span>Rounded</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Date Preview */}
                  <div className='bg-gray-50 p-4 rounded-lg'>
                    <p className='text-sm font-medium text-gray-700 mb-3'>
                      Calendar Date Preview:
                    </p>
                    <div className='flex gap-3 justify-center'>
                      {/* Unopened */}
                      <div className='text-center'>
                        <div
                          className='w-16 h-16 flex items-center justify-center font-bold shadow-lg transition hover:scale-105'
                          style={{
                            backgroundImage:
                              themeData.dateButtonStyle === 'gradient'
                                ? `linear-gradient(135deg, ${themeData.datePrimaryColor}, ${themeData.dateSecondaryColor})`
                                : undefined,
                            backgroundColor:
                              themeData.dateButtonStyle === 'solid'
                                ? themeData.datePrimaryColor
                                : undefined,
                            color: themeData.dateTextColor,
                            borderRadius: themeData.dateBorderRadius,
                          }}
                        >
                          12
                        </div>
                        <p className='text-xs text-gray-600 mt-1'>Unopened</p>
                      </div>

                      {/* Opened */}
                      <div className='text-center'>
                        <div
                          className='w-16 h-16 flex flex-col items-center justify-center font-bold shadow-lg'
                          style={{
                            backgroundImage:
                              themeData.dateButtonStyle === 'gradient'
                                ? `linear-gradient(135deg, ${themeData.dateOpenedPrimaryColor}, ${themeData.dateOpenedSecondaryColor})`
                                : undefined,
                            backgroundColor:
                              themeData.dateButtonStyle === 'solid'
                                ? themeData.dateOpenedPrimaryColor
                                : undefined,
                            color: themeData.dateTextColor,
                            borderRadius: themeData.dateBorderRadius,
                          }}
                        >
                          <span className='text-sm'>5</span>
                          <span className='text-xs'>✓</span>
                        </div>
                        <p className='text-xs text-gray-600 mt-1'>Opened</p>
                      </div>

                      {/* Unavailable */}
                      <div className='text-center'>
                        <div
                          className='w-16 h-16 flex items-center justify-center font-bold shadow-lg opacity-50'
                          style={{
                            backgroundColor: themeData.dateUnavailableColor,
                            color: '#6b7280',
                            borderRadius: themeData.dateBorderRadius,
                          }}
                        >
                          25
                        </div>
                        <p className='text-xs text-gray-600 mt-1'>
                          Unavailable
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className='pt-4 border-t'>
                <button
                  onClick={handleSaveTheme}
                  disabled={isSavingTheme}
                  className='w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
                >
                  {isSavingTheme ? (
                    <>
                      <svg className='animate-spin h-5 w-5' viewBox='0 0 24 24'>
                        <circle
                          className='opacity-25'
                          cx='12'
                          cy='12'
                          r='10'
                          stroke='currentColor'
                          strokeWidth='4'
                          fill='none'
                        />
                        <path
                          className='opacity-75'
                          fill='currentColor'
                          d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                        />
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>💾 Save Theme Settings</>
                  )}
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
                  <li>Right-click → &ldquo;Copy image address&rdquo;</li>
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
                  <li>Paste it - we&apos;ll convert it automatically!</li>
                </ol>
              </div>

              <div className='bg-white p-4 rounded-lg shadow-sm border border-yellow-100'>
                <h3 className='font-bold text-lg mb-2 flex items-center gap-2'>
                  <span>🔗</span> Adding Links
                </h3>
                <ol className='text-sm text-gray-700 space-y-1 list-decimal list-inside'>
                  <li>Click &ldquo;Add Link&rdquo; in the entry editor</li>
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
                  <li>Customize each entry&apos;s colors independently</li>
                  <li>Try different border styles for variety</li>
                </ul>
              </div>

              <div className='bg-white p-4 rounded-lg shadow-sm border border-red-100'>
                <h3 className='font-bold text-lg mb-2 flex items-center gap-2'>
                  <span>👀</span> Preview & Test
                </h3>
                <ul className='text-sm text-gray-700 space-y-1 list-disc list-inside'>
                  <li>Use &ldquo;Owner Preview&rdquo; to test all doors</li>
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
                    className='w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-400 focus:outline-none text-gray-900'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Content
                  </label>
                  <div
                    className='w-full overflow-hidden relative'
                    style={{
                      padding: formData.borderGradientEnabled
                        ? formData.borderWidth || '2px'
                        : '0',
                      background: formData.borderGradientEnabled
                        ? `linear-gradient(135deg, ${
                            formData.borderColor || '#000000'
                          }, ${formData.borderGradientColor2 || '#000000'})`
                        : 'transparent',
                      borderRadius: formData.borderRadius,
                      boxShadow: formData.boxShadow,
                    }}
                  >
                    {/* Live decoration preview */}
                    {formData.decorationEnabled &&
                      (formData.decorationType === 'SNOW' ? (
                        <SnowfallDecoration
                          density={formData.decorationOptions?.density ?? 0.6}
                          speed={formData.decorationOptions?.speed ?? 1}
                        />
                      ) : formData.decorationType === 'LIGHTS' ? (
                        <LightsDecoration
                          colors={
                            formData.decorationOptions?.colors ?? undefined
                          }
                          speed={formData.decorationOptions?.speed ?? 1}
                          brightness={
                            formData.decorationOptions?.brightness ?? 1
                          }
                        />
                      ) : formData.decorationType === 'GLOW' ? (
                        <GlowDecoration
                          color={formData.decorationOptions?.color ?? '#ffd33b'}
                          intensity={
                            formData.decorationOptions?.intensity ?? 0.7
                          }
                          pulse={formData.decorationOptions?.pulse ?? true}
                        />
                      ) : formData.decorationType === 'CONFETTI' ? (
                        <ConfettiDecoration
                          colors={
                            formData.decorationOptions?.colors ?? undefined
                          }
                          density={formData.decorationOptions?.density ?? 0.6}
                          speed={formData.decorationOptions?.speed ?? 1}
                        />
                      ) : formData.decorationType === 'STARS' ? (
                        <StarsDecoration
                          color={formData.decorationOptions?.color ?? '#ffd33b'}
                          size={formData.decorationOptions?.size ?? 1}
                          density={formData.decorationOptions?.density ?? 0.5}
                          twinkleSpeed={
                            formData.decorationOptions?.twinkleSpeed ?? 1
                          }
                        />
                      ) : formData.decorationType === 'CANDLE' ? (
                        <CandleDecoration
                          count={formData.decorationOptions?.count ?? 4}
                          flameColor={
                            formData.decorationOptions?.flameColor ?? '#ff6600'
                          }
                          intensity={formData.decorationOptions?.intensity ?? 1}
                        />
                      ) : formData.decorationType === 'AURORA' ? (
                        <AuroraDecoration
                          colors={
                            formData.decorationOptions?.colors ?? undefined
                          }
                          speed={formData.decorationOptions?.speed ?? 1}
                          intensity={
                            formData.decorationOptions?.intensity ?? 0.7
                          }
                        />
                      ) : formData.decorationType === 'RIBBONS' ? (
                        <RibbonsDecoration
                          colors={
                            formData.decorationOptions?.colors ?? undefined
                          }
                          count={formData.decorationOptions?.count ?? 4}
                          speed={formData.decorationOptions?.speed ?? 1}
                        />
                      ) : null)}
                    <div
                      className='w-full'
                      style={{
                        borderColor: formData.borderGradientEnabled
                          ? 'transparent'
                          : formData.borderColor || '#e5e7eb',
                        borderWidth: formData.borderGradientEnabled
                          ? '0'
                          : formData.borderWidth,
                        borderStyle: formData.borderStyle as
                          | 'solid'
                          | 'dashed'
                          | 'dotted'
                          | 'none',
                        borderRadius: formData.borderGradientEnabled
                          ? `calc(${formData.borderRadius} - ${
                              formData.borderWidth || '2px'
                            })`
                          : formData.borderRadius,
                        background: formData.backgroundGradientEnabled
                          ? `linear-gradient(135deg, ${
                              formData.backgroundColor || '#ffffff'
                            }, ${
                              formData.backgroundGradientColor2 || '#ffffff'
                            })`
                          : formData.backgroundColor || 'transparent',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent:
                          formData.verticalAlign === 'top'
                            ? 'flex-start'
                            : formData.verticalAlign === 'bottom'
                            ? 'flex-end'
                            : 'center',
                        minHeight: '250px',
                      }}
                    >
                      <textarea
                        value={formData.content}
                        onChange={(e) =>
                          setFormData({ ...formData, content: e.target.value })
                        }
                        placeholder='Enter your message, poem, or description'
                        className='w-full bg-transparent focus:outline-none resize-none border-0'
                        style={{
                          fontFamily: formData.fontFamily,
                          fontSize: formData.fontSize,
                          color: formData.textColor,
                          textAlign: formData.textAlign as
                            | 'left'
                            | 'center'
                            | 'right'
                            | 'justify',
                          padding: formData.padding,
                          outline: 'none',
                          ...(formData.isPoem && {
                            fontStyle: 'italic',
                            lineHeight: '1.75',
                          }),
                        }}
                      />
                    </div>
                  </div>
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
                        <option value='12px'>Small</option>
                        <option value='14px'>Normal</option>
                        <option value='16px'>Medium</option>
                        <option value='18px'>Large</option>
                        <option value='20px'>X-Large</option>
                        <option value='24px'>XX-Large</option>
                        <option value='28px'>Huge</option>
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
                      <label className='flex items-center gap-2 mt-2 cursor-pointer'>
                        <input
                          type='checkbox'
                          checked={formData.backgroundGradientEnabled}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              backgroundGradientEnabled: e.target.checked,
                            })
                          }
                          className='w-4 h-4 rounded'
                        />
                        <span className='text-xs text-gray-600'>
                          Enable Gradient
                        </span>
                      </label>
                      {formData.backgroundGradientEnabled && (
                        <input
                          type='color'
                          value={formData.backgroundGradientColor2 || '#ffffff'}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              backgroundGradientColor2: e.target.value,
                            })
                          }
                          className='h-12 w-full border border-gray-300 rounded cursor-pointer mt-2'
                          title='Second gradient color'
                        />
                      )}
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

                  {/* Decorations */}
                  <div className='mb-4 p-3 rounded-lg border-2 border-green-200 bg-green-50'>
                    <div className='flex items-center justify-between'>
                      <label className='inline-flex items-center gap-2 cursor-pointer'>
                        <input
                          type='checkbox'
                          checked={formData.decorationEnabled}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              decorationEnabled: e.target.checked,
                              decorationType: e.target.checked
                                ? formData.decorationType || 'SNOW'
                                : null,
                              decorationOptions: e.target.checked
                                ? formData.decorationOptions || {
                                    density: 0.6,
                                    speed: 1,
                                  }
                                : (null as DecorationOptions | null),
                            })
                          }
                          className='w-4 h-4'
                        />
                        <span className='text-sm font-semibold'>
                          ✨ Enable Decoration
                        </span>
                      </label>
                      <select
                        value={formData.decorationType || 'SNOW'}
                        onChange={(e) => {
                          const newType = e.target.value as
                            | 'SNOW'
                            | 'LIGHTS'
                            | 'GLOW'
                            | 'CONFETTI'
                            | 'STARS'
                            | 'CANDLE'
                            | 'AURORA'
                            | 'RIBBONS';
                          setFormData({
                            ...formData,
                            decorationType: newType,
                            decorationOptions:
                              newType === 'SNOW'
                                ? { density: 0.6, speed: 1 }
                                : newType === 'LIGHTS'
                                ? {
                                    speed: 1,
                                    brightness: 1,
                                    colors: [
                                      '#ff3b3b',
                                      '#33c1ff',
                                      '#46f05a',
                                      '#ffd33b',
                                    ],
                                  }
                                : newType === 'GLOW'
                                ? {
                                    color: '#ffd33b',
                                    intensity: 0.7,
                                    pulse: true,
                                  }
                                : newType === 'CONFETTI'
                                ? {
                                    density: 0.6,
                                    speed: 1,
                                    colors: [
                                      '#ff3b3b',
                                      '#33c1ff',
                                      '#46f05a',
                                      '#ffd33b',
                                      '#ff6edb',
                                    ],
                                  }
                                : newType === 'STARS'
                                ? {
                                    color: '#ffd33b',
                                    size: 1,
                                    density: 0.5,
                                    twinkleSpeed: 1,
                                  }
                                : newType === 'CANDLE'
                                ? {
                                    count: 4,
                                    flameColor: '#ff6600',
                                    intensity: 1,
                                  }
                                : newType === 'AURORA'
                                ? {
                                    colors: ['#00ff87', '#60efff', '#b967ff'],
                                    speed: 1,
                                    intensity: 0.7,
                                  }
                                : newType === 'RIBBONS'
                                ? {
                                    colors: ['#ff3b3b', '#33c1ff', '#46f05a'],
                                    count: 4,
                                    speed: 1,
                                  }
                                : {},
                          });
                        }}
                        className='px-3 py-2 text-sm border border-gray-300 rounded-lg'
                      >
                        <option value='SNOW'>Snowfall</option>
                        <option value='LIGHTS'>Blinking Lights</option>
                        <option value='GLOW'>Ambient Glow</option>
                        <option value='CONFETTI'>Confetti</option>
                        <option value='STARS'>Twinkling Stars</option>
                        <option value='CANDLE'>Candles</option>
                        <option value='AURORA'>Aurora</option>
                        <option value='RIBBONS'>Ribbons</option>
                      </select>
                    </div>

                    {formData.decorationEnabled &&
                      formData.decorationType === 'SNOW' && (
                        <div className='grid grid-cols-2 gap-3 mt-3'>
                          <div>
                            <label className='block text-xs font-medium text-gray-600 mb-1'>
                              Snow Density
                            </label>
                            <input
                              type='range'
                              min={0.2}
                              max={1.5}
                              step={0.1}
                              value={formData.decorationOptions?.density ?? 0.6}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  decorationOptions: {
                                    ...(formData.decorationOptions || {}),
                                    density: parseFloat(e.target.value),
                                  },
                                })
                              }
                              className='w-full accent-green-500'
                            />
                            <div className='text-xs text-gray-600 mt-1'>
                              {String(
                                formData.decorationOptions?.density ?? 0.6
                              )}
                            </div>
                          </div>
                          <div>
                            <label className='block text-xs font-medium text-gray-600 mb-1'>
                              Fall Speed
                            </label>
                            <input
                              type='range'
                              min={0.5}
                              max={2.0}
                              step={0.1}
                              value={formData.decorationOptions?.speed ?? 1}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  decorationOptions: {
                                    ...(formData.decorationOptions || {}),
                                    speed: parseFloat(e.target.value),
                                  },
                                })
                              }
                              className='w-full accent-green-500'
                            />
                            <div className='text-xs text-gray-600 mt-1'>
                              {String(formData.decorationOptions?.speed ?? 1)}
                            </div>
                          </div>
                        </div>
                      )}

                    {formData.decorationEnabled &&
                      formData.decorationType === 'LIGHTS' && (
                        <div className='space-y-4 mt-3'>
                          <div className='grid grid-cols-2 gap-3'>
                            <div>
                              <label className='block text-xs font-medium text-gray-600 mb-1'>
                                Animation Speed
                              </label>
                              <input
                                type='range'
                                min={0.5}
                                max={2.0}
                                step={0.1}
                                value={formData.decorationOptions?.speed ?? 1}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    decorationOptions: {
                                      ...(formData.decorationOptions || {}),
                                      speed: parseFloat(e.target.value),
                                    },
                                  })
                                }
                                className='w-full accent-green-500'
                              />
                              <div className='text-xs text-gray-600 mt-1'>
                                {String(formData.decorationOptions?.speed ?? 1)}
                              </div>
                            </div>
                            <div>
                              <label className='block text-xs font-medium text-gray-600 mb-1'>
                                Brightness
                              </label>
                              <input
                                type='range'
                                min={0.5}
                                max={1.5}
                                step={0.05}
                                value={
                                  formData.decorationOptions?.brightness ?? 1
                                }
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    decorationOptions: {
                                      ...(formData.decorationOptions || {}),
                                      brightness: parseFloat(e.target.value),
                                    },
                                  })
                                }
                                className='w-full accent-green-500'
                              />
                              <div className='text-xs text-gray-600 mt-1'>
                                {String(
                                  formData.decorationOptions?.brightness ?? 1
                                )}
                              </div>
                            </div>
                          </div>
                          <div>
                            <label className='block text-xs font-medium text-gray-600 mb-2'>
                              Light Colors
                            </label>
                            <div className='flex flex-wrap gap-3'>
                              {(
                                formData.decorationOptions?.colors || [
                                  '#ff3b3b',
                                  '#33c1ff',
                                  '#46f05a',
                                  '#ffd33b',
                                ]
                              ).map((c: string, idx: number) => (
                                <div
                                  key={idx}
                                  className='flex items-center gap-2'
                                >
                                  <input
                                    type='color'
                                    value={c}
                                    onChange={(e) => {
                                      const newColors = [
                                        ...(formData.decorationOptions
                                          ?.colors || [
                                          '#ff3b3b',
                                          '#33c1ff',
                                          '#46f05a',
                                          '#ffd33b',
                                        ]),
                                      ];
                                      newColors[idx] = e.target.value;
                                      setFormData({
                                        ...formData,
                                        decorationOptions: {
                                          ...(formData.decorationOptions || {}),
                                          colors: newColors,
                                        },
                                      });
                                    }}
                                    className='h-10 w-10 border rounded'
                                  />
                                  {(
                                    formData.decorationOptions?.colors || [
                                      '#ff3b3b',
                                      '#33c1ff',
                                      '#46f05a',
                                      '#ffd33b',
                                    ]
                                  ).length > 1 && (
                                    <button
                                      type='button'
                                      onClick={() => {
                                        const newColors = (
                                          formData.decorationOptions
                                            ?.colors || [
                                            '#ff3b3b',
                                            '#33c1ff',
                                            '#46f05a',
                                            '#ffd33b',
                                          ]
                                        ).filter(
                                          (_: string, i: number) => i !== idx
                                        );
                                        setFormData({
                                          ...formData,
                                          decorationOptions: {
                                            ...(formData.decorationOptions ||
                                              {}),
                                            colors: newColors,
                                          },
                                        });
                                      }}
                                      className='text-xs px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200'
                                    >
                                      ✕
                                    </button>
                                  )}
                                </div>
                              ))}
                              <button
                                type='button'
                                onClick={() => {
                                  const existing = formData.decorationOptions
                                    ?.colors || [
                                    '#ff3b3b',
                                    '#33c1ff',
                                    '#46f05a',
                                    '#ffd33b',
                                  ];
                                  if (existing.length >= 8) return;
                                  const defaults = [
                                    '#ff3b3b',
                                    '#33c1ff',
                                    '#46f05a',
                                    '#ffd33b',
                                    '#ff6edb',
                                    '#9b59ff',
                                    '#ffffff',
                                    '#ffa640',
                                  ];
                                  const next =
                                    defaults[existing.length] || '#ffffff';
                                  setFormData({
                                    ...formData,
                                    decorationOptions: {
                                      ...(formData.decorationOptions || {}),
                                      colors: [...existing, next],
                                    },
                                  });
                                }}
                                className='text-xs px-3 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200'
                              >
                                + Add Color
                              </button>
                            </div>
                            <div className='mt-2 text-[11px] text-gray-500'>
                              Up to 8 colors. Lights cycle through in order.
                            </div>
                          </div>
                        </div>
                      )}

                    {formData.decorationEnabled &&
                      formData.decorationType === 'GLOW' && (
                        <div className='grid grid-cols-2 gap-3 mt-3'>
                          <div>
                            <label className='block text-xs font-medium text-gray-600 mb-1'>
                              Color
                            </label>
                            <input
                              type='color'
                              value={
                                formData.decorationOptions?.color ?? '#ffd33b'
                              }
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  decorationOptions: {
                                    ...(formData.decorationOptions || {}),
                                    color: e.target.value,
                                  },
                                })
                              }
                              className='w-20 h-10 p-1 border rounded'
                            />
                          </div>
                          <div>
                            <label className='block text-xs font-medium text-gray-600 mb-1'>
                              Intensity
                            </label>
                            <input
                              type='range'
                              min={0.2}
                              max={1.5}
                              step={0.05}
                              value={
                                formData.decorationOptions?.intensity ?? 0.7
                              }
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  decorationOptions: {
                                    ...(formData.decorationOptions || {}),
                                    intensity: parseFloat(e.target.value),
                                  },
                                })
                              }
                              className='w-full accent-green-500'
                            />
                            <div className='text-xs text-gray-600 mt-1'>
                              {String(
                                formData.decorationOptions?.intensity ?? 0.7
                              )}
                            </div>
                          </div>
                          <div className='col-span-2'>
                            <label className='inline-flex items-center gap-2 text-xs font-medium text-gray-600'>
                              <input
                                type='checkbox'
                                checked={
                                  formData.decorationOptions?.pulse ?? true
                                }
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    decorationOptions: {
                                      ...(formData.decorationOptions || {}),
                                      pulse: e.target.checked,
                                    },
                                  })
                                }
                              />
                              Pulse
                            </label>
                          </div>
                        </div>
                      )}

                    {formData.decorationEnabled &&
                      formData.decorationType === 'CONFETTI' && (
                        <div className='space-y-3 mt-3'>
                          <div className='grid grid-cols-2 gap-3'>
                            <div>
                              <label className='block text-xs font-medium text-gray-600 mb-1'>
                                Density
                              </label>
                              <input
                                type='range'
                                min={0.2}
                                max={1.5}
                                step={0.1}
                                value={
                                  formData.decorationOptions?.density ?? 0.6
                                }
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    decorationOptions: {
                                      ...(formData.decorationOptions || {}),
                                      density: parseFloat(e.target.value),
                                    },
                                  })
                                }
                                className='w-full accent-green-500'
                              />
                              <div className='text-xs text-gray-600 mt-1'>
                                {String(
                                  formData.decorationOptions?.density ?? 0.6
                                )}
                              </div>
                            </div>
                            <div>
                              <label className='block text-xs font-medium text-gray-600 mb-1'>
                                Fall Speed
                              </label>
                              <input
                                type='range'
                                min={0.5}
                                max={2.0}
                                step={0.1}
                                value={formData.decorationOptions?.speed ?? 1}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    decorationOptions: {
                                      ...(formData.decorationOptions || {}),
                                      speed: parseFloat(e.target.value),
                                    },
                                  })
                                }
                                className='w-full accent-green-500'
                              />
                              <div className='text-xs text-gray-600 mt-1'>
                                {String(formData.decorationOptions?.speed ?? 1)}
                              </div>
                            </div>
                          </div>
                          <div>
                            <label className='block text-xs font-medium text-gray-600 mb-2'>
                              Confetti Colors
                            </label>
                            <div className='flex flex-wrap gap-3'>
                              {(
                                formData.decorationOptions?.colors || [
                                  '#ff3b3b',
                                  '#33c1ff',
                                  '#46f05a',
                                  '#ffd33b',
                                  '#ff6edb',
                                ]
                              ).map((c: string, idx: number) => (
                                <div
                                  key={idx}
                                  className='flex items-center gap-2'
                                >
                                  <input
                                    type='color'
                                    value={c}
                                    onChange={(e) => {
                                      const newColors = [
                                        ...(formData.decorationOptions
                                          ?.colors || [
                                          '#ff3b3b',
                                          '#33c1ff',
                                          '#46f05a',
                                          '#ffd33b',
                                          '#ff6edb',
                                        ]),
                                      ];
                                      newColors[idx] = e.target.value;
                                      setFormData({
                                        ...formData,
                                        decorationOptions: {
                                          ...(formData.decorationOptions || {}),
                                          colors: newColors,
                                        },
                                      });
                                    }}
                                    className='h-10 w-10 border rounded'
                                  />
                                  {(
                                    formData.decorationOptions?.colors || [
                                      '#ff3b3b',
                                      '#33c1ff',
                                      '#46f05a',
                                      '#ffd33b',
                                      '#ff6edb',
                                    ]
                                  ).length > 1 && (
                                    <button
                                      type='button'
                                      onClick={() => {
                                        const newColors = (
                                          formData.decorationOptions
                                            ?.colors || [
                                            '#ff3b3b',
                                            '#33c1ff',
                                            '#46f05a',
                                            '#ffd33b',
                                            '#ff6edb',
                                          ]
                                        ).filter(
                                          (_: string, i: number) => i !== idx
                                        );
                                        setFormData({
                                          ...formData,
                                          decorationOptions: {
                                            ...(formData.decorationOptions ||
                                              {}),
                                            colors: newColors,
                                          },
                                        });
                                      }}
                                      className='text-xs px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200'
                                    >
                                      ✕
                                    </button>
                                  )}
                                </div>
                              ))}
                              <button
                                type='button'
                                onClick={() => {
                                  const existing = formData.decorationOptions
                                    ?.colors || [
                                    '#ff3b3b',
                                    '#33c1ff',
                                    '#46f05a',
                                    '#ffd33b',
                                    '#ff6edb',
                                  ];
                                  if (existing.length >= 8) return;
                                  const defaults = [
                                    '#ff3b3b',
                                    '#33c1ff',
                                    '#46f05a',
                                    '#ffd33b',
                                    '#ff6edb',
                                    '#9b59ff',
                                    '#ffffff',
                                    '#ffa640',
                                  ];
                                  const next =
                                    defaults[existing.length] || '#ffffff';
                                  setFormData({
                                    ...formData,
                                    decorationOptions: {
                                      ...(formData.decorationOptions || {}),
                                      colors: [...existing, next],
                                    },
                                  });
                                }}
                                className='text-xs px-3 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200'
                              >
                                + Add Color
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                    {formData.decorationEnabled &&
                      formData.decorationType === 'STARS' && (
                        <div className='grid grid-cols-2 gap-3 mt-3'>
                          <div>
                            <label className='block text-xs font-medium text-gray-600 mb-1'>
                              Star Color
                            </label>
                            <input
                              type='color'
                              value={
                                formData.decorationOptions?.color ?? '#ffd33b'
                              }
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  decorationOptions: {
                                    ...(formData.decorationOptions || {}),
                                    color: e.target.value,
                                  },
                                })
                              }
                              className='w-20 h-10 p-1 border rounded'
                            />
                          </div>
                          <div>
                            <label className='block text-xs font-medium text-gray-600 mb-1'>
                              Star Size
                            </label>
                            <input
                              type='range'
                              min={0.5}
                              max={2.0}
                              step={0.1}
                              value={formData.decorationOptions?.size ?? 1}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  decorationOptions: {
                                    ...(formData.decorationOptions || {}),
                                    size: parseFloat(e.target.value),
                                  },
                                })
                              }
                              className='w-full accent-green-500'
                            />
                            <div className='text-xs text-gray-600 mt-1'>
                              {String(formData.decorationOptions?.size ?? 1)}
                            </div>
                          </div>
                          <div>
                            <label className='block text-xs font-medium text-gray-600 mb-1'>
                              Density
                            </label>
                            <input
                              type='range'
                              min={0.2}
                              max={1.5}
                              step={0.1}
                              value={formData.decorationOptions?.density ?? 0.5}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  decorationOptions: {
                                    ...(formData.decorationOptions || {}),
                                    density: parseFloat(e.target.value),
                                  },
                                })
                              }
                              className='w-full accent-green-500'
                            />
                            <div className='text-xs text-gray-600 mt-1'>
                              {String(
                                formData.decorationOptions?.density ?? 0.5
                              )}
                            </div>
                          </div>
                          <div>
                            <label className='block text-xs font-medium text-gray-600 mb-1'>
                              Twinkle Speed
                            </label>
                            <input
                              type='range'
                              min={0.5}
                              max={2.0}
                              step={0.1}
                              value={
                                formData.decorationOptions?.twinkleSpeed ?? 1
                              }
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  decorationOptions: {
                                    ...(formData.decorationOptions || {}),
                                    twinkleSpeed: parseFloat(e.target.value),
                                  },
                                })
                              }
                              className='w-full accent-green-500'
                            />
                            <div className='text-xs text-gray-600 mt-1'>
                              {String(
                                formData.decorationOptions?.twinkleSpeed ?? 1
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                    {formData.decorationEnabled &&
                      formData.decorationType === 'CANDLE' && (
                        <div className='grid grid-cols-2 gap-3 mt-3'>
                          <div>
                            <label className='block text-xs font-medium text-gray-600 mb-1'>
                              Number of Candles
                            </label>
                            <input
                              type='range'
                              min={2}
                              max={8}
                              step={1}
                              value={formData.decorationOptions?.count ?? 4}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  decorationOptions: {
                                    ...(formData.decorationOptions || {}),
                                    count: parseInt(e.target.value),
                                  },
                                })
                              }
                              className='w-full accent-green-500'
                            />
                            <div className='text-xs text-gray-600 mt-1'>
                              {String(formData.decorationOptions?.count ?? 4)}
                            </div>
                          </div>
                          <div>
                            <label className='block text-xs font-medium text-gray-600 mb-1'>
                              Flame Color
                            </label>
                            <input
                              type='color'
                              value={
                                formData.decorationOptions?.flameColor ??
                                '#ff6600'
                              }
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  decorationOptions: {
                                    ...(formData.decorationOptions || {}),
                                    flameColor: e.target.value,
                                  },
                                })
                              }
                              className='w-20 h-10 p-1 border rounded'
                            />
                          </div>
                          <div className='col-span-2'>
                            <label className='block text-xs font-medium text-gray-600 mb-1'>
                              Flicker Intensity
                            </label>
                            <input
                              type='range'
                              min={0.5}
                              max={2.0}
                              step={0.1}
                              value={formData.decorationOptions?.intensity ?? 1}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  decorationOptions: {
                                    ...(formData.decorationOptions || {}),
                                    intensity: parseFloat(e.target.value),
                                  },
                                })
                              }
                              className='w-full accent-green-500'
                            />
                            <div className='text-xs text-gray-600 mt-1'>
                              {String(
                                formData.decorationOptions?.intensity ?? 1
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                    {formData.decorationEnabled &&
                      formData.decorationType === 'AURORA' && (
                        <div className='space-y-3 mt-3'>
                          <div className='grid grid-cols-2 gap-3'>
                            <div>
                              <label className='block text-xs font-medium text-gray-600 mb-1'>
                                Flow Speed
                              </label>
                              <input
                                type='range'
                                min={0.2}
                                max={2.0}
                                step={0.1}
                                value={formData.decorationOptions?.speed ?? 1}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    decorationOptions: {
                                      ...(formData.decorationOptions || {}),
                                      speed: parseFloat(e.target.value),
                                    },
                                  })
                                }
                                className='w-full accent-green-500'
                              />
                              <div className='text-xs text-gray-600 mt-1'>
                                {String(formData.decorationOptions?.speed ?? 1)}
                              </div>
                            </div>
                            <div>
                              <label className='block text-xs font-medium text-gray-600 mb-1'>
                                Intensity
                              </label>
                              <input
                                type='range'
                                min={0.3}
                                max={1.5}
                                step={0.1}
                                value={
                                  formData.decorationOptions?.intensity ?? 0.7
                                }
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    decorationOptions: {
                                      ...(formData.decorationOptions || {}),
                                      intensity: parseFloat(e.target.value),
                                    },
                                  })
                                }
                                className='w-full accent-green-500'
                              />
                              <div className='text-xs text-gray-600 mt-1'>
                                {String(
                                  formData.decorationOptions?.intensity ?? 0.7
                                )}
                              </div>
                            </div>
                          </div>
                          <div>
                            <label className='block text-xs font-medium text-gray-600 mb-2'>
                              Aurora Colors
                            </label>
                            <div className='flex flex-wrap gap-3'>
                              {(
                                formData.decorationOptions?.colors || [
                                  '#00ff87',
                                  '#60efff',
                                  '#b967ff',
                                ]
                              ).map((c: string, idx: number) => (
                                <div
                                  key={idx}
                                  className='flex items-center gap-2'
                                >
                                  <input
                                    type='color'
                                    value={c}
                                    onChange={(e) => {
                                      const newColors = [
                                        ...(formData.decorationOptions
                                          ?.colors || [
                                          '#00ff87',
                                          '#60efff',
                                          '#b967ff',
                                        ]),
                                      ];
                                      newColors[idx] = e.target.value;
                                      setFormData({
                                        ...formData,
                                        decorationOptions: {
                                          ...(formData.decorationOptions || {}),
                                          colors: newColors,
                                        },
                                      });
                                    }}
                                    className='h-10 w-10 border rounded'
                                  />
                                  {(
                                    formData.decorationOptions?.colors || [
                                      '#00ff87',
                                      '#60efff',
                                      '#b967ff',
                                    ]
                                  ).length > 2 && (
                                    <button
                                      type='button'
                                      onClick={() => {
                                        const newColors = (
                                          formData.decorationOptions
                                            ?.colors || [
                                            '#00ff87',
                                            '#60efff',
                                            '#b967ff',
                                          ]
                                        ).filter(
                                          (_: string, i: number) => i !== idx
                                        );
                                        setFormData({
                                          ...formData,
                                          decorationOptions: {
                                            ...(formData.decorationOptions ||
                                              {}),
                                            colors: newColors,
                                          },
                                        });
                                      }}
                                      className='text-xs px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200'
                                    >
                                      ✕
                                    </button>
                                  )}
                                </div>
                              ))}
                              <button
                                type='button'
                                onClick={() => {
                                  const existing = formData.decorationOptions
                                    ?.colors || [
                                    '#00ff87',
                                    '#60efff',
                                    '#b967ff',
                                  ];
                                  if (existing.length >= 5) return;
                                  const defaults = [
                                    '#00ff87',
                                    '#60efff',
                                    '#b967ff',
                                    '#ff3b8e',
                                    '#ffaa00',
                                  ];
                                  const next =
                                    defaults[existing.length] || '#00ff87';
                                  setFormData({
                                    ...formData,
                                    decorationOptions: {
                                      ...(formData.decorationOptions || {}),
                                      colors: [...existing, next],
                                    },
                                  });
                                }}
                                className='text-xs px-3 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200'
                              >
                                + Add Color
                              </button>
                            </div>
                            <div className='mt-2 text-[11px] text-gray-500'>
                              2-5 colors for wave layers
                            </div>
                          </div>
                        </div>
                      )}

                    {formData.decorationEnabled &&
                      formData.decorationType === 'RIBBONS' && (
                        <div className='space-y-3 mt-3'>
                          <div className='grid grid-cols-2 gap-3'>
                            <div>
                              <label className='block text-xs font-medium text-gray-600 mb-1'>
                                Number of Ribbons
                              </label>
                              <input
                                type='range'
                                min={2}
                                max={6}
                                step={1}
                                value={formData.decorationOptions?.count ?? 4}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    decorationOptions: {
                                      ...(formData.decorationOptions || {}),
                                      count: parseInt(e.target.value),
                                    },
                                  })
                                }
                                className='w-full accent-green-500'
                              />
                              <div className='text-xs text-gray-600 mt-1'>
                                {String(formData.decorationOptions?.count ?? 4)}
                              </div>
                            </div>
                            <div>
                              <label className='block text-xs font-medium text-gray-600 mb-1'>
                                Flow Speed
                              </label>
                              <input
                                type='range'
                                min={0.3}
                                max={2.0}
                                step={0.1}
                                value={formData.decorationOptions?.speed ?? 1}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    decorationOptions: {
                                      ...(formData.decorationOptions || {}),
                                      speed: parseFloat(e.target.value),
                                    },
                                  })
                                }
                                className='w-full accent-green-500'
                              />
                              <div className='text-xs text-gray-600 mt-1'>
                                {String(formData.decorationOptions?.speed ?? 1)}
                              </div>
                            </div>
                          </div>
                          <div>
                            <label className='block text-xs font-medium text-gray-600 mb-2'>
                              Ribbon Colors
                            </label>
                            <div className='flex flex-wrap gap-3'>
                              {(
                                formData.decorationOptions?.colors || [
                                  '#ff3b3b',
                                  '#33c1ff',
                                  '#46f05a',
                                ]
                              ).map((c: string, idx: number) => (
                                <div
                                  key={idx}
                                  className='flex items-center gap-2'
                                >
                                  <input
                                    type='color'
                                    value={c}
                                    onChange={(e) => {
                                      const newColors = [
                                        ...(formData.decorationOptions
                                          ?.colors || [
                                          '#ff3b3b',
                                          '#33c1ff',
                                          '#46f05a',
                                        ]),
                                      ];
                                      newColors[idx] = e.target.value;
                                      setFormData({
                                        ...formData,
                                        decorationOptions: {
                                          ...(formData.decorationOptions || {}),
                                          colors: newColors,
                                        },
                                      });
                                    }}
                                    className='h-10 w-10 border rounded'
                                  />
                                  {(
                                    formData.decorationOptions?.colors || [
                                      '#ff3b3b',
                                      '#33c1ff',
                                      '#46f05a',
                                    ]
                                  ).length > 1 && (
                                    <button
                                      type='button'
                                      onClick={() => {
                                        const newColors = (
                                          formData.decorationOptions
                                            ?.colors || [
                                            '#ff3b3b',
                                            '#33c1ff',
                                            '#46f05a',
                                          ]
                                        ).filter(
                                          (_: string, i: number) => i !== idx
                                        );
                                        setFormData({
                                          ...formData,
                                          decorationOptions: {
                                            ...(formData.decorationOptions ||
                                              {}),
                                            colors: newColors,
                                          },
                                        });
                                      }}
                                      className='text-xs px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200'
                                    >
                                      ✕
                                    </button>
                                  )}
                                </div>
                              ))}
                              <button
                                type='button'
                                onClick={() => {
                                  const existing = formData.decorationOptions
                                    ?.colors || [
                                    '#ff3b3b',
                                    '#33c1ff',
                                    '#46f05a',
                                  ];
                                  if (existing.length >= 6) return;
                                  const defaults = [
                                    '#ff3b3b',
                                    '#33c1ff',
                                    '#46f05a',
                                    '#ffd33b',
                                    '#ff6edb',
                                    '#9b59ff',
                                  ];
                                  const next =
                                    defaults[existing.length] || '#ff3b3b';
                                  setFormData({
                                    ...formData,
                                    decorationOptions: {
                                      ...(formData.decorationOptions || {}),
                                      colors: [...existing, next],
                                    },
                                  });
                                }}
                                className='text-xs px-3 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200'
                              >
                                + Add Color
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                  </div>

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
                        <option value='0px'>None</option>
                        <option value='1px'>Thin</option>
                        <option value='2px'>Medium</option>
                        <option value='3px'>Thick</option>
                        <option value='4px'>Extra Thick</option>
                        <option value='6px'>Very Thick</option>
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
                      <label className='flex items-center gap-2 mt-2 cursor-pointer'>
                        <input
                          type='checkbox'
                          checked={formData.borderGradientEnabled}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              borderGradientEnabled: e.target.checked,
                            })
                          }
                          className='w-4 h-4 rounded'
                        />
                        <span className='text-xs text-gray-600'>
                          Enable Gradient
                        </span>
                      </label>
                      {formData.borderGradientEnabled && (
                        <input
                          type='color'
                          value={formData.borderGradientColor2 || '#000000'}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              borderGradientColor2: e.target.value,
                            })
                          }
                          className='h-12 w-full border border-gray-300 rounded cursor-pointer mt-2'
                          title='Second gradient color'
                        />
                      )}
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
                        <option value='0px'>Sharp</option>
                        <option value='4px'>Slightly Rounded</option>
                        <option value='8px'>Rounded</option>
                        <option value='12px'>Very Rounded</option>
                        <option value='16px'>Extra Rounded</option>
                        <option value='24px'>Pill-Shaped</option>
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
                        <option value='0px'>None</option>
                        <option value='8px'>Compact</option>
                        <option value='12px'>Cozy</option>
                        <option value='16px'>Normal</option>
                        <option value='20px'>Comfortable</option>
                        <option value='24px'>Spacious</option>
                        <option value='32px'>Extra Spacious</option>
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
                            Right-click the uploaded image → &ldquo;Copy image
                            address&rdquo;
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
                      className='w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-400 focus:outline-none text-gray-900'
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
                      className='w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-400 focus:outline-none text-gray-900'
                    />
                    <p className='text-xs text-gray-500 mt-1'>
                      💡 Paste a YouTube or Vimeo link - we&apos;ll convert it
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
                      className='w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-400 focus:outline-none text-gray-900'
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
                      className='w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-400 focus:outline-none text-gray-900'
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
                    disabled={isSavingEntry}
                    className='flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
                  >
                    {isSavingEntry ? (
                      <>
                        <svg
                          className='animate-spin h-5 w-5'
                          viewBox='0 0 24 24'
                        >
                          <circle
                            className='opacity-25'
                            cx='12'
                            cy='12'
                            r='10'
                            stroke='currentColor'
                            strokeWidth='4'
                            fill='none'
                          />
                          <path
                            className='opacity-75'
                            fill='currentColor'
                            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                          />
                        </svg>
                        Saving...
                      </>
                    ) : (
                      'Save Entry'
                    )}
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

      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transition-all duration-300 animate-slide-in ${
            toast.type === 'success'
              ? 'bg-green-500 text-white'
              : 'bg-red-500 text-white'
          }`}
        >
          <div className='flex items-center gap-2'>
            {toast.type === 'success' ? (
              <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                  clipRule='evenodd'
                />
              </svg>
            ) : (
              <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                  clipRule='evenodd'
                />
              </svg>
            )}
            <span className='font-medium'>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className='bg-white border-t border-gray-200 mt-16'>
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
