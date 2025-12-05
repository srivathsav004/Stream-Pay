import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';

// YouTube IFrame API types
declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

const COST_PER_SECOND = 0.001; // Example cost

const LiveDemo: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [cost, setCost] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isAPIReady, setIsAPIReady] = useState(false);
  const [isVideoEnded, setIsVideoEnded] = useState(false);
  const playerRef = useRef<any>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initialize YouTube API
  useEffect(() => {
    // Load YouTube IFrame API
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      setIsAPIReady(true);
    };

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Initialize player when API is ready
  useEffect(() => {
    if (isAPIReady && !playerRef.current) {
      playerRef.current = new window.YT.Player('youtube-player', {
        videoId: 'CY5WLrSYPzo',
        playerVars: {
          controls: 0,
          showinfo: 0,
          rel: 0,
          modestbranding: 1,
          disablekb: 1,
          enablejsapi: 1,
          autoplay: 0,
          cc_load_policy: 0,
          iv_load_policy: 3,
          fs: 0,
          playsinline: 1,
          endscreen: 0,
          widget_referrer: document.location.href,
        },
        events: {
          onReady: (event: any) => {
            console.log('YouTube player ready');
          },
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
            } else if (event.data === window.YT.PlayerState.PAUSED) {
              setIsPlaying(false);
            } else if (event.data === window.YT.PlayerState.ENDED) {
              // Auto-reset when video ends to prevent "more videos" screen
              setIsPlaying(false);
              setIsVideoEnded(true);
              // Explicitly clear the interval to stop cost calculation
              if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
              }
              // Don't reset cost and seconds - keep the final values
              if (playerRef.current) {
                playerRef.current.seekTo(0, true);
                playerRef.current.stopVideo();
              }
            }
          },
        },
      });
    }
  }, [isAPIReady]);

  // Cost tracking
  useEffect(() => {
    if (isPlaying && !isVideoEnded) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => s + 0.1);
        setCost(c => c + (COST_PER_SECOND / 10));
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, isVideoEnded]);

  const handlePlay = () => {
    if (playerRef.current) {
      playerRef.current.playVideo();
    }
  };

  const handlePause = () => {
    if (playerRef.current) {
      playerRef.current.pauseVideo();
    }
  };

  const handleReset = () => {
    if (playerRef.current) {
      playerRef.current.stopVideo();
      playerRef.current.seekTo(0, true);
    }
    setIsPlaying(false);
    setIsVideoEnded(false);
    setCost(0);
    setSeconds(0);
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
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
                {/* YouTube Video Embed with API */}
                <div 
                  id="youtube-player" 
                  className="absolute inset-0 w-full h-full"
                />
                
                {/* Transparent overlay to prevent mouse interactions */}
                <div className="absolute inset-0 z-10" style={{ pointerEvents: 'auto' }} />
                
                {/* Overlay for controls */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none"></div>

                {/* Overlay UI */}
                <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-20">
                  <div className="px-4 py-2">
                    {/* <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Cost</p>
                    <p className="text-xl font-mono font-medium text-white">
                      ${cost.toFixed(5)}
                    </p> */}
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
                            onClick={togglePlayPause}
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
                        ${cost.toFixed(4)}
                    </p>
                    <p className="text-xs text-emerald-500 mt-1 font-medium">Saved ${traditionalCost - cost}</p>
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