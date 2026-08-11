import { supabase } from "../supabase/supabase";
import { createUserIfNotExists } from "../services/user.service";

export const signInWithGoogle = async (navigate) => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    });

    if (error) {
      console.error("Google sign in error:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Google auth failed:", error);
    throw error;
  }
};
