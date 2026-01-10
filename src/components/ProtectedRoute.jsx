import { Navigate } from "react-router-dom";
import { auth, db } from "../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";

/**
 * ProtectedRoute - Only allows authenticated users
 * Redirects to home if not logged in
 */
export function ProtectedRoute({ children }) {
    const [user, loading] = useAuthState(auth);

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-[#A0A0A0]">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    return children;
}

/**
 * PublicRoute - Only allows non-authenticated users
 * Redirects based on profile completion status
 */
export function PublicRoute({ children }) {
    const [user, loading] = useAuthState(auth);
    const [profileCompleted, setProfileCompleted] = useState(null);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const checkProfileCompletion = async () => {
            if (user) {
                try {
                    const userDocRef = doc(db, 'users', user.uid);
                    const userDoc = await getDoc(userDocRef);

                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setProfileCompleted(userData?.onboarding?.profileCompleted === true);
                    } else {
                        setProfileCompleted(false);
                    }
                } catch (error) {
                    console.error('Error checking profile completion:', error);
                    setProfileCompleted(false);
                }
            }
            setChecking(false);
        };

        checkProfileCompletion();
    }, [user]);

    if (loading || (user && checking)) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-[#A0A0A0]">Loading...</p>
                </div>
            </div>
        );
    }

    if (user) {
        // Redirect based on profile completion
        if (profileCompleted) {
            return <Navigate to="/dashboard" replace />;
        } else {
            return <Navigate to="/profile-setup" replace />;
        }
    }

    return children;
}
