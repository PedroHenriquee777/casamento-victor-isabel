"use client";

import { motion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import { u } from "@/lib/units";
import { Icon, type IconName } from "../ornaments/Icons";

export function PageBody({ children, tall = false }: { children: ReactNode; tall?: boolean }) {
  return (
    <div
      className="absolute flex flex-col items-center justify-center text-center"
      style={{ left: "14.5%", right: "14.5%", top: tall ? "20.5%" : "22%", bottom: tall ? "15%" : "16%" }}
    >
      {children}
    </div>
  );
}

export function Reveal({
  children,
  delay = 0,
  y = 12,
  className,
  style,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.95, delay: 0.12 + delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function InfoRow({
  icon,
  title,
  text,
  highlight = false,
}: {
  icon: IconName;
  title: string;
  text: string;
  highlight?: boolean;
}) {
  return (
    <div
      className="flex w-full items-start text-left"
      style={{ gap: u(3.6), padding: `${u(2.6)} 0`, borderBottom: "1px solid rgba(169,185,217,.45)" }}
    >
      <span
        className="emboss-svg grid shrink-0 place-items-center rounded-full text-serenity-deep"
        style={{
          width: u(9.4),
          height: u(9.4),
          minWidth: 32,
          minHeight: 32,
          background: highlight ? "linear-gradient(135deg,#fff,#DCE6F6)" : "linear-gradient(135deg,#fff,#F0F4FB)",
          border: "1px solid rgba(140,160,201,.7)",
        }}
      >
        <Icon name={icon} size="58%" stroke={1.2} />
      </span>
      <span className="block min-w-0 flex-1">
        <span className="t-eyebrow block" style={{ fontSize: `max(9px, ${u(2.35)})`, letterSpacing: ".3em" }}>
          {title}
        </span>
        <span className="t-small mt-[0.35em] block" style={{ fontSize: `max(12px, ${u(3.4)})`, lineHeight: 1.32 }}>
          {text}
        </span>
      </span>
    </div>
  );
}
