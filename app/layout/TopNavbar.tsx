import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useBalance, useDisconnect } from 'wagmi';
import { avalancheFuji } from 'wagmi/chains';
import { Copy, LogOut, ChevronDown, User as UserIcon, Check } from 'lucide-react';

interface TopNavbarProps {
  sidebarWidth?: string;
}

const TopNavbar: React.FC<TopNavbarProps> = ({ sidebarWidth = '56px' }) => {
  const { isConnected, address } = useAccount();
  const { data: balance } = useBalance({
    address,
    chainId: avalancheFuji.id,
    query: { enabled: !!address },
  });
  const { data: usdcBalance } = useBalance({
    address,
    chainId: avalancheFuji.id,
    token: '0x5425890298aed601595a70ab815c96711a31bc65',
    query: { enabled: !!address },
  });
  const { disconnect } = useDisconnect();

  const [menuOpen, setMenuOpen] = React.useState(false);
  const btnRef = React.useRef<HTMLButtonElement | null>(null);
  const menuRef = React.useRef<HTMLDivElement | null>(null);
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!menuOpen) return;
      const t = e.target as Node;
      if (menuRef.current && btnRef.current && !menuRef.current.contains(t) && !btnRef.current.contains(t)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, [menuOpen]);

  const shortAddress = address ? `${address.slice(0, 6)}…${address.slice(-4)}` : '';

  return (
    <div 
      className="fixed top-0 right-0 h-14 border-b border-zinc-800/60 bg-zinc-950/95 backdrop-blur-lg"
      style={{
        left: sidebarWidth,
        transition: 'left 0.3s ease',
        width: `calc(100% - ${sidebarWidth})`
      }}
    >
      <div className="flex h-full items-center justify-end px-6 w-full">
        <div className="flex items-center gap-3">
          {isConnected ? (
            <>
              <div className="flex items-center gap-2">
                <div className="text-sm font-medium pl-2 pr-3 py-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-200 flex items-center gap-2">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full overflow-hidden">
                    <img src="/avax-icon.svg" alt="AVAX" className="h-5 w-5" />
                  </span>
                  {balance ? `${Number(balance.formatted).toFixed(3)} ${balance.symbol}` : '— AVAX'}
                </div>
                <div className="text-sm font-medium pl-2 pr-3 py-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-200 flex items-center gap-2">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full overflow-hidden">
                    <img src="/usdc-icon.svg" alt="USDC" className="h-5 w-5" />
                  </span>
                  {usdcBalance ? `${Number(usdcBalance.formatted).toFixed(2)} USDC` : '— USDC'}
                </div>
              </div>
              <div className="relative">
                <button
                  ref={btnRef}
                  type="button"
                  onClick={() => setMenuOpen(v => !v)}
                  className="text-sm font-medium pl-2 pr-2.5 py-1.5 rounded-full bg-white text-zinc-900 hover:bg-zinc-100 transition border border-zinc-200 flex items-center gap-2 shadow-sm"
                >
                  {/* Avatar circle */}
                  <span
                    className="inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold"
                    style={{
                      background: 'linear-gradient(135deg, #60a5fa 0%, #34d399 100%)',
                      color: 'white',
                    }}
                    aria-hidden
                  >
                    {address ? address.slice(2, 4).toUpperCase() : 'W'}
                  </span>
                  <span className="tracking-wide">{shortAddress}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
                </button>
                {menuOpen && (
                  <div
                    ref={menuRef}
                    className="absolute right-0 mt-2 w-56 rounded-xl border border-zinc-800/60 bg-zinc-900/95 backdrop-blur-sm shadow-xl overflow-hidden z-50"
                  >
                    <div className="px-3 pt-3 pb-2 border-b border-zinc-800/60">
                      <div className="flex items-center gap-2 text-xs text-zinc-400">Connected wallet</div>
                      <div className="mt-1 text-sm font-medium text-zinc-100">{shortAddress}</div>
                    </div>
                    <button
                      type="button"
                      onClick={async () => {
                        if (address) {
                          await navigator.clipboard.writeText(address);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 1500);
                        }
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-800/70 transition"
                    >
                      {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4 text-zinc-400" />}
                      {copied ? 'Copied' : 'Copy Address'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        disconnect();
                        setMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition"
                    >
                      <LogOut className="h-4 w-4" /> Disconnect
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <ConnectButton chainStatus="icon" showBalance={false} accountStatus="address" />
          )}
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;
