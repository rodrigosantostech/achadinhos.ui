import "server-only";

export async function isApiReady(): Promise<boolean> {
  try {
    const baseUrl = process.env.API_BASE_URL ?? "http://localhost:8080";
    const response = await fetch(new URL("/health/ready", baseUrl), {
      cache: "no-store",
      signal: AbortSignal.timeout(2500),
    });
    if (!response.ok) return false;
    const body: unknown = await response.json();
    return (
      typeof body === "object" &&
      body !== null &&
      "status" in body &&
      body.status === "ready"
    );
  } catch {
    return false;
  }
}