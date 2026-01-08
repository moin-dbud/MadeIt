import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";

/**
 * Create user document if it does not exist
 */
export const createUserIfNotExists = async (user) => {
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      authProvider: user.providerData[0]?.providerId || "password",
      createdAt: serverTimestamp(),
      profileCompleted: false,
      personal: {},
      professional: {},
      socials: {},
      consents: {},
    });
  }
};

/**
 * Update user profile (used in profile setup)
 */
export const updateUserProfile = async (uid, data) => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, data);
};

/**
 * Get user profile
 */
export const getUserProfile = async (uid) => {
  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);
  return snap.exists() ? snap.data() : null;
};
