import { supabase } from '../supabase/supabase';

/**
 * Analytics Tracking Utilities (Supabase)
 * 
 * Privacy-first analytics for portfolio performance
 */

export const trackPortfolioView = async (userId) => {
    if (!userId) return;

    try {
        const today = new Date().toISOString().split('T')[0];

        const { data: existing } = await supabase
            .from('analytics')
            .select('*')
            .eq('user_id', userId)
            .eq('type', 'portfolio')
            .maybeSingle();

        if (!existing) {
            const initialAnalytics = {
                user_id: userId,
                type: 'portfolio',
                views: {
                    total: 1,
                    last7Days: 1,
                    last30Days: 1,
                    byDate: { [today]: 1 }
                },
                interactions: {
                    githubClicks: { total: 0, last7Days: 0, last30Days: 0 },
                    liveDemoClicks: { total: 0, last7Days: 0, last30Days: 0 },
                    linkedinClicks: { total: 0, last7Days: 0, last30Days: 0 }
                },
                sessions: {
                    totalSessions: 1,
                    avgDuration: 0,
                    lastSession: new Date().toISOString()
                },
                projects: {},
                last_updated: new Date().toISOString()
            };

            await supabase.from('analytics').insert(initialAnalytics);
        } else {
            const views = existing.views || {};
            const byDate = views.byDate || {};
            const sessions = existing.sessions || {};

            const updatedViews = {
                ...views,
                total: (views.total || 0) + 1,
                last7Days: (views.last7Days || 0) + 1,
                last30Days: (views.last30Days || 0) + 1,
                byDate: {
                    ...byDate,
                    [today]: (byDate[today] || 0) + 1
                }
            };

            const updatedSessions = {
                ...sessions,
                totalSessions: (sessions.totalSessions || 0) + 1,
                lastSession: new Date().toISOString()
            };

            await supabase
                .from('analytics')
                .update({
                    views: updatedViews,
                    sessions: updatedSessions,
                    last_updated: new Date().toISOString()
                })
                .eq('user_id', userId)
                .eq('type', 'portfolio');
        }
    } catch (error) {
        console.error('Error tracking portfolio view:', error);
    }
};

export const trackInteraction = async (userId, type, projectId = null) => {
    if (!userId || !type) return;

    try {
        const { data: existing } = await supabase
            .from('analytics')
            .select('*')
            .eq('user_id', userId)
            .eq('type', 'portfolio')
            .maybeSingle();

        if (!existing) return;

        const interactions = existing.interactions || {};
        const targetType = interactions[type] || { total: 0, last7Days: 0, last30Days: 0 };
        const projects = existing.projects || {};

        const updatedInteractions = {
            ...interactions,
            [type]: {
                ...targetType,
                total: (targetType.total || 0) + 1,
                last7Days: (targetType.last7Days || 0) + 1,
                last30Days: (targetType.last30Days || 0) + 1
            }
        };

        if (projectId) {
            const proj = projects[projectId] || { views: 0, clicks: 0 };
            projects[projectId] = {
                ...proj,
                clicks: (proj.clicks || 0) + 1
            };
        }

        await supabase
            .from('analytics')
            .update({
                interactions: updatedInteractions,
                projects,
                last_updated: new Date().toISOString()
            })
            .eq('user_id', userId)
            .eq('type', 'portfolio');
    } catch (error) {
        console.error('Error tracking interaction:', error);
    }
};

export const trackProjectView = async (userId, projectId) => {
    if (!userId || !projectId) return;

    try {
        const { data: existing } = await supabase
            .from('analytics')
            .select('*')
            .eq('user_id', userId)
            .eq('type', 'portfolio')
            .maybeSingle();

        if (!existing) return;

        const projects = existing.projects || {};
        const proj = projects[projectId] || { views: 0, clicks: 0 };
        projects[projectId] = {
            ...proj,
            views: (proj.views || 0) + 1
        };

        await supabase
            .from('analytics')
            .update({
                projects,
                last_updated: new Date().toISOString()
            })
            .eq('user_id', userId)
            .eq('type', 'portfolio');
    } catch (error) {
        console.error('Error tracking project view:', error);
    }
};

export const trackSessionDuration = async (userId, duration) => {
    if (!userId || !duration) return;

    try {
        const { data: existing } = await supabase
            .from('analytics')
            .select('*')
            .eq('user_id', userId)
            .eq('type', 'portfolio')
            .maybeSingle();

        if (!existing) return;

        const sessions = existing.sessions || {};
        const currentAvg = sessions.avgDuration || 0;
        const totalSessions = sessions.totalSessions || 1;
        const newAvg = Math.round(((currentAvg * (totalSessions - 1)) + duration) / totalSessions);

        await supabase
            .from('analytics')
            .update({
                sessions: {
                    ...sessions,
                    avgDuration: newAvg
                },
                last_updated: new Date().toISOString()
            })
            .eq('user_id', userId)
            .eq('type', 'portfolio');
    } catch (error) {
        console.error('Error tracking session duration:', error);
    }
};

export const getPortfolioAnalytics = async (userId) => {
    if (!userId) return null;

    try {
        const { data, error } = await supabase
            .from('analytics')
            .select('*')
            .eq('user_id', userId)
            .eq('type', 'portfolio')
            .maybeSingle();

        if (error && error.code !== 'PGRST116') {
            console.error('Error getting portfolio analytics:', error);
        }

        if (data) {
            return {
                views: data.views || {},
                interactions: data.interactions || {},
                sessions: data.sessions || {},
                projects: data.projects || {}
            };
        }

        const initialAnalytics = {
            views: { total: 0, last7Days: 0, last30Days: 0, byDate: {} },
            interactions: {
                githubClicks: { total: 0, last7Days: 0, last30Days: 0 },
                liveDemoClicks: { total: 0, last7Days: 0, last30Days: 0 },
                linkedinClicks: { total: 0, last7Days: 0, last30Days: 0 }
            },
            sessions: { totalSessions: 0, avgDuration: 0, lastSession: null },
            projects: {}
        };

        await supabase.from('analytics').insert({
            user_id: userId,
            type: 'portfolio',
            ...initialAnalytics,
            last_updated: new Date().toISOString()
        });

        return initialAnalytics;
    } catch (error) {
        console.error('Error getting portfolio analytics:', error);
        return {
            views: { total: 0, last7Days: 0, last30Days: 0, byDate: {} },
            interactions: {
                githubClicks: { total: 0, last7Days: 0, last30Days: 0 },
                liveDemoClicks: { total: 0, last7Days: 0, last30Days: 0 },
                linkedinClicks: { total: 0, last7Days: 0, last30Days: 0 }
            },
            sessions: { totalSessions: 0, avgDuration: 0, lastSession: null },
            projects: {}
        };
    }
};

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

export const resetPeriodCounters = async (userId) => {
    try {
        const { data: existing } = await supabase
            .from('analytics')
            .select('*')
            .eq('user_id', userId)
            .eq('type', 'portfolio')
            .maybeSingle();

        if (!existing || !existing.views?.byDate) return;

        const today = new Date();
        const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

        let last7Days = 0;
        let last30Days = 0;

        Object.entries(existing.views.byDate).forEach(([date, count]) => {
            const dateObj = new Date(date);
            if (dateObj >= sevenDaysAgo) last7Days += count;
            if (dateObj >= thirtyDaysAgo) last30Days += count;
        });

        await supabase
            .from('analytics')
            .update({
                views: {
                    ...existing.views,
                    last7Days,
                    last30Days
                },
                last_updated: new Date().toISOString()
            })
            .eq('user_id', userId)
            .eq('type', 'portfolio');
    } catch (error) {
        console.error('Error resetting period counters:', error);
    }
};

export const formatDuration = (seconds) => {
    if (!seconds) return '0s';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes === 0) return `${remainingSeconds}s`;
    if (remainingSeconds === 0) return `${minutes}m`;
    return `${minutes}m ${remainingSeconds}s`;
};

export const calculateTrend = (current, previous) => {
    if (!previous) return { change: current, percentage: 100, direction: 'up' };
    const change = current - previous;
    const percentage = Math.round((change / previous) * 100);
    const direction = change > 0 ? 'up' : change < 0 ? 'down' : 'neutral';
    return { change, percentage, direction };
};
