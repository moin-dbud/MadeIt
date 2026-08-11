import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase/supabase";
import { getUserProfile, createUserIfNotExists } from "../services/user.service";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const authUser = {
            ...session.user,
            uid: session.user.id
          };
          setUser(authUser);
          await createUserIfNotExists(session.user);
          const userDoc = await getUserProfile(session.user.id);
          setUserData(userDoc);
        } else {
          setUser(null);
          setUserData(null);
        }
      } catch (err) {
        console.error("Error getting initial session:", err);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // 2. Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const authUser = {
          ...session.user,
          uid: session.user.id
        };
        setUser(authUser);
        await createUserIfNotExists(session.user);
        const userDoc = await getUserProfile(session.user.id);
        setUserData(userDoc);
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const value = {
    user,
    userData,
    setUserData,
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
