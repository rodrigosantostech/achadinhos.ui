import "server-only";

export class ApiError extends Error {
  constructor(public status: number, message: string) { super(message); }
}
export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(new URL(path, process.env.API_BASE_URL ?? "http://localhost:8080"), {
      ...options, headers: { "Content-Type": "application/json", ...options.headers },
      cache: "no-store", signal: AbortSignal.timeout(8000),
    });
  } catch { throw new ApiError(503, "Não foi possível conectar à API. Verifique se ela está iniciada."); }
  if (!response.ok) {
    let message = response.status === 401 || response.status === 403
      ? "Acesso local indisponível. Inicie a API pelo script scripts/dev.ps1 -Target Api."
      : "Não foi possível concluir a operação. Verifique a API, o banco e as migrations.";
    try {
      const body = await response.json();
      if (response.status >= 400 && response.status < 500 && typeof body.detail === "string") message = body.detail;
    } catch { /* Fallback for responses without JSON. */ }
    throw new ApiError(response.status, message);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
export type Offer = {
  id: string; title: string; currency: string; currentPrice: number | null;
  originalPrice: number | null; productUrl: string; lastSeenAt: string; status: string;
};
export type OfferDetail = Offer & {
  source: string; availability: string;
  prices: { price: number; currency: string; source: string; capturedAt: string }[];
  reviews: { decision: string; reason: string | null; operator: string; createdAt: string }[];
};
export type Page<T> = { items: T[]; page: number; pageSize: number; total: number };
export type Publication = {
  id: string; offerId: string; title: string; status: string; scheduledAt: string; createdAt: string; canSimulate: boolean;
};

export type PublicationSimulation = {
  id: string; publicationId: string; simulatedAt: string; operator: string;
  previewText: string; productUrl: string; mode: "Simulation"; telegramSent: false;
};