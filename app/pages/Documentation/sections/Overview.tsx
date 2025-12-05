import React from 'react';
import { Check, Zap, DollarSign, Shield, Clock } from 'lucide-react';

const Overview: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">What is StreamPay?</h1>
        <p className="text-lg text-zinc-400 leading-relaxed">
          StreamPay is a <strong className="text-white">pay-per-use Web3 platform</strong> that enables users to access premium services with <strong className="text-white">gasless payments</strong> powered by <strong className="text-white">x402 payment intents</strong>.
        </p>
      </div>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-white">Key Features</h2>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="bg-blue-600/10 p-2 rounded-lg">
                <DollarSign className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Pay-Per-Use Model</h3>
                <ul className="space-y-2 text-zinc-400 text-sm">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Only pay for what you use</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>No subscriptions, no commitments</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Transparent pricing</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="bg-purple-600/10 p-2 rounded-lg">
                <Zap className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Gasless Transactions</h3>
                <ul className="space-y-2 text-zinc-400 text-sm">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Sign messages, not transactions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>No wallet popups</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Smooth Web2-like experience</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="bg-green-600/10 p-2 rounded-lg">
                <Shield className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">USDC Escrow System</h3>
                <ul className="space-y-2 text-zinc-400 text-sm">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Deposit once, use everywhere</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Instant settlements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Full control of your funds</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="bg-amber-600/10 p-2 rounded-lg">
                <Clock className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Three Premium Services</h3>
                <ul className="space-y-2 text-zinc-400 text-sm">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>🎥 Video Streaming (pay-per-second or buy-once)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>🤖 AI Assistant (pay-per-session)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>💾 Cloud Storage (pay-per-MB-per-hour)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">How It Works</h2>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 space-y-4">
          <div className="flex items-start gap-4">
            <div className="bg-blue-600/10 text-blue-400 rounded-full w-8 h-8 flex items-center justify-center font-semibold flex-shrink-0">1</div>
            <div>
              <h3 className="font-semibold text-white mb-1">Deposit USDC</h3>
              <p className="text-zinc-400 text-sm">Deposit USDC to your escrow balance</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-blue-600/10 text-blue-400 rounded-full w-8 h-8 flex items-center justify-center font-semibold flex-shrink-0">2</div>
            <div>
              <h3 className="font-semibold text-white mb-1">Use Services</h3>
              <p className="text-zinc-400 text-sm">Use services (video, AI, storage)</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-blue-600/10 text-blue-400 rounded-full w-8 h-8 flex items-center justify-center font-semibold flex-shrink-0">3</div>
            <div>
              <h3 className="font-semibold text-white mb-1">Sign Payment Intent</h3>
              <p className="text-zinc-400 text-sm">Sign payment intent when done (no gas!)</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-blue-600/10 text-blue-400 rounded-full w-8 h-8 flex items-center justify-center font-semibold flex-shrink-0">4</div>
            <div>
              <h3 className="font-semibold text-white mb-1">Payment Settled</h3>
              <p className="text-zinc-400 text-sm">Payment settled automatically from escrow</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-blue-600/10 text-blue-400 rounded-full w-8 h-8 flex items-center justify-center font-semibold flex-shrink-0">5</div>
            <div>
              <h3 className="font-semibold text-white mb-1">Withdraw Anytime</h3>
              <p className="text-zinc-400 text-sm">Withdraw funds anytime you want</p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Why StreamPay?</h2>
        <p className="text-zinc-400 leading-relaxed">
          Traditional platforms lock you into subscriptions. StreamPay gives you:
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
            <h3 className="font-semibold text-white mb-2">Flexibility</h3>
            <p className="text-zinc-400 text-sm">Pay only for what you use</p>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
            <h3 className="font-semibold text-white mb-2">Transparency</h3>
            <p className="text-zinc-400 text-sm">See exact costs upfront</p>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
            <h3 className="font-semibold text-white mb-2">Control</h3>
            <p className="text-zinc-400 text-sm">Withdraw funds anytime</p>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
            <h3 className="font-semibold text-white mb-2">Privacy</h3>
            <p className="text-zinc-400 text-sm">No credit cards, no personal data</p>
          </div>
        </div>
      </section>

      <section className="space-y-4 pt-8 border-t border-zinc-800">
        <h2 className="text-2xl font-semibold text-white">Prerequisites</h2>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 space-y-6">
          <div>
            <h3 className="font-semibold text-white mb-3">1. Crypto Wallet</h3>
            <p className="text-zinc-400 text-sm mb-2">Recommended: MetaMask</p>
            <ul className="space-y-1 text-zinc-400 text-sm ml-4">
              <li>• <a href="https://metamask.io/download/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Install MetaMask</a></li>
              <li>• Create a new wallet or import existing</li>
              <li>• Secure your seed phrase</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-3">2. Avalanche Fuji Testnet</h3>
            <div className="bg-zinc-950/50 rounded-lg p-4 border border-zinc-800">
              <table className="w-full text-sm text-zinc-400">
                <tbody className="space-y-2">
                  <tr>
                    <td className="py-1 font-medium text-zinc-300">Network Name</td>
                    <td className="py-1">Avalanche Fuji Testnet</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-medium text-zinc-300">RPC URL</td>
                    <td className="py-1 font-mono text-xs">https://api.avax-test.network/ext/bc/C/rpc</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-medium text-zinc-300">Chain ID</td>
                    <td className="py-1">43113</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-medium text-zinc-300">Currency Symbol</td>
                    <td className="py-1">AVAX</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-medium text-zinc-300">Block Explorer</td>
                    <td className="py-1"><a href="https://testnet.snowtrace.io/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">testnet.snowtrace.io</a></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-3">3. Testnet USDC</h3>
            <p className="text-zinc-400 text-sm mb-2">Get Free Testnet USDC:</p>
            <ul className="space-y-1 text-zinc-400 text-sm ml-4">
              <li>• Get AVAX from <a href="https://faucet.avax.network/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Avalanche Faucet</a></li>
              <li>• Swap AVAX for USDC on <a href="https://traderjoexyz.com/avalanche/trade" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Trader Joe</a></li>
            </ul>
            <p className="text-zinc-400 text-xs mt-2 font-mono">USDC Contract: 0x5425890298aed601595a70AB815c96711a31Bc65</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Overview;
