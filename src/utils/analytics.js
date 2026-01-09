import { db } from '../firebase/firebase';
import { doc, updateDoc, increment, serverTimestamp, getDoc, setDoc } from 'firebase/firestore';

/**
 * Analytics Tracking Utilities
 * 
 * Privacy-first analytics for portfolio performance
 * - No personal data stored
 * - Anonymous tracking only
 * - Owner-only visibility
 */

// ============================================================================
// PORTFOLIO VIEW TRACKING
// ============================================================================

/**
 * Track a portfolio view
 * Called when someone visits a public portfolio
 * 
 * @param {string} userId - Portfolio owner's user ID
 */
export const trackPortfolioView = async (userId) => {
    if (!userId) return;

    try {
        const today = new Date().toISOString().split('T')[0];
        const analyticsRef = doc(db, 'users', userId, 'analytics', 'portfolio');

        // Check if analytics document exists
        const analyticsDoc = await getDoc(analyticsRef);

        if (!analyticsDoc.exists()) {
            // Create initial analytics document
            await setDoc(analyticsRef, {
                views: {
                    total: 1,
                    last7Days: 1,
                    last30Days: 1,
                    byDate: {
                        [today]: 1
                    }
                },
                interactions: {
                    githubClicks: { total: 0, last7Days: 0, last30Days: 0 },
                    liveDemoClicks: { total: 0, last7Days: 0, last30Days: 0 },
                    linkedinClicks: { total: 0, last7Days: 0, last30Days: 0 }
                },
                sessions: {
                    totalSessions: 1,
                    avgDuration: 0,
                    lastSession: serverTimestamp()
                },
                projects: {},
                lastUpdated: serverTimestamp()
            });
        } else {
            // Update existing analytics
            await updateDoc(analyticsRef, {
                'views.total': increment(1),
                'views.last7Days': increment(1),
                'views.last30Days': increment(1),
                [`views.byDate.${today}`]: increment(1),
                'sessions.totalSessions': increment(1),
                'sessions.lastSession': serverTimestamp(),
                lastUpdated: serverTimestamp()
            });
        }
    } catch (error) {
        console.error('Error tracking portfolio view:', error);
        // Fail silently - don't break user experience
    }
};

// ============================================================================
// INTERACTION TRACKING
// ============================================================================

/**
 * Track an interaction (GitHub click, live demo click, etc.)
 * 
 * @param {string} userId - Portfolio owner's user ID
 * @param {string} type - Interaction type: 'githubClicks' | 'liveDemoClicks' | 'linkedinClicks'
 * @param {string} projectId - Optional project ID for project-specific tracking
 */
export const trackInteraction = async (userId, type, projectId = null) => {
    if (!userId || !type) return;

    console.log('📊 Tracking interaction:', { userId, type, projectId });

    try {
        const analyticsRef = doc(db, 'users', userId, 'analytics', 'portfolio');

        const updates = {
            [`interactions.${type}.total`]: increment(1),
            [`interactions.${type}.last7Days`]: increment(1),
            [`interactions.${type}.last30Days`]: increment(1),
            lastUpdated: serverTimestamp()
        };

        // Track project-specific clicks
        if (projectId) {
            updates[`projects.${projectId}.clicks`] = increment(1);
        }

        await updateDoc(analyticsRef, updates);
        console.log('✅ Interaction tracked successfully');
    } catch (error) {
        console.error('Error tracking interaction:', error);
        // Fail silently
    }
};

/**
 * Track project view
 * 
 * @param {string} userId - Portfolio owner's user ID
 * @param {string} projectId - Project ID
 */
export const trackProjectView = async (userId, projectId) => {
    if (!userId || !projectId) return;

    try {
        const analyticsRef = doc(db, 'users', userId, 'analytics', 'portfolio');

        await updateDoc(analyticsRef, {
            [`projects.${projectId}.views`]: increment(1),
            lastUpdated: serverTimestamp()
        });
    } catch (error) {
        console.error('Error tracking project view:', error);
    }
};

// ============================================================================
// SESSION TRACKING
// ============================================================================

/**
 * Track session duration
 * Called when user leaves the portfolio page
 * 
 * @param {string} userId - Portfolio owner's user ID
 * @param {number} duration - Session duration in seconds
 */
export const trackSessionDuration = async (userId, duration) => {
    if (!userId || !duration) return;

    try {
        const analyticsRef = doc(db, 'users', userId, 'analytics', 'portfolio');
        const analyticsDoc = await getDoc(analyticsRef);

        if (analyticsDoc.exists()) {
            const data = analyticsDoc.data();
            const currentAvg = data.sessions?.avgDuration || 0;
            const totalSessions = data.sessions?.totalSessions || 1;

            // Calculate new average
            const newAvg = Math.round(((currentAvg * (totalSessions - 1)) + duration) / totalSessions);

            await updateDoc(analyticsRef, {
                'sessions.avgDuration': newAvg,
                lastUpdated: serverTimestamp()
            });
        }
    } catch (error) {
        console.error('Error tracking session duration:', error);
    }
};

// ============================================================================
// ANALYTICS RETRIEVAL
// ============================================================================

/**
 * Get portfolio analytics for owner
 * 
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Analytics data
 */
export const getPortfolioAnalytics = async (userId) => {
    if (!userId) return null;

    try {
        const analyticsRef = doc(db, 'users', userId, 'analytics', 'portfolio');
        const analyticsDoc = await getDoc(analyticsRef);

        if (analyticsDoc.exists()) {
            return analyticsDoc.data();
        }

        // Create initial analytics document if it doesn't exist
        const initialAnalytics = {
            views: {
                total: 0,
                last7Days: 0,
                last30Days: 0,
                byDate: {}
            },
            interactions: {
                githubClicks: { total: 0, last7Days: 0, last30Days: 0 },
                liveDemoClicks: { total: 0, last7Days: 0, last30Days: 0 },
                linkedinClicks: { total: 0, last7Days: 0, last30Days: 0 }
            },
            sessions: {
                totalSessions: 0,
                avgDuration: 0,
                lastSession: null
            },
            projects: {},
            lastUpdated: serverTimestamp()
        };

        await setDoc(analyticsRef, initialAnalytics);
        return initialAnalytics;
    } catch (error) {
        console.error('Error getting portfolio analytics:', error);
        // Return empty analytics instead of null to show the component
        return {
            views: {
                total: 0,
                last7Days: 0,
                last30Days: 0,
                byDate: {}
            },
            interactions: {
                githubClicks: { total: 0, last7Days: 0, last30Days: 0 },
                liveDemoClicks: { total: 0, last7Days: 0, last30Days: 0 },
                linkedinClicks: { total: 0, last7Days: 0, last30Days: 0 }
            },
            sessions: {
                totalSessions: 0,
                avgDuration: 0,
                lastSession: null
            },
            projects: {}
        };
    }
};

/**
 * Calculate most viewed project
 * 
 * @param {Object} analytics - Analytics data
 * @returns {Object} Most viewed project info
 */
export const getMostViewedProject = (analytics) => {
    if (!analytics?.projects) return null;

    const projects = Object.entries(analytics.projects);
    if (projects.length === 0) return null;

    const mostViewed = projects.reduce((max, [projectId, data]) => {
        return (data.views || 0) > (max.views || 0)
            ? { projectId, ...data }
            : max;
    }, { views: 0 });

    return mostViewed.views > 0 ? mostViewed : null;
};

// ============================================================================
// PERIODIC CLEANUP
// ============================================================================

/**
 * Reset 7-day and 30-day counters (run daily via Cloud Function)
 * 
 * @param {string} userId - User ID
 */
export const resetPeriodCounters = async (userId) => {
    try {
        const analyticsRef = doc(db, 'users', userId, 'analytics', 'portfolio');
        const analyticsDoc = await getDoc(analyticsRef);

        if (!analyticsDoc.exists()) return;

        const data = analyticsDoc.data();
        const today = new Date();
        const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

        // Recalculate 7-day and 30-day views from byDate
        let last7Days = 0;
        let last30Days = 0;

        if (data.views?.byDate) {
            Object.entries(data.views.byDate).forEach(([date, count]) => {
                const dateObj = new Date(date);
                if (dateObj >= sevenDaysAgo) last7Days += count;
                if (dateObj >= thirtyDaysAgo) last30Days += count;
            });
        }

        // Update counters
        await updateDoc(analyticsRef, {
            'views.last7Days': last7Days,
            'views.last30Days': last30Days,
            lastUpdated: serverTimestamp()
        });
    } catch (error) {
        console.error('Error resetting period counters:', error);
    }
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Format duration in human-readable format
 * 
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration
 */
export const formatDuration = (seconds) => {
    if (!seconds) return '0s';

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes === 0) return `${remainingSeconds}s`;
    if (remainingSeconds === 0) return `${minutes}m`;
    return `${minutes}m ${remainingSeconds}s`;
};

/**
 * Calculate trend (increase/decrease from previous period)
 * 
 * @param {number} current - Current period value
 * @param {number} previous - Previous period value
 * @returns {Object} Trend info
 */
export const calculateTrend = (current, previous) => {
    if (!previous) return { change: current, percentage: 100, direction: 'up' };

    const change = current - previous;
    const percentage = Math.round((change / previous) * 100);
    const direction = change > 0 ? 'up' : change < 0 ? 'down' : 'neutral';

    return { change, percentage, direction };
};
