"use client";

import { useState, useEffect } from 'react';

interface CopyShareLinkProps {
  shareId: string;
  className?: string;
}

export default function CopyShareLink({ shareId, className = '' }: CopyShareLinkProps) {
  const [origin, setOrigin] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  const shareUrl = `${origin || ''}/share/${shareId}`;

  const handleCopy = () => {
    const textToCopy = shareUrl;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      });
    } else {
      const temp = document.createElement('input');
      temp.value = textToCopy;
      document.body.appendChild(temp);
      temp.select();
      document.execCommand('copy');
      document.body.removeChild(temp);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <span className={`inline-flex items-center gap-2 ${className}`.trim()}>
      <code className='bg-white px-2 py-1 rounded'>{shareUrl}</code>
      <button
        type='button'
        onClick={handleCopy}
        className='px-2 py-1 rounded bg-blue-600 text-white text-[11px] font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400'
        aria-label='Copy share link'
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </span>
  );
}
