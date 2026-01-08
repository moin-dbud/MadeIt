import React from 'react';
import { motion } from 'framer-motion';
import { Target, Briefcase, Activity, Share2 } from 'lucide-react';
import { features } from '../mock';

export const Features = () => {
  const icons = [Target, Briefcase, Activity, Share2];

  return (
    <section className="relative py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-white mb-6">Execution-Focused</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Built for people who want to ship, not just learn.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => {
            const Icon = icons[index];
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all cursor-pointer"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-[#4A7BFF]/20 border border-[#4A7BFF]/30 rounded-xl mb-6">
                  <Icon className="w-6 h-6 text-[#4A7BFF]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
