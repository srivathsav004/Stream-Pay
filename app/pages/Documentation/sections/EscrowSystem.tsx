import React from 'react';
import { Check, DollarSign, Download, Upload, ArrowRight, Shield } from 'lucide-react';

const EscrowSystem: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Escrow System</h1>
        <p className="text-lg text-zinc-400 leading-relaxed">
          StreamPay uses a <strong className="text-white">smart contract escrow</strong> to hold your USDC. Think of it as a prepaid balance that you control.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">What is Escrow?</h2>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
          <div className="space-y-3 text-sm text-zinc-400">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">Your Wallet (USDC)</span>
              <ArrowRight className="w-4 h-4 text-zinc-600" />
              <span className="text-blue-400">[Deposit]</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">Escrow Contract</span>
              <span className="text-zinc-600">(holds USDC)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-400">[Use services]</span>
              <ArrowRight className="w-4 h-4 text-zinc-600" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">Service Wallet</span>
              <span className="text-zinc-600">(receives payments)</span>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-zinc-800">
              <span className="text-green-400">[Withdraw anytime]</span>
              <ArrowRight className="w-4 h-4 text-zinc-600 rotate-180" />
              <span className="font-semibold text-white">Your Wallet (USDC returned)</span>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
          <Upload className="w-6 h-6" />
          Depositing USDC
        </h2>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 space-y-4">
          <h3 className="font-semibold text-white">Step-by-Step</h3>
          <ol className="space-y-2 text-zinc-400 text-sm ml-6 list-decimal">
            <li>Navigate to <strong className="text-white">Balance</strong> page</li>
            <li>Click <strong className="text-white">"Deposit"</strong></li>
            <li>Enter amount (e.g., 10 USDC)</li>
            <li>Approve USDC (first time only)</li>
            <li>Confirm deposit transaction</li>
            <li>Wait for confirmation (~2 seconds)</li>
          </ol>

          <div className="bg-blue-600/10 border border-blue-500/20 rounded-lg p-4 mt-4">
            <h4 className="font-semibold text-white mb-2">Approval Explained</h4>
            <p className="text-zinc-400 text-sm mb-2">First deposit requires two transactions:</p>
            <div className="space-y-2 text-sm">
              <div className="bg-zinc-950/50 rounded p-2 border border-zinc-800">
                <p className="text-white font-semibold">1. Approve Transaction</p>
                <p className="text-zinc-400 text-xs">Grants permission to contract • Only needed once • Gas cost: ~$0.10</p>
              </div>
              <div className="bg-zinc-950/50 rounded p-2 border border-zinc-800">
                <p className="text-white font-semibold">2. Deposit Transaction</p>
                <p className="text-zinc-400 text-xs">Transfers USDC to escrow • Updates your balance • Gas cost: ~$0.15</p>
              </div>
            </div>
            <p className="text-green-400 text-sm mt-2">✅ Subsequent deposits only need one transaction!</p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Using Escrow Balance</h2>
        <p className="text-zinc-400">Once deposited, your USDC is available for all services:</p>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
            <h3 className="font-semibold text-white mb-2">🎥 Video Streaming</h3>
            <p className="text-zinc-400 text-sm">Deducted per second of streaming or one-time for lifetime access</p>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
            <h3 className="font-semibold text-white mb-2">🤖 AI Assistant</h3>
            <p className="text-zinc-400 text-sm">Deducted per API call, settled at end of session</p>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
            <h3 className="font-semibold text-white mb-2">💾 Cloud Storage</h3>
            <p className="text-zinc-400 text-sm">Deducted per MB per hour, settled when file deleted</p>
          </div>
        </div>
        <div className="bg-green-600/10 border border-green-500/20 rounded-lg p-4">
          <p className="text-green-400 text-sm flex items-center gap-2">
            <Check className="w-4 h-4" />
            All payments happen automatically from your escrow balance!
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
          <Download className="w-6 h-6" />
          Withdrawing USDC
        </h2>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 space-y-4">
          <div>
            <h3 className="font-semibold text-white mb-2">When to Withdraw</h3>
            <ul className="space-y-1 text-zinc-400 text-sm ml-4">
              <li>• You're done using StreamPay</li>
              <li>• You want to reduce your balance</li>
              <li>• You need USDC in your wallet</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-2">How to Withdraw</h3>
            <ol className="space-y-2 text-zinc-400 text-sm ml-6 list-decimal">
              <li>Go to <strong className="text-white">Balance</strong> page</li>
              <li>Click <strong className="text-white">"Withdraw"</strong></li>
              <li>Enter amount (or click "Withdraw All")</li>
              <li>Confirm transaction</li>
              <li>USDC returned to your wallet</li>
            </ol>
            <div className="mt-4 bg-green-600/10 border border-green-500/20 rounded-lg p-3">
              <p className="text-green-400 text-sm flex items-center gap-2">
                <Check className="w-4 h-4" />
                Withdrawal is instant!
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
          <Shield className="w-6 h-6" />
          Security & Control
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
            <h3 className="font-semibold text-white mb-2">Non-Custodial</h3>
            <ul className="space-y-1 text-zinc-400 text-sm">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span>StreamPay cannot access your escrow</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span>Only you can withdraw</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span>Smart contract enforces rules</span>
              </li>
            </ul>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
            <h3 className="font-semibold text-white mb-2">Transparent</h3>
            <ul className="space-y-1 text-zinc-400 text-sm">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span>See exact balance anytime</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span>View all transactions</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span>Verify on blockchain</span>
              </li>
            </ul>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
            <h3 className="font-semibold text-white mb-2">Instant Withdrawals</h3>
            <ul className="space-y-1 text-zinc-400 text-sm">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span>No waiting periods</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span>No approval needed</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span>Direct to your wallet</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Balance Management</h2>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 space-y-4">
          <div>
            <h3 className="font-semibold text-white mb-3">Recommended Balance</h3>
            <div className="bg-zinc-950/50 rounded-lg p-4 border border-zinc-800">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="text-left py-2 text-zinc-300 font-semibold">Usage Level</th>
                    <th className="text-right py-2 text-zinc-300 font-semibold">Recommended Balance</th>
                  </tr>
                </thead>
                <tbody className="text-zinc-400">
                  <tr className="border-b border-zinc-800/50">
                    <td className="py-2">Light (1-2 hours/week)</td>
                    <td className="text-right py-2">5-10 USDC</td>
                  </tr>
                  <tr className="border-b border-zinc-800/50">
                    <td className="py-2">Medium (5-10 hours/week)</td>
                    <td className="text-right py-2">20-30 USDC</td>
                  </tr>
                  <tr>
                    <td className="py-2">Heavy (daily use)</td>
                    <td className="text-right py-2">50-100 USDC</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-2">Low Balance Warnings</h3>
            <p className="text-zinc-400 text-sm">StreamPay will warn you when:</p>
            <ul className="space-y-1 text-zinc-400 text-sm ml-4 mt-2">
              <li>• Balance &lt; $5</li>
              <li>• Balance insufficient for current action</li>
              <li>• Balance running low during session</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Transaction History</h2>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
          <p className="text-zinc-400 text-sm mb-4">View all escrow activity:</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <Check className="w-4 h-4 text-green-400" />
                <span>Deposits</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <Check className="w-4 h-4 text-green-400" />
                <span>Withdrawals</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <Check className="w-4 h-4 text-green-400" />
                <span>Service payments</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <Check className="w-4 h-4 text-green-400" />
                <span>Timestamps</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <Check className="w-4 h-4 text-green-400" />
                <span>Transaction hashes</span>
              </div>
            </div>
          </div>
          <p className="text-zinc-400 text-sm mt-4">Export to CSV for accounting!</p>
        </div>
      </section>
    </div>
  );
};

export default EscrowSystem;
