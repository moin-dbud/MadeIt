import { supabase } from "../supabase/supabase";
import { createUserIfNotExists, getUserProfile, updateUserProfile } from "../services/user.service";

export { createUserIfNotExists };

/**
 * Admin function: Verify a milestone submission
 */
export const verifyMilestone = async (userId, milestoneId, adminId) => {
  const userDoc = await getUserProfile(userId);
  if (!userDoc) throw new Error("User not found");

  const submissions = userDoc.activeProject?.submissions || {};
  const completedMilestones = userDoc.activeProject?.completedMilestones || [];

  if (!submissions[milestoneId]) {
    throw new Error("Milestone submission not found");
  }

  // Update verification status
  submissions[milestoneId] = {
    ...submissions[milestoneId],
    verificationStatus: "verified",
    verifiedAt: new Date().toISOString(),
    verifiedBy: adminId
  };

  // Add to completedMilestones if not already there
  const updatedCompletedMilestones = completedMilestones.includes(milestoneId)
    ? completedMilestones
    : [...completedMilestones, milestoneId];

  const updatedActiveProject = {
    ...userDoc.activeProject,
    submissions,
    completedMilestones: updatedCompletedMilestones
  };

  await updateUserProfile(userId, {
    activeProject: updatedActiveProject
  });

  return { success: true };
};

/**
 * Admin function: Flag a milestone submission for review
 */
export const flagMilestone = async (userId, milestoneId, adminId, adminNote) => {
  const userDoc = await getUserProfile(userId);
  if (!userDoc) throw new Error("User not found");

  const submissions = userDoc.activeProject?.submissions || {};

  if (!submissions[milestoneId]) {
    throw new Error("Milestone submission not found");
  }

  submissions[milestoneId] = {
    ...submissions[milestoneId],
    verificationStatus: "flagged",
    flaggedAt: new Date().toISOString(),
    flaggedBy: adminId,
    adminNote: adminNote
  };

  const updatedActiveProject = {
    ...userDoc.activeProject,
    submissions
  };

  await updateUserProfile(userId, {
    activeProject: updatedActiveProject
  });

  return { success: true };
};

/**
 * Admin function: Reject a milestone submission
 */
export const rejectMilestone = async (userId, milestoneId, adminId, adminNote) => {
  const userDoc = await getUserProfile(userId);
  if (!userDoc) throw new Error("User not found");

  const submissions = userDoc.activeProject?.submissions || {};
  const completedMilestones = userDoc.activeProject?.completedMilestones || [];

  if (!submissions[milestoneId]) {
    throw new Error("Milestone submission not found");
  }

  submissions[milestoneId] = {
    ...submissions[milestoneId],
    verificationStatus: "rejected",
    rejectedAt: new Date().toISOString(),
    rejectedBy: adminId,
    adminNote: adminNote
  };

  // Remove from completedMilestones if it's there
  const updatedCompletedMilestones = completedMilestones.filter(id => id !== milestoneId);

  const updatedActiveProject = {
    ...userDoc.activeProject,
    submissions,
    completedMilestones: updatedCompletedMilestones
  };

  await updateUserProfile(userId, {
    activeProject: updatedActiveProject
  });

  return { success: true };
};
