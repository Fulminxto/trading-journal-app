"use client";

import { useEffect, useRef } from "react";

interface Props {
  size?: number;
  fullPage?: boolean;
}

interface Point {
  x: number;
  y: number;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  rot: number;
}

export default function VoltisLightningLoader({
  size = 48,
  fullPage = false,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    const W = size;
    const cx = W / 2;
    const cy = W / 2;
    const radius = W * 0.33;

    const SPEED = 0.075;
    const CHAOS = W * 0.069;
    const SPARK_RATE = 0.35;
    const BASE_W = W * 0.0139;
    const OUTER_RGB = "44,116,232";
    const MID_COL = "#5BE0FF";
    const CORE_COL = "#FFFFFF";
    const STOP_RES = W * 0.008;

    let rotation = Math.random() * 6;
    const sparks: Spark[] = [];
    let rafId: number;
    let cancelled = false;

    function rand(a: number, b: number) {
      return a + Math.random() * (b - a);
    }

    function midpoint(p1: Point, p2: Point, d: number, pts: Point[]) {
      if (d < STOP_RES) {
        pts.push(p2);
        return;
      }
      const m: Point = {
        x: (p1.x + p2.x) / 2 + rand(-d, d),
        y: (p1.y + p2.y) / 2 + rand(-d, d),
      };
      midpoint(p1, m, d / 2, pts);
      midpoint(m, p2, d / 2, pts);
    }

    function buildArc(
      start: number,
      sweep: number,
      segs: number,
      jit: number,
    ): Point[] {
      const nodes: Point[] = [];
      for (let i = 0; i <= segs; i++) {
        const a = start + (sweep * i) / segs;
        nodes.push({ x: cx + Math.cos(a) * radius, y: cy + Math.sin(a) * radius });
      }
      const path: Point[] = [nodes[0]];
      for (let i = 0; i < nodes.length - 1; i++) {
        midpoint(nodes[i], nodes[i + 1], jit, path);
      }
      return path;
    }

    function drawBolt(path: Point[], w: number, color: string, blur: number) {
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.shadowBlur = blur;
      ctx.shadowColor = color;
      ctx.strokeStyle = color;
      ctx.lineWidth = w;
      ctx.beginPath();
      ctx.moveTo(path[0].x, path[0].y);
      for (let i = 1; i < path.length; i++) ctx.lineTo(path[i].x, path[i].y);
      ctx.stroke();
    }

    function frame() {
      if (cancelled) return;

      ctx.clearRect(0, 0, W, W);
      ctx.globalCompositeOperation = "lighter";

      rotation += SPEED;
      const sweep = 1.7 + Math.sin(rotation * 2) * 0.35;

      const main = buildArc(rotation, sweep, 9, CHAOS);
      const branch = buildArc(rotation + 0.18, sweep * 0.65, 7, CHAOS * 0.7);

      drawBolt(main, BASE_W * 2.4, `rgba(${OUTER_RGB},0.5)`, W * 0.15);
      drawBolt(branch, BASE_W * 1.1, "rgba(91,224,255,0.35)", W * 0.1);
      drawBolt(main, BASE_W, MID_COL, W * 0.1);
      drawBolt(main, BASE_W * 0.45, CORE_COL, W * 0.06);

      if (Math.random() < SPARK_RATE) {
        const pt = main[Math.floor(rand(0, main.length))];
        const t = rotation + sweep + Math.PI / 2;
        sparks.push({
          x: pt.x,
          y: pt.y,
          vx: Math.cos(t) * rand(0.5, 2) + rand(-0.5, 0.5),
          vy: Math.sin(t) * rand(0.5, 2) + rand(-0.5, 0.5),
          life: 1,
          size: rand(W * 0.008, W * 0.018),
          rot: rand(0, 3),
        });
      }

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.life -= 0.045;
        if (s.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.rot);
        ctx.shadowBlur = W * 0.055;
        ctx.shadowColor = MID_COL;
        ctx.fillStyle = `rgba(230,248,255,${s.life})`;
        ctx.fillRect(-s.size / 2, -s.size / 2, s.size, s.size);
        ctx.restore();
      }

      ctx.globalCompositeOperation = "source-over";
      rafId = requestAnimationFrame(frame);
    }

    rafId = requestAnimationFrame(frame);

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
    };
  }, [size]);

  if (!fullPage) {
    return <canvas ref={canvasRef} className="loader-fade-in block" />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0C1430]">
      <div className="loader-fade-in flex flex-col items-center gap-5">
        <canvas ref={canvasRef} className="block" />
        <p className="text-xs uppercase tracking-[0.45em] text-[#5f7099]">
          Loading
        </p>
      </div>
    </div>
  );
}
