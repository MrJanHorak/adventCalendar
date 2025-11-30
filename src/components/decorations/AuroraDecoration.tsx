'use client';
import React, { useEffect, useRef } from 'react';

type AuroraDecorationProps = {
  colors?: string[];
  speed?: number; // 0.2 - 2.0
  intensity?: number; // 0.3 - 1.5
};

export default function AuroraDecoration({
  colors = ['#00ff87', '#60efff', '#b967ff'],
  speed = 0.5,
  intensity = 0.8,
}: AuroraDecorationProps) {
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
      const parent = canvas!.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      canvas!.width = Math.max(1, Math.floor(rect.width));
      canvas!.height = Math.max(1, Math.floor(rect.height));
    }
    resize();

    let time = 0;
    let last = performance.now();

    function draw(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000) * speed;
      last = now;
      if (!prefersReduced) {
        time += dt;
      }

      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      // Multiple wave layers with different speeds
      const layers = colors.length;
      for (let i = 0; i < layers; i++) {
        const phase = time * (0.5 + i * 0.3);
        const yOffset = (canvas!.height / layers) * i + canvas!.height * 0.1;

        ctx!.save();
        ctx!.globalAlpha = (0.15 + 0.1 * Math.sin(time + i)) * intensity;

        const gradient = ctx!.createLinearGradient(
          0,
          yOffset - 50,
          0,
          yOffset + 150
        );
        gradient.addColorStop(0, hexToRgba(colors[i % colors.length], 0));
        gradient.addColorStop(0.5, hexToRgba(colors[i % colors.length], 1));
        gradient.addColorStop(1, hexToRgba(colors[i % colors.length], 0));

        ctx!.fillStyle = gradient;
        ctx!.beginPath();
        ctx!.moveTo(0, yOffset);

        for (let x = 0; x <= canvas!.width; x += 10) {
          const y =
            yOffset +
            Math.sin(x * 0.01 + phase) * 30 * (1 + i * 0.2) +
            Math.sin(x * 0.02 - phase * 0.5) * 20 * (1 + i * 0.3);
          ctx!.lineTo(x, y);
        }

        ctx!.lineTo(canvas!.width, yOffset + 200);
        ctx!.lineTo(0, yOffset + 200);
        ctx!.closePath();
        ctx!.fill();
        ctx!.restore();
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
  }, [colors, speed, intensity]);

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
