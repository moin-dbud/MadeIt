import { X, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

/**
 * FeedbackModal Component
 * 
 * Collects user feedback after milestones/projects
 * - Shows after first milestone completion
 * - Shows after first project completion
 * - Optional, skippable, max 300 characters
 */
export default function FeedbackModal({ isOpen, onClose, onSubmit, type = 'first_milestone' }) {
    const [feedback, setFeedback] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const titles = {
        first_milestone: '🎉 Congrats on your first milestone!',
        first_project: '🚀 Amazing! You completed your first project!',
        general: 'Share Your Feedback'
    };

    const questions = {
        first_milestone: 'What was confusing or difficult during this milestone?',
        first_project: 'What was the most challenging part of this project?',
        general: 'How can we improve your experience?'
    };

    const handleSubmit = async () => {
        if (!feedback.trim()) {
            handleSkip();
            return;
        }

        setIsSubmitting(true);
        await onSubmit(feedback.substring(0, 300));
        setIsSubmitting(false);
        setFeedback('');
        onClose();
    };

    const handleSkip = () => {
        setFeedback('');
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleSkip}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="w-full max-w-md bg-[#1A1A1A] rounded-2xl border border-[rgba(255,255,255,0.1)] shadow-2xl overflow-hidden"
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-[rgba(255,255,255,0.08)]">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-[rgba(255,107,53,0.1)] flex items-center justify-center">
                                            <MessageSquare size={20} className="text-[#FF6B35]" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-white">
                                                {titles[type]}
                                            </h3>
                                            <p className="text-sm text-[#A0A0A0] mt-1">
                                                Help us improve MadeIt
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleSkip}
                                        className="text-[#A0A0A0] hover:text-white transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <label className="block text-sm font-medium text-white mb-3">
                                    {questions[type]}
                                </label>
                                <textarea
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    placeholder="Share your experience (optional, max 300 characters)"
                                    maxLength={300}
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white placeholder-[#666] focus:outline-none focus:border-[#FF6B35] transition-colors resize-none"
                                />
                                <div className="flex items-center justify-between mt-2">
                                    <p className="text-xs text-[#666]">
                                        Your feedback helps us improve
                                    </p>
                                    <p className="text-xs text-[#666]">
                                        {feedback.length}/300
                                    </p>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-6 bg-[rgba(255,255,255,0.02)] border-t border-[rgba(255,255,255,0.08)] flex items-center justify-end gap-3">
                                <button
                                    onClick={handleSkip}
                                    disabled={isSubmitting}
                                    className="px-4 py-2 rounded-lg text-sm font-medium text-[#A0A0A0] hover:text-white transition-colors disabled:opacity-50"
                                >
                                    Skip
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="px-6 py-2 rounded-lg bg-[#FF6B35] text-white text-sm font-medium hover:bg-[#FF6B35]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}

/**
 * FeedbackPrompt Component
 * 
 * Inline prompt for feedback (alternative to modal)
 * Can be used in dashboard or after milestone completion
 */
export function FeedbackPrompt({ type, onSubmit, onDismiss, className = '' }) {
    const [feedback, setFeedback] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!feedback.trim()) return;

        setIsSubmitting(true);
        await onSubmit(feedback.substring(0, 300));
        setIsSubmitting(false);
        setFeedback('');
        setIsExpanded(false);
    };

    if (!isExpanded) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl bg-[rgba(255,107,53,0.05)] border border-[rgba(255,107,53,0.2)] ${className}`}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <MessageSquare size={18} className="text-[#FF6B35]" />
                        <p className="text-sm text-white">
                            Help us improve! Share your experience
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsExpanded(true)}
                            className="px-3 py-1.5 rounded-lg bg-[#FF6B35] text-white text-xs font-medium hover:bg-[#FF6B35]/90 transition-colors"
                        >
                            Give Feedback
                        </button>
                        <button
                            onClick={onDismiss}
                            className="text-[#A0A0A0] hover:text-white transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className={`p-4 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] ${className}`}
        >
            <div className="flex items-start justify-between mb-3">
                <p className="text-sm font-medium text-white">
                    What was confusing or difficult?
                </p>
                <button
                    onClick={() => setIsExpanded(false)}
                    className="text-[#A0A0A0] hover:text-white transition-colors"
                >
                    <X size={16} />
                </button>
            </div>
            <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Share your experience (optional, max 300 characters)"
                maxLength={300}
                rows={3}
                className="w-full px-3 py-2 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white text-sm placeholder-[#666] focus:outline-none focus:border-[#FF6B35] transition-colors resize-none mb-3"
            />
            <div className="flex items-center justify-between">
                <p className="text-xs text-[#666]">{feedback.length}/300</p>
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !feedback.trim()}
                    className="px-4 py-1.5 rounded-lg bg-[#FF6B35] text-white text-xs font-medium hover:bg-[#FF6B35]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
            </div>
        </motion.div>
    );
}
