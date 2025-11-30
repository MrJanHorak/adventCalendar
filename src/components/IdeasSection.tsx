'use client';

import { useState } from 'react';
import IdeasModal from './IdeasModal';

export default function IdeasSection() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 text-gray-700 hover:text-purple-600 font-medium transition"
      >
        <span className="text-xl">💡</span>
        <span className="hidden sm:inline">Ideas</span>
      </button>
      <IdeasModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
