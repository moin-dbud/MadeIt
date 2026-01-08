import React from 'react';
import { motion } from 'framer-motion';
import { X, CheckCircle } from 'lucide-react';

export const ProblemSolution = () => {
  return (
    <section className="relative py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Problem */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full">
              <X className="w-4 h-4 text-red-400" />
              <span className="text-sm text-red-400 font-medium">The Problem</span>
            </div>
            <h2 className="text-4xl font-bold text-white leading-tight">Students start projects.</h2>
            <div className="space-y-4">
              <p className="text-lg text-gray-400">Never finish them.</p>
              <p className="text-lg text-gray-400">Have nothing to show.</p>
              <p className="text-lg text-gray-400">Can't prove what they know.</p>
            </div>
          </motion.div>

          {/* Solution */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#4A7BFF]/10 border border-[#4A7BFF]/20 rounded-full">
              <CheckCircle className="w-4 h-4 text-[#4A7BFF]" />
              <span className="text-sm text-[#4A7BFF] font-medium">The Solution</span>
            </div>
            <h2 className="text-4xl font-bold text-white leading-tight">MadeIt makes you finish.</h2>
            <div className="space-y-4">
              <p className="text-lg text-gray-300">Breaks work into milestones.</p>
              <p className="text-lg text-gray-300">Forces completion.</p>
              <p className="text-lg text-gray-300">Generates proof automatically.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
