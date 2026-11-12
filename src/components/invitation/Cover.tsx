"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import { u } from "@/lib/units";
import { Seal } from "./Seal";

interface Props {
  progress: MotionValue<number>;
  guestName: string;
  initials: [string, string];
  onOpen: () => void;
  interactive: boolean;
  ready: boolean;
}

const OPEN_ANGLE = 112;

function Door({
  side,
  progress,
  children,
}: {
  side: "left" | "right";
  progress: MotionValue<number>;
  children?: React.ReactNode;
}) {
  const left = side === "left";
  const rotate = useTransform(
    progress,
    [0, 1],
    [0, left ? OPEN_ANGLE : -OPEN_ANGLE],
  );
  const shade = useTransform(progress, [0, 0.75], [0, 0.55]);
  const opacity = useTransform(progress, [0.88, 1], [1, 0]);

  return (
    <motion.div
      className="absolute inset-y-0 w-1/2"
      style={{
        [side]: 0,
        rotateY: rotate,
        opacity,
        transformOrigin: left ? "0% 50%" : "100% 50%",
        zIndex: left ? 3 : 2,
        backfaceVisibility: "hidden",
        willChange: "transform",
      }}
    >
      <div
        className="paper absolute inset-0 overflow-hidden"
        style={{
          boxShadow: left
            ? "inset -1px 0 0 rgba(255,255,255,.95), inset -4px 0 6px -3px rgba(70,95,150,.35)"
            : "inset 1px 0 0 rgba(255,255,255,.95), inset 4px 0 6px -3px rgba(70,95,150,.35)",
        }}
      >
        <div
          className="absolute inset-y-0 w-[200%]"
          style={{
            [side]: 0,
            backgroundImage: "url(/art/cover.webp)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          className="absolute inset-y-0"
          style={{
            [left ? "right" : "left"]: "2.6%",
            width: 3,
            borderLeft: "1px solid rgba(255,255,255,.95)",
            borderRight: "1px solid rgba(110,135,190,.32)",
          }}
        />
        <motion.div
          className="absolute inset-0"
          style={{ background: "#28396B", opacity: shade }}
        />
      </div>
      {children}
    </motion.div>
  );
}

export function Cover({
  progress,
  guestName,
  initials,
  onOpen,
  interactive,
  ready,
}: Props) {
  const room = useTransform(progress, [0, 0.85], [0.6, 0]);
  const hint = useTransform(progress, [0, 0.1], [1, 0]);

  return (
    <div
      className="absolute inset-0 z-30"
      style={{
        perspective: 1500,
        perspectiveOrigin: "50% 45%",
        opacity: ready ? 1 : 0,
        transition: "opacity .9s ease",
        pointerEvents: interactive ? "auto" : "none",
      }}
    >
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{ background: "#3A4E82", opacity: room }}
      />

      <Door side="right" progress={progress} />
      <Door side="left" progress={progress}>
        <div
          className="absolute right-0 top-[45%]"
          style={{ transform: "translate(50%, -50%)" }}
        >
          <Seal
            initials={initials}
            onPress={onOpen}
            interactive={interactive}
          />
        </div>
      </Door>

      <motion.div
        className="pointer-events-none absolute inset-0 z-40"
        style={{ opacity: hint }}
      >
        <p
          className="t-eyebrow absolute inset-x-0 text-center"
          style={{
            top: `calc(45% + ${u(19)})`,
            fontSize: `max(9px, ${u(2.3)})`,
          }}
        >
          Toque no selo para abrir
        </p>
        <div
          className="absolute inset-x-0 text-center"
          style={{ bottom: "7%" }}
        >
          <p
            className="t-eyebrow"
            style={{ fontSize: `max(8.5px, ${u(2.1)})`, opacity: 0.8 }}
          >
            Convite para
          </p>
          <p
            className="emboss mx-auto mt-[0.6em] max-w-[78%] truncate italic"
            style={{
              fontSize: `max(17px, ${u(5.6)})`,
              fontWeight: 500,
              color: "#5d75a8",
            }}
          >
            {guestName}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
