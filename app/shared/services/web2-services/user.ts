const API_BASE = (import.meta as any).env?.VITE_BACKEND_URL?.replace(/\/$/, '') || 'http://localhost:3001';
const API = `${API_BASE}/api/web2`;

export type UpsertUserBody = {
  address: string;
};

export async function upsertUser(body: UpsertUserBody) {
  const res = await fetch(`${API}/users/upsert`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || 'Failed to create user');
  return data as { success: boolean; user: any };
}
