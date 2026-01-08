import { auth } from "../firebase/firebase";
import { signOut } from "firebase/auth";

/**
 * Auth Error Handler
 * 
 * Utilities for handling authentication errors gracefully.
 */

/**
 * Check if error is an auth error
 */
export const isAuthError = (error) => {
    if (!error) return false;

    const authErrorCodes = [
        'auth/user-not-found',
        'auth/wrong-password',
        'auth/invalid-credential',
        'auth/user-disabled',
        'auth/too-many-requests',
        'auth/network-request-failed',
        'auth/expired-action-code',
        'auth/invalid-action-code',
        'auth/user-token-expired',
        'auth/requires-recent-login',
        'permission-denied',
        'unauthenticated'
    ];

    return authErrorCodes.some(code =>
        error.code?.includes(code) ||
        error.message?.toLowerCase().includes(code.replace('auth/', ''))
    );
};

/**
 * Get user-friendly auth error message
 */
export const getAuthErrorMessage = (error) => {
    if (!error) return 'An unknown error occurred';

    const code = error.code || '';
    const message = error.message || '';

    // Session expired
    if (code.includes('token-expired') || code.includes('requires-recent-login')) {
        return 'Your session has expired. Please log in again to continue.';
    }

    // Permission denied
    if (code.includes('permission-denied') || message.includes('permission')) {
        return 'You don\'t have permission to access this resource. Please log in again.';
    }

    // Network issues
    if (code.includes('network-request-failed')) {
        return 'Network error. Please check your connection and try again.';
    }

    // User not found
    if (code.includes('user-not-found')) {
        return 'Account not found. Please check your credentials.';
    }

    // Invalid credentials
    if (code.includes('wrong-password') || code.includes('invalid-credential')) {
        return 'Invalid email or password. Please try again.';
    }

    // Account disabled
    if (code.includes('user-disabled')) {
        return 'This account has been disabled. Please contact support.';
    }

    // Too many attempts
    if (code.includes('too-many-requests')) {
        return 'Too many failed attempts. Please try again later.';
    }

    // Default
    return 'Authentication error. Please try logging in again.';
};

/**
 * Handle auth error and redirect if needed
 * 
 * @param {Error} error - The error object
 * @param {Function} navigate - React Router navigate function
 * @param {Object} options - Additional options
 * @returns {boolean} - Whether the error was handled
 */
export const handleAuthError = async (error, navigate, options = {}) => {
    if (!isAuthError(error)) {
        return false; // Not an auth error, let caller handle it
    }

    const {
        preserveLocation = true,
        showMessage = true,
        returnUrl = null
    } = options;

    console.error('Auth error:', error);

    // Get friendly error message
    const errorMessage = getAuthErrorMessage(error);

    // Sign out user
    try {
        await signOut(auth);
    } catch (signOutError) {
        console.error('Error signing out:', signOutError);
    }

    // Prepare redirect
    const currentPath = window.location.pathname;
    const redirectUrl = returnUrl || (preserveLocation ? currentPath : '/dashboard');

    // Navigate to home with error message
    navigate('/', {
        state: {
            error: showMessage ? errorMessage : null,
            returnUrl: redirectUrl
        }
    });

    return true; // Error was handled
};

/**
 * Wrap async function with auth error handling
 * 
 * Usage:
 * const safeFunction = withAuthErrorHandling(myAsyncFunction, navigate);
 * await safeFunction();
 */
export const withAuthErrorHandling = (fn, navigate, options = {}) => {
    return async (...args) => {
        try {
            return await fn(...args);
        } catch (error) {
            const handled = await handleAuthError(error, navigate, options);
            if (!handled) {
                throw error; // Re-throw if not an auth error
            }
        }
    };
};

/**
 * Check if user session is valid
 */
export const isSessionValid = () => {
    const user = auth.currentUser;
    if (!user) return false;

    // Check if token is expired (Firebase handles this internally)
    // We just check if user exists
    return true;
};

/**
 * Refresh user session
 */
export const refreshSession = async () => {
    const user = auth.currentUser;
    if (!user) return false;

    try {
        // Force token refresh
        await user.getIdToken(true);
        return true;
    } catch (error) {
        console.error('Error refreshing session:', error);
        return false;
    }
};
