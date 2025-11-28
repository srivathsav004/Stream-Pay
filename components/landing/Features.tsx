import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Bot, ShieldCheck, BarChart3, Globe, Coins } from 'lucide-react';
import Card from '../ui/Card';
import { FeatureProps } from '../../types';

const features: FeatureProps[] = [
  {
    icon: Zap,
    title: "Real-time Payments",
    description: "Pay per second with sub-second settlement times using Avalanche subnet technology."
  },
  {
    icon: Bot,
    title: "AI Cost Prediction",
    description: "Smart algorithms predict your usage costs before you start, so there are no surprises."
  },
  {
    icon: ShieldCheck,
    title: "Secure Escrow",
    description: "Funds are held in non-custodial smart contracts. We never touch your money."
  },
  {
    icon: BarChart3,
    title: "Usage Analytics",
    description: "Detailed dashboards track every cent spent across all your connected services."
  },
  {
    icon: Globe,
    title: "Multi-Service",
    description: "One wallet, infinite services. Access APIs, content, and tools with a single balance."
  },
  {
    icon: Coins,
    title: "Instant Savings",
    description: "Stop paying for idle time. Users save an average of 40-80% on digital costs."
  }
];

const Features: React.FC = () => {
  return (
    <section id="features" className="py-24 bg-zinc-950 border-t border-zinc-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">Everything you need</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto font-light">
            Built for the future of digital consumption. Fast, secure, and transparent.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card hoverEffect className="h-full p-8 bg-zinc-900/20 hover:bg-zinc-900/50 border-zinc-800 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-zinc-800/50 flex items-center justify-center mb-6">
                  <feature.icon className="w-5 h-5 text-zinc-300" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-zinc-500 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;