"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, type ReactNode } from "react";
import { u } from "@/lib/units";
import { initialOf } from "@/lib/format";
import { GiftBook } from "../book/GiftBook";
import { Icon } from "../ornaments/Icons";
import { Cartouche, Flourish } from "../ornaments/Ornaments";
import { useInvite } from "../invitation/InviteContext";

const step = {
  initial: { opacity: 0, y: 10, filter: "blur(5px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, delay: 0.18, ease: [0.22, 1, 0.36, 1] as const } },
  exit: { opacity: 0, y: -10, filter: "blur(4px)", transition: { duration: 0.4, ease: [0.4, 0, 0.6, 1] as const } },
};

const bookStep = {
  initial: { opacity: 0, y: 46, scale: 0.93 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 1.05, delay: 0.1, ease: [0.25, 0.7, 0.25, 1] as const } },
  exit: { opacity: 0, y: 18, scale: 0.97, transition: { duration: 0.45, ease: [0.4, 0, 0.6, 1] as const } },
};

const BERRY = "#8E4A62";

function Header({ title, hint }: { title: string; hint?: ReactNode }) {
  return (
    <header className="flex shrink-0 flex-col items-center text-center">
      <Cartouche w={150} h={56} orient="h" inner={false} style={{ width: u(21) }}>
        <span className="t-eyebrow" style={{ fontSize: `max(9px, ${u(2.4)})`, letterSpacing: ".3em", paddingLeft: ".3em" }}>
          CONVITE
        </span>
      </Cartouche>
      <h2 className="t-title emboss" style={{ marginTop: u(2.2) }}>
        {title}
      </h2>
      {hint && (
        <p className="t-small italic" style={{ marginTop: u(1.2), maxWidth: u(64), fontSize: `max(12px, ${u(3.25)})` }}>
          {hint}
        </p>
      )}
    </header>
  );
}

function Footer({ children, error }: { children: ReactNode; error?: string | null }) {
  return (
    <footer className="flex shrink-0 flex-col items-center" style={{ paddingTop: u(1.6), gap: u(1.2) }}>
      {error && (
        <p role="alert" className="t-small" style={{ color: BERRY, fontSize: `max(12px, ${u(3.1)})`, lineHeight: 1.25 }}>
          {error}
        </p>
      )}
      <div className="flex items-center justify-center" style={{ gap: u(1.4) }}>
        {children}
      </div>
    </footer>
  );
}

function Choice({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      className="flex w-full cursor-pointer items-center text-left"
      style={{ gap: u(3.4), padding: `${u(3)} ${u(1)}`, borderBottom: "1px solid rgba(169,185,217,.45)", minHeight: 48, touchAction: "manipulation" }}
    >
      <span
        className="emboss-svg grid shrink-0 place-items-center rounded-full"
        style={{
          width: u(6.2),
          height: u(6.2),
          minWidth: 22,
          minHeight: 22,
          border: "1px solid #8CA0C9",
          background: selected ? "radial-gradient(circle at 35% 30%, #8AA2D2, #566FA5)" : "#fff",
          transition: "background .3s",
        }}
      >
        {selected && <Icon name="check" size="70%" stroke={2.2} className="text-white" />}
      </span>
      <span
        className="font-display"
        style={{ fontSize: `max(15px, ${u(4.6)})`, fontWeight: selected ? 600 : 500, color: selected ? "#33456b" : "#55678f", lineHeight: 1.15 }}
      >
        {children}
      </span>
    </button>
  );
}

export function RsvpPage() {
  const { data, rsvp, close, refreshGifts } = useInvite();
  const { guest, wedding, gifts } = data;
  const god = guest.kind === "GODPARENT";
  const c = wedding.content;

  useEffect(() => {
    void refreshGifts();
  }, [refreshGifts]);

  const max = rsvp.max;

  const body = (() => {
    if (rsvp.step === "presence") {
      return (
        <>
          <Header title={god ? "Você aceita o convite?" : "Você estará conosco?"} hint={c.rsvp.deadlineLabel} />
          <div className="flex min-h-0 w-full flex-1 flex-col justify-center" role="radiogroup" aria-label="Resposta">
            <Choice selected={rsvp.status === "CONFIRMED"} onClick={() => rsvp.choose("CONFIRMED")}>
              {god ? "Aceito com todo o carinho" : "Sim, estarei lá com alegria"}
            </Choice>
            <Choice selected={rsvp.status === "DECLINED"} onClick={() => rsvp.choose("DECLINED")}>
              {god ? "Não poderei comparecer" : "Infelizmente não poderei ir"}
            </Choice>
          </div>
          <Footer error={rsvp.error}>
            {rsvp.status === "DECLINED" ? (
              <button type="button" className="pill pill-solid" disabled={rsvp.submitting} onClick={() => void rsvp.submit()}>
                {rsvp.submitting ? "Enviando…" : "Enviar resposta"}
              </button>
            ) : (
              <button type="button" className="pill pill-solid" disabled={!rsvp.status} onClick={rsvp.next}>
                Continuar
              </button>
            )}
          </Footer>
        </>
      );
    }

    if (rsvp.step === "gifts") {
      return (
        <>
          <div className="min-h-0 w-full flex-1">
            <GiftBook
              gifts={gifts}
              selected={rsvp.selected}
              max={max}
              open={!rsvp.leaving}
              onClosed={rsvp.finishLeave}
              initials={[initialOf(wedding.groomName), initialOf(wedding.brideName)]}
              onToggle={rsvp.toggleGift}
            />
          </div>
          <Footer error={rsvp.error ?? (rsvp.limitHit ? `Você já escolheu ${max} ${max === 1 ? "presente" : "presentes"}. Desmarque um para trocar.` : null)}>
            <button type="button" className="ghost" onClick={rsvp.back} disabled={rsvp.submitting || rsvp.leaving}>
              Voltar
            </button>
            <button type="button" className="pill pill-solid" onClick={() => void rsvp.submit()} disabled={rsvp.submitting || rsvp.leaving}>
              {rsvp.submitting ? "Enviando…" : "Confirmar"}
            </button>
          </Footer>
        </>
      );
    }

    const mine = gifts.filter((g) => g.reservedByMe);
    const yes = guest.rsvp?.status === "CONFIRMED";
    return (
      <>
        <div className="flex min-h-0 w-full flex-1 flex-col items-center justify-center text-center">
          <Flourish w={30} />
          <h2 className="emboss font-display italic" style={{ fontSize: u(11), lineHeight: 1, fontWeight: 500, color: "#33456b", marginTop: u(3) }}>
            {yes ? "Obrigado!" : "Sentiremos a sua falta"}
          </h2>
          <p className="t-body italic" style={{ marginTop: u(3), maxWidth: u(62), fontSize: `max(13.5px, ${u(3.9)})`, color: "#4a5d86" }}>
            {yes ? c.rsvp.thanksConfirmed : c.rsvp.thanksDeclined}
          </p>
          <div className="w-full" style={{ marginTop: u(4), borderTop: "1px solid rgba(169,185,217,.55)", paddingTop: u(2.4) }}>
            <p className="t-eyebrow" style={{ fontSize: `max(8.5px, ${u(2.1)})` }}>
              {yes ? "Presença confirmada" : "Resposta registrada"}
            </p>
            {mine.length > 0 && (
              <p className="t-small italic" style={{ marginTop: u(1.2) }}>
                {mine.length === 1 ? "Presente reservado: " : "Presentes reservados: "}
                {mine.map((g) => g.name).join(" · ")}
              </p>
            )}
          </div>
        </div>
        <Footer>
          <button type="button" className="ghost" onClick={rsvp.edit}>
            Alterar
          </button>
          <button type="button" className="pill" onClick={close}>
            Fechar convite
          </button>
        </Footer>
      </>
    );
  })();

  const isBook = rsvp.step === "gifts";
  const area = isBook
    ? { left: "5.5%", right: "5.5%", top: "9%", bottom: "4.5%" }
    : { left: "14.5%", right: "14.5%", top: "20.5%", bottom: "15%" };
  const motionProps = isBook ? bookStep : step;

  return (
    <AnimatePresence initial={false}>
      <motion.div
        key={rsvp.step}
        className="absolute flex flex-col items-center"
        style={area}
        initial={motionProps.initial}
        animate={motionProps.animate}
        exit={{ ...motionProps.exit, pointerEvents: "none" as const }}
      >
        {body}
      </motion.div>
    </AnimatePresence>
  );
}
