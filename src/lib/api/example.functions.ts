// AFIOS backend API helper.
// Uses fetch() against the FastAPI MVP. No new dependencies.
// Safe to import from client components (no server-only imports).

const AFIOS_BASE_URL =
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_AFIOS_API_URL) ||
  "http://127.0.0.1:8000";

const TOKEN_KEY = "afios_jwt";

export function getToken(): string | null {
  try {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string | null) {
  try {
    if (typeof window === "undefined") return;
    if (token) window.localStorage.setItem(TOKEN_KEY, token);
    else window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
}

export class AfiosApiError extends Error {
  status: number;
  payload?: unknown;
  constructor(message: string, status: number, payload?: unknown) {
    super(message);
    this.status = status;
    this.payload = payload;
  }
}

async function request<T>(
  path: string,
  opts: { method?: string; body?: unknown; auth?: boolean; timeoutMs?: number } = {},
): Promise<T> {
  const { method = "GET", body, auth = false, timeoutMs = 8000 } = opts;
  const url = `${AFIOS_BASE_URL}${path}`;

  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (auth) {
    const t = getToken();
    if (t) headers["Authorization"] = `Bearer ${t}`;
  }

  const controller =
    typeof AbortController !== "undefined" ? new AbortController() : null;
  const timer = controller
    ? setTimeout(() => controller.abort(), timeoutMs)
    : null;

  if (import.meta.env?.DEV) {
    // eslint-disable-next-line no-console
    console.debug("[AFIOS] →", method, url);
  }

  let res: Response;
  try {
    res = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller?.signal,
    });
  } catch (err: any) {
    if (timer) clearTimeout(timer);
    // eslint-disable-next-line no-console
    console.error("[AFIOS] ✕ network", url, err);
    throw new AfiosApiError(
      err?.name === "AbortError" ? "Request timed out" : "Network error",
      0,
    );
  } finally {
    if (timer) clearTimeout(timer);
  }

  let payload: any = null;
  const text = await res.text();
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = text;
    }
  }

  if (!res.ok) {
    if (res.status === 401 && auth) setToken(null);
    // eslint-disable-next-line no-console
    console.error("[AFIOS] ✕", res.status, url);
    const msg =
      (payload && (payload.detail || payload.message)) ||
      `Request failed (${res.status})`;
    throw new AfiosApiError(
      typeof msg === "string" ? msg : JSON.stringify(msg),
      res.status,
      payload,
    );
  }

  if (import.meta.env?.DEV) {
    // eslint-disable-next-line no-console
    console.debug("[AFIOS] ←", res.status, url);
  }
  return payload as T;
}

// ---- Endpoints ----

export interface LoginResponse {
  access_token: string;
  token_type?: string;
}

export async function login(
  username: string,
  password: string,
): Promise<LoginResponse> {
  const data = await request<LoginResponse>("/api/v1/auth/login", {
    method: "POST",
    body: { username, password },
  });
  if (data?.access_token) setToken(data.access_token);
  return data;
}

export async function healthCheck(): Promise<{ status?: string } & Record<string, unknown>> {
  return request("/health");
}

export interface ScoringTransaction {
  transaction_id: string;
  customer_id: string;
  amount: number;
  currency: string;
  merchant: string;
  mcc: string;
  country: string;
  device_id: string;
  ip: string;
  channel: string;
  timestamp: string;
}

export async function predictFraud<T = any>(
  transaction: ScoringTransaction,
  features: Record<string, unknown> = {},
): Promise<T> {
  return request<T>("/scoring/predict", {
    method: "POST",
    body: { transaction, features },
    auth: true,
  });
}

export async function explainFraud<T = any>(
  transaction: ScoringTransaction,
  model_score: number,
  features: Record<string, unknown> = {},
): Promise<T> {
  return request<T>("/explainability/explain", {
    method: "POST",
    body: { transaction, features, model_score },
    auth: true,
  });
}
