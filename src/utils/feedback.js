import { db } from '../firebase/firebase';
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Feedback Collection Utilities
 * 
 * Collect user feedback after key milestones
 * - First milestone completion
 * - First project completion
 * - General feedback
 */

// ============================================================================
// FEEDBACK SUBMISSION
// ============================================================================

/**
 * Submit user feedback
 * 
 * @param {string} userId - User ID
 * @param {Object} feedbackData - Feedback data
 * @param {string} feedbackData.type - 'first_milestone' | 'first_project' | 'general'
 * @param {string} feedbackData.text - Feedback text (max 300 chars)
 * @param {string} feedbackData.projectId - Optional project ID
 * @param {string} feedbackData.milestoneId - Optional milestone ID
 * @returns {Promise<string>} Feedback document ID
 */
export const submitFeedback = async (userId, feedbackData) => {
    if (!userId || !feedbackData) return null;

    try {
        const feedbackRef = collection(db, 'feedback');

        const feedbackDoc = await addDoc(feedbackRef, {
            userId,
            type: feedbackData.type || 'general',
            projectId: feedbackData.projectId || null,
            milestoneId: feedbackData.milestoneId || null,
            feedback: feedbackData.text.substring(0, 300), // Max 300 chars
            timestamp: serverTimestamp(),
            resolved: false,
            metadata: {
                userAgent: navigator.userAgent,
                platform: navigator.platform
            }
        });

        // Mark feedback as given in user document
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            [`feedbackGiven.${feedbackData.type}`]: true,
            [`feedbackGiven.lastSubmitted`]: serverTimestamp()
        });

        console.log('✅ Feedback submitted:', feedbackDoc.id);
        return feedbackDoc.id;
    } catch (error) {
        console.error('Error submitting feedback:', error);
        throw error;
    }
};

// ============================================================================
// FEEDBACK PROMPT LOGIC
// ============================================================================

/**
 * Check if feedback prompt should be shown
 * 
 * @param {Object} userData - User data
 * @returns {Object} { show: boolean, type: string }
 */
export const shouldShowFeedbackPrompt = (userData) => {
    if (!userData) return { show: false };

    const { activeProject, projects, feedbackGiven } = userData;

    // Don't show if feedback already given
    if (feedbackGiven?.first_milestone && feedbackGiven?.first_project) {
        return { show: false };
    }

    // Check for first milestone completion
    if (activeProject?.completedMilestones?.length === 1 && !feedbackGiven?.first_milestone) {
        return {
            show: true,
            type: 'first_milestone',
            projectId: activeProject.id,
            milestoneId: activeProject.completedMilestones[0]
        };
    }

    // Check for first project completion
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

/**
 * Dismiss feedback prompt (mark as seen but not submitted)
 * 
 * @param {string} userId - User ID
 * @param {string} type - Feedback type
 */
export const dismissFeedbackPrompt = async (userId, type) => {
    if (!userId || !type) return;

    try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            [`feedbackGiven.${type}`]: 'dismissed',
            [`feedbackGiven.lastDismissed`]: serverTimestamp()
        });
    } catch (error) {
        console.error('Error dismissing feedback prompt:', error);
    }
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Validate feedback text
 * 
 * @param {string} text - Feedback text
 * @returns {Object} { valid: boolean, error: string }
 */
export const validateFeedback = (text) => {
    if (!text || !text.trim()) {
        return { valid: false, error: 'Feedback cannot be empty' };
    }

    if (text.length > 300) {
        return { valid: false, error: 'Feedback must be 300 characters or less' };
    }

    // Check for spam patterns (basic)
    const spamPatterns = [
        /(.)\1{10,}/, // Repeated characters
        /^[^a-zA-Z0-9]+$/, // Only special characters
    ];

    for (const pattern of spamPatterns) {
        if (pattern.test(text)) {
            return { valid: false, error: 'Invalid feedback format' };
        }
    }

    return { valid: true };
};
