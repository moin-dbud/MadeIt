import { Eye, ExternalLink, Github, Linkedin, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDuration, calculateTrend } from '../utils/analytics';

/**
 * PortfolioAnalytics Component
 * 
 * Displays portfolio performance metrics (owner only)
 * Shows views, clicks, and engagement data
 */
export default function PortfolioAnalytics({ analytics, className = '' }) {
    if (!analytics) return null;

    const { views, interactions, sessions, projects } = analytics;

    // Calculate most viewed project
    const mostViewedProject = projects ? Object.entries(projects).reduce((max, [id, data]) => {
        return (data.views || 0) > (max.views || 0) ? { id, ...data } : max;
    }, { views: 0 }) : null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-2xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] ${className}`}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold">Portfolio Performance</h3>
                    <p className="text-sm text-[#A0A0A0] mt-1">Last 7 days</p>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-[rgba(255,107,53,0.1)] border border-[rgba(255,107,53,0.2)]">
                    <span className="text-xs font-medium text-[#FF6B35]">Owner Only</span>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {/* Views */}
                <MetricCard
                    icon={Eye}
                    label="Views"
                    value={views?.last7Days || 0}
                    total={views?.total || 0}
                    iconColor="text-blue-400"
                    iconBg="bg-blue-400/10"
                />

                {/* GitHub Clicks */}
                <MetricCard
                    icon={Github}
                    label="GitHub Clicks"
                    value={interactions?.githubClicks?.last7Days || 0}
                    total={interactions?.githubClicks?.total || 0}
                    iconColor="text-purple-400"
                    iconBg="bg-purple-400/10"
                />

                {/* Live Demo Clicks */}
                <MetricCard
                    icon={ExternalLink}
                    label="Demo Clicks"
                    value={interactions?.liveDemoClicks?.last7Days || 0}
                    total={interactions?.liveDemoClicks?.total || 0}
                    iconColor="text-green-400"
                    iconBg="bg-green-400/10"
                />

                {/* LinkedIn Clicks */}
                <MetricCard
                    icon={Linkedin}
                    label="LinkedIn Clicks"
                    value={interactions?.linkedinClicks?.last7Days || 0}
                    total={interactions?.linkedinClicks?.total || 0}
                    iconColor="text-cyan-400"
                    iconBg="bg-cyan-400/10"
                />
            </div>

            {/* Additional Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Most Viewed Project */}
                {mostViewedProject && mostViewedProject.views > 0 && (
                    <div className="p-4 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)]">
                        <p className="text-xs text-[#A0A0A0] mb-1">Most Viewed Project</p>
                        <p className="text-sm font-medium">{mostViewedProject.id}</p>
                        <p className="text-xs text-[#A0A0A0] mt-1">{mostViewedProject.views} views</p>
                    </div>
                )}

                {/* Average Session Duration */}
                {sessions?.avgDuration > 0 && (
                    <div className="p-4 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)]">
                        <p className="text-xs text-[#A0A0A0] mb-1">Avg Session Duration</p>
                        <p className="text-sm font-medium">{formatDuration(sessions.avgDuration)}</p>
                        <p className="text-xs text-[#A0A0A0] mt-1">{sessions.totalSessions || 0} total sessions</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

/**
 * MetricCard Component
 * Individual metric display card
 */
function MetricCard({ icon: Icon, label, value, total, iconColor, iconBg }) {
    return (
        <div className="p-4 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)]">
            <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center`}>
                    <Icon size={18} className={iconColor} />
                </div>
            </div>
            <div className="text-2xl font-bold mb-1">{value}</div>
            <div className="text-xs text-[#A0A0A0]">{label}</div>
            {total > 0 && (
                <div className="text-xs text-[#666] mt-1">{total} total</div>
            )}
        </div>
    );
}

/**
 * InteractionSignals Component
 * 
 * Shows anonymous interaction signals (public view)
 * Displays aggregate counts without revealing viewer identity
 */
export function InteractionSignals({ analytics, className = '' }) {
    if (!analytics || !analytics.views) return null;

    const { views, interactions } = analytics;
    const weeklyViews = views.last7Days || 0;

    // Don't show if no activity
    if (weeklyViews === 0 && !interactions) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] ${className}`}
        >
            <div className="space-y-3">
                {/* Views Signal */}
                {weeklyViews > 0 && (
                    <Signal
                        icon={Eye}
                        text={`Viewed ${weeklyViews} ${weeklyViews === 1 ? 'time' : 'times'} this week`}
                        iconColor="text-blue-400"
                    />
                )}

                {/* Demo Clicks Signal */}
                {interactions?.liveDemoClicks?.last7Days > 0 && (
                    <Signal
                        icon={ExternalLink}
                        text={`Live demo clicked ${interactions.liveDemoClicks.last7Days} ${interactions.liveDemoClicks.last7Days === 1 ? 'time' : 'times'}`}
                        iconColor="text-green-400"
                    />
                )}

                {/* GitHub Clicks Signal */}
                {interactions?.githubClicks?.last7Days > 0 && (
                    <Signal
                        icon={Github}
                        text={`GitHub repo viewed ${interactions.githubClicks.last7Days} ${interactions.githubClicks.last7Days === 1 ? 'time' : 'times'}`}
                        iconColor="text-purple-400"
                    />
                )}
            </div>
        </motion.div>
    );
}

/**
 * Signal Component
 * Individual interaction signal
 */
function Signal({ icon: Icon, text, iconColor }) {
    return (
        <div className="flex items-center gap-3">
            <Icon size={16} className={iconColor} />
            <span className="text-sm text-[#A0A0A0]">{text}</span>
        </div>
    );
}
