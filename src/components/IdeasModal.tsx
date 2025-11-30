'use client';

import { useState } from 'react';

interface IdeasModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function IdeasModal({ isOpen, onClose }: IdeasModalProps) {
  const [activeTab, setActiveTab] = useState('personal');

  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50'
      onClick={onClose}
    >
      <div
        className='bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className='bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white p-6 flex justify-between items-center'>
          <h2 className='text-3xl font-bold'>💡 Ideas & Inspiration</h2>
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
            { id: 'personal', label: 'Personal Use', icon: '❤️' },
            { id: 'family', label: 'Family & Kids', icon: '👨‍👩‍👧‍👦' },
            { id: 'teams', label: 'Teams & Work', icon: '💼' },
            { id: 'creators', label: 'Content Creators', icon: '🎬' },
            { id: 'artists', label: 'Musicians & Artists', icon: '🎸' },
            { id: 'content', label: 'Content Ideas', icon: '✨' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-2 sm:px-4 md:px-6 py-3 sm:py-4 font-medium transition ${
                activeTab === tab.id
                  ? 'border-b-2 border-purple-500 text-purple-600 bg-purple-50'
                  : 'text-gray-600 hover:text-purple-500 hover:bg-gray-50'
              }`}
              title={tab.label}
            >
              <span className='text-2xl sm:text-3xl'>{tab.icon}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className='p-8 overflow-y-auto max-h-[60vh]'>
          {activeTab === 'personal' && (
            <div className='space-y-6'>
              <h3 className='text-2xl font-bold text-gray-800'>
                ❤️ Personal Use Ideas
              </h3>

              <div className='space-y-4'>
                <div className='bg-pink-50 border-l-4 border-pink-500 p-4 rounded'>
                  <h4 className='font-semibold text-lg mb-2 flex items-center gap-2'>
                    💑 For Your Partner/Spouse
                  </h4>
                  <ul className='list-disc list-inside space-y-2 text-gray-700 ml-4'>
                    <li>
                      <strong>Love Notes:</strong> Daily affirmations and
                      reasons why you love them
                    </li>
                    <li>
                      <strong>Memory Lane:</strong> Photos from your favorite
                      moments together
                    </li>
                    <li>
                      <strong>Date Ideas:</strong> Plan 25 dates for the coming
                      year
                    </li>
                    <li>
                      <strong>Love Songs:</strong> A different romantic song
                      each day
                    </li>
                    <li>
                      <strong>Countdown to Event:</strong> Build excitement for
                      a vacation or special occasion
                    </li>
                  </ul>
                </div>

                <div className='bg-purple-50 border-l-4 border-purple-500 p-4 rounded'>
                  <h4 className='font-semibold text-lg mb-2 flex items-center gap-2'>
                    🎁 Gift Reveal Calendar
                  </h4>
                  <p className='text-gray-700 mb-2'>
                    Create anticipation with daily clues leading to a big gift:
                  </p>
                  <ul className='list-disc list-inside space-y-1 text-gray-700 ml-4'>
                    <li>Days 1-20: Riddles and hints about the gift</li>
                    <li>Days 21-24: Photos showing parts of the gift</li>
                    <li>
                      Day 25: The big reveal with location or link to gift
                    </li>
                  </ul>
                </div>

                <div className='bg-blue-50 border-l-4 border-blue-500 p-4 rounded'>
                  <h4 className='font-semibold text-lg mb-2 flex items-center gap-2'>
                    🌟 Self-Care & Wellness
                  </h4>
                  <ul className='list-disc list-inside space-y-1 text-gray-700 ml-4'>
                    <li>Daily meditation or yoga videos</li>
                    <li>Inspiring quotes and affirmations</li>
                    <li>Self-care activity suggestions</li>
                    <li>Gratitude prompts</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'family' && (
            <div className='space-y-6'>
              <h3 className='text-2xl font-bold text-gray-800'>
                👨‍👩‍👧‍👦 Family & Kids Ideas
              </h3>

              <div className='space-y-4'>
                <div className='bg-green-50 border-l-4 border-green-500 p-4 rounded'>
                  <h4 className='font-semibold text-lg mb-2'>
                    👶 For Young Children
                  </h4>
                  <ul className='list-disc list-inside space-y-2 text-gray-700 ml-4'>
                    <li>
                      <strong>Story Time:</strong> A different holiday story or
                      video each day
                    </li>
                    <li>
                      <strong>Activity Calendar:</strong> Daily craft ideas,
                      coloring pages, or games
                    </li>
                    <li>
                      <strong>Character Messages:</strong> Video messages from
                      Santa or favorite characters
                    </li>
                    <li>
                      <strong>Learning Fun:</strong> Educational videos or songs
                    </li>
                    <li>
                      <strong>Kindness Challenge:</strong> Daily acts of
                      kindness to complete
                    </li>
                  </ul>
                </div>

                <div className='bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded'>
                  <h4 className='font-semibold text-lg mb-2'>
                    👵 For Grandparents & Family
                  </h4>
                  <ul className='list-disc list-inside space-y-2 text-gray-700 ml-4'>
                    <li>
                      <strong>Photo Journey:</strong> Family photos through the
                      years
                    </li>
                    <li>
                      <strong>Grandkid Updates:</strong> Photos and videos of
                      grandchildren
                    </li>
                    <li>
                      <strong>Recipe Exchange:</strong> Share favorite family
                      recipes with photos
                    </li>
                    <li>
                      <strong>Memory Sharing:</strong> Stories and photos from
                      family history
                    </li>
                    <li>
                      <strong>Video Messages:</strong> Recorded messages from
                      all family members
                    </li>
                  </ul>
                </div>

                <div className='bg-orange-50 border-l-4 border-orange-500 p-4 rounded'>
                  <h4 className='font-semibold text-lg mb-2'>
                    🎄 Family Tradition Builder
                  </h4>
                  <p className='text-gray-700 mb-2'>
                    Create new traditions or celebrate existing ones:
                  </p>
                  <ul className='list-disc list-inside space-y-1 text-gray-700 ml-4'>
                    <li>Daily holiday movies to watch together</li>
                    <li>Family game night suggestions</li>
                    <li>Baking or cooking activities</li>
                    <li>Local events and light displays to visit</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'teams' && (
            <div className='space-y-6'>
              <h3 className='text-2xl font-bold text-gray-800'>
                💼 Teams & Workplace Ideas
              </h3>

              <div className='space-y-4'>
                <div className='bg-blue-50 border-l-4 border-blue-500 p-4 rounded'>
                  <h4 className='font-semibold text-lg mb-2'>
                    🎉 Team Morale Booster
                  </h4>
                  <ul className='list-disc list-inside space-y-2 text-gray-700 ml-4'>
                    <li>
                      <strong>Employee Spotlights:</strong> Celebrate different
                      team members daily
                    </li>
                    <li>
                      <strong>Success Stories:</strong> Share team wins and
                      achievements
                    </li>
                    <li>
                      <strong>Fun Facts:</strong> Learn interesting things about
                      colleagues
                    </li>
                    <li>
                      <strong>Motivational Content:</strong> Inspiring quotes
                      and videos
                    </li>
                    <li>
                      <strong>Wellness Tips:</strong> Daily health and
                      productivity tips
                    </li>
                  </ul>
                </div>

                <div className='bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded'>
                  <h4 className='font-semibold text-lg mb-2'>
                    🎓 Training & Onboarding
                  </h4>
                  <ul className='list-disc list-inside space-y-2 text-gray-700 ml-4'>
                    <li>
                      <strong>New Hire Welcome:</strong> Company culture and
                      team introductions
                    </li>
                    <li>
                      <strong>Skill Building:</strong> Daily training videos or
                      tutorials
                    </li>
                    <li>
                      <strong>Product Launches:</strong> Build excitement for
                      new products
                    </li>
                    <li>
                      <strong>Company History:</strong> Share company milestones
                      and stories
                    </li>
                  </ul>
                </div>

                <div className='bg-teal-50 border-l-4 border-teal-500 p-4 rounded'>
                  <h4 className='font-semibold text-lg mb-2'>
                    🎯 Client/Customer Engagement
                  </h4>
                  <ul className='list-disc list-inside space-y-2 text-gray-700 ml-4'>
                    <li>
                      <strong>Product Tips:</strong> Daily how-tos and best
                      practices
                    </li>
                    <li>
                      <strong>Exclusive Content:</strong> Behind-the-scenes or
                      sneak peeks
                    </li>
                    <li>
                      <strong>Special Offers:</strong> Daily deals or discount
                      codes
                    </li>
                    <li>
                      <strong>User Stories:</strong> Customer testimonials and
                      success stories
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'creators' && (
            <div className='space-y-6'>
              <h3 className='text-2xl font-bold text-gray-800'>
                🎬 Content Creator Ideas
              </h3>

              <div className='space-y-4'>
                <div className='bg-red-50 border-l-4 border-red-500 p-4 rounded'>
                  <h4 className='font-semibold text-lg mb-2'>
                    📱 Social Media Influencers
                  </h4>
                  <ul className='list-disc list-inside space-y-2 text-gray-700 ml-4'>
                    <li>
                      <strong>Exclusive Content:</strong> Unreleased videos or
                      photos for followers
                    </li>
                    <li>
                      <strong>Behind-the-Scenes:</strong> Show your creative
                      process
                    </li>
                    <li>
                      <strong>Fan Engagement:</strong> Q&A videos or shoutouts
                    </li>
                    <li>
                      <strong>Collaboration Teasers:</strong> Build hype for
                      upcoming projects
                    </li>
                    <li>
                      <strong>Giveaway Calendar:</strong> Daily entry
                      opportunities
                    </li>
                  </ul>
                </div>

                <div className='bg-pink-50 border-l-4 border-pink-500 p-4 rounded'>
                  <h4 className='font-semibold text-lg mb-2'>
                    🎥 YouTubers & Streamers
                  </h4>
                  <ul className='list-disc list-inside space-y-2 text-gray-700 ml-4'>
                    <li>
                      <strong>Challenge Calendar:</strong> Daily gaming or
                      creative challenges
                    </li>
                    <li>
                      <strong>Subscriber Milestones:</strong> Celebrate your
                      community
                    </li>
                    <li>
                      <strong>Playlist Reveals:</strong> Build excitement for
                      video series
                    </li>
                    <li>
                      <strong>Merch Launch:</strong> Countdown to product drops
                    </li>
                  </ul>
                </div>

                <div className='bg-purple-50 border-l-4 border-purple-500 p-4 rounded'>
                  <h4 className='font-semibold text-lg mb-2'>
                    ✍️ Writers & Bloggers
                  </h4>
                  <ul className='list-disc list-inside space-y-2 text-gray-700 ml-4'>
                    <li>
                      <strong>Story Serialization:</strong> Release chapters
                      daily
                    </li>
                    <li>
                      <strong>Writing Prompts:</strong> Daily creative
                      challenges
                    </li>
                    <li>
                      <strong>Book Excerpts:</strong> Teasers for upcoming
                      releases
                    </li>
                    <li>
                      <strong>Reader Engagement:</strong> Poetry, short stories,
                      or articles
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'artists' && (
            <div className='space-y-6'>
              <h3 className='text-2xl font-bold text-gray-800'>
                🎸 Musicians & Artists Ideas
              </h3>

              <div className='space-y-4'>
                <div className='bg-red-50 border-l-4 border-red-500 p-4 rounded'>
                  <h4 className='font-semibold text-lg mb-2'>
                    🎵 Musicians & Bands
                  </h4>
                  <ul className='list-disc list-inside space-y-2 text-gray-700 ml-4'>
                    <li>
                      <strong>Acoustic Sessions:</strong> Daily stripped-down
                      performances
                    </li>
                    <li>
                      <strong>Song Countdown:</strong> Lead up to an album or
                      single release
                    </li>
                    <li>
                      <strong>Music History:</strong> Stories behind your songs
                    </li>
                    <li>
                      <strong>Cover Songs:</strong> Daily covers of holiday
                      classics or fan requests
                    </li>
                    <li>
                      <strong>Studio Footage:</strong> Recording process and
                      outtakes
                    </li>
                    <li>
                      <strong>Fan Dedications:</strong> Personalized song
                      snippets
                    </li>
                  </ul>
                </div>

                <div className='bg-orange-50 border-l-4 border-orange-500 p-4 rounded'>
                  <h4 className='font-semibold text-lg mb-2'>
                    🎨 Visual Artists & Photographers
                  </h4>
                  <ul className='list-disc list-inside space-y-2 text-gray-700 ml-4'>
                    <li>
                      <strong>Art Reveal Calendar:</strong> Show your creative
                      process day by day
                    </li>
                    <li>
                      <strong>Portfolio Showcase:</strong> Feature different
                      pieces with stories
                    </li>
                    <li>
                      <strong>Time-Lapse Videos:</strong> Daily creation
                      processes
                    </li>
                    <li>
                      <strong>Technique Tutorials:</strong> Quick art lessons
                    </li>
                    <li>
                      <strong>Print Sale Countdown:</strong> Build excitement
                      for limited editions
                    </li>
                  </ul>
                </div>

                <div className='bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded'>
                  <h4 className='font-semibold text-lg mb-2'>
                    🎭 Performers & Entertainers
                  </h4>
                  <ul className='list-disc list-inside space-y-2 text-gray-700 ml-4'>
                    <li>
                      <strong>Performance Clips:</strong> Highlights from shows
                    </li>
                    <li>
                      <strong>Rehearsal Footage:</strong> Behind-the-scenes
                      preparation
                    </li>
                    <li>
                      <strong>Character Development:</strong> Show your creative
                      process
                    </li>
                    <li>
                      <strong>Tour Countdown:</strong> Build excitement for
                      upcoming performances
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'content' && (
            <div className='space-y-6'>
              <h3 className='text-2xl font-bold text-gray-800'>
                ✨ Content Suggestions
              </h3>

              <div className='space-y-4'>
                <div className='bg-blue-50 border-l-4 border-blue-500 p-4 rounded'>
                  <h4 className='font-semibold text-lg mb-2'>
                    🎄 Holiday Song Suggestions
                  </h4>
                  <p className='text-gray-700 mb-2'>
                    Search YouTube for these classics:
                  </p>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700'>
                    <ul className='list-disc list-inside space-y-1'>
                      <li>All I Want for Christmas Is You</li>
                      <li>Last Christmas - Wham!</li>
                      <li>Jingle Bell Rock</li>
                      <li>Feliz Navidad</li>
                      <li>Rockin' Around the Christmas Tree</li>
                      <li>Santa Tell Me - Ariana Grande</li>
                    </ul>
                    <ul className='list-disc list-inside space-y-1'>
                      <li>White Christmas - Bing Crosby</li>
                      <li>Let It Snow! Let It Snow!</li>
                      <li>The Christmas Song (Chestnuts)</li>
                      <li>Wonderful Christmastime</li>
                      <li>Underneath the Tree - Kelly Clarkson</li>
                      <li>Mistletoe - Justin Bieber</li>
                    </ul>
                  </div>
                </div>

                <div className='bg-green-50 border-l-4 border-green-500 p-4 rounded'>
                  <h4 className='font-semibold text-lg mb-2'>
                    📖 Poem & Quote Ideas
                  </h4>
                  <div className='space-y-3'>
                    <div>
                      <p className='font-semibold text-sm mb-1'>
                        Classic Poems:
                      </p>
                      <ul className='list-disc list-inside space-y-1 text-sm text-gray-700 ml-2'>
                        <li>
                          A Visit from St. Nicholas (Twas the Night Before
                          Christmas)
                        </li>
                        <li>Christmas Bells by Henry Wadsworth Longfellow</li>
                        <li>In the Bleak Midwinter by Christina Rossetti</li>
                      </ul>
                    </div>
                    <div>
                      <p className='font-semibold text-sm mb-1'>
                        Quote Themes:
                      </p>
                      <ul className='list-disc list-inside space-y-1 text-sm text-gray-700 ml-2'>
                        <li>Love and gratitude messages</li>
                        <li>Inspirational holiday quotes</li>
                        <li>Funny Christmas one-liners</li>
                        <li>Meaningful life reflections</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className='bg-purple-50 border-l-4 border-purple-500 p-4 rounded'>
                  <h4 className='font-semibold text-lg mb-2'>🖼️ Image Ideas</h4>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700'>
                    <div>
                      <p className='font-semibold mb-1'>Personal Photos:</p>
                      <ul className='list-disc list-inside space-y-1 ml-2'>
                        <li>Favorite memories together</li>
                        <li>Family gatherings</li>
                        <li>Pets in holiday attire</li>
                        <li>Travel destinations</li>
                      </ul>
                    </div>
                    <div>
                      <p className='font-semibold mb-1'>Stock Images:</p>
                      <ul className='list-disc list-inside space-y-1 ml-2'>
                        <li>Winter landscapes</li>
                        <li>Holiday decorations</li>
                        <li>Cozy fireplace scenes</li>
                        <li>Festive food photos</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className='bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded'>
                  <h4 className='font-semibold text-lg mb-2'>
                    🎥 Video Content Ideas
                  </h4>
                  <ul className='list-disc list-inside space-y-2 text-gray-700 ml-4'>
                    <li>
                      <strong>Holiday Movies:</strong> Trailers or clips from
                      classics
                    </li>
                    <li>
                      <strong>DIY Tutorials:</strong> Crafts, recipes, or
                      decorating
                    </li>
                    <li>
                      <strong>Nature Videos:</strong> Relaxing winter scenes or
                      fireplaces
                    </li>
                    <li>
                      <strong>Comedy Clips:</strong> Holiday-themed sketches
                    </li>
                    <li>
                      <strong>Educational:</strong> History of holiday
                      traditions
                    </li>
                    <li>
                      <strong>Personal Messages:</strong> Record yourself
                      sharing thoughts
                    </li>
                  </ul>
                </div>

                <div className='bg-pink-50 border-l-4 border-pink-500 p-4 rounded'>
                  <h4 className='font-semibold text-lg mb-2'>
                    🔗 Useful Links to Include
                  </h4>
                  <ul className='list-disc list-inside space-y-1 text-gray-700 ml-4'>
                    <li>Recipe websites (AllRecipes, Food Network)</li>
                    <li>Spotify or Apple Music playlists</li>
                    <li>Gift registries or wishlists</li>
                    <li>Event tickets or reservations</li>
                    <li>Photo albums (Google Photos, Flickr)</li>
                    <li>Online games or activities</li>
                    <li>Charitable donation pages</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className='bg-gray-50 p-4 border-t flex justify-center items-center'>
          <button
            onClick={onClose}
            className='bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white px-6 py-2 rounded-lg hover:opacity-90 transition font-semibold'
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}
