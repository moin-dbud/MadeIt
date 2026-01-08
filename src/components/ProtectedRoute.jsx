import { Navigate } from "react-router-dom";
import { auth } from "../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

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
 * Redirects to dashboard if already logged in
 */
export function PublicRoute({ children }) {
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

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}
