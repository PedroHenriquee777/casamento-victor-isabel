"use client";

import { AnimatePresence, motion } from "framer-motion";
import { u } from "@/lib/units";
import { Icon } from "../ornaments/Icons";
import { SealArt } from "./Seal";

interface Props {
  index: number;
  total: number;
  hideNext: boolean;
  initials: [string, string];
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
}

export function Controls({ index, total, hideNext, initials, onPrev, onNext, onClose }: Props) {
  return (
    <>
      <motion.button
        type="button"
        aria-label="Fechar convite"
        onClick={onClose}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.7 }}
        whileTap={{ scale: 0.92 }}
        className="absolute z-20 cursor-pointer"
        style={{
          right: "4.2%",
          top: `calc(var(--pad-top) + 1.8%)`,
          width: u(8.2),
          height: u(10.25),
          minWidth: 30,
          minHeight: 37,
          touchAction: "manipulation",
        }}
      >
        <SealArt initials={initials} />
      </motion.button>

      <div
        className="pointer-events-none absolute inset-x-0 z-20 flex justify-center"
        style={{ top: `calc(var(--pad-top) + 1.4%)` }}
      >
        <AnimatePresence>
          {index > 0 && (
            <motion.button
              key="back"
              type="button"
              aria-label="Página anterior"
              onClick={onPrev}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.4 }}
              className="pointer-events-auto grid cursor-pointer place-items-center text-serenity-deep"
              style={{ width: 44, height: 36, touchAction: "manipulation" }}
            >
              <Icon name="chevron-up" size={20} stroke={1.3} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 z-20 flex justify-center"
        style={{ top: "88.4%", marginTop: -22 }}
      >
        <AnimatePresence>
          {!hideNext && index < total - 1 && (
            <motion.div
              key="next"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="pointer-events-auto"
            >
              <button type="button" className="pill" onClick={onNext} aria-label="Próxima página">
                Continuar
                <span className="hint-nudge inline-flex">
                  <Icon name="arrow-down" size={14} stroke={1.4} />
                </span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ol
        className="pointer-events-none absolute z-20 flex -translate-y-1/2 flex-col items-center"
        style={{ right: "2.3%", top: "50%", gap: u(1.5) }}
        aria-label={`Página ${index + 1} de ${total}`}
      >
        {Array.from({ length: total }, (_, i) => (
          <li
            key={i}
            style={{
              width: 4,
              height: i === index ? `max(14px, ${u(4.4)})` : 4,
              borderRadius: 4,
              background: i === index ? "#5A73A6" : i < index ? "#A9B9D9" : "#D3DDEF",
              transition: "height .6s cubic-bezier(.22,1,.36,1), background .6s",
            }}
          />
        ))}
      </ol>
    </>
  );
}
