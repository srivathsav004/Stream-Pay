import { createPublicClient, http, getAddress } from 'viem';
import { CHAIN, STREAMPAY_ESCROW_ADDRESS } from './config';
import { STREAMPAY_ESCROW_ABI } from './streampayEscrow';

export async function readEscrowBalance(address: string): Promise<number> {
  const client: any = createPublicClient({ chain: CHAIN as any, transport: http() as any });
  const user = getAddress(address);
  const balance: bigint = await (client as any).readContract({
    address: STREAMPAY_ESCROW_ADDRESS as any,
    abi: STREAMPAY_ESCROW_ABI as any,
    functionName: 'getBalance',
    args: [user],
  });
  const n = Number(balance) / 1_000_000;
  return Number.isFinite(n) ? n : 0;
}
