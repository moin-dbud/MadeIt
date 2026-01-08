import React from 'react';
import { motion } from 'framer-motion';
import { Target, CheckSquare, BarChart3 } from 'lucide-react';
import { howItWorksSteps } from '../mock';

export const HowItWorks = () => {
  const icons = [Target, CheckSquare, BarChart3];

  return (
    <section id="how" className="relative py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-white mb-6">How It Works</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Three simple steps to turn ideas into proof.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {howItWorksSteps.map((step, index) => {
            const Icon = icons[index];
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative"
              >
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors h-full">
                  {/* Number Badge */}
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-[#4A7BFF]/20 border border-[#4A7BFF]/30 rounded-xl mb-6">
                    <Icon className="w-6 h-6 text-[#4A7BFF]" />
                  </div>
                  
                  <div className="text-sm text-[#4A7BFF] font-bold mb-3">{step.number}</div>
                  <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{step.description}</p>
                </div>

                {/* Connector Line */}
                {index < howItWorksSteps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-white/10" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
