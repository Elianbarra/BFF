import { ApiError } from "./api-error";

const baseHeaders: HeadersInit = { "Content-Type": "application/json" };

async function handleResponse<T>(res: Response, context: string): Promise<T> {
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new ApiError(res.status, `${context} failed with status ${res.status}`, data);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export async function httpGet<T>(url: string, headers?: HeadersInit): Promise<T> {
  const res = await fetch(url, { headers, cache: "no-store" });
  return handleResponse<T>(res, `GET ${url}`);
}

export async function httpPost<T>(url: string, body: unknown, headers?: HeadersInit): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { ...baseHeaders, ...headers },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  return handleResponse<T>(res, `POST ${url}`);
}

export async function httpPut<T>(url: string, body: unknown, headers?: HeadersInit): Promise<T> {
  const res = await fetch(url, {
    method: "PUT",
    headers: { ...baseHeaders, ...headers },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  return handleResponse<T>(res, `PUT ${url}`);
}

export async function httpDelete(url: string, headers?: HeadersInit): Promise<void> {
  const res = await fetch(url, { method: "DELETE", headers, cache: "no-store" });
  return handleResponse<void>(res, `DELETE ${url}`);
}
