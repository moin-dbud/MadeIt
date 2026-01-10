import { useState } from "react";
import { Lock, CheckCircle2, Circle, ChevronDown, ChevronUp, Target, Calendar, AlertCircle, Clock, XCircle, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TaskItem from "./TaskItem";

export default function MilestoneCard({
    milestone,
    projectId,
    status,
    completedTasks = [],
    onTaskComplete,
    onSubmit,
    canSubmit,
    submission // New prop: contains { submittedAt, proofs, verificationStatus, adminNote, etc }
}) {
    const [isExpanded, setIsExpanded] = useState(status === 'unlocked');

    const getStatusIcon = () => {
        switch (status) {
            case 'completed':
                return <CheckCircle2 size={24} className="text-green-400" />;
            case 'unlocked':
                return <Circle size={24} className="text-[#FF6B35]" />;
            case 'locked':
            default:
                return <Lock size={24} className="text-[#606060]" />;
        }
    };

    const getStatusColor = () => {
        switch (status) {
            case 'completed':
                return 'border-green-400/30 bg-green-400/5';
            case 'unlocked':
                return 'border-[#FF6B35]/30 bg-[#FF6B35]/5';
            case 'locked':
            default:
                return 'border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.02)]';
        }
    };

    const getStatusText = () => {
        switch (status) {
            case 'completed':
                return 'Completed';
            case 'unlocked':
                return 'In Progress';
            case 'locked':
            default:
                return 'Locked';
        }
    };

    const completedTaskCount = milestone.tasks.filter(task => {
        const taskKey = `${milestone.milestoneId}-${task.taskId}`;
        return completedTasks.includes(taskKey);
    }).length;

    const progress = (completedTaskCount / milestone.tasks.length) * 100;

    return (
        <div className={`border rounded-xl overflow-hidden transition-all ${getStatusColor()}`}>
            {/* Header */}
            <button
                onClick={() => status !== 'locked' && setIsExpanded(!isExpanded)}
                disabled={status === 'locked'}
                className="w-full p-6 flex items-start gap-4 hover:bg-[rgba(255,255,255,0.02)] transition-colors disabled:cursor-not-allowed"
            >
                {/* Status Icon */}
                <div className="flex-shrink-0 mt-1">
                    {getStatusIcon()}
                </div>

                {/* Content */}
                <div className="flex-1 text-left">
                    <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-1">
                                {milestone.title}
                            </h3>
                            <p className="text-sm text-[#A0A0A0]">
                                {milestone.description}
                            </p>
                        </div>
                        <span className={`
                            px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap
                            ${status === 'completed' ? 'bg-green-400/20 text-green-400' :
                                status === 'unlocked' ? 'bg-[#FF6B35]/20 text-[#FF6B35]' :
                                    'bg-[rgba(255,255,255,0.1)] text-[#606060]'}
                        `}>
                            {getStatusText()}
                        </span>
                    </div>

                    {/* Progress Bar */}
                    {status !== 'locked' && (
                        <div className="mt-3">
                            <div className="flex items-center justify-between text-xs text-[#A0A0A0] mb-2">
                                <span>{completedTaskCount} of {milestone.tasks.length} tasks completed</span>
                                <span>{Math.round(progress)}%</span>
                            </div>
                            <div className="h-2 bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                    className={`h-full ${status === 'completed' ? 'bg-green-400' : 'bg-[#FF6B35]'
                                        }`}
                                />
                            </div>
                        </div>
                    )}

                    {/* Proof Count */}
                    <div className="mt-3 flex items-center gap-4 text-xs text-[#606060]">
                        <span className="flex items-center gap-1">
                            <Target size={12} />
                            {milestone.requiredProofs.length} proof{milestone.requiredProofs.length !== 1 ? 's' : ''} required
                        </span>
                    </div>
                </div>

                {/* Expand Icon */}
                {status !== 'locked' && (
                    <div className="flex-shrink-0 mt-1">
                        {isExpanded ? (
                            <ChevronUp size={20} className="text-[#A0A0A0]" />
                        ) : (
                            <ChevronDown size={20} className="text-[#A0A0A0]" />
                        )}
                    </div>
                )}
            </button>

            {/* Expanded Content */}
            <AnimatePresence>
                {isExpanded && status !== 'locked' && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="px-6 pb-6 space-y-4">
                            {/* Tasks List */}
                            <div className="space-y-2">
                                <h4 className="text-sm font-medium text-white mb-3">Tasks</h4>
                                {milestone.tasks.map((task) => {
                                    const taskKey = `${milestone.milestoneId}-${task.taskId}`;
                                    const isCompleted = completedTasks.includes(taskKey);

                                    return (
                                        <TaskItem
                                            key={task.taskId}
                                            task={task}
                                            completed={isCompleted}
                                            onComplete={() => onTaskComplete(milestone.milestoneId, task.taskId)}
                                            disabled={status === 'completed'}
                                        />
                                    );
                                })}
                            </div>

                            {/* Submit Button */}
                            {status === 'unlocked' && (
                                <div className="pt-4 border-t border-[rgba(255,255,255,0.1)]">
                                    {!canSubmit && (
                                        <div className="mb-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-start gap-2">
                                            <AlertCircle size={16} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                                            <p className="text-xs text-yellow-400">
                                                Complete all tasks before submitting this milestone
                                            </p>
                                        </div>
                                    )}
                                    <button
                                        onClick={onSubmit}
                                        disabled={!canSubmit || submission}
                                        className="w-full px-6 py-3 rounded-lg bg-[#FF6B35] text-white font-medium hover:bg-[#FF8555] transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#FF6B35]"
                                    >
                                        {submission ? 'Already Submitted' : canSubmit ? 'Submit Milestone' : 'Complete all tasks first'}
                                    </button>
                                </div>
                            )}

                            {/* Verification Status Badges */}
                            {submission && (
                                <div className="pt-4 border-t border-[rgba(255,255,255,0.1)]">
                                    {submission.verificationStatus === 'under_review' && (
                                        <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Clock size={16} className="text-blue-400" />
                                                <p className="text-sm text-blue-400 font-medium">Milestone submitted · Verification under review</p>
                                            </div>
                                            <p className="text-xs text-blue-400/70 ml-6">Your submission is being reviewed by an admin</p>
                                        </div>
                                    )}
                                    {submission.verificationStatus === 'verified' && (
                                        <div className="p-3 bg-green-400/10 border border-green-400/20 rounded-lg flex items-center gap-2">
                                            <ShieldCheck size={16} className="text-green-400" />
                                            <p className="text-sm text-green-400 font-medium">MadeIt Verified ✓</p>
                                        </div>
                                    )}
                                    {submission.verificationStatus === 'flagged' && (
                                        <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                                            <div className="flex items-center gap-2 mb-1">
                                                <AlertCircle size={16} className="text-yellow-400" />
                                                <p className="text-sm text-yellow-400 font-medium">Under review · Flagged for clarification</p>
                                            </div>
                                            {submission.adminNote && <p className="text-xs text-yellow-400/80 ml-6 mt-1">Admin note: {submission.adminNote}</p>}
                                        </div>
                                    )}
                                    {submission.verificationStatus === 'rejected' && (
                                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                                            <div className="flex items-center gap-2 mb-1">
                                                <XCircle size={16} className="text-red-400" />
                                                <p className="text-sm text-red-400 font-medium">Submission rejected</p>
                                            </div>
                                            {submission.adminNote && <p className="text-xs text-red-400/80 ml-6 mt-1">Reason: {submission.adminNote}</p>}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Completed Badge */}
                            {status === 'completed' && (
                                <div className="pt-4 border-t border-[rgba(255,255,255,0.1)]">
                                    <div className="p-3 bg-green-400/10 border border-green-400/20 rounded-lg flex items-center gap-2">
                                        <CheckCircle2 size={16} className="text-green-400" />
                                        <p className="text-sm text-green-400 font-medium">
                                            Milestone Completed
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Locked Message */}
            {status === 'locked' && (
                <div className="px-6 pb-6">
                    <div className="p-4 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-lg flex items-center gap-3">
                        <Lock size={16} className="text-[#606060]" />
                        <p className="text-sm text-[#606060]">
                            Complete the previous milestone to unlock
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
