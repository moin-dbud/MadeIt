import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const signInWithGoogle = async (navigate) => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    // First-time user
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      name: user.displayName,
      photoURL: user.photoURL,
      onboarding: {
        profileCompleted: false,
      },
      createdAt: new Date(),
    });

    navigate("/profile-setup");
  } else {
    const data = snap.data();
    if (!data.onboarding?.profileCompleted) {
      navigate("/profile-setup");
    } else {
      navigate("/dashboard");
    }
  }
};
