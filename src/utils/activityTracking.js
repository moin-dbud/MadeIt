/**
 * Activity Tracking & Work Discipline Engine
 * 
 * Tracks user activity and calculates work discipline metrics.
 * All metrics are derived from real activity events - no manual inputs.
 */

/**
 * Activity Event Types
 */
export const ACTIVITY_TYPES = {
    TASK_COMPLETED: 'task_completed',
    MILESTONE_SUBMITTED: 'milestone_submitted',
    GITHUB_COMMIT: 'github_commit',
    PROJECT_UPDATED: 'project_updated'
};

/**
 * Get unique active days from activity events
 * Multiple actions on same day = 1 active day
 * 
 * @param {Array} activityEvents - Array of activity events with timestamps
 * @returns {Array} - Array of unique date strings (YYYY-MM-DD)
 */
export const getActiveDays = (activityEvents) => {
    if (!activityEvents || activityEvents.length === 0) {
        return [];
    }

    // Extract unique dates (YYYY-MM-DD)
    const uniqueDates = new Set();

    activityEvents.forEach(event => {
        if (event.timestamp) {
            const date = new Date(event.timestamp);
            const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
            uniqueDates.add(dateStr);
        }
    });

    return Array.from(uniqueDates).sort();
};

/**
 * Calculate current streak
 * Counts consecutive days up to today (or most recent activity)
 * 
 * @param {Array} activeDays - Array of date strings (YYYY-MM-DD)
 * @returns {number} - Current streak in days
 */
export const getCurrentStreak = (activeDays) => {
    if (!activeDays || activeDays.length === 0) {
        return 0;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let streak = 0;
    let checkDate = new Date(today);

    // Sort in descending order
    const sortedDays = [...activeDays].sort().reverse();

    for (const dayStr of sortedDays) {
        const activityDate = new Date(dayStr);
        activityDate.setHours(0, 0, 0, 0);

        const daysDiff = Math.floor((checkDate - activityDate) / (1000 * 60 * 60 * 24));

        if (daysDiff === 0 || daysDiff === 1) {
            streak++;
            checkDate = new Date(activityDate);
        } else {
            break;
        }
    }

    return streak;
};

/**
 * Calculate longest streak
 * Finds the longest consecutive sequence of active days
 * 
 * @param {Array} activeDays - Array of date strings (YYYY-MM-DD)
 * @returns {number} - Longest streak in days
 */
export const getLongestStreak = (activeDays) => {
    if (!activeDays || activeDays.length === 0) {
        return 0;
    }

    const sortedDays = [...activeDays].sort();
    let longestStreak = 1;
    let currentStreak = 1;

    for (let i = 1; i < sortedDays.length; i++) {
        const prevDate = new Date(sortedDays[i - 1]);
        const currDate = new Date(sortedDays[i]);

        const daysDiff = Math.floor((currDate - prevDate) / (1000 * 60 * 60 * 24));

        if (daysDiff === 1) {
            currentStreak++;
            longestStreak = Math.max(longestStreak, currentStreak);
        } else if (daysDiff > 1) {
            currentStreak = 1;
        }
        // If daysDiff === 0, it's the same day (shouldn't happen with unique days)
    }

    return longestStreak;
};

/**
 * Get activity timeline by month
 * Aggregates active days per month for the last N months
 * 
 * @param {Array} activeDays - Array of date strings (YYYY-MM-DD)
 * @param {number} monthsToShow - Number of months to show (default: 6)
 * @returns {Array} - Array of { month: string, activeDays: number, totalDays: number }
 */
export const getActivityTimeline = (activeDays, monthsToShow = 6) => {
    const timeline = [];
    const today = new Date();

    for (let i = monthsToShow - 1; i >= 0; i--) {
        const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const monthStr = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

        // Count active days in this month
        const daysInMonth = activeDays.filter(day => day.startsWith(monthKey)).length;

        // Get total days in month
        const totalDays = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

        timeline.push({
            month: monthStr,
            activeDays: daysInMonth,
            totalDays: totalDays,
            percentage: totalDays > 0 ? (daysInMonth / totalDays) * 100 : 0
        });
    }

    return timeline;
};

/**
 * Calculate average days per milestone
 * 
 * @param {Array} completedMilestones - Array of completed milestones with timestamps
 * @param {Array} activeDays - Array of active day strings
 * @returns {number} - Average active days per milestone
 */
export const getAverageDaysPerMilestone = (completedMilestones, activeDays) => {
    if (!completedMilestones || completedMilestones.length === 0) {
        return 0;
    }

    const totalActiveDays = activeDays.length;
    const totalMilestones = completedMilestones.length;

    return Math.round(totalActiveDays / totalMilestones);
};

/**
 * Get last active timestamp
 * 
 * @param {Array} activityEvents - Array of activity events
 * @returns {Date|null} - Last activity timestamp
 */
export const getLastActiveTimestamp = (activityEvents) => {
    if (!activityEvents || activityEvents.length === 0) {
        return null;
    }

    const timestamps = activityEvents
        .map(event => event.timestamp)
        .filter(ts => ts)
        .sort()
        .reverse();

    return timestamps.length > 0 ? new Date(timestamps[0]) : null;
};

/**
 * Format last active time (e.g., "2 hours ago", "3 days ago")
 * 
 * @param {Date} timestamp - Last active timestamp
 * @returns {string} - Formatted time string
 */
export const formatLastActive = (timestamp) => {
    if (!timestamp) {
        return 'Never';
    }

    const now = new Date();
    const diff = now - new Date(timestamp);

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
        return days === 1 ? '1 day ago' : `${days} days ago`;
    } else if (hours > 0) {
        return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
    } else if (minutes > 0) {
        return minutes === 1 ? '1 min ago' : `${minutes} mins ago`;
    } else {
        return 'Just now';
    }
};

/**
 * Build activity events from user data
 * Extracts all activity events from various sources
 * 
 * @param {Object} userData - User data object
 * @returns {Array} - Array of activity events
 */
export const buildActivityEvents = (userData) => {
    const events = [];

    if (!userData) {
        return events;
    }

    // Task completions
    if (userData.activeProject?.completedTasks) {
        userData.activeProject.completedTasks.forEach(taskId => {
            // Try to get timestamp from task completion history
            const timestamp = userData.activeProject.taskCompletionHistory?.[taskId];
            if (timestamp) {
                events.push({
                    type: ACTIVITY_TYPES.TASK_COMPLETED,
                    timestamp: timestamp,
                    data: { taskId }
                });
            }
        });
    }

    // Milestone submissions
    if (userData.activeProject?.completedMilestones) {
        userData.activeProject.completedMilestones.forEach(milestoneId => {
            // Try to get timestamp from milestone submission history
            const timestamp = userData.activeProject.milestoneSubmissionHistory?.[milestoneId];
            if (timestamp) {
                events.push({
                    type: ACTIVITY_TYPES.MILESTONE_SUBMITTED,
                    timestamp: timestamp,
                    data: { milestoneId }
                });
            }
        });
    }

    // GitHub commits (from cached activity)
    if (userData.githubActivity?.projects) {
        userData.githubActivity.projects.forEach(project => {
            if (project.commits) {
                project.commits.forEach(commit => {
                    events.push({
                        type: ACTIVITY_TYPES.GITHUB_COMMIT,
                        timestamp: commit.date,
                        data: {
                            projectId: project.projectId,
                            commitSha: commit.sha
                        }
                    });
                });
            }
        });
    }

    // Project updates (when project was started, repo linked, etc.)
    if (userData.activeProject?.startedAt) {
        events.push({
            type: ACTIVITY_TYPES.PROJECT_UPDATED,
            timestamp: userData.activeProject.startedAt,
            data: { action: 'project_started' }
        });
    }

    return events.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

/**
 * Calculate all work discipline metrics
 * 
 * @param {Object} userData - User data object
 * @returns {Object} - All calculated metrics
 */
export const calculateWorkDisciplineMetrics = (userData) => {
    const activityEvents = buildActivityEvents(userData);
    const activeDays = getActiveDays(activityEvents);
    const currentStreak = getCurrentStreak(activeDays);
    const longestStreak = getLongestStreak(activeDays);
    const timeline = getActivityTimeline(activeDays, 6);
    const lastActive = getLastActiveTimestamp(activityEvents);

    const completedMilestones = userData?.activeProject?.completedMilestones || [];
    const avgDaysPerMilestone = getAverageDaysPerMilestone(completedMilestones, activeDays);

    return {
        totalActiveDays: activeDays.length,
        currentStreak,
        longestStreak,
        timeline,
        lastActive,
        lastActiveFormatted: formatLastActive(lastActive),
        avgDaysPerMilestone,
        activeDays, // For debugging/analysis
        activityEvents // For debugging/analysis
    };
};

/**
 * Detect bulk activity patterns (anti-gaming)
 * Flags days with unusually high activity
 * 
 * @param {Array} activityEvents - Array of activity events
 * @returns {Object} - { hasBulkActivity: boolean, bulkDays: Array }
 */
export const detectBulkActivity = (activityEvents) => {
    if (!activityEvents || activityEvents.length === 0) {
        return { hasBulkActivity: false, bulkDays: [] };
    }

    // Group events by day
    const eventsByDay = {};

    activityEvents.forEach(event => {
        const date = new Date(event.timestamp);
        const dateStr = date.toISOString().split('T')[0];

        if (!eventsByDay[dateStr]) {
            eventsByDay[dateStr] = [];
        }
        eventsByDay[dateStr].push(event);
    });

    // Flag days with > 5 events (potential bulk activity)
    const bulkDays = [];

    Object.entries(eventsByDay).forEach(([date, events]) => {
        if (events.length > 5) {
            bulkDays.push({
                date,
                eventCount: events.length,
                types: [...new Set(events.map(e => e.type))]
            });
        }
    });

    return {
        hasBulkActivity: bulkDays.length > 0,
        bulkDays
    };
};
