import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Invitation } from "@/components/invitation/Invitation";
import { firstName } from "@/lib/format";
import { getRepo, isDemoMode } from "@/lib/repo";

// A disponibilidade dos presentes muda a todo momento: nunca servir do cache.
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ token: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token } = await params;
  const payload = await (await getRepo()).getInvite(token);
  if (!payload) return { title: "Convite não encontrado" };

  const { wedding, guest } = payload;
  const couple = `${wedding.groomName} & ${wedding.brideName}`;
  const god = guest.kind === "GODPARENT";
  const title = god ? `${couple} · Um convite especial` : `${couple} · Convite de casamento`;
  const description = god
    ? `${firstName(guest.name)}, temos um pedido do fundo do coração. Toque no selo para abrir.`
    : `${firstName(guest.name)}, você é nosso(a) convidado(a) especial. Clique no link e toque no selo para abrir o convite.`;
  return {
    title,
    description,
    robots: { index: false, follow: false },
    openGraph: { title, description, type: "website", locale: "pt_BR", images: [{ url: "/opengraph-image.jpg", width: 1200, height: 630, alt: couple }] },
    twitter: { card: "summary_large_image", title, description, images: ["/opengraph-image.jpg"] },
  };
}

export default async function InvitePage({ params }: Props) {
  const { token } = await params;
  const payload = await (await getRepo()).getInvite(token);
  if (!payload) {
    // Aviso no log do servidor (o convidado só vê a página 404 elegante).
    console.warn(
      `[convite] token "${token}" não encontrado — ` +
        (isDemoMode()
          ? "app em MODO DEMONSTRAÇÃO (DATABASE_URL não carregada por este servidor)."
          : "não existe na tabela guests do banco que este servidor está usando."),
    );
    notFound();
  }
  return <Invitation initial={payload} />;
}
