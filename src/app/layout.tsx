import type { Metadata, Viewport } from "next";
import "@fontsource/cormorant-garamond/latin-400.css";
import "@fontsource/cormorant-garamond/latin-500.css";
import "@fontsource/cormorant-garamond/latin-600.css";
import "@fontsource/cormorant-garamond/latin-400-italic.css";
import "@fontsource/cormorant-garamond/latin-500-italic.css";
import "@fontsource/cormorant-garamond/latin-600-italic.css";
import "@fontsource/jost/latin-300.css";
import "@fontsource/jost/latin-400.css";
import "@fontsource/jost/latin-500.css";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://casamento-victor-isabel.vercel.app/";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Convite de casamento · Victor & Isabel",
  description: "Você(ês) é(são) nosso(s) convidado(s) especial(is). Ao clicar, toque no selo para abrir o convite.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Victor & Isabel · Convite de casamento",
    description: "Toque no selo para abrir o seu convite.",
    type: "website",
    locale: "pt_BR",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#fbfcfe",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
