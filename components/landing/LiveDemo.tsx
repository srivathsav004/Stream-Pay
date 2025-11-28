import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';

const COST_PER_SECOND = 0.00042; // Example cost

const LiveDemo: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [cost, setCost] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const requestRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  const animate = (time: number) => {
    if (!startTimeRef.current) startTimeRef.current = time;
    const deltaTime = (time - startTimeRef.current) / 1000; // seconds
    
    // In a real app we'd use exact time, here we simulate accumulation
    setSeconds(prev => prev + 0.016); // Approx 60fps
    setCost(prev => prev + (COST_PER_SECOND / 60)); 
    
    startTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying) {
        interval = setInterval(() => {
            setSeconds(s => s + 0.1);
            setCost(c => c + (COST_PER_SECOND / 10));
        }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleReset = () => {
    setIsPlaying(false);
    setCost(0);
    setSeconds(0);
  };

  const traditionalCost = 15.00; // Flat rate comparison

  return (
    <section id="demo" className="py-24 bg-zinc-950 border-t border-zinc-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <div className="inline-block px-3 py-1 mb-4 text-xs font-medium tracking-wider text-blue-400 uppercase bg-blue-900/10 rounded-full border border-blue-900/20">
            Interactive Demo
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">See It In Action</h2>
          <p className="text-zinc-400 font-light">Simulate a paid video streaming session.</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="rounded-xl border border-zinc-800 shadow-2xl overflow-hidden">
            <div className="bg-zinc-950 relative">
              
              {/* Video Player Mockup */}
              <div className="aspect-video bg-zinc-900 relative flex items-center justify-center group overflow-hidden">
                {/* Simulated Video Content */}
                <div className={`absolute inset-0 bg-zinc-800 transition-opacity duration-1000 ${isPlaying ? 'opacity-100' : 'opacity-40'}`}>
                    {isPlaying && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-full h-full opacity-30 bg-[url('https://picsum.photos/seed/tech/800/450')] bg-cover bg-center grayscale"></div>
                        </div>
                    )}
                </div>
                
                {/* Center Control */}
                {!isPlaying && seconds === 0 && (
                   <button 
                     onClick={() => setIsPlaying(true)}
                     className="z-10 w-16 h-16 bg-white/5 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-105 transition-transform cursor-pointer border border-white/10"
                   >
                     <Play className="w-6 h-6 text-white ml-1" />
                   </button>
                )}

                {/* Overlay UI */}
                <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-20">
                  <div className="bg-zinc-900/90 backdrop-blur-md px-4 py-2 rounded border border-zinc-700">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Cost</p>
                    <p className="text-xl font-mono font-medium text-white">
                      ${cost.toFixed(5)}
                    </p>
                  </div>
                  <div className="bg-red-500/10 backdrop-blur-md px-3 py-1 rounded-full border border-red-500/20 flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full bg-red-500 ${isPlaying ? 'animate-pulse' : ''}`}></div>
                    <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider">{isPlaying ? 'LIVE' : 'OFFLINE'}</span>
                  </div>
                </div>

                {/* Bottom Controls */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-zinc-950/80 to-transparent z-20">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Button 
                            variant="secondary" 
                            size="sm"
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="bg-zinc-800/80 backdrop-blur border-zinc-700"
                        >
                            {isPlaying ? <Pause className="w-3 h-3 mr-2" /> : <Play className="w-3 h-3 mr-2" />}
                            {isPlaying ? 'Stop' : 'Start'}
                        </Button>
                        <button onClick={handleReset} className="text-zinc-400 hover:text-white transition-colors">
                            <RotateCcw className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-mono text-zinc-300">
                            {new Date(seconds * 1000).toISOString().substr(14, 5)}
                        </span>
                      </div>
                   </div>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-2 divide-x divide-zinc-800 border-t border-zinc-800">
                <div className="p-6 bg-zinc-900/30">
                    <p className="text-xs text-zinc-500 mb-1 uppercase tracking-wider font-medium">Traditional</p>
                    <p className="text-lg font-medium text-zinc-400 line-through decoration-zinc-600">
                        ${traditionalCost.toFixed(2)}/mo
                    </p>
                    <p className="text-xs text-zinc-600 mt-1">Flat rate pricing</p>
                </div>
                <div className="p-6 bg-blue-900/5">
                    <p className="text-xs text-blue-500 mb-1 uppercase tracking-wider font-medium">StreamPay</p>
                    <p className="text-2xl font-bold text-white">
                        ${(cost).toFixed(4)}
                    </p>
                    <p className="text-xs text-emerald-500 mt-1 font-medium">Saved ${(traditionalCost - cost).toFixed(2)}</p>
                </div>
              </div>

            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default LiveDemo;