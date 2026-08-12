import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, UserPlus, Lock, Mail, User, ArrowRight } from 'lucide-react';
import { supabase } from '../supabase/supabase';
import { getUserProfile, createUserIfNotExists } from '../services/user.service';
import { signInWithGoogle } from '../firebase/auth';
import { useNavigate, useLocation } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Mode state: 'login' or 'signup'
    const [isSignUp, setIsSignUp] = useState(false);
    
    // Form fields
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    // Status states
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const handleAuth = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setLoading(true);

        const trimmedEmail = email.trim();
        const trimmedName = fullName.trim();

        try {
            if (isSignUp) {
                // CREATE ACCOUNT (Sign Up)
                if (password.length < 6) {
                    setError('Password must be at least 6 characters long.');
                    setLoading(false);
                    return;
                }

                const { data, error: signUpError } = await supabase.auth.signUp({
                    email: trimmedEmail,
                    password: password,
                    options: {
                        data: {
                            full_name: trimmedName || trimmedEmail.split('@')[0],
                            name: trimmedName || trimmedEmail.split('@')[0]
                        }
                    }
                });

                if (signUpError) {
                    throw signUpError;
                }

                if (data.user) {
                    // Create user document in database
                    await createUserIfNotExists({
                        ...data.user,
                        user_metadata: {
                            ...data.user.user_metadata,
                            full_name: trimmedName || trimmedEmail.split('@')[0]
                        }
                    });

                    // If session exists immediately (email confirmation turned off in Supabase)
                    if (data.session) {
                        const userData = await getUserProfile(data.user.id);
                        const profileCompleted = userData?.onboarding?.profileCompleted === true;
                        const from = location.state?.from || (profileCompleted ? '/dashboard' : '/profile-setup');
                        navigate(from, { replace: true });
                    } else {
                        // Email confirmation is required by Supabase auth settings
                        setSuccessMessage('Account created successfully! If required by server settings, please check your email for a confirmation link, then sign in.');
                        setIsSignUp(false); // Switch to login tab
                    }
                }
            } else {
                // SIGN IN (Log In)
                const { data, error: signInError } = await supabase.auth.signInWithPassword({
                    email: trimmedEmail,
                    password: password
                });

                if (signInError) {
                    throw signInError;
                }

                const sessionUser = data.user;
                await createUserIfNotExists(sessionUser);

                const userData = await getUserProfile(sessionUser.id);
                const profileCompleted = userData?.onboarding?.profileCompleted === true;
                const from = location.state?.from || (profileCompleted ? '/dashboard' : '/profile-setup');

                navigate(from, { replace: true });
            }
        } catch (err) {
            console.error('Auth error:', err);

            if (err.message?.includes('Invalid login credentials')) {
                setError('Invalid email or password. Please check your credentials and try again.');
            } else if (err.message?.includes('User already registered') || err.message?.includes('already exists')) {
                setError('An account with this email already exists. Please sign in instead.');
            } else if (err.message?.includes('Email not confirmed')) {
                setError('Please confirm your email address before logging in. Check your inbox for the confirmation link from Supabase.');
            } else if (err.status === 429) {
                setError('Too many attempts. Please wait a few moments and try again.');
            } else {
                setError(err.message || 'An error occurred during authentication. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleAuth = async () => {
        setError('');
        setGoogleLoading(true);
        try {
            await signInWithGoogle();
        } catch (err) {
            console.error('Google Auth Error:', err);
            if (err.message?.includes('provider is not enabled') || err.error_code === 'validation_failed') {
                setError('Google Sign-In is not enabled in your Supabase project settings yet. Please use Email/Password sign up or enable Google provider in your Supabase Dashboard.');
            } else {
                setError(err.message || 'Failed to sign in with Google. Please try again.');
            }
            setGoogleLoading(false);
        }
    };

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center px-6 py-12">
            <div className="w-full max-w-md">
                {/* Header */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-8"
                >
                    <div className="w-16 h-16 bg-gradient-to-br from-[#4A7BFF] to-[#FF6B35] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#FF6B35]/20">
                        {isSignUp ? <UserPlus className="w-8 h-8 text-white" /> : <Lock className="w-8 h-8 text-white" />}
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-3">
                        {isSignUp ? 'Create Your Account' : 'Welcome Back'}
                    </h1>
                    <p className="text-gray-400 text-sm">
                        {isSignUp
                            ? 'Join MadeIt to start building your proof-of-work portfolio'
                            : 'Sign in to access your projects and portfolio dashboard'}
                    </p>
                </motion.div>

                {/* Mode Selector Tabs */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    transition={{ duration: 0.6, delay: 0.05 }}
                    className="flex bg-white/5 p-1 rounded-xl mb-6 border border-white/10"
                >
                    <button
                        type="button"
                        onClick={() => {
                            setIsSignUp(false);
                            setError('');
                            setSuccessMessage('');
                        }}
                        className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                            !isSignUp
                                ? 'bg-gradient-to-r from-[#4A7BFF] to-[#FF6B35] text-white shadow-md'
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        Sign In
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setIsSignUp(true);
                            setError('');
                            setSuccessMessage('');
                        }}
                        className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                            isSignUp
                                ? 'bg-gradient-to-r from-[#4A7BFF] to-[#FF6B35] text-white shadow-md'
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        Create Account
                    </button>
                </motion.div>

                {/* Social Login Button */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="mb-6"
                >
                    <button
                        type="button"
                        onClick={handleGoogleAuth}
                        disabled={googleLoading || loading}
                        className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-3 text-sm text-gray-200 hover:text-white disabled:opacity-50"
                    >
                        {googleLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    fill="#EA4335"
                                    d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
                                />
                                <path
                                    fill="#4285F4"
                                    d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
                                />
                            </svg>
                        )}
                        <span>Continue with Google</span>
                    </button>
                </motion.div>

                <div className="relative flex items-center justify-center mb-6">
                    <div className="border-t border-white/10 w-full"></div>
                    <span className="bg-[#0A0A0A] px-3 text-xs text-gray-500 uppercase tracking-wider">or with email</span>
                </div>

                {/* Form */}
                <motion.form
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    transition={{ duration: 0.6, delay: 0.15 }}
                    onSubmit={handleAuth}
                    className="space-y-4"
                >
                    {/* Full Name (Sign Up only) */}
                    {isSignUp && (
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-1.5">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="w-5 h-5 text-gray-500 absolute left-3.5 top-3.5" />
                                <input
                                    type="text"
                                    id="fullName"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required={isSignUp}
                                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-[#FF6B35] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 transition-colors text-white placeholder-gray-500 text-sm"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>
                    )}

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1.5">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="w-5 h-5 text-gray-500 absolute left-3.5 top-3.5" />
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-[#FF6B35] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 transition-colors text-white placeholder-gray-500 text-sm"
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1.5">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="w-5 h-5 text-gray-500 absolute left-3.5 top-3.5" />
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-[#FF6B35] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 transition-colors text-white placeholder-gray-500 text-sm"
                                placeholder="••••••••"
                            />
                        </div>
                        {isSignUp && (
                            <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters long</p>
                        )}
                    </div>

                    {/* Success Message */}
                    {successMessage && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl"
                        >
                            <p className="text-green-400 text-sm">{successMessage}</p>
                        </motion.div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl"
                        >
                            <p className="text-red-400 text-sm">{error}</p>
                        </motion.div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-6 py-3.5 bg-gradient-to-r from-[#4A7BFF] to-[#FF6B35] hover:from-[#5a8bff] hover:to-[#ff7d4d] text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 shadow-lg shadow-[#FF6B35]/20 text-sm mt-2"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>{isSignUp ? 'Creating Account...' : 'Signing In...'}</span>
                            </>
                        ) : (
                            <>
                                <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </motion.form>

                {/* Footer Toggle Note */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mt-8 text-center"
                >
                    <p className="text-sm text-gray-400">
                        {isSignUp ? (
                            <>
                                Already have an account?{' '}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsSignUp(false);
                                        setError('');
                                        setSuccessMessage('');
                                    }}
                                    className="text-[#FF6B35] hover:underline font-medium"
                                >
                                    Sign In
                                </button>
                            </>
                        ) : (
                            <>
                                Don't have an account?{' '}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsSignUp(true);
                                        setError('');
                                        setSuccessMessage('');
                                    }}
                                    className="text-[#FF6B35] hover:underline font-medium"
                                >
                                    Create Account
                                </button>
                            </>
                        )}
                    </p>
                    <a
                        href="/"
                        className="inline-block mt-4 text-xs text-gray-500 hover:text-gray-300 transition-colors"
                    >
                        ← Back to Home
                    </a>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
