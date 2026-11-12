import type { Metadata } from "next";
import { cookies } from "next/headers";
import type { ReactNode } from "react";
import { AdminActions, LoginForm } from "@/components/admin/AdminForms";
import { Dashboard } from "@/components/admin/Dashboard";
import { ADMIN_COOKIE, adminEnabled, sessionOk } from "@/lib/admin-auth";
import { getRepo } from "@/lib/repo";
import { WEDDING_DEFAULTS } from "@/lib/wedding-config";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Painel dos noivos", robots: { index: false, follow: false } };

function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="paper fixed inset-0 overflow-y-auto overscroll-contain">
      <main className="mx-auto w-full max-w-[920px] px-4 py-8 sm:px-6 sm:py-12">{children}</main>
    </div>
  );
}

function Gate({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-6 pt-[12vh] text-center">
      <p className="t-eyebrow m-0" style={{ fontSize: 11.5 }}>
        Painel dos noivos
      </p>
      <h1 className="font-display m-0 text-[34px] font-medium italic leading-tight" style={{ color: "var(--color-ink)" }}>
        {title}
      </h1>
      {children}
    </div>
  );
}

export default async function AdminPage() {
  if (!adminEnabled()) {
    return (
      <Shell>
        <Gate title="Painel desativado">
          <p className="font-sans text-[15px] leading-relaxed" style={{ color: "var(--color-ink-soft)" }}>
            Para ativar, defina <code>ADMIN_PASSWORD</code> no arquivo <code>.env</code> (veja o README) e reinicie o servidor.
          </p>
        </Gate>
      </Shell>
    );
  }

  const store = await cookies();
  if (!sessionOk(store.get(ADMIN_COOKIE)?.value)) {
    return (
      <Shell>
        <Gate title="Acesso dos noivos">
          <LoginForm />
        </Gate>
      </Shell>
    );
  }

  const data = await (await getRepo()).getAdminOverview();
  return (
    <Shell>
      <Dashboard data={data} tz={WEDDING_DEFAULTS.timeZone} actions={<AdminActions />} />
    </Shell>
  );
}
