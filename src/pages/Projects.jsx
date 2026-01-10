import { useState, useEffect } from "react";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Lock, Clock, Award, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getAllProjects } from "../config/projects.config";
import LoadingButton from "../components/LoadingButton";
import { PageLoader, ProjectCardSkeleton } from "../components/SkeletonLoaders";
import { EMAIL_CONFIG } from '../config/email';

export default function Projects() {
    const user = auth.currentUser;
    const navigate = useNavigate();

    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [starting, setStarting] = useState(false);

    // Get all projects from config
    const PROJECTS = getAllProjects();

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

                    // Redirect if profile not completed
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
    }, [user, navigate]);

    // ---- HANDLE START PROJECT CLICK ----
    const handleStartProject = (project) => {
        setSelectedProject(project);
        setShowModal(true);
    };

    // ---- CONFIRM START PROJECT ----
    const confirmStartProject = async () => {
        if (!user || !selectedProject) return;

        setStarting(true);
        try {
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
                activeProject: {
                    id: selectedProject.projectId,
                    name: selectedProject.name,
                    progress: 0,
                    nextTask: "Review project requirements",
                    startedAt: new Date().toISOString(),
                    instructionsAccepted: false,
                },
            });

            try {
                await fetch(`${EMAIL_CONFIG.API_BASE_URL}/api/send-email`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: 'projectSelection',
                        data: {
                            name: userData?.profile?.fullName || 'there',
                            email: user.email,
                            projectName: selectedProject.name
                        }
                    })
                });
            } catch (error) {
                console.error('Selection email failed:', error);
            }

            // Navigate to project page
            navigate(`/projects/${selectedProject.projectId}`);
        } catch (error) {
            console.error("Error starting project:", error);
        } finally {
            setStarting(false);
        }
    };

    // ---- GET DIFFICULTY COLOR ----
    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case "Beginner":
                return "bg-green-500/10 text-green-400 border-green-500/20";
            case "Intermediate":
                return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
            case "Advanced":
                return "bg-red-500/10 text-red-400 border-red-500/20";
            default:
                return "bg-gray-500/10 text-gray-400 border-gray-500/20";
        }
    };

    // ---- LOADING STATE ----
    if (loading) {
        return <PageLoader message="Loading projects..." />;
    }

    if (!userData) return null;

    const activeProjectId = userData.activeProject?.id;

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white">
            <div className="max-w-6xl mx-auto px-4 py-12">

                {/* HEADER */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mb-12"
                >
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="text-sm text-[#A0A0A0] hover:text-white transition-colors mb-4 flex items-center gap-2"
                    >
                        ← Back to Dashboard
                    </button>
                    <h1 className="text-4xl font-semibold tracking-tight mb-3">
                        Choose Your Project
                    </h1>
                    <p className="text-[#A0A0A0] max-w-2xl">
                        Select a real-world project to build. You can work on one project at a time.
                        {activeProjectId && " Complete your current project to unlock others."}
                    </p>
                </motion.div>

                {/* PROJECTS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {PROJECTS.map((project, index) => {
                        const isLocked = activeProjectId && activeProjectId !== project.projectId;
                        const isActive = activeProjectId === project.projectId;

                        return (
                            <motion.div
                                key={project.projectId}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                className={`rounded-2xl p-6 border transition-all duration-300 ${isLocked
                                    ? "border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.01)] opacity-60"
                                    : isActive
                                        ? "border-[#FF6B35] bg-[rgba(255,107,53,0.05)]"
                                        : "border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] hover:border-[rgba(255,255,255,0.15)]"
                                    }`}
                                style={{ backdropFilter: "blur(20px)" }}
                            >
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold tracking-tight mb-2">
                                            {project.name}
                                        </h3>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span
                                                className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${getDifficultyColor(
                                                    project.difficulty
                                                )}`}
                                            >
                                                {project.difficulty}
                                            </span>
                                            <span className="flex items-center gap-1.5 text-xs text-[#A0A0A0]">
                                                <Clock size={14} strokeWidth={1.5} />
                                                {project.estimatedDuration}
                                            </span>
                                        </div>
                                    </div>
                                    {isActive && (
                                        <div className="px-3 py-1 rounded-lg bg-[#FF6B35] text-xs font-medium">
                                            Active
                                        </div>
                                    )}
                                </div>

                                {/* Description */}
                                <p className="text-sm text-[#A0A0A0] mb-4 leading-relaxed">
                                    {project.shortDescription}
                                </p>

                                {/* Skills */}
                                <div className="mb-6">
                                    <p className="text-xs font-medium text-[#A0A0A0] mb-2">Skills You'll Learn</p>
                                    <div className="flex flex-wrap gap-2">
                                        {project.skills.map((skill) => (
                                            <span
                                                key={skill}
                                                className="px-2.5 py-1 rounded-lg bg-[rgba(255,255,255,0.05)] text-xs text-[#FAFAFA]"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Action Button */}
                                {isLocked ? (
                                    <button
                                        disabled
                                        className="w-full py-3 rounded-xl bg-[rgba(255,255,255,0.03)] text-[#A0A0A0] text-sm font-medium flex items-center justify-center gap-2 cursor-not-allowed"
                                    >
                                        <Lock size={16} strokeWidth={1.5} />
                                        Locked — Finish current project
                                    </button>
                                ) : isActive ? (
                                    <LoadingButton
                                        onClick={() => navigate(`/projects/${project.projectId}`)}
                                        variant="primary"
                                        className="w-full"
                                    >
                                        Continue Project
                                        <ArrowRight size={18} strokeWidth={2} />
                                    </LoadingButton>
                                ) : (
                                    <LoadingButton
                                        onClick={() => handleStartProject(project)}
                                        variant="secondary"
                                        className="w-full"
                                    >
                                        Start Project
                                        <ArrowRight size={18} strokeWidth={2} />
                                    </LoadingButton>
                                )}
                            </motion.div>
                        );
                    })}
                </div>

            </div>

            {/* CONFIRMATION MODAL */}
            <AnimatePresence>
                {showModal && selectedProject && (
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
                            className="bg-[#0A0A0A] border border-[rgba(255,255,255,0.1)] rounded-2xl w-full max-w-md overflow-hidden"
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-6 border-b border-[rgba(255,255,255,0.08)]">
                                <h2 className="text-xl font-semibold">Start Project</h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="w-8 h-8 rounded-lg hover:bg-[rgba(255,255,255,0.05)] flex items-center justify-center transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6">
                                <div className="w-16 h-16 rounded-full bg-[rgba(255,107,53,0.1)] flex items-center justify-center mx-auto mb-4">
                                    <Award size={28} color="#FF6B35" strokeWidth={1.5} />
                                </div>
                                <h3 className="text-lg font-semibold text-center mb-2">
                                    {selectedProject.name}
                                </h3>
                                <p className="text-sm text-[#A0A0A0] text-center mb-6 leading-relaxed">
                                    You can work on only one project at a time. Starting this project will lock others until completion.
                                </p>

                                {/* Project Info */}
                                <div className="space-y-2 mb-6 p-4 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)]">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-[#A0A0A0]">Difficulty</span>
                                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getDifficultyColor(selectedProject.difficulty)}`}>
                                            {selectedProject.difficulty}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-[#A0A0A0]">Duration</span>
                                        <span className="text-white">{selectedProject.estimatedDuration}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-[#A0A0A0]">Skills</span>
                                        <span className="text-white">{selectedProject.skills.length} skills</span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowModal(false)}
                                        disabled={starting}
                                        className="flex-1 py-3 rounded-xl border border-[rgba(255,255,255,0.1)] text-sm font-medium hover:bg-[rgba(255,255,255,0.05)] transition-colors disabled:opacity-50 cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <LoadingButton
                                        onClick={confirmStartProject}
                                        loading={starting}
                                        loadingText="Starting..."
                                        variant="primary"
                                        className="flex-1"
                                    >
                                        Confirm & Start
                                    </LoadingButton>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
