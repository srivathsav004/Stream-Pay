import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/landing/Navbar';
import Hero from './components/landing/Hero';
import ProblemSolution from './components/landing/ProblemSolution';
import HowItWorks from './components/landing/HowItWorks';
import Features from './components/landing/Features';
import LiveDemo from './components/landing/LiveDemo';
import Stats from './components/landing/Stats';
import Footer from './components/landing/Footer';
import Dashboard from '@/app/pages/Dashboard';
import Video from '@/app/pages/Video';
import AI from '@/app/pages/AI';
import Storage from '@/app/pages/Storage';
import Balance from '@/app/pages/Balance';
import Profile from '@/app/pages/Profile';
import Documentation from '@/app/pages/Documentation/Documentation';
import { WalletProvider } from '@/app/state/WalletContext';
import Web3Provider from '@/app/web3/Web3Provider';

function App() {
  return (
    <BrowserRouter>
      <Web3Provider>
        <WalletProvider>
          <Routes>
            <Route
              path="/"
              element={
                <div className="min-h-screen bg-zinc-950 text-zinc-50 selection:bg-blue-500/30">
                  <Navbar />
                  <main>
                    <Hero />
                    <ProblemSolution />
                    <HowItWorks />
                    <Features />
                    <LiveDemo />
                    <Stats />
                  </main>
                  <Footer />
                </div>
              }
            />
            <Route path="/app" element={<Dashboard />} />
            <Route path="/app/video" element={<Video />} />
            <Route path="/app/ai" element={<AI />} />
            <Route path="/app/storage" element={<Storage />} />
            <Route path="/app/balance" element={<Balance />} />
            <Route path="/app/profile" element={<Profile />} />
            <Route path="/docs" element={<Documentation />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </WalletProvider>
      </Web3Provider>
    </BrowserRouter>
  );
}

export default App;