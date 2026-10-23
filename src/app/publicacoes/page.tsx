import Link from "next/link";
import { cancelPublication, simulatePublication } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import { Feedback, Workspace } from "@/components/workspace";
import { api, type Page, type Publication } from "@/lib/workspace-api";
import { date, pageNumber, statusLabels } from "@/lib/format";
export const dynamic = "force-dynamic";
type PublicationPage = Page<Publication> & { simulationEnabled: boolean; deliveryEnabled: boolean };

export default async function Publications({ searchParams }: {
  searchParams: Promise<{ page?: string; error?: string; notice?: string }>;
}) {
  const params = await searchParams;
  const page = pageNumber(params.page);
  let data: PublicationPage | undefined;
  let error: string | undefined;
  try { data = await api<PublicationPage>("/api/publications?page=" + page + "&pageSize=20"); }
  catch (cause) { error = cause instanceof Error ? cause.message : "Falha ao consultar fila."; }
  return <Workspace current="/publicacoes" title="Sua fila de publicações." description="Acompanhe os agendamentos e ensaie uma publicação local.">
    <Feedback error={params.error ?? error} notice={params.notice} />
    <p className="feedback simulation-notice"><strong>Envio real desativado.</strong>{" "}
      {data?.simulationEnabled
        ? "Use Simular agora para conferir o conteúdo sem acessar o Telegram, mesmo antes do horário agendado."
        : "A simulação local precisa estar habilitada na API de desenvolvimento."}
      {" "}Resultados simulados ficam identificados e não comprovam entrega.
    </p>
    {data && <>
      <div className="section-heading"><h2>Agendamentos e simulações</h2><span>{data.total} registro(s)</span></div>
      {data.items.length === 0 ? <div className="empty"><h3>Sua fila está vazia.</h3>
        <p>Aprove uma oferta e escolha uma data no detalhe dela. Depois, volte para simular a publicação.</p>
        <Link className="text-link" href="/revisao">Abrir revisão →</Link>
      </div> : <div className="table-wrap"><table>
        <thead><tr><th>Oferta</th><th>Agendada para (Brasília)</th><th>Situação</th><th>Ação</th></tr></thead>
        <tbody>{data.items.map(item => <tr key={item.id}>
          <td><Link className="text-link offer-title" href={"/ofertas/" + item.offerId}>{item.title}</Link></td>
          <td>{date(item.scheduledAt)}</td>
          <td><span className={"badge " + item.status.toLowerCase()}>{statusLabels[item.status] ?? item.status}</span>
            {item.status === "Simulated" && <p className="muted">Sem envio ao Telegram</p>}
          </td>
          <td><div className="publication-actions">
            {data.simulationEnabled && item.canSimulate && <form action={simulatePublication.bind(null, item.id)}>
              <SubmitButton>Simular agora</SubmitButton>
            </form>}
            {item.status === "Simulated" && <Link className="text-link" href={"/publicacoes/" + item.id + "/simulacao"}>Ver simulação →</Link>}
            {["Scheduled", "RetryScheduled"].includes(item.status) && <form action={cancelPublication.bind(null, item.id)}>
              <SubmitButton className="secondary">Cancelar agendamento</SubmitButton>
            </form>}
          </div></td>
        </tr>)}</tbody>
      </table></div>}
      <nav className="pagination" aria-label="Paginação">
        {page > 1 && <Link className="button secondary" href={"/publicacoes?page=" + (page - 1)}>Anterior</Link>}
        <span>Página {page} de {Math.max(1, Math.ceil(data.total / data.pageSize))}</span>
        {page * data.pageSize < data.total && <Link className="button secondary" href={"/publicacoes?page=" + (page + 1)}>Próxima</Link>}
      </nav>
    </>}
  </Workspace>;
}
