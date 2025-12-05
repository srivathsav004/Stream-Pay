import React from 'react';
import { Play, ShoppingCart, MessageSquare, HardDrive, Check, DollarSign } from 'lucide-react';

interface ServicesProps {
  activeSubsection: string | null;
  onSubsectionChange: (subsection: string) => void;
}

const Services: React.FC<ServicesProps> = ({ activeSubsection, onSubsectionChange }) => {
  const renderContent = () => {
    if (!activeSubsection || activeSubsection === 'video') {
      return (
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 flex items-center gap-3">
              <Play className="w-10 h-10 text-blue-400" />
              Video Streaming Service
            </h1>
            <p className="text-lg text-zinc-400 leading-relaxed">
              Stream premium videos with <strong className="text-white">two payment options</strong>: pay-per-second or buy-once.
            </p>
          </div>

          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-white">Payment Options</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Play className="w-5 h-5 text-blue-400" />
                  <h3 className="text-xl font-semibold text-white">Option 1: Stream (Pay-Per-Second)</h3>
                </div>
                <p className="text-zinc-400 text-sm mb-4">How it works:</p>
                <ol className="space-y-2 text-zinc-400 text-sm ml-4 list-decimal mb-4">
                  <li>Click "Stream" on any video</li>
                  <li>Watch as long as you want</li>
                  <li>Click "Settle Session" when done</li>
                  <li>Pay only for time watched</li>
                </ol>
                <div className="bg-blue-600/10 border border-blue-500/20 rounded-lg p-3">
                  <p className="text-blue-400 text-sm font-semibold">Pricing: $0.004/second (~$0.24/hour)</p>
                </div>
                <div className="mt-4 pt-4 border-t border-zinc-800">
                  <p className="text-zinc-500 text-xs mb-2">Example Costs:</p>
                  <ul className="space-y-1 text-xs text-zinc-400">
                    <li>• 10 minutes: $2.40</li>
                    <li>• 30 minutes: $7.20</li>
                    <li>• 1 hour: $14.40</li>
                    <li>• 2 hours: $28.80</li>
                  </ul>
                </div>
                <div className="mt-4 pt-4 border-t border-zinc-800">
                  <p className="text-green-400 text-sm font-semibold mb-2">Best for:</p>
                  <ul className="space-y-1 text-sm text-zinc-400">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Trying new content</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Short viewing sessions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Flexible watching</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <ShoppingCart className="w-5 h-5 text-purple-400" />
                  <h3 className="text-xl font-semibold text-white">Option 2: Buy Once (Lifetime Access)</h3>
                </div>
                <p className="text-zinc-400 text-sm mb-4">How it works:</p>
                <ol className="space-y-2 text-zinc-400 text-sm ml-4 list-decimal mb-4">
                  <li>Click "Buy Video"</li>
                  <li>Pay one-time fee</li>
                  <li>Watch unlimited times forever</li>
                </ol>
                <div className="bg-purple-600/10 border border-purple-500/20 rounded-lg p-3">
                  <p className="text-purple-400 text-sm font-semibold">Pricing: Varies by video (typically $5-$20)</p>
                </div>
                <div className="mt-4 pt-4 border-t border-zinc-800">
                  <p className="text-zinc-500 text-xs mb-2">Example:</p>
                  <ul className="space-y-1 text-xs text-zinc-400">
                    <li>• Tutorial video: $5.00</li>
                    <li>• Full course: $15.00</li>
                    <li>• Premium content: $20.00</li>
                  </ul>
                </div>
                <div className="mt-4 pt-4 border-t border-zinc-800">
                  <p className="text-green-400 text-sm font-semibold mb-2">Best for:</p>
                  <ul className="space-y-1 text-sm text-zinc-400">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Content you'll rewatch</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Long videos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Favorite creators</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">How to Use</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
                <h3 className="font-semibold text-white mb-3">Streaming a Video</h3>
                <ol className="space-y-2 text-zinc-400 text-sm ml-4 list-decimal">
                  <li>Browse videos on Video page</li>
                  <li>Click "Stream" on desired video</li>
                  <li>Video starts playing</li>
                  <li>Watch the video</li>
                  <li>Click "Settle Session"</li>
                  <li>Sign payment intent (no gas!)</li>
                  <li>Payment processed from escrow</li>
                </ol>
              </div>
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
                <h3 className="font-semibold text-white mb-3">Buying a Video</h3>
                <ol className="space-y-2 text-zinc-400 text-sm ml-4 list-decimal">
                  <li>Browse videos on Video page</li>
                  <li>Click "Buy" on desired video</li>
                  <li>Review price</li>
                  <li>Confirm purchase</li>
                  <li>Sign payment intent (no gas!)</li>
                  <li>Video unlocked forever!</li>
                </ol>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Cost Comparison</h2>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-white mb-2">Traditional Subscription</h3>
                  <ul className="space-y-1 text-zinc-400 text-sm">
                    <li>• Netflix: $15.99/month</li>
                    <li>• Must pay even if you don't watch</li>
                    <li>• Limited content selection</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">StreamPay</h3>
                  <ul className="space-y-1 text-zinc-400 text-sm">
                    <li>• Pay only for what you watch</li>
                    <li>• $0.24/hour streaming</li>
                    <li>• Or buy videos you love</li>
                    <li className="text-green-400 font-semibold">Save money if you watch &lt;67 hours/month</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </div>
      );
    }

    if (activeSubsection === 'ai') {
      return (
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 flex items-center gap-3">
              <MessageSquare className="w-10 h-10 text-purple-400" />
              AI Assistant Service
            </h1>
            <p className="text-lg text-zinc-400 leading-relaxed">
              Chat with advanced AI models and <strong className="text-white">pay per session</strong>.
            </p>
          </div>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">How It Works</h2>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
              <h3 className="font-semibold text-white mb-3">Session-Based Pricing</h3>
              <ol className="space-y-2 text-zinc-400 text-sm ml-4 list-decimal mb-4">
                <li>Start a chat session</li>
                <li>Make multiple AI calls (questions/responses)</li>
                <li>End session when done</li>
                <li>Pay once for all calls in that session</li>
              </ol>
              <div className="bg-purple-600/10 border border-purple-500/20 rounded-lg p-3">
                <p className="text-purple-400 text-sm font-semibold">Pricing: $0.04 per API call</p>
              </div>
              <div className="mt-4 pt-4 border-t border-zinc-800">
                <p className="text-zinc-500 text-xs mb-2">Example Costs:</p>
                <ul className="space-y-1 text-xs text-zinc-400">
                  <li>• 5 questions: $0.20</li>
                  <li>• 10 questions: $0.40</li>
                  <li>• 25 questions: $1.00</li>
                  <li>• 50 questions: $2.00</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">How to Use</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
                <h3 className="font-semibold text-white mb-3">Starting a Chat</h3>
                <ol className="space-y-2 text-zinc-400 text-sm ml-4 list-decimal">
                  <li>Go to AI Assistant page</li>
                  <li>Click "New Chat"</li>
                  <li>Session starts automatically</li>
                  <li>Ask your questions</li>
                </ol>
              </div>
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
                <h3 className="font-semibold text-white mb-3">Ending a Session</h3>
                <ol className="space-y-2 text-zinc-400 text-sm ml-4 list-decimal">
                  <li>Click "End Session"</li>
                  <li>Review total calls</li>
                  <li>See total cost</li>
                  <li>Sign payment intent (no gas!)</li>
                  <li>Payment processed from escrow</li>
                </ol>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Cost Comparison</h2>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-white mb-2">ChatGPT Plus</h3>
                  <ul className="space-y-1 text-zinc-400 text-sm">
                    <li>• $20/month subscription</li>
                    <li>• Must pay even if you don't use</li>
                    <li>• Limited to one account</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">StreamPay AI</h3>
                  <ul className="space-y-1 text-zinc-400 text-sm">
                    <li>• $0.04 per call</li>
                    <li>• Pay only for what you use</li>
                    <li className="text-green-400 font-semibold">Save money if you make &lt;500 calls/month</li>
                  </ul>
                  <p className="text-zinc-500 text-xs mt-2">Average user makes 50-100 calls/month = $2-4</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      );
    }

    if (activeSubsection === 'storage') {
      return (
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 flex items-center gap-3">
              <HardDrive className="w-10 h-10 text-green-400" />
              Cloud Storage Service
            </h1>
            <p className="text-lg text-zinc-400 leading-relaxed">
              Store files on <strong className="text-white">IPFS</strong> and <strong className="text-white">pay only while stored</strong>.
            </p>
          </div>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">How It Works</h2>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
              <h3 className="font-semibold text-white mb-3">Pay-Per-MB-Per-Hour</h3>
              <ol className="space-y-2 text-zinc-400 text-sm ml-4 list-decimal mb-4">
                <li>Upload file to StreamPay</li>
                <li>File stored on IPFS (decentralized)</li>
                <li>Charged hourly based on file size</li>
                <li>Delete anytime to stop charges</li>
              </ol>
              <div className="bg-green-600/10 border border-green-500/20 rounded-lg p-3">
                <p className="text-green-400 text-sm font-semibold">Pricing: $0.001 per MB per hour</p>
              </div>
              <div className="mt-4 pt-4 border-t border-zinc-800">
                <div className="bg-zinc-950/50 rounded-lg p-4 border border-zinc-800 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-zinc-800">
                        <th className="text-left py-2 text-zinc-300 font-semibold">File Size</th>
                        <th className="text-right py-2 text-zinc-300 font-semibold">1 Hour</th>
                        <th className="text-right py-2 text-zinc-300 font-semibold">1 Day</th>
                        <th className="text-right py-2 text-zinc-300 font-semibold">1 Week</th>
                        <th className="text-right py-2 text-zinc-300 font-semibold">1 Month</th>
                      </tr>
                    </thead>
                    <tbody className="text-zinc-400">
                      <tr className="border-b border-zinc-800/50">
                        <td className="py-2">1 MB</td>
                        <td className="text-right py-2">$0.001</td>
                        <td className="text-right py-2">$0.024</td>
                        <td className="text-right py-2">$0.168</td>
                        <td className="text-right py-2">$0.72</td>
                      </tr>
                      <tr className="border-b border-zinc-800/50">
                        <td className="py-2">10 MB</td>
                        <td className="text-right py-2">$0.01</td>
                        <td className="text-right py-2">$0.24</td>
                        <td className="text-right py-2">$1.68</td>
                        <td className="text-right py-2">$7.20</td>
                      </tr>
                      <tr className="border-b border-zinc-800/50">
                        <td className="py-2">100 MB</td>
                        <td className="text-right py-2">$0.10</td>
                        <td className="text-right py-2">$2.40</td>
                        <td className="text-right py-2">$16.80</td>
                        <td className="text-right py-2">$72.00</td>
                      </tr>
                      <tr>
                        <td className="py-2">1 GB</td>
                        <td className="text-right py-2">$1.00</td>
                        <td className="text-right py-2">$24.00</td>
                        <td className="text-right py-2">$168.00</td>
                        <td className="text-right py-2">$720.00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">How to Use</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
                <h3 className="font-semibold text-white mb-3">Uploading a File</h3>
                <ol className="space-y-2 text-zinc-400 text-sm ml-4 list-decimal">
                  <li>Go to Cloud Storage page</li>
                  <li>Click "Upload File"</li>
                  <li>Select file</li>
                  <li>Review cost estimate</li>
                  <li>Confirm upload</li>
                  <li>File appears in storage</li>
                </ol>
              </div>
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
                <h3 className="font-semibold text-white mb-3">Accessing Files</h3>
                <ol className="space-y-2 text-zinc-400 text-sm ml-4 list-decimal">
                  <li>View files in dashboard</li>
                  <li>Click file to see details</li>
                  <li>Download anytime (free)</li>
                  <li>Share link (optional)</li>
                </ol>
              </div>
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
                <h3 className="font-semibold text-white mb-3">Deleting Files</h3>
                <ol className="space-y-2 text-zinc-400 text-sm ml-4 list-decimal">
                  <li>Select file to delete</li>
                  <li>Click "Delete"</li>
                  <li>Review total cost</li>
                  <li>Confirm deletion</li>
                  <li>Charges stop immediately</li>
                </ol>
              </div>
            </div>
          </section>
        </div>
      );
    }

    return null;
  };

  return (
    <div>
      {!activeSubsection && (
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Services</h1>
            <p className="text-lg text-zinc-400 leading-relaxed">
              StreamPay offers three premium services. Choose a service below to learn more.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <button
              onClick={() => onSubsectionChange('video')}
              className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 hover:border-blue-500/50 transition-colors text-left"
            >
              <Play className="w-8 h-8 text-blue-400 mb-3" />
              <h2 className="text-xl font-semibold text-white mb-2">Video Streaming</h2>
              <p className="text-zinc-400 text-sm">Pay-per-second or buy-once for lifetime access</p>
            </button>
            <button
              onClick={() => onSubsectionChange('ai')}
              className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 hover:border-purple-500/50 transition-colors text-left"
            >
              <MessageSquare className="w-8 h-8 text-purple-400 mb-3" />
              <h2 className="text-xl font-semibold text-white mb-2">AI Assistant</h2>
              <p className="text-zinc-400 text-sm">Pay per session for advanced AI chat</p>
            </button>
            <button
              onClick={() => onSubsectionChange('storage')}
              className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 hover:border-green-500/50 transition-colors text-left"
            >
              <HardDrive className="w-8 h-8 text-green-400 mb-3" />
              <h2 className="text-xl font-semibold text-white mb-2">Cloud Storage</h2>
              <p className="text-zinc-400 text-sm">Pay-per-MB-per-hour on IPFS</p>
            </button>
          </div>
        </div>
      )}
      {activeSubsection && renderContent()}
    </div>
  );
};

export default Services;
