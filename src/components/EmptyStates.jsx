import { FolderOpen, Code2, Activity, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * EmptyState Component
 * 
 * Reusable empty state for various scenarios
 */
export function EmptyState({
    icon: Icon = FolderOpen,
    title,
    description,
    action,
    className = ''
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-center py-12 ${className}`}
        >
            <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 rounded-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] flex items-center justify-center">
                    <Icon size={32} className="text-[#A0A0A0]" />
                </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-sm text-[#A0A0A0] mb-4 max-w-md mx-auto">{description}</p>
            {action && action}
        </motion.div>
    );
}

/**
 * NoProjects Component
 */
export function NoProjects({ isOwner = false }) {
    return (
        <EmptyState
            icon={FolderOpen}
            title="No Projects Yet"
            description={
                isOwner
                    ? "Start building real projects to showcase your skills. Choose a project from the available options and begin your journey."
                    : "This portfolio doesn't have any completed projects yet. Check back later!"
            }
        />
    );
}

/**
 * NoSkills Component
 */
export function NoSkills({ isOwner = false }) {
    return (
        <EmptyState
            icon={Code2}
            title="No Skills Yet"
            description={
                isOwner
                    ? "Skills are automatically derived from your completed projects. Complete milestones to showcase your technical abilities."
                    : "Skills will appear here as projects are completed."
            }
        />
    );
}

/**
 * NoGitHubActivity Component
 */
export function NoGitHubActivity({ isOwner = false, hasGitHub = true }) {
    if (!hasGitHub) {
        return (
            <EmptyState
                icon={Activity}
                title="GitHub Not Connected"
                description={
                    isOwner
                        ? "Connect your GitHub account to display your coding activity and contribution graph."
                        : "GitHub activity will appear here once connected."
                }
            />
        );
    }

    return (
        <EmptyState
            icon={Activity}
            title="No GitHub Activity"
            description={
                isOwner
                    ? "Your GitHub activity will appear here once you start making commits to your repositories."
                    : "No recent GitHub activity to display."
            }
        />
    );
}

/**
 * GitHubError Component
 * 
 * Handles various GitHub error states
 */
export function GitHubError({ error, isOwner = false }) {
    const getErrorMessage = () => {
        if (error?.includes('404') || error?.includes('not found')) {
            return {
                title: 'Repository Not Found',
                description: isOwner
                    ? 'The connected GitHub repository appears to have been deleted or renamed. Please update your GitHub connection.'
                    : 'The GitHub repository for this project is no longer available.'
            };
        }

        if (error?.includes('403') || error?.includes('private')) {
            return {
                title: 'Repository Private',
                description: isOwner
                    ? 'The connected GitHub repository is now private. Make it public or update your connection to display activity.'
                    : 'The GitHub repository for this project is private and cannot be displayed.'
            };
        }

        if (error?.includes('disconnected') || error?.includes('unauthorized')) {
            return {
                title: 'GitHub Disconnected',
                description: isOwner
                    ? 'Your GitHub connection has been disconnected. Please reconnect your GitHub account to display activity.'
                    : 'GitHub activity is temporarily unavailable.'
            };
        }

        return {
            title: 'GitHub Error',
            description: isOwner
                ? 'There was an error fetching your GitHub activity. Please try reconnecting your GitHub account.'
                : 'Unable to load GitHub activity at this time.'
        };
    };

    const { title, description } = getErrorMessage();

    return (
        <EmptyState
            icon={AlertCircle}
            title={title}
            description={description}
        />
    );
}

/**
 * NoMilestones Component
 */
export function NoMilestones({ isOwner = false }) {
    return (
        <EmptyState
            icon={FolderOpen}
            title="No Milestones Completed"
            description={
                isOwner
                    ? "Complete project milestones to showcase your progress and build your portfolio."
                    : "No milestones have been completed for this project yet."
            }
        />
    );
}

export default EmptyState;
