import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check, Linkedin } from "lucide-react";
import { useState } from "react";

export default function SharePortfolioModal({ isOpen, onClose, username }) {
    const [copied, setCopied] = useState(false);

    const portfolioUrl = `https://madeit.app/u/${username}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(portfolioUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleLinkedInShare = () => {
        const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(portfolioUrl)}`;
        window.open(linkedInUrl, '_blank', 'width=600,height=600');
    };

    const handleTwitterShare = () => {
        const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(portfolioUrl)}&text=${encodeURIComponent('Check out my developer portfolio on MadeIt!')}`;
        window.open(twitterUrl, '_blank', 'width=600,height=400');
    };

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
                        className="bg-[#0A0A0A] border border-[rgba(255,255,255,0.1)] rounded-2xl max-w-md w-full p-6"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-white">Share Portfolio</h2>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-[rgba(255,255,255,0.05)] rounded-lg transition-colors"
                            >
                                <X size={20} className="text-[#A0A0A0]" />
                            </button>
                        </div>

                        {/* Portfolio URL */}
                        <div className="mb-6">
                            <label className="text-sm text-[#A0A0A0] mb-2 block">Portfolio URL</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={portfolioUrl}
                                    readOnly
                                    className="flex-1 px-4 py-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg text-white text-sm font-mono"
                                />
                                <button
                                    onClick={handleCopy}
                                    className="px-4 py-3 bg-[#FF6B35] hover:bg-[#FF8555] text-white rounded-lg transition-colors flex items-center gap-2"
                                >
                                    {copied ? (
                                        <>
                                            <Check size={16} />
                                            Copied
                                        </>
                                    ) : (
                                        <>
                                            <Copy size={16} />
                                            Copy
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Social Share Buttons */}
                        <div>
                            <label className="text-sm text-[#A0A0A0] mb-3 block">Share on social media</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={handleLinkedInShare}
                                    className="px-4 py-3 bg-[#0A66C2] hover:bg-[#004182] text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    <Linkedin size={18} />
                                    LinkedIn
                                </button>
                                <button
                                    onClick={handleTwitterShare}
                                    className="px-4 py-3 bg-[#1DA1F2] hover:bg-[#0C8BD9] text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                    </svg>
                                    X / Twitter
                                </button>
                            </div>
                        </div>

                        {/* Info */}
                        <div className="mt-6 p-3 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-lg">
                            <p className="text-xs text-[#A0A0A0]">
                                This portfolio is <span className="text-white font-medium">public</span> and recruiter-friendly.
                                It updates automatically as you complete milestones.
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
