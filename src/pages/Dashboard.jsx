import { useEffect, useState, useRef } from "react";
import { supabase } from "../supabase/supabase";
import { getUserProfile, updateUserProfile, mapUserRowToData, getAllPendingMilestoneSubmissions } from "../services/user.service";
import { verifyMilestone, flagMilestone, rejectMilestone } from "../firebase/firestore";
import { logoutUser } from "../firebase/logout";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Rocket, CheckCircle2, Calendar, ExternalLink, User, LogOut, X, HelpCircle, Shield, Clock, Eye, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getMilestones } from "../config/projects.config";
import LoadingButton from "../components/LoadingButton";
import { PageLoader } from "../components/SkeletonLoaders";
import RecruiterMessages from "../components/RecruiterMessages";
import { useAuth } from "../context/AuthContext";
import { submitFeedback, dismissFeedbackPrompt } from "../utils/feedback";
import { EMAIL_CONFIG } from "../config/email";

export default function Dashboard() {
    const { user, isAdmin, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [saving, setSaving] = useState(false);

    // Admin review state
    const [pendingSubmissions, setPendingSubmissions] = useState([]);
    const [loadingSubmissions, setLoadingSubmissions] = useState(false);
    const [showAdminReviewModal, setShowAdminReviewModal] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [reviewAction, setReviewAction] = useState(null);
    const [adminNote, setAdminNote] = useState("");
    const [processing, setProcessing] = useState(false);

    const dropdownRef = useRef(null);
    const avatarRef = useRef(null);

    // ---- FETCH ADMIN PENDING SUBMISSIONS ----
    const fetchAdminSubmissions = async () => {
        if (!isAdmin) return;
        setLoadingSubmissions(true);
        try {
            const submissions = await getAllPendingMilestoneSubmissions();
            setPendingSubmissions(submissions);
        } catch (error) {
            console.error("Error fetching admin pending submissions:", error);
        } finally {
            setLoadingSubmissions(false);
        }
    };

    useEffect(() => {
        if (isAdmin) {
            fetchAdminSubmissions();
        }
    }, [isAdmin]);

    // ---- FETCH USER DATA ----
    useEffect(() => {
        const fetchUserData = async () => {
            if (authLoading) {
                return;
            }

            if (!user) {
                navigate("/");
                return;
            }

            try {
                const userId = user.id || user.uid;
                const data = await getUserProfile(userId);

                if (data) {
                    if (!data.onboarding?.profileCompleted) {
                        navigate("/profile-setup");
                        return;
                    }

                    setUserData(data);
                } else {
                    navigate("/profile-setup");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [user, authLoading, navigate]);

    // ---- CLOSE DROPDOWN ON OUTSIDE CLICK ----
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                avatarRef.current &&
                !avatarRef.current.contains(event.target)
            ) {
                setShowDropdown(false);
            }
        };

        if (showDropdown) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showDropdown]);

    // ---- HANDLE LOGOUT ----
    const handleLogout = async () => {
        try {
            await logoutUser();
            navigate("/");
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    // ---- OPEN MANAGE ACCOUNT MODAL ----
    const openManageAccount = () => {
        setModalData({
            profile: { ...(userData?.profile || {}) },
            education: { ...(userData?.education || {}) },
            socials: { ...(userData?.socials || {}) },
            settings: { ...(userData?.settings || {}) },
        });
        setShowDropdown(false);
        setShowModal(true);
    };

    // ---- SAVE ACCOUNT CHANGES ----
    const saveAccountChanges = async () => {
        if (!user || !modalData) return;

        setSaving(true);
        try {
            const userId = user.id || user.uid;
            await updateUserProfile(userId, {
                profile: modalData.profile,
                education: modalData.education,
                socials: modalData.socials,
                settings: modalData.settings,
            });

            setUserData((prev) => ({
                ...prev,
                profile: modalData.profile,
                education: modalData.education,
                socials: modalData.socials,
                settings: modalData.settings,
            }));

            setShowModal(false);
        } catch (error) {
            console.error("Error saving changes:", error);
        } finally {
            setSaving(false);
        }
    };

    // ---- HANDLE ADMIN REVIEW DECISION ----
    const handleReviewDecision = async () => {
        if (!selectedSubmission || !reviewAction) return;

        if ((reviewAction === 'flag' || reviewAction === 'reject') && !adminNote.trim()) {
            alert(`Please provide a ${reviewAction === 'flag' ? 'flag note' : 'rejection reason'}.`);
            return;
        }

        setProcessing(true);
        try {
            const adminId = user.id || user.uid;
            const { userId, milestoneId, userName, userEmail, projectName } = selectedSubmission;

            if (reviewAction === 'verify') {
                await verifyMilestone(userId, milestoneId, adminId);
                // Send email notification to user
                try {
                    await fetch(`${EMAIL_CONFIG.API_BASE_URL}/api/send-email`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            type: 'milestoneVerified',
                            data: {
                                email: userEmail,
                                name: userName,
                                projectName: projectName,
                                milestoneName: milestoneId,
                                milestoneId: milestoneId
                            }
                        })
                    });
                } catch (e) {
                    console.warn("Verification email failed:", e);
                }
            } else if (reviewAction === 'flag') {
                await flagMilestone(userId, milestoneId, adminId, adminNote.trim());
                try {
                    await fetch(`${EMAIL_CONFIG.API_BASE_URL}/api/send-email`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            type: 'milestoneFlagged',
                            data: {
                                email: userEmail,
                                userName: userName,
                                projectName: projectName,
                                milestoneName: milestoneId,
                                milestoneId: milestoneId,
                                adminNote: adminNote.trim()
                            }
                        })
                    });
                } catch (e) {
                    console.warn("Flagged email failed:", e);
                }
            } else if (reviewAction === 'reject') {
                await rejectMilestone(userId, milestoneId, adminId, adminNote.trim());
                try {
                    await fetch(`${EMAIL_CONFIG.API_BASE_URL}/api/send-email`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            type: 'milestoneRejected',
                            data: {
                                email: userEmail,
                                name: userName,
                                projectName: projectName,
                                milestoneName: milestoneId,
                                milestoneId: milestoneId,
                                feedback: adminNote.trim()
                            }
                        })
                    });
                } catch (e) {
                    console.warn("Rejection email failed:", e);
                }
            }

            // Refresh admin pending list
            await fetchAdminSubmissions();

            // Close modal & reset state
            setShowAdminReviewModal(false);
            setSelectedSubmission(null);
            setReviewAction(null);
            setAdminNote("");
        } catch (error) {
            console.error("Error submitting review decision:", error);
            alert("Failed to submit review decision. Please try again.");
        } finally {
            setProcessing(false);
        }
    };

    // ---- GET AVATAR SOURCE ----
    const getAvatarSource = () => {
        if (userData?.profile?.photoURL) return userData.profile.photoURL;
        if (user?.photoURL) return user.photoURL;
        return null;
    };

    // ---- GET INITIALS ----
    const getInitials = () => {
        const fullName = userData?.profile?.fullName || user?.displayName || "U";
        return fullName
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    // ---- LOADING STATE ----
    if (loading) {
        return <PageLoader message="Loading your dashboard..." />;
    }

    if (!userData) return null;

    // ---- EXTRACT DATA ----
    const firstName = userData.profile?.fullName?.split(" ")[0] || "there";
    const activeProject = userData.activeProject || null;

    // Calculate real stats from activeProject
    const completedTasksCount = activeProject?.completedTasks?.length || 0;
    const activeDays = activeProject?.startedAt
        ? Math.floor((new Date() - new Date(activeProject.startedAt)) / (1000 * 60 * 60 * 24)) + 1
        : 0;

    // Calculate progress percentage and check if project is completed
    let progressPercentage = 0;
    let isProjectCompleted = false;
    if (activeProject?.id) {
        const milestones = getMilestones(activeProject.id);
        const totalTasks = milestones.reduce((sum, m) => sum + m.tasks.length, 0);
        progressPercentage = totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0;

        // Check if ALL milestones are verified (project is completed)
        const totalMilestones = milestones.length;
        const verifiedMilestones = milestones.filter(m => {
            const submission = activeProject.submissions?.[m.milestoneId];
            return submission?.verificationStatus === 'verified';
        }).length;
        isProjectCompleted = totalMilestones > 0 && verifiedMilestones === totalMilestones;
    }

    const stats = {
        projectsCompleted: isProjectCompleted ? 1 : 0,
        tasksCompleted: completedTasksCount,
        activeDays: activeDays,
    };

    const avatarSrc = getAvatarSource();

    // Show loading while auth or data is loading
    if (authLoading || loading) {
        return <PageLoader />;
    }

    // If no user data after loading, show nothing (will redirect)
    if (!userData) {
        return null;
    }

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white">
            <div className="max-w-4xl mx-auto px-4 py-12">

                {/* HEADER WITH AVATAR */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mb-12 flex items-start justify-between"
                >
                    <div>
                        <h1 className="text-3xl font-semibold tracking-tight mb-2">
                            Hi, {firstName}
                        </h1>
                        <div className="flex items-center gap-3 text-sm">
                            <span className="px-3 py-1 rounded-full bg-[rgba(255,107,53,0.1)] text-[#FF6B35] border border-[rgba(255,107,53,0.2)]">
                                Web Development
                            </span>
                            <span className="text-[#A0A0A0]">
                                {activeProject ? "Project in progress" : "No active project"}
                            </span>
                        </div>
                    </div>

                    {/* PROFILE AVATAR */}
                    <div className="relative">
                        <button
                            ref={avatarRef}
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="w-12 h-12 rounded-full overflow-hidden border-2 border-[rgba(255,255,255,0.1)] transition-all duration-200 hover:border-[#FF6B35] hover:scale-105 active:scale-95"
                        >
                            {avatarSrc ? (
                                <img src={avatarSrc} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-[rgba(255,107,53,0.2)] flex items-center justify-center text-[#FF6B35] font-medium text-sm">
                                    {getInitials()}
                                </div>
                            )}
                        </button>

                        {/* DROPDOWN MENU */}
                        <AnimatePresence>
                            {showDropdown && (
                                <motion.div
                                    ref={dropdownRef}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute right-0 mt-2 w-48 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(10,10,10,0.95)] backdrop-blur-xl shadow-xl overflow-hidden z-50"
                                >
                                    <button
                                        onClick={openManageAccount}
                                        className="w-full px-4 py-3 text-left text-sm flex items-center gap-3 hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                                    >
                                        <User size={16} strokeWidth={1.5} />
                                        Manage account
                                    </button>
                                    <div className="h-px bg-[rgba(255,255,255,0.08)]"></div>
                                    <button
                                        onClick={() => {
                                            setShowDropdown(false);
                                            navigate("/support");
                                        }}
                                        className="w-full px-4 py-3 text-left text-sm flex items-center gap-3 hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                                    >
                                        <HelpCircle size={16} strokeWidth={1.5} />
                                        Support / Raise Ticket
                                    </button>
                                    <div className="h-px bg-[rgba(255,255,255,0.08)]"></div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full px-4 py-3 text-left text-sm flex items-center gap-3 hover:bg-[rgba(255,255,255,0.05)] transition-colors text-red-400"
                                    >
                                        <LogOut size={16} strokeWidth={1.5} />
                                        Logout
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* PRIMARY ACTION CARD */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="mb-8"
                >
                    <div
                        className="rounded-2xl p-8 border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)]"
                        style={{ backdropFilter: "blur(20px)" }}
                    >
                        {!activeProject ? (
                            // NO ACTIVE PROJECT
                            <div className="text-center py-8">
                                <div className="w-16 h-16 rounded-full bg-[rgba(255,107,53,0.1)] flex items-center justify-center mx-auto mb-6">
                                    <Rocket size={28} color="#FF6B35" strokeWidth={1.5} />
                                </div>
                                <h2 className="text-2xl font-semibold tracking-tight mb-3">
                                    Start Your First Project
                                </h2>
                                <p className="text-[#A0A0A0] mb-8 max-w-md mx-auto">
                                    Choose a real-world project and begin building.
                                </p>
                                <LoadingButton
                                    onClick={() => navigate("/projects")}
                                    variant="primary"
                                    className="w-auto"
                                >
                                    Choose Project
                                    <ArrowRight size={18} strokeWidth={2} />
                                </LoadingButton>
                            </div>
                        ) : (
                            // ACTIVE PROJECT
                            <div>
                                <div className="flex items-start justify-between mb-6">
                                    <div>
                                        <p className="text-xs text-[#A0A0A0] mb-2">Current Project</p>
                                        <h2 className="text-2xl font-semibold tracking-tight mb-2">
                                            {activeProject.name}
                                        </h2>
                                        <p className="text-sm text-[#A0A0A0]">
                                            Next: {activeProject.nextTask || "Review requirements"}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-3xl font-semibold text-[#FF6B35]">
                                            {progressPercentage}%
                                        </p>
                                        <p className="text-xs text-[#A0A0A0] mt-1">Complete</p>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="w-full h-2 bg-[rgba(255,255,255,0.05)] rounded-full mb-6 overflow-hidden">
                                    <div
                                        className="h-full bg-[#FF6B35] rounded-full transition-all duration-500"
                                        style={{ width: `${progressPercentage}%` }}
                                    ></div>
                                </div>

                                <LoadingButton
                                    onClick={() => navigate(`/projects/${activeProject.id}`)}
                                    variant="primary"
                                    className="w-full"
                                >
                                    Continue Project
                                    <ArrowRight size={18} strokeWidth={2} />
                                </LoadingButton>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* PROGRESS SNAPSHOT */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="grid grid-cols-3 gap-4 mb-8"
                >
                    <div className="rounded-xl p-5 border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)]">
                        <div className="flex items-center gap-2 mb-2">
                            <CheckCircle2 size={16} color="#A0A0A0" strokeWidth={1.5} />
                            <p className="text-xs text-[#A0A0A0]">Projects</p>
                        </div>
                        <p className="text-2xl font-semibold">{stats.projectsCompleted}</p>
                    </div>

                    <div className="rounded-xl p-5 border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)]">
                        <div className="flex items-center gap-2 mb-2">
                            <CheckCircle2 size={16} color="#A0A0A0" strokeWidth={1.5} />
                            <p className="text-xs text-[#A0A0A0]">Tasks</p>
                        </div>
                        <p className="text-2xl font-semibold">{stats.tasksCompleted}</p>
                    </div>

                    <div className="rounded-xl p-5 border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)]">
                        <div className="flex items-center gap-2 mb-2">
                            <Calendar size={16} color="#A0A0A0" strokeWidth={1.5} />
                            <p className="text-xs text-[#A0A0A0]">Active Days</p>
                        </div>
                        <p className="text-2xl font-semibold">{stats.activeDays}</p>
                    </div>
                </motion.div>

                {/* PORTFOLIO PREVIEW CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="mb-8"
                >
                    <div className="rounded-xl p-6 border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium mb-1">Your portfolio updates as you build.</p>
                            <p className="text-xs text-[#A0A0A0]">Share your proof of work with the world.</p>
                        </div>
                        <button
                            onClick={() => navigate("/portfolio")}
                            className="px-6 py-2.5 rounded-lg border border-[rgba(255,255,255,0.1)] text-sm font-medium flex items-center gap-2 transition-all duration-200 hover:bg-[rgba(255,255,255,0.05)]"
                        >
                            View Portfolio
                            <ExternalLink size={16} strokeWidth={1.5} />
                        </button>
                    </div>
                </motion.div>

                {/* RECRUITER MESSAGES */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="mb-8"
                >
                    <RecruiterMessages />
                </motion.div>

                {/* ADMIN MILESTONE REVIEW SECTION */}
                {isAdmin && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.4 }}
                        className="mb-8"
                    >
                        <div className="rounded-2xl p-6 border border-[rgba(255,107,53,0.3)] bg-[rgba(255,107,53,0.05)]">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-lg bg-[rgba(255,107,53,0.2)] flex items-center justify-center">
                                    <Shield size={20} className="text-[#FF6B35]" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">🛡️ Admin · Milestone Review</h3>
                                    <p className="text-xs text-[#A0A0A0]">Pending milestone submissions</p>
                                </div>
                            </div>

                            {loadingSubmissions ? (
                                <div className="text-center py-8">
                                    <div className="w-8 h-8 border-2 border-[#FF6B35] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                                    <p className="text-sm text-[#A0A0A0]">Loading submissions...</p>
                                </div>
                            ) : pendingSubmissions.length === 0 ? (
                                <div className="text-center py-8">
                                    <CheckCircle size={32} className="text-green-400 mx-auto mb-3" />
                                    <p className="text-sm text-[#A0A0A0]">No pending submissions</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {pendingSubmissions.map((item, index) => (
                                        <div
                                            key={`${item.userId}-${item.milestoneId}`}
                                            className="p-4 rounded-xl border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <p className="font-medium text-sm">{item.userName}</p>
                                                        <span className="px-2 py-0.5 rounded text-xs bg-blue-500/20 text-blue-400">Pending</span>
                                                    </div>
                                                    <p className="text-xs text-[#A0A0A0] mb-1">
                                                        {item.projectName} · Milestone ID: {item.milestoneId}
                                                    </p>
                                                    <div className="flex items-center gap-2 text-xs text-[#606060]">
                                                        <Clock size={12} />
                                                        <span>Submitted {new Date(item.submittedAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        setSelectedSubmission(item);
                                                        setShowAdminReviewModal(true);
                                                    }}
                                                    className="px-4 py-2 rounded-lg bg-[#FF6B35] text-white text-sm font-medium hover:bg-[#FF8555] transition-colors flex items-center gap-2"
                                                >
                                                    <Eye size={14} />
                                                    Review
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

            </div>

            {/* MANAGE ACCOUNT MODAL */}
            <AnimatePresence>
                {showModal && modalData && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#0A0A0A] border border-[rgba(255,255,255,0.1)] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-6 border-b border-[rgba(255,255,255,0.08)]">
                                <h2 className="text-xl font-semibold">Manage Account</h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="w-8 h-8 rounded-lg hover:bg-[rgba(255,255,255,0.05)] flex items-center justify-center transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                                {/* Personal Details */}
                                <div className="mb-6">
                                    <h3 className="text-sm font-medium text-[#FF6B35] mb-4">Personal Details</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs text-[#A0A0A0] mb-2">Full Name</label>
                                            <input
                                                type="text"
                                                value={modalData.profile.fullName}
                                                onChange={(e) => setModalData({ ...modalData, profile: { ...modalData.profile, fullName: e.target.value } })}
                                                className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] text-white outline-none focus:border-[#FF6B35] transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-[#A0A0A0] mb-2">Username</label>
                                            <input
                                                type="text"
                                                value={modalData.profile.username}
                                                onChange={(e) => setModalData({ ...modalData, profile: { ...modalData.profile, username: e.target.value } })}
                                                className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] text-white outline-none focus:border-[#FF6B35] transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-[#A0A0A0] mb-2">Bio</label>
                                            <textarea
                                                value={modalData.profile.bio}
                                                onChange={(e) => setModalData({ ...modalData, profile: { ...modalData.profile, bio: e.target.value } })}
                                                rows="3"
                                                className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] text-white outline-none focus:border-[#FF6B35] transition-colors resize-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Professional Details */}
                                <div className="mb-6">
                                    <h3 className="text-sm font-medium text-[#FF6B35] mb-4">Professional Details</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs text-[#A0A0A0] mb-2">College / Institute</label>
                                            <input
                                                type="text"
                                                value={modalData.education.college}
                                                onChange={(e) => setModalData({ ...modalData, education: { ...modalData.education, college: e.target.value } })}
                                                className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] text-white outline-none focus:border-[#FF6B35] transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-[#A0A0A0] mb-2">Degree / Program</label>
                                            <input
                                                type="text"
                                                value={modalData.education.degree}
                                                onChange={(e) => setModalData({ ...modalData, education: { ...modalData.education, degree: e.target.value } })}
                                                className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] text-white outline-none focus:border-[#FF6B35] transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-[#A0A0A0] mb-2">Field of Study</label>
                                            <input
                                                type="text"
                                                value={modalData.education.field}
                                                onChange={(e) => setModalData({ ...modalData, education: { ...modalData.education, field: e.target.value } })}
                                                className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] text-white outline-none focus:border-[#FF6B35] transition-colors"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Social Links */}
                                <div className="mb-6">
                                    <h3 className="text-sm font-medium text-[#FF6B35] mb-4">Social Links</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs text-[#A0A0A0] mb-2">GitHub</label>
                                            <input
                                                type="url"
                                                value={modalData.socials.github}
                                                onChange={(e) => setModalData({ ...modalData, socials: { ...modalData.socials, github: e.target.value } })}
                                                className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] text-white outline-none focus:border-[#FF6B35] transition-colors"
                                                placeholder="https://github.com/username"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-[#A0A0A0] mb-2">LinkedIn</label>
                                            <input
                                                type="url"
                                                value={modalData.socials.linkedin}
                                                onChange={(e) => setModalData({ ...modalData, socials: { ...modalData.socials, linkedin: e.target.value } })}
                                                className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] text-white outline-none focus:border-[#FF6B35] transition-colors"
                                                placeholder="https://linkedin.com/in/username"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-[#A0A0A0] mb-2">Twitter</label>
                                            <input
                                                type="url"
                                                value={modalData.socials.twitter}
                                                onChange={(e) => setModalData({ ...modalData, socials: { ...modalData.socials, twitter: e.target.value } })}
                                                className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] text-white outline-none focus:border-[#FF6B35] transition-colors"
                                                placeholder="https://x.com/username"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Public Profile Toggle */}
                                <div className="mb-6">
                                    <h3 className="text-sm font-medium text-[#FF6B35] mb-4">Privacy</h3>
                                    <div className="flex items-center justify-between p-4 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)]">
                                        <div>
                                            <p className="text-sm font-medium">Public Portfolio</p>
                                            <p className="text-xs text-[#A0A0A0] mt-1">Make your portfolio visible to everyone</p>
                                        </div>
                                        <button
                                            onClick={() => setModalData({ ...modalData, settings: { ...modalData.settings, publicPortfolio: !modalData.settings.publicPortfolio } })}
                                            className={`w-12 h-7 rounded-full p-1 transition-all duration-300 ${modalData.settings.publicPortfolio ? 'bg-[#FF6B35]' : 'bg-[rgba(255,255,255,0.2)]'}`}
                                        >
                                            <div className={`w-5 h-5 rounded-full transition-all duration-300 ${modalData.settings.publicPortfolio ? 'translate-x-5' : 'translate-x-0'} bg-white`}></div>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="flex items-center justify-end gap-3 p-6 border-t border-[rgba(255,255,255,0.08)]">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-6 py-2.5 rounded-xl text-sm font-medium border border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                                >
                                    Cancel
                                </button>
                                <LoadingButton
                                    onClick={saveAccountChanges}
                                    loading={saving}
                                    loadingText="Saving..."
                                    variant="primary"
                                >
                                    Save Changes
                                </LoadingButton>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ADMIN REVIEW MODAL */}
            <AnimatePresence>
                {showAdminReviewModal && selectedSubmission && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => {
                            setShowAdminReviewModal(false);
                            setReviewAction(null);
                            setAdminNote("");
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#0A0A0A] border border-[rgba(255,255,255,0.1)] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-[rgba(255,255,255,0.1)]">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h2 className="text-xl font-semibold mb-1">Review Submission</h2>
                                        <p className="text-sm text-[#A0A0A0]">
                                            {selectedSubmission.userName} · {selectedSubmission.projectName}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setShowAdminReviewModal(false);
                                            setReviewAction(null);
                                            setAdminNote("");
                                        }}
                                        className="w-8 h-8 rounded-lg hover:bg-[rgba(255,255,255,0.05)] flex items-center justify-center"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 max-h-[60vh] overflow-y-auto">
                                <div className="mb-6">
                                    <h3 className="text-sm font-medium mb-3">Submission Details</h3>
                                    <div className="space-y-2 text-sm">
                                        <p><span className="text-[#A0A0A0]">User:</span> {selectedSubmission.userName}</p>
                                        <p><span className="text-[#A0A0A0]">Email:</span> {selectedSubmission.userEmail}</p>
                                        <p><span className="text-[#A0A0A0]">Project:</span> {selectedSubmission.projectName}</p>
                                        <p><span className="text-[#A0A0A0]">Milestone:</span> {selectedSubmission.milestoneId}</p>
                                        <p><span className="text-[#A0A0A0]">Submitted:</span> {new Date(selectedSubmission.submittedAt).toLocaleString()}</p>
                                    </div>
                                </div>

                                {/* Proofs */}
                                <div className="mb-6">
                                    <h3 className="text-sm font-medium mb-3">Proofs Submitted</h3>
                                    <div className="p-4 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)]">
                                        <pre className="text-xs text-[#A0A0A0] overflow-x-auto whitespace-pre-wrap">
                                            {JSON.stringify(selectedSubmission.submission.proofs, null, 2)}
                                        </pre>
                                    </div>
                                </div>

                                {/* Action Selection */}
                                <div className="mb-6">
                                    <h3 className="text-sm font-medium mb-3">Review Action</h3>
                                    <div className="grid grid-cols-3 gap-3">
                                        <button
                                            onClick={() => setReviewAction("verify")}
                                            className={`p-3 rounded-lg border transition-all ${reviewAction === "verify"
                                                ? "border-green-500 bg-green-500/10"
                                                : "border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.05)]"
                                                }`}
                                        >
                                            <CheckCircle size={20} className="text-green-400 mx-auto mb-1" />
                                            <p className="text-xs font-medium">Verify</p>
                                        </button>
                                        <button
                                            onClick={() => setReviewAction("flag")}
                                            className={`p-3 rounded-lg border transition-all ${reviewAction === "flag"
                                                ? "border-yellow-500 bg-yellow-500/10"
                                                : "border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.05)]"
                                                }`}
                                        >
                                            <AlertTriangle size={20} className="text-yellow-400 mx-auto mb-1" />
                                            <p className="text-xs font-medium">Flag</p>
                                        </button>
                                        <button
                                            onClick={() => setReviewAction("reject")}
                                            className={`p-3 rounded-lg border transition-all ${reviewAction === "reject"
                                                ? "border-red-500 bg-red-500/10"
                                                : "border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.05)]"
                                                }`}
                                        >
                                            <XCircle size={20} className="text-red-400 mx-auto mb-1" />
                                            <p className="text-xs font-medium">Reject</p>
                                        </button>
                                    </div>
                                </div>

                                {/* Admin Note (for flag/reject) */}
                                {(reviewAction === "flag" || reviewAction === "reject") && (
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium mb-2">
                                            {reviewAction === "flag" ? "Flag Note" : "Rejection Reason"} *
                                        </label>
                                        <textarea
                                            value={adminNote}
                                            onChange={(e) => setAdminNote(e.target.value)}
                                            placeholder={`Provide ${reviewAction === "flag" ? "clarification needed" : "reason for rejection"}...`}
                                            rows={4}
                                            className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] text-white outline-none focus:border-[#FF6B35] transition-colors resize-none"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="p-6 border-t border-[rgba(255,255,255,0.1)]  flex items-center justify-end gap-3">
                                <button
                                    onClick={() => {
                                        setShowAdminReviewModal(false);
                                        setReviewAction(null);
                                        setAdminNote("");
                                    }}
                                    className="px-6 py-2.5 rounded-xl text-sm font-medium border border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.05)]"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleReviewDecision}
                                    disabled={!reviewAction || processing}
                                    className="px-6 py-2.5 rounded-xl bg-[#FF6B35] text-white text-sm font-medium hover:bg-[#FF8555] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {processing && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                                    {processing ? "Processing..." : "Submit Review"}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
