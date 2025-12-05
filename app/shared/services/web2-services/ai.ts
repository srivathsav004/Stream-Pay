const API_BASE = (import.meta as any).env?.VITE_BACKEND_URL?.replace(/\/$/, '') || 'http://localhost:3001';
const WEB2 = `${API_BASE}/api/web2/ai`;

export async function startSession(user_address: string) {
  const res = await fetch(`${WEB2}/session/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_address }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || 'Failed to start session');
  return data.session as {
    id: number;
    user_address: string;
    calls_count: number;
    amount_usdc: number;
    tx_hash: string | null;
    created_at: string;
  };
}

export async function chat(params: { session_id: number; user_address: string; message: string }) {
  const res = await fetch(`${WEB2}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || 'Chat failed');
  return data as {
    success: boolean;
    reply: string;
    cost: number;
    session: { id: number; calls_count: number; amount_usdc: number };
  };
}

export async function settleSession(params: { session_id: number; user_address: string; tx_hash: string }) {
  const res = await fetch(`${WEB2}/session/settle`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || 'Failed to mark session settled');
  return data.session as {
    id: number;
    tx_hash: string;
  };
}

export async function getStats(user_address: string) {
  const res = await fetch(`${WEB2}/stats?user_address=${encodeURIComponent(user_address)}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || 'Failed to fetch stats');
  return data as { totalCalls: number; totalSpent: number; avgPerCall: number; thisMonth: number };
}

export type HistoryItem = { id: string; sessionNumber: number; date: string; calls: number; cost: number; txHash?: string | null };
export async function getHistory(user_address: string) {
  const res = await fetch(`${WEB2}/history?user_address=${encodeURIComponent(user_address)}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || 'Failed to fetch history');
  return data.history as HistoryItem[];
}

export async function getCost(user_address: string) {
  const res = await fetch(`${WEB2}/cost?user_address=${encodeURIComponent(user_address)}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || 'Failed to fetch cost');
  return data as {
    thisWeek: { cost: number; calls: number; sessions: number };
    thisMonth: { cost: number; calls: number; sessions: number };
    avgCostPerSession: number;
    avgCallsPerDay: number;
  };
}

export async function record(params: { user_address: string; calls_count: number; amount_usdc: number; tx_hash: string; details?: any }) {
  const res = await fetch(`${WEB2}/record`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || 'Failed to record usage');
  return data.record as { id: number; created_at: string };
}
