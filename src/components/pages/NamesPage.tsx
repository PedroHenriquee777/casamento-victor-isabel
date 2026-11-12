"use client";

import { u } from "@/lib/units";
import { Divider, Flourish } from "../ornaments/Ornaments";
import { useInvite } from "../invitation/InviteContext";
import { PageBody, Reveal } from "./PageParts";

export function NamesPage() {
  const { data } = useInvite();
  const { wedding, guest } = data;
  const god = guest.kind === "GODPARENT";
  const long = Math.max(wedding.groomName.length, wedding.brideName.length) > 8;
  const size = long ? 11.5 : 15.5;
  const nameStyle = { fontSize: u(size), lineHeight: 0.98, fontWeight: 500, letterSpacing: ".012em", color: "#33456b" } as const;

  return (
    <PageBody>
      <Reveal>
        <p className="t-eyebrow">{god ? "Convite especial" : "Convite de casamento"}</p>
      </Reveal>
      <Reveal delay={0.1} style={{ marginTop: u(3.4) }}>
        <Flourish w={30} />
      </Reveal>

      <Reveal delay={0.3} style={{ marginTop: u(3) }}>
        <h1 className="emboss font-display" style={nameStyle}>
          {wedding.groomName}
        </h1>
      </Reveal>
      <Reveal delay={0.45}>
        <span
          className="emboss block font-display italic"
          style={{ fontSize: u(9), lineHeight: 1, color: "#7a92c2", fontWeight: 400, margin: `${u(0.6)} 0 ${u(0.4)}` }}
        >
          &amp;
        </span>
      </Reveal>
      <Reveal delay={0.6}>
        <h1 className="emboss font-display" style={nameStyle}>
          {wedding.brideName}
        </h1>
      </Reveal>

      <Reveal delay={0.85} style={{ marginTop: u(4.4) }}>
        <Divider w={34} />
      </Reveal>
      <Reveal delay={1} style={{ marginTop: u(3.6), maxWidth: u(60) }}>
        <p className="t-body italic" style={{ fontSize: `max(13.5px, ${u(4.05)})`, color: "#4a5d86" }}>
          {god ? data.wedding.content.godparents.tagline : wedding.content.tagline}
        </p>
      </Reveal>
    </PageBody>
  );
}
