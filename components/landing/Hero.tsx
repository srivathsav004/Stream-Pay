import React from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowRight, Zap, Layers } from 'lucide-react';
import Button from '../ui/Button';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-zinc-950">
      {/* Background Elements - Subtle Professional Gradient */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-full h-[800px] bg-gradient-to-b from-blue-900/10 via-zinc-950/0 to-zinc-950/0 opacity-50 pointer-events-none" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]"></div>
        
        {/* Subtle Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-medium uppercase tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              The Future of Payments
            </div>

            <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-white leading-[1.1]">
              Pay Per Second. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-zinc-200">
                Not Per Month.
              </span>
            </h1>

            <p className="text-lg text-zinc-400 max-w-lg leading-relaxed font-light">
              Stop wasting money on unused subscriptions. 
              Only pay for what you actually use. Powered by Avalanche.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/app">
                <Button size="lg" className="group">
                  Launch App
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="group">
                <Play className="mr-2 w-4 h-4 fill-current" />
                Watch Demo
              </Button>
            </div>

            <div className="flex items-center gap-6 pt-4 text-sm text-zinc-500 font-medium">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-500" />
                <span>0.001 USDC/sec</span>
              </div>
              <div className="w-1 h-1 bg-zinc-800 rounded-full"></div>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-zinc-400" />
                <span>Real-time Settlement</span>
              </div>
            </div>
          </motion.div>

          {/* Right Visual - Clean Dashboard */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            {/* Abstract Card Stack */}
            <div className="relative w-full max-w-lg mx-auto">
              
              {/* Back Card */}
              <motion.div 
                className="absolute top-4 -right-4 w-full h-80 bg-zinc-900 rounded-xl border border-zinc-800 opacity-60"
              />

              {/* Main Card */}
              <motion.div 
                className="relative bg-zinc-900/90 rounded-xl border border-zinc-800 p-8 shadow-2xl backdrop-blur-xl"
              >
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-zinc-500 text-xs font-medium uppercase tracking-wide">Active Session</h3>
                    <h2 className="text-xl font-semibold text-white mt-1">Premium API Access</h2>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-zinc-400">Duration</span>
                      <span className="text-zinc-200 font-mono">00:42:15</span>
                    </div>
                    <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full w-2/3 bg-blue-500 rounded-full" />
                    </div>
                  </div>

                  <div className="bg-zinc-950/50 rounded-lg p-4 border border-zinc-800/50 flex justify-between items-center">
                    <div>
                        <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Total Cost</p>
                        <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-semibold text-white tracking-tight">0.0425</span>
                        <span className="text-xs font-medium text-zinc-500">USDC</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Rate</p>
                        <div className="text-sm text-zinc-300">0.001/s</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 pt-2">
                     <div className="w-full h-8 bg-blue-600/10 border border-blue-500/20 rounded-md flex items-center justify-center text-xs text-blue-400 font-medium">
                        View Analytics
                     </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Badge */}
              <motion.div 
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-6 -left-6 bg-zinc-900 border border-zinc-800 p-4 rounded-lg shadow-xl flex items-center gap-4 z-20"
              >
                <div className="bg-zinc-800 p-2 rounded-md">
                  <Zap className="w-5 h-5 text-zinc-300" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Throughput</p>
                  <p className="text-sm font-semibold text-white">4,500 TPS</p>
                </div>
              </motion.div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Hero;