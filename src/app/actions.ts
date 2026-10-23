"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { api } from "@/lib/workspace-api";

function text(form: FormData, name: string) { return String(form.get(name) ?? "").trim(); }
async function mutate<T>(path: string, body: unknown, failurePath: string): Promise<T> {
  let result: T | undefined;
  let message: string | undefined;
  try { result = await api<T>(path, { method: "POST", body: JSON.stringify(body) }); }
  catch (error) { message = error instanceof Error ? error.message : "Não foi possível salvar."; }
  if (message) redirect(failurePath + "?error=" + encodeURIComponent(message));
  for (const route of ["/", "/ofertas", "/revisao", "/publicacoes"]) revalidatePath(route);
  revalidatePath("/ofertas/[id]", "page");
  return result as T;
}
export async function createOffer(form: FormData) {
  const result = await mutate<{ id: string }>("/api/offers", {
    title: text(form, "title"), productUrl: text(form, "productUrl"),
    price: Number(text(form, "price")),
    originalPrice: text(form, "originalPrice") ? Number(text(form, "originalPrice")) : null,
  }, "/ofertas");
  redirect("/ofertas/" + result.id + "?notice=created");
}
export async function reviewOffer(id: string, form: FormData) {
  const path = "/ofertas/" + encodeURIComponent(id);
  await mutate("/api/offers/" + encodeURIComponent(id) + "/review", {
    decision: text(form, "decision"), reason: text(form, "reason") || null,
  }, path);
  redirect(path + "?notice=reviewed");
}
export async function scheduleOffer(id: string, form: FormData) {
  const path = "/ofertas/" + encodeURIComponent(id);
  const scheduled = new Date(text(form, "scheduledAt") + "-03:00");
  if (!Number.isFinite(scheduled.getTime())) {
    redirect(path + "?error=" + encodeURIComponent("Informe uma data e hora válidas."));
  }
  await mutate("/api/offers/" + encodeURIComponent(id) + "/schedule", {
    scheduledAt: scheduled.toISOString(),
  }, path);
  redirect("/publicacoes?notice=scheduled");
}
export async function cancelPublication(id: string) {
  await mutate("/api/publications/" + encodeURIComponent(id) + "/cancel", {}, "/publicacoes");
  redirect("/publicacoes?notice=cancelled");
}

export async function simulatePublication(id: string) {
  await mutate("/api/publications/" + encodeURIComponent(id) + "/simulate", {}, "/publicacoes");
  redirect("/publicacoes/" + encodeURIComponent(id) + "/simulacao?notice=simulated");
}