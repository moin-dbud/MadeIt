import { supabase } from "../supabase/supabase";

export const logoutUser = async () => {
  try {
    await supabase.auth.signOut();
  } catch (err) {
    console.error("Logout error:", err);
  }
};
