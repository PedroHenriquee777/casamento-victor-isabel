"use client";

import { u } from "@/lib/units";
import { capitalize, eventParts } from "@/lib/format";
import { Cartouche } from "../ornaments/Ornaments";
import { useInvite } from "../invitation/InviteContext";
import { PageBody, Reveal } from "./PageParts";

export function DatePage() {
  const { data } = useInvite();
  const { wedding } = data;
  const p = eventParts(wedding.eventAt, wedding.timeZone);

  return (
    <PageBody>
      <Reveal>
        <p className="t-eyebrow">Reserve a data</p>
      </Reveal>

      <Reveal delay={0.2} style={{ marginTop: u(3.4) }}>
        <Cartouche w={200} h={260} style={{ width: u(43) }}>
          <span
            className="emboss font-display"
            style={{
              fontSize: u(19),
              lineHeight: 0.9,
              fontWeight: 500,
              color: "#33456b",
              fontVariantNumeric: "lining-nums",
            }}
          >
            {p.day}
          </span>
          <span
            className="t-eyebrow"
            style={{
              marginTop: u(2.4),
              fontSize: `max(10px, ${u(3)})`,
              letterSpacing: ".42em",
              paddingLeft: ".42em",
            }}
          >
            {p.month}
          </span>
          <span
            className="my-[0.55em] block h-[5px] w-[5px] rotate-45 bg-[#8CA0C9]"
            style={{ marginTop: u(2.6), marginBottom: u(2.2) }}
          />
          <span
            className="emboss font-display"
            style={{
              fontSize: u(5.6),
              fontWeight: 500,
              color: "#5a73a6",
              letterSpacing: ".18em",
              paddingLeft: ".18em",
              fontVariantNumeric: "lining-nums",
            }}
          >
            {p.year}
          </span>
        </Cartouche>
      </Reveal>

      <Reveal
        delay={0.5}
        className="flex items-center justify-center"
        style={{ marginTop: u(3.2), gap: u(3) }}
      >
        <Cartouche
          w={150}
          h={56}
          orient="h"
          inner={false}
          style={{ width: u(29) }}
        >
          <span
            className="t-eyebrow"
            style={{
              fontSize: `max(9px, ${u(2.5)})`,
              letterSpacing: ".26em",
              paddingLeft: ".26em",
            }}
          >
            {p.weekday.replace("-feira", "")}
          </span>
        </Cartouche>
        <Cartouche
          w={150}
          h={56}
          orient="h"
          inner={false}
          style={{ width: u(25) }}
        >
          <span
            className="emboss font-display"
            style={{
              fontSize: u(5),
              fontWeight: 500,
              color: "#33456b",
              fontVariantNumeric: "lining-nums",
            }}
          >
            {p.timeLabel}
          </span>
        </Cartouche>
      </Reveal>

      <Reveal
        delay={0.8}
        className="grid w-full grid-cols-2"
        style={{ marginTop: u(4.2), columnGap: u(4), rowGap: u(2.6) }}
      >
        {wedding.content.schedule.map((s, i, all) => (
          <div
            key={i}
            className="text-center"
            style={{
              borderTop: "1px solid rgba(169,185,217,.55)",
              paddingTop: u(1.8),
              ...(all.length % 2 === 1 && i === all.length - 1
                ? {
                    gridColumn: "1 / -1",
                    justifySelf: "center",
                    width: `calc(50% - ${u(2)})`,
                  }
                : null),
            }}
          >
            <span
              className="font-display block"
              style={{
                fontSize: `max(14px, ${u(4.3)})`,
                fontWeight: 600,
                color: "#33456b",
                fontVariantNumeric: "lining-nums",
              }}
            >
              {s.time}
            </span>
            <span
              className="t-small block italic"
              style={{ fontSize: `max(11.5px, ${u(3.1)})`, lineHeight: 1.2 }}
            >
              {capitalize(s.label)}
            </span>
          </div>
        ))}
      </Reveal>
    </PageBody>
  );
}
