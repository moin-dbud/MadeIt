// src/firebase/firestore.js
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export const createUserIfNotExists = async (user) => {
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      name: user.displayName || "",
      email: user.email,
      photoURL: user.photoURL || "",
      createdAt: serverTimestamp(),

      // profile state
      profileCompleted: false,

      // placeholders for future
      role: "student",
      onboardingStep: 1,
    });
  }
};
