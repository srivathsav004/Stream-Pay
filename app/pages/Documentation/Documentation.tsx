import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Zap, ChevronRight, Menu, X, Github, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import Overview from './sections/Overview';
import QuickStart from './sections/QuickStart';
import DemoVideo from './sections/DemoVideo';
import Web3Architecture from './sections/Web3Architecture';
import EscrowSystem from './sections/EscrowSystem';
import Services from './sections/Services';
import APIReference from './sections/APIReference';
import FAQ from './sections/FAQ';

type SectionId = 
  | 'overview' 
  | 'quick-start' 
  | 'demo' 
  | 'web3' 
  | 'escrow' 
  | 'services' 
  | 'api' 
  | 'faq';

interface Section {
  id: SectionId;
  title: string;
  icon?: React.ReactNode;
  subsections?: { id: string; title: string }[];
}

const sections: Section[] = [
  { id: 'overview', title: 'Overview' },
  { id: 'quick-start', title: 'Quick Start' },
  { id: 'demo', title: 'Demo Video' },
  { id: 'web3', title: 'Web3 Architecture' },
  { id: 'escrow', title: 'Escrow System' },
  { 
    id: 'services', 
    title: 'Services',
    subsections: [
      { id: 'video', title: 'Video Streaming' },
      { id: 'ai', title: 'AI Assistant' },
      { id: 'storage', title: 'Cloud Storage' }
    ]
  },
  { id: 'api', title: 'API Reference' },
  { id: 'faq', title: 'FAQ' }
];

const Documentation: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SectionId>('overview');
  const [activeSubsection, setActiveSubsection] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <Overview />;
      case 'quick-start':
        return <QuickStart />;
      case 'demo':
        return <DemoVideo />;
      case 'web3':
        return <Web3Architecture />;
      case 'escrow':
        return <EscrowSystem />;
      case 'services':
        return <Services activeSubsection={activeSubsection} onSubsectionChange={setActiveSubsection} />;
      case 'api':
        return <APIReference />;
      case 'faq':
        return <FAQ />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center space-x-2 group">
                <div className="bg-blue-600/10 border border-blue-500/20 p-2 rounded-lg group-hover:bg-blue-600/20 transition-colors">
                  <Zap className="w-5 h-5 text-blue-500 fill-blue-500/20" />
                </div>
                <span className="text-xl font-semibold tracking-tight text-white">StreamPay</span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
              <Link
                to="/app"
                className="hidden md:flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                Launch App
                <ExternalLink className="w-4 h-4" />
              </Link>
              <button
                className="md:hidden text-zinc-400 hover:text-white"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className="hidden md:block fixed left-0 top-16 bottom-0 w-64 bg-zinc-900/50 border-r border-zinc-800/50 overflow-y-auto">
          <nav className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-400 px-1">
              <BookOpen className="w-4 h-4" />
              <span>Documentation</span>
            </div>
            {sections.map((section) => (
              <div key={section.id}>
                <button
                  onClick={() => {
                    setActiveSection(section.id);
                    setActiveSubsection(null);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === section.id
                      ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                  }`}
                >
                  <span>{section.title}</span>
                  {section.subsections && (
                    <ChevronRight className={`w-4 h-4 transition-transform ${
                      activeSection === section.id ? 'rotate-90' : ''
                    }`} />
                  )}
                </button>
                {section.subsections && activeSection === section.id && (
                  <div className="ml-4 mt-2 space-y-1">
                    {section.subsections.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => setActiveSubsection(sub.id)}
                        className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors ${
                          activeSubsection === sub.id
                            ? 'text-blue-400 bg-blue-600/10'
                            : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        {sub.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </aside>

        {/* Mobile Sidebar */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-zinc-950/95 backdrop-blur-md pt-16">
            <nav className="p-6 space-y-4 overflow-y-auto h-full">
              <div className="flex items-center gap-2 text-sm font-medium text-zinc-400 px-1 mb-2">
                <BookOpen className="w-4 h-4" />
                <span>Documentation</span>
              </div>
              {sections.map((section) => (
                <div key={section.id}>
                  <button
                    onClick={() => {
                      setActiveSection(section.id);
                      setActiveSubsection(null);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                    }`}
                  >
                    <span>{section.title}</span>
                    {section.subsections && (
                      <ChevronRight className={`w-4 h-4 transition-transform ${
                        activeSection === section.id ? 'rotate-90' : ''
                      }`} />
                    )}
                  </button>
                  {section.subsections && activeSection === section.id && (
                    <div className="ml-4 mt-2 space-y-1">
                      {section.subsections.map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() => {
                            setActiveSubsection(sub.id);
                            setIsMobileMenuOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors ${
                            activeSubsection === sub.id
                              ? 'text-blue-400 bg-blue-600/10'
                              : 'text-zinc-500 hover:text-zinc-300'
                          }`}
                        >
                          {sub.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 md:ml-64 min-h-screen">
          <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Documentation;
