// Email configuration
// In production (Vercel), use relative paths for API routes
// In development, use localhost
export const EMAIL_CONFIG = {
    ADMIN_EMAIL: import.meta.env.VITE_ADMIN_EMAIL || 'admin@madeit.com',
    // Use relative path for production (Vercel), localhost for development
    API_BASE_URL: import.meta.env.PROD ? '' : 'http://localhost:3001'
};
