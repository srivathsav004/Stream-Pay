import { keccak256, toBytes } from 'viem';

const API_BASE = (import.meta as any).env?.VITE_BACKEND_URL?.replace(/\/$/, '') || 'http://localhost:3001';
const API = `${API_BASE}/api`;

export type ExecutePaymentRequest = {
  paymentIntent: {
    payer: `0x${string}`;
    sessionId: `0x${string}`; // bytes32
    amount: string | number; // USDC 6 decimals
    deadline: string | number;
    nonce: string | number;
    signature: string; // 0x...
  };
  serviceType: string;
  metadata?: Record<string, any>;
};

export async function getEscrowBalance(address: string) {
  const res = await fetch(`${API}/balance/${address}`);
  if (!res.ok) throw new Error('Failed to fetch balance');
  return res.json() as Promise<{ address: string; balance: string; balanceUSDC: string }>;
}

export async function getNonce(address: string) {
  const res = await fetch(`${API}/nonce/${address}`);
  if (!res.ok) throw new Error('Failed to fetch nonce');
  return res.json() as Promise<{ address: string; nonce: string }>;
}

export async function isSessionSettled(sessionIdHex: string) {
  const res = await fetch(`${API}/is-settled/${sessionIdHex}`);
  if (!res.ok) throw new Error('Failed to check session');
  return res.json() as Promise<{ sessionId: string; isSettled: boolean }>;
}

export async function executePayment(req: ExecutePaymentRequest) {
  const res = await fetch(`${API}/execute-payment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || 'Payment failed');
  return data as {
    success: boolean;
    txHash: string;
    amountUSDC: string;
  };
}

export function makeSessionId(address: string, sessionNumericId: number | string) {
  const input = `${address.toLowerCase()}-${sessionNumericId}`;
  return keccak256(toBytes(input));
}
