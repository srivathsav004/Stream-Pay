import React, { createContext, useContext } from 'react';

export type SidebarToggle = {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
};

const SidebarToggleContext = createContext<SidebarToggle | null>(null);

export const SidebarToggleProvider: React.FC<{ value: SidebarToggle; children: React.ReactNode }> = ({ value, children }) => (
  <SidebarToggleContext.Provider value={value}>{children}</SidebarToggleContext.Provider>
);

export const useSidebarToggle = () => {
  const ctx = useContext(SidebarToggleContext);
  if (!ctx) throw new Error('useSidebarToggle must be used within SidebarToggleProvider');
  return ctx;
};
