"use client";

import { u } from "@/lib/units";
import { fill, firstName, godparentWords } from "@/lib/format";
import { Divider, Flourish } from "../ornaments/Ornaments";
import { useInvite } from "../invitation/InviteContext";
import { PageBody, Reveal } from "./PageParts";

export function MessagePage() {
  const { data } = useInvite();
  const { guest, wedding } = data;
  const c = wedding.content;

  if (guest.kind === "GODPARENT") {
    const w = godparentWords(guest.godparentRole);
    const vars = {
      nome: firstName(guest.name),
      papel: w.papel,
      querido: w.querido,
    };
    const g = c.godparents;
    return (
      <PageBody>
        <Reveal>
          <p
            className="emboss font-display italic"
            style={{
              fontSize: u(6),
              fontWeight: 500,
              color: "#5a73a6",
              lineHeight: 1.1,
            }}
          >
            {fill(g.greeting, vars)}
          </p>
        </Reveal>
        <Reveal delay={0.2} style={{ marginTop: u(3.4), maxWidth: u(62) }}>
          {g.message.map((m, i) => (
            <p
              key={i}
              className="t-body"
              style={{ fontSize: `max(13.5px, ${u(3.95)})`, lineHeight: 1.4 }}
            >
              {fill(m, vars)}
            </p>
          ))}
        </Reveal>
        <Reveal delay={0.55} style={{ marginTop: u(4.4), maxWidth: u(64) }}>
          <p
            className="emboss font-display"
            style={{
              fontSize: u(8.4),
              lineHeight: 1.1,
              fontWeight: 500,
              color: "#33456b",
            }}
          >
            {fill(g.question, vars).replace(/^./, (ch) => ch.toUpperCase())}
          </p>
        </Reveal>
        <Reveal delay={0.9} style={{ marginTop: u(4), maxWidth: u(60) }}>
          <p
            className="t-small italic"
            style={{ fontSize: `max(12.5px, ${u(3.5)})`, color: "#4a5d86" }}
          >
            {fill(g.closing, vars)}
          </p>
        </Reveal>
        <Reveal delay={1.1} style={{ marginTop: u(3.4) }}>
          <Flourish w={26} />
        </Reveal>
      </PageBody>
    );
  }

  return (
    <PageBody>
      <Reveal>
        <p className="t-eyebrow">Nossa mensagem</p>
      </Reveal>
      <Reveal delay={0.1} style={{ marginTop: u(2.6) }}>
        <Divider w={30} />
      </Reveal>
      <div style={{ marginTop: u(4), maxWidth: u(62) }}>
        {c.message.map((m, i) => (
          <Reveal
            key={i}
            delay={0.3 + i * 0.35}
            style={{ marginTop: i ? u(3.2) : 0 }}
          >
            <p
              className="t-body"
              style={{ fontSize: `max(13.5px, ${u(3.95)})`, lineHeight: 1.42 }}
            >
              {m}
            </p>
          </Reveal>
        ))}
      </div>
      <Reveal delay={1.5} style={{ marginTop: u(4.6) }}>
        <p
          className="emboss font-display italic"
          style={{
            fontSize: u(7.4),
            fontWeight: 500,
            color: "#5a73a6",
            lineHeight: 1,
          }}
        >
          {c.signature}
        </p>
      </Reveal>
    </PageBody>
  );
}
