import { supabase } from "../supabase/supabase";

/**
 * Auth Error Handler (Supabase)
 */

export const isAuthError = (error) => {
    if (!error) return false;

    const message = (error.message || '').toLowerCase();
    const status = error.status;

    return (
        status === 401 ||
        status === 403 ||
        message.includes('jwt') ||
        message.includes('token') ||
        message.includes('session') ||
        message.includes('auth') ||
        message.includes('permission') ||
        message.includes('unauthorized')
    );
};

export const getAuthErrorMessage = (error) => {
    if (!error) return 'An unknown error occurred';

    const message = error.message || '';

    if (message.includes('Invalid login credentials')) {
        return 'Invalid email or password. Please try again.';
    }

    if (message.includes('Email not confirmed')) {
        return 'Please confirm your email address before logging in.';
    }

    if (message.includes('JWT') || message.includes('expired')) {
        return 'Your session has expired. Please log in again to continue.';
    }

    return message || 'Authentication error. Please try logging in again.';
};

export const handleAuthError = async (error, navigate, options = {}) => {
    if (!isAuthError(error)) {
        return false;
    }

    const {
        preserveLocation = true,
        showMessage = true,
        returnUrl = null
    } = options;

    console.error('Auth error:', error);
    const errorMessage = getAuthErrorMessage(error);

    try {
        await supabase.auth.signOut();
    } catch (signOutError) {
        console.error('Error signing out:', signOutError);
    }

    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
    const redirectUrl = returnUrl || (preserveLocation ? currentPath : '/dashboard');

    if (navigate) {
        navigate('/', {
            state: {
                error: showMessage ? errorMessage : null,
                returnUrl: redirectUrl
            }
        });
    }

    return true;
};

export const withAuthErrorHandling = (fn, navigate, options = {}) => {
    return async (...args) => {
        try {
            return await fn(...args);
        } catch (error) {
            const handled = await handleAuthError(error, navigate, options);
            if (!handled) {
                throw error;
            }
        }
    };
};

export const isSessionValid = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
};

export const refreshSession = async () => {
    try {
        const { data, error } = await supabase.auth.refreshSession();
        return !error && !!data.session;
    } catch (error) {
        console.error('Error refreshing session:', error);
        return false;
    }
};
