'use client';

import { useState } from 'react';
import IdeasModal from './IdeasModal';

export default function IdeasSection() {
  const [open, setOpen] = useState(false);

  const ideaCategories = [
    {
      emoji: '💝',
      title: 'For Your Partner',
      ideas: [
        'Love notes and reasons why you appreciate them',
        'Favorite memories from the year',
        'Date night vouchers and romantic surprises',
        'Photos from special moments together',
      ],
    },
    {
      emoji: '👨‍👩‍👧‍👦',
      title: 'For Family',
      ideas: [
        'Childhood photos and memories',
        'Family recipes and cooking videos',
        'Video messages from relatives',
        'Plans for family activities',
      ],
    },
    {
      emoji: '🎄',
      title: 'Holiday Themed',
      ideas: [
        'Christmas poems and carols',
        'Holiday movie recommendations',
        'Festive recipes to try',
        'Links to holiday playlists',
      ],
    },
  ];

  return (
    <>
      <div className='mt-32'>
        <div className='text-center mb-12'>
          <button
            onClick={() => setOpen(true)}
            className='inline-flex items-center gap-2 text-4xl font-bold text-gray-800 hover:text-purple-600 transition mb-4'
          >
            <span>💡</span>
            <span>Ideas & Inspiration</span>
          </button>
          <p className='text-xl text-gray-600'>
            Not sure what to put in your calendar? Here are some ideas to get
            you started!
          </p>
        </div>

        <div className='grid md:grid-cols-3 gap-8'>
          {ideaCategories.map((category) => (
            <div
              key={category.title}
              className='bg-white p-8 rounded-2xl shadow-lg border-2 border-purple-100 hover:border-purple-300 transition'
            >
              <div className='text-5xl mb-4'>{category.emoji}</div>
              <h3 className='text-2xl font-bold text-gray-800 mb-4'>
                {category.title}
              </h3>
              <ul className='space-y-2 text-gray-600'>
                {category.ideas.map((idea, idx) => (
                  <li key={idx} className='flex items-start gap-2'>
                    <span className='text-green-500 mt-1'>✓</span>
                    <span>{idea}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className='text-center mt-8'>
          <button
            onClick={() => setOpen(true)}
            className='bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:opacity-90 transition transform hover:scale-105 shadow-lg'
          >
            💡 See More Ideas
          </button>
        </div>
      </div>

      <IdeasModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
