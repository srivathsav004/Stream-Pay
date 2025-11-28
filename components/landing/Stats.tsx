import React from 'react';
import { StatProps } from '../types';

const stats: StatProps[] = [
  { label: "Cost Per Second", value: "0.001 AVAX" },
  { label: "Settlement Time", value: "< 1s" },
  { label: "Transparent Pricing", value: "100%" },
  { label: "Hidden Fees", value: "$0" },
];

const Stats: React.FC = () => {
  return (
    <section className="py-20 bg-zinc-950 border-y border-zinc-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-semibold text-white mb-2 tracking-tight">
                {stat.value}
              </div>
              <div className="text-xs md:text-sm font-medium text-zinc-500 uppercase tracking-widest">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;