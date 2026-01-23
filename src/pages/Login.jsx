import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, Lock } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate, useLocation } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;

            // Check if user document exists in Firestore
            const userDocRef = doc(db, 'users', firebaseUser.uid);
            const userDoc = await getDoc(userDocRef);

            // If user document doesn't exist, create it
            if (!userDoc.exists()) {
                await setDoc(userDocRef, {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName || '',
                    photoURL: firebaseUser.photoURL || '',
                    bio: '',
                    githubUsername: '',
                    skills: [],
                    isAdmin: false,
                    onboarding: {
                        profileCompleted: false
                    },
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                });
                console.log('Created Firestore user document for:', firebaseUser.email);
            }

            // Get redirect destination
            const userData = userDoc.exists() ? userDoc.data() : null;
            const profileCompleted = userData?.onboarding?.profileCompleted === true;
            const from = location.state?.from || (profileCompleted ? '/dashboard' : '/profile-setup');

            // Navigate to the appropriate page
            navigate(from, { replace: true });

        } catch (err) {
            console.error('Login error:', err);

            // User-friendly error messages
            if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
                setError('Invalid email or password. Please try again.');
            } else if (err.code === 'auth/user-not-found') {
                setError('No account found with this email. Please contact admin.');
            } else if (err.code === 'auth/too-many-requests') {
                setError('Too many failed login attempts. Please try again later.');
            } else if (err.code === 'auth/invalid-email') {
                setError('Please enter a valid email address.');
            } else {
                setError('An error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center px-6">
            <div className="w-full max-w-md">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-8"
                >
                    <div className="w-16 h-16 bg-gradient-to-br from-[#4A7BFF] to-[#FF6B35] rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Lock className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-3">Welcome Back</h1>
                    <p className="text-gray-400">Sign in to continue to MadeIt</p>
                </motion.div>

                <motion.form
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    onSubmit={handleLogin}
                    className="space-y-6"
                >
                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-[#4A7BFF] focus:outline-none focus:ring-2 focus:ring-[#4A7BFF]/20 transition-colors text-white placeholder-gray-500"
                            placeholder="you@example.com"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-[#4A7BFF] focus:outline-none focus:ring-2 focus:ring-[#4A7BFF]/20 transition-colors text-white placeholder-gray-500"
                            placeholder="••••••••"
                        />
                    </div>

                    {/* Error Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg"
                        >
                            <p className="text-red-400 text-sm">{error}</p>
                        </motion.div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-6 py-3 bg-gradient-to-r from-[#4A7BFF] to-[#FF6B35] hover:from-[#5a8bff] hover:to-[#ff7d4d] text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Signing in...</span>
                            </>
                        ) : (
                            <>
                                <LogIn className="w-5 h-5" />
                                <span>Sign In</span>
                            </>
                        )}
                    </button>
                </motion.form>

                {/* Footer Note */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mt-8 text-center"
                >
                    <p className="text-sm text-gray-400">
                        Don't have an account?{' '}
                        <span className="text-gray-500">Access is by invitation only.</span>
                    </p>
                    <a
                        href="/"
                        className="inline-block mt-4 text-sm text-[#4A7BFF] hover:text-[#5a8bff] transition-colors"
                    >
                        ← Back to Home
                    </a>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
