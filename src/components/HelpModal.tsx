'use client';

import { useState } from 'react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HelpModal({ isOpen, onClose }: HelpModalProps) {
  const [activeTab, setActiveTab] = useState('getting-started');

  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 bg-black/50 grid place-items-center z-50 p-4 min-h-[100svh]'
      onClick={onClose}
    >
      <div
        className='bg-white rounded-3xl shadow-2xl w-full max-w-[calc(100vw-2rem)] sm:max-w-3xl lg:max-w-4xl max-h-[85svh] overflow-hidden mx-auto translate-x-[-2vw] translate-y-[-2vh] sm:translate-x-0 sm:translate-y-0'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className='bg-gradient-to-r from-red-500 to-green-500 text-white p-4 sm:p-6 flex justify-between items-center'>
          <h2 className='text-2xl sm:text-3xl font-bold'>📚 Help & Guide</h2>
          <button
            onClick={onClose}
            className='text-white hover:text-gray-200 text-3xl'
          >
            ×
          </button>
        </div>

        {/* Tab Navigation */}
        <div className='flex border-b border-gray-200'>
          {[
            { id: 'getting-started', label: 'Getting Started', icon: '🚀' },
            { id: 'images', label: 'Adding Images', icon: '🖼️' },
            { id: 'videos', label: 'Adding Videos', icon: '🎥' },
            { id: 'links', label: 'Adding Links', icon: '🔗' },
            { id: 'formatting', label: 'Formatting', icon: '🎨' },
            { id: 'sharing', label: 'Sharing', icon: '📤' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-2 sm:px-4 md:px-6 py-3 sm:py-4 font-medium transition ${
                activeTab === tab.id
                  ? 'border-b-2 border-red-500 text-red-600 bg-red-50'
                  : 'text-gray-600 hover:text-red-500 hover:bg-gray-50'
              }`}
              title={tab.label}
            >
              <span className='text-2xl sm:text-3xl'>{tab.icon}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className='p-4 sm:p-6 md:p-8 overflow-y-auto max-h-[60vh]'>
          {activeTab === 'getting-started' && (
            <div className='space-y-6'>
              <h3 className='text-2xl font-bold text-gray-800'>
                🚀 Getting Started
              </h3>
              <div className='space-y-4'>
                <div className='bg-red-50 border-l-4 border-red-500 p-4 rounded'>
                  <h4 className='font-semibold text-lg mb-2'>
                    Step 1: Create a Calendar
                  </h4>
                  <p className='text-gray-700'>
                    Click &ldquo;Create New Calendar&rdquo; and give it a meaningful title
                    like &ldquo;Christmas 2024 for Sarah&rdquo;.
                  </p>
                </div>
                <div className='bg-green-50 border-l-4 border-green-500 p-4 rounded'>
                  <h4 className='font-semibold text-lg mb-2'>
                    Step 2: Add Content
                  </h4>
                  <p className='text-gray-700'>
                    Click any day (1-25) to add text, poems, images, or videos.
                    Each entry is revealed on its specific day in December.
                  </p>
                </div>
                <div className='bg-blue-50 border-l-4 border-blue-500 p-4 rounded'>
                  <h4 className='font-semibold text-lg mb-2'>Step 3: Share</h4>
                  <p className='text-gray-700'>
                    Copy the share link and send it to your loved ones. They can
                    open doors starting December 1st!
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'images' && (
            <div className='space-y-6'>
              <h3 className='text-2xl font-bold text-gray-800'>
                🖼️ How to Add Images
              </h3>

              <div className='bg-yellow-50 border-2 border-yellow-300 p-4 rounded-lg'>
                <p className='font-semibold text-yellow-800 mb-2'>
                  ⚠️ Important: Use Direct Image URLs
                </p>
                <p className='text-yellow-700'>
                  You need a <strong>direct link to the image file</strong>, not
                  a webpage URL. The URL should end with{' '}
                  <code className='bg-yellow-200 px-2 py-1 rounded'>.jpg</code>,{' '}
                  <code className='bg-yellow-200 px-2 py-1 rounded ml-1'>
                    .png
                  </code>
                  , or{' '}
                  <code className='bg-yellow-200 px-2 py-1 rounded ml-1'>
                    .gif
                  </code>
                </p>
              </div>

              <div className='space-y-4'>
                <div>
                  <h4 className='font-semibold text-lg mb-3 flex items-center gap-2'>
                    <span className='text-2xl'>📸</span>
                    Option 1: Upload to Imgur (Recommended)
                  </h4>
                  <ol className='list-decimal list-inside space-y-2 text-gray-700 ml-4'>
                    <li>
                      Go to{' '}
                      <a
                        href='https://imgur.com/upload'
                        target='_blank'
                        rel='noopener'
                        className='text-blue-600 hover:underline'
                      >
                        imgur.com/upload
                      </a>
                    </li>
                    <li>Upload your image (no account needed)</li>
                    <li>
                      Right-click the uploaded image and select &ldquo;Copy image
                      address&rdquo;
                    </li>
                    <li>
                      Paste the URL (should look like:{' '}
                      <code className='bg-gray-100 px-2 py-1 rounded text-sm'>
                        https://i.imgur.com/ABC123.jpg
                      </code>
                      )
                    </li>
                  </ol>
                </div>

                <div>
                  <h4 className='font-semibold text-lg mb-3 flex items-center gap-2'>
                    <span className='text-2xl'>☁️</span>
                    Option 2: Use Cloudinary
                  </h4>
                  <ol className='list-decimal list-inside space-y-2 text-gray-700 ml-4'>
                    <li>
                      Sign up free at{' '}
                      <a
                        href='https://cloudinary.com'
                        target='_blank'
                        rel='noopener'
                        className='text-blue-600 hover:underline'
                      >
                        cloudinary.com
                      </a>
                    </li>
                    <li>Upload your image to Media Library</li>
                    <li>Click the image and copy the &ldquo;Secure URL&rdquo;</li>
                    <li>Paste the URL into the Image URL field</li>
                  </ol>
                </div>

                <div>
                  <h4 className='font-semibold text-lg mb-3 flex items-center gap-2'>
                    <span className='text-2xl'>🌐</span>
                    Option 3: Use Any Public Image
                  </h4>
                  <ol className='list-decimal list-inside space-y-2 text-gray-700 ml-4'>
                    <li>Find an image online</li>
                    <li>
                      Right-click and select &ldquo;Copy image address&rdquo; or &ldquo;Copy image
                      URL&rdquo;
                    </li>
                    <li>Make sure the URL ends with .jpg, .png, or .gif</li>
                    <li>Paste into the Image URL field</li>
                  </ol>
                </div>
              </div>

              <div className='bg-gray-100 p-4 rounded-lg'>
                <p className='font-semibold mb-2'>✅ Good Example:</p>
                <code className='block bg-white p-2 rounded text-sm text-green-600'>
                  https://i.imgur.com/AbC123XyZ.jpg
                </code>
                <p className='font-semibold mt-4 mb-2'>
                  ❌ Bad Example (webpage, not direct image):
                </p>
                <code className='block bg-white p-2 rounded text-sm text-red-600'>
                  https://imgur.com/gallery/AbC123
                </code>
              </div>
            </div>
          )}

          {activeTab === 'videos' && (
            <div className='space-y-6'>
              <h3 className='text-2xl font-bold text-gray-800'>
                🎥 How to Add Videos
              </h3>

              <div className='bg-blue-50 border-2 border-blue-300 p-4 rounded-lg'>
                <p className='font-semibold text-blue-800 mb-2'>
                  ✨ Automatic Conversion
                </p>
                <p className='text-blue-700'>
                  Just paste a regular YouTube or Vimeo URL - we&apos;ll
                  automatically convert it to the embed format!
                </p>
              </div>

              <div className='space-y-4'>
                <div>
                  <h4 className='font-semibold text-lg mb-3 flex items-center gap-2'>
                    <span className='text-2xl'>📺</span>
                    YouTube Videos
                  </h4>
                  <ol className='list-decimal list-inside space-y-2 text-gray-700 ml-4'>
                    <li>Go to YouTube and find your video</li>
                    <li>Click the &ldquo;Share&rdquo; button below the video</li>
                    <li>Copy the URL (or just copy from the address bar)</li>
                    <li>Paste into the Video URL field</li>
                  </ol>
                  <div className='mt-3 bg-gray-100 p-3 rounded'>
                    <p className='font-semibold text-sm mb-2'>
                      Accepted formats:
                    </p>
                    <code className='block text-xs bg-white p-2 rounded mb-1'>
                      https://www.youtube.com/watch?v=dQw4w9WgXcQ
                    </code>
                    <code className='block text-xs bg-white p-2 rounded mb-1'>
                      https://youtu.be/dQw4w9WgXcQ
                    </code>
                    <code className='block text-xs bg-white p-2 rounded'>
                      https://www.youtube.com/embed/dQw4w9WgXcQ
                    </code>
                  </div>
                </div>

                <div>
                  <h4 className='font-semibold text-lg mb-3 flex items-center gap-2'>
                    <span className='text-2xl'>🎬</span>
                    Vimeo Videos
                  </h4>
                  <ol className='list-decimal list-inside space-y-2 text-gray-700 ml-4'>
                    <li>Go to Vimeo and find your video</li>
                    <li>Copy the URL from the address bar</li>
                    <li>Paste into the Video URL field</li>
                  </ol>
                  <div className='mt-3 bg-gray-100 p-3 rounded'>
                    <p className='font-semibold text-sm mb-2'>
                      Accepted formats:
                    </p>
                    <code className='block text-xs bg-white p-2 rounded mb-1'>
                      https://vimeo.com/123456789
                    </code>
                    <code className='block text-xs bg-white p-2 rounded'>
                      https://player.vimeo.com/video/123456789
                    </code>
                  </div>
                </div>
              </div>

              <div className='bg-green-50 border-l-4 border-green-500 p-4 rounded'>
                <p className='font-semibold text-green-800 mb-2'>💡 Pro Tip</p>
                <p className='text-green-700'>
                  For best results, make sure your video is set to &ldquo;Public&rdquo; or
                  &ldquo;Unlisted&rdquo; on YouTube/Vimeo so anyone with the calendar link
                  can watch it.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'links' && (
            <div className='space-y-6'>
              <h3 className='text-2xl font-bold text-gray-800'>
                🔗 Adding External Links
              </h3>

              <div className='bg-purple-50 border-2 border-purple-300 p-4 rounded-lg'>
                <p className='font-semibold text-purple-800 mb-2'>
                  ✨ Link to Anything
                </p>
                <p className='text-purple-700'>
                  Add links to external websites, recipes, playlists, gift
                  registries, or any web page you want to share!
                </p>
              </div>

              <div className='space-y-4'>
                <div>
                  <h4 className='font-semibold text-lg mb-3 flex items-center gap-2'>
                    <span className='text-2xl'>🌐</span>
                    How to Add a Link
                  </h4>
                  <ol className='list-decimal list-inside space-y-2 text-gray-700 ml-4'>
                    <li>Click &ldquo;Add Link&rdquo; button when editing an entry</li>
                    <li>Paste the full URL (starting with https://)</li>
                    <li>Optionally customize the button text</li>
                    <li>Save your entry</li>
                  </ol>
                </div>

                <div className='bg-gray-100 p-4 rounded-lg'>
                  <p className='font-semibold mb-2'>💡 Use Cases:</p>
                  <ul className='list-disc list-inside space-y-1 text-gray-700 ml-2'>
                    <li>
                      <strong>Recipe:</strong> Link to your favorite holiday
                      recipe
                    </li>
                    <li>
                      <strong>Playlist:</strong> Share a Spotify or YouTube
                      playlist
                    </li>
                    <li>
                      <strong>Store:</strong> Link to an online gift wish list
                    </li>
                    <li>
                      <strong>Article:</strong> Share an interesting story or
                      blog post
                    </li>
                    <li>
                      <strong>Event:</strong> Link to a calendar invite or
                      tickets
                    </li>
                    <li>
                      <strong>Game:</strong> Share an online game or activity
                    </li>
                  </ul>
                </div>

                <div className='bg-blue-50 border-l-4 border-blue-500 p-4 rounded'>
                  <p className='font-semibold text-blue-800 mb-2'>
                    🔒 Security Note
                  </p>
                  <p className='text-blue-700'>
                    Links open in a new tab for safety. Make sure you trust the
                    websites you&apos;re linking to!
                  </p>
                </div>

                <div className='bg-green-50 border-l-4 border-green-500 p-4 rounded'>
                  <p className='font-semibold text-green-800 mb-2'>
                    ✏️ Customize Button Text
                  </p>
                  <p className='text-green-700 mb-2'>
                    Make your link clear with custom text:
                  </p>
                  <ul className='list-disc list-inside space-y-1 text-green-700 ml-2'>
                    <li>&ldquo;View Recipe&rdquo; for cooking links</li>
                    <li>&ldquo;Listen Now&rdquo; for music playlists</li>
                    <li>&ldquo;Shop This Gift&rdquo; for product pages</li>
                    <li>&ldquo;Read Story&rdquo; for articles</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'formatting' && (
            <div className='space-y-6'>
              <h3 className='text-2xl font-bold text-gray-800'>
                🎨 Formatting Options
              </h3>

              <div className='space-y-4'>
                <div className='bg-purple-50 border-l-4 border-purple-500 p-4 rounded'>
                  <h4 className='font-semibold text-lg mb-2'>
                    Entry-Level Formatting
                  </h4>
                  <p className='text-gray-700 mb-2'>
                    Customize individual door entries with:
                  </p>
                  <ul className='list-disc list-inside space-y-1 text-gray-700 ml-4'>
                    <li>
                      <strong>Fonts:</strong> Choose from 8 different font
                      families
                    </li>
                    <li>
                      <strong>Font Size:</strong> From small (12px) to extra
                      large (32px)
                    </li>
                    <li>
                      <strong>Colors:</strong> Text color and background color
                    </li>
                    <li>
                      <strong>Alignment:</strong> Left, center, right, or
                      justified
                    </li>
                    <li>
                      <strong>Borders:</strong> Style, width, color, and radius
                    </li>
                    <li>
                      <strong>Effects:</strong> Shadows and padding
                    </li>
                  </ul>
                </div>

                <div className='bg-pink-50 border-l-4 border-pink-500 p-4 rounded'>
                  <h4 className='font-semibold text-lg mb-2'>
                    Calendar-Level Themes
                  </h4>
                  <p className='text-gray-700 mb-2'>
                    Set the overall look for your entire calendar:
                  </p>
                  <ul className='list-disc list-inside space-y-1 text-gray-700 ml-4'>
                    <li>
                      <strong>6 Pre-built Themes:</strong> Classic, Winter
                      Wonderland, Festive Gold, etc.
                    </li>
                    <li>
                      <strong>Background Patterns:</strong> Snowflakes, stars,
                      stripes, and more
                    </li>
                    <li>
                      <strong>Color Scheme:</strong> Primary, secondary, text,
                      and background colors
                    </li>
                    <li>
                      <strong>Animations:</strong> Toggle falling snowflakes
                      on/off
                    </li>
                  </ul>
                </div>

                <div className='bg-gray-100 p-4 rounded-lg'>
                  <p className='font-semibold mb-2'>💡 Best Practice:</p>
                  <p className='text-gray-700'>
                    1. Choose a calendar theme first
                    <br />
                    2. Then customize individual entries as needed
                    <br />
                    3. Use &ldquo;Owner Preview&rdquo; to test how everything looks together
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sharing' && (
            <div className='space-y-6'>
              <h3 className='text-2xl font-bold text-gray-800'>
                🔗 Sharing Your Calendar
              </h3>

              <div className='space-y-4'>
                <div className='bg-blue-50 border-l-4 border-blue-500 p-4 rounded'>
                  <h4 className='font-semibold text-lg mb-2'>How to Share</h4>
                  <ol className='list-decimal list-inside space-y-2 text-gray-700 ml-4'>
                    <li>Complete your calendar with all 25 entries</li>
                    <li>
                      Copy the share link from your dashboard or edit page
                    </li>
                    <li>Send it via email, text, or social media</li>
                    <li>Recipients can open doors starting December 1st</li>
                  </ol>
                </div>

                <div className='bg-green-50 border-l-4 border-green-500 p-4 rounded'>
                  <h4 className='font-semibold text-lg mb-2'>
                    Date Restrictions
                  </h4>
                  <p className='text-gray-700'>
                    Doors can only be opened on their corresponding date in
                    December:
                  </p>
                  <ul className='list-disc list-inside space-y-1 text-gray-700 ml-4 mt-2'>
                    <li>Door 1 opens December 1st</li>
                    <li>Door 2 opens December 2nd</li>
                    <li>And so on through December 25th</li>
                  </ul>
                </div>

                <div className='bg-purple-50 border-l-4 border-purple-500 p-4 rounded'>
                  <h4 className='font-semibold text-lg mb-2'>Preview Modes</h4>
                  <ul className='list-disc list-inside space-y-1 text-gray-700 ml-4'>
                    <li>
                      <strong>Preview as Viewer:</strong> See exactly what
                      recipients see
                    </li>
                    <li>
                      <strong>Owner Preview:</strong> Bypass date restrictions
                      to test all doors
                    </li>
                  </ul>
                </div>

                <div className='bg-yellow-50 border-2 border-yellow-300 p-4 rounded-lg'>
                  <p className='font-semibold text-yellow-800 mb-2'>
                    🔒 Privacy
                  </p>
                  <p className='text-yellow-700'>
                    Your calendars are only accessible via the unique share
                    link. They won&apos;t appear in search engines or public
                    listings.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className='bg-gray-50 p-4 border-t flex justify-between items-center'>
          <button
            onClick={() => setActiveTab('getting-started')}
            className='text-sm text-gray-600 hover:text-red-600 transition'
          >
            ← Back to Start
          </button>
          <button
            onClick={onClose}
            className='bg-gradient-to-r from-red-500 to-green-500 text-white px-6 py-2 rounded-lg hover:from-red-600 hover:to-green-600 transition font-semibold'
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}
