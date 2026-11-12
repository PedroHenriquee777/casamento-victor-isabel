"use client";

import { useEffect, useRef } from "react";

interface Options {
  enabled: boolean;
  locked: boolean;
  onNext: () => void;
  onPrev: () => void;
}

function scrollParent(el: EventTarget | null, root: HTMLElement): HTMLElement | null {
  let node = el instanceof HTMLElement ? el : null;
  while (node && node !== root) {
    const oy = getComputedStyle(node).overflowY;
    if ((oy === "auto" || oy === "scroll") && node.scrollHeight > node.clientHeight + 2) return node;
    node = node.parentElement;
  }
  return null;
}

const atTop = (el: HTMLElement) => el.scrollTop <= 1;
const atBottom = (el: HTMLElement) => el.scrollTop + el.clientHeight >= el.scrollHeight - 2;
const isField = (t: EventTarget | null) => t instanceof HTMLElement && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName);

export function useGestures(rootRef: React.RefObject<HTMLElement | null>, opts: Options) {
  const o = useRef(opts);
  o.current = opts;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let startY = 0;
    let startX = 0;
    let startTarget: EventTarget | null = null;
    let startAtTop = true;
    let startAtBottom = true;
    let wheelLock = 0;

    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      startY = t.clientY;
      startX = t.clientX;
      startTarget = e.target;
      const sp = scrollParent(e.target, root);
      startAtTop = sp ? atTop(sp) : true;
      startAtBottom = sp ? atBottom(sp) : true;
    };

    const onTouchEnd = (e: TouchEvent) => {
      const { enabled, locked, onNext, onPrev } = o.current;
      if (!enabled || locked || isField(startTarget)) return;
      const t = e.changedTouches[0];
      const dy = t.clientY - startY;
      const dx = t.clientX - startX;
      if (Math.abs(dy) < 52 || Math.abs(dy) < Math.abs(dx) * 1.3) return;
      if (dy < 0 && startAtBottom) onNext();
      else if (dy > 0 && startAtTop) onPrev();
    };

    const onWheel = (e: WheelEvent) => {
      const { enabled, locked, onNext, onPrev } = o.current;
      if (!enabled || locked || Math.abs(e.deltaY) < 24) return;
      const now = Date.now();
      if (now < wheelLock) return;
      const sp = scrollParent(e.target, root);
      if (sp && ((e.deltaY > 0 && !atBottom(sp)) || (e.deltaY < 0 && !atTop(sp)))) return;
      wheelLock = now + 900;
      if (e.deltaY > 0) onNext();
      else onPrev();
    };

    const onKey = (e: KeyboardEvent) => {
      const { enabled, locked, onNext, onPrev } = o.current;
      if (!enabled || locked || isField(e.target)) return;
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        onNext();
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        onPrev();
      }
    };

    root.addEventListener("touchstart", onTouchStart, { passive: true });
    root.addEventListener("touchend", onTouchEnd, { passive: true });
    root.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      root.removeEventListener("touchstart", onTouchStart);
      root.removeEventListener("touchend", onTouchEnd);
      root.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
    };
  }, [rootRef]);
}
