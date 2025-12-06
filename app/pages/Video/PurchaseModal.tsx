import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Video } from './types';
import { useToast } from '@/components/ui/use-toast';

interface PurchaseModalProps {
  video: Video | null;
  isOpen: boolean;
  balance: number;
  onClose: () => void;
  onConfirm: (video: Video) => void;
  onSettled?: () => void;
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({ video, isOpen, balance, onClose, onConfirm, onSettled }) => {
  const [submitting, setSubmitting] = React.useState(false);
  const [status, setStatus] = React.useState<string | null>(null);
  const { toast } = useToast();
  const [completed, setCompleted] = React.useState(false);
  const backend = (path: string) => `${(import.meta as any).env?.VITE_BACKEND_URL ?? 'http://localhost:3001'}/api${path}`;
  const ensureWallet = async () => {
    const eth = (window as any).ethereum;
    if (!eth) throw new Error('Wallet not found');
    const accts: string[] = await eth.request({ method: 'eth_requestAccounts' });
    const addr = accts?.[0] ?? '';
    if (!addr) throw new Error('No account');
    return addr;
  };
  const getNonce = async (addr: string) => {
    const r = await fetch(backend(`/nonce/${addr}`));
    const j = await r.json();
    return BigInt(j.nonce);
  };
  const getContractInfo = async () => {
    const r = await fetch(backend('/contract-info'));
    return await r.json();
  };
  const makeSessionId = () => {
    const bytes = new Uint8Array(32);
    crypto.getRandomValues(bytes);
    return '0x' + Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
  };
  const signIntent = async (addr: string, sessionId: string, amount: bigint, deadline: bigint, nonce: bigint) => {
    const info = await getContractInfo();
    const eth = (window as any).ethereum;
    const walletChainHex = await eth.request({ method: 'eth_chainId' });
    const walletChain = parseInt(walletChainHex, 16);
    if (info.chainId && Number(info.chainId) !== walletChain) throw new Error(`Wrong network. Switch to chain ${info.chainId}`);
    const domain = { name: info.name, version: info.version, chainId: walletChain, verifyingContract: info.contractAddress };
    const types = {
      EIP712Domain: [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'chainId', type: 'uint256' },
        { name: 'verifyingContract', type: 'address' },
      ],
      PaymentIntent: [
        { name: 'payer', type: 'address' },
        { name: 'sessionId', type: 'bytes32' },
        { name: 'amount', type: 'uint256' },
        { name: 'deadline', type: 'uint256' },
        { name: 'nonce', type: 'uint256' },
      ],
    } as const;
    const message = { payer: addr, sessionId, amount: amount.toString(), deadline: deadline.toString(), nonce: nonce.toString() } as any;
    const payload = JSON.stringify({ domain, types, primaryType: 'PaymentIntent', message });
    const signature = await eth.request({ method: 'eth_signTypedData_v4', params: [addr, payload] });
    return signature as string;
  };
  React.useEffect(() => {
    if (isOpen) {
      setSubmitting(false);
      setStatus(null);
      setCompleted(false);
    }
  }, [isOpen]);


  const afterPurchase = video ? balance - video.purchasePrice : balance;
  const breakEvenMinutes = video ? Math.ceil((video.purchasePrice / video.streamPrice) / 60) : 0;

  return (
    <AnimatePresence>
      {isOpen && video && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative bg-[#0a0a0a] border border-[#262626] rounded-lg w-full max-w-2xl max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
        <div className="flex items-center justify-between p-6 border-b border-[#262626] flex-shrink-0">
          <h2 className="text-lg font-semibold text-white">Purchase Video</h2>
          <button
            onClick={onClose}
            className="text-[#a1a1a1] hover:text-white text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {/* Video Info */}
          <div className="flex gap-4 mb-6">
            <div className="w-32 h-20 bg-[#262626] rounded overflow-hidden flex-shrink-0">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white mb-1">{video.title}</h3>
              <div className="text-sm text-[#a1a1a1]">
                Duration: {video.duration} • {video.quality}
              </div>
            </div>
          </div>

          <div className="border-t border-[#262626] pt-6 mb-6">
            <h4 className="text-sm font-semibold text-white mb-4">Purchase Details</h4>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-sm text-[#a1a1a1]">One-Time Cost:</span>
                <span className="text-sm font-semibold text-white">
                  {video.purchasePrice} USDC
                </span>
              </div>
            </div>

            <div className="mb-6">
              <div className="text-sm font-medium text-white mb-2">What You Get:</div>
              <ul className="space-y-1 text-sm text-[#a1a1a1]">
                <li>✓ Unlimited views</li>
                <li>✓ Permanent access</li>
                <li>✓ Watch anytime</li>
                <li>✓ No time limits</li>
              </ul>
            </div>

            {/* <Card className="p-3 bg-blue-600/10 border-blue-600/50 mb-6">
              <div className="text-xs text-[#a1a1a1]">
                💡 Break-even: Watch more than {breakEvenMinutes} minutes to save vs streaming
              </div>
            </Card> */}
          </div>

          <div className="border-t border-[#262626] pt-6 mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-[#a1a1a1]">Your Balance:</span>
              <span className="text-sm font-semibold text-white">{balance} USDC</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-[#a1a1a1]">After Purchase:</span>
              <span className="text-sm font-semibold text-white">{afterPurchase.toFixed(2)} USDC</span>
            </div>
          </div>

          {status && (
            <Card className="p-3 mb-4 bg-[#0a0a0a] border-[#262626]">
              <div className="text-xs text-[#a1a1a1]">{status}</div>
            </Card>
          )}
        </div>

        <div className="p-6 border-t border-[#262626] flex gap-2 flex-shrink-0">
          <Button variant="outline" size="sm" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="flex-1"
              onClick={async () => {
                try {
                  setSubmitting(true);
                  setStatus('Preparing payment...');
                  const addr = await ensureWallet();
                  const amount = BigInt(Math.ceil(video.purchasePrice * 1_000_000));
                  const nonce = await getNonce(addr);
                  const deadline = BigInt(Math.floor(Date.now() / 1000) + 10 * 60);
                  const sessionId = makeSessionId();
                  setStatus('Awaiting signature in wallet...');
                  const signature = await signIntent(addr, sessionId, amount, deadline, nonce);
                  setStatus('Submitting transaction to relayer...');
                  const body = {
                    paymentIntent: {
                      payer: addr,
                      sessionId,
                      amount: amount.toString(),
                      deadline: deadline.toString(),
                      nonce: nonce.toString(),
                      signature,
                    },
                    serviceType: 'purchase',
                    metadata: { videoId: video.id, title: video.title },
                  };
                  const resp = await fetch(backend('/execute-payment'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
                  if (!resp.ok) {
                    const err = await resp.json().catch(() => ({}));
                    throw new Error(err?.error || 'Purchase failed');
                  }
                  const data = await resp.json().catch(() => ({}));
                  // Record purchase in Web2 API (best effort)
                  try {
                    const { recordVideoPurchase } = await import('@/app/shared/services/web2-services/video');
                    await recordVideoPurchase({
                      user_address: addr,
                      video_id: video.catalogId,
                      url: video.sourceUrl,
                      amount_usdc: video.purchasePrice,
                      tx_hash: data?.txHash || data?.tx_hash || ''
                    });
                  } catch {}
                  setStatus('Transaction confirmed. Finalizing...');
                  toast({
                    title: "Purchase successful",
                    description: `Purchase processed successfully • ${video.purchasePrice} USDC`,
                  });
                  setCompleted(true);
                  onConfirm(video);
                  try { onSettled && onSettled(); } catch {}
                  setTimeout(() => { 
                    onClose(); 
                    setSubmitting(false);
                    setStatus(null);
                    setCompleted(false);
                  }, 1500);
                } catch (e: any) {
                  const errorMsg = e?.message || 'Purchase failed';
                  setStatus(errorMsg);
                  toast({
                    title: "Purchase failed",
                    description: errorMsg,
                    variant: "destructive",
                  });
                } finally {
                  setSubmitting(false);
                }
              }}
              disabled={balance < video.purchasePrice || submitting || completed}
            >
              {submitting ? 'Processing...' : `Confirm Purchase - ${video.purchasePrice} USDC`}
            </Button>
        </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PurchaseModal;

