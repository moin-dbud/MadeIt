import { supabase } from "../supabase/supabase";
import { mapUserRowToData } from "../services/user.service";

/**
 * Fetch user data by username
 * 
 * @param {string} username - Username to search for
 * @returns {Object|null} - User data or null if not found
 */
export const getUserByUsername = async (username) => {
    if (!username) {
        return null;
    }

    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .filter('profile->>username', 'eq', username.toLowerCase())
            .maybeSingle();

        if (error) {
            console.error("Error fetching user by username from Supabase:", error);
            return null;
        }

        if (!data) {
            return null;
        }

        return mapUserRowToData(data);
    } catch (error) {
        console.error("Error fetching user by username:", error);
        throw error;
    }
};

/**
 * Check if username is available
 * 
 * @param {string} username - Username to check
 * @returns {boolean} - True if available, false if taken
 */
export const isUsernameAvailable = async (username) => {
    if (!username) {
        return false;
    }

    try {
        const user = await getUserByUsername(username);
        return user === null;
    } catch (error) {
        console.error("Error checking username availability:", error);
        return false;
    }
};

/**
 * Validate username format
 * 
 * @param {string} username - Username to validate
 * @returns {Object} - { valid: boolean, error: string }
 */
export const validateUsername = (username) => {
    if (!username) {
        return { valid: false, error: "Username is required" };
    }

    // Must be 3-20 characters
    if (username.length < 3 || username.length > 20) {
        return { valid: false, error: "Username must be 3-20 characters" };
    }

    // Must start with letter
    if (!/^[a-z]/.test(username.toLowerCase())) {
        return { valid: false, error: "Username must start with a letter" };
    }

    // Only lowercase letters, numbers, hyphens, underscores
    if (!/^[a-z0-9_-]+$/i.test(username)) {
        return { valid: false, error: "Username can only contain letters, numbers, hyphens, and underscores" };
    }

    // No consecutive special characters
    if (/[-_]{2,}/.test(username)) {
        return { valid: false, error: "Username cannot have consecutive hyphens or underscores" };
    }

    return { valid: true, error: null };
};

/**
 * Filter user data for public view
 * Removes sensitive information
 * 
 * @param {Object} userData - Full user data
 * @returns {Object} - Filtered public data
 */
export const filterPublicUserData = (userData) => {
    if (!userData) {
        return null;
    }

    const publicData = { ...userData };

    delete publicData.email;
    delete publicData.phone;
    delete publicData.onboarding;

    if (publicData.activeProject) {
        const activeProject = { ...publicData.activeProject };

        activeProject.completedMilestones = activeProject.completedMilestones || [];

        delete activeProject.completedTasks;
        delete activeProject.taskCompletionHistory;

        publicData.activeProject = activeProject;
    }

    if (publicData.portfolio?.settings) {
        const settings = { ...publicData.portfolio.settings };

        settings.showEmail = false;
        settings.requireLoginForDetails = false;

        publicData.portfolio = {
            ...publicData.portfolio,
            settings
        };
    }

    return publicData;
};

/**
 * Generate public portfolio URL
 * 
 * @param {string} username - Username
 * @returns {string} - Full portfolio URL
 */
export const getPublicPortfolioUrl = (username) => {
    if (!username) {
        return '';
    }

    const baseUrl = window.location.origin;
    return `${baseUrl}/portfolio/${username.toLowerCase()}`;
};

/**
 * Generate social share URLs
 * 
 * @param {string} username - Username
 * @param {string} name - User's full name
 * @returns {Object} - Social share URLs
 */
export const getSocialShareUrls = (username, name = '') => {
    const portfolioUrl = getPublicPortfolioUrl(username);
    const encodedUrl = encodeURIComponent(portfolioUrl);
    const title = name ? `${name} · Proof-of-Work Portfolio` : 'My Proof-of-Work Portfolio';
    const encodedTitle = encodeURIComponent(title);
    const text = encodeURIComponent(`Check out my proof-of-work portfolio on MadeIt`);

    return {
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${text}`,
        whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
    };
};
