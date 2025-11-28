import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, Play, Square } from 'lucide-react';
import { StepProps } from '../types';

const steps: StepProps[] = [
  {
    number: 1,
    title: "Connect Wallet",
    description: "Connect your Web3 wallet and deposit AVAX to your StreamPay balance.",
    icon: Wallet
  },
  {
    number: 2,
    title: "Use Services",
    description: "Start using any supported service. Payment streams automatically per second.",
    icon: Play
  },
  {
    number: 3,
    title: "Stop & Save",
    description: "Stop using the service and payment halts instantly. Withdraw anytime.",
    icon: Square
  }
];

const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-24 bg-zinc-950 relative overflow-hidden border-t border-zinc-900">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">How It Works</h2>
          <p className="text-zinc-400 font-light">Start saving in three simple steps.</p>
        </div>

        <div className="relative grid md:grid-cols-3 gap-8">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-10 left-[16%] right-[16%] h-[1px] bg-zinc-800 -z-10"></div>

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
              className="relative flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-6 z-10 relative">
                <step.icon className="w-8 h-8 text-zinc-300" />
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold border-2 border-zinc-950">
                  {step.number}
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-white mb-3">{step.title}</h3>
              <p className="text-zinc-500 leading-relaxed max-w-xs text-sm">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;