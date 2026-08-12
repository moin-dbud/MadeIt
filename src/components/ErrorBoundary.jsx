import React from "react";
import { AlertTriangle, RefreshCw, MessageSquare } from "lucide-react";
import LoadingButton from "./LoadingButton";

/**
 * ErrorBoundary Component
 * 
 * Catches unexpected React errors and shows a friendly fallback UI.
 * Prevents the entire app from crashing.
 */
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error:", error, errorInfo);
        this.setState({
            error,
            errorInfo
        });

        // TODO: Send error to logging service (e.g., Sentry)
        // logErrorToService(error, errorInfo);
    }

    handleReload = () => {
        window.location.reload();
    };

    handleReportIssue = () => {
        // TODO: Implement issue reporting (e.g., open GitHub issue or support form)
        const subject = encodeURIComponent("MadeIt App Error Report");
        const body = encodeURIComponent(
            `Error: ${this.state.error?.message || "Unknown error"}\n\n` +
            `Please describe what you were doing when this happened:\n\n`
        );
        window.open(`mailto:moinsheikh1303@gmail.com?subject=${subject}&body=${body}`, '_blank');
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] text-white p-4">
                    <div className="max-w-md w-full">
                        {/* Error Icon */}
                        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle size={32} className="text-red-400" />
                        </div>

                        {/* Error Message */}
                        <h1 className="text-2xl font-semibold text-center mb-3">
                            Something went wrong
                        </h1>
                        <p className="text-[#A0A0A0] text-center mb-8">
                            We're sorry, but something unexpected happened. Don't worry — your data is safe.
                            Try reloading the page, and if the problem persists, let us know.
                        </p>

                        {/* Actions */}
                        <div className="space-y-3">
                            <LoadingButton
                                onClick={this.handleReload}
                                variant="primary"
                                className="w-full"
                            >
                                <RefreshCw size={18} />
                                Reload Page
                            </LoadingButton>

                            <button
                                onClick={this.handleReportIssue}
                                className="w-full px-6 py-3 rounded-xl border border-[rgba(255,255,255,0.1)] text-white text-sm font-medium inline-flex items-center justify-center gap-2 hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                            >
                                <MessageSquare size={18} />
                                Report Issue
                            </button>
                        </div>

                        {/* Technical Details (collapsed by default) */}
                        {import.meta.env.DEV && this.state.error && (
                            <details className="mt-6 p-4 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)]">
                                <summary className="text-xs text-[#A0A0A0] cursor-pointer hover:text-white transition-colors">
                                    Technical Details (Dev Only)
                                </summary>
                                <pre className="mt-3 text-xs text-red-400 overflow-auto">
                                    {this.state.error.toString()}
                                    {this.state.errorInfo?.componentStack}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
