import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';

/**
 * Generate sitemap XML for public portfolios
 * 
 * @returns {string} - Sitemap XML string
 */
export const generateSitemap = async () => {
    const baseUrl = 'https://madeit.app'; // Update with your production domain

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Add landing page
    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}/</loc>\n`;
    xml += '    <changefreq>weekly</changefreq>\n';
    xml += '    <priority>1.0</priority>\n';
    xml += '  </url>\n';

    try {
        // Fetch all public portfolios
        const usersRef = collection(db, 'users');
        const q = query(
            usersRef,
            where('settings.publicPortfolio', '==', true),
            where('onboarding.profileCompleted', '==', true)
        );

        const querySnapshot = await getDocs(q);

        // Add each public portfolio
        querySnapshot.forEach((doc) => {
            const userData = doc.data();
            const username = userData.profile?.username;

            // Only include if username exists
            if (username) {
                xml += '  <url>\n';
                xml += `    <loc>${baseUrl}/portfolio/${username}</loc>\n`;
                xml += '    <changefreq>daily</changefreq>\n';
                xml += '    <priority>0.8</priority>\n';
                xml += '  </url>\n';
            }
        });

    } catch (error) {
        console.error('Error generating sitemap:', error);
    }

    xml += '</urlset>';
    return xml;
};

/**
 * Get public portfolio usernames for featured section
 * 
 * @param {number} limit - Number of portfolios to fetch
 * @returns {Array} - Array of public portfolio data
 */
export const getFeaturedPortfolios = async (limit = 6) => {
    try {
        const usersRef = collection(db, 'users');
        const q = query(
            usersRef,
            where('settings.publicPortfolio', '==', true),
            where('onboarding.profileCompleted', '==', true),
            where('portfolio.setupCompleted', '==', true)
        );

        const querySnapshot = await getDocs(q);
        const portfolios = [];

        querySnapshot.forEach((doc) => {
            const userData = doc.data();
            const username = userData.profile?.username;

            // Only include if username exists and has completed projects
            if (username && userData.activeProject?.completedMilestones?.length > 0) {
                portfolios.push({
                    username,
                    name: userData.name || userData.profile?.fullName || 'Developer',
                    role: userData.portfolio?.role || 'Developer',
                    photoURL: userData.photoURL || userData.profile?.photoURL || '',
                    projectCount: userData.activeProject?.completedMilestones?.length || 0,
                    skills: getSkillsFromUserData(userData),
                    activeDays: 0 // Will be calculated from activity tracking
                });
            }
        });

        // Sort by project count (descending) and return limited results
        return portfolios
            .sort((a, b) => b.projectCount - a.projectCount)
            .slice(0, limit);

    } catch (error) {
        console.error('Error fetching featured portfolios:', error);
        return [];
    }
};

/**
 * Extract skills from user data
 * 
 * @param {Object} userData - User data
 * @returns {Array} - Array of skill names
 */
const getSkillsFromUserData = (userData) => {
    const skills = new Set();

    // Get skills from completed milestones
    if (userData.activeProject?.completedMilestones) {
        // This would need to be enhanced to actually extract skills
        // from milestone data based on your project configuration
        // For now, return empty array
    }

    return Array.from(skills).slice(0, 5); // Limit to 5 skills
};
