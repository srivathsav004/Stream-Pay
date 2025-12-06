import React, { useRef } from 'react';
import { Play, Clock, ExternalLink } from 'lucide-react';

const DemoVideo: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const chapters = [
    { time: 0, title: 'Introduction (0:00 - 0:07)' },
    { time: 8, title: 'Wallet Connection (0:08 - 0:18)' },
    { time: 19, title: 'USDC Deposit (0:19 - 0:59)' },
    { time: 60, title: 'Video Streaming (1:00 - 1:53)' },
    { time: 114, title: 'Video Purchase (1:54 - 2:30)' },
    { time: 151, title: 'API Call Service (2:31 - 3:28)' },
    { time: 209, title: 'File Storage Service (3:29 - 6:00)' },
    { time: 361, title: 'Profile Section (6:01 - 6:13)' },
    { time: 374, title: 'Dashboard Walkthrough (6:14 - 6:35)' },
    { time: 396, title: 'Historical Data & Analytics (6:36 - 8:30)' }
  ];

  const handleChapterClick = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      videoRef.current.play();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Demo Video</h1>
        <p className="text-lg text-zinc-400 leading-relaxed">
          Watch this comprehensive demo showing all features of StreamPay.
        </p>
      </div>

      <section className="space-y-6">
        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-lg p-8">
          <div className="rounded-lg overflow-hidden border border-zinc-800 mb-6 aspect-video bg-black">
            <video 
              ref={videoRef}
              className="w-full h-full object-cover" 
              controls 
              controlsList="nodownload"
              poster="/demo-poster.jpg"
              autoPlay
              muted
              playsInline
            >
              <source src="/demo.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          
          <div className="flex items-center gap-2 text-zinc-400 text-sm mb-4">
            <Clock className="w-4 h-4" />
            <span>Duration: 8:30 minutes</span>
          </div>

          <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              Video Chapters
            </h3>
            <p className="text-xs text-zinc-500 mb-3">Click on any chapter to jump to that section</p>
            <ul className="space-y-2 text-sm text-zinc-400 max-h-80 overflow-y-auto pr-2">
              {chapters.map((chapter, index) => (
                <li 
                  key={index} 
                  className="group flex items-center gap-3 p-2 rounded hover:bg-zinc-800/50 cursor-pointer transition-colors"
                  onClick={() => handleChapterClick(chapter.time)}
                >
                  <span className="text-xs text-zinc-500 w-20 flex-shrink-0">
                    {formatTime(chapter.time)}
                  </span>
                  <span className="flex-grow">{chapter.title}</span>
                  <Play className="w-3.5 h-3.5 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="space-y-4 pt-8 border-t border-zinc-800">
        <h2 className="text-2xl font-semibold text-white">Additional Resources</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 hover:border-blue-500/50 transition-colors">
            <h3 className="font-semibold text-white mb-2">📹 Video Streaming Tutorial</h3>
            <p className="text-zinc-400 text-sm">Learn how to stream and purchase videos</p>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 hover:border-blue-500/50 transition-colors">
            <h3 className="font-semibold text-white mb-2">🤖 AI Assistant Guide</h3>
            <p className="text-zinc-400 text-sm">Master the AI chat interface</p>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 hover:border-blue-500/50 transition-colors">
            <h3 className="font-semibold text-white mb-2">💾 Cloud Storage Walkthrough</h3>
            <p className="text-zinc-400 text-sm">Upload, manage, and delete files</p>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 hover:border-blue-500/50 transition-colors">
            <h3 className="font-semibold text-white mb-2">💰 Escrow Management</h3>
            <p className="text-zinc-400 text-sm">Manage your USDC balance</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DemoVideo;
