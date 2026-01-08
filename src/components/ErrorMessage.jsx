import { AlertCircle, WifiOff, RefreshCw, XCircle } from "lucide-react";
import LoadingButton from "./LoadingButton";

/**
 * ErrorMessage Component
 * 
 * Reusable component for displaying error messages with retry functionality.
 * 
 * @param {Object} props
 * @param {string} props.type - Error type: 'network', 'auth', 'validation', 'github', 'general'
 * @param {string} props.title - Error title
 * @param {string} props.message - Error message
 * @param {Function} [props.onRetry] - Retry callback
 * @param {boolean} [props.retrying] - Whether retry is in progress
 * @param {React.ReactNode} [props.children] - Additional content
 */
export default function ErrorMessage({
    type = 'general',
    title,
    message,
    onRetry,
    retrying = false,
    children
}) {
    const getIcon = () => {
        switch (type) {
            case 'network':
                return <WifiOff size={24} className="text-red-400" />;
            case 'auth':
                return <XCircle size={24} className="text-red-400" />;
            case 'validation':
                return <AlertCircle size={24} className="text-yellow-400" />;
            case 'github':
                return <AlertCircle size={24} className="text-red-400" />;
            default:
                return <AlertCircle size={24} className="text-red-400" />;
        }
    };

    const getBgColor = () => {
        switch (type) {
            case 'validation':
                return 'bg-yellow-500/10 border-yellow-500/20';
            default:
                return 'bg-red-500/10 border-red-500/20';
        }
    };

    const getTextColor = () => {
        switch (type) {
            case 'validation':
                return 'text-yellow-400';
            default:
                return 'text-red-400';
        }
    };

    return (
        <div className={`rounded-xl p-6 border ${getBgColor()}`}>
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                    {getIcon()}
                </div>
                <div className="flex-1">
                    <h3 className={`text-sm font-semibold mb-1 ${getTextColor()}`}>
                        {title}
                    </h3>
                    <p className="text-sm text-[#A0A0A0] leading-relaxed">
                        {message}
                    </p>
                    {children && (
                        <div className="mt-3">
                            {children}
                        </div>
                    )}
                    {onRetry && (
                        <LoadingButton
                            onClick={onRetry}
                            loading={retrying}
                            loadingText="Retrying..."
                            variant="secondary"
                            className="mt-4"
                        >
                            <RefreshCw size={16} />
                            Try Again
                        </LoadingButton>
                    )}
                </div>
            </div>
        </div>
    );
}

/**
 * InlineError Component
 * 
 * Small inline error message for form fields.
 */
export function InlineError({ message }) {
    if (!message) return null;

    return (
        <div className="flex items-start gap-2 mt-2 text-red-400 text-sm">
            <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
            <span>{message}</span>
        </div>
    );
}

/**
 * NetworkError Component
 * 
 * Specialized error for network/offline issues.
 */
export function NetworkError({ onRetry, retrying }) {
    return (
        <ErrorMessage
            type="network"
            title="Connection Issue"
            message="We couldn't connect to the server. Please check your internet connection and try again."
            onRetry={onRetry}
            retrying={retrying}
        />
    );
}

/**
 * GitHubError Component
 * 
 * Specialized error for GitHub API issues.
 */
export function GitHubError({ error, onRetry, retrying }) {
    const getErrorDetails = () => {
        if (error?.includes('rate limit')) {
            return {
                title: 'GitHub Rate Limit Exceeded',
                message: 'GitHub API rate limit reached. Please wait a few minutes and try again, or authenticate with GitHub for higher limits.',
            };
        }
        if (error?.includes('404') || error?.includes('not found')) {
            return {
                title: 'Repository Not Found',
                message: 'The GitHub repository could not be found. Make sure the repository exists and is public, or check your repository URL.',
            };
        }
        if (error?.includes('403') || error?.includes('private')) {
            return {
                title: 'Repository Access Denied',
                message: 'This repository appears to be private. Make sure your repository is public or grant access to MadeIt.',
            };
        }
        if (error?.includes('no commits')) {
            return {
                title: 'No Commits Found',
                message: 'No commits were found in this repository. Make your first commit to see activity here.',
            };
        }
        return {
            title: 'GitHub Error',
            message: 'There was an issue fetching data from GitHub. Please try again later.',
        };
    };

    const { title, message } = getErrorDetails();

    return (
        <ErrorMessage
            type="github"
            title={title}
            message={message}
            onRetry={onRetry}
            retrying={retrying}
        />
    );
}
