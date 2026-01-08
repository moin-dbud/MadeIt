import { signOut } from "firebase/auth";
import { auth } from "./firebase";

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (err) {
    console.error("Logout error:", err);
  }
};
