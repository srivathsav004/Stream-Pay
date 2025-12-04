import React, { useEffect, useState } from 'react';
import TopNavbar from './TopNavbar';
import Sidebar from './Sidebar';
import { SidebarToggleProvider } from './SidebarToggleContext';
import { useWallet } from '@/app/state/WalletContext';
import Button from '@/components/ui/Button';
import { Lock } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(true);
  const sidebarRailWidth = '56px';
  const { connected, connect } = useWallet();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Route guard: if disconnected, keep user on dashboard route
  useEffect(() => {
    if (!connected && pathname !== '/app') {
      navigate('/app', { replace: true });
    }
  }, [connected, pathname, navigate]);
  
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <SidebarToggleProvider value={{ collapsed, setCollapsed }}>
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <div className="flex flex-col min-h-screen">
          <TopNavbar sidebarWidth={sidebarRailWidth} />
          <main 
            className="flex-1 transition-all duration-300"
            style={{
              marginLeft: sidebarRailWidth,
              padding: '1.5rem',
              minHeight: 'calc(100vh - 56px)',
              marginTop: '56px',
              maxWidth: 'calc(100% - 56px)'
            }}
          >
            {connected ? (
              <div className="max-w-7xl mx-auto w-full">{children}</div>
            ) : (
              <div className="w-full h-[calc(100vh-56px-24px)] flex items-center justify-center">
                <div className="text-center max-w-md">
                  <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                    <Lock className="w-8 h-8 text-zinc-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-white mb-2">Connect your wallet to continue</h2>
                  <p className="text-sm text-zinc-400 mb-6">Access to dashboard and services is locked until a wallet is connected.</p>
                  <Button variant="primary" size="sm" onClick={connect}>Connect Wallet</Button>
                </div>
              </div>
            )}
          </main>
        </div>
      </SidebarToggleProvider>
    </div>
  );
};

export default DashboardLayout;
