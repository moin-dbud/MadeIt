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
 * @param {string} config.robots - Robots meta directive
 * @param {Object} config.structuredData - JSON-LD structured data
 * @param {string} config.ogSiteName - OG site name
 * @param {string} config.author - Author meta
 */
export const useSEO = ({
    title,
    description,
    image,
    url,
    type = 'website',
    robots,
    structuredData,
    ogSiteName,
    author
}) => {
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
        updateMetaTag('author', author, true);
        updateMetaTag('robots', robots, true);

        // OpenGraph tags
        updateMetaTag('og:title', title);
        updateMetaTag('og:description', description);
        updateMetaTag('og:image', image);
        updateMetaTag('og:url', url);
        updateMetaTag('og:type', type);
        updateMetaTag('og:site_name', ogSiteName || 'MadeIt');

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

        // JSON-LD Structured Data
        let structuredDataScript = document.querySelector('script[type="application/ld+json"]');
        if (structuredData) {
            if (!structuredDataScript) {
                structuredDataScript = document.createElement('script');
                structuredDataScript.setAttribute('type', 'application/ld+json');
                document.head.appendChild(structuredDataScript);
            }
            structuredDataScript.textContent = JSON.stringify(structuredData);
        } else if (structuredDataScript) {
            // Remove if no structured data
            structuredDataScript.remove();
        }

        // Cleanup function
        return () => {
            // Reset to default on unmount
            document.title = 'MadeIt · Proof-of-Work Portfolio Platform';

            // Remove structured data on unmount
            const script = document.querySelector('script[type="application/ld+json"]');
            if (script) script.remove();
        };
    }, [title, description, image, url, type, robots, structuredData, ogSiteName, author]);
};

/**
 * Generate SEO config for portfolio page
 * 
 * @param {Object} userData - User data
 * @param {string} username - Username
 * @param {boolean} isPublic - Whether portfolio is public
 * @returns {Object} - SEO configuration
 */
export const getPortfolioSEO = (userData, username, isPublic = true) => {
    // Portfolio not found state
    if (!userData) {
        return {
            title: 'Portfolio Not Found | MadeIt',
            description: 'The portfolio you are looking for does not exist or has been removed.',
            url: window.location.href,
            type: 'website',
            robots: 'noindex, nofollow'
        };
    }

    const name = userData.name || userData.profile?.fullName || 'Developer';
    const bio = userData.profile?.bio || '';

    // Extract role from bio or use default
    const role = bio.split('\n')[0] || 'Developer';

    // Use bio as personal statement (limit to 160 chars for meta description)
    const statement = bio.substring(0, 160);

    // Count completed projects
    let completedCount = 0;
    if (userData.projects) {
        completedCount = Object.values(userData.projects).filter(p => p.completed).length;
    }

    // Generate title
    const title = `${name} — ${role} | Proof-of-Work Portfolio`;

    // Generate description
    let description = statement;
    if (!description) {
        description = `View ${name}'s proof-of-work portfolio with real projects and GitHub-verified milestones.`;
    }
    description += ` Built with real projects, milestones, and GitHub-verified work on MadeIt.`;
    description = description.substring(0, 160); // SEO best practice

    // Get profile image (use absolute URL)
    const baseUrl = window.location.origin;
    let image = '';
    if (userData.profile?.photoURL) {
        // If it's a data URL or absolute URL, use as is
        if (userData.profile.photoURL.startsWith('data:') || userData.profile.photoURL.startsWith('http')) {
            image = userData.profile.photoURL;
        } else {
            image = `${baseUrl}${userData.profile.photoURL}`;
        }
    } else {
        // Fallback to MadeIt OG image
        image = `${baseUrl}/madeit-og.png`;
    }

    // Generate canonical URL
    const url = `${baseUrl}/portfolio/${username}`;

    // Social links for structured data
    const sameAs = [];
    if (userData.socials?.github) sameAs.push(userData.socials.github);
    if (userData.socials?.linkedin) sameAs.push(userData.socials.linkedin);
    if (userData.socials?.twitter) sameAs.push(userData.socials.twitter);

    // Robots meta
    const robots = isPublic ? 'index, follow' : 'noindex, nofollow';

    return {
        title,
        description,
        image,
        url,
        type: 'profile',
        robots,
        // Structured data (JSON-LD)
        structuredData: {
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: name,
            jobTitle: role,
            url: url,
            image: image,
            sameAs: sameAs,
            description: statement
        },
        // OpenGraph specific
        ogSiteName: 'MadeIt',
        // Additional meta
        author: name
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
