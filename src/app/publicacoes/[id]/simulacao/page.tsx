import Link from "next/link";
import { notFound } from "next/navigation";
import { Feedback, Workspace } from "@/components/workspace";
import { api, ApiError, type PublicationSimulation } from "@/lib/workspace-api";
import { date, safeProductUrl } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function Simulation({ params, searchParams }: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ notice?: string }>;
}) {
  const { id } = await params;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) notFound();
  const feedback = await searchParams;
  let result: PublicationSimulation | undefined;
  let error: string | undefined;
  try { result = await api<PublicationSimulation>("/api/publications/" + id + "/simulation"); }
  catch (cause) {
    if (cause instanceof ApiError && cause.status === 404) notFound();
    error = cause instanceof Error ? cause.message : "Falha ao consultar a simulação.";
  }
  const productUrl = result ? safeProductUrl(result.productUrl) : undefined;
  return <Workspace current="/publicacoes" title="Prévia da publicação." description="Confira o conteúdo do ensaio local.">
    <Link className="text-link back-link" href="/publicacoes">← Voltar para publicações</Link>
    <Feedback error={error} notice={feedback.notice} />
    {result && <>
      <p className="feedback simulation-notice" role="status"><strong>Simulação local · nenhuma mensagem enviada.</strong><br />
        Este resultado não comprova entrega ao Telegram, estoque ou validade de um link afiliado.
      </p>
      <section className="simulation-layout">
        <div className="message-preview" aria-label="Prévia de texto, sem envio ao Telegram">
          <div className="message-heading">PRÉVIA LOCAL</div>
          <p className="preserve-text">{result.previewText}</p>
          {productUrl && <a className="button secondary preview-product" href={productUrl}
            target="_blank" rel="noopener noreferrer">Ver produto ↗</a>}
        </div>
        <div className="panel simulation-details">
          <h2>Registro da simulação</h2>
          <p><span className="badge simulated">Simulada · sem envio</span></p>
          <p>Realizada em {date(result.simulatedAt)}</p>
          <p className="muted">Operador: {result.operator}</p>
          <p className="muted">Não foi gerado ID de mensagem do Telegram. A oferta voltou para aprovada e pode ser agendada novamente.</p>
          <p className="muted">A simulação é manual e pode ocorrer antes do horário agendado. Ela não habilita publicações reais.</p>
          <p className="muted">Referência: {result.publicationId}</p>
          <Link className="text-link" href="/ofertas">Abrir ofertas →</Link>
        </div>
      </section>
    </>}
  </Workspace>;
}
