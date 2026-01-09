import { UserX, ArrowRight, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * PortfolioNotFound Component
 * 
 * Clean 404 page for non-existent portfolios
 * Includes CTA to create own portfolio
 */
export default function PortfolioNotFound({ username }) {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl w-full text-center"
            >
                {/* Icon */}
                <div className="mb-8 flex justify-center">
                    <div className="w-24 h-24 rounded-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] flex items-center justify-center">
                        <UserX size={48} className="text-[#A0A0A0]" />
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-4xl font-bold mb-4">
                    Portfolio Not Found
                </h1>

                {/* Message */}
                <p className="text-lg text-[#A0A0A0] mb-2">
                    {username ? (
                        <>The portfolio <span className="text-white font-medium">@{username}</span> does not exist or has been removed.</>
                    ) : (
                        <>The portfolio you're looking for doesn't exist.</>
                    )}
                </p>
                <p className="text-sm text-[#A0A0A0] mb-8">
                    It may have been deleted, made private, or the username might be incorrect.
                </p>

                {/* CTA Section */}
                <div className="p-8 rounded-2xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] mb-8">
                    <h2 className="text-2xl font-semibold mb-3">
                        Create Your Own Portfolio
                    </h2>
                    <p className="text-[#A0A0A0] mb-6">
                        Build real projects, prove your skills, and create a portfolio that recruiters trust.
                        No fake projects, just real work.
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-3 rounded-xl bg-[#FF6B35] text-white font-medium flex items-center gap-2 hover:bg-[#FF6B35]/90 transition-colors mx-auto"
                    >
                        Get Started on MadeIt
                        <ArrowRight size={18} />
                    </button>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-center gap-4">
                    <button
                        onClick={() => navigate('/')}
                        className="px-4 py-2 rounded-lg border border-[rgba(255,255,255,0.1)] text-sm font-medium flex items-center gap-2 hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                    >
                        <Home size={16} />
                        Go Home
                    </button>
                    <button
                        onClick={() => window.history.back()}
                        className="px-4 py-2 rounded-lg border border-[rgba(255,255,255,0.1)] text-sm font-medium hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                    >
                        Go Back
                    </button>
                </div>

                {/* Help Text */}
                <p className="text-xs text-[#A0A0A0] mt-8">
                    If you believe this is an error, please contact support.
                </p>
            </motion.div>
        </div>
    );
}

/**
 * PrivatePortfolio Component
 * 
 * Message for private/unlisted portfolios
 */
export function PrivatePortfolio({ username }) {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl w-full text-center"
            >
                {/* Icon */}
                <div className="mb-8 flex justify-center">
                    <div className="w-24 h-24 rounded-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] flex items-center justify-center">
                        <UserX size={48} className="text-[#A0A0A0]" />
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-4xl font-bold mb-4">
                    Private Portfolio
                </h1>

                {/* Message */}
                <p className="text-lg text-[#A0A0A0] mb-8">
                    {username ? (
                        <>The portfolio <span className="text-white font-medium">@{username}</span> is private and not publicly accessible.</>
                    ) : (
                        <>This portfolio is private and not publicly accessible.</>
                    )}
                </p>

                {/* Actions */}
                <div className="flex items-center justify-center gap-4">
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-3 rounded-xl bg-[#FF6B35] text-white font-medium flex items-center gap-2 hover:bg-[#FF6B35]/90 transition-colors"
                    >
                        <Home size={18} />
                        Go Home
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
