// web2-services/transactions.ts
const RAW_BASE = (import.meta as any).env?.VITE_BACKEND_URL?.replace(/\/$/, '') || 'http://localhost:3001';
const API = `${RAW_BASE}/api/web2`;

export type ServiceType = 'video_stream' | 'video_purchase' | 'api_session' | 'storage' | 'deposit' | 'withdraw';

export interface TxRow {
  id: number;
  user_id: number;
  service: ServiceType;
  ref_id?: number | null;
  amount_usdc?: number | null;
  tx_hash?: string | null;
  created_at: string;
}

export async function listTransactions(params: {
  user_address: string;
  page?: number;
  page_size?: number;
  sort?: 'recent' | 'oldest';
}): Promise<{ items: TxRow[]; total: number; page: number; page_size: number }> {
  const { user_address, page = 1, page_size = 10, sort = 'recent' } = params;
  const body = { user_address, page, page_size, sort };
  const res = await fetch(`${API}/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || 'Failed to fetch transactions');
  return data as { items: TxRow[]; total: number; page: number; page_size: number };
}

export async function recordDepositTx(params: {
  user_address: string;
  amount_usdc: number;
  tx_hash: string;
  ref_id?: number;
}) {
  const res = await fetch(`${API}/transactions/deposit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || 'Failed to record deposit transaction');
  return data;
}

export async function recordWithdrawTx(params: {
  user_address: string;
  amount_usdc: number;
  tx_hash: string;
  ref_id?: number;
}) {
  const res = await fetch(`${API}/transactions/withdraw`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || 'Failed to record withdraw transaction');
  return data;
}

