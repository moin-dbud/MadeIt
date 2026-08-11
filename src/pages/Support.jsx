import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabase/supabase";
import { getUserProfile } from "../services/user.service";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    Send,
    CheckCircle2,
    Clock,
    AlertCircle,
    Upload,
    X
} from "lucide-react";
import LoadingButton from "../components/LoadingButton";
import { PageLoader } from "../components/SkeletonLoaders";
import { EMAIL_CONFIG } from '../config/email';

const ISSUE_TYPES = [
    { value: "", label: "Select issue type..." },
    { value: "repo_change", label: "Change GitHub Repository" },
    { value: "bug", label: "Bug / Error" },
    { value: "question", label: "Question / Query" },
    { value: "feature", label: "Feature Suggestion" },
    { value: "other", label: "Other" }
];

const PAGE_OPTIONS = [
    "Dashboard",
    "Projects",
    "Project Details",
    "Profile Setup",
    "Portfolio",
    "Contact Us",
    "Other"
];

const STATUS_CONFIG = {
    open: {
        label: "Open",
        color: "#3B82F6",
        bgColor: "rgba(59, 130, 246, 0.1)",
        borderColor: "rgba(59, 130, 246, 0.2)",
        icon: Clock
    },
    in_progress: {
        label: "In Progress",
        color: "#F59E0B",
        bgColor: "rgba(245, 158, 11, 0.1)",
        borderColor: "rgba(245, 158, 11, 0.2)",
        icon: AlertCircle
    },
    resolved: {
        label: "Resolved",
        color: "#10B981",
        bgColor: "rgba(16, 185, 129, 0.1)",
        borderColor: "rgba(16, 185, 129, 0.2)",
        icon: CheckCircle2
    }
};

export default function Support() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [userData, setUserData] = useState(null);
    const [userProjects, setUserProjects] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [showSuccess, setShowSuccess] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        issueType: "",
        projectId: "",
        currentRepo: "",
        newRepo: "",
        repoReason: "",
        title: "",
        description: "",
        page: "",
        screenshot: null,
        subject: "",
        featureTitle: "",
        featureDescription: "",
        featureReason: "",
        message: ""
    });

    // Fetch user data and tickets
    useEffect(() => {
        const fetchData = async () => {
            if (!user) {
                navigate("/");
                return;
            }

            try {
                const userId = user.id || user.uid;
                const data = await getUserProfile(userId);

                if (data) {
                    setUserData(data);

                    if (data.activeProject) {
                        setUserProjects([data.activeProject]);
                        setFormData(prev => ({
                            ...prev,
                            projectId: data.activeProject.id,
                            currentRepo: data.activeProject.githubRepo || ""
                        }));
                    }
                }

                // Fetch user's tickets from Supabase
                const { data: ticketsData, error: ticketsError } = await supabase
                    .from("support_tickets")
                    .select("*")
                    .eq("user_id", userId)
                    .order("created_at", { ascending: false });

                if (ticketsError) {
                    console.error("Error fetching support tickets:", ticketsError);
                } else if (ticketsData) {
                    const mappedTickets = ticketsData.map(t => ({
                        id: t.id,
                        ticketId: t.ticket_id,
                        userId: t.user_id,
                        userName: t.user_name,
                        userEmail: t.user_email,
                        issueType: t.issue_type,
                        message: t.message,
                        title: t.title,
                        page: t.page,
                        subject: t.subject,
                        currentRepo: t.current_repo,
                        newRepo: t.new_repo,
                        status: t.status,
                        createdAt: t.created_at
                    }));
                    setTickets(mappedTickets);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user, navigate]);

    // Handle form input changes
    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Auto-fill current repo when project is selected
        if (field === "projectId") {
            const selectedProject = userProjects.find(p => p.id === value);
            if (selectedProject) {
                setFormData(prev => ({
                    ...prev,
                    currentRepo: selectedProject.githubRepo || ""
                }));
            }
        }
    };

    // Handle screenshot upload
    const handleScreenshotUpload = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, screenshot: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    // Remove screenshot
    const removeScreenshot = () => {
        setFormData(prev => ({ ...prev, screenshot: null }));
    };

    // Validate form
    const validateForm = () => {
        if (!formData.issueType) return false;

        switch (formData.issueType) {
            case "repo_change":
                return formData.projectId && formData.newRepo && formData.repoReason;
            case "bug":
                return formData.title && formData.description && formData.page;
            case "question":
                return formData.subject && formData.description;
            case "feature":
                return formData.featureTitle && formData.featureDescription;
            case "other":
                return formData.message;
            default:
                return false;
        }
    };

    // Submit ticket
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setSubmitting(true);
        try {
            // Prepare ticket data
            const ticketData = {
                userId: user.uid,
                userEmail: user.email || userData?.profile?.email || "",
                userName: userData?.profile?.fullName || user.displayName || "User",
                issueType: formData.issueType,
                status: "open",
                createdAt: serverTimestamp(),
                lastUpdatedAt: serverTimestamp()
            };

            // Add issue-specific fields
            switch (formData.issueType) {
                case "repo_change":
                    ticketData.projectId = formData.projectId;
                    ticketData.projectName = userProjects.find(p => p.id === formData.projectId)?.name || "";
                    ticketData.currentRepo = formData.currentRepo;
                    ticketData.newRepo = formData.newRepo;
                    ticketData.reason = formData.repoReason;
                    ticketData.message = `Repository Change Request\n\nProject: ${ticketData.projectName}\nCurrent Repo: ${formData.currentRepo}\nNew Repo: ${formData.newRepo}\n\nReason: ${formData.repoReason}`;
                    break;

                case "bug":
                    ticketData.title = formData.title;
                    ticketData.description = formData.description;
                    ticketData.page = formData.page;
                    ticketData.screenshot = formData.screenshot || null;
                    ticketData.message = `Bug Report: ${formData.title}\n\nDescription: ${formData.description}\n\nPage: ${formData.page}`;
                    break;

                case "question":
                    ticketData.subject = formData.subject;
                    ticketData.description = formData.description;
                    ticketData.message = `Question: ${formData.subject}\n\n${formData.description}`;
                    break;

                case "feature":
                    ticketData.featureTitle = formData.featureTitle;
                    ticketData.featureDescription = formData.featureDescription;
                    ticketData.featureReason = formData.featureReason || "";
                    ticketData.message = `Feature Suggestion: ${formData.featureTitle}\n\nDescription: ${formData.featureDescription}${formData.featureReason ? `\n\nWhy this is useful: ${formData.featureReason}` : ''}`;
                    break;

                case "other":
                    ticketData.message = formData.message;
                    break;
            }

            // Save to Supabase
            const generatedTicketId = `ticket_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
            const { data: insertedTicket, error: insertErr } = await supabase
                .from("support_tickets")
                .insert({
                    ticket_id: generatedTicketId,
                    user_id: user.id || user.uid,
                    user_name: userData?.profile?.fullName || user.displayName || "User",
                    user_email: user.email || userData?.profile?.email || "",
                    issue_type: formData.issueType,
                    message: ticketData.message || "",
                    title: formData.title || null,
                    page: formData.page || null,
                    subject: formData.subject || null,
                    current_repo: formData.currentRepo || null,
                    new_repo: formData.newRepo || null,
                    status: "open",
                    created_at: new Date().toISOString()
                })
                .select("id")
                .single();

            if (insertErr) {
                console.error("Error creating ticket in Supabase:", insertErr);
                throw insertErr;
            }

            ticketData.id = insertedTicket.id;
            ticketData.ticketId = generatedTicketId;

            // Send email notification
            try {
                const response = await fetch(`${EMAIL_CONFIG.API_BASE_URL}/api/send-email`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        type: 'supportTicket',
                        data: {
                            ...ticketData,
                            ticketId: docRef.id,
                            name: ticketData.userName
                        }
                    })
                });

                if (!response.ok) {
                    console.warn("Email notification failed, but ticket was saved");
                }
            } catch (emailError) {
                console.error("Email error:", emailError);
                // Continue even if email fails - ticket is saved
            }

            // Update local state
            setTickets(prev => [ticketData, ...prev]);

            // Reset form
            setFormData({
                issueType: "",
                projectId: userProjects[0]?.id || "",
                currentRepo: userProjects[0]?.githubRepo || "",
                newRepo: "",
                repoReason: "",
                title: "",
                description: "",
                page: "",
                screenshot: null,
                subject: "",
                featureTitle: "",
                featureDescription: "",
                featureReason: "",
                message: ""
            });

            // Show success message
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 5000);

        } catch (error) {
            console.error("Error submitting ticket:", error);
            alert("Failed to submit ticket. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <PageLoader message="Loading support..." />;
    }

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white">
            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="flex items-center gap-2 text-[#A0A0A0] hover:text-white transition-colors mb-6"
                    >
                        <ArrowLeft size={20} />
                        Back to Dashboard
                    </button>

                    <h1 className="text-3xl font-semibold tracking-tight mb-2">
                        Support & Help
                    </h1>
                    <p className="text-[#A0A0A0]">
                        Raise a ticket for any issues, questions, or feature suggestions
                    </p>
                </motion.div>

                {/* Success Toast */}
                <AnimatePresence>
                    {showSuccess && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="mb-6 p-4 rounded-xl bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.2)] flex items-center gap-3"
                        >
                            <CheckCircle2 size={20} color="#10B981" />
                            <p className="text-sm text-[#10B981]">
                                Your ticket has been submitted. You'll receive an email confirmation shortly.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Raise a Ticket Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-12 rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-8"
                >
                    <h2 className="text-xl font-semibold mb-6">Raise a Ticket</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Issue Type */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Issue Type <span className="text-[#FF6B35]">*</span>
                            </label>
                            <select
                                value={formData.issueType}
                                onChange={(e) => handleInputChange("issueType", e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] text-white outline-none focus:border-[#FF6B35] transition-colors"
                                required
                            >
                                {ISSUE_TYPES.map(type => (
                                    <option className="bg-black text-white" key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Dynamic Form Fields */}
                        {formData.issueType === "repo_change" && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Project <span className="text-[#FF6B35]">*</span>
                                    </label>
                                    <select
                                        value={formData.projectId}
                                        onChange={(e) => handleInputChange("projectId", e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] text-white outline-none focus:border-[#FF6B35] transition-colors"
                                        required
                                    >
                                        {userProjects.length === 0 ? (
                                            <option value="">No active projects</option>
                                        ) : (
                                            userProjects.map(project => (
                                                <option className="bg-black text-white" key={project.id} value={project.id}>
                                                    {project.name}
                                                </option>
                                            ))
                                        )}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Current GitHub Repository
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.currentRepo}
                                        readOnly
                                        className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] text-[#A0A0A0] cursor-not-allowed"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        New GitHub Repository URL <span className="text-[#FF6B35]">*</span>
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.newRepo}
                                        onChange={(e) => handleInputChange("newRepo", e.target.value)}
                                        placeholder="https://github.com/username/repo"
                                        className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] text-white outline-none focus:border-[#FF6B35] transition-colors"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Reason for Change <span className="text-[#FF6B35]">*</span>
                                    </label>
                                    <textarea
                                        value={formData.repoReason}
                                        onChange={(e) => handleInputChange("repoReason", e.target.value)}
                                        rows="4"
                                        placeholder="Explain why you need to change the repository..."
                                        className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] text-white outline-none focus:border-[#FF6B35] transition-colors resize-none"
                                        required
                                    />
                                </div>
                            </>
                        )}

                        {formData.issueType === "bug" && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Short Title <span className="text-[#FF6B35]">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => handleInputChange("title", e.target.value)}
                                        placeholder="e.g., Dashboard not loading"
                                        className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] text-white outline-none focus:border-[#FF6B35] transition-colors"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Error Description <span className="text-[#FF6B35]">*</span>
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => handleInputChange("description", e.target.value)}
                                        rows="4"
                                        placeholder="Describe the error in detail..."
                                        className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] text-white outline-none focus:border-[#FF6B35] transition-colors resize-none"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Page Where Error Occurred <span className="text-[#FF6B35]">*</span>
                                    </label>
                                    <select
                                        value={formData.page}
                                        onChange={(e) => handleInputChange("page", e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] text-white outline-none focus:border-[#FF6B35] transition-colors"
                                        required
                                    >
                                        <option className="bg-black text-white" value="">Select page...</option>
                                        {PAGE_OPTIONS.map(page => (
                                            <option key={page} value={page}>{page}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Screenshot (Optional)
                                    </label>
                                    {formData.screenshot ? (
                                        <div className="relative">
                                            <img
                                                src={formData.screenshot}
                                                alt="Screenshot"
                                                className="w-full rounded-xl border border-[rgba(255,255,255,0.08)]"
                                            />
                                            <button
                                                type="button"
                                                onClick={removeScreenshot}
                                                className="absolute top-2 right-2 w-8 h-8 rounded-lg bg-red-500 hover:bg-red-600 flex items-center justify-center transition-colors"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="w-full px-4 py-8 rounded-xl bg-[rgba(255,255,255,0.05)] border border-dashed border-[rgba(255,255,255,0.2)] flex flex-col items-center justify-center cursor-pointer hover:bg-[rgba(255,255,255,0.08)] transition-colors">
                                            <Upload size={24} className="mb-2 text-[#A0A0A0]" />
                                            <p className="text-sm text-[#A0A0A0]">Click to upload screenshot</p>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleScreenshotUpload}
                                                className="hidden"
                                            />
                                        </label>
                                    )}
                                </div>
                            </>
                        )}

                        {formData.issueType === "question" && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Subject <span className="text-[#FF6B35]">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.subject}
                                        onChange={(e) => handleInputChange("subject", e.target.value)}
                                        placeholder="What's your question about?"
                                        className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] text-white outline-none focus:border-[#FF6B35] transition-colors"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Question Description <span className="text-[#FF6B35]">*</span>
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => handleInputChange("description", e.target.value)}
                                        rows="5"
                                        placeholder="Describe your question in detail..."
                                        className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] text-white outline-none focus:border-[#FF6B35] transition-colors resize-none"
                                        required
                                    />
                                </div>
                            </>
                        )}

                        {formData.issueType === "feature" && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Feature Title <span className="text-[#FF6B35]">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.featureTitle}
                                        onChange={(e) => handleInputChange("featureTitle", e.target.value)}
                                        placeholder="e.g., Dark mode toggle"
                                        className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] text-white outline-none focus:border-[#FF6B35] transition-colors"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Description <span className="text-[#FF6B35]">*</span>
                                    </label>
                                    <textarea
                                        value={formData.featureDescription}
                                        onChange={(e) => handleInputChange("featureDescription", e.target.value)}
                                        rows="4"
                                        placeholder="Describe the feature you'd like to see..."
                                        className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] text-white outline-none focus:border-[#FF6B35] transition-colors resize-none"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Why This is Useful (Optional)
                                    </label>
                                    <textarea
                                        value={formData.featureReason}
                                        onChange={(e) => handleInputChange("featureReason", e.target.value)}
                                        rows="3"
                                        placeholder="Explain how this feature would help..."
                                        className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] text-white outline-none focus:border-[#FF6B35] transition-colors resize-none"
                                    />
                                </div>
                            </>
                        )}

                        {formData.issueType === "other" && (
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Message <span className="text-[#FF6B35]">*</span>
                                </label>
                                <textarea
                                    value={formData.message}
                                    onChange={(e) => handleInputChange("message", e.target.value)}
                                    rows="6"
                                    placeholder="Tell us what's on your mind..."
                                    className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] text-white outline-none focus:border-[#FF6B35] transition-colors resize-none"
                                    required
                                />
                            </div>
                        )}

                        {/* Submit Button */}
                        {formData.issueType && (
                            <LoadingButton
                                type="submit"
                                loading={submitting}
                                loadingText="Submitting..."
                                disabled={!validateForm()}
                                variant="primary"
                                className="w-full"
                            >
                                Submit Ticket
                                <Send size={18} />
                            </LoadingButton>
                        )}
                    </form>
                </motion.div>

                {/* My Tickets */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-8"
                >
                    <h2 className="text-xl font-semibold mb-6">My Tickets</h2>

                    {tickets.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 rounded-full bg-[rgba(255,107,53,0.1)] flex items-center justify-center mx-auto mb-4">
                                <AlertCircle size={28} color="#FF6B35" strokeWidth={1.5} />
                            </div>
                            <p className="text-[#A0A0A0]">No tickets yet</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {tickets.map(ticket => {
                                const statusConfig = STATUS_CONFIG[ticket.status] || STATUS_CONFIG.open;
                                const StatusIcon = statusConfig.icon;
                                const createdDate = ticket.createdAt?.toDate ?
                                    ticket.createdAt.toDate().toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    }) :
                                    'Just now';

                                const issueTypeLabel = ISSUE_TYPES.find(t => t.value === ticket.issueType)?.label || ticket.issueType;

                                return (
                                    <div
                                        key={ticket.id}
                                        className="p-5 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.04)] transition-colors"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="text-xs text-[#A0A0A0] font-mono">
                                                        #{ticket.id.slice(0, 8)}
                                                    </span>
                                                    <span className="text-sm font-medium text-white">
                                                        {issueTypeLabel}
                                                    </span>
                                                </div>
                                                {ticket.projectName && (
                                                    <p className="text-sm text-[#A0A0A0] mb-1">
                                                        Project: {ticket.projectName}
                                                    </p>
                                                )}
                                                {ticket.title && (
                                                    <p className="text-sm text-white mb-1">
                                                        {ticket.title}
                                                    </p>
                                                )}
                                                {ticket.subject && (
                                                    <p className="text-sm text-white mb-1">
                                                        {ticket.subject}
                                                    </p>
                                                )}
                                                {ticket.featureTitle && (
                                                    <p className="text-sm text-white mb-1">
                                                        {ticket.featureTitle}
                                                    </p>
                                                )}
                                            </div>

                                            <div
                                                className="px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5"
                                                style={{
                                                    color: statusConfig.color,
                                                    backgroundColor: statusConfig.bgColor,
                                                    border: `1px solid ${statusConfig.borderColor}`
                                                }}
                                            >
                                                <StatusIcon size={14} />
                                                {statusConfig.label}
                                            </div>
                                        </div>

                                        <p className="text-xs text-[#A0A0A0]">
                                            Created on {createdDate}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
