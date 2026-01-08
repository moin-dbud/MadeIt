import { useState } from "react";
import { GitCommit, Calendar, User, Check } from "lucide-react";

export default function GitHubCommitSelector({ commits, loading, rangeMode, value, onChange }) {
    const [selectedStart, setSelectedStart] = useState(value?.commitRangeStart || null);
    const [selectedEnd, setSelectedEnd] = useState(value?.commitRangeEnd || null);
    const [selectedSingle, setSelectedSingle] = useState(value?.commitSha || null);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleCommitClick = (commit) => {
        if (rangeMode) {
            // Range selection logic
            if (!selectedStart) {
                setSelectedStart(commit.sha);
                onChange({
                    commitRangeStart: commit.sha,
                    commitRangeEnd: null,
                    totalCommits: 0,
                    dateRange: {
                        from: commit.commit.author.date,
                        to: null
                    }
                });
            } else if (!selectedEnd) {
                const startIndex = commits.findIndex(c => c.sha === selectedStart);
                const endIndex = commits.findIndex(c => c.sha === commit.sha);

                if (endIndex < startIndex) {
                    // Swap if end is before start
                    setSelectedStart(commit.sha);
                    setSelectedEnd(selectedStart);

                    const totalCommits = startIndex - endIndex + 1;
                    onChange({
                        commitRangeStart: commit.sha,
                        commitRangeEnd: selectedStart,
                        totalCommits,
                        dateRange: {
                            from: commit.commit.author.date,
                            to: commits[startIndex].commit.author.date
                        }
                    });
                } else {
                    setSelectedEnd(commit.sha);

                    const totalCommits = endIndex - startIndex + 1;
                    onChange({
                        commitRangeStart: selectedStart,
                        commitRangeEnd: commit.sha,
                        totalCommits,
                        dateRange: {
                            from: commits[startIndex].commit.author.date,
                            to: commit.commit.author.date
                        }
                    });
                }
            } else {
                // Reset and start new selection
                setSelectedStart(commit.sha);
                setSelectedEnd(null);
                onChange({
                    commitRangeStart: commit.sha,
                    commitRangeEnd: null,
                    totalCommits: 0,
                    dateRange: {
                        from: commit.commit.author.date,
                        to: null
                    }
                });
            }
        } else {
            // Single selection
            setSelectedSingle(commit.sha);
            onChange({
                commitSha: commit.sha,
                commitMessage: commit.commit.message,
                commitDate: commit.commit.author.date,
                commitAuthor: commit.commit.author.name
            });
        }
    };

    const isInRange = (commit) => {
        if (!rangeMode || !selectedStart) return false;
        if (!selectedEnd) return commit.sha === selectedStart;

        const startIndex = commits.findIndex(c => c.sha === selectedStart);
        const endIndex = commits.findIndex(c => c.sha === selectedEnd);
        const currentIndex = commits.findIndex(c => c.sha === commit.sha);

        return currentIndex >= startIndex && currentIndex <= endIndex;
    };

    const isSelected = (commit) => {
        if (rangeMode) {
            return commit.sha === selectedStart || commit.sha === selectedEnd;
        }
        return commit.sha === selectedSingle;
    };

    if (loading) {
        return (
            <div className="p-8 text-center">
                <div className="w-8 h-8 border-2 border-[#FF6B35] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-sm text-[#A0A0A0]">Loading commits...</p>
            </div>
        );
    }

    if (!commits || commits.length === 0) {
        return (
            <div className="p-8 text-center border border-[rgba(255,255,255,0.1)] rounded-lg">
                <GitCommit size={32} className="text-[#606060] mx-auto mb-3" />
                <p className="text-sm text-[#A0A0A0]">No commits found</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {/* Selection Summary */}
            {rangeMode && selectedStart && selectedEnd && value && (
                <div className="p-4 bg-[#FF6B35]/10 border border-[#FF6B35]/20 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                        <div>
                            <p className="text-white font-medium mb-1">Selected Range</p>
                            <p className="text-[#A0A0A0]">
                                <span className="text-white">{formatDate(value.dateRange.from)}</span>
                                {' → '}
                                <span className="text-white">{formatDate(value.dateRange.to)}</span>
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-[#FF6B35]">{value.totalCommits}</p>
                            <p className="text-xs text-[#A0A0A0]">commits</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Instructions */}
            <p className="text-xs text-[#606060]">
                {rangeMode
                    ? 'Click on two commits to select a range (first commit → last commit)'
                    : 'Click on a commit to select it'}
            </p>

            {/* Commits List */}
            <div className="max-h-96 overflow-y-auto space-y-2 pr-2">
                {commits.map((commit, index) => {
                    const selected = isSelected(commit);
                    const inRange = isInRange(commit);

                    return (
                        <button
                            key={commit.sha}
                            onClick={() => handleCommitClick(commit)}
                            className={`
                                w-full p-3 rounded-lg border text-left transition-all
                                ${selected
                                    ? 'border-[#FF6B35] bg-[#FF6B35]/10'
                                    : inRange
                                        ? 'border-[#FF6B35]/30 bg-[#FF6B35]/5'
                                        : 'border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.02)]'
                                }
                            `}
                        >
                            <div className="flex items-start gap-3">
                                {/* Indicator */}
                                <div className={`
                                    w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5
                                    ${selected
                                        ? 'border-[#FF6B35] bg-[#FF6B35]'
                                        : inRange
                                            ? 'border-[#FF6B35]/50 bg-[#FF6B35]/20'
                                            : 'border-[rgba(255,255,255,0.2)]'
                                    }
                                `}>
                                    {selected && <Check size={12} className="text-white" />}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-white font-medium mb-1 truncate">
                                        {commit.commit.message.split('\n')[0]}
                                    </p>
                                    <div className="flex items-center gap-3 text-xs text-[#A0A0A0]">
                                        <span className="flex items-center gap-1">
                                            <User size={12} />
                                            {commit.commit.author.name}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Calendar size={12} />
                                            {formatDate(commit.commit.author.date)}
                                        </span>
                                        <span className="text-[#606060]">
                                            {formatTime(commit.commit.author.date)}
                                        </span>
                                    </div>
                                    <p className="text-xs text-[#606060] mt-1 font-mono">
                                        {commit.sha.substring(0, 7)}
                                    </p>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
