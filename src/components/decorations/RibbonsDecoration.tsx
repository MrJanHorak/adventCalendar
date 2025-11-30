'use client';
import React, { useEffect, useRef } from 'react';

type RibbonsDecorationProps = {
  colors?: string[];
  count?: number; // 2 - 6
  speed?: number; // 0.3 - 2.0
};

export default function RibbonsDecoration({
  colors = ['#ff3b3b', '#ffd700', '#33c1ff'],
  count = 3,
  speed = 0.8,
}: RibbonsDecorationProps) {
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

    interface Ribbon {
      xStart: number;
      phase: number;
      speed: number;
      color: string;
      width: number;
    }

    const ribbons: Ribbon[] = [];
    const ribbonCount = Math.min(6, Math.max(2, count));

    for (let i = 0; i < ribbonCount; i++) {
      ribbons.push({
        xStart: (canvas.width / (ribbonCount + 1)) * (i + 1),
        phase: Math.random() * Math.PI * 2,
        speed: 0.8 + Math.random() * 0.4,
        color: colors[i % colors.length],
        width: 15 + Math.random() * 10,
      });
    }

    let last = performance.now();
    function draw(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000) * speed;
      last = now;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const r of ribbons) {
        if (!prefersReduced) {
          r.phase += dt * r.speed;
        }

        // Draw flowing ribbon with sine wave
        ctx.save();
        ctx.globalAlpha = 0.7;

        const gradient = ctx.createLinearGradient(
          r.xStart - r.width / 2,
          0,
          r.xStart + r.width / 2,
          0
        );
        gradient.addColorStop(0, hexToRgba(r.color, 0.3));
        gradient.addColorStop(0.5, hexToRgba(r.color, 1));
        gradient.addColorStop(1, hexToRgba(r.color, 0.3));
        ctx.fillStyle = gradient;

        ctx.beginPath();
        for (let y = -10; y <= canvas.height + 10; y += 2) {
          const waveX =
            Math.sin(y * 0.02 + r.phase) * 30 +
            Math.sin(y * 0.01 - r.phase * 0.5) * 15;
          const x = r.xStart + waveX;
          if (y === -10) {
            ctx.moveTo(x - r.width / 2, y);
          } else {
            ctx.lineTo(x - r.width / 2, y);
          }
        }

        for (let y = canvas.height + 10; y >= -10; y -= 2) {
          const waveX =
            Math.sin(y * 0.02 + r.phase) * 30 +
            Math.sin(y * 0.01 - r.phase * 0.5) * 15;
          const x = r.xStart + waveX;
          ctx.lineTo(x + r.width / 2, y);
        }

        ctx.closePath();
        ctx.fill();

        // Add shine/highlight
        ctx.globalAlpha = 0.3;
        const shineGradient = ctx.createLinearGradient(
          r.xStart - r.width / 3,
          0,
          r.xStart,
          0
        );
        shineGradient.addColorStop(0, 'rgba(255,255,255,0)');
        shineGradient.addColorStop(1, 'rgba(255,255,255,0.6)');
        ctx.fillStyle = shineGradient;

        ctx.beginPath();
        for (let y = -10; y <= canvas.height + 10; y += 2) {
          const waveX =
            Math.sin(y * 0.02 + r.phase) * 30 +
            Math.sin(y * 0.01 - r.phase * 0.5) * 15;
          const x = r.xStart + waveX;
          if (y === -10) {
            ctx.moveTo(x - r.width / 3, y);
          } else {
            ctx.lineTo(x - r.width / 3, y);
          }
        }
        for (let y = canvas.height + 10; y >= -10; y -= 2) {
          const waveX =
            Math.sin(y * 0.02 + r.phase) * 30 +
            Math.sin(y * 0.01 - r.phase * 0.5) * 15;
          const x = r.xStart + waveX;
          ctx.lineTo(x, y);
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
  }, [colors, count, speed]);

  return (
    <canvas
      ref={canvasRef}
      className='pointer-events-none absolute inset-0 z-10'
    />
  );
}

function hexToRgba(hex: string, alpha: number) {
  const m = hex.replace('#', '').match(/.{1,2}/g);
  if (!m) return `rgba(255,255,255,${alpha})`;
  const [r, g, b] = m.map((x) => parseInt(x, 16));
  return `rgba(${r},${g},${b},${alpha})`;
}
