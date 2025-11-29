'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { themePresets } from '@/lib/themes';

export default function CreateCalendar() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('classic');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const theme = themePresets.find(t => t.id === selectedTheme);
      
      const response = await fetch('/api/calendars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title, 
          description,
          theme: theme?.id,
          backgroundColor: theme?.backgroundColor,
          backgroundPattern: theme?.backgroundPattern,
          primaryColor: theme?.primaryColor,
          secondaryColor: theme?.secondaryColor,
          textColor: theme?.textColor,
          snowflakesEnabled: theme?.snowflakesEnabled,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Something went wrong');
        setLoading(false);
        return;
      }

      router.push(`/calendar/${data.id}/edit`);
    } catch {
      setError('Something went wrong');
      setLoading(false);
    }
  };

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

      <main className='max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='bg-white rounded-2xl shadow-2xl p-8 border-2 border-red-200'>
          <h1 className='text-3xl font-bold text-gray-800 mb-2'>
            Create New Calendar
          </h1>
          <p className='text-gray-600 mb-8'>
            Start by giving your advent calendar a name and description
          </p>

          <form onSubmit={handleSubmit} className='space-y-6'>
            {error && (
              <div className='bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg'>
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor='title'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                Calendar Title *
              </label>
              <input
                id='title'
                type='text'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder='e.g., Christmas 2025 for Sarah'
                className='w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-400 focus:outline-none transition'
              />
            </div>

            <div>
              <label
                htmlFor='description'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                Description (optional)
              </label>
              <textarea
                id='description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder='Add a special message or description'
                className='w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-400 focus:outline-none transition resize-none'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-3'>
                Choose a Theme
              </label>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {themePresets.map((theme) => (
                  <button
                    key={theme.id}
                    type='button'
                    onClick={() => setSelectedTheme(theme.id)}
                    className={`p-4 rounded-lg border-2 text-left transition ${
                      selectedTheme === theme.id
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className='flex items-start justify-between'>
                      <div>
                        <h3 className='font-semibold text-gray-800 mb-1'>
                          {theme.name}
                        </h3>
                        <p className='text-sm text-gray-600'>
                          {theme.description}
                        </p>
                      </div>
                      {selectedTheme === theme.id && (
                        <span className='text-red-500 text-xl'>✓</span>
                      )}
                    </div>
                    <div className='flex gap-2 mt-3'>
                      <div
                        className='w-8 h-8 rounded border'
                        style={{ backgroundColor: theme.primaryColor }}
                        title='Primary Color'
                      />
                      <div
                        className='w-8 h-8 rounded border'
                        style={{ backgroundColor: theme.secondaryColor }}
                        title='Secondary Color'
                      />
                      <div
                        className='w-8 h-8 rounded border'
                        style={{ backgroundColor: theme.backgroundColor }}
                        title='Background'
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className='flex space-x-4'>
              <Link
                href='/dashboard'
                className='flex-1 text-center bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition font-semibold'
              >
                Cancel
              </Link>
              <button
                type='submit'
                disabled={loading}
                className='flex-1 bg-gradient-to-r from-red-500 to-green-500 text-white py-3 rounded-lg font-semibold hover:from-red-600 hover:to-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {loading ? 'Creating...' : 'Create Calendar'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
