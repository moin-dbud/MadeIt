// Email configuration
// In production (Vercel), use relative paths for API routes
// In development, use localhost
export const EMAIL_CONFIG = {
    ADMIN_EMAIL: import.meta.env.VITE_ADMIN_EMAIL || 'admin@madeit.com',
    // Use relative path: Vite dev proxy forwards /api to localhost:3001, Vercel routes /api in production
    API_BASE_URL: ''
};
