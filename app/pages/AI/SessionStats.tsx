import React from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Separator from '@/components/ui/Separator';
import { ChatSession } from './types';
import { useAccount, useSignTypedData } from 'wagmi';
import { avalancheFuji } from 'wagmi/chains';
import { formatUnits, parseUnits } from 'viem';
import { executePayment, getNonce, makeSessionId } from '@/app/shared/services/streampayApi';
import { record as recordUsage } from '@/app/shared/services/web2-services/ai';
import { STREAMPAY_ESCROW_ADDRESS } from '@/app/shared/contracts/config';
import { useReadContract } from 'wagmi';
import { STREAMPAY_ESCROW_ABI } from '@/app/shared/contracts/streampayEscrow';
import { useToast } from '@/components/ui/use-toast';

interface SessionStatsProps {
  session: ChatSession;
  balance: number; // fallback, dynamic balance will override if available
  onNewSession: () => void;
  onExportChat: () => void; // deprecated in UI, kept for type compatibility
  onClearChat: () => void;
  onSaveConversation: () => void;
  onDeposit: () => void;
  onSettledChange?: (settled: boolean) => void;
  onAfterSettle?: () => void | Promise<void>;
}

const SessionStats: React.FC<SessionStatsProps> = ({
  session,
  balance,
  onNewSession,
  onExportChat,
  onClearChat,
  onSaveConversation,
  onDeposit,
  onSettledChange,
  onAfterSettle,
}) => {
  const { address, chainId } = useAccount();
  const { signTypedDataAsync } = useSignTypedData();

  const { data: escrowBalanceData, refetch: refetchEscrow } = useReadContract({
    address: STREAMPAY_ESCROW_ADDRESS || undefined,
    abi: STREAMPAY_ESCROW_ABI,
    functionName: 'getBalance',
    args: address ? [address] : undefined,
    chainId: avalancheFuji.id,
    query: { enabled: !!address && !!STREAMPAY_ESCROW_ADDRESS },
  });
  const [settling, setSettling] = React.useState(false);
  const [settled, setSettled] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('');
  const { toast } = useToast();

  // Reset local settled state when a new UI session starts
  React.useEffect(() => {
    setSettled(false);
    setErrorMsg('');
  }, [session.sessionNumber]);

  const displayBalance = escrowBalanceData != null ? Number(escrowBalanceData as bigint) / 1e6 : balance;
  const callsRemaining = Math.floor((displayBalance || 0) / 0.01);

  const escrowAddress = STREAMPAY_ESCROW_ADDRESS;

  const handleSettle = async () => {
    setErrorMsg('');
    try {
      if (!address) throw new Error('Connect wallet');
      if (!escrowAddress) throw new Error('Escrow not configured');
      if (chainId !== avalancheFuji.id) throw new Error('Switch to Avalanche Fuji');

      const amountUSDC = session.cost; // already in USDC
      if (!amountUSDC || amountUSDC <= 0) throw new Error('Nothing to settle');

      setSettling(true);

      // Prepare EIP-712 typed data
      // Generate a unique on-chain payment session id per settlement (do not reuse UI session id)
      const uniqueNumeric = Date.now().toString();
      const sessionId = makeSessionId(address, uniqueNumeric) as `0x${string}`;
      const { nonce } = await getNonce(address);
      const amount = parseUnits(amountUSDC.toString(), 6);
      const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 10); // +10 min

      const domain = {
        name: 'StreamPay',
        version: '1',
        chainId: avalancheFuji.id,
        verifyingContract: escrowAddress,
      } as const;

      const types = {
        PaymentIntent: [
          { name: 'payer', type: 'address' },
          { name: 'sessionId', type: 'bytes32' },
          { name: 'amount', type: 'uint256' },
          { name: 'deadline', type: 'uint256' },
          { name: 'nonce', type: 'uint256' },
        ],
      } as const;

      const value = {
        payer: address,
        sessionId,
        amount,
        deadline,
        nonce: BigInt(nonce),
      } as const;

      const signature = await signTypedDataAsync({ account: address, domain, types, primaryType: 'PaymentIntent', message: value });

      // Call backend to execute payment (server pays gas)
      const paymentRes = await executePayment({
        paymentIntent: {
          payer: address,
          sessionId,
          amount: amount.toString(),
          deadline: deadline.toString(),
          nonce: nonce.toString(),
          signature,
        },
        serviceType: 'ai_session',
        metadata: {
          calls: session.calls,
          costUSDC: amountUSDC,
        },
      });

      // Persist a finalized usage record (calls, amount, tx) after successful tx
      if (paymentRes?.txHash) {
        try {
          await recordUsage({
            user_address: address,
            calls_count: session.calls,
            amount_usdc: amountUSDC,
            tx_hash: paymentRes.txHash,
          });
        } catch (e) {
          // eslint-disable-next-line no-console
          console.warn('Failed to record usage', e);
        }
      }

      setSettled(true);
      onSettledChange?.(true);
      try { await onAfterSettle?.(); } catch {}
      await refetchEscrow();
      toast({
        title: "Session settled",
        description: `Settled ${amountUSDC.toFixed(4)} USDC successfully`,
      });
    } catch (e: any) {
      const errorMsg = e?.message || 'Failed to settle';
      setErrorMsg(errorMsg);
      toast({
        title: "Settlement failed",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setSettling(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Session */}
      <Card className="p-6">
        <h3 className="text-base font-semibold text-white mb-6">Current Session</h3>
        
        <div className="space-y-6">
          <div>
            <div className="text-xs text-[#a1a1a1] uppercase mb-1">Status</div>
            <div className="text-sm font-medium text-white">{settled ? 'Settled' : 'Active'}</div>
          </div>
          
          <Separator />
          
          <div>
            <div className="text-xs text-[#a1a1a1] uppercase mb-1">Calls This Session</div>
            <div className="text-2xl font-semibold text-white font-mono">{session.calls}</div>
          </div>
          
          <Separator />
          
          <div>
            <div className="text-xs text-[#a1a1a1] uppercase mb-1">Cost This Session</div>
            <div className="text-2xl font-semibold text-white font-mono">{session.cost} USDC</div>
            {/* <div className="text-sm text-[#a1a1a1]">${(session.cost * 40).toFixed(2)} USD</div> */}
          </div>
          
          <Separator />
          
          <div>
            <div className="text-xs text-[#a1a1a1] uppercase mb-1">Remaining Balance</div>
            <div className="text-2xl font-semibold text-white font-mono">{(displayBalance || 0).toFixed(3)} USDC</div>
            <div className="text-sm text-[#a1a1a1]">~{callsRemaining} calls left</div>
          </div>
          
          <Separator />
          
          <div className="flex flex-col gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={handleSettle}
              disabled={settling || settled || !address}
            >
              {settling ? 'Settling…' : settled ? 'Settled' : 'Settle This Session'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onNewSession}
              disabled={!settled}
            >
              New Session
            </Button>
            {errorMsg && <div className="text-xs text-red-500">{errorMsg}</div>}
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      {/* <Card className="p-6">
        <h3 className="text-base font-semibold text-white mb-4">Quick Actions</h3>
        <div className="space-y-2">
          <Button variant="outline" size="sm" className="w-full" onClick={onClearChat}>
            Clear Chat
          </Button>
          <Button variant="outline" size="sm" className="w-full" onClick={onSaveConversation}>
            Save Conversation
          </Button>
          <Button variant="primary" size="sm" className="w-full" onClick={onDeposit}>
            Deposit USDC
          </Button>
        </div>
      </Card> */}

      {/* Recent Topics */}
      {/* <Card className="p-6">
        <h3 className="text-base font-semibold text-white mb-4">Recent Topics</h3>
        <div className="space-y-2">
          {session.topics.length > 0 ? (
            session.topics.map((topic, index) => (
              <div key={index} className="text-sm text-[#a1a1a1]">
                • {topic}
              </div>
            ))
          ) : (
            <div className="text-sm text-[#a1a1a1]">No topics yet</div>
          )}
        </div>
        <Button variant="ghost" size="sm" className="mt-4 w-full">
          View All Topics →
        </Button>
      </Card> */}
    </div>
  );
};

export default SessionStats;

