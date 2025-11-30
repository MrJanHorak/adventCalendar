"use client";
import React, { useEffect, useRef } from "react";

type CandleDecorationProps = {
  count?: number; // 2 - 8
  flameColor?: string;
  intensity?: number; // 0.5 - 2.0
};

export default function CandleDecoration({
  count = 4,
  flameColor = "#ff6b35",
  intensity = 1,
}: CandleDecorationProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resize() {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width));
      canvas.height = Math.max(1, Math.floor(rect.height));
    }
    resize();

    interface Candle {
      x: number;
      y: number;
      phase: number;
      speed: number;
    }

    const candles: Candle[] = [];
    const positions = Math.min(8, Math.max(2, count));

    // Position candles around perimeter (corners and midpoints)
    const spots = [
      { x: 0.1, y: 0.05 },  // top-left
      { x: 0.5, y: 0.05 },  // top-center
      { x: 0.9, y: 0.05 },  // top-right
      { x: 0.9, y: 0.95 },  // bottom-right
      { x: 0.5, y: 0.95 },  // bottom-center
      { x: 0.1, y: 0.95 },  // bottom-left
      { x: 0.05, y: 0.5 },  // left-center
      { x: 0.95, y: 0.5 },  // right-center
    ];

    for (let i = 0; i < positions; i++) {
      const spot = spots[i % spots.length];
      candles.push({
        x: spot.x,
        y: spot.y,
        phase: Math.random() * Math.PI * 2,
        speed: 2 + Math.random(),
      });
    }

    let last = performance.now();
    function draw(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const c of candles) {
        if (!prefersReduced) {
          c.phase += dt * c.speed;
        }
        const flicker = prefersReduced ? 0.9 : 0.7 + 0.3 * Math.sin(c.phase);
        const x = c.x * canvas.width;
        const y = c.y * canvas.height;

        const flameHeight = 20 * intensity * flicker;
        const flameWidth = 12 * intensity;

        // Glow halo
        const grd = ctx.createRadialGradient(x, y - flameHeight / 2, 0, x, y - flameHeight / 2, flameWidth * 2);
        grd.addColorStop(0, hexToRgba(flameColor, 0.6 * flicker));
        grd.addColorStop(1, hexToRgba(flameColor, 0));
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(x, y - flameHeight / 2, flameWidth * 2, 0, Math.PI * 2);
        ctx.fill();

        // Flame shape (teardrop)
        ctx.fillStyle = hexToRgba(flameColor, 0.9 * flicker);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.bezierCurveTo(
          x - flameWidth / 2, y - flameHeight / 3,
          x - flameWidth / 2, y - flameHeight * 0.7,
          x, y - flameHeight
        );
        ctx.bezierCurveTo(
          x + flameWidth / 2, y - flameHeight * 0.7,
          x + flameWidth / 2, y - flameHeight / 3,
          x, y
        );
        ctx.fill();

        // Inner flame
        ctx.fillStyle = hexToRgba("#ffd700", 0.8 * flicker);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.bezierCurveTo(
          x - flameWidth / 4, y - flameHeight / 4,
          x - flameWidth / 4, y - flameHeight * 0.5,
          x, y - flameHeight * 0.7
        );
        ctx.bezierCurveTo(
          x + flameWidth / 4, y - flameHeight * 0.5,
          x + flameWidth / 4, y - flameHeight / 4,
          x, y
        );
        ctx.fill();

        // Candle stick
        ctx.fillStyle = "rgba(200,180,150,0.8)";
        ctx.fillRect(x - 4, y, 8, 15);
      }

      rafRef.current = requestAnimationFrame(draw);
    }
    rafRef.current = requestAnimationFrame(draw);

    function onResize() {
      resize();
    }
    window.addEventListener("resize", onResize);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, [count, flameColor, intensity]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-10"
      style={{ mixBlendMode: "screen" }}
    />
  );
}

function hexToRgba(hex: string, alpha: number) {
  const m = hex.replace("#", "").match(/.{1,2}/g);
  if (!m) return `rgba(255,255,255,${alpha})`;
  const [r, g, b] = m.map((x) => parseInt(x, 16));
  return `rgba(${r},${g},${b},${alpha})`;
}
