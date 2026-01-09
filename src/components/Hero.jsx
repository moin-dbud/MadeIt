import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { signInWithGoogle } from '../firebase/auth';
import { Rocket } from 'lucide-react';

export const Hero = () => {
  const { user } = useAuth();
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-28 pb-10">
      <div className="max-w-5xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-8"
        >
          <Rocket className="w-4 h-4 text-[#4A7BFF]" />
          <span className="text-sm text-gray-300">Productivity • Progress • Proof</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.1] mb-6"
        >
          Finish real projects.
          <br />
          Build proof of work.
        </motion.h1>

        {/* Supporting Copy */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed"
        >
          MadeIt helps students complete real projects using milestone-based
          execution and turns their progress into a proof-of-work portfolio.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex items-center justify-center gap-4 flex-wrap"
        >
          <button onClick={signInWithGoogle} className="px-8 py-4 bg-[#FF6B35] hover:bg-[#ff7d4d] cursor-pointer text-white font-semibold rounded-full transition-colors">
            Start Building
          </button>
          <a href="#how" className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-full border border-white/10 transition-colors inline-block">
            See How It Works
          </a>
        </motion.div>
      </div>
    </section>
  );
};
