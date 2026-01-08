import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { portfolioMockData } from '../mock';

export const HeroMockup = () => {
  const { user, projects, recentActivity, skills } = portfolioMockData;
  const displayedProjects = projects.slice(0, 2);

  return (
    <section id="portfolio" className="relative py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl"
        >
          {/* User Identity */}
          <div className="flex items-center justify-between mb-8 pb-8 border-b flex-col border-white/10">
            <div className="flex items-center gap-4">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-16 h-16 rounded-full border-2 border-white/20"
              />
              <div>
                <h3 className="text-2xl w-full font-bold text-white">{user.name}</h3>
                <p className="text-gray-400">{user.role}</p>
              </div>
            </div>
            <div className="px-4 py-2 mt-6 bg-[#4A7BFF]/20 border border-[#4A7BFF]/30 rounded-full">
              <span className="text-sm text-[#4A7BFF] font-medium">{user.status}</span>
            </div>
          </div>

          {/* Project Cards */}
          <div className="space-y-4 mb-8">
            <h4 className="text-lg font-semibold text-white mb-4">Active Projects</h4>
            {displayedProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
                className="p-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl cursor-pointer transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h5 className="text-xl font-semibold text-white mb-1">{project.title}</h5>
                    <p className="text-sm text-gray-400">{project.category}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{project.daysActive} days</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-400">
                      {project.completedMilestones}/{project.milestones} milestones
                    </span>
                    <span className="text-[#4A7BFF] font-semibold">{project.progress}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${project.progress}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                      className="h-full bg-gradient-to-r from-[#4A7BFF] to-[#6B95FF] rounded-full"
                    />
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#4A7BFF]/10 border border-[#4A7BFF]/20 rounded-full">
                  <TrendingUp className="w-3 h-3 text-[#4A7BFF]" />
                  <span className="text-xs text-[#4A7BFF] font-medium">{project.status}</span>
                </div>
              </motion.div>
            ))}
            
            {/* More Projects Indicator */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-4 bg-white/5 border border-white/10 rounded-2xl text-center cursor-pointer hover:bg-white/10 transition-colors"
            >
              <span className="text-sm text-gray-400">+1 more project</span>
            </motion.div>
          </div>

          {/* Recent Activity */}
          <div className="mb-8 pb-8 border-b border-white/10">
            <h4 className="text-lg font-semibold text-white mb-4">Recent Activity</h4>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start gap-3 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                >
                  <CheckCircle className="w-5 h-5 text-[#4A7BFF] mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-white text-sm mb-1">{activity.task}</p>
                    <p className="text-xs text-gray-400">
                      {activity.project} • {activity.timestamp}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Skills Proven by Work</h4>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  className="px-4 py-2 bg-white/10 border border-white/20 rounded-full cursor-pointer hover:bg-white/20 transition-colors"
                >
                  <span className="text-sm text-white font-medium">{skill.name}</span>
                  <span className="text-xs text-gray-400 ml-2">({skill.count})</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
