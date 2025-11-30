"use client";
import React, { useEffect, useRef } from "react";

type ConfettiDecorationProps = {
  colors?: string[];
  density?: number; // 0.2 - 1.5
  speed?: number; // 0.5 - 2.0
};

export default function ConfettiDecoration({
  colors = ["#ff3b3b", "#33c1ff", "#46f05a", "#ffd33b", "#ff6edb", "#9b59ff"],
  density = 0.6,
  speed = 1,
}: ConfettiDecorationProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) return;

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

    interface Confetto {
      x: number;
      y: number;
      vx: number;
      vy: number;
      rotation: number;
      rotationSpeed: number;
      width: number;
      height: number;
      color: string;
    }

    const confetti: Confetto[] = [];
    const count = Math.floor(40 * density);

    for (let i = 0; i < count; i++) {
      confetti.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: 1 + Math.random() * 3,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        width: 8 + Math.random() * 8,
        height: 4 + Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let last = performance.now();
    function draw(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000) * speed;
      last = now;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const c of confetti) {
        c.x += c.vx * dt * 60;
        c.y += c.vy * dt * 60;
        c.rotation += c.rotationSpeed * dt * 60;

        // Wrap around
        if (c.y > canvas.height + 20) {
          c.y = -20;
          c.x = Math.random() * canvas.width;
        }
        if (c.x < -20) c.x = canvas.width + 20;
        if (c.x > canvas.width + 20) c.x = -20;

        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(c.rotation);
        ctx.fillStyle = c.color;
        ctx.fillRect(-c.width / 2, -c.height / 2, c.width, c.height);
        ctx.restore();
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
  }, [colors, density, speed]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-10"
    />
  );
}
