'use client';
import React, { useEffect, useRef } from 'react';

type StarsDecorationProps = {
  color?: string;
  size?: number; // 0.5 - 2.0
  density?: number; // 0.2 - 1.5
  twinkleSpeed?: number; // 0.5 - 2.0
};

export default function StarsDecoration({
  color = '#ffd700',
  size = 1,
  density = 0.6,
  twinkleSpeed = 1,
}: StarsDecorationProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    function resize() {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width));
      canvas.height = Math.max(1, Math.floor(rect.height));
    }
    resize();

    interface Star {
      x: number;
      y: number;
      radius: number;
      phase: number;
      speed: number;
    }

    const stars: Star[] = [];
    const count = Math.floor(30 * density);

    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: (2 + Math.random() * 4) * size,
        phase: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 1.5,
      });
    }

    let last = performance.now();
    function draw(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000) * twinkleSpeed;
      last = now;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const s of stars) {
        if (!prefersReduced) {
          s.phase += dt * s.speed;
        }
        const alpha = prefersReduced
          ? 0.8
          : 0.3 + 0.7 * Math.abs(Math.sin(s.phase));

        // Glow
        const grd = ctx.createRadialGradient(
          s.x,
          s.y,
          0,
          s.x,
          s.y,
          s.radius * 3
        );
        grd.addColorStop(0, hexToRgba(color, alpha * 0.6));
        grd.addColorStop(1, hexToRgba(color, 0));
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius * 3, 0, Math.PI * 2);
        ctx.fill();

        // Star shape (simplified 5-point)
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.fillStyle = hexToRgba(color, alpha);
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
          const r = i % 2 === 0 ? s.radius : s.radius * 0.4;
          const x = Math.cos(angle) * r;
          const y = Math.sin(angle) * r;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(draw);
    }
    rafRef.current = requestAnimationFrame(draw);

    function onResize() {
      resize();
    }
    window.addEventListener('resize', onResize);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', onResize);
    };
  }, [color, size, density, twinkleSpeed]);

  return (
    <canvas
      ref={canvasRef}
      className='pointer-events-none absolute inset-0 z-10'
      style={{ mixBlendMode: 'screen' }}
    />
  );
}

function hexToRgba(hex: string, alpha: number) {
  const m = hex.replace('#', '').match(/.{1,2}/g);
  if (!m) return `rgba(255,255,255,${alpha})`;
  const [r, g, b] = m.map((x) => parseInt(x, 16));
  return `rgba(${r},${g},${b},${alpha})`;
}
