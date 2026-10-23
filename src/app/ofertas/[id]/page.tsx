import Link from "next/link";
import { notFound } from "next/navigation";
import { reviewOffer, scheduleOffer } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import { Feedback, Workspace } from "@/components/workspace";
import { api, ApiError, type OfferDetail } from "@/lib/workspace-api";
import { date, money, safeProductUrl, statusLabels } from "@/lib/format";
export const dynamic = "force-dynamic";
export default async function Detail({ params, searchParams }: {
  params: Promise<{ id: string }>; searchParams: Promise<{ error?: string; notice?: string }>;
}) {
  const { id } = await params;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) notFound();
  const feedback = await searchParams;
  let offer: OfferDetail | undefined;
  let error: string | undefined;
  try { offer = await api<OfferDetail>("/api/offers/" + id); }
  catch (cause) {
    if (cause instanceof ApiError && cause.status === 404) notFound();
    error = cause instanceof Error ? cause.message : "Falha ao consultar oferta.";
  }
  const productUrl = offer ? safeProductUrl(offer.productUrl) : undefined;
  return <Workspace current="/ofertas" title={offer?.title ?? "Detalhes da oferta"} description="Confira as informações antes de decidir.">
    <Link className="text-link back-link" href="/ofertas">← Voltar para ofertas</Link>
    <Feedback error={feedback.error ?? error} notice={feedback.notice} />
    {offer && <>
      <section className="panel">
        <span className={"badge " + offer.status.toLowerCase()}>{statusLabels[offer.status] ?? offer.status}</span>
        <div className="price-large">{money(offer.currentPrice, offer.currency)}</div>
        {offer.originalPrice !== null && <p className="muted">Preço original informado: {money(offer.originalPrice, offer.currency)}</p>}
        <p>Origem: {offer.source}</p><p className="muted">Última observação: {date(offer.lastSeenAt)} · Estoque não verificado</p>
        {productUrl && <a className="button secondary" href={productUrl} target="_blank" rel="noopener noreferrer">Abrir produto na loja ↗</a>}
      </section>
      {["Discovered", "Approved", "Rejected"].includes(offer.status) && <section className="panel">
        <h2>Revisar oferta</h2>
        <form action={reviewOffer.bind(null, id)} className="editor-form">
          <label>Decisão<select name="decision" defaultValue={offer.status === "Approved" ? "Rejected" : "Approved"}>
            <option value="Approved">Aprovar</option><option value="Rejected">Rejeitar</option>
          </select></label>
          <label className="full">Justificativa (obrigatória ao rejeitar)<textarea name="reason" maxLength={2000} rows={3} /></label>
          <div className="full"><SubmitButton>Salvar revisão</SubmitButton></div>
        </form>
      </section>}
      {offer.status === "Approved" && <section className="panel">
        <h2>Agendar na fila local</h2>
        <p className="muted">O agendamento será salvo. Depois, use Simular agora na fila para conferir uma prévia local, sem enviar ao Telegram.</p>
        <form action={scheduleOffer.bind(null, id)} className="editor-form">
          <label>Data e hora (UTC−3, horário de Brasília)<input name="scheduledAt" type="datetime-local" required /></label>
          <div className="full"><SubmitButton>Salvar agendamento</SubmitButton></div>
        </form>
      </section>}
      {offer.status === "Scheduled" && <p className="feedback">
        Esta oferta está na fila local. <Link className="text-link" href="/publicacoes">Abrir agendamentos</Link> para consultar ou cancelar.
      </p>}
      <section className="panel"><h2>Histórico de revisão</h2>
        {offer.reviews.length === 0 ? <p className="muted">Nenhuma decisão registrada.</p>
          : <ul className="history">{offer.reviews.map((review, index) => <li key={index}>
            <strong>{statusLabels[review.decision] ?? review.decision}</strong>
            <span className="muted"> · {date(review.createdAt)} · {review.operator}</span>
            {review.reason && <p className="preserve-text">{review.reason}</p>}
          </li>)}</ul>}
      </section>
      <section className="panel"><h2>Preços observados</h2>
        <p className="muted">Até 100 observações mais recentes. Dados manuais não comprovam desconto histórico.</p>
        {offer.prices.length === 0 ? <p className="muted">Sem observações registradas.</p>
          : <ul className="history">{offer.prices.map((price, index) => <li key={index}>
            <strong>{money(price.price, price.currency)}</strong>
            <span className="muted"> · {date(price.capturedAt)} · {price.source === "manual" ? "Informado manualmente" : price.source}</span>
          </li>)}</ul>}
      </section>
    </>}
  </Workspace>;
}
