import React from 'react';
import { Play, Clock } from 'lucide-react';

const DemoVideo: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Demo Video</h1>
        <p className="text-lg text-zinc-400 leading-relaxed">
          Watch this comprehensive demo showing all features of StreamPay.
        </p>
      </div>

      <section className="space-y-6">
        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-lg p-8">
          <div className="bg-zinc-950/50 rounded-lg aspect-video border border-zinc-800 flex items-center justify-center mb-6">
            <div className="text-center">
              <Play className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <p className="text-zinc-400 text-sm">Video Player Embed</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-zinc-400 text-sm mb-4">
            <Clock className="w-4 h-4" />
            <span>Duration: 12 minutes</span>
          </div>

          <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
            <h3 className="font-semibold text-white mb-3">Video Chapters</h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li className="flex items-center gap-2">
                <span className="text-zinc-500 font-mono text-xs">0:00</span>
                <span>Introduction</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-zinc-500 font-mono text-xs">0:30</span>
                <span>Connecting Wallet</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-zinc-500 font-mono text-xs">1:00</span>
                <span>Depositing USDC</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-zinc-500 font-mono text-xs">2:00</span>
                <span>Video Streaming (Pay-per-second)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-zinc-500 font-mono text-xs">3:30</span>
                <span>Video Purchase (Buy-once)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-zinc-500 font-mono text-xs">5:00</span>
                <span>AI Assistant (Pay-per-session)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-zinc-500 font-mono text-xs">7:00</span>
                <span>Cloud Storage (Upload & Delete)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-zinc-500 font-mono text-xs">9:00</span>
                <span>Checking Balance & History</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-zinc-500 font-mono text-xs">10:30</span>
                <span>Withdrawing Funds</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="space-y-4 pt-8 border-t border-zinc-800">
        <h2 className="text-2xl font-semibold text-white">Additional Resources</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 hover:border-blue-500/50 transition-colors">
            <h3 className="font-semibold text-white mb-2">📹 Video Streaming Tutorial</h3>
            <p className="text-zinc-400 text-sm">Learn how to stream and purchase videos</p>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 hover:border-blue-500/50 transition-colors">
            <h3 className="font-semibold text-white mb-2">🤖 AI Assistant Guide</h3>
            <p className="text-zinc-400 text-sm">Master the AI chat interface</p>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 hover:border-blue-500/50 transition-colors">
            <h3 className="font-semibold text-white mb-2">💾 Cloud Storage Walkthrough</h3>
            <p className="text-zinc-400 text-sm">Upload, manage, and delete files</p>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 hover:border-blue-500/50 transition-colors">
            <h3 className="font-semibold text-white mb-2">💰 Escrow Management</h3>
            <p className="text-zinc-400 text-sm">Manage your USDC balance</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DemoVideo;
