import Link from "next/link";
import type { ReactNode } from "react";

const links = [
  ["/", "Início"], ["/ofertas", "Ofertas"], ["/revisao", "Revisão"], ["/publicacoes", "Publicações"],
];
export function Workspace({ current, title, description, children }: {
  current: string; title: string; description: string; children: ReactNode;
}) {
  return <div className="shell">
    <aside className="sidebar" aria-label="Menu principal">
      <Link className="brand" href="/" aria-label="Achadinhos, início">
        <span className="brand-mark" aria-hidden="true">a.</span>
        <span>achadinhos<span className="brand-caption">PAINEL DE OPERAÇÃO</span></span>
      </Link>
      <div className="sidebar-label">ESPAÇO DE TRABALHO</div>
      <nav className="workspace-nav">{links.map(([href, label]) =>
        <Link key={href} href={href} className={current === href ? "nav-active" : "nav-link"}
          aria-current={current === href ? "page" : undefined}>{label}</Link>
      )}</nav>
      <p className="sidebar-note">Boas oportunidades.<br />Decisões com evidência.</p>
    </aside>
    <main>
      <header className="topbar"><span>Workspace / {links.find(([href]) => href === current)?.[1]}</span>
        <span className="environment">Local · sem login</span></header>
      <section className="content">
        <div className="eyebrow">ACHADINHOS ENGINE</div>
        <h1>{title}</h1><p className="intro">{description}</p>{children}
      </section>
    </main>
  </div>;
}
const notices: Record<string, string> = {
  created: "Oferta cadastrada. Confira os dados e faça a revisão.",
  reviewed: "Decisão de revisão salva.",
  scheduled: "Agendamento salvo na fila local.",
  simulated: "Simulação concluída. Nenhuma mensagem foi enviada ao Telegram.",
  cancelled: "Agendamento cancelado. A oferta voltou para aprovada.",
};
export function Feedback({ error, notice }: { error?: string; notice?: string }) {
  return <>
    {error && <p className="feedback error" role="alert">{error.slice(0, 500)}</p>}
    {notice && notices[notice] && <p className="feedback success" role="status">{notices[notice]}</p>}
  </>;
}
