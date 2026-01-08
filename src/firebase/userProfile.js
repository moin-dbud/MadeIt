import { doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

export const updateUserProfile = async (uid, data) => {
  if (!uid) return;

  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, data);
};
