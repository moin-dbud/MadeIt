import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

export const WhyMadeIt = () => {
  const comparisons = [
    {
      type: "Courses",
      problem: "Theory without execution. You watch, but never build."
    },
    {
      type: "Certificates",
      problem: "Proof of completion, not proof of skill. Employers don't care."
    },
    {
      type: "Bootcamps",
      problem: "Structured, but temporary. What happens after you graduate?"
    }
  ];

  return (
    <section id="why" className="relative py-10 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-white mb-6">Why MadeIt</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Most learning platforms focus on consumption. MadeIt focuses on execution.
          </p>
        </motion.div>

        <div className="space-y-6 mb-12">
          {comparisons.map((item, index) => (
            <motion.div
              key={item.type}
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-red-500/10 border border-red-500/20 rounded-lg">
                  <X className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.type}</h3>
                  <p className="text-gray-400">{item.problem}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="backdrop-blur-xl bg-[#4A7BFF]/10 border border-[#4A7BFF]/30 rounded-2xl p-8 text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-4">MadeIt is different.</h3>
          <p className="text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto">
            We don't teach. We don't certify. We help you finish real projects and convert your progress into portable proof of work that speaks for itself.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
