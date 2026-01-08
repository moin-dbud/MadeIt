import { useEffect } from 'react';

/**
 * SEO Meta Tags Hook
 * 
 * Updates document meta tags for SEO and social sharing.
 * 
 * @param {Object} config - SEO configuration
 * @param {string} config.title - Page title
 * @param {string} config.description - Page description
 * @param {string} config.image - OG image URL
 * @param {string} config.url - Canonical URL
 * @param {string} config.type - OG type (website, profile, etc.)
 */
export const useSEO = ({ title, description, image, url, type = 'website' }) => {
    useEffect(() => {
        // Update title
        if (title) {
            document.title = title;
        }

        // Update or create meta tags
        const updateMetaTag = (property, content, isName = false) => {
            if (!content) return;

            const attribute = isName ? 'name' : 'property';
            let element = document.querySelector(`meta[${attribute}="${property}"]`);

            if (!element) {
                element = document.createElement('meta');
                element.setAttribute(attribute, property);
                document.head.appendChild(element);
            }

            element.setAttribute('content', content);
        };

        // Standard meta tags
        updateMetaTag('description', description, true);

        // OpenGraph tags
        updateMetaTag('og:title', title);
        updateMetaTag('og:description', description);
        updateMetaTag('og:image', image);
        updateMetaTag('og:url', url);
        updateMetaTag('og:type', type);

        // Twitter Card tags
        updateMetaTag('twitter:card', image ? 'summary_large_image' : 'summary', true);
        updateMetaTag('twitter:title', title, true);
        updateMetaTag('twitter:description', description, true);
        updateMetaTag('twitter:image', image, true);

        // Canonical URL
        let canonical = document.querySelector('link[rel="canonical"]');
        if (url) {
            if (!canonical) {
                canonical = document.createElement('link');
                canonical.setAttribute('rel', 'canonical');
                document.head.appendChild(canonical);
            }
            canonical.setAttribute('href', url);
        }

        // Cleanup function
        return () => {
            // Reset to default on unmount
            document.title = 'MadeIt · Proof-of-Work Portfolio Platform';
        };
    }, [title, description, image, url, type]);
};

/**
 * Generate SEO config for portfolio page
 * 
 * @param {Object} userData - User data
 * @param {string} username - Username
 * @returns {Object} - SEO configuration
 */
export const getPortfolioSEO = (userData, username) => {
    if (!userData) {
        return {
            title: 'Portfolio Not Found | MadeIt',
            description: 'The portfolio you are looking for does not exist.',
            url: window.location.href
        };
    }

    const name = userData.name || userData.profile?.fullName || 'Developer';
    const role = userData.portfolio?.role || 'Developer';
    const statement = userData.portfolio?.statement || 'Building real projects and learning by doing.';

    // Count completed projects
    const completedProjects = userData.activeProject?.completedMilestones?.length || 0;
    const projectText = completedProjects === 1 ? '1 project' : `${completedProjects} projects`;

    // Generate description
    const description = `${statement} ${completedProjects > 0 ? `${completedProjects} completed ${completedProjects === 1 ? 'project' : 'projects'}.` : ''}`.trim();

    // Get profile image
    const image = userData.photoURL || userData.profile?.photoURL || '';

    // Generate URL
    const baseUrl = window.location.origin;
    const url = `${baseUrl}/portfolio/${username}`;

    return {
        title: `${name} · Proof-of-Work Portfolio | MadeIt`,
        description: description.substring(0, 160), // Limit to 160 chars for SEO
        image,
        url,
        type: 'profile'
    };
};

/**
 * Generate SEO config for home page
 */
export const getHomeSEO = () => {
    return {
        title: 'MadeIt · Proof-of-Work Portfolio Platform',
        description: 'Build real projects, prove your skills, and create a portfolio that recruiters trust. No fake projects, just real work.',
        url: window.location.origin,
        type: 'website'
    };
};

/**
 * Track portfolio view (lightweight analytics)
 * 
 * @param {string} username - Portfolio username
 * @param {string} referrer - Referrer source
 */
export const trackPortfolioView = async (username, referrer = document.referrer) => {
    try {
        // Parse referrer to get source
        let source = 'direct';
        if (referrer) {
            const url = new URL(referrer);
            const hostname = url.hostname.toLowerCase();

            if (hostname.includes('linkedin')) source = 'linkedin';
            else if (hostname.includes('twitter') || hostname.includes('t.co')) source = 'twitter';
            else if (hostname.includes('facebook')) source = 'facebook';
            else if (hostname.includes('whatsapp')) source = 'whatsapp';
            else if (hostname.includes('google')) source = 'google';
            else source = 'other';
        }

        // Log view (in production, send to analytics service)
        console.log('Portfolio view:', {
            username,
            source,
            timestamp: new Date().toISOString()
        });

        // TODO: In production, send to analytics service
        // await fetch('/api/analytics/view', {
        //     method: 'POST',
        //     body: JSON.stringify({ username, source })
        // });

    } catch (error) {
        console.error('Error tracking portfolio view:', error);
    }
};
