import { OfferList } from "@/components/offer-list";
import { Workspace } from "@/components/workspace";
export const dynamic = "force-dynamic";
export default async function Review({ searchParams }: {
  searchParams: Promise<{ page?: string; search?: string; status?: string }>;
}) {
  return <Workspace current="/revisao" title="Uma boa oferta merece revisão."
    description="Abra uma oferta para conferir os dados, aprovar ou registrar o motivo da rejeição.">
    <OfferList params={await searchParams} review />
  </Workspace>;
}
