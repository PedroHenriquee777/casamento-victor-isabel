"use client";

import { u } from "@/lib/units";
import { fill, godparentWords } from "@/lib/format";
import { Divider } from "../ornaments/Ornaments";
import { useInvite } from "../invitation/InviteContext";
import { InfoRow, PageBody, Reveal } from "./PageParts";

export function InfoPage() {
  const { data } = useInvite();
  const items = data.wedding.content.info;

  return (
    <PageBody tall>
      <Reveal>
        <p className="t-eyebrow" style={{ letterSpacing: ".24em" }}>Informações importantes</p>
      </Reveal>
      <Reveal delay={0.1} style={{ marginTop: u(2.2) }}>
        <Divider w={30} />
      </Reveal>
      <Reveal delay={0.2} style={{ marginTop: u(1.6) }}>
        <h2 className="t-title emboss">Para a sua tranquilidade</h2>
      </Reveal>
      <div className="w-full" style={{ marginTop: u(2.4) }}>
        {items.map((it, i) => (
          <Reveal key={i} delay={0.35 + i * 0.18} y={10}>
            <InfoRow icon={it.icon} title={it.title} text={it.text} />
          </Reveal>
        ))}
      </div>
    </PageBody>
  );
}

export function GuidancePage() {
  const { data } = useInvite();
  const { guest, wedding } = data;
  const g = wedding.content.godparents;
  const w = godparentWords(guest.godparentRole);
  const role = guest.godparentRole === "MADRINHA" ? "MADRINHA" : "PADRINHO";

  return (
    <PageBody tall>
      <Reveal>
        <p className="t-eyebrow" style={{ letterSpacing: ".24em" }}>Para {w.papelPlural}</p>
      </Reveal>
      <Reveal delay={0.1} style={{ marginTop: u(2.2) }}>
        <Divider w={30} />
      </Reveal>
      <Reveal delay={0.2} style={{ marginTop: u(1.6) }}>
        <h2 className="t-title emboss">O seu papel nesse dia</h2>
      </Reveal>
      <div className="w-full" style={{ marginTop: u(2.4) }}>
        <Reveal delay={0.35} y={10}>
          <InfoRow icon="dress" title={`Vestimenta · ${w.Papel}`} text={g.dressCode[role]} highlight />
        </Reveal>
        {g.guidance.map((it, i) => (
          <Reveal key={i} delay={0.53 + i * 0.18} y={10}>
            <InfoRow icon={it.icon} title={it.title} text={fill(it.text, { chegada: g.arrival })} />
          </Reveal>
        ))}
      </div>
    </PageBody>
  );
}
