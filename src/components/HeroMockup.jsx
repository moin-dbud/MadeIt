import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Download, Code, Rocket, Calendar, Flame, Clock } from 'lucide-react';

export const HeroMockup = () => {
  return (
    <section id="portfolio" className="relative py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
        >
          {/* HERO SECTION - Profile Header */}
          <div className="border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent">
            <div className="p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6">
                {/* Profile Photo */}
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white/10 flex-shrink-0 bg-[rgba(255,107,53,0.2)] flex items-center justify-center">
                  <span className="text-[#FF6B35] font-bold text-3xl">YN</span>
                </div>

                {/* Info */}
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                    Your Name
                  </h1>
                  <p className="text-lg md:text-xl text-[#FF6B35] mb-3">
                    Developer
                  </p>
                  <p className="text-sm text-gray-400 max-w-2xl">
                    Building real products. Currently focused on frontend architecture and scalable APIs.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-6">
                <button className="px-4 py-2 rounded-lg border border-white/10 text-sm font-medium flex items-center gap-2 hover:bg-white/5 transition-colors">
                  <Github size={16} />
                  GitHub
                </button>
                <button className="px-4 py-2 rounded-lg border border-white/10 text-sm font-medium flex items-center gap-2 hover:bg-white/5 transition-colors">
                  <Linkedin size={16} />
                  LinkedIn
                </button>
                <button className="px-4 py-2 rounded-lg bg-[#FF6B35] hover:bg-[#ff7d4d] text-white text-sm font-medium flex items-center gap-2 transition-colors">
                  <Download size={16} />
                  Download PDF
                </button>
              </div>

              {/* Stats Line */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1.5">
                  <Rocket size={14} className="text-[#FF6B35]" />
                  <span>0 Projects</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-[#FF6B35]" />
                  <span>2 Active Days</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Clock size={14} className="text-[#FF6B35]" />
                  <span>Updated Today</span>
                </div>
              </div>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="p-8 space-y-8">
            {/* SKILLS SECTION */}
            <div>
              <h2 className="text-xl font-semibold tracking-tight mb-4">Skills Proven Through Work</h2>
              <div className="p-12 rounded-xl bg-white/5 border border-white/10 text-center">
                <div className="w-12 h-12 rounded-full bg-[rgba(255,107,53,0.1)] flex items-center justify-center mx-auto mb-3">
                  <Code size={24} className="text-[#FF6B35]" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No Skills Unlocked Yet</h3>
                <p className="text-sm text-gray-400 max-w-md mx-auto">
                  Complete milestones in your projects to unlock and showcase skills you've proven through real work.
                </p>
              </div>
            </div>

            {/* PROJECTS SECTION */}
            <div>
              <h2 className="text-xl font-semibold tracking-tight mb-4">Projects (0)</h2>
              <div className="p-12 rounded-xl bg-white/5 border border-white/10 text-center">
                <div className="w-12 h-12 rounded-full bg-[rgba(255,107,53,0.1)] flex items-center justify-center mx-auto mb-3">
                  <Rocket size={24} className="text-[#FF6B35]" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No Projects Started Yet</h3>
                <p className="text-sm text-gray-400 max-w-md mx-auto mb-4">
                  Your portfolio will showcase real projects you build. Start your first project to begin your journey.
                </p>
                <button className="px-6 py-2.5 rounded-lg bg-[#FF6B35] hover:bg-[#ff7d4d] text-white text-sm font-medium transition-colors">
                  Choose a Project
                </button>
              </div>
            </div>

            {/* WORK DISCIPLINE SECTION */}
            <div>
              <h2 className="text-xl font-semibold tracking-tight mb-4">Work Discipline</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-6 rounded-xl border border-white/10 bg-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar size={16} className="text-[#FF6B35]" />
                    <p className="text-xs text-gray-400">Active Days</p>
                  </div>
                  <p className="text-2xl font-semibold">0</p>
                </div>

                <div className="p-6 rounded-xl border border-white/10 bg-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Flame size={16} className="text-[#FF6B35]" />
                    <p className="text-xs text-gray-400">Longest Streak</p>
                  </div>
                  <p className="text-2xl font-semibold">0</p>
                </div>

                <div className="p-6 rounded-xl border border-white/10 bg-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock size={16} className="text-[#FF6B35]" />
                    <p className="text-xs text-gray-400">Avg Pace</p>
                  </div>
                  <p className="text-2xl font-semibold">-</p>
                </div>

                <div className="p-6 rounded-xl border border-white/10 bg-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock size={16} className="text-[#FF6B35]" />
                    <p className="text-xs text-gray-400">Last Active</p>
                  </div>
                  <p className="text-sm font-medium">Never</p>
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="pt-6 border-t border-white/10">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Rocket size={16} className="text-[#FF6B35]" />
                  <span>
                    Built on <span className="text-white font-medium">MadeIt</span> · Portfolio auto-generated from verified work
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Clock size={14} />
                    <span>Last updated today</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
