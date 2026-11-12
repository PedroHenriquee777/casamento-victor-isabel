"use client";

import { useLayoutEffect, useRef, useState } from "react";

function archPath(w: number, h: number, d: number): string {
  const x0 = w * 0.072 + d;
  const x1 = w - w * 0.072 - d;
  const yTop = h * 0.074 + d;
  const yBot = h * 0.935 - d;
  const cx = w / 2;
  const aH = w * 0.265 - d * 0.5;
  const yB = yTop + h * 0.088 - d * 0.3;
  const yS = yB + h * 0.052; 
  const dy = yS - yB;
  const n = w * 0.05;
  const xe = cx - aH;
  const xr = cx + aH;
  const p = (v: number) => +v.toFixed(2);
  return [
    `M ${p(x0)} ${p(yBot - n)}`,
    `L ${p(x0)} ${p(yS)}`,
    `C ${p(x0)} ${p(yS - dy * 0.62)} ${p(xe)} ${p(yB + dy * 0.62)} ${p(xe)} ${p(yB)}`,
    `C ${p(xe)} ${p(yB - h * 0.052)} ${p(cx - aH * 0.46)} ${p(yTop)} ${p(cx)} ${p(yTop)}`,
    `C ${p(cx + aH * 0.46)} ${p(yTop)} ${p(xr)} ${p(yB - h * 0.052)} ${p(xr)} ${p(yB)}`,
    `C ${p(xr)} ${p(yB + dy * 0.62)} ${p(x1)} ${p(yS - dy * 0.62)} ${p(x1)} ${p(yS)}`,
    `L ${p(x1)} ${p(yBot - n)}`,
    `A ${p(n)} ${p(n)} 0 0 0 ${p(x1 - n)} ${p(yBot)}`,
    `L ${p(x0 + n)} ${p(yBot)}`,
    `A ${p(n)} ${p(n)} 0 0 0 ${p(x0)} ${p(yBot - n)}`,
    "Z",
  ].join(" ");
}

export function ArchFrame({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 390, h: 844 });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) setSize({ w: r.width, h: r.height });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { w, h } = size;
  const outer = archPath(w, h, 0);
  const inner = archPath(w, h, Math.max(5, w * 0.017));
  const apexY = h * 0.074;

  return (
    <div ref={ref} className={className} aria-hidden>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="emboss-svg absolute inset-0">
        <defs>
          <linearGradient id="archFill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffffff" stopOpacity=".5" />
            <stop offset="1" stopColor="#EEF3FA" stopOpacity=".35" />
          </linearGradient>
          <radialGradient id="archPearl" cx=".35" cy=".3" r=".8">
            <stop offset="0" stopColor="#fff" />
            <stop offset="1" stopColor="#AEBEDD" />
          </radialGradient>
        </defs>
        <path d={outer} fill="url(#archFill)" stroke="#9DB0D4" strokeWidth="1.15" />
        <path d={inner} fill="none" stroke="#BCC9E3" strokeWidth="0.9" />
        <circle cx={w / 2} cy={apexY - 1} r="3.2" fill="url(#archPearl)" stroke="#8CA0C9" strokeWidth=".6" />
        <path d={`M ${w / 2 - 14} ${apexY} L ${w / 2 - 9} ${apexY - 3} L ${w / 2 - 9} ${apexY + 3} Z`} fill="#fff" stroke="#8CA0C9" strokeWidth=".6" />
        <path d={`M ${w / 2 + 14} ${apexY} L ${w / 2 + 9} ${apexY - 3} L ${w / 2 + 9} ${apexY + 3} Z`} fill="#fff" stroke="#8CA0C9" strokeWidth=".6" />
      </svg>
    </div>
  );
}
