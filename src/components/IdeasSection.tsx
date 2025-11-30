'use client';

import { useState } from 'react';

export default function IdeasSection() {
  const [activeTab, setActiveTab] = useState('personal');

  const ideas = {
    personal: [
      {
        icon: '💑',
        title: 'For Your Partner',
        items: [
          'Daily love notes and reasons why you care',
          'Photos from your favorite memories together',
          'Countdown to a special date or vacation',
        ],
      },
      {
        icon: '🎁',
        title: 'Gift Reveal',
        items: [
          'Daily clues leading to a big surprise',
          'Photos showing parts of the gift',
          'Build excitement for Christmas morning',
        ],
      },
      {
        icon: '🌟',
        title: 'Self-Care Journey',
        items: [
          'Daily meditation or yoga videos',
          'Inspiring quotes and affirmations',
          'Gratitude prompts and reflections',
        ],
      },
    ],
    family: [
      {
        icon: '👶',
        title: 'For Kids',
        items: [
          'Daily holiday stories and videos',
          'Fun crafts and coloring activities',
          'Messages from Santa or favorite characters',
        ],
      },
      {
        icon: '👵',
        title: 'For Grandparents',
        items: [
          'Family photos through the years',
          'Video messages from grandchildren',
          'Favorite family recipes with photos',
        ],
      },
      {
        icon: '🎄',
        title: 'Family Traditions',
        items: [
          'Daily holiday movies to watch together',
          'Baking recipes and cooking activities',
          'Local events and light displays to visit',
        ],
      },
    ],
    work: [
      {
        icon: '🎉',
        title: 'Team Morale',
        items: [
          'Daily employee spotlights and celebrations',
          'Team success stories and achievements',
          'Motivational content and wellness tips',
        ],
      },
      {
        icon: '🎓',
        title: 'Training & Onboarding',
        items: [
          'New hire welcome with team introductions',
          'Daily skill-building videos',
          'Company culture and milestone highlights',
        ],
      },
      {
        icon: '🎯',
        title: 'Client Engagement',
        items: [
          'Product tips and best practices',
          'Exclusive behind-the-scenes content',
          'Daily deals and special offers',
        ],
      },
    ],
    creators: [
      {
        icon: '📱',
        title: 'Social Media',
        items: [
          'Exclusive content for your followers',
          'Behind-the-scenes of your creative process',
          'Daily Q&A videos or fan shoutouts',
        ],
      },
      {
        icon: '🎸',
        title: 'Musicians & Artists',
        items: [
          'Daily acoustic sessions or performances',
          'Song countdown to album release',
          'Art reveal showing your creative process',
        ],
      },
      {
        icon: '✍️',
        title: 'Writers & Bloggers',
        items: [
          'Serialize a story with daily chapters',
          'Daily writing prompts for followers',
          'Book excerpts and upcoming release teasers',
        ],
      },
    ],
  };

  const tabs = [
    { id: 'personal', label: 'Personal', icon: '❤️' },
    { id: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦' },
    { id: 'work', label: 'Work & Teams', icon: '💼' },
    { id: 'creators', label: 'Creators', icon: '🎬' },
  ];

  return (
    <div className='mt-32'>
      <div className='text-center mb-12'>
        <h2 className='text-4xl font-bold text-gray-800 mb-4'>
          Endless Possibilities
        </h2>
        <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
          From romantic gestures to team building, discover creative ways to use
          your advent calendar
        </p>
      </div>

      {/* Tab Navigation */}
      <div className='flex justify-center mb-8 flex-wrap gap-2'>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-full font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
            }`}
          >
            <span className='mr-2'>{tab.icon}</span>
            <span className='hidden sm:inline'>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      <div className='grid md:grid-cols-3 gap-6'>
        {ideas[activeTab as keyof typeof ideas].map((idea, index) => (
          <div
            key={index}
            className='bg-white p-6 rounded-2xl shadow-lg border-2 border-purple-100 hover:border-purple-300 transition-all hover:scale-105 hover:shadow-xl'
          >
            <div className='text-5xl mb-4'>{idea.icon}</div>
            <h3 className='text-xl font-bold text-gray-800 mb-3'>
              {idea.title}
            </h3>
            <ul className='space-y-2'>
              {idea.items.map((item, i) => (
                <li key={i} className='text-gray-600 flex items-start'>
                  <span className='text-purple-500 mr-2 mt-1'>✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className='text-center mt-12'>
        <p className='text-gray-600 mb-4'>
          Ready to create something magical?
        </p>
        <a
          href='#features'
          className='inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 transition shadow-lg'
        >
          Get Started Now
        </a>
      </div>
    </div>
  );
}
