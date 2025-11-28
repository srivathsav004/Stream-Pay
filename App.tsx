import React from 'react';
import Navbar from './components/landing/Navbar';
import Hero from './components/landing/Hero';
import ProblemSolution from './components/landing/ProblemSolution';
import HowItWorks from './components/landing/HowItWorks';
import Features from './components/landing/Features';
import LiveDemo from './components/landing/LiveDemo';
import Stats from './components/landing/Stats';
import Footer from './components/landing/Footer';

function App() {
  return (
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
  );
}

export default App;