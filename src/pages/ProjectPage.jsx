import { useState, useEffect } from "react";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight, BookOpen, CheckCircle2, X, Clock, Award, Github, Info, AlertCircle, ChevronDown, ChevronUp, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getProjectById, getMilestones, getMilestoneStatus, areMilestoneTasksCompleted, calculateProgress } from "../config/projects.config";
import MilestoneCard from "../components/MilestoneCard";
import SubmissionModal from "../components/SubmissionModal";
import LoadingButton from "../components/LoadingButton";
import { PageLoader, MilestoneCardSkeleton } from "../components/SkeletonLoaders";
import { EMAIL_CONFIG } from '../config/email';

export default function ProjectPage() {
    const { projectId } = useParams();
    const user = auth.currentUser;
    const navigate = useNavigate();

    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showInstructions, setShowInstructions] = useState(false);
    const [showInstructionsModal, setShowInstructionsModal] = useState(false);
    const [understood, setUnderstood] = useState(false);
    const [accepting, setAccepting] = useState(false);

    // GitHub repo state
    const [githubRepo, setGithubRepo] = useState("");
    const [repoError, setRepoError] = useState("");
    const [repoConfirmed, setRepoConfirmed] = useState(false);
    const [showRepoHelper, setShowRepoHelper] = useState(false);

    // Milestone and task state
    const [expandedMilestones, setExpandedMilestones] = useState({});
    const [completedTasks, setCompletedTasks] = useState([]);
    const [completedMilestones, setCompletedMilestones] = useState([]);
    const [showTaskHelper, setShowTaskHelper] = useState(null);
    const [completingTask, setCompletingTask] = useState(null);

    // Milestone submission state
    const [showMilestoneSubmission, setShowMilestoneSubmission] = useState(false);
    const [selectedMilestone, setSelectedMilestone] = useState(null);

    // Task submission state (old - can be removed later)
    const [showSubmissionModal, setShowSubmissionModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [submissionData, setSubmissionData] = useState({
        commitUrl: "",
        notes: "",
    });
    const [submissionError, setSubmissionError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // Get project data from config
    const project = getProjectById(projectId);
    const milestones = getMilestones(projectId);

    // Calculate progress
    const totalTasks = milestones.reduce((sum, m) => sum + m.tasks.length, 0);
    const completedTasksCount = completedTasks.length;
    const overallProgress = totalTasks > 0 ? (completedTasksCount / totalTasks) * 100 : 0;

    // Calculate milestone completion
    const getMilestoneProgress = (milestone) => {
        const milestoneTasks = milestone.tasks.map(t => `${milestone.milestoneId}-${t.taskId}`);
        const completed = milestoneTasks.filter(taskId => completedTasks.includes(taskId)).length;
        return {
            completed,
            total: milestoneTasks.length,
            percentage: (completed / milestoneTasks.length) * 100
        };
    };

    // ---- VALIDATE GITHUB REPO URL ----
    const validateGithubRepo = (url) => {
        setRepoError("");
        if (!url.trim()) {
            setRepoError("GitHub repository URL is required");
            return false;
        }
        const githubPattern = /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w-]+\/?$/;
        if (!githubPattern.test(url)) {
            setRepoError("Please enter a valid GitHub repository URL (e.g., https://github.com/username/repo-name)");
            return false;
        }
        const repoName = url.split('/').pop().replace(/\/$/, '');
        const expectedPrefix = `madeit-${projectId}`;
        if (!repoName.toLowerCase().includes(expectedPrefix.toLowerCase())) {
            setRepoError(`Repository name must contain "madeit-${projectId}" (e.g., madeit-${projectId} or madeit-${projectId}-v1)`);
            return false;
        }
        return true;
    };

    // ---- FETCH USER DATA ----
    useEffect(() => {
        const fetchUserData = async () => {
            if (!user) {
                navigate("/");
                return;
            }

            try {
                const userRef = doc(db, "users", user.uid);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    const data = userSnap.data();

                    if (!data.onboarding?.profileCompleted) {
                        navigate("/profile-setup");
                        return;
                    }

                    if (data.activeProject?.id !== projectId) {
                        navigate("/projects");
                        return;
                    }

                    setUserData(data);

                    const instructionsCompleted = data.activeProject?.instructionsCompleted || false;
                    setShowInstructions(!instructionsCompleted);

                    if (instructionsCompleted && data.activeProject?.githubRepo) {
                        setGithubRepo(data.activeProject.githubRepo);
                    }

                    // Load completed tasks
                    if (data.activeProject?.completedTasks) {
                        setCompletedTasks(data.activeProject.completedTasks);
                    }

                    // Load completed milestones
                    if (data.activeProject?.completedMilestones) {
                        setCompletedMilestones(data.activeProject.completedMilestones);
                    }
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
    }, [user, navigate, projectId]);

    // ---- HANDLE CONTINUE (COMPLETE INSTRUCTIONS) ----
    const handleContinue = async () => {
        if (!user || !understood || !repoConfirmed) return;

        if (!validateGithubRepo(githubRepo)) {
            return;
        }

        setAccepting(true);
        try {
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
                "activeProject.instructionsCompleted": true,
                "activeProject.githubRepo": githubRepo.trim(),
                "activeProject.completedTasks": [],
            });

            const project = getProjectById(projectId);
            const milestones = getMilestones(projectId);
            try {
                await fetch(`${EMAIL_CONFIG.API_BASE_URL}/api/send-project-confirmation-email`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userName: userData?.profile?.fullName || 'there',
                        userEmail: user.email,
                        projectName: project?.name || 'Your Project',
                        milestoneCount: milestones?.length || 0,
                        githubRepo: githubRepo.trim()
                    })
                });
            } catch (error) {
                console.error('Confirmation email failed:', error);
            }

            setShowInstructions(false);

            setUserData((prev) => ({
                ...prev,
                activeProject: {
                    ...prev.activeProject,
                    instructionsCompleted: true,
                    githubRepo: githubRepo.trim(),
                    completedTasks: [],
                },
            }));
        } catch (error) {
            console.error("Error completing instructions:", error);
            setRepoError("Failed to save. Please try again.");
        } finally {
            setAccepting(false);
        }
    };

    // ---- TOGGLE MILESTONE EXPANSION ----
    const toggleMilestone = (milestoneId) => {
        setExpandedMilestones(prev => ({
            ...prev,
            [milestoneId]: !prev[milestoneId]
        }));
    };


    // ---- HANDLE TASK COMPLETION (NO PROOF REQUIRED) ----
    const handleTaskComplete = async (milestoneId, taskId) => {
        const taskKey = `${milestoneId}-${taskId}`;

        // Check if already completed
        if (completedTasks.includes(taskKey)) {
            return;
        }

        try {
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
                'activeProject.completedTasks': arrayUnion(taskKey)
            });

            setCompletedTasks(prev => [...prev, taskKey]);
        } catch (error) {
            console.error("Error completing task:", error);
            alert("Failed to mark task as complete. Please try again.");
        }
    };

    // ---- HANDLE MILESTONE SUBMISSION ----
    const handleMilestoneSubmit = async (milestoneId, proofData) => {
        console.log("=== MILESTONE SUBMISSION START ===");
        console.log("Milestone ID:", milestoneId);
        console.log("Proof Data:", proofData);
        console.log("User UID:", user?.uid);
        console.log("Project ID:", projectId);

        try {
            const userRef = doc(db, "users", user.uid);
            console.log("User Ref Path:", userRef.path);

            // DO NOT auto-complete milestone - it needs admin verification
            // const newCompletedMilestones = [...completedMilestones, milestoneId];
            // const progress = calculateProgress(projectId, newCompletedMilestones);

            const updateData = {
                // DO NOT add to completedMilestones yet - admin must verify first
                [`activeProject.submissions.${milestoneId}`]: {
                    submittedAt: new Date().toISOString(),
                    proofs: proofData,
                    verificationStatus: "under_review" // Admin must verify before milestone is complete
                }
                // DO NOT update progress yet - wait for admin verification
            };

            console.log("Update Data:", updateData);

            await updateDoc(userRef, updateData);
            console.log("✅ Firestore update successful!");

            // Refresh userData to show verification badge immediately
            const updatedUserSnap = await getDoc(userRef);
            if (updatedUserSnap.exists()) {
                setUserData(updatedUserSnap.data());
            }

            // Send email notification to admin
            try {
                const milestoneConfig = getMilestones(userData.activeProject.id).find(m => m.milestoneId === selectedMilestone.milestoneId);
                const emailData = {
                    userName: userData.profile?.fullName || userData.name || 'User',
                    userEmail: userData.email || user.email,
                    projectName: userData.activeProject.name,
                    milestoneName: milestoneConfig?.title || selectedMilestone.title,
                    milestoneId: selectedMilestone.milestoneId,
                    adminEmail: 'moinsheikh1303@gmail.com' // Correct admin email
                };

                console.log('📧 Sending admin notification email...', emailData);

                const response = await fetch(`${EMAIL_CONFIG.API_BASE_URL}/api/send-milestone-submitted-email`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(emailData)
                });

                const result = await response.json();
                console.log('📧 Email API response:', result);

                if (result.success) {
                    console.log('✅ Admin notification email sent successfully');
                } else {
                    console.error('❌ Email failed:', result.error);
                }
            } catch (emailError) {
                console.error('❌ Email notification failed:', emailError);
                console.error('Error details:', emailError.message);
            }

            // DO NOT update completedMilestones state - milestone is only submitted, not completed
            setShowMilestoneSubmission(false);
            setSelectedMilestone(null);

            alert("Milestone submitted! ✅\nYour submission is now under review by an admin.");
        } catch (error) {
            console.error("❌ ERROR submitting milestone:");
            console.error("Error name:", error.name);
            console.error("Error message:", error.message);
            console.error("Error code:", error.code);
            console.error("Full error:", error);
            throw new Error(`Failed to submit milestone. ${error.message}`);
        }
    };


    // ---- VALIDATE COMMIT URL ----
    const validateCommitUrl = (url) => {
        if (!url.trim()) {
            setSubmissionError("Commit URL is required");
            return false;
        }

        // Check if it's a valid GitHub commit URL
        const commitPattern = /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w-]+\/commit\/[\w]+\/?$/;
        if (!commitPattern.test(url)) {
            setSubmissionError("Please enter a valid GitHub commit URL (e.g., https://github.com/username/repo/commit/abc123)");
            return false;
        }

        // Check if commit is from the project repository
        if (userData?.activeProject?.githubRepo) {
            const repoUrl = userData.activeProject.githubRepo.replace(/\/$/, '');
            if (!url.startsWith(repoUrl)) {
                setSubmissionError("Commit must be from your project repository");
                return false;
            }
        }

        return true;
    };

    // ---- SUBMIT TASK ----
    const handleSubmitTask = async () => {
        if (!user || !selectedTask) return;

        // Validate commit URL
        if (!validateCommitUrl(submissionData.commitUrl)) {
            return;
        }

        setSubmitting(true);
        try {
            const userRef = doc(db, "users", user.uid);

            // Create submission object
            const submission = {
                taskId: selectedTask.fullTaskId,
                commitUrl: submissionData.commitUrl.trim(),
                notes: submissionData.notes.trim(),
                submittedAt: new Date().toISOString(),
            };

            // Update Firestore
            await updateDoc(userRef, {
                "activeProject.completedTasks": arrayUnion(selectedTask.fullTaskId),
                "activeProject.submissions": arrayUnion(submission),
            });

            // Update local state
            setCompletedTasks(prev => [...prev, selectedTask.fullTaskId]);

            // Update userData
            setUserData(prev => ({
                ...prev,
                activeProject: {
                    ...prev.activeProject,
                    completedTasks: [...(prev.activeProject.completedTasks || []), selectedTask.fullTaskId],
                    submissions: [...(prev.activeProject.submissions || []), submission],
                },
            }));

            // Close modal
            setShowSubmissionModal(false);
            setSelectedTask(null);
            setSubmissionData({ commitUrl: "", notes: "" });
        } catch (error) {
            console.error("Error submitting task:", error);
            setSubmissionError("Failed to submit. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    // ---- LOADING STATE ----
    if (loading) {
        return <PageLoader message="Loading project..." />;
    }

    if (!userData || !project) return null;

    // ---- INSTRUCTIONS CONTENT COMPONENT ----
    const InstructionsContent = ({ inModal = false }) => (
        <div className={inModal ? "" : "max-w-3xl mx-auto"}>
            <div className="mb-8">
                <div className="w-16 h-16 rounded-full bg-[rgba(255,107,53,0.1)] flex items-center justify-center mx-auto mb-6">
                    <BookOpen size={28} color="#FF6B35" strokeWidth={1.5} />
                </div>
                <h1 className="text-3xl font-semibold tracking-tight text-center mb-3">
                    Welcome to {project.name}
                </h1>
                <p className="text-[#A0A0A0] text-center max-w-2xl mx-auto">
                    Before you begin, let's understand how this project works and what you'll be building.
                </p>
            </div>

            <div className="space-y-6">
                {/* What the project is */}
                <div className="p-6 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)]">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-[#FF6B35] text-white flex items-center justify-center text-sm font-bold">1</span>
                        What You'll Build
                    </h3>
                    <p className="text-[#A0A0A0] leading-relaxed">
                        {project.fullOverview}
                    </p>
                </div>

                {/* How milestones and tasks work */}
                <div className="p-6 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)]">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-[#FF6B35] text-white flex items-center justify-center text-sm font-bold">2</span>
                        Milestones & Tasks
                    </h3>
                    <p className="text-[#A0A0A0] leading-relaxed mb-3">
                        Your project is broken down into <strong className="text-white">{milestones.length} milestones</strong> — major phases of development. Each milestone contains specific <strong className="text-white">tasks</strong> you need to complete.
                    </p>
                    <ul className="space-y-2 text-sm text-[#A0A0A0]">
                        <li className="flex items-start gap-2">
                            <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0 text-[#FF6B35]" />
                            <span>Complete tasks in order to unlock the next milestone</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0 text-[#FF6B35]" />
                            <span>Each task has clear requirements and acceptance criteria</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0 text-[#FF6B35]" />
                            <span>Track your progress as you complete each task</span>
                        </li>
                    </ul>
                </div>

                {/* Proof of work */}
                <div className="p-6 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)]">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-[#FF6B35] text-white flex items-center justify-center text-sm font-bold">3</span>
                        Proof of Work
                    </h3>
                    <p className="text-[#A0A0A0] leading-relaxed mb-3">
                        For each task, you'll submit <strong className="text-white">proof of work</strong> — evidence that you've completed the task. This could be:
                    </p>
                    <ul className="space-y-2 text-sm text-[#A0A0A0]">
                        {(project.proofOfWork || []).slice(0, 3).map((item, index) => (
                            <li key={index} className="flex items-start gap-2">
                                <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0 text-[#FF6B35]" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Completion rules */}
                <div className="p-6 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)]">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-[#FF6B35] text-white flex items-center justify-center text-sm font-bold">4</span>
                        Completion Rules
                    </h3>
                    <p className="text-[#A0A0A0] leading-relaxed mb-3">
                        To complete this project and unlock the next one:
                    </p>
                    <ul className="space-y-2 text-sm text-[#A0A0A0]">
                        <li className="flex items-start gap-2">
                            <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0 text-[#FF6B35]" />
                            <span>Complete all {milestones.length} milestones and their tasks</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0 text-[#FF6B35]" />
                            <span>Submit proof of work for each task</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0 text-[#FF6B35]" />
                            <span>Reach 100% project completion</span>
                        </li>
                    </ul>
                </div>

                {/* Portfolio updates */}
                <div className="p-6 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)]">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-[#FF6B35] text-white flex items-center justify-center text-sm font-bold">5</span>
                        Your Portfolio
                    </h3>
                    <p className="text-[#A0A0A0] leading-relaxed">
                        As you complete tasks and milestones, your <strong className="text-white">portfolio automatically updates</strong> to showcase your work. Completed projects, proof of work, and skills learned will be visible to potential employers and collaborators.
                    </p>
                </div>
            </div>

            {/* Show GitHub repo if in modal and already set */}
            {inModal && userData?.activeProject?.githubRepo && (
                <div className="mt-6 p-4 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)]">
                    <div className="flex items-center gap-2 mb-2">
                        <Github size={16} className="text-[#FF6B35]" />
                        <span className="text-sm font-medium">Project Repository</span>
                    </div>
                    <a
                        href={userData.activeProject.githubRepo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[#FF6B35] hover:underline break-all"
                    >
                        {userData.activeProject.githubRepo}
                    </a>
                    <p className="text-xs text-[#A0A0A0] mt-2">
                        This repository is locked for this project. To change it, please contact support.
                    </p>
                </div>
            )}
        </div>
    );

    // ---- GITHUB REPO HELPER MODAL ----
    const RepoHelperModal = () => (
        <AnimatePresence>
            {showRepoHelper && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    onClick={() => setShowRepoHelper(false)}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-[#0A0A0A] border border-[rgba(255,255,255,0.1)] rounded-2xl w-full max-w-lg overflow-hidden"
                    >
                        <div className="flex items-center justify-between p-6 border-b border-[rgba(255,255,255,0.08)]">
                            <h3 className="text-lg font-semibold">How to Set Up Your GitHub Repository</h3>
                            <button
                                onClick={() => setShowRepoHelper(false)}
                                className="w-8 h-8 rounded-lg hover:bg-[rgba(255,255,255,0.05)] flex items-center justify-center transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-[#FF6B35] text-white flex items-center justify-center text-xs">1</span>
                                    Create a New Repository
                                </h4>
                                <p className="text-sm text-[#A0A0A0] ml-8">
                                    Go to <a href="https://github.com/new" target="_blank" rel="noopener noreferrer" className="text-[#FF6B35] hover:underline">github.com/new</a> and create a new repository.
                                </p>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-[#FF6B35] text-white flex items-center justify-center text-xs">2</span>
                                    Name Your Repository
                                </h4>
                                <p className="text-sm text-[#A0A0A0] ml-8 mb-2">
                                    Use this naming convention:
                                </p>
                                <code className="block ml-8 px-3 py-2 rounded-lg bg-[rgba(255,255,255,0.05)] text-sm text-[#FF6B35] font-mono">
                                    madeit-{projectId}
                                </code>
                                <p className="text-xs text-[#A0A0A0] ml-8 mt-2">
                                    You can add a suffix if needed (e.g., madeit-{projectId}-v1)
                                </p>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-[#FF6B35] text-white flex items-center justify-center text-xs">3</span>
                                    Copy the Repository URL
                                </h4>
                                <p className="text-sm text-[#A0A0A0] ml-8 mb-2">
                                    After creating the repo, copy the URL from your browser's address bar. It should look like:
                                </p>
                                <code className="block ml-8 px-3 py-2 rounded-lg bg-[rgba(255,255,255,0.05)] text-sm text-white font-mono break-all">
                                    https://github.com/yourusername/madeit-{projectId}
                                </code>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-[#FF6B35] text-white flex items-center justify-center text-xs">4</span>
                                    Paste the URL Below
                                </h4>
                                <p className="text-sm text-[#A0A0A0] ml-8">
                                    Paste the complete repository URL in the input field below.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    // ---- TASK HELPER MODAL ----
    const TaskHelperModal = () => (
        <AnimatePresence>
            {showTaskHelper && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    onClick={() => setShowTaskHelper(null)}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-[#0A0A0A] border border-[rgba(255,255,255,0.1)] rounded-2xl w-full max-w-2xl overflow-hidden"
                    >
                        <div className="flex items-center justify-between p-6 border-b border-[rgba(255,255,255,0.08)]">
                            <h3 className="text-lg font-semibold">Task Details</h3>
                            <button
                                onClick={() => setShowTaskHelper(null)}
                                className="w-8 h-8 rounded-lg hover:bg-[rgba(255,255,255,0.05)] flex items-center justify-center transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6">
                            <h4 className="text-xl font-semibold mb-3">{showTaskHelper.title}</h4>

                            <div className="space-y-4">
                                <div>
                                    <h5 className="text-sm font-medium text-[#FF6B35] mb-2">Description</h5>
                                    <p className="text-sm text-[#A0A0A0] leading-relaxed">{showTaskHelper.description}</p>
                                </div>

                                <div>
                                    <h5 className="text-sm font-medium text-[#FF6B35] mb-2">Expected Output / Deliverable</h5>
                                    <p className="text-sm text-white leading-relaxed">{showTaskHelper.expectedOutput}</p>
                                </div>

                                <div>
                                    <h5 className="text-sm font-medium text-[#FF6B35] mb-2">Task Type</h5>
                                    <span className={`inline-block px-3 py-1 rounded-lg text-xs font-medium ${showTaskHelper.taskType === 'setup' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                        showTaskHelper.taskType === 'build' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                            showTaskHelper.taskType === 'polish' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                                                'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                                        }`}>
                                        {showTaskHelper.taskType}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white">
            <div className="max-w-6xl mx-auto px-4 py-12">

                {/* Show Instructions or Milestones */}
                <AnimatePresence mode="wait">
                    {showInstructions ? (
                        <motion.div
                            key="instructions"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                        >
                            <InstructionsContent />

                            {/* GITHUB REPOSITORY SETUP */}
                            <div className="max-w-3xl mx-auto mt-8">
                                <div className="p-6 rounded-xl bg-[rgba(255,107,53,0.05)] border border-[rgba(255,107,53,0.2)]">
                                    <div className="flex items-start gap-3 mb-4">
                                        <Github size={24} className="text-[#FF6B35] flex-shrink-0 mt-0.5" />
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold mb-2">GitHub Repository Required</h3>
                                            <p className="text-sm text-[#A0A0A0] leading-relaxed">
                                                Before starting this project, you must create a dedicated GitHub repository. All your code and commits will be tracked here.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Repository URL Input */}
                                    <div className="space-y-3">
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <label className="text-sm font-medium flex items-center gap-2">
                                                    Repository URL
                                                    <span className="text-red-400">*</span>
                                                    <button
                                                        onClick={() => setShowRepoHelper(true)}
                                                        className="text-[#A0A0A0] hover:text-white transition-colors"
                                                    >
                                                        <Info size={16} />
                                                    </button>
                                                </label>
                                            </div>
                                            <input
                                                type="url"
                                                value={githubRepo}
                                                onChange={(e) => {
                                                    setGithubRepo(e.target.value);
                                                    setRepoError("");
                                                }}
                                                placeholder={`https://github.com/yourusername/madeit-${projectId}`}
                                                className={`w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border ${repoError ? 'border-red-500' : 'border-[rgba(255,255,255,0.08)]'
                                                    } text-white outline-none focus:border-[#FF6B35] transition-colors text-sm font-mono`}
                                            />
                                            {repoError && (
                                                <div className="flex items-start gap-2 mt-2 text-red-400 text-sm">
                                                    <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                                                    <span>{repoError}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Naming Convention Info */}
                                        <div className="p-3 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)]">
                                            <p className="text-xs text-[#A0A0A0] mb-1">
                                                <strong className="text-white">Naming Convention:</strong>
                                            </p>
                                            <code className="text-xs text-[#FF6B35] font-mono">
                                                github.com/&lt;username&gt;/madeit-{projectId}
                                            </code>
                                        </div>

                                        {/* Confirmation Checkbox */}
                                        <label className="flex items-start gap-3 cursor-pointer group p-3 rounded-lg hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                                            <input
                                                type="checkbox"
                                                checked={repoConfirmed}
                                                onChange={(e) => setRepoConfirmed(e.target.checked)}
                                                className="appearance-none w-5 h-5 border-2 border-white/20 rounded bg-black/50 cursor-pointer relative mt-0.5 flex-shrink-0
                          checked:bg-[#FF6B35] checked:border-[#FF6B35]
                          after:content-['✓'] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:text-white after:text-sm after:font-bold after:opacity-0 checked:after:opacity-100"
                                            />
                                            <span className="text-sm text-[#A0A0A0] group-hover:text-white transition-colors">
                                                I understand that this GitHub repository will remain constant for this project
                                            </span>
                                        </label>

                                        {/* Warning Text */}
                                        <div className="flex items-start gap-2 p-3 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)]">
                                            <AlertCircle size={16} className="text-yellow-500 flex-shrink-0 mt-0.5" />
                                            <p className="text-xs text-[#A0A0A0] leading-relaxed">
                                                <strong className="text-white">Important:</strong> This repository cannot be changed once the project starts. To change it later, you'll need to raise a support request.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Understanding Checkbox */}
                                <div className="mt-6 p-6 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)]">
                                    <label className="flex items-start gap-3 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={understood}
                                            onChange={(e) => setUnderstood(e.target.checked)}
                                            className="appearance-none w-5 h-5 border-2 border-white/20 rounded bg-black/50 cursor-pointer relative mt-0.5
                        checked:bg-[#FF6B35] checked:border-[#FF6B35]
                        after:content-['✓'] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:text-white after:text-sm after:font-bold after:opacity-0 checked:after:opacity-100"
                                        />
                                        <span className="text-sm text-[#A0A0A0] group-hover:text-white transition-colors">
                                            I understand how this project works and I'm ready to start building
                                        </span>
                                    </label>

                                    <LoadingButton
                                        onClick={handleContinue}
                                        disabled={!understood || !repoConfirmed || !githubRepo.trim()}
                                        loading={accepting}
                                        loadingText="Saving..."
                                        variant="primary"
                                        className="w-full mt-6"
                                    >
                                        Start Project
                                        <ArrowRight size={18} strokeWidth={2} />
                                    </LoadingButton>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="milestones"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                        >
                            {/* HEADER */}
                            <div className="mb-8">
                                <button
                                    onClick={() => navigate("/dashboard")}
                                    className="text-sm text-[#A0A0A0] hover:text-white transition-colors mb-4 flex items-center gap-2"
                                >
                                    ← Back to Dashboard
                                </button>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h1 className="text-3xl font-semibold tracking-tight mb-2">
                                            {project.name}
                                        </h1>
                                        <p className="text-[#A0A0A0] mb-3">{project.shortDescription}</p>
                                        {/* Show GitHub Repo */}
                                        {userData?.activeProject?.githubRepo && (
                                            <a
                                                href={userData.activeProject.githubRepo}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 text-sm text-[#FF6B35] hover:underline"
                                            >
                                                <Github size={16} />
                                                View Repository
                                            </a>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => setShowInstructionsModal(true)}
                                        className="px-4 py-2 rounded-lg border border-[rgba(255,255,255,0.1)] text-sm font-medium flex items-center gap-2 hover:bg-[rgba(255,255,255,0.05)] transition-colors cursor-pointer"
                                    >
                                        <BookOpen size={16} strokeWidth={1.5} />
                                        View Instructions
                                    </button>
                                </div>
                            </div>


                            {/* PROGRESS OVERVIEW - 3 CARDS */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.1 }}
                                className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4"
                            >
                                {/* Milestones Card */}
                                <div className="p-6 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)]">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <p className="text-sm text-[#A0A0A0] mb-1">Milestones</p>
                                            <p className="text-3xl font-semibold text-white">
                                                {milestones.filter(m => getMilestoneProgress(m).percentage === 100).length}/{milestones.length}
                                            </p>
                                        </div>
                                        <div className="w-12 h-12 rounded-full bg-[rgba(255,107,53,0.1)] flex items-center justify-center">
                                            <Award size={24} className="text-[#FF6B35]" />
                                        </div>
                                    </div>
                                    <div className="w-full h-2 bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-[#FF6B35] rounded-full transition-all duration-500"
                                            style={{
                                                width: `${milestones.length > 0
                                                    ? (milestones.filter(m => getMilestoneProgress(m).percentage === 100).length / milestones.length) * 100
                                                    : 0}%`
                                            }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Tasks Card */}
                                <div className="p-6 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)]">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <p className="text-sm text-[#A0A0A0] mb-1">Tasks</p>
                                            <p className="text-3xl font-semibold text-white">
                                                {completedTasksCount}/{totalTasks}
                                            </p>
                                        </div>
                                        <div className="w-12 h-12 rounded-full bg-[rgba(255,107,53,0.1)] flex items-center justify-center">
                                            <CheckCircle2 size={24} className="text-[#FF6B35]" />
                                        </div>
                                    </div>
                                    <div className="w-full h-2 bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-[#FF6B35] rounded-full transition-all duration-500"
                                            style={{ width: `${overallProgress}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Overall Progress Card */}
                                <div className="p-6 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)]">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <p className="text-sm text-[#A0A0A0] mb-1">Overall Progress</p>
                                            <p className="text-3xl font-semibold text-[#FF6B35]">
                                                {overallProgress.toFixed(0)}%
                                            </p>
                                        </div>
                                        <div className="w-12 h-12 rounded-full bg-[rgba(255,107,53,0.1)] flex items-center justify-center">
                                            <Clock size={24} className="text-[#FF6B35]" />
                                        </div>
                                    </div>
                                    <div className="w-full h-2 bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-[#FF6B35] rounded-full transition-all duration-500"
                                            style={{ width: `${overallProgress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* MILESTONES */}
                            <div className="space-y-4">
                                {milestones.map((milestone, index) => {
                                    const status = getMilestoneStatus(
                                        projectId,
                                        milestone.milestoneId,
                                        completedMilestones
                                    );

                                    const canSubmit = areMilestoneTasksCompleted(
                                        projectId,
                                        milestone.milestoneId,
                                        completedTasks
                                    );

                                    return (
                                        <motion.div
                                            key={milestone.milestoneId}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.4, delay: index * 0.1 }}
                                        >
                                            <MilestoneCard
                                                milestone={milestone}
                                                projectId={projectId}
                                                status={status}
                                                completedTasks={completedTasks}
                                                onTaskComplete={handleTaskComplete}
                                                onSubmit={() => {
                                                    setSelectedMilestone(milestone);
                                                    setShowMilestoneSubmission(true);
                                                }}
                                                canSubmit={canSubmit && status === 'unlocked'}
                                                submission={userData?.activeProject?.submissions?.[milestone.milestoneId]}
                                            />
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>

            {/* REPO HELPER MODAL */}
            <RepoHelperModal />

            {/* TASK HELPER MODAL */}
            <TaskHelperModal />

            {/* INSTRUCTIONS MODAL */}
            <AnimatePresence>
                {showInstructionsModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setShowInstructionsModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#0A0A0A] border border-[rgba(255,255,255,0.1)] rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-6 border-b border-[rgba(255,255,255,0.08)]">
                                <h2 className="text-xl font-semibold">Project Instructions</h2>
                                <button
                                    onClick={() => setShowInstructionsModal(false)}
                                    className="w-8 h-8 rounded-lg hover:bg-[rgba(255,255,255,0.05)] flex items-center justify-center transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                                <InstructionsContent inModal={true} />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* TASK SUBMISSION MODAL */}
            <AnimatePresence>
                {showSubmissionModal && selectedTask && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setShowSubmissionModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#0A0A0A] border border-[rgba(255,255,255,0.1)] rounded-2xl w-full max-w-2xl overflow-hidden"
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-6 border-b border-[rgba(255,255,255,0.08)]">
                                <div>
                                    <h2 className="text-xl font-semibold">Submit Task</h2>
                                    <p className="text-sm text-[#A0A0A0] mt-1">{selectedTask.title}</p>
                                </div>
                                <button
                                    onClick={() => setShowSubmissionModal(false)}
                                    className="w-8 h-8 rounded-lg hover:bg-[rgba(255,255,255,0.05)] flex items-center justify-center transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6 space-y-6">
                                {/* Task Info */}
                                <div className="p-4 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)]">
                                    <h3 className="text-sm font-medium mb-2">Expected Output</h3>
                                    <p className="text-sm text-[#A0A0A0]">{selectedTask.expectedOutput}</p>
                                </div>

                                {/* Commit URL Input */}
                                <div>
                                    <label className="text-sm font-medium flex items-center gap-2 mb-2">
                                        GitHub Commit URL
                                        <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="url"
                                        value={submissionData.commitUrl}
                                        onChange={(e) => {
                                            setSubmissionData(prev => ({ ...prev, commitUrl: e.target.value }));
                                            setSubmissionError("");
                                        }}
                                        placeholder="https://github.com/username/repo/commit/abc123..."
                                        className={`w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border ${submissionError ? 'border-red-500' : 'border-[rgba(255,255,255,0.08)]'
                                            } text-white outline-none focus:border-[#FF6B35] transition-colors text-sm font-mono`}
                                    />
                                    {submissionError && (
                                        <div className="flex items-start gap-2 mt-2 text-red-400 text-sm">
                                            <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                                            <span>{submissionError}</span>
                                        </div>
                                    )}
                                    <p className="text-xs text-[#A0A0A0] mt-2">
                                        Paste the URL of the commit that completes this task from your project repository
                                    </p>
                                </div>

                                {/* Notes (Optional) */}
                                <div>
                                    <label className="text-sm font-medium mb-2 block">
                                        Notes (Optional)
                                    </label>
                                    <textarea
                                        value={submissionData.notes}
                                        onChange={(e) => setSubmissionData(prev => ({ ...prev, notes: e.target.value }))}
                                        placeholder="Add any additional notes about your implementation..."
                                        rows={4}
                                        className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] text-white outline-none focus:border-[#FF6B35] transition-colors text-sm resize-none"
                                    />
                                </div>

                                {/* Submit Button */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowSubmissionModal(false)}
                                        className="flex-1 py-3 rounded-xl border border-[rgba(255,255,255,0.1)] text-sm font-medium hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSubmitTask}
                                        disabled={!submissionData.commitUrl.trim() || submitting}
                                        className="flex-1 py-3 rounded-xl bg-[#FF6B35] text-white text-sm font-medium flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer"
                                    >
                                        {submitting ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Submitting...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle2 size={16} />
                                                Submit Task
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* MILESTONE SUBMISSION MODAL */}
            <SubmissionModal
                isOpen={showMilestoneSubmission}
                onClose={() => {
                    setShowMilestoneSubmission(false);
                    setSelectedMilestone(null);
                }}
                milestone={selectedMilestone}
                projectId={projectId}
                githubRepo={userData?.activeProject?.githubRepo}
                onSubmit={handleMilestoneSubmit}
            />
        </div>
    );
}
