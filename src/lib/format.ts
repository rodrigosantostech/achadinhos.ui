export const statusLabels: Record<string, string> = {
  Discovered: "A revisar", Approved: "Aprovada", Rejected: "Rejeitada",
  Simulated: "Simulada", SimulationCompleted: "Simulação concluída",
  Processing: "Em processamento", RetryScheduled: "Nova tentativa agendada", Published: "Publicada",
  UnknownDelivery: "Entrega incerta", Failed: "Falhou",
  Scheduled: "Agendada", Cancelled: "Cancelada",
};
export function money(value: number | null, currency = "BRL") {
  if (value === null) return "Preço não informado";
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency }).format(value);
}
export function date(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short", timeStyle: "short", timeZone: "America/Sao_Paulo",
  }).format(new Date(value));
}
export function safeProductUrl(value: string) {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) && !url.username && !url.password ? url.href : undefined;
  } catch { return undefined; }
}
export function pageNumber(value?: string) {
  const number = Number(value);
  return Number.isInteger(number) && number >= 1 && number <= 1000000 ? number : 1;
}
