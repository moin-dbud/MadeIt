import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertCircle, CheckCircle2, Upload, Link as LinkIcon, Code, FileText } from "lucide-react";
import { fetchRepoCommits, parseGitHubUrl } from "../services/github.service";
import ProofInput from "./ProofInput";

export default function SubmissionModal({
    isOpen,
    onClose,
    milestone,
    projectId,
    githubRepo,
    onSubmit
}) {
    const [proofData, setProofData] = useState({});
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // GitHub commits state
    const [githubCommits, setGithubCommits] = useState([]);
    const [githubLoading, setGithubLoading] = useState(false);
    const [githubError, setGithubError] = useState(null);

    // Fetch GitHub commits when modal opens
    useEffect(() => {
        if (isOpen && githubRepo && milestone) {
            const hasGitHubProof = milestone.requiredProofs.some(p => p.autoFetch);
            if (hasGitHubProof) {
                fetchGitHubData();
            }
        }
    }, [isOpen, githubRepo, milestone]);

    const fetchGitHubData = async () => {
        setGithubLoading(true);
        setGithubError(null);

        try {
            const parsed = parseGitHubUrl(githubRepo);
            if (!parsed) {
                throw new Error("Invalid GitHub URL");
            }

            const commits = await fetchRepoCommits(parsed.owner, parsed.repo);
            setGithubCommits(commits);
        } catch (error) {
            console.error("Error fetching GitHub commits:", error);
            setGithubError(error.message);
        } finally {
            setGithubLoading(false);
        }
    };

    const handleProofChange = (proofId, value) => {
        setProofData(prev => ({
            ...prev,
            [proofId]: value
        }));

        // Clear error for this proof
        if (errors[proofId]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[proofId];
                return newErrors;
            });
        }
    };

    const validateProofs = () => {
        const newErrors = {};

        milestone.requiredProofs.forEach(proof => {
            if (proof.required && !proofData[proof.proofId]) {
                newErrors[proof.proofId] = `${proof.label} is required`;
            }

            // Type-specific validation
            const value = proofData[proof.proofId];
            if (value) {
                switch (proof.type) {
                    case 'url':
                        try {
                            new URL(value);
                        } catch {
                            newErrors[proof.proofId] = "Please enter a valid URL";
                        }
                        break;

                    case 'reflection':
                        const wordCount = value.trim().split(/\s+/).length;
                        if (proof.minWords && wordCount < proof.minWords) {
                            newErrors[proof.proofId] = `Minimum ${proof.minWords} words required (current: ${wordCount})`;
                        }
                        if (proof.maxWords && wordCount > proof.maxWords) {
                            newErrors[proof.proofId] = `Maximum ${proof.maxWords} words allowed (current: ${wordCount})`;
                        }
                        break;

                    case 'code_snippet':
                        const lines = value.split('\n').length;
                        if (proof.maxLines && lines > proof.maxLines) {
                            newErrors[proof.proofId] = `Maximum ${proof.maxLines} lines allowed (current: ${lines})`;
                        }
                        break;

                    case 'github_commit_range':
                        if (!value.commitRangeStart || !value.commitRangeEnd) {
                            newErrors[proof.proofId] = "Please select a commit range";
                        }
                        break;
                }
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateProofs()) {
            return;
        }

        setSubmitting(true);
        try {
            await onSubmit(milestone.milestoneId, proofData);
            // Reset form
            setProofData({});
            setErrors({});
            onClose();
        } catch (error) {
            console.error("Error submitting milestone:", error);
            setErrors({ submit: error.message });
        } finally {
            setSubmitting(false);
        }
    };

    if (!milestone) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-[#0A0A0A] border border-[rgba(255,255,255,0.1)] rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-[rgba(255,255,255,0.1)]">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="text-2xl font-semibold text-white mb-2">
                                        Submit Milestone: {milestone.title}
                                    </h2>
                                    <p className="text-sm text-[#A0A0A0]">
                                        {milestone.description}
                                    </p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-[rgba(255,255,255,0.05)] rounded-lg transition-colors"
                                >
                                    <X size={20} className="text-[#A0A0A0]" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {githubLoading && (
                                <div className="mb-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                    <div className="text-sm text-blue-400 flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                                        Fetching commits from GitHub...
                                    </div>
                                </div>
                            )}

                            {/* GitHub Error */}
                            {githubError && (
                                <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                                    <p className="text-sm text-red-400 flex items-center gap-2">
                                        <AlertCircle size={16} />
                                        {githubError}
                                    </p>
                                </div>
                            )}

                            {/* Proof Inputs */}
                            <div className="space-y-6">
                                {milestone.requiredProofs.map((proof, index) => (
                                    <div key={proof.proofId}>
                                        <ProofInput
                                            proof={proof}
                                            value={proofData[proof.proofId]}
                                            onChange={(value) => handleProofChange(proof.proofId, value)}
                                            error={errors[proof.proofId]}
                                            githubCommits={githubCommits}
                                            githubLoading={githubLoading}
                                        />
                                        {index < milestone.requiredProofs.length - 1 && (
                                            <div className="mt-6 border-t border-[rgba(255,255,255,0.05)]"></div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Submit Error */}
                            {errors.submit && (
                                <div className="mt-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                                    <p className="text-sm text-red-400 flex items-center gap-2">
                                        <AlertCircle size={16} />
                                        {errors.submit}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.02)]">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-[#A0A0A0]">
                                    {milestone.requiredProofs.length} proof{milestone.requiredProofs.length !== 1 ? 's' : ''} required
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={onClose}
                                        className="px-4 py-2 rounded-lg border border-[rgba(255,255,255,0.1)] text-sm font-medium hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={submitting}
                                        className="px-6 py-2 rounded-lg bg-[#FF6B35] text-white text-sm font-medium hover:bg-[#FF8555] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {submitting ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Submitting...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle2 size={16} />
                                                Submit Milestone
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
