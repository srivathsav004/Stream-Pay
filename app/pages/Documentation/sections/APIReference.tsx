import React from 'react';
import { Code, Server, CheckCircle } from 'lucide-react';

const APIReference: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">API Reference</h1>
        <p className="text-lg text-zinc-400 leading-relaxed">
          StreamPay backend API documentation.
        </p>
      </div>

      {/* <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Base URL</h2>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
          <div className="space-y-2">
            <div>
              <p className="text-zinc-400 text-sm mb-1">Production:</p>
              <code className="text-blue-400 font-mono text-sm">https://api.streampay.app</code>
            </div>
            <div>
              <p className="text-zinc-400 text-sm mb-1">Testnet:</p>
              <code className="text-blue-400 font-mono text-sm">http://localhost:3001</code>
            </div>
          </div>
        </div>
      </section> */}

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Authentication</h2>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
          <p className="text-zinc-400 text-sm">
            No authentication required for read endpoints. Payment endpoints require <strong className="text-white">signed x402 payment intents</strong>.
          </p>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-white">Endpoints</h2>

        <div className="space-y-6">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
            <div className="flex items-start gap-3 mb-4">
              <Code className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-green-600/10 text-green-400 px-2 py-1 rounded text-xs font-mono">GET</span>
                  <code className="text-white font-mono">/api/nonce/:address</code>
                </div>
                <p className="text-zinc-400 text-sm mb-3">Get user's current nonce for signing payment intents.</p>
                <div className="bg-zinc-950/50 rounded-lg p-4 border border-zinc-800">
                  <p className="text-zinc-500 text-xs mb-2">Response:</p>
                  <pre className="text-xs text-zinc-300 overflow-x-auto">
{`{
  "address": "0x742d35Cc...",
  "nonce": "5"
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
            <div className="flex items-start gap-3 mb-4">
              <Code className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-green-600/10 text-green-400 px-2 py-1 rounded text-xs font-mono">GET</span>
                  <code className="text-white font-mono">/api/balance/:address</code>
                </div>
                <p className="text-zinc-400 text-sm mb-3">Get user's USDC escrow balance.</p>
                <div className="bg-zinc-950/50 rounded-lg p-4 border border-zinc-800">
                  <p className="text-zinc-500 text-xs mb-2">Response:</p>
                  <pre className="text-xs text-zinc-300 overflow-x-auto">
{`{
  "address": "0x742d35Cc...",
  "balance": "10000000",
  "balanceUSDC": "10.00"
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
            <div className="flex items-start gap-3 mb-4">
              <Code className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-amber-600/10 text-amber-400 px-2 py-1 rounded text-xs font-mono">POST</span>
                  <code className="text-white font-mono">/api/execute-payment</code>
                </div>
                <p className="text-zinc-400 text-sm mb-3">Execute x402 payment intent.</p>
                <div className="bg-zinc-950/50 rounded-lg p-4 border border-zinc-800 space-y-3">
                  <div>
                    <p className="text-zinc-500 text-xs mb-2">Request Body:</p>
                    <pre className="text-xs text-zinc-300 overflow-x-auto">
{`{
  "paymentIntent": {
    "payer": "0x742d35Cc...",
    "sessionId": "0xabc123...",
    "amount": "2400000",
    "deadline": 1234567890,
    "nonce": "5",
    "signature": "0xdef456..."
  },
  "serviceType": "video-stream",
  "metadata": {
    "durationSeconds": 2520
  }
}`}
                    </pre>
                  </div>
                  <div>
                    <p className="text-zinc-500 text-xs mb-2">Response:</p>
                    <pre className="text-xs text-zinc-300 overflow-x-auto">
{`{
  "success": true,
  "txHash": "0x789...",
  "blockNumber": 12345,
  "gasUsed": "50000",
  "gasCostAVAX": "0.00125",
  "gasCostUSD": "0.05",
  "amountUSDC": "2.40",
  "serviceType": "video-stream",
  "processingTime": "2500ms"
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
            <div className="flex items-start gap-3 mb-4">
              <Code className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-green-600/10 text-green-400 px-2 py-1 rounded text-xs font-mono">GET</span>
                  <code className="text-white font-mono">/api/is-settled/:sessionId</code>
                </div>
                <p className="text-zinc-400 text-sm mb-3">Check if session is already settled.</p>
                <div className="bg-zinc-950/50 rounded-lg p-4 border border-zinc-800">
                  <p className="text-zinc-500 text-xs mb-2">Response:</p>
                  <pre className="text-xs text-zinc-300 overflow-x-auto">
{`{
  "sessionId": "0xabc123...",
  "isSettled": false
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
            <div className="flex items-start gap-3 mb-4">
              <Code className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-green-600/10 text-green-400 px-2 py-1 rounded text-xs font-mono">GET</span>
                  <code className="text-white font-mono">/api/contract-info</code>
                </div>
                <p className="text-zinc-400 text-sm mb-3">Get smart contract information.</p>
                <div className="bg-zinc-950/50 rounded-lg p-4 border border-zinc-800">
                  <p className="text-zinc-500 text-xs mb-2">Response:</p>
                  <pre className="text-xs text-zinc-300 overflow-x-auto">
{`{
  "contractAddress": "0x...",
  "usdc": "0x5425890298aed601595a70AB815c96711a31Bc65",
  "serviceWallet": "0x6021e09E8Cd947701E2368D60239C04486118f18",
  "name": "StreamPay",
  "version": "1",
  "network": "Avalanche Fuji Testnet",
  "chainId": 43113
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
            <div className="flex items-start gap-3 mb-4">
              <Server className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-green-600/10 text-green-400 px-2 py-1 rounded text-xs font-mono">GET</span>
                  <code className="text-white font-mono">/health</code>
                </div>
                <p className="text-zinc-400 text-sm mb-3">Check API health and status.</p>
                <div className="bg-zinc-950/50 rounded-lg p-4 border border-zinc-800">
                  <p className="text-zinc-500 text-xs mb-2">Response:</p>
                  <pre className="text-xs text-zinc-300 overflow-x-auto">
{`{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00Z",
  "relayer": {
    "address": "0x...",
    "balanceAVAX": "1.5",
    "role": "Pays gas for transactions"
  },
  "service": {
    "address": "0x6021e09E8Cd947701E2368D60239C04486118f18",
    "role": "Receives USDC payments"
  },
  "contract": {
    "address": "0x...",
    "usdc": "0x5425890298aed601595a70AB815c96711a31Bc65",
    "name": "StreamPay",
    "version": "1"
  }
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Error Codes</h2>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
          <div className="bg-zinc-950/50 rounded-lg p-4 border border-zinc-800 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left py-2 text-zinc-300 font-semibold">Code</th>
                  <th className="text-left py-2 text-zinc-300 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className="text-zinc-400">
                <tr className="border-b border-zinc-800/50">
                  <td className="py-2 font-mono">400</td>
                  <td className="py-2">Bad Request (invalid input)</td>
                </tr>
                <tr>
                  <td className="py-2 font-mono">500</td>
                  <td className="py-2">Internal Server Error</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4 bg-zinc-950/50 rounded-lg p-4 border border-zinc-800">
            <p className="text-zinc-500 text-xs mb-2">Error Response:</p>
            <pre className="text-xs text-zinc-300 overflow-x-auto">
{`{
  "error": "Insufficient escrow balance",
  "balance": "1.50",
  "required": "2.40"
}`}
            </pre>
          </div>
        </div>
      </section>
    </div>
  );
};

export default APIReference;
