'use client';

import { useEffect, useRef } from 'react';

interface SnowfallProps {
  density?: number; // 0.2 - 1.5
  speed?: number; // 0.5 - 2.0
}

// Lightweight canvas snowfall overlay. Respects reduced motion.
export default function SnowfallDecoration({
  density = 0.6,
  speed = 1,
}: SnowfallProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced) return; // respect reduced motion

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const onResize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', onResize);

    const flakeCount = Math.floor(((width * height) / 20000) * density);
    const flakes = Array.from({ length: flakeCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2 + 1,
      d: Math.random() * speed + 0.5,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      for (const f of flakes) {
        // Draw shadow for better visibility on any background
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.beginPath();
        ctx.arc(f.x + 1, f.y + 1, f.r, 0, Math.PI * 2);
        ctx.fill();

        // Draw white snowflake
        ctx.fillStyle = 'rgba(255,255,255,0.95)';
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();

        // Update position
        f.y += f.d;
        f.x += Math.sin(f.y * 0.01) * 0.6;
        if (f.y > height + 4) {
          f.y = -4;
          f.x = Math.random() * width;
        }
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', onResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [density, speed]);

  return (
    <div className='pointer-events-none absolute inset-0'>
      <canvas ref={canvasRef} className='w-full h-full' />
    </div>
  );
}
