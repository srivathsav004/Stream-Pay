import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Video } from './types';
 
import PurchaseModal from './PurchaseModal';
import StreamModal from './StreamModal';
import { readEscrowBalance } from '@/app/shared/contracts/balance';

interface AvailableVideosProps {
  videos: Video[];
  onStream: (video: Video) => void;
  onPurchase: (video: Video) => void; // open purchase modal (parent usage elsewhere)
  onPurchased?: (video: Video) => void; // notified after successful purchase
  hiddenIds?: string[];
}

const AvailableVideos: React.FC<AvailableVideosProps> = ({ videos, onStream, onPurchase, onPurchased, hiddenIds = [] }) => {
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [purchaseVideo, setPurchaseVideo] = useState<Video | null>(null);
  const [streamVideo, setStreamVideo] = useState<Video | null>(null);

  

  const backend = (path: string) => `${(import.meta as any).env?.VITE_BACKEND_URL ?? 'http://localhost:3001'}/api${path}`;

  const ensureWallet = async () => {
    const eth = (window as any).ethereum;
    if (!eth) throw new Error('Wallet not found');
    const accts: string[] = await eth.request({ method: 'eth_requestAccounts' });
    const addr = accts?.[0] ?? '';
    if (!addr) throw new Error('No account');
    setAddress(addr);
    return addr;
  };

  const refreshBalance = async (addr: string) => {
    try {
      const val = await readEscrowBalance(addr);
      setBalance(val);
    } catch {}
  };

  const calcCostMicros = (seconds: number, rate: number) => {
    const usdc = seconds * rate;
    return BigInt(Math.ceil(usdc * 1_000_000));
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

  const signIntent = async (addr: string, sessionId: string, amount: bigint, deadline: bigint, nonce: bigint) => {
    const info = await getContractInfo();
    const eth = (window as any).ethereum;
    const walletChainHex = await eth.request({ method: 'eth_chainId' });
    const walletChain = parseInt(walletChainHex, 16);
    if (info.chainId && Number(info.chainId) !== walletChain) {
      throw new Error(`Wrong network. Switch to chain ${info.chainId}`);
    }
    const domain = {
      name: info.name,
      version: info.version,
      chainId: walletChain,
      verifyingContract: info.contractAddress,
    };
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
    const message = {
      payer: addr,
      sessionId,
      amount: amount.toString(),
      deadline: deadline.toString(),
      nonce: nonce.toString(),
    } as any;
    const payload = JSON.stringify({ domain, types, primaryType: 'PaymentIntent', message });
    const signature = await eth.request({
      method: 'eth_signTypedData_v4',
      params: [addr, payload],
    });
    return signature as string;
  };

  const makeSessionId = () => {
    const bytes = new Uint8Array(32);
    crypto.getRandomValues(bytes);
    return '0x' + Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
  };

  const startStream = async (video: Video) => {
    const addr = await ensureWallet();
    await refreshBalance(addr);
    setStreamVideo(video);
  };

  

  const openPurchase = async (video: Video) => {
    const addr = await ensureWallet();
    await refreshBalance(addr);
    setPurchaseVideo(video);
  };

  const list = (videos && videos.length > 0 ? videos : []).filter(v => !hiddenIds.includes(v.id));
  const calculateStreamCost = (duration: string, rate: number): number => {
    const parts = duration.split(':').map((n) => Number(n));
    let totalSeconds = 0;
    if (parts.length === 3) {
      const [h, m, s] = parts;
      totalSeconds = h * 3600 + m * 60 + s;
    } else if (parts.length === 2) {
      const [m, s] = parts;
      totalSeconds = m * 60 + s;
    }
    return totalSeconds * rate;
  };

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-white mb-6">Available Videos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading && list.length === 0 && Array.from({ length: 4 }).map((_, i) => (
          <Card key={`skeleton-${i}`} className="overflow-hidden">
            <div className="aspect-video bg-[#262626] animate-pulse" />
            <div className="p-4">
              <div className="h-4 bg-[#262626] rounded w-3/4 mb-2 animate-pulse" />
              <div className="h-3 bg-[#262626] rounded w-1/2 mb-4 animate-pulse" />
              <div className="space-y-2">
                <div className="h-8 bg-[#0a0a0a] border border-[#262626] rounded animate-pulse" />
                <div className="h-20 bg-[#0a0a0a] border border-[#262626] rounded animate-pulse" />
              </div>
            </div>
          </Card>
        ))}
        {!loading && list.length === 0 && (
          <Card className="col-span-full p-8 text-center border-dashed">
            <div className="text-4xl mb-2">🎞️</div>
            <div className="text-white font-medium mb-1">No videos available</div>
            <div className="text-sm text-[#a1a1a1] mb-4">Check back later or add new content.</div>
          </Card>
        )}
        {list.map((video) => {
          const streamCost = calculateStreamCost(video.duration, video.streamPrice);
          return (
            <Card key={video.id} className="overflow-hidden hover:border-blue-600">
              <div
                className="relative aspect-video bg-[#262626] cursor-pointer group"
                onClick={() => startStream(video)}
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 text-xs text-white bg-black/70 px-2 py-1 rounded">
                  {video.duration}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-sm font-medium text-white mb-1">{video.title}</h3>
                <div className="text-[11px] text-[#8a8a8a] mb-1 font-mono">
                  ID: {video.id} {video.catalogId != null && (
                    <span className="ml-2">• Catalog #{video.catalogId}</span>
                  )}
                </div>
                <div className="text-xs text-[#a1a1a1] mb-4">
                  {video.duration} • {video.quality}
                </div>
                {/* Stream Option */}
                <Card className="p-3 mb-3 bg-[#0a0a0a] border-[#262626]">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">🎬</span>
                    <span className="text-sm font-medium text-white">Stream</span>
                  </div>
                  <div className="text-xs text-[#a1a1a1] mb-1">
                    {video.streamPrice} USDC/sec
                  </div>
                  <div className="text-xs text-[#a1a1a1] mb-1">
                    ~{streamCost.toFixed(4)} USDC total
                  </div>
                  {/* <div className="text-xs text-[#a1a1a1] mb-3">Escrow Balance: {balance.toFixed(2)} USDC</div> */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => startStream(video)}
                  >
                    Stream Now
                  </Button>
                </Card>

                {/* Purchase Option */}
                <Card className="p-3 bg-[#0a0a0a] border-[#262626]">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">💎</span>
                    <span className="text-sm font-medium text-white">Buy Once</span>
                  </div>
                  <div className="text-xs text-[#a1a1a1] mb-1">
                    {video.purchasePrice} USDC
                  </div>
                  <div className="text-xs text-[#a1a1a1] mb-3">
                    Own forever
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full"
                    onClick={() => openPurchase(video)}
                  >
                    Buy Now
                  </Button>
                </Card>
              </div>
            </Card>
          );
        })}
      </div>
      <PurchaseModal
        video={purchaseVideo}
        isOpen={!!purchaseVideo}
        balance={balance}
        onClose={() => setPurchaseVideo(null)}
        onConfirm={async (v) => {
          // refresh and notify parent that purchase completed
          if (address) await refreshBalance(address);
          try { onPurchased && onPurchased(v); } catch {}
          setPurchaseVideo(null);
        }}
      />
      <StreamModal
        video={streamVideo}
        isOpen={!!streamVideo}
        onClose={async () => { setStreamVideo(null); if (address) await refreshBalance(address); }}
        onUpgrade={(v) => { setStreamVideo(null); setPurchaseVideo(v); }}
        balance={balance}
      />
    </div>
  );
};

export default AvailableVideos;

