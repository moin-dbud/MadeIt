import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { createContext, useContext, useEffect, useState } from "react";
import { getUserProfile } from "../services/user.service";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        // Fetch user document to get isAdmin and other metadata
        const userDoc = await getUserProfile(firebaseUser.uid);
        setUserData(userDoc);
      } else {
        setUserData(null);
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  const value = {
    user,
    userData,
    isAdmin: userData?.isAdmin === true,
    loading
  };

  // Show loading screen during initial auth check
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#A0A0A0] text-lg">Authenticating...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
