import { useState, useEffect } from "react";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import {
    Github, Linkedin, Mail, Download, Calendar, Flame, Clock, TrendingUp,
    X, AlertCircle, ArrowRight, ChevronDown, ChevronUp, ExternalLink,
    Settings, Eye, EyeOff, Code, Award, CheckCircle2, Rocket, GitCommit, Share2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getProjectById, getMilestones, getAllProjects } from "../config/projects.config";
import { fetchGitHubActivity, formatDuration, formatDate, getTimeSinceSync } from "../services/github.service";
import EmptyState from "../components/EmptyState";
import LoadingButton from "../components/LoadingButton";
import { PageLoader, PortfolioSectionSkeleton, GitHubActivitySkeleton, InlineLoader } from "../components/SkeletonLoaders";
import { GitHubError } from "../components/ErrorMessage";
import { handleAuthError } from "../utils/authErrorHandler";
import { calculateWorkDisciplineMetrics, getActivityTimeline } from "../utils/activityTracking";
import { getUserByUsername, filterPublicUserData } from "../utils/publicPortfolio";
import SharePortfolioModal from "../components/SharePortfolioModal";
import ContactCandidateModal from "../components/ContactCandidateModal";
import { useSEO, getPortfolioSEO, trackPortfolioView } from "../utils/seo";
import { debugListAllUsernames } from "../utils/debug";
import { useAuth } from "../context/AuthContext";
import { generatePortfolioPDF } from "../utils/pdfExport";
import DetailedProjectCard from "../components/DetailedProjectCard";

export default function Portfolio() {
    const { username } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isOwner, setIsOwner] = useState(false);

    // First-time setup modal
    const [showSetupModal, setShowSetupModal] = useState(false);
    const [setupData, setSetupData] = useState({
        role: "",
        statement: "",
        github: "",
        linkedin: "",
    });
    const [setupError, setSetupError] = useState("");
    const [saving, setSaving] = useState(false);

    // Portfolio settings
    const [showSettings, setShowSettings] = useState(false);
    const [portfolioSettings, setPortfolioSettings] = useState({
        showWorkDiscipline: true,
        showActivityTimeline: true,
        allowPdfDownload: true,
        showEmail: false,
        hideLearningProjects: false,
        showCommitCounts: true,
        requireLoginForDetails: false,
        allowRecruiterContact: true, // Allow recruiters to contact via MadeIt
    });

    // UI state
    const [expandedProjects, setExpandedProjects] = useState({});
    const [showAllSkills, setShowAllSkills] = useState(false);
    const [selectedSkill, setSelectedSkill] = useState(null);

    // GitHub activity
    const [githubActivity, setGithubActivity] = useState(null);
    const [githubLoading, setGithubLoading] = useState(false);
    const [githubError, setGithubError] = useState(null);

    // Work discipline metrics
    const [workMetrics, setWorkMetrics] = useState({
        totalActiveDays: 0,
        currentStreak: 0,
        longestStreak: 0,
        timeline: [],
        lastActiveFormatted: 'Never',
        avgDaysPerMilestone: 0
    });

    // Share modal
    const [showShareModal, setShowShareModal] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);
    const [generatingPDF, setGeneratingPDF] = useState(false);

    // Portfolio not found
    const [portfolioNotFound, setPortfolioNotFound] = useState(false);

    // ---- FETCH USER DATA ----
    useEffect(() => {
        const fetchUserData = async () => {
            // PUBLIC PORTFOLIO VIEW (username in URL, no auth required)
            if (!user && username) {
                console.log('🌐 PUBLIC PORTFOLIO MODE');
                console.log('📍 Username from URL:', username);
                console.log('🔓 User auth state:', user ? 'Logged in' : 'Not logged in');

                try {
                    console.log('🔍 Fetching user by username:', username);
                    const publicUser = await getUserByUsername(username);

                    if (!publicUser) {
                        console.log('❌ No user found with username:', username);
                        setPortfolioNotFound(true);
                        setLoading(false);
                        return;
                    }

                    console.log('✅ User found:', publicUser.uid);
                    console.log('📦 User data keys:', Object.keys(publicUser));

                    // Filter sensitive data for public view
                    const filteredData = filterPublicUserData(publicUser);
                    console.log('🔒 Data filtered for public view');

                    setUserData(filteredData);
                    setIsOwner(false);
                    console.log('✅ Public portfolio loaded successfully');
                } catch (error) {
                    console.error("❌ Error fetching public portfolio:", error);
                    console.error("Error code:", error.code);
                    console.error("Error message:", error.message);

                    if (error.code === 'permission-denied') {
                        console.error('🔒 PERMISSION DENIED - Check Firestore Security Rules!');
                    } else if (error.code === 'unavailable') {
                        console.error('🌐 FIREBASE UNAVAILABLE - Check internet connection and Firebase config');
                    }

                    setPortfolioNotFound(true);
                } finally {
                    setLoading(false);
                }
                return;
            }

            // No user and no username - redirect to home
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

                    setUserData(data);

                    // Check if viewing own portfolio via username URL
                    if (username) {
                        setIsOwner(data.profile?.username?.toLowerCase() === username.toLowerCase());
                    } else {
                        setIsOwner(true);
                    }

                    // Load portfolio settings
                    if (data.portfolio?.settings) {
                        setPortfolioSettings(prev => ({
                            ...prev,
                            ...data.portfolio.settings
                        }));
                    }

                    if (!data.portfolio?.setupCompleted) {
                        checkAndShowSetupModal(data);
                    }
                } else {
                    navigate("/profile-setup");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);

                // Handle auth errors (session expired, permission denied, etc.)
                const handled = await handleAuthError(error, navigate, {
                    preserveLocation: true,
                    showMessage: true
                });

                if (!handled) {
                    // Not an auth error, show generic error
                    // User will see empty state or can retry by refreshing
                    console.error("Failed to load portfolio data");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [user, username, navigate]);

    // ---- FETCH GITHUB ACTIVITY ----
    useEffect(() => {
        const loadGitHubActivity = async () => {
            if (!userData?.activeProject?.id) return;

            setGithubLoading(true);
            setGithubError(null);

            try {
                const projects = [];

                // Add active project if it has a GitHub repo
                if (userData.activeProject.githubRepo) {
                    const projectConfig = getProjectById(userData.activeProject.id);
                    if (projectConfig) {
                        projects.push({
                            projectId: userData.activeProject.id,
                            name: projectConfig.name,
                            githubRepo: userData.activeProject.githubRepo,
                            status: 'ongoing'
                        });
                    }
                }

                if (projects.length > 0) {
                    const activity = await fetchGitHubActivity(projects);
                    setGithubActivity(activity);

                    // Cache the data in localStorage
                    localStorage.setItem('githubActivity', JSON.stringify(activity));
                } else {
                    setGithubActivity(null);
                }
            } catch (error) {
                console.error('Error fetching GitHub activity:', error);
                setGithubError(error.message);

                // Try to load cached data
                const cached = localStorage.getItem('githubActivity');
                if (cached) {
                    setGithubActivity(JSON.parse(cached));
                }
            } finally {
                setGithubLoading(false);
            }
        };

        loadGitHubActivity();
    }, [userData]);

    // ---- RETRY GITHUB ACTIVITY ----
    const retryGitHubActivity = async () => {
        if (!userData?.activeProject?.id) return;

        setGithubLoading(true);
        setGithubError(null);

        try {
            const projects = [];

            if (userData.activeProject.githubRepo) {
                const projectConfig = getProjectById(userData.activeProject.id);
                if (projectConfig) {
                    projects.push({
                        projectId: userData.activeProject.id,
                        name: projectConfig.name,
                        githubRepo: userData.activeProject.githubRepo,
                        status: 'ongoing'
                    });
                }
            }

            if (projects.length > 0) {
                const activity = await fetchGitHubActivity(projects);
                setGithubActivity(activity);
                localStorage.setItem('githubActivity', JSON.stringify(activity));
            }
        } catch (error) {
            console.error('Error fetching GitHub activity:', error);
            setGithubError(error.message);
        } finally {
            setGithubLoading(false);
        }
    };

    // ---- CALCULATE WORK DISCIPLINE METRICS ----
    useEffect(() => {
        if (!userData) return;

        // Calculate all metrics from activity events
        const metrics = calculateWorkDisciplineMetrics(userData);
        setWorkMetrics(metrics);
    }, [userData, githubActivity]); // Recalculate when userData or GitHub activity changes

    // ---- HANDLE PDF DOWNLOAD ----
    const handleDownloadPDF = async () => {
        if (!userData) return;

        setGeneratingPDF(true);

        try {
            // Get all completed projects
            const allProjects = getAllProjects();
            const completedProjects = allProjects.filter(project => {
                const userProject = userData.projects?.[project.id];
                return userProject?.completed && !project.isDraft;
            }).map(project => ({
                ...project,
                ...userData.projects[project.id],
                milestones: getMilestones(project.id).filter(m =>
                    userData.projects?.[project.id]?.milestones?.[m.id]?.completed
                )
            }));

            // Extract skills from completed projects
            const skills = new Set();
            completedProjects.forEach(project => {
                if (project.techStack) {
                    project.techStack.forEach(tech => skills.add(tech));
                }
            });

            // Generate PDF
            generatePortfolioPDF(
                userData,
                completedProjects,
                Array.from(skills),
                workMetrics
            );

        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF. Please try again.');
        } finally {
            setGeneratingPDF(false);
        }
    };

    // ---- SEO & ANALYTICS ----
    // Generate SEO config based on userData
    const isPublic = portfolioSettings.publicPortfolio !== false; // Default to true
    const seoConfig = userData
        ? getPortfolioSEO(userData, username || userData.profile?.username, isPublic)
        : {};

    // Apply SEO meta tags
    useSEO(seoConfig);

    // Track portfolio view (public portfolios only)
    useEffect(() => {
        if (userData && !isOwner && username) {
            trackPortfolioView(username);
        }
    }, [userData, isOwner, username]);

    // ---- CHECK IF SETUP MODAL SHOULD SHOW ----
    const checkAndShowSetupModal = (data) => {
        const hasBothSocials = data.socials?.github && data.socials?.linkedin;

        if (hasBothSocials) {
            setSetupData({
                role: data.portfolio?.role || "",
                statement: data.portfolio?.statement || "",
                github: data.socials?.github || "",
                linkedin: data.socials?.linkedin || "",
            });
        } else {
            setSetupData({
                role: "",
                statement: "",
                github: data.socials?.github || "",
                linkedin: data.socials?.linkedin || "",
            });
        }

        setShowSetupModal(true);
    };

    // ---- VALIDATE SETUP DATA ----
    const validateSetupData = () => {
        if (!setupData.role.trim()) {
            setSetupError("Role/Title is required");
            return false;
        }

        if (!setupData.statement.trim()) {
            setSetupError("Personal statement is required");
            return false;
        }

        const hasBothSocials = userData?.socials?.github && userData?.socials?.linkedin;

        if (!hasBothSocials) {
            if (!setupData.github.trim()) {
                setSetupError("GitHub link is required");
                return false;
            }

            if (!setupData.linkedin.trim()) {
                setSetupError("LinkedIn link is required");
                return false;
            }

            if (!setupData.github.includes("github.com")) {
                setSetupError("Please enter a valid GitHub URL");
                return false;
            }

            if (!setupData.linkedin.includes("linkedin.com")) {
                setSetupError("Please enter a valid LinkedIn URL");
                return false;
            }
        }

        return true;
    };

    // ---- SAVE PORTFOLIO SETUP ----
    const handleSaveSetup = async () => {
        if (!validateSetupData()) return;

        setSaving(true);
        try {
            const userRef = doc(db, "users", user.uid);

            const updateData = {
                "portfolio.setupCompleted": true,
                "portfolio.role": setupData.role.trim(),
                "portfolio.statement": setupData.statement.trim(),
            };

            const hasBothSocials = userData?.socials?.github && userData?.socials?.linkedin;
            if (!hasBothSocials) {
                updateData["socials.github"] = setupData.github.trim();
                updateData["socials.linkedin"] = setupData.linkedin.trim();
            }

            await updateDoc(userRef, updateData);

            setUserData(prev => ({
                ...prev,
                portfolio: {
                    ...prev.portfolio,
                    setupCompleted: true,
                    role: setupData.role.trim(),
                    statement: setupData.statement.trim(),
                },
                socials: {
                    ...prev.socials,
                    ...((!hasBothSocials) && {
                        github: setupData.github.trim(),
                        linkedin: setupData.linkedin.trim(),
                    }),
                },
            }));

            setShowSetupModal(false);
        } catch (error) {
            console.error("Error saving portfolio setup:", error);
            setSetupError("Failed to save. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    // ---- SAVE PORTFOLIO SETTINGS ----
    const handleSaveSettings = async (newSettings) => {
        try {
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
                "portfolio.settings": newSettings
            });

            setUserData(prev => ({
                ...prev,
                portfolio: {
                    ...prev.portfolio,
                    settings: newSettings
                }
            }));

            setPortfolioSettings(newSettings);
        } catch (error) {
            console.error("Error saving settings:", error);
        }
    };

    // ---- CALCULATE STATS ----
    const calculateStats = () => {
        const completedProjects = userData?.completedProjects?.length || 0;
        const activeDays = userData?.activeProject?.startedAt
            ? Math.floor((new Date() - new Date(userData.activeProject.startedAt)) / (1000 * 60 * 60 * 24)) + 1
            : 0;

        const lastUpdated = userData?.activeProject?.completedTasks?.length > 0
            ? "Today"
            : activeDays > 0 ? `${activeDays}d` : "Never";

        return {
            projectsCompleted: completedProjects,
            activeDays,
            lastUpdated,
        };
    };

    // ---- GET SKILLS FROM COMPLETED MILESTONES ONLY ----
    const getSkills = () => {
        const skillsMap = new Map(); // skill -> { category, projects: Set }

        // Check if user has active project
        if (!userData?.activeProject?.id) {
            return {
                frontend: [],
                backend: [],
                tools: [],
                skillsMap: new Map()
            };
        }

        const project = getProjectById(userData.activeProject.id);
        if (!project) {
            return {
                frontend: [],
                backend: [],
                tools: [],
                skillsMap: new Map()
            };
        }

        const milestones = getMilestones(userData.activeProject.id);
        const completedTasks = userData.activeProject.completedTasks || [];
        const completedMilestones = userData.activeProject.completedMilestones || [];

        // Check each milestone for completion
        milestones.forEach(milestone => {
            let isMilestoneCompleted = false;

            // Check if milestone is completed (two ways to determine this):
            // 1. For owner view: Check if all tasks in milestone are completed
            if (completedTasks.length > 0) {
                const milestoneTasks = milestone.tasks.map(t => `${milestone.milestoneId}-${t.taskId}`);
                const completedMilestoneTasks = milestoneTasks.filter(taskId => completedTasks.includes(taskId));
                isMilestoneCompleted = completedMilestoneTasks.length === milestoneTasks.length && milestoneTasks.length > 0;
            }

            // 2. For public view: Check if milestone ID is in completedMilestones array
            if (!isMilestoneCompleted && completedMilestones.length > 0) {
                isMilestoneCompleted = completedMilestones.includes(milestone.milestoneId);
            }

            // Only add skills if milestone is completed
            if (isMilestoneCompleted) {
                // Get skills from this completed milestone
                const milestoneSkills = milestone.skills || project.skills || [];

                milestoneSkills.forEach(skill => {
                    if (!skillsMap.has(skill)) {
                        const lower = skill.toLowerCase();
                        let category = 'tools';

                        if (['react', 'javascript', 'html5', 'html', 'css3', 'css', 'tailwind', 'bootstrap', 'vue', 'angular', 'typescript', 'jsx', 'sass', 'scss'].some(s => lower.includes(s))) {
                            category = 'frontend';
                        } else if (['node', 'express', 'mongodb', 'sql', 'mysql', 'postgresql', 'python', 'django', 'flask', 'php', 'laravel', 'api', 'rest', 'graphql'].some(s => lower.includes(s))) {
                            category = 'backend';
                        }

                        skillsMap.set(skill, {
                            category,
                            projects: new Set([project.name])
                        });
                    } else {
                        skillsMap.get(skill).projects.add(project.name);
                    }
                });
            }
        });

        // Categorize skills
        const categorized = {
            frontend: [],
            backend: [],
            tools: []
        };

        skillsMap.forEach((data, skill) => {
            categorized[data.category].push({
                name: skill,
                projectCount: data.projects.size,
                projects: Array.from(data.projects)
            });
        });

        return {
            frontend: categorized.frontend,
            backend: categorized.backend,
            tools: categorized.tools,
        };
    };

    // ---- GET PROJECTS ----
    const getProjects = () => {
        const projects = [];

        // Add active project if exists
        if (userData?.activeProject?.id) {
            const projectConfig = getProjectById(userData.activeProject.id);
            if (projectConfig) {
                const milestones = getMilestones(userData.activeProject.id);
                const completedMilestones = userData.activeProject.completedMilestones || [];

                // Calculate progress
                const totalMilestones = milestones.length;
                const completedCount = completedMilestones.length;
                const progress = totalMilestones > 0 ? Math.round((completedCount / totalMilestones) * 100) : 0;

                // Get tech stack from completed milestones
                const techStack = new Set();
                milestones.forEach(milestone => {
                    if (milestone.skills) {
                        milestone.skills.forEach(skill => techStack.add(skill));
                    }
                });

                projects.push({
                    ...projectConfig,
                    id: userData.activeProject.id,
                    name: projectConfig.name,
                    category: projectConfig.category,
                    description: projectConfig.overview,
                    githubRepo: userData.activeProject.githubRepo,
                    liveUrl: userData.activeProject.liveUrl,
                    startedAt: userData.activeProject.startedAt,
                    completedAt: userData.activeProject.completedAt,
                    progress,
                    milestones: milestones.map(m => ({
                        id: m.milestoneId,
                        name: m.title,
                        tasks: m.tasks
                    })),
                    completedMilestones,
                    completedTasks: userData.activeProject.completedTasks || [],
                    submissions: userData.activeProject.submissions || {},
                    techStack: Array.from(techStack),
                    verified: userData.activeProject.verified || false
                });
            }
        }

        return projects;
    };

    // ---- TOGGLE PROJECT EXPANSION ----
    const toggleProject = (projectId) => {
        setExpandedProjects(prev => ({
            ...prev,
            [projectId]: !prev[projectId]
        }));
    };

    // ---- LOADING STATE ----
    if (loading) {
        return <PageLoader message="Loading portfolio..." />;
    }

    // ---- PORTFOLIO NOT FOUND ----
    if (portfolioNotFound) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] text-white p-4">
                <div className="max-w-md w-full text-center">
                    <div className="w-16 h-16 rounded-full bg-[rgba(255,107,53,0.1)] flex items-center justify-center mx-auto mb-6">
                        <AlertCircle size={32} className="text-[#FF6B35]" />
                    </div>
                    <h1 className="text-2xl font-semibold mb-3">
                        Portfolio Not Found
                    </h1>
                    <p className="text-[#A0A0A0] mb-8">
                        The portfolio you're looking for doesn't exist or has been removed.
                    </p>
                    <button
                        onClick={() => navigate("/")}
                        className="px-6 py-3 rounded-xl bg-[#FF6B35] text-white text-sm font-medium hover:bg-[#FF6B35]/90 transition-colors inline-flex items-center gap-2"
                    >
                        <ArrowRight size={18} className="rotate-180" />
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    if (!userData) return null;

    const stats = calculateStats();
    const skills = getSkills();
    const projects = getProjects();
    const hasBothSocials = userData?.socials?.github && userData?.socials?.linkedin;

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white">
            {/* HERO SECTION - ABOVE THE FOLD */}
            <div className="border-b border-[rgba(255,255,255,0.08)]  top-0 bg-[#0A0A0A] z-40 md:static">
                <div className="max-w-5xl mx-auto px-4 py-8 md:py-16">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
                        {/* Profile Photo */}
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-[rgba(255,255,255,0.1)] flex-shrink-0">
                            {userData.profile?.photoURL ? (
                                <img src={userData.profile.photoURL} alt={userData.profile.fullName} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-[rgba(255,107,53,0.2)] flex items-center justify-center text-[#FF6B35] font-bold text-2xl md:text-3xl">
                                    {userData.profile?.fullName?.split(" ").map(n => n[0]).join("").toUpperCase()}
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 text-center md:text-left w-full">
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                                        {userData.profile?.fullName || "User"}
                                    </h1>
                                    <p className="text-lg md:text-xl text-[#FF6B35] mb-3">
                                        {userData.portfolio?.role || "Developer"}
                                    </p>
                                </div>
                                {isOwner && (
                                    <button
                                        onClick={() => setShowSettings(true)}
                                        className="ml-4 p-2 rounded-lg hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                                    >
                                        <Settings size={20} />
                                    </button>
                                )}
                            </div>

                            <p className="text-[#A0A0A0] max-w-2xl mb-4 md:mb-6">
                                {userData.portfolio?.statement || "Building real projects and learning by doing."}
                            </p>

                            {/* Stats */}
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 md:gap-4 text-sm mb-4 md:mb-6">
                                <div className="flex items-center gap-2">
                                    <Award size={16} className="text-[#FF6B35]" />
                                    <span className="font-semibold">{stats.projectsCompleted}</span>
                                    <span className="text-[#A0A0A0]">Projects</span>
                                </div>
                                <span className="text-[#A0A0A0]">•</span>
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} className="text-[#FF6B35]" />
                                    <span className="font-semibold">{stats.activeDays}</span>
                                    <span className="text-[#A0A0A0]">Active Days</span>
                                </div>
                                <span className="text-[#A0A0A0]">•</span>
                                <div className="flex items-center gap-2">
                                    <Clock size={16} className="text-[#FF6B35]" />
                                    <span className="text-[#A0A0A0]">Updated {stats.lastUpdated}</span>
                                </div>
                            </div>

                            {/* Quick Links */}
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                {userData.socials?.github && (
                                    <a
                                        href={userData.socials.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-2 rounded-lg border border-[rgba(255,255,255,0.1)] text-sm font-medium flex items-center gap-2 hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                                    >
                                        <Github size={16} />
                                        GitHub
                                    </a>
                                )}
                                {userData.socials?.linkedin && (
                                    <a
                                        href={userData.socials.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-2 rounded-lg border border-[rgba(255,255,255,0.1)] text-sm font-medium flex items-center gap-2 hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                                    >
                                        <Linkedin size={16} />
                                        LinkedIn
                                    </a>
                                )}
                                {portfolioSettings.allowPdfDownload && (
                                    <button
                                        onClick={handleDownloadPDF}
                                        disabled={generatingPDF}
                                        className="px-4 py-2 rounded-lg bg-[#FF6B35] text-white text-sm font-medium flex items-center gap-2 hover:bg-[#FF6B35]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Download size={16} />
                                        {generatingPDF ? 'Generating PDF...' : 'Download PDF'}
                                    </button>
                                )}
                                {isOwner && (
                                    <button
                                        onClick={() => setShowShareModal(true)}
                                        className="px-4 py-2 rounded-lg border border-[rgba(255,255,255,0.1)] text-sm font-medium flex items-center gap-2 hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                                    >
                                        <Share2 size={16} />
                                        Share Portfolio
                                    </button>
                                )}
                                {!isOwner && portfolioSettings.allowRecruiterContact && (
                                    <button
                                        onClick={() => setShowContactModal(true)}
                                        className="px-4 py-2 rounded-lg bg-[#FF6B35] text-white text-sm font-medium flex items-center gap-2 hover:bg-[#FF6B35]/90 transition-colors"
                                    >
                                        <Mail size={16} />
                                        Contact Candidate
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
                {/* SKILLS SECTION */}
                <section className="mb-12 md:mb-16">
                    <h2 className="text-2xl font-semibold tracking-tight mb-6">Skills Proven Through Work</h2>

                    {(skills.frontend.length === 0 && skills.backend.length === 0 && skills.tools.length === 0) ? (
                        <EmptyState
                            icon={Code}
                            title="No Skills Unlocked Yet"
                            description="Complete milestones in your projects to unlock and showcase skills you've proven through real work."
                            actionLabel={isOwner ? "Start Building" : undefined}
                            onAction={isOwner ? () => navigate("/projects") : undefined}
                        />
                    ) : (
                        <div className="space-y-4">
                            {skills.frontend.length > 0 && (
                                <div>
                                    <p className="text-sm text-[#A0A0A0] mb-2">Frontend</p>
                                    <div className="flex flex-wrap gap-2">
                                        {skills.frontend.slice(0, showAllSkills ? undefined : 8).map(skill => (
                                            <button
                                                key={skill.name}
                                                onClick={() => {
                                                    setSelectedSkill(skill.name);
                                                    document.getElementById('projects-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                                }}
                                                className="px-3 py-1.5 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] text-sm hover:border-[#FF6B35] hover:bg-[rgba(255,107,53,0.1)] transition-colors cursor-pointer"
                                            >
                                                {skill.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {skills.backend.length > 0 && (
                                <div>
                                    <p className="text-sm text-[#A0A0A0] mb-2">Backend</p>
                                    <div className="flex flex-wrap gap-2">
                                        {skills.backend.slice(0, showAllSkills ? undefined : 8).map(skill => (
                                            <button
                                                key={skill.name}
                                                onClick={() => {
                                                    setSelectedSkill(skill.name);
                                                    document.getElementById('projects-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                                }}
                                                className="px-3 py-1.5 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] text-sm hover:border-[#FF6B35] hover:bg-[rgba(255,107,53,0.1)] transition-colors cursor-pointer"
                                            >
                                                {skill.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {skills.tools.length > 0 && (
                                <div>
                                    <p className="text-sm text-[#A0A0A0] mb-2">Tools & Workflow</p>
                                    <div className="flex flex-wrap gap-2">
                                        {skills.tools.slice(0, showAllSkills ? undefined : 8).map(skill => (
                                            <button
                                                key={skill.name}
                                                onClick={() => {
                                                    setSelectedSkill(skill.name);
                                                    document.getElementById('projects-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                                }}
                                                className="px-3 py-1.5 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] text-sm hover:border-[#FF6B35] hover:bg-[rgba(255,107,53,0.1)] transition-colors cursor-pointer"
                                            >
                                                {skill.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {!showAllSkills && (skills.frontend.length + skills.backend.length + skills.tools.length > 24) && (
                                <button
                                    onClick={() => setShowAllSkills(true)}
                                    className="text-sm text-[#FF6B35] hover:underline flex items-center gap-2"
                                >
                                    View all skills
                                    <ChevronDown size={16} />
                                </button>
                            )}
                        </div>
                    )}
                </section>

                {/* PROJECTS SECTION */}
                <section id="projects-section" className="mb-12 md:mb-16 scroll-mt-20">
                    <h2 className="text-2xl font-semibold tracking-tight mb-6">
                        {isOwner ? 'Projects' : 'Completed Projects'} ({projects.length})
                    </h2>

                    {projects.length === 0 ? (
                        <EmptyState
                            icon={Rocket}
                            title="No Projects Started Yet"
                            description="Your portfolio will showcase real projects you build. Start your first project to begin your journey."
                            actionLabel={isOwner ? "Choose a Project" : undefined}
                            onAction={isOwner ? () => navigate("/projects") : undefined}
                        />
                    ) : (
                        <div className="space-y-6">
                            {projects.map(project => (
                                <DetailedProjectCard
                                    key={project.id || project.projectId}
                                    project={project}
                                    isOwner={isOwner}
                                    onSubmitMilestone={(milestone) => {
                                        // Navigate to project page to submit milestone
                                        navigate(`/project/${project.id}`);
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </section>

                {/* WORK DISCIPLINE SECTION */}
                {portfolioSettings.showWorkDiscipline && (
                    <section className="mb-12 md:mb-16">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-semibold tracking-tight">Work Discipline</h2>
                            {isOwner && (
                                <button
                                    onClick={() => handleSaveSettings({ ...portfolioSettings, showWorkDiscipline: false })}
                                    className="text-sm text-[#A0A0A0] hover:text-white flex items-center gap-2"
                                >
                                    <EyeOff size={16} />
                                    Hide Section
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="p-6 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)]">
                                <div className="flex items-center gap-2 mb-2">
                                    <Calendar size={16} className="text-[#FF6B35]" />
                                    <p className="text-xs text-[#A0A0A0]">Active Days</p>
                                </div>
                                <p className="text-2xl font-semibold">{workMetrics.totalActiveDays}</p>
                            </div>

                            <div className="p-6 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)]">
                                <div className="flex items-center gap-2 mb-2">
                                    <Flame size={16} className="text-[#FF6B35]" />
                                    <p className="text-xs text-[#A0A0A0]">Longest Streak</p>
                                </div>
                                <p className="text-2xl font-semibold">{workMetrics.longestStreak}</p>
                            </div>

                            <div className="p-6 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)]">
                                <div className="flex items-center gap-2 mb-2">
                                    <TrendingUp size={16} className="text-[#FF6B35]" />
                                    <p className="text-xs text-[#A0A0A0]">Avg Pace</p>
                                </div>
                                <p className="text-2xl font-semibold">
                                    {workMetrics.avgDaysPerMilestone > 0
                                        ? `${workMetrics.avgDaysPerMilestone}d/m`
                                        : '-'}
                                </p>
                            </div>

                            <div className="p-6 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)]">
                                <div className="flex items-center gap-2 mb-2">
                                    <Clock size={16} className="text-[#FF6B35]" />
                                    <p className="text-xs text-[#A0A0A0]">Last Active</p>
                                </div>
                                <p className="text-2xl font-semibold">{workMetrics.lastActiveFormatted}</p>
                            </div>
                        </div>
                    </section>
                )}

                {/* ACTIVITY TIMELINE */}
                {portfolioSettings.showActivityTimeline && (
                    <section className="mb-12 md:mb-16">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-semibold tracking-tight">Activity Timeline</h2>
                            {isOwner && (
                                <button
                                    onClick={() => handleSaveSettings({ ...portfolioSettings, showActivityTimeline: false })}
                                    className="text-sm text-[#A0A0A0] hover:text-white flex items-center gap-2"
                                >
                                    <EyeOff size={16} />
                                    Hide Section
                                </button>
                            )}
                        </div>

                        <div className="space-y-3">
                            {workMetrics.totalActiveDays === 0 ? (
                                <div className="text-center py-8 px-4 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)]">
                                    <p className="text-[#A0A0A0]">No activity yet</p>
                                </div>
                            ) : (
                                <>
                                    {workMetrics.timeline.map((month, index) => (
                                        <div key={index} className="flex items-center gap-4">
                                            <span className="text-sm text-[#A0A0A0] w-24">{month.month}</span>
                                            <div className="flex-1 h-8 bg-[rgba(255,255,255,0.05)] rounded-lg overflow-hidden">
                                                <div
                                                    className="h-full bg-[#FF6B35] transition-all duration-500"
                                                    style={{ width: `${month.percentage}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm text-white w-16 text-right">
                                                {month.activeDays} {month.activeDays === 1 ? 'day' : 'days'}
                                            </span>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    </section>
                )}

                {/* GITHUB ACTIVITY SECTION */}
                <section className="mb-12 md:mb-16">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-semibold tracking-tight">GitHub Activity</h2>
                        {githubActivity?.lastSynced && (
                            <span className="text-xs text-[#A0A0A0]">
                                Last synced: {getTimeSinceSync(githubActivity.lastSynced)}
                            </span>
                        )}
                    </div>

                    {githubLoading ? (
                        <InlineLoader message="Fetching GitHub activity..." />
                    ) : githubError ? (
                        <GitHubError
                            error={githubError}
                            onRetry={retryGitHubActivity}
                            retrying={githubLoading}
                        />
                    ) : (!githubActivity || !githubActivity.projects || githubActivity.projects.length === 0) ? (
                        <EmptyState
                            icon={GitCommit}
                            title="No GitHub Activity Yet"
                            description="Connect your GitHub repository and start making commits to track your development activity here."
                            actionLabel={isOwner && !userData?.activeProject?.githubRepo ? "Start a Project" : undefined}
                            onAction={isOwner && !userData?.activeProject?.githubRepo ? () => navigate("/projects") : undefined}
                        >
                            {isOwner && userData?.activeProject?.githubRepo && (
                                <p className="text-sm text-[#A0A0A0] mt-4">
                                    Make your first commit to see activity here
                                </p>
                            )}
                        </EmptyState>
                    ) : (
                        <>
                            {/* GitHub Profile Link */}
                            {userData.socials?.github && (
                                <div className="mb-6">
                                    <a
                                        href={userData.socials.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-[#FF6B35] hover:underline flex items-center gap-2"
                                    >
                                        <Github size={16} />
                                        {userData.socials.github.replace('https://', '')}
                                        <ExternalLink size={14} />
                                    </a>
                                </div>
                            )}

                            {/* MadeIt Projects */}
                            <div className="mb-6">
                                <h3 className="text-sm font-medium text-[#A0A0A0] mb-4">MadeIt Projects:</h3>
                                <div className="space-y-3">
                                    {githubActivity.projects.map((project) => (
                                        <div
                                            key={project.projectId}
                                            className="flex items-start gap-3 p-4 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)]"
                                        >
                                            <div className="flex-shrink-0 mt-1">
                                                <Code size={16} className="text-[#FF6B35]" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-4 mb-2">
                                                    <div className="flex-1">
                                                        <h4 className="font-medium text-white mb-1">{project.repo}</h4>
                                                        <p className="text-xs text-[#A0A0A0]">{project.projectName}</p>
                                                    </div>
                                                    <div className={`px-2 py-1 rounded text-xs font-medium flex-shrink-0 ${project.status === 'completed'
                                                        ? 'bg-green-500/10 text-green-400'
                                                        : 'bg-blue-500/10 text-blue-400'
                                                        }`}>
                                                        {project.status === 'completed' ? 'Completed' : 'Ongoing'}
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#A0A0A0]">
                                                    <span className="flex items-center gap-1">
                                                        <strong className="text-white">{project.totalCommits}</strong> commits
                                                    </span>
                                                    <span>•</span>
                                                    <span>{formatDuration(project.durationWeeks)}</span>
                                                    {project.firstCommitDate && (
                                                        <>
                                                            <span>•</span>
                                                            <span className="text-xs">
                                                                {formatDate(project.firstCommitDate)} → {formatDate(project.lastCommitDate)}
                                                            </span>
                                                        </>
                                                    )}
                                                </div>

                                                {/* Owner-only: Red flags warning */}
                                                {isOwner && project.redFlags && project.redFlags.length > 0 && (
                                                    <div className="mt-3 p-2 rounded bg-yellow-500/10 border border-yellow-500/20">
                                                        <p className="text-xs text-yellow-400 flex items-center gap-2">
                                                            <AlertCircle size={12} />
                                                            Quality check: {project.redFlags.join(', ').replace(/_/g, ' ')}
                                                        </p>
                                                    </div>
                                                )}

                                                {/* Owner-only: Detailed stats */}
                                                {isOwner && (
                                                    <div className="mt-3 pt-3 border-t border-[rgba(255,255,255,0.08)] text-xs text-[#A0A0A0] space-y-1">
                                                        <p>Active days: {project.activeDays}</p>
                                                        <p>Avg: {project.commitsPerDay} commits/day · {project.commitsPerWeek} commits/week</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Aggregated Stats */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)]">
                                    <p className="text-xs text-[#A0A0A0] mb-1">Total Commits</p>
                                    <p className="text-2xl font-semibold text-white">{githubActivity.totalCommits}</p>
                                </div>
                                <div className="p-4 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)]">
                                    <p className="text-xs text-[#A0A0A0] mb-1">Avg Commit Frequency</p>
                                    <p className="text-2xl font-semibold text-white">{githubActivity.avgCommitsPerWeek}/week</p>
                                </div>
                            </div>

                            {/* Error display for owner */}
                            {isOwner && githubActivity.errors && githubActivity.errors.length > 0 && (
                                <div className="mt-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                                    <p className="text-sm text-red-400 mb-2 flex items-center gap-2">
                                        <AlertCircle size={16} />
                                        GitHub API Errors:
                                    </p>
                                    <ul className="text-xs text-red-300 space-y-1">
                                        {githubActivity.errors.map((err, idx) => (
                                            <li key={idx}>• {err.projectId}: {err.error}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </>
                    )}
                </section>

                {/* Loading state for GitHub */}
                {githubLoading && (
                    <section className="mb-12 md:mb-16">
                        <h2 className="text-2xl font-semibold tracking-tight mb-6">GitHub Activity</h2>
                        <div className="flex items-center justify-center py-12">
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-8 h-8 border-2 border-[#FF6B35] border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-sm text-[#A0A0A0]">Fetching GitHub activity...</p>
                            </div>
                        </div>
                    </section>
                )}

                {/* Error state for GitHub (cached data fallback) */}
                {githubError && !githubActivity && (
                    <section className="mb-12 md:mb-16">
                        <h2 className="text-2xl font-semibold tracking-tight mb-6">GitHub Activity</h2>
                        <div className="p-6 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] text-center">
                            <AlertCircle size={24} className="mx-auto mb-3 text-[#A0A0A0]" />
                            <p className="text-sm text-[#A0A0A0]">Unable to load GitHub activity</p>
                            {isOwner && (
                                <p className="text-xs text-red-400 mt-2">{githubError}</p>
                            )}
                        </div>
                    </section>
                )}
            </div>

            {/* FOOTER */}
            <div className="border-t border-[rgba(255,255,255,0.08)] py-8">
                <div className="max-w-5xl mx-auto px-4 text-center">
                    <p className="text-sm text-[#A0A0A0] mb-2">
                        Built on MadeIt · Portfolio auto-generated from real work
                    </p>
                    <p className="text-xs text-[#A0A0A0] mb-4">
                        Last updated: {stats.lastUpdated}
                    </p>
                    <div className="flex items-center justify-center gap-4 text-xs text-[#A0A0A0]">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <span>•</span>
                        <a href="#" className="hover:text-white transition-colors">Report Issue</a>
                        <span>•</span>
                        <a href="https://madeit-app.vercel.app/" target="_blank" className="hover:text-white transition-colors">MadeIt</a>
                    </div>
                </div>
            </div>

            {/* SETUP MODAL */}
            <AnimatePresence>
                {showSetupModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="bg-[#0A0A0A] border border-[rgba(255,255,255,0.1)] rounded-2xl w-full max-w-2xl overflow-hidden"
                        >
                            <div className="p-6 border-b border-[rgba(255,255,255,0.08)]">
                                <h2 className="text-2xl font-semibold mb-2">Complete Your Portfolio</h2>
                                <p className="text-sm text-[#A0A0A0]">
                                    {hasBothSocials
                                        ? "Add a few details to make your portfolio shareable"
                                        : "These details are required to make your portfolio shareable"}
                                </p>
                            </div>

                            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                                <div>
                                    <label className="text-sm font-medium flex items-center gap-2 mb-2">
                                        Role / Title
                                        <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={setupData.role}
                                        onChange={(e) => {
                                            setSetupData(prev => ({ ...prev, role: e.target.value }));
                                            setSetupError("");
                                        }}
                                        placeholder="e.g., Full Stack Developer, Frontend Engineer"
                                        className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] text-white outline-none focus:border-[#FF6B35] transition-colors text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium flex items-center gap-2 mb-2">
                                        Personal Statement
                                        <span className="text-red-400">*</span>
                                    </label>
                                    <textarea
                                        value={setupData.statement}
                                        onChange={(e) => {
                                            setSetupData(prev => ({ ...prev, statement: e.target.value }));
                                            setSetupError("");
                                        }}
                                        placeholder="1-2 lines about yourself and what you're building..."
                                        rows={3}
                                        className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] text-white outline-none focus:border-[#FF6B35] transition-colors text-sm resize-none"
                                    />
                                </div>

                                {!hasBothSocials && (
                                    <>
                                        <div>
                                            <label className="text-sm font-medium flex items-center gap-2 mb-2">
                                                GitHub Link
                                                <span className="text-red-400">*</span>
                                            </label>
                                            <input
                                                type="url"
                                                value={setupData.github}
                                                onChange={(e) => {
                                                    setSetupData(prev => ({ ...prev, github: e.target.value }));
                                                    setSetupError("");
                                                }}
                                                placeholder="https://github.com/yourusername"
                                                className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] text-white outline-none focus:border-[#FF6B35] transition-colors text-sm"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium flex items-center gap-2 mb-2">
                                                LinkedIn Link
                                                <span className="text-red-400">*</span>
                                            </label>
                                            <input
                                                type="url"
                                                value={setupData.linkedin}
                                                onChange={(e) => {
                                                    setSetupData(prev => ({ ...prev, linkedin: e.target.value }));
                                                    setSetupError("");
                                                }}
                                                placeholder="https://linkedin.com/in/yourusername"
                                                className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] text-white outline-none focus:border-[#FF6B35] transition-colors text-sm"
                                            />
                                        </div>
                                    </>
                                )}

                                {setupError && (
                                    <div className="flex items-start gap-2 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                        <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                                        <span>{setupError}</span>
                                    </div>
                                )}
                            </div>

                            <div className="p-6 border-t border-[rgba(255,255,255,0.08)]">
                                <LoadingButton
                                    onClick={handleSaveSetup}
                                    loading={saving}
                                    loadingText="Saving..."
                                    variant="primary"
                                    className="w-full"
                                >
                                    {hasBothSocials ? "Continue to Portfolio" : "Save & View Portfolio"}
                                    <ArrowRight size={18} />
                                </LoadingButton>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* SETTINGS MODAL */}
            <AnimatePresence>
                {showSettings && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setShowSettings(false)}
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
                                <h2 className="text-2xl font-semibold">Portfolio Settings</h2>
                                <button
                                    onClick={() => setShowSettings(false)}
                                    className="w-8 h-8 rounded-lg hover:bg-[rgba(255,255,255,0.05)] flex items-center justify-center transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">Public Visibility</h3>
                                    <div className="space-y-3">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={portfolioSettings.showWorkDiscipline}
                                                onChange={(e) => {
                                                    const newSettings = { ...portfolioSettings, showWorkDiscipline: e.target.checked };
                                                    setPortfolioSettings(newSettings);
                                                    handleSaveSettings(newSettings);
                                                }}
                                                className="w-5 h-5 rounded border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.05)] checked:bg-[#FF6B35] checked:border-[#FF6B35]"
                                            />
                                            <span className="text-sm">Show work discipline metrics publicly</span>
                                        </label>

                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={portfolioSettings.showActivityTimeline}
                                                onChange={(e) => {
                                                    const newSettings = { ...portfolioSettings, showActivityTimeline: e.target.checked };
                                                    setPortfolioSettings(newSettings);
                                                    handleSaveSettings(newSettings);
                                                }}
                                                className="w-5 h-5 rounded border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.05)] checked:bg-[#FF6B35] checked:border-[#FF6B35]"
                                            />
                                            <span className="text-sm">Show activity timeline publicly</span>
                                        </label>

                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={portfolioSettings.allowPdfDownload}
                                                onChange={(e) => {
                                                    const newSettings = { ...portfolioSettings, allowPdfDownload: e.target.checked };
                                                    setPortfolioSettings(newSettings);
                                                    handleSaveSettings(newSettings);
                                                }}
                                                className="w-5 h-5 rounded border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.05)] checked:bg-[#FF6B35] checked:border-[#FF6B35]"
                                            />
                                            <span className="text-sm">Allow PDF downloads</span>
                                        </label>

                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={portfolioSettings.showEmail}
                                                onChange={(e) => {
                                                    const newSettings = { ...portfolioSettings, showEmail: e.target.checked };
                                                    setPortfolioSettings(newSettings);
                                                    handleSaveSettings(newSettings);
                                                }}
                                                className="w-5 h-5 rounded border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.05)] checked:bg-[#FF6B35] checked:border-[#FF6B35]"
                                            />
                                            <span className="text-sm">Show email address publicly</span>
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold mb-4">Project Filtering</h3>
                                    <div className="space-y-3">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={portfolioSettings.hideLearningProjects}
                                                onChange={(e) => {
                                                    const newSettings = { ...portfolioSettings, hideLearningProjects: e.target.checked };
                                                    setPortfolioSettings(newSettings);
                                                    handleSaveSettings(newSettings);
                                                }}
                                                className="w-5 h-5 rounded border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.05)] checked:bg-[#FF6B35] checked:border-[#FF6B35]"
                                            />
                                            <span className="text-sm">Hide projects marked as "Learning"</span>
                                        </label>

                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={portfolioSettings.showCommitCounts}
                                                onChange={(e) => {
                                                    const newSettings = { ...portfolioSettings, showCommitCounts: e.target.checked };
                                                    setPortfolioSettings(newSettings);
                                                    handleSaveSettings(newSettings);
                                                }}
                                                className="w-5 h-5 rounded border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.05)] checked:bg-[#FF6B35] checked:border-[#FF6B35]"
                                            />
                                            <span className="text-sm">Show GitHub commit counts</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="p-4 rounded-lg bg-[rgba(255,107,53,0.1)] border border-[rgba(255,107,53,0.2)]">
                                    <p className="text-sm text-[#A0A0A0]">
                                        💡 Changes are saved automatically and reflected immediately in your public portfolio
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* SHARE PORTFOLIO MODAL */}
            <SharePortfolioModal
                isOpen={showShareModal}
                onClose={() => setShowShareModal(false)}
                username={userData?.profile?.username || ''}
                name={userData?.name || ''}
            />

            {/* CONTACT CANDIDATE MODAL */}
            <ContactCandidateModal
                isOpen={showContactModal}
                onClose={() => setShowContactModal(false)}
                portfolioOwnerId={userData?.uid || ''}
                candidateName={userData?.name || userData?.profile?.fullName || 'this candidate'}
            />

            {/* TRUST SIGNAL - Contact Privacy */}
            {!isOwner && portfolioSettings.allowRecruiterContact && (
                <div className="max-w-5xl mx-auto px-4 mt-8 mb-4">
                    <p className="text-xs text-center text-[#A0A0A0]">
                        🔒 Contact requests are delivered securely via MadeIt
                    </p>
                </div>
            )}

            {/* FOOTER - Trust & Authority Signal (Public View Only) */}
            {!isOwner && (
                <footer className="border-t border-[rgba(255,255,255,0.08)] mt-16">
                    <div className="max-w-5xl mx-auto px-4 py-8">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[#A0A0A0]">
                            <div className="flex items-center gap-2">
                                <Rocket size={16} className="text-[#FF6B35]" />
                                <span>
                                    Built on <span className="text-white font-medium">MadeIt</span> · Portfolio auto-generated from verified work
                                </span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <Clock size={14} />
                                    <span>Last updated {stats.lastUpdated}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar size={14} />
                                    <span>{workMetrics.totalActiveDays} active days</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            )}
        </div>
    );
}
