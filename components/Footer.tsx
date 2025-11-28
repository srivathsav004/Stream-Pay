import React from 'react';
import { Zap, Github, Twitter, Disc } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-zinc-950 pt-20 pb-10 border-t border-zinc-900">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* CTA Section */}
        <div className="bg-zinc-900 rounded-2xl p-8 md:p-12 text-center mb-20 border border-zinc-800">
             <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">Ready to stop wasting money?</h2>
             <p className="text-zinc-400 mb-8 max-w-xl mx-auto font-light">Join the future of usage-based payments. No credit card required. Just connect your wallet.</p>
             <button className="bg-white text-zinc-950 hover:bg-zinc-200 font-medium py-3 px-8 rounded-lg transition-colors text-base">
                Launch App
             </button>
        </div>

        {/* Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <a href="#" className="flex items-center space-x-2 mb-4">
              <div className="bg-blue-600/10 border border-blue-500/20 p-1.5 rounded-lg">
                <Zap className="w-4 h-4 text-blue-500 fill-blue-500/20" />
              </div>
              <span className="text-lg font-semibold text-white">StreamPay</span>
            </a>
            <p className="text-zinc-500 text-sm leading-relaxed">
              The first pay-per-second payment protocol built on Avalanche.
            </p>
          </div>
          
          <div>
            <h4 className="text-zinc-100 font-medium mb-4 text-sm">Product</h4>
            <ul className="space-y-3 text-sm text-zinc-500">
              <li><a href="#" className="hover:text-blue-500 transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Integrations</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Changelog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-zinc-100 font-medium mb-4 text-sm">Resources</h4>
            <ul className="space-y-3 text-sm text-zinc-500">
              <li><a href="#" className="hover:text-blue-500 transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Community</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-zinc-100 font-medium mb-4 text-sm">Legal</h4>
            <ul className="space-y-3 text-sm text-zinc-500">
              <li><a href="#" className="hover:text-blue-500 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-600 text-sm">© 2024 StreamPay Protocol. All rights reserved.</p>
          
          <div className="flex items-center gap-6">
            <a href="#" className="text-zinc-500 hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
            <a href="#" className="text-zinc-500 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
            <a href="#" className="text-zinc-500 hover:text-white transition-colors"><Disc className="w-5 h-5" /></a>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800">
             <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
             <span className="text-xs font-medium text-zinc-400">Built on Avalanche</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;