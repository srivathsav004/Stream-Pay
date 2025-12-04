const API_BASE = (import.meta as any).env?.VITE_BACKEND_URL?.replace(/\/$/, '') || 'http://localhost:3001';
const API = `${API_BASE}/api/web2`;

export type CatalogVideo = {
  id: number;
  url: string;
  duration_seconds: number;
  active: boolean;
};

export async function fetchCatalogVideos() {
  const res = await fetch(`${API}/videos`);
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || 'Failed to load videos');
  return (data.videos || []) as CatalogVideo[];
}

export async function recordStreamSession(body: {
  user_address: string;
  video_id?: number;
  url?: string;
  seconds_streamed?: number;
  amount_usdc?: number;
  tx_hash?: string;
}) {
  const res = await fetch(`${API}/video-stream-sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || 'Failed to record stream');
  return data;
}

export async function recordVideoPurchase(body: {
  user_address: string;
  video_id?: number;
  url?: string;
  amount_usdc: number;
  tx_hash: string;
}) {
  const res = await fetch(`${API}/video-purchases`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || 'Failed to record purchase');
  return data;
}

export async function fetchUserPurchases(address: string) {
  const res = await fetch(`${API}/users/${address}/purchases`);
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || 'Failed to load purchases');
  return data.purchases as Array<{
    id: number;
    user_address: string;
    video_id: number;
    amount_usdc: number;
    tx_hash: string;
    purchased_at: string;
    video?: { id: number; url: string; duration_seconds: number; active: boolean } | null;
  }>;
}
