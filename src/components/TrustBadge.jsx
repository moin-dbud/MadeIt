import { Shield, CheckCircle2 } from 'lucide-react';

/**
 * TrustBadge Component
 * 
 * Displays verification status for milestones and projects
 * Builds recruiter confidence with subtle trust signals
 */
export default function TrustBadge({
    type = 'verified', // 'verified' | 'pending'
    size = 'sm', // 'sm' | 'md' | 'lg'
    showText = true,
    className = ''
}) {
    const sizeClasses = {
        sm: 'text-xs px-2 py-1',
        md: 'text-sm px-3 py-1.5',
        lg: 'text-base px-4 py-2'
    };

    const iconSizes = {
        sm: 12,
        md: 14,
        lg: 16
    };

    if (type === 'verified') {
        return (
            <div
                className={`inline-flex items-center gap-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 ${sizeClasses[size]} ${className}`}
                title="Verified by MadeIt - Proof validated through GitHub commits and live demonstrations"
            >
                <CheckCircle2 size={iconSizes[size]} />
                {showText && <span className="font-medium">Verified</span>}
            </div>
        );
    }

    if (type === 'pending') {
        return (
            <div
                className={`inline-flex items-center gap-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 ${sizeClasses[size]} ${className}`}
                title="Pending verification - Proof submitted and awaiting validation"
            >
                <Shield size={iconSizes[size]} />
                {showText && <span className="font-medium">Pending</span>}
            </div>
        );
    }

    return null;
}

/**
 * MadeItVerified Badge
 * 
 * Official "Verified by MadeIt" badge for completed work
 */
export function MadeItVerified({ className = '' }) {
    return (
        <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[rgba(255,107,53,0.1)] border border-[rgba(255,107,53,0.2)] ${className}`}
            title="Verified by MadeIt - Real work validated through GitHub commits, live demos, and proof of completion"
        >
            <Shield size={14} className="text-[#FF6B35]" />
            <span className="text-xs font-medium text-[#FF6B35]">Verified by MadeIt</span>
        </div>
    );
}

/**
 * LastActive Component
 * 
 * Shows "Last active X days ago" for public portfolios
 */
export function LastActive({ lastActiveDate, className = '' }) {
    if (!lastActiveDate) return null;

    const getTimeAgo = (date) => {
        const now = new Date();
        const lastActive = new Date(date);
        const diffTime = Math.abs(now - lastActive);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
        return `${Math.floor(diffDays / 365)} years ago`;
    };

    return (
        <div className={`text-xs text-[#A0A0A0] ${className}`}>
            Last active {getTimeAgo(lastActiveDate)}
        </div>
    );
}
