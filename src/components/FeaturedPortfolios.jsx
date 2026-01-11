import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Code, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { getFeaturedPortfolios } from '../utils/sitemap';

/**
 * FeaturedPortfolios Component
 * 
 * Displays featured public portfolios on the landing page
 * to showcase real proof-of-work and drive discovery.
 */
export function FeaturedPortfolios() {
    const [portfolios, setPortfolios] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPortfolios = async () => {
            try {
                const featured = await getFeaturedPortfolios(6);
                setPortfolios(featured);
            } catch (error) {
                console.error('Error fetching featured portfolios:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPortfolios();
    }, []);

    if (loading) {
        return (
            <section className="py-20 bg-[#0A0A0A]">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Real Proof-of-Work Portfolios
                        </h2>
                        <p className="text-[#A0A0A0] text-lg">
                            See what others are building
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="p-6 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] animate-pulse"
                            >
                                <div className="h-16 w-16 rounded-full bg-[rgba(255,255,255,0.05)] mb-4"></div>
                                <div className="h-6 bg-[rgba(255,255,255,0.05)] rounded mb-2"></div>
                                <div className="h-4 bg-[rgba(255,255,255,0.05)] rounded w-2/3 mb-4"></div>
                                <div className="h-4 bg-[rgba(255,255,255,0.05)] rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (portfolios.length === 0) {
        return null; // Don't show section if no portfolios
    }

    return (
        <section className="py-20 bg-[#0A0A0A]">
            <div className="max-w-7xl mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Real Proof-of-Work Portfolios
                    </h2>
                    <p className="text-[#A0A0A0] text-lg max-w-2xl mx-auto">
                        See what developers are building with MadeIt. No fake projects, just real work.
                    </p>
                </div>

                {/* Portfolio Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {portfolios.map((portfolio, index) => (
                        <motion.div
                            key={portfolio.username}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group p-6 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.05)] hover:border-[rgba(255,107,53,0.3)] transition-all cursor-pointer"
                            onClick={() => navigate(`/portfolio/${portfolio.username}`)}
                        >
                            {/* Profile Photo */}
                            <div className="flex items-start gap-4 mb-4">
                                {portfolio.photoURL ? (
                                    <img
                                        src={portfolio.photoURL}
                                        alt={portfolio.name}
                                        className="w-16 h-16 rounded-full object-cover border-2 border-[rgba(255,255,255,0.1)]"
                                    />
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-[rgba(255,107,53,0.1)] flex items-center justify-center border-2 border-[rgba(255,107,53,0.2)]">
                                        <span className="text-2xl font-bold text-[#FF6B35]">
                                            {portfolio.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold mb-1 group-hover:text-[#FF6B35] transition-colors">
                                        {portfolio.name}
                                    </h3>
                                    <p className="text-sm text-[#A0A0A0]">{portfolio.role}</p>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="flex items-center gap-4 mb-4 text-sm text-[#A0A0A0]">
                                <div className="flex items-center gap-1">
                                    <Code size={14} className="text-[#FF6B35]" />
                                    <span>
                                        {portfolio.projectCount} {portfolio.projectCount === 1 ? 'project' : 'projects'}
                                    </span>
                                </div>
                                {portfolio.activeDays > 0 && (
                                    <div className="flex items-center gap-1">
                                        <Calendar size={14} className="text-[#FF6B35]" />
                                        <span>{portfolio.activeDays} days</span>
                                    </div>
                                )}
                            </div>

                            {/* Skills */}
                            {portfolio.skills && portfolio.skills.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {portfolio.skills.slice(0, 3).map((skill, i) => (
                                        <span
                                            key={i}
                                            className="px-2 py-1 rounded-md bg-[rgba(255,107,53,0.1)] text-[#FF6B35] text-xs"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                    {portfolio.skills.length > 3 && (
                                        <span className="px-2 py-1 rounded-md bg-[rgba(255,255,255,0.05)] text-[#A0A0A0] text-xs">
                                            +{portfolio.skills.length - 3}
                                        </span>
                                    )}
                                </div>
                            )}

                            {/* View Portfolio Link */}
                            <div className="flex items-center gap-2 text-sm text-[#FF6B35] group-hover:gap-3 transition-all">
                                <span>View Portfolio</span>
                                <ArrowRight size={16} />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* CTA */}
                <div className="text-center">
                    <p className="text-[#A0A0A0] mb-4">
                        Ready to build your own proof-of-work portfolio?
                    </p>
                    <button
                        onClick={() => navigate('/login')}
                        className="px-6 py-3 cursor-pointer rounded-xl bg-[#FF6B35] text-white font-medium hover:bg-[#FF6B35]/90 transition-colors inline-flex items-center gap-2"
                    >
                        Get Started
                        <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </section>
    );
}
