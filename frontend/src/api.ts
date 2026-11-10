/**
 * Deux helpers pour parler à l'API, qui remontent une vraie erreur quand le
 * serveur répond autre chose qu'un 2xx (`fetch` ne le fait pas tout seul).
 */

async function readError(response: Response): Promise<never> {
  const body = await response.json().catch(() => null);
  const message =
    body && typeof body === "object" && "error" in body
      ? String(body.error)
      : `${response.status} ${response.statusText}`;
  throw new Error(message);
}

export async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) await readError(response);
  return (await response.json()) as T;
}

export async function sendJson<T>(
  url: string,
  method: "POST" | "PUT" | "DELETE",
  body?: unknown,
): Promise<T> {
  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!response.ok) await readError(response);
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}
