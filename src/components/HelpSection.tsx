'use client';

import { useState } from 'react';
import HelpModal from './HelpModal';

export default function HelpSection() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 text-gray-700 hover:text-red-600 font-medium transition"
      >
        <span className="text-xl">❓</span>
        <span className="hidden sm:inline">Help</span>
      </button>
      <HelpModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
