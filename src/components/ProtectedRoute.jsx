import { Navigate, useLocation, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useState, useEffect } from "react";

/**
 * Loading Component - Shows during auth/permission checks
 */
const LoadingScreen = ({ message = "Loading..." }) => {
    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
            <div className="text-center">
                <div className="w-12 h-12 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-[#A0A0A0]">{message}</p>
            </div>
        </div>
    );
};

/**
 * ProtectedRoute - Only allows authenticated users
 * Redirects to login if not authenticated
 */
export function ProtectedRoute({ children, requireProfileSetup = false }) {
    const { user, userData, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <LoadingScreen message="Verifying authentication..." />;
    }

    // Not authenticated - redirect to login with return URL
    if (!user) {
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }

    // Check if profile setup is required but not completed
    if (requireProfileSetup && userData?.onboarding?.profileCompleted !== true) {
        // If we're already on profile-setup, don't redirect
        if (location.pathname !== "/profile-setup") {
            return <Navigate to="/profile-setup" replace />;
        }
    }

    // If user has completed profile but is on profile-setup page, redirect to dashboard
    if (!requireProfileSetup && userData?.onboarding?.profileCompleted === true && location.pathname === "/profile-setup") {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}

/**
 * PublicOnlyRoute - Only allows NON-authenticated users
 * Redirects to dashboard if already logged in
 * Used for /login, /register, etc.
 */
export function PublicOnlyRoute({ children }) {
    const { user, userData, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <LoadingScreen message="Checking authentication..." />;
    }

    if (user) {
        // Check if profile is completed
        const profileCompleted = userData?.onboarding?.profileCompleted === true;

        // Get the original destination from state, or default to dashboard/profile-setup
        const from = location.state?.from;

        if (from) {
            // If there was a 'from' state, redirect there
            return <Navigate to={from} replace />;
        } else if (profileCompleted) {
            return <Navigate to="/dashboard" replace />;
        } else {
            return <Navigate to="/profile-setup" replace />;
        }
    }

    return children;
}

/**
 * ProjectOwnerRoute - Protects project routes
 * Ensures user owns the project or is admin
 */
export function ProjectOwnerRoute({ children }) {
    const { user, userData, loading: authLoading } = useAuth();
    const { projectId } = useParams();
    const [checking, setChecking] = useState(true);
    const [hasAccess, setHasAccess] = useState(false);

    useEffect(() => {
        const checkProjectAccess = async () => {
            if (!user || !projectId) {
                setHasAccess(false);
                setChecking(false);
                return;
            }

            try {
                // Admin always has access
                if (userData?.isAdmin === true) {
                    setHasAccess(true);
                    setChecking(false);
                    return;
                }

                // Check if user owns this project
                const projectRef = doc(db, "users", user.uid, "projects", projectId);
                const projectDoc = await getDoc(projectRef);

                if (projectDoc.exists()) {
                    setHasAccess(true);
                } else {
                    setHasAccess(false);
                }
            } catch (error) {
                console.error("Error checking project access:", error);
                setHasAccess(false);
            } finally {
                setChecking(false);
            }
        };

        checkProjectAccess();
    }, [user, userData, projectId]);

    if (authLoading || checking) {
        return <LoadingScreen message="Verifying access..." />;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!hasAccess) {
        return <Navigate to="/projects" replace />;
    }

    return children;
}

/**
 * AdminRoute - Only allows admin users
 * Redirects to dashboard if not admin
 */
export function AdminRoute({ children }) {
    const { user, userData, loading } = useAuth();

    if (loading) {
        return <LoadingScreen message="Verifying admin access..." />;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (userData?.isAdmin !== true) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}

/**
 * OptionalAuthRoute - For routes that work with or without auth
 * Used for public portfolios, etc.
 */
export function OptionalAuthRoute({ children }) {
    const { loading } = useAuth();

    if (loading) {
        return <LoadingScreen message="Loading..." />;
    }

    return children;
}
