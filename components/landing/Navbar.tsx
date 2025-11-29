import React, { useState, useEffect } from 'react';
import { Zap, Menu, X, Wallet } from 'lucide-react';
import Button from '../ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Demo', href: '#demo' },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/50 py-4' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center space-x-2 group">
            <div className="bg-blue-600/10 border border-blue-500/20 p-2 rounded-lg group-hover:bg-blue-600/20 transition-colors">
              <Zap className="w-5 h-5 text-blue-500 fill-blue-500/20" />
            </div>
            <span className="text-xl font-semibold tracking-tight text-white">StreamPay</span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a 
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* CTA Buttons */
          }
          <div className="hidden md:flex items-center space-x-4">
             <Button variant="ghost" size="sm" className="hidden lg:flex gap-2 text-zinc-400">
                <Wallet className="w-4 h-4" />
                Connect Wallet
             </Button>
             <Link to="/app">
               <Button variant="primary" size="sm">
                  Launch App
               </Button>
             </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-zinc-300 hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-zinc-950 border-b border-zinc-800"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <a 
                  key={link.name}
                  href={link.href}
                  className="block text-base font-medium text-zinc-300 hover:text-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-4 flex flex-col space-y-3">
                 <Button variant="outline" className="w-full justify-center gap-2">
                    <Wallet className="w-4 h-4" /> Connect Wallet
                 </Button>
                 <Link to="/app" onClick={() => setIsMobileMenuOpen(false)}>
                   <Button variant="primary" className="w-full justify-center">
                      Launch App
                   </Button>
                 </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;