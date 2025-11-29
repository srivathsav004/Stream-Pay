import React, { createContext, useContext, useMemo, useState } from 'react';

export type WalletState = {
  connected: boolean;
  balanceAvax: number; // in AVAX
  connect: () => void;
  disconnect: () => void;
  setBalance: (val: number) => void;
};

const WalletContext = createContext<WalletState | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [balanceAvax, setBalanceAvax] = useState(0);

  const value = useMemo(
    () => ({
      connected,
      balanceAvax,
      connect: () => setConnected(true),
      disconnect: () => {
        setConnected(false);
        setBalanceAvax(0);
      },
      setBalance: (val: number) => setBalanceAvax(val),
    }),
    [connected, balanceAvax]
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};

export const useWallet = () => {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWallet must be used within WalletProvider');
  return ctx;
};
