import { supabase } from "../supabase/supabase";

/**
 * Helper to map Supabase database user row to application user object format
 */
export const mapUserRowToData = (row) => {
  if (!row) return null;
  return {
    uid: row.id,
    id: row.id,
    email: row.email,
    name: row.name || row.profile?.fullName || '',
    displayName: row.name || row.profile?.fullName || '',
    photoURL: row.photo_url || row.profile?.avatarUrl || '',
    bio: row.bio || row.profile?.bio || '',
    githubUsername: row.github_username || row.profile?.github || '',
    skills: row.skills || [],
    isAdmin: row.is_admin === true,
    authProvider: row.auth_provider || 'email',
    profile: row.profile || {},
    onboarding: row.onboarding || { profileCompleted: false },
    activeProject: row.active_project || null,
    projects: row.projects || {},
    settings: row.settings || {},
    portfolio: row.portfolio || {},
    feedbackGiven: row.feedback_given || {},
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
};

/**
 * Create user record in Supabase if it does not exist
 */
export const createUserIfNotExists = async (user) => {
  if (!user || !user.id) return;

  try {
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error checking user existence:', fetchError);
    }

    if (!existingUser) {
      const newUserObj = {
        id: user.id,
        email: user.email || '',
        name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || '',
        photo_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || '',
        auth_provider: user.app_metadata?.provider || 'email',
        onboarding: { profileCompleted: false, stepCompleted: 0 },
        profile: {
          fullName: user.user_metadata?.full_name || user.user_metadata?.name || '',
          email: user.email || ''
        },
        active_project: null,
        projects: {},
        settings: { publicPortfolio: true },
        portfolio: {},
        feedback_given: {},
        is_admin: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error: insertError } = await supabase
        .from('users')
        .insert(newUserObj);

      if (insertError) {
        console.error('Error creating Supabase user:', insertError);
      } else {
        console.log('✅ Created Supabase user for:', user.email);
      }
    }
  } catch (err) {
    console.error('Unexpected error in createUserIfNotExists:', err);
  }
};

/**
 * Update user profile (used in profile setup & settings)
 */
export const updateUserProfile = async (uid, data) => {
  if (!uid) return;

  try {
    // Fetch current user row to merge nested fields cleanly
    const { data: currentUser } = await supabase
      .from('users')
      .select('*')
      .eq('id', uid)
      .maybeSingle();

    const updatePayload = {
      updated_at: new Date().toISOString()
    };

    if (data.profile) {
      updatePayload.profile = { ...(currentUser?.profile || {}), ...data.profile };
      if (data.profile.fullName) updatePayload.name = data.profile.fullName;
      if (data.profile.avatarUrl) updatePayload.photo_url = data.profile.avatarUrl;
      if (data.profile.bio) updatePayload.bio = data.profile.bio;
      if (data.profile.github) updatePayload.github_username = data.profile.github;
    }

    if (data.onboarding) {
      updatePayload.onboarding = { ...(currentUser?.onboarding || {}), ...data.onboarding };
    }

    if (data.activeProject !== undefined) {
      updatePayload.active_project = data.activeProject;
    }

    if (data.projects !== undefined) {
      updatePayload.projects = data.projects;
    }

    if (data.settings !== undefined) {
      updatePayload.settings = { ...(currentUser?.settings || {}), ...data.settings };
    }

    if (data.portfolio !== undefined) {
      updatePayload.portfolio = { ...(currentUser?.portfolio || {}), ...data.portfolio };
    }

    if (data.feedbackGiven !== undefined) {
      updatePayload.feedback_given = { ...(currentUser?.feedback_given || {}), ...data.feedbackGiven };
    }

    if (data.isAdmin !== undefined) {
      updatePayload.is_admin = data.isAdmin;
    }

    // Pass through any root-level keys
    Object.keys(data).forEach(key => {
      if (['name', 'bio', 'photo_url', 'github_username', 'skills', 'is_admin'].includes(key)) {
        updatePayload[key] = data[key];
      }
    });

    const { error } = await supabase
      .from('users')
      .update(updatePayload)
      .eq('id', uid);

    if (error) {
      console.error('Error updating user profile in Supabase:', error);
      throw error;
    }
  } catch (error) {
    console.error('updateUserProfile error:', error);
    throw error;
  }
};

/**
 * Get user profile by UID
 */
export const getUserProfile = async (uid) => {
  if (!uid) return null;

  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', uid)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user profile from Supabase:', error);
      return null;
    }

    return mapUserRowToData(data);
  } catch (error) {
    console.error('getUserProfile error:', error);
    return null;
  }
};

/**
 * Admin function: Fetch all pending milestone submissions across users
 */
export const getAllPendingMilestoneSubmissions = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .not('active_project', 'is', null);

    if (error) {
      console.error('Error fetching users for pending milestone submissions:', error);
      return [];
    }

    const pendingList = [];

    (data || []).forEach(row => {
      const activeProj = row.active_project;
      if (activeProj && activeProj.submissions) {
        const submissionsObj = activeProj.submissions;
        Object.entries(submissionsObj).forEach(([milestoneId, sub]) => {
          if (sub && (sub.verificationStatus === 'under_review' || sub.verificationStatus === 'flagged')) {
            pendingList.push({
              userId: row.id,
              userName: row.name || row.profile?.fullName || 'User',
              userEmail: row.email || row.profile?.email || '',
              projectId: activeProj.id,
              projectName: activeProj.name || activeProj.id,
              milestoneId: milestoneId,
              submission: sub,
              submittedAt: sub.submittedAt || sub.submitted_at || new Date().toISOString()
            });
          }
        });
      }
    });

    return pendingList;
  } catch (error) {
    console.error('getAllPendingMilestoneSubmissions error:', error);
    return [];
  }
};
