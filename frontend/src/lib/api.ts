const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}/api${path}`, {
    headers: { "Content-Type": "application/json", ...init?.headers },
    ...init,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(err.message ?? "Request failed");
  }
  return res.json();
}

export const auth = {
  register: (data: { email: string; password: string; name?: string }) =>
    request<{ access_token: string; user: { id: string; email: string; name: string } }>(
      "/auth/register",
      { method: "POST", body: JSON.stringify(data) }
    ),
  login: (data: { email: string; password: string }) =>
    request<{ access_token: string; user: { id: string; email: string; name: string } }>(
      "/auth/login",
      { method: "POST", body: JSON.stringify(data) }
    ),
};
