// src/firebase/firestore.js
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
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

/**
 * Admin function: Verify a milestone submission
 */
export const verifyMilestone = async (userId, milestoneId, adminId) => {
  const userRef = doc(db, "users", userId);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) throw new Error("User not found");

  const userData = userDoc.data();
  const submissions = userData.activeProject?.submissions || {};
  const completedMilestones = userData.activeProject?.completedMilestones || [];

  if (!submissions[milestoneId]) {
    throw new Error("Milestone submission not found");
  }

  // Update verification status
  submissions[milestoneId] = {
    ...submissions[milestoneId],
    verificationStatus: "verified",
    verifiedAt: serverTimestamp(),
    verifiedBy: adminId
  };

  // Add to completedMilestones if not already there
  const updatedCompletedMilestones = completedMilestones.includes(milestoneId)
    ? completedMilestones
    : [...completedMilestones, milestoneId];

  await updateDoc(userRef, {
    "activeProject.submissions": submissions,
    "activeProject.completedMilestones": updatedCompletedMilestones
  });

  return { success: true };
};

/**
 * Admin function: Flag a milestone submission for review
 */
export const flagMilestone = async (userId, milestoneId, adminId, adminNote) => {
  const userRef = doc(db, "users", userId);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) throw new Error("User not found");

  const userData = userDoc.data();
  const submissions = userData.activeProject?.submissions || {};

  if (!submissions[milestoneId]) {
    throw new Error("Milestone submission not found");
  }

  submissions[milestoneId] = {
    ...submissions[milestoneId],
    verificationStatus: "flagged",
    flaggedAt: serverTimestamp(),
    flaggedBy: adminId,
    adminNote: adminNote
  };

  await updateDoc(userRef, {
    "activeProject.submissions": submissions
  });

  return { success: true };
};

/**
 * Admin function: Reject a milestone submission
 */
export const rejectMilestone = async (userId, milestoneId, adminId, adminNote) => {
  const userRef = doc(db, "users", userId);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) throw new Error("User not found");

  const userData = userDoc.data();
  const submissions = userData.activeProject?.submissions || {};
  const completedMilestones = userData.activeProject?.completedMilestones || [];

  if (!submissions[milestoneId]) {
    throw new Error("Milestone submission not found");
  }

  submissions[milestoneId] = {
    ...submissions[milestoneId],
    verificationStatus: "rejected",
    rejectedAt: serverTimestamp(),
    rejectedBy: adminId,
    adminNote: adminNote
  };

  // Remove from completedMilestones if it's there
  const updatedCompletedMilestones = completedMilestones.filter(id => id !== milestoneId);

  await updateDoc(userRef, {
    "activeProject.submissions": submissions,
    "activeProject.completedMilestones": updatedCompletedMilestones
  });

  return { success: true };
};
