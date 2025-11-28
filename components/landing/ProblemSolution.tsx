import React from 'react';
import { motion } from 'framer-motion';
import { XCircle, CheckCircle, MonitorPlay, Dumbbell, Music, HardDrive, Cpu, Cloud } from 'lucide-react';
import Card from '../ui/Card';

const ProblemSolution: React.FC = () => {
  return (
    <section className="py-24 bg-zinc-950 relative border-t border-zinc-900">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Problem */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">The Subscription Trap</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto font-light">
              Americans waste an average of <span className="text-rose-400 font-medium">$1,800/year</span> on subscriptions they barely use.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { 
                icon: MonitorPlay, 
                title: "Streaming", 
                desc: "Pay $15/month, watch 2 hours.", 
                waste: "Waste $12"
              },
              { 
                icon: Dumbbell, 
                title: "Fitness App", 
                desc: "Pay $50/month, use 3 times.", 
                waste: "Waste $35"
              },
              { 
                icon: Music, 
                title: "Music", 
                desc: "Pay $10/month, listen 5 hours.", 
                waste: "Waste $7"
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 bg-zinc-900/30 border-zinc-800/60 hover:border-zinc-700 transition-colors group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2.5 rounded-lg bg-zinc-800/50">
                      <item.icon className="w-5 h-5 text-zinc-400" />
                    </div>
                    <XCircle className="w-5 h-5 text-zinc-700 group-hover:text-rose-500/80 transition-colors" />
                  </div>
                  <h3 className="text-base font-semibold text-zinc-200 mb-2">{item.title}</h3>
                  <p className="text-zinc-500 text-sm mb-4 leading-relaxed">{item.desc}</p>
                  <div className="inline-flex items-center px-2.5 py-1 rounded bg-rose-500/10 border border-rose-500/10 text-rose-400 text-xs font-medium">
                    {item.waste}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Connector */}
        <div className="flex justify-center mb-20">
          <div className="h-16 w-[1px] bg-gradient-to-b from-zinc-800 to-blue-500/50"></div>
        </div>

        {/* Solution */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">The StreamPay Way</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto font-light">
              Fair pricing for everyone. Save up to <span className="text-emerald-400 font-medium">80%</span> compared to traditional subscriptions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { 
                icon: Cloud, 
                title: "Video Streaming", 
                desc: "Watch 2 hours", 
                pay: "Pay $0.48"
              },
              { 
                icon: Cpu, 
                title: "AI API Calls", 
                desc: "10 complex queries", 
                pay: "Pay $0.10"
              },
              { 
                icon: HardDrive, 
                title: "Storage", 
                desc: "100MB stored for 1 day", 
                pay: "Pay $0.002"
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 bg-gradient-to-b from-zinc-900 to-blue-950/10 border-blue-500/10 hover:border-blue-500/30 transition-colors group relative overflow-hidden">
                  <div className="flex items-start justify-between mb-4 relative z-10">
                    <div className="p-2.5 rounded-lg bg-blue-500/10">
                      <item.icon className="w-5 h-5 text-blue-400" />
                    </div>
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2 relative z-10">{item.title}</h3>
                  <p className="text-zinc-400 text-sm mb-4 relative z-10 leading-relaxed">{item.desc}</p>
                  <div className="inline-flex items-center px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/10 text-emerald-400 text-xs font-medium relative z-10">
                    {item.pay}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default ProblemSolution;