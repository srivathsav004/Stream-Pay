import React from 'react';
import { Check, ArrowRight, Wallet, DollarSign, Play, Eye, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

const QuickStart: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Quick Start Guide</h1>
        <p className="text-lg text-zinc-400 leading-relaxed">
          Get started with StreamPay in 5 minutes.
        </p>
      </div>

      <section className="space-y-6">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 space-y-4">
          <div className="flex items-start gap-4">
            <div className="bg-blue-600/10 text-blue-400 rounded-full w-10 h-10 flex items-center justify-center font-semibold flex-shrink-0">1</div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                Connect Wallet
              </h2>
              <ol className="space-y-2 text-zinc-400 text-sm ml-6 list-decimal">
                <li>Visit <Link to="/app" className="text-blue-400 hover:underline">StreamPay App</Link></li>
                <li>Click <strong className="text-white">"Connect Wallet"</strong></li>
                <li>Select MetaMask</li>
                <li>Approve connection</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 space-y-4">
          <div className="flex items-start gap-4">
            <div className="bg-blue-600/10 text-blue-400 rounded-full w-10 h-10 flex items-center justify-center font-semibold flex-shrink-0">2</div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Deposit USDC to Escrow
              </h2>
              <ol className="space-y-2 text-zinc-400 text-sm ml-6 list-decimal">
                <li>Navigate to <strong className="text-white">Balance</strong> page</li>
                <li>Click <strong className="text-white">"Deposit"</strong></li>
                <li>Enter amount (e.g., 10 USDC)</li>
                <li>Approve USDC spending (one-time)</li>
                <li>Confirm deposit transaction</li>
                <li>Wait for confirmation (~2 seconds)</li>
              </ol>
              <div className="mt-4 bg-green-600/10 border border-green-500/20 rounded-lg p-3">
                <p className="text-green-400 text-sm flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  Your escrow balance is now funded!
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 space-y-4">
          <div className="flex items-start gap-4">
            <div className="bg-blue-600/10 text-blue-400 rounded-full w-10 h-10 flex items-center justify-center font-semibold flex-shrink-0">3</div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
                <Play className="w-5 h-5" />
                Use a Service
              </h2>
              <p className="text-zinc-400 text-sm mb-3">Example: Watch a Video</p>
              <ol className="space-y-2 text-zinc-400 text-sm ml-6 list-decimal">
                <li>Go to <strong className="text-white">Video Streaming</strong> page</li>
                <li>Choose a video</li>
                <li>Click <strong className="text-white">"Stream"</strong> (pay-per-second)</li>
                <li>Watch the video</li>
                <li>Click <strong className="text-white">"Settle Session"</strong></li>
                <li><strong className="text-white">Sign message</strong> (no gas!)</li>
                <li>Payment processed automatically</li>
              </ol>
              {/* <div className="mt-4 bg-blue-600/10 border border-blue-500/20 rounded-lg p-3">
                <p className="text-blue-400 text-sm">
                  <strong>Cost:</strong> ~$0.24/hour of streaming
                </p>
              </div> */}
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 space-y-4">
          <div className="flex items-start gap-4">
            <div className="bg-blue-600/10 text-blue-400 rounded-full w-10 h-10 flex items-center justify-center font-semibold flex-shrink-0">4</div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Check Your Balance
              </h2>
              <ol className="space-y-2 text-zinc-400 text-sm ml-6 list-decimal">
                <li>Go to <strong className="text-white">Balance</strong> page</li>
                <li>View transaction history</li>
                <li>See remaining balance</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 space-y-4">
          <div className="flex items-start gap-4">
            <div className="bg-blue-600/10 text-blue-400 rounded-full w-10 h-10 flex items-center justify-center font-semibold flex-shrink-0">5</div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
                <Download className="w-5 h-5" />
                Withdraw (Optional)
              </h2>
              <ol className="space-y-2 text-zinc-400 text-sm ml-6 list-decimal">
                <li>Go to <strong className="text-white">Balance</strong> page</li>
                <li>Click <strong className="text-white">"Withdraw"</strong></li>
                <li>Enter amount</li>
                <li>Confirm transaction</li>
                <li>USDC returned to your wallet</li>
              </ol>
            </div>
          </div>
        </div>
      </section>
{/* 
      <section className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-3">Video Tutorial</h2>
        <p className="text-zinc-400 text-sm mb-4">
          Watch this 3-minute tutorial to see StreamPay in action.
        </p>
        <div className="bg-zinc-950/50 rounded-lg p-8 border border-zinc-800 flex items-center justify-center">
          <p className="text-zinc-500 text-sm">[Video Player Embed]</p>
        </div>
      </section> */}

      <section className="space-y-4 pt-8 border-t border-zinc-800">
        <h2 className="text-2xl font-semibold text-white">What's Next?</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 hover:border-blue-500/50 transition-colors">
            <h3 className="font-semibold text-white mb-2">Learn about Services</h3>
            <p className="text-zinc-400 text-sm">Explore video, AI, and storage options</p>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 hover:border-blue-500/50 transition-colors">
            <h3 className="font-semibold text-white mb-2">Understand Escrow</h3>
            <p className="text-zinc-400 text-sm">Learn how the escrow system works</p>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 hover:border-blue-500/50 transition-colors">
            <h3 className="font-semibold text-white mb-2">Explore Web3 Architecture</h3>
            <p className="text-zinc-400 text-sm">Deep dive into the technical details</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default QuickStart;
