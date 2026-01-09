import { CheckCircle2, Circle, Play, Lock, Github, ExternalLink, Calendar, GitCommit, Clock, ChevronDown, ChevronUp, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import VerifiedBadge from './VerifiedBadge';

/**
 * DetailedProjectCard Component
 * Displays project with real-time progress, milestones, and proof of work
 */
export default function DetailedProjectCard({ project, isOwner, onSubmitMilestone }) {
    const [expanded, setExpanded] = useState(false);

    // Calculate project metrics
    const totalMilestones = project.milestones?.length || 0;
    const completedMilestones = project.completedMilestones?.length || 0;
    const progressPercentage = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

    // Calculate duration
    const startDate = project.startedAt ? new Date(project.startedAt) : null;
    const endDate = project.completedAt ? new Date(project.completedAt) : new Date();
    const durationDays = startDate ? Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) : 0;

    // Format date range
    const formatDateRange = () => {
        if (!startDate) return 'Not started';
        const start = startDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        if (project.completedAt) {
            const end = new Date(project.completedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            return `${start}-${end}`;
        }
        return `${start}-Present`;
    };

    // Get project status
    const getStatus = () => {
        if (progressPercentage === 100) return { label: 'Completed', icon: CheckCircle2, color: 'text-green-500' };
        if (progressPercentage > 0) return { label: 'In Progress', icon: Play, color: 'text-[#FF6B35]' };
        return { label: 'Not Started', icon: Circle, color: 'text-[#666]' };
    };

    const status = getStatus();
    const StatusIcon = status.icon;

    // Get tech stack from milestones
    const techStack = project.techStack || [];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.08)] rounded-xl overflow-hidden hover:border-[rgba(255,107,53,0.3)] transition-all duration-300"
        >
            {/* PROJECT HEADER */}
            <div className="p-6">
                {/* Title and Status */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-semibold">{project.name}</h3>
                            {project.verified && <VerifiedBadge />}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[#A0A0A0]">
                            <span>{project.category}</span>
                            <span>•</span>
                            <span>{durationDays} days {progressPercentage < 100 ? 'so far' : ''}</span>
                            <span>•</span>
                            <span>{formatDateRange()}</span>
                        </div>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[rgba(255,255,255,0.05)] ${status.color}`}>
                        <StatusIcon size={16} />
                        <span className="text-sm font-medium">{status.label}</span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-[#A0A0A0]">{progressPercentage}% ({completedMilestones}/{totalMilestones} milestones)</span>
                    </div>
                    <div className="w-full h-2 bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercentage}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-[#FF6B35] to-[#FF8C61] rounded-full"
                        />
                    </div>
                </div>

                {/* Description */}
                <p className="text-[#A0A0A0] mb-4 leading-relaxed">
                    {project.description}
                </p>

                {/* Links and Tech Stack */}
                <div className="space-y-2 mb-4">
                    {project.liveUrl && (
                        <div className="flex items-center gap-2 text-sm">
                            <ExternalLink size={16} className="text-[#FF6B35]" />
                            <span className="text-[#A0A0A0]">Live:</span>
                            <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white hover:text-[#FF6B35] transition-colors"
                            >
                                {project.liveUrl.replace(/^https?:\/\//, '')}
                            </a>
                        </div>
                    )}
                    {project.githubRepo && (
                        <div className="flex items-center gap-2 text-sm">
                            <Github size={16} className="text-[#FF6B35]" />
                            <span className="text-[#A0A0A0]">Source:</span>
                            <a
                                href={project.githubRepo}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white hover:text-[#FF6B35] transition-colors"
                            >
                                {project.githubRepo.replace('https://github.com/', '')}
                            </a>
                        </div>
                    )}
                    {techStack.length > 0 && (
                        <div className="flex items-start gap-2 text-sm">
                            <Award size={16} className="text-[#FF6B35] mt-0.5" />
                            <span className="text-[#A0A0A0]">Stack:</span>
                            <div className="flex flex-wrap gap-2">
                                {techStack.map((tech, idx) => (
                                    <span key={idx} className="text-white">{tech}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Expand Button */}
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="w-full py-2 px-4 rounded-lg border border-[rgba(255,255,255,0.1)] text-sm font-medium flex items-center justify-center gap-2 hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                >
                    {expanded ? (
                        <>
                            Hide Milestones
                            <ChevronUp size={16} />
                        </>
                    ) : (
                        <>
                            View Project Details
                            <ChevronDown size={16} />
                        </>
                    )}
                </button>
            </div>

            {/* MILESTONES SECTION */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-[rgba(255,255,255,0.08)] overflow-hidden"
                    >
                        <div className="p-6 space-y-4">
                            <h4 className="text-lg font-semibold mb-4">MILESTONES:</h4>

                            {project.milestones?.map((milestone, index) => {
                                const isCompleted = project.completedMilestones?.includes(milestone.id);
                                const isCurrent = !isCompleted && index === completedMilestones;
                                const isLocked = !isCompleted && index > completedMilestones;

                                const submission = project.submissions?.[milestone.id];
                                const completedDate = submission?.submittedAt ? new Date(submission.submittedAt) : null;
                                const milestoneDuration = submission?.duration || 0;
                                const commitCount = submission?.commitCount || 0;

                                return (
                                    <div
                                        key={milestone.id}
                                        className={`p-4 rounded-lg border ${isCompleted
                                            ? 'border-green-500/30 bg-green-500/5'
                                            : isCurrent
                                                ? 'border-[#FF6B35]/30 bg-[#FF6B35]/5'
                                                : 'border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] opacity-60'
                                            }`}
                                    >
                                        {/* Milestone Header */}
                                        <div className="flex items-start gap-3 mb-2">
                                            {isCompleted ? (
                                                <CheckCircle2 size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                                            ) : isCurrent ? (
                                                <Play size={20} className="text-[#FF6B35] flex-shrink-0 mt-0.5" />
                                            ) : (
                                                <Circle size={20} className="text-[#666] flex-shrink-0 mt-0.5" />
                                            )}
                                            <div className="flex-1">
                                                <h5 className="font-medium">
                                                    Milestone {index + 1}: {milestone.name}
                                                    {isCurrent && <span className="text-[#FF6B35] ml-2">[CURRENT]</span>}
                                                    {isLocked && <span className="text-[#666] ml-2">[LOCKED]</span>}
                                                </h5>

                                                {/* Completed Info */}
                                                {isCompleted && completedDate && (
                                                    <div className="text-sm text-[#A0A0A0] mt-1">
                                                        Completed {completedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · {milestoneDuration} days
                                                    </div>
                                                )}

                                                {/* Current Progress */}
                                                {isCurrent && (
                                                    <div className="text-sm text-[#A0A0A0] mt-1">
                                                        Started {formatDateRange()} · {durationDays} days so far
                                                    </div>
                                                )}

                                                {/* Locked Info */}
                                                {isLocked && (
                                                    <div className="text-sm text-[#666] mt-1">
                                                        Not started yet · Prerequisites: Complete Milestone {index}
                                                    </div>
                                                )}

                                                {/* Proofs */}
                                                {isCompleted && submission?.proofs && Array.isArray(submission.proofs) && submission.proofs.length > 0 && (
                                                    <div className="mt-2 flex flex-wrap gap-2">
                                                        <span className="text-sm text-[#A0A0A0]">Proofs:</span>
                                                        {submission.proofs.map((proof, idx) => (
                                                            <a
                                                                key={idx}
                                                                href={proof.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-sm px-2 py-1 rounded bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] hover:border-[#FF6B35] transition-colors"
                                                            >
                                                                [{proof.type}]
                                                            </a>
                                                        ))}
                                                    </div>
                                                )}


                                                {/* Stats */}
                                                {(isCompleted || isCurrent) && (
                                                    <div className="mt-2 space-y-1 text-sm text-[#A0A0A0]">
                                                        <div>
                                                            Tasks: {
                                                                (() => {
                                                                    const totalTasks = milestone.tasks?.length || 0;
                                                                    if (isCompleted) {
                                                                        // Completed milestone - all tasks done
                                                                        return `${totalTasks}/${totalTasks}`;
                                                                    } else if (isCurrent && project.completedTasks) {
                                                                        // Current milestone - calculate actual completed tasks
                                                                        const milestoneTasks = milestone.tasks?.map(t => `${milestone.id}-${t.taskId}`) || [];
                                                                        const completed = milestoneTasks.filter(taskId =>
                                                                            project.completedTasks.includes(taskId)
                                                                        ).length;
                                                                        return `${completed}/${totalTasks}`;
                                                                    } else {
                                                                        // No task data available
                                                                        return `0/${totalTasks}`;
                                                                    }
                                                                })()
                                                            } completed
                                                        </div>
                                                        {commitCount > 0 && (
                                                            <div className="flex items-center gap-1">
                                                                <GitCommit size={14} />
                                                                {commitCount} commits {isCompleted ? `over ${milestoneDuration} days` : 'so far'}
                                                            </div>
                                                        )}
                                                        {submission?.notes && (
                                                            <div className="mt-2 p-2 rounded bg-[rgba(255,255,255,0.03)] text-[#A0A0A0] italic">
                                                                Notes: {submission.notes}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Submit Button for Current Milestone (Owner Only) */}
                                                {isCurrent && isOwner && onSubmitMilestone && (
                                                    <button
                                                        onClick={() => onSubmitMilestone(milestone)}
                                                        className="mt-3 px-4 py-2 rounded-lg bg-[#FF6B35] text-white text-sm font-medium hover:bg-[#FF6B35]/90 transition-colors"
                                                    >
                                                        Submit Milestone Proof
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
