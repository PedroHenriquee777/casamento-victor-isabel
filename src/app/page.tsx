import Link from "next/link";
import { Divider } from "@/components/ornaments/Ornaments";
import { DEMO_GUESTS } from "@/lib/wedding-config";

export default function Home() {
  const showDemo = process.env.SHOW_DEMO_LINKS === "true" || process.env.NODE_ENV !== "production";
  const demos = DEMO_GUESTS.filter((g) => g.token !== "demo-outro-convidado");

  return (
    <main className="paper fixed inset-0 grid place-items-center overflow-y-auto px-8 py-10 text-center">
      <div className="max-w-sm">
        <Divider w={34} className="mx-auto" />
        <h1 className="t-title emboss mt-6">Convite pessoal</h1>
        <p className="t-body mt-3 italic">
          Este convite abre pelo link individual que você recebeu. Procure a mensagem enviada pelos noivos.
        </p>
        <Divider w={34} className="mx-auto mt-6" />

        {showDemo && (
          <nav className="mt-10" aria-label="Convites de demonstração">
            <p className="t-eyebrow">Demonstração</p>
            <ul className="mt-4 space-y-2">
              {demos.map((g) => (
                <li key={g.token}>
                  <Link href={`/c/${g.token}`} className="t-small italic underline decoration-[#a9b9d9] underline-offset-4">
                    {g.name} — {g.kind === "GODPARENT" ? (g.godparentRole === "MADRINHA" ? "madrinha" : "padrinho") : "convidado"}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </main>
  );
}
