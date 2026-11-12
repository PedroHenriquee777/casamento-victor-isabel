"use client";

import { u } from "@/lib/units";
import { coordsLabel, mapsEmbedUrl, mapsRouteUrl } from "@/lib/format";
import { Icon } from "../ornaments/Icons";
import { MapCartouche } from "../ornaments/MapCartouche";
import { Cartouche } from "../ornaments/Ornaments";
import { useInvite } from "../invitation/InviteContext";
import { PageBody, Reveal } from "./PageParts";

export function VenuePage() {
  const { data } = useInvite();
  const v = data.wedding.content.venue;

  return (
    <PageBody>
      <Reveal>
        <p className="t-eyebrow">Local</p>
      </Reveal>

      <Reveal delay={0.2} style={{ marginTop: u(2.8) }}>
        <MapCartouche
          mode={v.mapMode}
          embedUrl={mapsEmbedUrl(v)}
          title={v.name}
          width={40}
          street={v.streetLabel ?? v.address.split(/[,—]/)[0].trim()}
          marker={v.marker}
          coordsLabel={v.lat !== undefined && v.lng !== undefined ? coordsLabel(v.lat, v.lng) : undefined}
        />
      </Reveal>

      <Reveal delay={0.45} style={{ marginTop: u(2.8) }}>
        <Cartouche w={260} h={78} orient="h" style={{ width: u(60) }}>
          <span
            className="emboss font-display"
            style={{
              fontSize: `max(15px, ${u(v.name.length > 16 ? 4.4 : 5)})`,
              fontWeight: 600,
              color: "#33456b",
              lineHeight: 1.05,
              maxWidth: u(44),
              textWrap: "balance",
            }}
          >
            {v.name}
          </span>
        </Cartouche>
      </Reveal>

      <Reveal delay={0.65} style={{ marginTop: u(2.4), maxWidth: u(62) }}>
        <p className="t-small" style={{ fontSize: `max(12px, ${u(3.3)})`, lineHeight: 1.3 }}>
          {v.address}
        </p>
        <p className="t-small italic" style={{ fontSize: `max(12px, ${u(3.3)})`, lineHeight: 1.3 }}>
          {v.city}
        </p>
        {v.note && (
          <p className="t-eyebrow" style={{ marginTop: u(1.6), fontSize: `max(8.5px, ${u(2)})`, letterSpacing: ".16em" }}>
            {v.note}
          </p>
        )}
      </Reveal>

      <Reveal delay={0.85} style={{ marginTop: u(3) }}>
        <a
          className="pill"
          href={mapsRouteUrl(v)}
          target="_blank"
          rel="noopener noreferrer"
          style={{ whiteSpace: "nowrap", letterSpacing: ".15em", padding: `${u(2.1)} ${u(4.2)}`, fontSize: `max(10px, ${u(2.5)})` }}
        >
          <Icon name="pin" size={15} stroke={1.4} />
          Rota no Google Maps
        </a>
      </Reveal>
    </PageBody>
  );
}
