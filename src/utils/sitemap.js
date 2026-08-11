import { supabase } from '../supabase/supabase';
import { mapUserRowToData } from '../services/user.service';

/**
 * Generate sitemap XML for public portfolios (Supabase)
 */
export const generateSitemap = async () => {
    const baseUrl = 'https://madeit.app';

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}/</loc>\n`;
    xml += '    <changefreq>weekly</changefreq>\n';
    xml += '    <priority>1.0</priority>\n';
    xml += '  </url>\n';

    try {
        const { data: users, error } = await supabase
            .from('users')
            .select('*')
            .filter('settings->>publicPortfolio', 'eq', 'true')
            .filter('onboarding->>profileCompleted', 'eq', 'true');

        if (error) {
            console.error('Error fetching users for sitemap:', error);
        } else if (users) {
            users.forEach((row) => {
                const userData = mapUserRowToData(row);
                const username = userData.profile?.username;

                if (username) {
                    xml += '  <url>\n';
                    xml += `    <loc>${baseUrl}/portfolio/${username}</loc>\n`;
                    xml += '    <changefreq>daily</changefreq>\n';
                    xml += '    <priority>0.8</priority>\n';
                    xml += '  </url>\n';
                }
            });
        }

    } catch (error) {
        console.error('Error generating sitemap:', error);
    }

    xml += '</urlset>';
    return xml;
};

export const getFeaturedPortfolios = async (limit = 6) => {
    try {
        const { data: users, error } = await supabase
            .from('users')
            .select('*')
            .filter('settings->>publicPortfolio', 'eq', 'true')
            .filter('onboarding->>profileCompleted', 'eq', 'true');

        if (error) {
            console.error('Error fetching featured portfolios:', error);
            return [];
        }

        const portfolios = [];

        users.forEach((row) => {
            const userData = mapUserRowToData(row);
            const username = userData.profile?.username;

            if (username && userData.activeProject?.completedMilestones?.length > 0) {
                portfolios.push({
                    username,
                    name: userData.name || userData.profile?.fullName || 'Developer',
                    role: userData.portfolio?.role || 'Developer',
                    photoURL: userData.photoURL || userData.profile?.photoURL || '',
                    projectCount: userData.activeProject?.completedMilestones?.length || 0,
                    skills: getSkillsFromUserData(userData),
                    activeDays: 0
                });
            }
        });

        return portfolios
            .sort((a, b) => b.projectCount - a.projectCount)
            .slice(0, limit);

    } catch (error) {
        console.error('Error fetching featured portfolios:', error);
        return [];
    }
};

const getSkillsFromUserData = (userData) => {
    const skills = new Set();
    return Array.from(skills).slice(0, 5);
};
