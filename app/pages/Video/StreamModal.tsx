import React, { useState, useEffect, useRef } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Progress from '@/components/ui/Progress';
import { Video } from './types';
import { loadYouTubeIframeAPI } from './youtube';

interface StreamModalProps {
  video: Video | null;
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: (video: Video) => void;
  balance?: number;
}

const StreamModal: React.FC<StreamModalProps> = ({ video, isOpen, onClose, onUpgrade, balance }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [cost, setCost] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const playerRef = useRef<any>(null);
  const playerContainerRef = useRef<HTMLDivElement | null>(null);
  const backend = (path: string) => `${(import.meta as any).env?.VITE_BACKEND_URL ?? 'http://localhost:3001'}/api${path}`;
  const ensureWallet = async () => {
    const eth = (window as any).ethereum;
    if (!eth) throw new Error('Wallet not found');
    const accts: string[] = await eth.request({ method: 'eth_requestAccounts' });
    const addr = accts?.[0] ?? '';
    if (!addr) throw new Error('No account');
    return addr;
  };

  useEffect(() => {
    if (isOpen) {
      setSubmitting(false);
      setStatus(null);
      setToast(null);
    }
  }, [isOpen]);
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

  useEffect(() => {
    if (!isOpen || !video) return;

    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setDuration((prev) => prev + 1);
        setCost((prev) => prev + video.streamPrice);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, video, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setIsPlaying(false);
      setDuration(0);
      setCost(0);
      try { playerRef.current?.stopVideo?.(); } catch {}
    }
  }, [isOpen]);

  // Initialize YouTube Player without autoplay
  useEffect(() => {
    let destroyed = false;
    const init = async () => {
      if (!isOpen || !video) return;
      await loadYouTubeIframeAPI();
      if (destroyed) return;
      // Destroy previous player if any
      try { playerRef.current?.destroy?.(); } catch {}
      playerRef.current = new (window as any).YT.Player(playerContainerRef.current!, {
        videoId: video.id,
        width: '100%',
        height: '100%',
        playerVars: {
          autoplay: 0,
          controls: 0,
          rel: 0,
          modestbranding: 1,
          color: 'white',
        },
        events: {
          onStateChange: (event: any) => {
            // Sync isPlaying if user interacts via keyboard (unlikely since controls=0)
            const YT = (window as any).YT;
            if (!YT) return;
            if (event.data === YT.PlayerState.PLAYING) setIsPlaying(true);
            if (event.data === YT.PlayerState.PAUSED) setIsPlaying(false);
            if (event.data === YT.PlayerState.ENDED) setIsPlaying(false);
          },
        },
      });
    };
    init();
    return () => {
      destroyed = true;
      try { playerRef.current?.destroy?.(); } catch {}
      playerRef.current = null;
    };
  }, [isOpen, video]);

  if (!isOpen || !video) return null;

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const parts = video.duration.split(':').map(Number);
  let totalSeconds = 0;
  if (parts.length === 3) {
    const [h, m, s] = parts;
    totalSeconds = h * 3600 + m * 60 + s;
  } else if (parts.length === 2) {
    const [m, s] = parts;
    totalSeconds = m * 60 + s;
  }
  const progress = (duration / totalSeconds) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={onClose}>
      <div className="bg-[#0a0a0a] border border-[#262626] rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-[#262626]">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-white">Stream: {video.title}</h2>
            {typeof balance === 'number' && (
              <div className="text-xs text-[#a1a1a1]">Escrow Balance: {balance.toFixed(2)} USDC</div>
            )}
            {toast && (
          <div className="absolute top-4 right-4 bg-[#0a0a0a] border border-[#262626] text-white text-sm px-4 py-2 rounded shadow-lg">
            {toast}
          </div>
        )}
      </div>
          <button
            onClick={onClose}
            className="text-[#a1a1a1] hover:text-white text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          {/* Video Player */}
          <Card className="mb-6 bg-[#262626] overflow-hidden">
            <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
              <div ref={playerContainerRef} className="absolute inset-0 w-full h-full" />
            </div>
          </Card>

          {/* Streaming Session Info */}
          <Card className="p-6 mb-6">
            <h3 className="text-base font-semibold text-white mb-4">Streaming Session</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <div className="text-xs text-[#a1a1a1] mb-1">Status</div>
                <div className="text-sm font-medium text-white">
                  {isPlaying ? '🔵 Streaming' : '⏸ Paused'}
                </div>
              </div>
              <div>
                <div className="text-xs text-[#a1a1a1] mb-1">Duration</div>
                <div className="text-sm font-medium text-white">{formatTime(duration)}</div>
              </div>
              <div>
                <div className="text-xs text-[#a1a1a1] mb-1">Cost</div>
                <div className="text-sm font-medium text-white">{cost.toFixed(4)} USDC</div>
              </div>
              <div>
                <div className="text-xs text-[#a1a1a1] mb-1">Rate</div>
                <div className="text-sm font-medium text-white">{video.streamPrice} USDC/sec</div>
              </div>
            </div>
            <div className="mb-4">
              <Progress value={progress} className="h-2" />
            </div>
            {status && (
              <Card className="p-3 mb-3 bg-[#0a0a0a] border-[#262626]">
                <div className="text-xs text-[#a1a1a1]">{status}</div>
              </Card>
            )}
            <div className="flex gap-2">
              <Button
                variant={isPlaying ? 'secondary' : 'primary'}
                size="sm"
                disabled={submitting}
                onClick={() => {
                  try {
                    if (!isPlaying) playerRef.current?.playVideo?.();
                    else playerRef.current?.pauseVideo?.();
                  } catch {}
                  setIsPlaying(!isPlaying);
                }}
              >
                {isPlaying ? '⏸ Pause' : '▶ Play'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={submitting}
                onClick={async () => {
                  try {
                    setSubmitting(true);
                    setStatus('Preparing settlement...');
                    try { playerRef.current?.pauseVideo?.(); playerRef.current?.stopVideo?.(); } catch {}
                    setIsPlaying(false);
                    const addr = await ensureWallet();
                    const seconds = duration;
                    const amount = BigInt(Math.ceil(seconds * video.streamPrice * 1_000_000));
                    const nonce = await getNonce(addr);
                    const deadline = BigInt(Math.floor(Date.now() / 1000) + 10 * 60);
                    const sessionId = makeSessionId();
                    setStatus('Awaiting signature in wallet...');
                    const signature = await signIntent(addr, sessionId, amount, deadline, nonce);
                    setStatus('Submitting settlement to relayer...');
                    const body = {
                      paymentIntent: {
                        payer: addr,
                        sessionId,
                        amount: amount.toString(),
                        deadline: deadline.toString(),
                        nonce: nonce.toString(),
                        signature,
                      },
                      serviceType: 'stream',
                      metadata: { videoId: video.id, title: video.title, seconds, rate: video.streamPrice },
                    };
                    const resp = await fetch(backend('/execute-payment'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
                    if (!resp.ok) {
                      const err = await resp.json().catch(() => ({}));
                      throw new Error(err?.error || 'Settlement failed');
                    }
                    setStatus('Settlement confirmed. Finalizing...');
                    setToast('Stream settlement processed successfully');
                    setTimeout(() => { setToast(null); onClose(); }, 1000);
                  } catch (e: any) {
                    setStatus(e?.message || 'Settlement failed');
                  } finally {
                    setSubmitting(false);
                  }
                }}
              >
                ⏹ Stop & Settle
              </Button>
            </div>
          </Card>

          {/* Upgrade Prompt */}
          <Card className="p-4 bg-blue-600/10 border-blue-600/50">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-white mb-1">
                  💡 Like this video? Buy for {video.purchasePrice} USDC and own forever
                </div>
                <div className="text-xs text-[#a1a1a1]">
                  Streaming cost will be deducted from purchase price
                </div>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => onUpgrade(video)}
              >
                Upgrade to Ownership
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StreamModal;

