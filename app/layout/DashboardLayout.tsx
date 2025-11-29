import React, { useState } from 'react';
import TopNavbar from './TopNavbar';
import Sidebar from './Sidebar';
import { SidebarToggleProvider } from './SidebarToggleContext';

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(true);
  const sidebarRailWidth = '56px';
  
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
            <div className="max-w-7xl mx-auto w-full">
              {children}
            </div>
          </main>
        </div>
      </SidebarToggleProvider>
    </div>
  );
};

export default DashboardLayout;
