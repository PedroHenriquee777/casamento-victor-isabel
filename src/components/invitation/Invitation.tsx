"use client";

import {
  AnimatePresence,
  MotionConfig,
  animate,
  motion,
  useMotionValue,
} from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { initialOf } from "@/lib/format";
import type { InvitePayload } from "@/lib/types";
import { PAGE_COMPONENTS, PAGE_LABELS, pagesFor } from "../pages/registry";
import { Controls } from "./Controls";
import { Cover } from "./Cover";
import { InviteProvider } from "./InviteContext";
import { PaperArt } from "./PaperArt";
import { useGestures } from "./useGestures";
import { useRsvpFlow } from "./useRsvpFlow";

type Stage = "closed" | "opening" | "open" | "closing";

const ASSETS = [
  "/art/cover.webp",
  "/art/paper.webp",
  "/art/corner-tl.webp",
  "/art/corner-br.webp",
];

function useAssetsReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let alive = true;
    const done = () => alive && setReady(true);
    const timer = window.setTimeout(done, 3500);
    Promise.all(
      ASSETS.map(
        (src) =>
          new Promise<void>((res) => {
            const im = new Image();
            im.onload = im.onerror = () => res();
            im.src = src;
          }),
      ),
    ).then(() => {
      window.clearTimeout(timer);
      done();
    });
    return () => {
      alive = false;
      window.clearTimeout(timer);
    };
  }, []);
  return ready;
}

const pageVariants = {
  enter: (dir: number) => ({ opacity: 0, y: 28 * dir, filter: "blur(10px)" }),
  center: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] as const },
  },
  exit: (dir: number) => ({
    opacity: 0,
    y: -22 * dir,
    filter: "blur(8px)",
    transition: { duration: 0.42, ease: [0.4, 0, 0.8, 0.3] as const },
  }),
};

export function Invitation({ initial }: { initial: InvitePayload }) {
  const [data, setData] = useState(initial);
  const pages = useMemo(() => pagesFor(data.guest.kind), [data.guest.kind]);
  const rsvp = useRsvpFlow(data, setData);
  const ready = useAssetsReady();

  const [stage, setStage] = useState<Stage>("closed");
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [contentOn, setContentOn] = useState(false);
  const [coverGone, setCoverGone] = useState(false);
  const progress = useMotionValue(0);
  const navBusy = useRef(false);
  const sheetRef = useRef<HTMLDivElement>(null);

  const initials: [string, string] = [
    initialOf(data.wedding.groomName),
    initialOf(data.wedding.brideName),
  ];

  const open = useCallback(async () => {
    if (stage !== "closed") return;
    setStage("opening");
    const t = window.setTimeout(() => setContentOn(true), 1500);
    await animate(progress, 1, { duration: 2.4, ease: [0.62, 0, 0.25, 1] });
    window.clearTimeout(t);
    setContentOn(true);
    setStage("open");
    setCoverGone(true);
  }, [stage, progress]);

  const close = useCallback(async () => {
    if (stage !== "open") return;
    setStage("closing");
    setContentOn(false);
    setCoverGone(false);
    await animate(progress, 0, { duration: 1.7, ease: [0.45, 0, 0.3, 1] });
    setIndex(0);
    setDir(1);
    setStage("closed");
  }, [stage, progress]);

  const go = useCallback(
    (delta: 1 | -1) => {
      if (stage !== "open" || navBusy.current) return;
      const next = Math.min(pages.length - 1, Math.max(0, index + delta));
      if (next === index) return;
      navBusy.current = true;
      setDir(delta);
      setIndex(next);
      window.setTimeout(() => (navBusy.current = false), 850);
    },
    [stage, index, pages.length],
  );

  const onPrev = useCallback(() => go(-1), [go]);
  const onNext = useCallback(() => go(1), [go]);
  const onCloseKey = useCallback(() => void close(), [close]);

  useGestures(sheetRef, {
    enabled: stage === "open",
    locked: rsvp.navLocked && pages[index] === "rsvp",
    onNext,
    onPrev,
  });

  const token = data.guest.token;
  const refreshGifts = useCallback(async () => {
    try {
      const res = await fetch(`/api/invite/${encodeURIComponent(token)}`, {
        cache: "no-store",
      });
      const json = (await res.json()) as {
        ok: boolean;
        payload?: InvitePayload;
      };
      if (json.ok && json.payload)
        setData((prev) => ({ ...prev, gifts: json.payload!.gifts }));
    } catch {}
  }, [token]);

  const key = pages[index];
  const Page = PAGE_COMPONENTS[key];

  return (
    <MotionConfig reducedMotion="user">
      <InviteProvider value={{ data, rsvp, close: onCloseKey, refreshGifts }}>
        <div
          className="fixed inset-0 flex justify-center"
          style={{ background: "#E8EDF6" }}
        >
          <div
            ref={sheetRef}
            className="paper relative h-full overflow-hidden"
            style={{
              width: "var(--sheet-w)",
              boxShadow: "0 0 40px rgba(70,95,150,.12)",
              touchAction: "pan-y",
            }}
          >
            <PaperArt />

            <AnimatePresence mode="wait" custom={dir}>
              {contentOn && (
                <motion.div
                  key={key}
                  custom={dir}
                  variants={pageVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute inset-0"
                >
                  <Page />
                </motion.div>
              )}
            </AnimatePresence>

            {stage === "open" && (
              <Controls
                index={index}
                total={pages.length}
                hideNext={key === "rsvp"}
                initials={initials}
                onPrev={onPrev}
                onNext={onNext}
                onClose={onCloseKey}
              />
            )}

            {!coverGone && (
              <Cover
                progress={progress}
                guestName={data.guest.name}
                initials={initials}
                onOpen={() => void open()}
                interactive={stage === "closed"}
                ready={ready}
              />
            )}

            <p className="sr-only" aria-live="polite">
              {stage === "open" ? PAGE_LABELS[key] : ""}
            </p>
          </div>
        </div>
      </InviteProvider>
    </MotionConfig>
  );
}
