"use client";
import React, { useEffect, useRef } from "react";

type GlowDecorationProps = {
  color?: string; // glow color
  intensity?: number; // 0.2 - 1.5
  pulse?: boolean; // enable subtle pulsing
};

// Ambient glow overlay for the entry content area.
export default function GlowDecoration({
  color = "#ffd33b",
  intensity = 0.7,
  pulse = true,
}: GlowDecorationProps) {
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

    let last = performance.now();
    let t = Math.random() * Math.PI * 2;
    function draw(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (pulse && !prefersReduced) t += dt * 0.8; // gentle pulse

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Full coverage radial gradient (no padding) so glow reaches edges
      const parentStyle = canvas.parentElement
        ? getComputedStyle(canvas.parentElement)
        : ({} as CSSStyleDeclaration);
      const borderRadius = parseFloat(parentStyle.borderRadius || "0") || 0;
      const innerR = Math.max(1, Math.min(canvas.width, canvas.height) * 0.12);
      const outerR = Math.sqrt(canvas.width * canvas.width + canvas.height * canvas.height) * 0.55;
      const grd = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        innerR,
        canvas.width / 2,
        canvas.height / 2,
        outerR
      );
      const alphaBase = 0.18 * intensity;
      const pulseFactor = pulse && !prefersReduced ? 0.06 * Math.sin(t) : 0;
      grd.addColorStop(0, hexToRgba(color, alphaBase + pulseFactor));
      grd.addColorStop(1, hexToRgba(color, 0));
      ctx.save();
      // Clip to rounded rectangle so glow respects border radius
      roundedRect(ctx, 0, 0, canvas.width, canvas.height, borderRadius);
      ctx.clip();
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

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
  }, [color, intensity, pulse]);

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

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  if (r <= 0) {
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    return;
  }
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.arc(x + w - radius, y + radius, radius, -Math.PI / 2, 0);
  ctx.lineTo(x + w, y + h - radius);
  ctx.arc(x + w - radius, y + h - radius, radius, 0, Math.PI / 2);
  ctx.lineTo(x + radius, y + h);
  ctx.arc(x + radius, y + h - radius, radius, Math.PI / 2, Math.PI);
  ctx.lineTo(x, y + radius);
  ctx.arc(x + radius, y + radius, radius, Math.PI, 1.5 * Math.PI);
}
