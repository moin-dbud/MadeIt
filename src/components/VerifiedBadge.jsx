import { CheckCircle2, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * VerifiedBadge Component
 * 
 * Displays a "Verified by MadeIt" trust badge on completed milestones and projects
 * Subtle, professional design to build recruiter confidence
 */
export default function VerifiedBadge({ type = 'milestone', className = '' }) {
    const badges = {
        milestone: {
            icon: CheckCircle2,
            text: 'Verified',
            color: 'text-green-400',
            bgColor: 'bg-green-400/10',
            borderColor: 'border-green-400/20'
        },
        project: {
            icon: Shield,
            text: 'Verified Project',
            color: 'text-blue-400',
            bgColor: 'bg-blue-400/10',
            borderColor: 'border-blue-400/20'
        }
    };

    const badge = badges[type] || badges.milestone;
    const Icon = badge.icon;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md ${badge.bgColor} border ${badge.borderColor} ${className}`}
        >
            <Icon size={12} className={badge.color} />
            <span className={`text-xs font-medium ${badge.color}`}>
                {badge.text}
            </span>
        </motion.div>
    );
}

/**
 * ProofStatusIndicator Component
 * 
 * Shows verification status of proof items
 */
export function ProofStatusIndicator({ status = 'verified', className = '' }) {
    const statuses = {
        verified: {
            icon: CheckCircle2,
            text: 'Verified',
            color: 'text-green-400',
            bgColor: 'bg-green-400/10'
        },
        pending: {
            icon: Clock,
            text: 'Pending',
            color: 'text-yellow-400',
            bgColor: 'bg-yellow-400/10'
        },
        failed: {
            icon: AlertCircle,
            text: 'Unavailable',
            color: 'text-red-400',
            bgColor: 'bg-red-400/10'
        }
    };

    const statusConfig = statuses[status] || statuses.verified;
    const Icon = statusConfig.icon;

    return (
        <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded ${statusConfig.bgColor} ${className}`}>
            <Icon size={10} className={statusConfig.color} />
            <span className={`text-[10px] font-medium ${statusConfig.color}`}>
                {statusConfig.text}
            </span>
        </div>
    );
}

// Import missing icons
import { Clock, AlertCircle } from 'lucide-react';
