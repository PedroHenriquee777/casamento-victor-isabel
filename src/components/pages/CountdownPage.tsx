"use client";

import { u } from "@/lib/units";
import { useCountdown } from "@/lib/useCountdown";
import { Divider, Flourish } from "../ornaments/Ornaments";
import { useInvite } from "../invitation/InviteContext";
import { PageBody, Reveal } from "./PageParts";

const pad = (n: number) => String(n).padStart(2, "0");

function Unit({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center" style={{ minWidth: u(14) }}>
      <span
        className="emboss font-display"
        style={{ fontSize: u(10.5), lineHeight: 1, fontWeight: 500, color: "#33456b", fontVariantNumeric: "lining-nums tabular-nums" }}
      >
        {value}
      </span>
      <span className="t-eyebrow" style={{ marginTop: u(1.4), fontSize: `max(8.5px, ${u(2.1)})`, letterSpacing: ".26em", paddingLeft: ".26em" }}>
        {label}
      </span>
    </div>
  );
}

export function CountdownPage() {
  const { data } = useInvite();
  const { wedding } = data;
  const cd = useCountdown(wedding.eventAt);

  const days = cd ? String(cd.days) : "—";
  const happening = cd?.past && cd.today;
  const finished = cd?.past && !cd.today;

  return (
    <PageBody>
      <Reveal>
        <p className="t-eyebrow">{finished ? "Foi inesquecível" : happening ? "Hoje é o grande dia" : "Contagem regressiva"}</p>
      </Reveal>
      <Reveal delay={0.1} style={{ marginTop: u(2.6) }}>
        <Divider w={34} />
      </Reveal>

      {happening ? (
        <Reveal delay={0.3} style={{ marginTop: u(6), maxWidth: u(60) }}>
          <p className="emboss font-display italic" style={{ fontSize: u(9), lineHeight: 1.1, color: "#33456b", fontWeight: 500 }}>
            O dia chegou.
          </p>
          <p className="t-body mt-[0.8em] italic">Mal podemos esperar para ver você.</p>
        </Reveal>
      ) : finished ? (
        <Reveal delay={0.3} style={{ marginTop: u(6), maxWidth: u(60) }}>
          <p className="emboss font-display italic" style={{ fontSize: u(8.4), lineHeight: 1.1, color: "#33456b", fontWeight: 500 }}>
            Obrigado por fazer parte desse dia.
          </p>
        </Reveal>
      ) : (
        <>
          <Reveal delay={0.3} className="flex flex-col items-center" style={{ marginTop: u(4.6) }}>
            <span
              className="emboss font-display"
              style={{ fontSize: u(31), lineHeight: 0.92, fontWeight: 500, color: "#33456b", fontVariantNumeric: "lining-nums tabular-nums" }}
              aria-live="off"
            >
              {days}
            </span>
            <span className="t-eyebrow" style={{ marginTop: u(1.8), letterSpacing: ".42em", paddingLeft: ".42em" }}>
              {cd && cd.days === 1 ? "dia" : "dias"}
            </span>
          </Reveal>

          <Reveal delay={0.55} className="flex items-start justify-center" style={{ marginTop: u(5.4), gap: u(2.2) }}>
            <Unit value={cd ? pad(cd.hours) : "––"} label="horas" />
            <span className="font-display" style={{ fontSize: u(8), color: "#a9b9d9", lineHeight: 1.05 }}>
              ·
            </span>
            <Unit value={cd ? pad(cd.minutes) : "––"} label="min" />
            <span className="font-display" style={{ fontSize: u(8), color: "#a9b9d9", lineHeight: 1.05 }}>
              ·
            </span>
            <Unit value={cd ? pad(cd.seconds) : "––"} label="seg" />
          </Reveal>
        </>
      )}

      <Reveal delay={0.9} style={{ marginTop: u(6), maxWidth: u(58) }}>
        <p className="t-body italic" style={{ fontSize: `max(13.5px, ${u(4.1)})`, color: "#4a5d86" }}>
          {wedding.content.countdownLine}
        </p>
      </Reveal>
      <Reveal delay={1.1} style={{ marginTop: u(4) }}>
        <Flourish w={26} />
      </Reveal>
    </PageBody>
  );
}
