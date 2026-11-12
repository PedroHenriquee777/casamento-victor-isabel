import { ArchFrame } from "./ArchFrame";

export function PaperArt() {
  return (
    <>
      <ArchFrame className="pointer-events-none absolute inset-0" />
      <img
        src="/art/corner-tl.webp"
        alt=""
        width={900}
        height={900}
        draggable={false}
        className="pointer-events-none absolute left-0 top-0 select-none"
        style={{ width: "76%", height: "auto" }}
      />
      <img
        src="/art/corner-br.webp"
        alt=""
        width={640}
        height={640}
        draggable={false}
        className="pointer-events-none absolute bottom-0 right-0 select-none"
        style={{ width: "54%", height: "auto" }}
      />
    </>
  );
}
