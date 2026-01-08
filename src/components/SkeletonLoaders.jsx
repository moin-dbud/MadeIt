/**
 * Skeleton Loaders
 * 
 * Reusable skeleton components for different content types.
 * All follow the app's dark theme with subtle shimmer animation.
 */

// Base skeleton with shimmer animation
const SkeletonBase = ({ className = "" }) => (
    <div className={`bg-[rgba(255,255,255,0.05)] rounded animate-pulse ${className}`} />
);

// Skeleton for project cards
export const ProjectCardSkeleton = () => (
    <div className="rounded-2xl p-6 border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)]">
        <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
                <SkeletonBase className="h-6 w-3/4 mb-3" />
                <div className="flex items-center gap-2">
                    <SkeletonBase className="h-5 w-20" />
                    <SkeletonBase className="h-5 w-24" />
                </div>
            </div>
            <SkeletonBase className="h-8 w-16" />
        </div>
        <SkeletonBase className="h-4 w-full mb-4" />
        <div className="flex flex-wrap gap-2 mb-6">
            <SkeletonBase className="h-6 w-16" />
            <SkeletonBase className="h-6 w-20" />
            <SkeletonBase className="h-6 w-18" />
        </div>
        <SkeletonBase className="h-10 w-full" />
    </div>
);

// Skeleton for milestone cards
export const MilestoneCardSkeleton = () => (
    <div className="rounded-xl p-6 border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)]">
        <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
                <SkeletonBase className="h-6 w-2/3 mb-2" />
                <SkeletonBase className="h-4 w-1/2" />
            </div>
            <SkeletonBase className="h-8 w-24" />
        </div>
        <div className="space-y-3">
            <SkeletonBase className="h-10 w-full" />
            <SkeletonBase className="h-10 w-full" />
            <SkeletonBase className="h-10 w-full" />
        </div>
    </div>
);

// Skeleton for portfolio sections
export const PortfolioSectionSkeleton = () => (
    <div className="mb-12">
        <SkeletonBase className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl p-6 border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)]">
                <SkeletonBase className="h-5 w-3/4 mb-3" />
                <SkeletonBase className="h-4 w-full mb-2" />
                <SkeletonBase className="h-4 w-5/6 mb-4" />
                <div className="flex gap-2">
                    <SkeletonBase className="h-6 w-16" />
                    <SkeletonBase className="h-6 w-20" />
                    <SkeletonBase className="h-6 w-18" />
                </div>
            </div>
            <div className="rounded-xl p-6 border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)]">
                <SkeletonBase className="h-5 w-3/4 mb-3" />
                <SkeletonBase className="h-4 w-full mb-2" />
                <SkeletonBase className="h-4 w-5/6 mb-4" />
                <div className="flex gap-2">
                    <SkeletonBase className="h-6 w-16" />
                    <SkeletonBase className="h-6 w-20" />
                    <SkeletonBase className="h-6 w-18" />
                </div>
            </div>
        </div>
    </div>
);

// Skeleton for GitHub activity
export const GitHubActivitySkeleton = () => (
    <div className="space-y-3">
        {[1, 2].map((i) => (
            <div key={i} className="flex items-start gap-3 p-4 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)]">
                <SkeletonBase className="w-4 h-4 mt-1 flex-shrink-0" />
                <div className="flex-1">
                    <SkeletonBase className="h-5 w-2/3 mb-2" />
                    <SkeletonBase className="h-4 w-1/2 mb-3" />
                    <div className="flex gap-4">
                        <SkeletonBase className="h-4 w-20" />
                        <SkeletonBase className="h-4 w-24" />
                        <SkeletonBase className="h-4 w-32" />
                    </div>
                </div>
            </div>
        ))}
    </div>
);

// Skeleton for stats cards
export const StatsCardSkeleton = () => (
    <div className="rounded-xl p-5 border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)]">
        <SkeletonBase className="h-4 w-20 mb-2" />
        <SkeletonBase className="h-8 w-16" />
    </div>
);

// Page-level loading spinner
export const PageLoader = ({ message = "Loading..." }) => (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-[#A0A0A0]">{message}</p>
        </div>
    </div>
);

// Inline loading spinner (for sections)
export const InlineLoader = ({ message = "Loading..." }) => (
    <div className="flex items-center justify-center py-8">
        <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-[#FF6B35] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-[#A0A0A0]">{message}</p>
        </div>
    </div>
);
