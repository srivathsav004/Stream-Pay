import React, { createContext, useContext } from 'react';

type SidebarCtx = {
  collapsed: boolean;
  toggle: () => void;
};

const Ctx = createContext<SidebarCtx | null>(null);

export const SidebarProvider: React.FC<{ collapsed: boolean; toggle: () => void; children: React.ReactNode }>
= ({ collapsed, toggle, children }) => {
  return <Ctx.Provider value={{ collapsed, toggle }}>{children}</Ctx.Provider>;
};

export const useSidebar = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error('useSidebar must be used within SidebarProvider');
  return v;
};
