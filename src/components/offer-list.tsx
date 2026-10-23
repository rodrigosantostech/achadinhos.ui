import Link from "next/link";
import { api, type Offer, type Page } from "@/lib/workspace-api";
import { date, money, pageNumber, statusLabels } from "@/lib/format";
import { Feedback } from "./workspace";

export async function OfferList({ params, review = false }: {
  params: { page?: string; search?: string; status?: string }; review?: boolean;
}) {
  const page = pageNumber(params.page);
  const search = (params.search ?? "").slice(0, 200);
  const allowed = ["Discovered", "Approved", "Rejected", "Scheduled"];
  const status = allowed.includes(params.status ?? "") ? params.status! : review && params.status !== "" ? "Discovered" : "";
  const base = review ? "/revisao" : "/ofertas";
  const query = new URLSearchParams({ page: String(page), pageSize: "20", status, search });
  let data: Page<Offer> | undefined;
  let error: string | undefined;
  try { data = await api<Page<Offer>>("/api/offers?" + query); }
  catch (cause) { error = cause instanceof Error ? cause.message : "Falha ao consultar ofertas."; }
  function pageUrl(value: number) {
    return base + "?" + new URLSearchParams({ page: String(value), status, search });
  }
  return <>
    <form className="filters" method="get" action={base}>
      <label>Buscar oferta<input type="search" name="search" maxLength={200} defaultValue={search} placeholder="Título da oferta" /></label>
      <label>Situação<select name="status" defaultValue={status}>
        <option value="">Todas</option>{allowed.map(value =>
          <option key={value} value={value}>{statusLabels[value]}</option>
        )}
      </select></label>
      <button type="submit">Filtrar</button><Link className="text-link" href={base}>Limpar</Link>
    </form>
    <Feedback error={error} />
    {data && <>
      <div className="section-heading"><h2>{review ? "Ofertas para revisão" : "Catálogo de ofertas"}</h2><span>{data.total} resultado(s)</span></div>
      {data.items.length === 0
        ? <div className="empty"><h3>Nenhuma oferta por aqui.</h3><p>{search || status
          ? "Não há ofertas para os filtros selecionados." : "Cadastre a primeira oferta abaixo para iniciar o fluxo."}</p></div>
        : <div className="table-wrap"><table>
          <thead><tr><th>Oferta</th><th>Preço informado</th><th>Situação</th><th>Última observação</th><th>Ação</th></tr></thead>
          <tbody>{data.items.map(offer => <tr key={offer.id}>
            <td><Link className="text-link offer-title" href={"/ofertas/" + offer.id}>{offer.title}</Link></td>
            <td>{offer.originalPrice !== null && <del>{money(offer.originalPrice, offer.currency)}</del>}
              <strong>{money(offer.currentPrice, offer.currency)}</strong></td>
            <td><span className={"badge " + offer.status.toLowerCase()}>{statusLabels[offer.status] ?? offer.status}</span></td>
            <td>{date(offer.lastSeenAt)}</td>
            <td><Link className="text-link" href={"/ofertas/" + offer.id}>Abrir →</Link></td>
          </tr>)}</tbody>
        </table></div>}
      <nav className="pagination" aria-label="Paginação">
        {page > 1 && <Link className="button secondary" href={pageUrl(page - 1)}>Anterior</Link>}
        <span>Página {page} de {Math.max(1, Math.ceil(data.total / data.pageSize))}</span>
        {page * data.pageSize < data.total && <Link className="button secondary" href={pageUrl(page + 1)}>Próxima</Link>}
      </nav>
    </>}
  </>;
}
