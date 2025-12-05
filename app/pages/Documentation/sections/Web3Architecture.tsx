import React from 'react';
import { Check, Server, Zap, Shield, Code } from 'lucide-react';

const Web3Architecture: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Web3 Architecture</h1>
        <p className="text-lg text-zinc-400 leading-relaxed">
          Understanding how StreamPay's self-hosted relayer service enables gasless transactions.
        </p>
      </div>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-white">Self-Hosted Relayer Service</h2>
        <p className="text-zinc-400 leading-relaxed">
          StreamPay operates its <strong className="text-white">own relayer infrastructure</strong> instead of relying on third-party services like Gelato or Biconomy.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="bg-blue-600/10 p-2 rounded-lg">
                <Server className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Full Control</h3>
                <ul className="space-y-1 text-zinc-400 text-sm">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>No dependency on external services</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Custom gas optimization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Better reliability</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="bg-green-600/10 p-2 rounded-lg">
                <Zap className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Cost Efficiency</h3>
                <ul className="space-y-1 text-zinc-400 text-sm">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>No relayer fees</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Direct gas payment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Transparent costs</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="bg-purple-600/10 p-2 rounded-lg">
                <Shield className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Privacy</h3>
                <ul className="space-y-1 text-zinc-400 text-sm">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>No data sharing with third parties</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>User transactions stay private</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Complete sovereignty</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="bg-amber-600/10 p-2 rounded-lg">
                <Code className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Customization</h3>
                <ul className="space-y-1 text-zinc-400 text-sm">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Tailored for StreamPay services</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Optimized settlement logic</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Flexible pricing models</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">How It Works</h2>
        
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 space-y-6">
          <div>
            <h3 className="font-semibold text-white mb-3">Traditional Approach (User Pays Gas)</h3>
            <div className="bg-zinc-950/50 rounded-lg p-4 border border-zinc-800">
              <div className="space-y-2 text-sm text-zinc-400">
                <div className="flex items-center gap-2">
                  <span className="text-zinc-500">User clicks "Pay"</span>
                  <span className="text-zinc-600">↓</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-zinc-500">Wallet popup appears</span>
                  <span className="text-zinc-600">↓</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-zinc-500">User confirms + pays gas ($0.50)</span>
                  <span className="text-zinc-600">↓</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-zinc-500">Transaction submitted</span>
                  <span className="text-zinc-600">↓</span>
                </div>
                <div className="text-zinc-500">Payment processed</div>
              </div>
              <div className="mt-4 pt-4 border-t border-zinc-800">
                <p className="text-red-400 text-sm font-semibold mb-2">Problems:</p>
                <ul className="space-y-1 text-sm text-zinc-400">
                  <li>❌ Annoying wallet popups</li>
                  <li>❌ User needs AVAX for gas</li>
                  <li>❌ Poor UX</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-3">StreamPay Approach (Gasless with x402)</h3>
            <div className="bg-zinc-950/50 rounded-lg p-4 border border-zinc-800">
              <div className="space-y-2 text-sm text-zinc-400">
                <div className="flex items-center gap-2">
                  <span className="text-zinc-500">User clicks "Settle"</span>
                  <span className="text-zinc-600">↓</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400 font-semibold">Sign message (NO GAS!)</span>
                  <span className="text-zinc-600">↓</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-zinc-500">Signature sent to StreamPay backend</span>
                  <span className="text-zinc-600">↓</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-zinc-500">StreamPay relayer pays gas</span>
                  <span className="text-zinc-600">↓</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-zinc-500">Payment processed from escrow</span>
                  <span className="text-zinc-600">↓</span>
                </div>
                <div className="text-green-400 font-semibold">Done! ✅</div>
              </div>
              <div className="mt-4 pt-4 border-t border-zinc-800">
                <p className="text-green-400 text-sm font-semibold mb-2">Benefits:</p>
                <ul className="space-y-1 text-sm text-zinc-400">
                  <li>✅ No wallet popups</li>
                  <li>✅ User only needs USDC</li>
                  <li>✅ Smooth Web2-like UX</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">x402 Payment Intents</h2>
        <p className="text-zinc-400 leading-relaxed">
          StreamPay uses the <strong className="text-white">x402 standard</strong> for gasless payments.
        </p>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 space-y-4">
          <div>
            <h3 className="font-semibold text-white mb-2">What is x402?</h3>
            <p className="text-zinc-400 text-sm">
              x402 is a standard for <strong className="text-white">payment intents</strong> that enables:
            </p>
            <ul className="mt-2 space-y-1 text-sm text-zinc-400 ml-4">
              <li>• Off-chain signatures</li>
              <li>• On-chain execution</li>
              <li>• Gasless transactions</li>
              <li>• Replay protection</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-2">How x402 Works</h3>
            <div className="bg-zinc-950/50 rounded-lg p-4 border border-zinc-800 space-y-3">
              <div>
                <p className="text-sm font-semibold text-white mb-1">1. User creates payment intent</p>
                <pre className="bg-zinc-950 rounded p-3 text-xs text-zinc-300 overflow-x-auto">
{`{
  payer: "0xUser...",
  sessionId: "session_123",
  amount: "2400000", // 2.40 USDC
  deadline: 1234567890,
  nonce: 5
}`}
                </pre>
              </div>
              <div>
                <p className="text-sm font-semibold text-white mb-1">2. User signs with EIP-712</p>
                <ul className="text-sm text-zinc-400 ml-4 space-y-1">
                  <li>• Structured data signing</li>
                  <li>• Human-readable</li>
                  <li>• Secure</li>
                </ul>
              </div>
              <div>
                <p className="text-sm font-semibold text-white mb-1">3. Backend receives signature</p>
                <ul className="text-sm text-zinc-400 ml-4 space-y-1">
                  <li>• Validates signature</li>
                  <li>• Checks balance</li>
                  <li>• Submits transaction</li>
                </ul>
              </div>
              <div>
                <p className="text-sm font-semibold text-white mb-1">4. Smart contract verifies</p>
                <ul className="text-sm text-zinc-400 ml-4 space-y-1">
                  <li>• Recovers signer from signature</li>
                  <li>• Validates nonce</li>
                  <li>• Executes payment</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Architecture Diagram</h2>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
          <div className="space-y-4">
            <div className="bg-zinc-950/50 rounded-lg p-4 border border-zinc-800">
              <h3 className="font-semibold text-white mb-2">USER</h3>
              <ul className="text-sm text-zinc-400 space-y-1">
                <li>• Has USDC in escrow</li>
                <li>• Signs payment intents (no gas)</li>
              </ul>
            </div>
            <div className="text-center text-zinc-600">↓ [Signature]</div>
            <div className="bg-zinc-950/50 rounded-lg p-4 border border-zinc-800">
              <h3 className="font-semibold text-white mb-2">STREAMPAY BACKEND</h3>
              <ul className="text-sm text-zinc-400 space-y-1">
                <li>• Receives signatures</li>
                <li>• Validates & submits transactions</li>
                <li>• Pays gas in AVAX</li>
              </ul>
            </div>
            <div className="text-center text-zinc-600">↓ [Transaction]</div>
            <div className="bg-zinc-950/50 rounded-lg p-4 border border-zinc-800">
              <h3 className="font-semibold text-white mb-2">SMART CONTRACT</h3>
              <ul className="text-sm text-zinc-400 space-y-1">
                <li>• Verifies signature</li>
                <li>• Deducts USDC from escrow</li>
                <li>• Transfers to service wallet</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Security</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-green-600/10 border border-green-500/20 rounded-lg p-4">
            <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
              <Check className="w-5 h-5 text-green-400" />
              Audited Smart Contract
            </h3>
            <ul className="text-sm text-zinc-400 space-y-1 ml-7">
              <li>• Open source</li>
              <li>• Verified on Snowtrace</li>
              <li>• Battle-tested patterns</li>
            </ul>
          </div>
          <div className="bg-green-600/10 border border-green-500/20 rounded-lg p-4">
            <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
              <Check className="w-5 h-5 text-green-400" />
              Signature Verification
            </h3>
            <ul className="text-sm text-zinc-400 space-y-1 ml-7">
              <li>• EIP-712 standard</li>
              <li>• Nonce-based replay protection</li>
              <li>• Deadline enforcement</li>
            </ul>
          </div>
          <div className="bg-green-600/10 border border-green-500/20 rounded-lg p-4">
            <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
              <Check className="w-5 h-5 text-green-400" />
              Non-Custodial
            </h3>
            <ul className="text-sm text-zinc-400 space-y-1 ml-7">
              <li>• Users control funds</li>
              <li>• Withdraw anytime</li>
              <li>• No admin keys</li>
            </ul>
          </div>
          <div className="bg-green-600/10 border border-green-500/20 rounded-lg p-4">
            <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
              <Check className="w-5 h-5 text-green-400" />
              Transparent
            </h3>
            <ul className="text-sm text-zinc-400 space-y-1 ml-7">
              <li>• All transactions on-chain</li>
              <li>• Public source code</li>
              <li>• Verifiable execution</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Web3Architecture;
