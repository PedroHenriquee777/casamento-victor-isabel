"use client";

import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type AnimationPlaybackControls,
  type MotionValue,
} from "framer-motion";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { u } from "@/lib/units";
import type { GiftView } from "@/lib/types";
import { Icon } from "../ornaments/Icons";
import { BookCoverArt, CLOTH } from "./BookCover";
import { b, ClosingPage, GiftsPage, IntroPage, type BookMetrics } from "./BookPages";
import { buildBookPages, type BookPageSpec } from "./paginate";
import { BOOK_AUTO_OPEN_DELAY_MS, BOOK_CLOSE_MS, BOOK_FLIP_MS, BOOK_OPEN_MS } from "./timing";

const RATIO_MAX = 0.72;
const RATIO_MIN = 0.6;
const PERSPECTIVE = 1700;
const MAX_ANGLE = 96;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const FLIP_EASE = [0.45, 0.04, 0.2, 1] as const;

function useBox() {
  const ref = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const read = () => setBox({ w: el.clientWidth, h: el.clientHeight });
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return { ref, box };
}

function Leaf({
  index,
  pos,
  cover,
  z,
  current,
  label,
  children,
}: {
  index: number;
  pos: MotionValue<number>;
  cover: MotionValue<number>;
  z: number;
  current: boolean;
  label: string;
  children: ReactNode;
}) {
  const lift = useTransform(pos, (v) => clamp01(v - index));
  const upper = useTransform([pos, cover] as MotionValue<number>[], ([p, c]: number[]) => (index === 0 ? c : clamp01(p - (index - 1))));
  const transform = useTransform(lift, (t) => `perspective(${PERSPECTIVE}px) rotateY(${-MAX_ANGLE * t}deg)`);
  const opacity = useTransform(lift, (t) => (t >= 0.995 ? 0 : 1));
  const ownShade = useTransform(lift, (t) => 0.6 * (1 - Math.cos(t * (Math.PI / 2))));
  const cast = useTransform(upper, (t) => 0.95 * Math.sin(clamp01(t) * Math.PI));

  return (
    <motion.div
      role="group"
      aria-label={label}
      aria-hidden={!current}
      inert={!current}
      className="absolute"
      style={{
        left: 0,
        top: b(1.6),
        width: `calc(100% - ${b(2.6)})`,
        height: `calc(100% - ${b(3.2)})`,
        zIndex: z,
        transform,
        transformOrigin: "0% 50%",
        opacity,
        pointerEvents: current ? "auto" : "none",
        willChange: "transform",
      }}
    >
      {children}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ opacity: ownShade, borderRadius: `${b(0.4)} ${b(1.6)} ${b(1.6)} ${b(0.4)}`, background: "linear-gradient(90deg, rgba(36,52,100,.18), rgba(36,52,100,.78))" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ opacity: cast, borderRadius: `${b(0.4)} ${b(1.6)} ${b(1.6)} ${b(0.4)}`, background: "linear-gradient(90deg, rgba(30,45,90,.46), rgba(30,45,90,.16) 55%, rgba(30,45,90,0))" }}
      />
    </motion.div>
  );
}

function ArrowBtn({ dir, label, disabled, onClick }: { dir: "prev" | "next"; label: string; disabled: boolean; onClick: () => void }) {
  return (
    <button type="button" aria-label={label} disabled={disabled} onClick={onClick} className="pill" style={{ width: 44, height: 44, padding: 0 }}>
      <Icon name="chevron-down" size={18} stroke={1.5} className={dir === "next" ? "-rotate-90" : "rotate-90"} />
    </button>
  );
}

export interface GiftBookProps {
  gifts: GiftView[];
  selected: string[];
  max: number | null;
  open: boolean;
  initials: [string, string];
  onToggle: (id: string) => void;
  onClosed?: () => void;
}

export function GiftBook({ gifts, selected, max, open, initials, onToggle, onClosed }: GiftBookProps) {
  const reduce = useReducedMotion();
  const { ref: stageRef, box } = useBox();

  const availW = box.w * 0.97;
  const availH = box.h * 0.98;
  const ratio = availH > 0 ? Math.min(RATIO_MAX, Math.max(RATIO_MIN, availW / availH)) : RATIO_MAX;
  const W = box.w > 0 ? Math.floor(Math.min(availW, availH * ratio)) : 0;
  const H = Math.round(W / ratio);
  const bu = W / 100;

  const rowH = Math.max(46, Math.round(13 * bu));
  const headerH = Math.max(34, Math.round(8.8 * bu));
  const metrics: BookMetrics = { rowH, headerH };
  const innerH = H - 3.2 * bu - 12 * bu;
  const capacity = Math.round((innerH / rowH) * 10) / 10;
  const pages = useMemo<BookPageSpec[]>(
    () => (W > 0 ? buildBookPages(gifts, capacity, headerH / rowH) : []),
    [gifts, capacity, headerH, rowH, W],
  );

  const cover = useMotionValue(0);
  const pos = useMotionValue(0);
  const coverAnim = useRef<AnimationPlaybackControls | null>(null);
  const flipAnim = useRef<AnimationPlaybackControls | null>(null);
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);
  const anchor = useRef("intro");
  const [opened, setOpened] = useState(false);
  const [rewinding, setRewinding] = useState(false);
  const closeToken = useRef(0);
  const onClosedRef = useRef(onClosed);
  onClosedRef.current = onClosed;

  const anchorOf = useCallback((p: BookPageSpec | undefined) => {
    if (!p) return "intro";
    return p.kind === "gifts" ? p.sections[0].gifts[0].id : p.kind;
  }, []);

  useEffect(() => {
    if (pages.length === 0) return;
    const a = anchor.current;
    let i = pages.findIndex((p) =>
      a === "intro" || a === "closing" ? p.kind === a : p.kind === "gifts" && p.sections.some((s) => s.gifts.some((g) => g.id === a)),
    );
    if (i < 0) i = Math.min(indexRef.current, pages.length - 1);
    if (i !== indexRef.current) {
      indexRef.current = i;
      setIndex(i);
      flipAnim.current?.stop();
      pos.set(i);
    }
  }, [pages, pos]);

  const flipTo = useCallback(
    (to: number) => {
      const target = Math.max(0, Math.min(pages.length - 1, to));
      flipAnim.current?.stop();
      if (target !== indexRef.current) {
        indexRef.current = target;
        anchor.current = anchorOf(pages[target]);
        setIndex(target);
      }
      if (reduce) pos.set(target);
      else flipAnim.current = animate(pos, target, { duration: BOOK_FLIP_MS / 1000, ease: FLIP_EASE });
    },
    [pages, pos, reduce, anchorOf],
  );

  const openCover = useCallback(() => {
    closeToken.current++;
    coverAnim.current?.stop();
    if (reduce) {
      cover.set(1);
      setOpened(true);
      return;
    }
    coverAnim.current = animate(cover, 1, { duration: BOOK_OPEN_MS / 1000, ease: [0.55, 0, 0.2, 1] });
    window.setTimeout(() => setOpened(true), BOOK_OPEN_MS * 0.7);
  }, [cover, reduce]);

  const closeCover = useCallback(() => {
    const token = ++closeToken.current;
    const alive = () => closeToken.current === token;
    setOpened(false);
    coverAnim.current?.stop();
    flipAnim.current?.stop();
    const toFirstPage = () => {
      indexRef.current = 0;
      anchor.current = "intro";
      setIndex(0);
      setRewinding(false);
    };
    const closeIt = () => {
      if (!alive()) return;
      const a = animate(cover, 0, { duration: BOOK_CLOSE_MS / 1000, ease: [0.55, 0, 0.25, 1] });
      coverAnim.current = a;
      a.then(() => alive() && onClosedRef.current?.());
    };
    if (reduce) {
      pos.set(0);
      cover.set(0);
      toFirstPage();
      onClosedRef.current?.();
      return;
    }
    const from = pos.get();
    if (from > 0.01) {
      const dur = Math.min(0.9, 0.4 + 0.1 * from);
      setRewinding(true);
      const r = animate(pos, 0, { duration: dur, ease: FLIP_EASE });
      flipAnim.current = r;
      r.then(() => alive() && toFirstPage());
      window.setTimeout(closeIt, dur * 800);
    } else closeIt();
  }, [cover, pos, reduce]);

  useEffect(() => {
    if (W === 0) return;
    if (open) {
      const t = window.setTimeout(openCover, reduce ? 0 : BOOK_AUTO_OPEN_DELAY_MS);
      return () => window.clearTimeout(t);
    }
    closeCover();
  }, [open, W === 0, openCover, closeCover, reduce]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(
    () => () => {
      coverAnim.current?.stop();
      flipAnim.current?.stop();
    },
    [],
  );

  useEffect(() => {
    if (!opened) return;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        e.preventDefault();
        flipTo(indexRef.current + 1);
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        flipTo(indexRef.current - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [opened, flipTo]);

  const drag = useRef<{ x0: number; y0: number; base: number; active: boolean; lastX: number; lastT: number; vx: number } | null>(null);
  const justDragged = useRef(false);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (!opened || (e.pointerType === "mouse" && e.button !== 0)) return;
    drag.current = { x0: e.clientX, y0: e.clientY, base: indexRef.current, active: false, lastX: e.clientX, lastT: performance.now(), vx: 0 };
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x0;
    const dy = e.clientY - d.y0;
    if (!d.active) {
      if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy) * 1.4) {
        d.active = true;
        flipAnim.current?.stop();
        e.currentTarget.setPointerCapture(e.pointerId);
      } else return;
    }
    const now = performance.now();
    d.vx = (e.clientX - d.lastX) / Math.max(1, now - d.lastT);
    d.lastX = e.clientX;
    d.lastT = now;
    pos.set(Math.max(0, Math.min(pages.length - 1, d.base + -dx / (W * 0.85))));
  };
  const endDrag = () => {
    const d = drag.current;
    drag.current = null;
    if (!d?.active) return;
    justDragged.current = true;
    window.setTimeout(() => (justDragged.current = false), 150);
    const delta = pos.get() - d.base;
    let target = d.base;
    if (delta > 0.28 || (delta > 0.06 && d.vx < -0.35)) target = d.base + 1;
    else if (delta < -0.28 || (delta < -0.06 && d.vx > 0.35)) target = d.base - 1;
    flipTo(target);
  };

  const selectedSet = useMemo(() => new Set(selected), [selected]);
  const chosenNames = useMemo(() => gifts.filter((g) => selectedSet.has(g.id)).map((g) => g.name), [gifts, selectedSet]);

  const renderPage = (p: BookPageSpec, i: number) => {
    const number = i + 1;
    if (p.kind === "intro") return <IntroPage max={max} number={number} />;
    if (p.kind === "closing") return <ClosingPage initials={initials} chosen={chosenNames} max={max} number={number} />;
    return (
      <GiftsPage
        sections={p.sections}
        number={number}
        selected={selectedSet}
        selectedCount={selected.length}
        max={max}
        metrics={metrics}
        onToggle={onToggle}
      />
    );
  };

  const coverTransform = useTransform(cover, (c) => `perspective(${PERSPECTIVE}px) rotateY(${-MAX_ANGLE * c}deg)`);
  const coverOpacity = useTransform(cover, (c) => (c >= 0.995 ? 0 : 1));
  const coverShade = useTransform(cover, (c) => 0.55 * (1 - Math.cos(c * (Math.PI / 2))));

  const total = pages.length;
  return (
    <div className="flex h-full min-h-0 w-full flex-col items-center" role="region" aria-roledescription="livro" aria-label="Lista de presentes">
      <div
        ref={stageRef}
        className="relative min-h-0 w-full flex-1"
        style={{ touchAction: "pan-y", userSelect: "none", WebkitUserSelect: "none" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={(e) => {
          if (justDragged.current) {
            e.stopPropagation();
            e.preventDefault();
          }
        }}
      >
        {W > 0 && (
          <div
            className="absolute"
            style={{ left: "50%", top: "50%", width: W, height: H, marginLeft: -W / 2, marginTop: -H / 2, ["--bu" as string]: `${bu}px` }}
          >
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                borderRadius: `${b(0.9)} ${b(2.4)} ${b(2.4)} ${b(0.9)}`,
                background: CLOTH,
                boxShadow: `0 ${b(2.2)} ${b(4.6)} rgba(44,64,118,.4), 0 ${b(0.5)} ${b(1.1)} rgba(44,64,118,.35)`,
              }}
            />
            <div
              aria-hidden
              className="absolute overflow-hidden"
              style={{
                left: b(0.2),
                top: b(0.9),
                width: `calc(100% - ${b(1.6)})`,
                height: `calc(100% - ${b(1.8)})`,
                borderRadius: `${b(0.3)} ${b(1.8)} ${b(1.8)} ${b(0.3)}`,
                background: "#f7f9fd",
                boxShadow: "inset 0 0 0 1px rgba(169,185,217,.6)",
              }}
            >
              <div className="absolute inset-y-0 right-0" style={{ width: b(1.3), background: "repeating-linear-gradient(90deg, #fbfcfe 0 1px, #c5d1e8 1px 2px)" }} />
              <div className="absolute inset-x-0 bottom-0" style={{ height: b(0.8), background: "repeating-linear-gradient(0deg, #fbfcfe 0 1px, #c5d1e8 1px 2px)" }} />
            </div>

            <div className="absolute inset-0" style={{ clipPath: "inset(-60px -60px -60px 0)" }}>
              {pages.map(
                (p, i) =>
                  (rewinding || Math.abs(i - index) <= 2) && (
                    <Leaf key={`${p.kind}-${i}`} index={i} pos={pos} cover={cover} z={total - i} current={opened && i === index} label={`Página ${i + 1} de ${total}`}>
                      {renderPage(p, i)}
                    </Leaf>
                  ),
              )}
              <motion.button
                type="button"
                aria-label="Abrir livro de presentes"
                tabIndex={opened ? -1 : 0}
                onClick={openCover}
                className="absolute inset-0 border-0 bg-transparent p-0"
                style={{
                  zIndex: total + 2,
                  transform: coverTransform,
                  transformOrigin: "0% 50%",
                  opacity: coverOpacity,
                  pointerEvents: opened ? "none" : "auto",
                  willChange: "transform",
                  cursor: opened ? "default" : "pointer",
                }}
              >
                <BookCoverArt initials={initials} />
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{ opacity: coverShade, borderRadius: `${b(0.9)} ${b(2.4)} ${b(2.4)} ${b(0.9)}`, background: "linear-gradient(90deg, rgba(30,46,96,.2), rgba(30,46,96,.8))" }}
                />
              </motion.button>
            </div>
          </div>
        )}
      </div>

      <div className="flex shrink-0 items-center justify-center" style={{ gap: u(3.4), paddingTop: u(1.2) }}>
        <ArrowBtn dir="prev" label="Página anterior" disabled={!opened || index === 0} onClick={() => flipTo(index - 1)} />
        <span className="t-eyebrow" aria-live="polite" style={{ minWidth: u(13), fontSize: `max(10px, ${u(2.5)})`, fontVariantNumeric: "lining-nums", letterSpacing: ".2em" }}>
          {opened && total > 0 ? `${index + 1} / ${total}` : " "}
        </span>
        <ArrowBtn dir="next" label="Próxima página" disabled={!opened || index >= total - 1} onClick={() => flipTo(index + 1)} />
      </div>
    </div>
  );
}
