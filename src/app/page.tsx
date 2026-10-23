import Link from "next/link";
import { isApiReady } from "@/lib/api-health";
import { Workspace } from "@/components/workspace";
export const dynamic = "force-dynamic";
const modules = [
  { number: "01", title: "Ofertas", href: "/ofertas", description: "Cadastre oportunidades e consulte preços e histórico." },
  { number: "02", title: "Revisão", href: "/revisao", description: "Confira os dados e registre sua aprovação ou rejeição." },
  { number: "03", title: "Publicações", href: "/publicacoes", description: "Consulte e cancele agendamentos da fila local." },
];
export default async function Home() {
  const ready = await isApiReady();
  return <Workspace current="/" title="Sua operação começa aqui." description="Cadastre, revise e organize suas ofertas em um só lugar.">
    <section className="connection" aria-labelledby="connection-title">
      <div>
        <div className={ready ? "status ready" : "status offline"}><span className="status-dot" aria-hidden="true" />
          {ready ? "Conexão disponível" : "Conexão indisponível"}</div>
        <h2 id="connection-title">{ready ? "Seu painel está conectado." : "Aguardando conexão com a operação."}</h2>
        <p>{ready ? "A API e o banco estão prontos. Abra um módulo para começar."
          : "Inicie a API e verifique se as migrations do banco foram aplicadas."}</p>
      </div>
      <form action="/" method="get"><button type="submit">Verificar conexão ↗</button></form>
    </section>
    <div className="section-heading"><h2>Seu espaço de trabalho</h2><span>Operação local</span></div>
    <div className="modules">{modules.map(module =>
      <article className="module" key={module.number}>
        <span className="module-number">{module.number}</span><h3>{module.title}</h3>
        <p>{module.description}</p><Link className="button" href={module.href}>Abrir {module.title.toLowerCase()} →</Link>
      </article>
    )}</div>
    <p className="footnote">A coleta Shopee e o envio ao Telegram ainda dependem de integração. Os agendamentos ficam salvos sem envio automático.</p>
  </Workspace>;
}
