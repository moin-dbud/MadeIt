import { supabase } from '../supabase/supabase';
import { updateUserProfile, getUserProfile } from '../services/user.service';

/**
 * Feedback Collection Utilities (Supabase)
 */

export const submitFeedback = async (userId, feedbackData) => {
    if (!userId || !feedbackData) return null;

    try {
        const { data: inserted, error } = await supabase
            .from('feedback')
            .insert({
                user_id: userId,
                type: feedbackData.type || 'general',
                project_id: feedbackData.projectId || null,
                milestone_id: feedbackData.milestoneId || null,
                feedback: feedbackData.text.substring(0, 300),
                resolved: false,
                metadata: {
                    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
                    platform: typeof navigator !== 'undefined' ? navigator.platform : ''
                },
                created_at: new Date().toISOString()
            })
            .select('id')
            .single();

        if (error) {
            console.error('Error submitting feedback to Supabase:', error);
            throw error;
        }

        const userDoc = await getUserProfile(userId);
        const currentFeedbackGiven = userDoc?.feedbackGiven || {};

        await updateUserProfile(userId, {
            feedbackGiven: {
                ...currentFeedbackGiven,
                [feedbackData.type]: true,
                lastSubmitted: new Date().toISOString()
            }
        });

        console.log('✅ Feedback submitted:', inserted.id);
        return inserted.id;
    } catch (error) {
        console.error('Error submitting feedback:', error);
        throw error;
    }
};

export const shouldShowFeedbackPrompt = (userData) => {
    if (!userData) return { show: false };

    const { activeProject, projects, feedbackGiven } = userData;

    if (feedbackGiven?.first_milestone && feedbackGiven?.first_project) {
        return { show: false };
    }

    if (activeProject?.completedMilestones?.length === 1 && !feedbackGiven?.first_milestone) {
        return {
            show: true,
            type: 'first_milestone',
            projectId: activeProject.id,
            milestoneId: activeProject.completedMilestones[0]
        };
    }

    if (projects && Object.keys(projects).length === 1 && !feedbackGiven?.first_project) {
        const firstProjectId = Object.keys(projects)[0];
        const firstProject = projects[firstProjectId];

        if (firstProject.completed) {
            return {
                show: true,
                type: 'first_project',
                projectId: firstProjectId
            };
        }
    }

    return { show: false };
};

export const dismissFeedbackPrompt = async (userId, type) => {
    if (!userId || !type) return;

    try {
        const userDoc = await getUserProfile(userId);
        const currentFeedbackGiven = userDoc?.feedbackGiven || {};

        await updateUserProfile(userId, {
            feedbackGiven: {
                ...currentFeedbackGiven,
                [type]: 'dismissed',
                lastDismissed: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Error dismissing feedback prompt:', error);
    }
};

export const validateFeedback = (text) => {
    if (!text || !text.trim()) {
        return { valid: false, error: 'Feedback cannot be empty' };
    }

    if (text.length > 300) {
        return { valid: false, error: 'Feedback must be 300 characters or less' };
    }

    const spamPatterns = [
        /(.)\1{10,}/,
        /^[^a-zA-Z0-9]+$/,
    ];

    for (const pattern of spamPatterns) {
        if (pattern.test(text)) {
            return { valid: false, error: 'Invalid feedback format' };
        }
    }

    return { valid: true };
};
