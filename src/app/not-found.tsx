import { Divider } from "@/components/ornaments/Ornaments";

export default function NotFound() {
  return (
    <main className="paper fixed inset-0 grid place-items-center px-8 text-center">
      <div className="max-w-sm">
        <Divider w={34} className="mx-auto" />
        <h1 className="t-title emboss mt-6">Convite não encontrado</h1>
        <p className="t-body mt-3 italic">
          Confira se o link está completo, exatamente como você recebeu. Se o problema continuar, fale com os noivos.
        </p>
        <Divider w={34} className="mx-auto mt-6" />
      </div>
    </main>
  );
}
