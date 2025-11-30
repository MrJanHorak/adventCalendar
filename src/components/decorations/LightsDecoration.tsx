"use client";
import React, { useEffect, useRef } from "react";

type LightsDecorationProps = {
  colors?: string[]; // array of light bulb colors
  speed?: number; // animation speed multiplier 0.5 - 2.0
  brightness?: number; // 0.5 - 1.5
};

// Animated holiday lights around the entry container border.
// Uses canvas to draw bulbs along the perimeter and animates blink/glow.
export default function LightsDecoration({
  colors = ["#ff3b3b", "#33c1ff", "#46f05a", "#ffd33b"],
  speed = 1,
  brightness = 1,
}: LightsDecorationProps) {
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

    // Determine border radius & border width of parent to avoid clipping
    const parentStyle = canvas.parentElement
      ? getComputedStyle(canvas.parentElement)
      : ({} as CSSStyleDeclaration);
    const parentBorderWidth = parseFloat(parentStyle.borderWidth || "0") || 0;
    const parentRadius = parseFloat(parentStyle.borderRadius || "0") || 0;

    const bulbGap = 36; // px distance between bulbs
    const bulbRadius = 6; // base radius
    // Keep bulbs fully visible: inset includes radius + halo + parent border
    const edgeInset = bulbRadius + 6 + parentBorderWidth;
    const perimeter = () => 2 * ((canvas.width - 2 * edgeInset) + (canvas.height - 2 * edgeInset));

    // Build bulb positions around rectangle perimeter
    const bulbs: { x: number; y: number; phase: number; color: string }[] = [];
    function layoutBulbs() {
      bulbs.length = 0;
      const effectiveW = Math.max(20, canvas.width - 2 * edgeInset);
      const effectiveH = Math.max(20, canvas.height - 2 * edgeInset);
      const total = Math.max(4, Math.floor(perimeter() / bulbGap));
      const sides = [effectiveW, effectiveH, effectiveW, effectiveH];
      let sideIdx = 0;
      let posOnSide = 0;
      for (let i = 0; i < total; i++) {
        const t = posOnSide / sides[sideIdx];
        let x = 0, y = 0;
        switch (sideIdx) {
          case 0: // top: left -> right
            x = edgeInset + t * effectiveW;
            y = edgeInset;
            break;
          case 1: // right: top -> bottom
            x = edgeInset + effectiveW;
            y = edgeInset + t * effectiveH;
            break;
          case 2: // bottom: right -> left
            x = edgeInset + effectiveW - t * effectiveW;
            y = edgeInset + effectiveH;
            break;
          case 3: // left: bottom -> top
            x = edgeInset;
            y = edgeInset + effectiveH - t * effectiveH;
            break;
        }
        bulbs.push({
          x,
          y,
          phase: Math.random() * Math.PI * 2,
          color: colors[i % colors.length],
        });
        posOnSide += bulbGap;
        if (posOnSide >= sides[sideIdx]) {
          posOnSide = 0;
          sideIdx = (sideIdx + 1) % 4;
        }
      }
    }
    layoutBulbs();

    let last = performance.now();
    function draw(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000) * speed;
      last = now;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // wire (rounded rectangle if parent has radius)
      ctx.strokeStyle = "rgba(50,50,50,0.55)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      roundedRect(
        ctx,
        edgeInset,
        edgeInset,
        canvas.width - 2 * edgeInset,
        canvas.height - 2 * edgeInset,
        Math.max(0, parentRadius - parentBorderWidth - 4)
      );
      ctx.stroke();

      for (const b of bulbs) {
        b.phase += dt * 2; // blink speed
        const glow = prefersReduced ? 0.6 : 0.6 + 0.4 * Math.sin(b.phase);
        const r = bulbRadius * (1 + 0.25 * Math.sin(b.phase));

        // glow halo
        const grd = ctx.createRadialGradient(b.x, b.y, r * 0.6, b.x, b.y, r * 3);
        grd.addColorStop(0, hexToRgba(b.color, 0.35 * brightness * glow));
        grd.addColorStop(1, hexToRgba(b.color, 0));
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(b.x, b.y, r * 3, 0, Math.PI * 2);
        ctx.fill();

        // bulb body + small socket shadow (no overflow beyond edge)
        ctx.fillStyle = hexToRgba(b.color, 0.95 * brightness);
        ctx.beginPath();
        ctx.arc(b.x, b.y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(30,30,30,0.7)";
        ctx.fillRect(b.x - r * 0.5, b.y - r * 0.5, r, r * 0.2);
      }

      rafRef.current = requestAnimationFrame(draw);
    }
    rafRef.current = requestAnimationFrame(draw);

    function onResize() {
      resize();
      layoutBulbs();
    }
    window.addEventListener("resize", onResize);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, [colors, speed, brightness]);

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
    ctx.rect(x, y, w, h);
    return;
  }
  const radius = Math.min(r, w / 2, h / 2);
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
