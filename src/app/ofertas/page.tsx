import { createOffer } from "@/app/actions";
import { OfferList } from "@/components/offer-list";
import { SubmitButton } from "@/components/submit-button";
import { Feedback, Workspace } from "@/components/workspace";
export const dynamic = "force-dynamic";
export default async function Offers({ searchParams }: {
  searchParams: Promise<{ page?: string; search?: string; status?: string; error?: string }>;
}) {
  const params = await searchParams;
  return <Workspace current="/ofertas" title="Boas oportunidades, organizadas."
    description="Consulte o catálogo ou cadastre uma oferta para começar a revisão.">
    <Feedback error={params.error} /><OfferList params={params} />
    <section className="panel" aria-labelledby="create-title">
      <h2 id="create-title">Cadastrar oferta</h2>
      <p className="muted">Os dados são informados por você. O cadastro manual não verifica preço ou estoque na loja.</p>
      <form action={createOffer} className="editor-form">
        <label className="full">Título<input name="title" required maxLength={1000} placeholder="Nome do produto" /></label>
        <label className="full">Link do produto<input name="productUrl" type="url" required maxLength={2048} placeholder="https://…" /></label>
        <label>Preço atual (R$)<input name="price" type="number" required min="0.01" max="9999999999999999.99" step="0.01" /></label>
        <label>Preço original (R$), opcional<input name="originalPrice" type="number" min="0.01" max="9999999999999999.99" step="0.01" /></label>
        <div className="full"><SubmitButton>Cadastrar oferta</SubmitButton></div>
      </form>
    </section>
  </Workspace>;
}
