import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { signInWithGoogle} from '../firebase/auth';
import { ShipIcon } from 'lucide-react';

export const FinalCTA = () => {
  const { user } = useAuth();
  return (
    <section className="relative py-15 px-6 border-b border-white/20">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-6xl md:text-7xl font-bold text-white mb-8 leading-tight">
            Stop starting.
            <br />
            Start finishing.
          </h2>
          <button onClick={signInWithGoogle} className="px-12 py-5 bg-[#FF6B35] hover:bg-[#ff7d4d] cursor-pointer text-white text-lg font-semibold rounded-full transition-all hover:scale-105">
            Start Building
          </button>
        </motion.div>
      </div>
    </section>
  );
};
