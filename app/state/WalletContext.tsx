import React, { createContext, useContext, useMemo, useState } from 'react';
import { useAccount, useBalance, useConnect, useDisconnect } from 'wagmi';
import { avalancheFuji } from 'wagmi/chains';

export type WalletState = {
  connected: boolean;
  balanceUSDC: number; // in USDC
  connect: () => void;
  disconnect: () => void;
  setBalance: (val: number) => void;
};

const WalletContext = createContext<WalletState | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isConnected, address } = useAccount();
  const { connectors, connectAsync, status: connectStatus } = useConnect();
  const { disconnect: wagmiDisconnect } = useDisconnect();
  const { data: balance } = useBalance({
    address,
    chainId: avalancheFuji.id,
    query: { enabled: !!address },
  });

  const value = useMemo(
    () => ({
      connected: isConnected,
      balanceUSDC: balance ? Number(balance.formatted) : 0,
      connect: () => {
        const injected = connectors.find(c => c.id === 'injected') || connectors[0];
        if (injected) void connectAsync({ connector: injected });
      },
      disconnect: () => {
        wagmiDisconnect();
      },
      setBalance: (_val: number) => {},
    }),
    [isConnected, balance, connectors, connectAsync, wagmiDisconnect]
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};

export const useWallet = () => {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWallet must be used within WalletProvider');
  return ctx;
};
