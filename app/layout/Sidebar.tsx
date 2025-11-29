import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Video, Bot, Database, Radio, User, Wallet as WalletIcon, Lock } from 'lucide-react';
import Tooltip from '@/components/ui/Tooltip';
import Separator from '@/components/ui/Separator';
import { useWallet } from '@/app/state/WalletContext';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

const items = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/app', section: 'MAIN', key: 'dashboard', requires: 'none' as const },
  { label: 'Video Stream', icon: Video, to: '/app/video', section: 'SERVICES', key: 'video', requires: 'balance' as const },
  { label: 'AI Assistant', icon: Bot, to: '/app/ai', section: 'SERVICES', key: 'ai', requires: 'balance' as const },
  { label: 'Cloud Storage', icon: Database, to: '/app/storage', section: 'SERVICES', key: 'storage', requires: 'balance' as const },
  { label: 'Profile', icon: User, to: '/app/profile', section: 'ACCOUNT', key: 'profile', requires: 'connected' as const },
  { label: 'Balance', icon: WalletIcon, to: '/app/balance', section: 'ACCOUNT', key: 'balance', requires: 'connected' as const },
];

type Props = { collapsed?: boolean; setCollapsed?: (v: boolean) => void };

const Sidebar: React.FC<Props> = ({ collapsed = false, setCollapsed }) => {
  const { pathname } = useLocation();
  const { connected, balanceAvax } = useWallet();
  const location = useLocation();

  // Auto-close sidebar when route changes
  React.useEffect(() => {
    if (setCollapsed && !collapsed) {
      setCollapsed(true);
    }
  }, [location.pathname]);

  // All items are clickable, we'll handle access control on the service pages
  const canUse = () => true;

  const sections = ['MAIN', 'SERVICES', 'ACCOUNT'] as const;

  const collapsedWidth = 3.5 * 16; // 3.5rem (56px)
  const expandedWidth = 12.5 * 16; // 12.5rem (200px)

  return (
    <motion.aside
      className="hidden md:flex fixed left-0 top-0 h-screen z-30 flex-col bg-zinc-900/95 border-r border-zinc-800/60 backdrop-blur-sm will-change-transform"
      onMouseEnter={() => setCollapsed && setCollapsed(false)}
      onMouseLeave={() => setCollapsed && setCollapsed(true)}
      initial={false}
      animate={{
        width: collapsed ? collapsedWidth : expandedWidth,
      }}
      transition={{
        type: 'spring',
        damping: 25,
        stiffness: 300,
        mass: 0.5
      }}
      style={{
        boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 0px 1px, rgba(0, 0, 0, 0.2) 0px 5px 10px, rgba(0, 0, 0, 0.4) 0px 15px 40px',
      }}
    >
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-2">
        {/* StreamPay Logo */}
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'px-4'} mb-4`}>
          <Link to="/app" className="flex items-center space-x-3 group">
            <div className="bg-blue-600/10 border border-blue-500/20 p-2 rounded-lg group-hover:bg-blue-600/20 transition-colors">
              <Zap className="w-5 h-5 text-blue-500 fill-blue-500/20 flex-shrink-0" />
            </div>
            {!collapsed && (
              <motion.span 
                className="text-lg font-semibold text-white whitespace-nowrap"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: collapsed ? 0 : 1, x: collapsed ? -10 : 0 }}
                transition={{ duration: 0.1 }}
              >
                StreamPay
              </motion.span>
            )}
          </Link>
        </div>
        
        <div className="px-3"><Separator /></div>

        {/* Dashboard */}
        <div className="px-2 mt-2 space-y-1">
          {items.filter(i => i.key === 'dashboard').map((item) => {
            const active = pathname === item.to || (item.to !== '/app' && pathname.startsWith(item.to));
            const Inner = (
              <motion.div 
                className={`group/item flex h-10 items-center rounded-r-lg px-3 text-sm gap-3 relative ${active ? 'bg-zinc-800/30 text-white' : 'text-zinc-300 hover:bg-zinc-800/20'}`}
                whileHover={!active ? { scale: 1.02 } : {}}
                whileTap={!active ? { scale: 0.98 } : {}}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                layout
              >
                {active && (
                  <motion.div 
                    className="absolute left-0 top-0 h-full w-0.5 bg-blue-500"
                    layoutId="activeIndicator"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <item.icon className={`h-5 w-5 shrink-0 ${active ? 'text-indigo-400' : 'text-zinc-400'}`} />
                <motion.span 
                  className="flex-1 font-medium overflow-hidden whitespace-nowrap"
                  initial={false}
                  animate={collapsed ? { opacity: 0, maxWidth: 0 } : { opacity: 1, maxWidth: 220 }}
                  transition={{ duration: 0.12 }}
                  aria-hidden={collapsed}
                >
                  {item.label}
                </motion.span>
              </motion.div>
            );
            
            return (
              <div key={item.key} className="relative">
              <Link to={item.to}>
                {collapsed ? (
                  <Tooltip content={item.label}>
                    {Inner}
                  </Tooltip>
                ) : Inner}
              </Link>
            </div>
            );
          })}
        </div>

        <div className="px-2 py-2"><Separator /></div>

        {/* Services */}
        <div className="px-2 space-y-1">
          {items.filter(i => i.section === 'SERVICES').map((item) => {
            const active = pathname === item.to || (item.to !== '/app' && pathname.startsWith(item.to));
            const Inner = (
              <motion.div 
                className={`group/item flex h-10 items-center rounded-r-lg px-3 text-sm gap-3 relative ${active ? 'bg-zinc-800/30 text-white' : 'text-zinc-300 hover:bg-zinc-800/20'}`}
                whileHover={!active ? { scale: 1.02 } : {}}
                whileTap={!active ? { scale: 0.98 } : {}}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                layout
              >
                {active && (
                  <motion.div 
                    className="absolute left-0 top-0 h-full w-0.5 bg-blue-500"
                    layoutId="activeIndicator"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <item.icon className={`h-5 w-5 shrink-0 ${active ? 'text-indigo-400' : 'text-zinc-400'}`} />
                <motion.span 
                  className="flex-1 font-medium overflow-hidden whitespace-nowrap"
                  initial={false}
                  animate={collapsed ? { opacity: 0, maxWidth: 0 } : { opacity: 1, maxWidth: 220 }}
                  transition={{ duration: 0.12 }}
                  aria-hidden={collapsed}
                >
                  {item.label}
                </motion.span>
              </motion.div>
            );
            
            return (
              <div key={item.key} className="relative">
              <Link to={item.to}>
                {collapsed ? (
                  <Tooltip content={item.label}>
                    {Inner}
                  </Tooltip>
                ) : Inner}
              </Link>
            </div>
            );
          })}
        </div>

        <div className="px-2 py-2"><Separator /></div>

        {/* Account */}
        <div className="px-2 space-y-1 pb-2">
          {items.filter(i => i.section === 'ACCOUNT').map((item) => {
            const active = pathname === item.to || (item.to !== '/app' && pathname.startsWith(item.to));
            const Inner = (
              <motion.div 
                className={`group/item flex h-10 items-center rounded-lg px-3 text-sm gap-3 ${active ? 'bg-zinc-800 text-white' : 'text-zinc-300 hover:bg-zinc-800/50'}`}
                whileHover={!active ? { scale: 1.02 } : {}}
                whileTap={!active ? { scale: 0.98 } : {}}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <item.icon className={`h-5 w-5 shrink-0 ${active ? 'text-indigo-400' : 'text-zinc-400'}`} />
                {!collapsed && (
                  <motion.span 
                    className="flex-1 font-medium"
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: collapsed ? 0 : 1, x: collapsed ? -5 : 0 }}
                    transition={{ duration: 0.12 }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </motion.div>
            );
            
            return (
              <div key={item.key} className="relative">
              <Link to={item.to}>
                {collapsed ? (
                  <Tooltip content={item.label}>
                    {Inner}
                  </Tooltip>
                ) : Inner}
              </Link>
            </div>
            );
          })}
        </div>
      </div>
    </motion.aside>
  );
}

export default Sidebar;
