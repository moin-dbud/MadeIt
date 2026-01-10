import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Workflow, Target, CheckSquare, GitBranch, Shield, Layout, TrendingUp, HelpCircle, MessageSquare, AlertTriangle } from 'lucide-react';
import Footer from '../components/Footer';

const Documentation = () => {
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white">
            {/* Hero Section */}
            <section className="relative min-h-[50vh] flex flex-col items-center justify-center px-6 pt-32 pb-16">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-8"
                    >
                        <BookOpen className="w-4 h-4 text-[#4A7BFF]" />
                        <span className="text-sm text-gray-300">Documentation</span>
                    </motion.div>

                    <motion.h1
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6"
                    >
                        MadeIt Documentation
                    </motion.h1>

                    <motion.p
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-xl text-gray-400 max-w-2xl mx-auto"
                    >
                        Everything you need to know about building projects and creating proof-of-work portfolios on MadeIt.
                    </motion.p>
                </div>
            </section>

            {/* Content Sections */}
            <section className="py-12 px-6">
                <div className="max-w-4xl mx-auto space-y-16">

                    {/* What is MadeIt */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeIn}
                        transition={{ duration: 0.6 }}
                        className="space-y-4"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">What is MadeIt?</h2>
                        <div className="space-y-4 text-lg text-gray-400 leading-relaxed">
                            <p>
                                MadeIt is a platform that helps you build real-world projects through structured milestones, submit proof of your work, and automatically generate a portfolio based on verified execution.
                            </p>
                            <p>
                                The core idea is simple: proof of work over claims. Instead of listing skills you claim to have, MadeIt requires you to submit actual proof—code commits, screenshots, live demos, and reflections—for each milestone you complete.
                            </p>
                            <p className="text-white font-medium">
                                MadeIt portfolios show what you've actually built, not what you say you can build. This makes them fundamentally different from traditional resumes or certificates.
                            </p>
                        </div>
                    </motion.div>

                    {/* How MadeIt Works */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeIn}
                        transition={{ duration: 0.6 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#4A7BFF] to-[#FF6B35] rounded-lg flex items-center justify-center">
                                <Workflow className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold">How MadeIt Works</h2>
                        </div>
                        <div className="space-y-4 text-lg text-gray-400 leading-relaxed">
                            <p>Here's the full journey from start to finish:</p>
                            <ol className="space-y-3 ml-6">
                                <li className="flex items-start gap-3">
                                    <span className="text-[#4A7BFF] font-bold mt-1">1.</span>
                                    <span><strong className="text-white">Sign up:</strong> Create an account using email or Google authentication.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[#4A7BFF] font-bold mt-1">2.</span>
                                    <span><strong className="text-white">Complete profile setup:</strong> Add your name, bio, GitHub username, and skills.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[#4A7BFF] font-bold mt-1">3.</span>
                                    <span><strong className="text-white">Select a project:</strong> Choose from available projects based on difficulty and interest.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[#4A7BFF] font-bold mt-1">4.</span>
                                    <span><strong className="text-white">Work through milestones:</strong> Build real features, one milestone at a time.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[#4A7BFF] font-bold mt-1">5.</span>
                                    <span><strong className="text-white">Submit proof:</strong> When a milestone is complete, submit proof of your work (code, screenshots, reflections).</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[#4A7BFF] font-bold mt-1">6.</span>
                                    <span><strong className="text-white">Proof is reviewed:</strong> Your submission goes under review and is verified by the MadeIt team.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[#4A7BFF] font-bold mt-1">7.</span>
                                    <span><strong className="text-white">Portfolio updates automatically:</strong> Once verified, the milestone appears on your public portfolio.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[#4A7BFF] font-bold mt-1">8.</span>
                                    <span><strong className="text-white">Share publicly:</strong> Your portfolio is accessible via a unique URL you can share with anyone.</span>
                                </li>
                            </ol>
                        </div>
                    </motion.div>

                    {/* Projects */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeIn}
                        transition={{ duration: 0.6 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#4A7BFF] to-[#FF6B35] rounded-lg flex items-center justify-center">
                                <Target className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold">Projects</h2>
                        </div>
                        <div className="space-y-4 text-lg text-gray-400 leading-relaxed">
                            <p>
                                A project is a complete real-world application you will build from start to finish. Each project is broken down into structured milestones that guide your work.
                            </p>
                            <p>
                                Projects are categorized by difficulty:
                            </p>
                            <ul className="space-y-2 ml-6">
                                <li className="flex items-start gap-3">
                                    <span className="text-green-400 mt-1">•</span>
                                    <span><strong className="text-white">Beginner:</strong> Suitable for those new to building projects. Simpler features and fewer technical complexities.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-yellow-400 mt-1">•</span>
                                    <span><strong className="text-white">Intermediate:</strong> Requires foundational knowledge. Involves API integration, state management, and deployment.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-red-400 mt-1">•</span>
                                    <span><strong className="text-white">Advanced:</strong> Complex projects with real-time features, database design, authentication, and advanced architecture.</span>
                                </li>
                            </ul>
                            <p className="text-white font-medium">
                                All projects follow the same milestone structure to ensure consistency and comparability across portfolios.
                            </p>
                        </div>
                    </motion.div>

                    {/* Milestones */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeIn}
                        transition={{ duration: 0.6 }}
                        className="space-y-4"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Milestones</h2>
                        <div className="space-y-4 text-lg text-gray-400 leading-relaxed">
                            <p>
                                Milestones represent major phases of work. Each milestone contains multiple tasks and requires proof of completion before you can move to the next one.
                            </p>
                            <p>
                                Every project has 6 standard milestones:
                            </p>
                            <div className="space-y-4 mt-4">
                                <div className="p-4 bg-white/[0.03] border border-white/10 rounded-lg">
                                    <h3 className="text-xl font-bold text-white mb-2">Milestone 1: Planning</h3>
                                    <p>Define requirements, create user stories, and plan the project structure.</p>
                                </div>
                                <div className="p-4 bg-white/[0.03] border border-white/10 rounded-lg">
                                    <h3 className="text-xl font-bold text-white mb-2">Milestone 2: Setup</h3>
                                    <p>Set up the development environment, initialize the project, and configure necessary tools.</p>
                                </div>
                                <div className="p-4 bg-white/[0.03] border border-white/10 rounded-lg">
                                    <h3 className="text-xl font-bold text-white mb-2">Milestone 3: Feature Development</h3>
                                    <p>Build core features and functionality. This is the main implementation phase.</p>
                                </div>
                                <div className="p-4 bg-white/[0.03] border border-white/10 rounded-lg">
                                    <h3 className="text-xl font-bold text-white mb-2">Milestone 4: Testing & Integration</h3>
                                    <p>Test features, fix bugs, and integrate different components.</p>
                                </div>
                                <div className="p-4 bg-white/[0.03] border border-white/10 rounded-lg">
                                    <h3 className="text-xl font-bold text-white mb-2">Milestone 5: Refinement & Optimization</h3>
                                    <p>Improve performance, refine UI/UX, and optimize code quality.</p>
                                </div>
                                <div className="p-4 bg-white/[0.03] border border-white/10 rounded-lg">
                                    <h3 className="text-xl font-bold text-white mb-2">Milestone 6: Deployment & Launch</h3>
                                    <p>Deploy the project to production and make it publicly accessible.</p>
                                </div>
                            </div>
                            <p className="text-white font-medium mt-4">
                                Milestones are used instead of daily tasks because they represent meaningful progress. Completing a milestone means you've built something substantial, not just checked off a to-do list.
                            </p>
                            <p>
                                Milestones unlock sequentially. You must complete Milestone 1 before starting Milestone 2, and so on.
                            </p>
                        </div>
                    </motion.div>

                    {/* Tasks */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeIn}
                        transition={{ duration: 0.6 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#4A7BFF] to-[#FF6B35] rounded-lg flex items-center justify-center">
                                <CheckSquare className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold">Tasks</h2>
                        </div>
                        <div className="space-y-4 text-lg text-gray-400 leading-relaxed">
                            <p>
                                Tasks exist to guide your work within each milestone. They break down the milestone into smaller, actionable steps.
                            </p>
                            <p>
                                However, tasks are not used as portfolio proof. They are internal progress tracking tools to help you stay organized.
                            </p>
                            <p className="text-white font-medium">
                                All tasks in a milestone must be marked complete before you can submit proof for that milestone.
                            </p>
                            <p>
                                Tasks help you stay on track, but the proof you submit at the milestone level is what matters for your portfolio.
                            </p>
                        </div>
                    </motion.div>

                    {/* Proof of Work */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeIn}
                        transition={{ duration: 0.6 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#4A7BFF] to-[#FF6B35] rounded-lg flex items-center justify-center">
                                <Shield className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold">Proof of Work</h2>
                        </div>
                        <div className="space-y-4 text-lg text-gray-400 leading-relaxed">
                            <p>
                                Proof of work is submitted only when you complete a milestone. This is the evidence that you actually built what you claim.
                            </p>
                            <p>Types of proof you can submit:</p>
                            <ul className="space-y-3 ml-6">
                                <li className="flex items-start gap-3">
                                    <span className="text-[#4A7BFF] mt-1">•</span>
                                    <span><strong className="text-white">GitHub commits:</strong> A selected commit range showing the code you wrote for this milestone.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[#4A7BFF] mt-1">•</span>
                                    <span><strong className="text-white">Screenshots or visuals:</strong> Images showing the UI, architecture diagrams, or design mockups.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[#4A7BFF] mt-1">•</span>
                                    <span><strong className="text-white">Reflections or explanations:</strong> Written descriptions of what you built, challenges faced, and solutions implemented.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[#4A7BFF] mt-1">•</span>
                                    <span><strong className="text-white">Live links:</strong> URLs to deployed versions or demos (when applicable).</span>
                                </li>
                            </ul>
                            <p className="text-white font-medium">
                                All proof must represent real work done by you. Submitting fake, copied, or misleading proof may result in rejection or account suspension.
                            </p>
                        </div>
                    </motion.div>

                    {/* GitHub Integration */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeIn}
                        transition={{ duration: 0.6 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#4A7BFF] to-[#FF6B35] rounded-lg flex items-center justify-center">
                                <GitBranch className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold">GitHub Integration</h2>
                        </div>
                        <div className="space-y-4 text-lg text-gray-400 leading-relaxed">
                            <p>
                                GitHub is the primary way to submit code-based proof on MadeIt. Here's how it works:
                            </p>
                            <ul className="space-y-3 ml-6">
                                <li className="flex items-start gap-3">
                                    <span className="text-[#4A7BFF] mt-1">•</span>
                                    <span>When you start a project, you connect a GitHub repository URL.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[#4A7BFF] mt-1">•</span>
                                    <span>For each milestone, you select a commit range (e.g., commits from "abc123" to "def456").</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[#4A7BFF] mt-1">•</span>
                                    <span>MadeIt fetches commit messages, dates, and metadata automatically via the GitHub API.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[#4A7BFF] mt-1">•</span>
                                    <span>Your selected commits are displayed on your portfolio with links to the repository.</span>
                                </li>
                            </ul>
                            <p className="text-white font-medium">
                                What is shown publicly:
                            </p>
                            <ul className="space-y-2 ml-6">
                                <li className="flex items-start gap-3">
                                    <span className="text-green-400 mt-1">✓</span>
                                    <span>Repository name and URL</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-green-400 mt-1">✓</span>
                                    <span>Commit messages for selected ranges</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-green-400 mt-1">✓</span>
                                    <span>Commit dates and links</span>
                                </li>
                            </ul>
                            <p className="text-white font-medium mt-3">
                                What is NOT shown:
                            </p>
                            <ul className="space-y-2 ml-6">
                                <li className="flex items-start gap-3">
                                    <span className="text-red-400 mt-1">✗</span>
                                    <span>Repository stars, forks, or followers</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-red-400 mt-1">✗</span>
                                    <span>Unrelated repositories or projects</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-red-400 mt-1">✗</span>
                                    <span>Full commit diffs or code content</span>
                                </li>
                            </ul>
                        </div>
                    </motion.div>

                    {/* Verification System */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeIn}
                        transition={{ duration: 0.6 }}
                        className="space-y-4"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Verification System</h2>
                        <div className="space-y-4 text-lg text-gray-400 leading-relaxed">
                            <p>
                                "MadeIt Verified" means that your submitted proof has been reviewed and approved by the MadeIt team.
                            </p>
                            <p>Here's how the verification flow works:</p>
                            <ol className="space-y-3 ml-6">
                                <li className="flex items-start gap-3">
                                    <span className="text-[#4A7BFF] font-bold mt-1">1.</span>
                                    <span>You submit proof for a milestone.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[#4A7BFF] font-bold mt-1">2.</span>
                                    <span>Status changes to <strong className="text-yellow-400">"Under Review"</strong>.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[#4A7BFF] font-bold mt-1">3.</span>
                                    <span>An admin reviews your submission and can:
                                        <ul className="ml-6 mt-2 space-y-1">
                                            <li className="text-green-400">• Verify it (approved)</li>
                                            <li className="text-yellow-400">• Flag it (internal review needed)</li>
                                            <li className="text-red-400">• Reject it (requires resubmission)</li>
                                        </ul>
                                    </span>
                                </li>
                            </ol>
                            <p className="text-white font-medium mt-4">
                                Status meanings:
                            </p>
                            <div className="space-y-3 mt-3">
                                <div className="flex items-start gap-3">
                                    <span className="text-green-400 font-bold mt-1">Verified:</span>
                                    <span>Your proof is approved and appears on your public portfolio.</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="text-yellow-400 font-bold mt-1">Flagged:</span>
                                    <span>Internal status indicating the submission needs closer review. Not visible to users.</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="text-red-400 font-bold mt-1">Rejected:</span>
                                    <span>Your submission was rejected. You must resubmit with corrected proof.</span>
                                </div>
                            </div>
                            <p className="mt-4">
                                Verification confirms that you submitted proof, not that the work is perfect. The goal is to check consistency and authenticity, not to grade your technical skills.
                            </p>
                        </div>
                    </motion.div>

                    {/* Portfolio System */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeIn}
                        transition={{ duration: 0.6 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#4A7BFF] to-[#FF6B35] rounded-lg flex items-center justify-center">
                                <Layout className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold">Portfolio System</h2>
                        </div>
                        <div className="space-y-4 text-lg text-gray-400 leading-relaxed">
                            <p>
                                Your MadeIt portfolio is automatically generated based on your verified milestones. There are two views:
                            </p>
                            <div className="space-y-4 mt-4">
                                <div className="p-4 bg-white/[0.03] border border-white/10 rounded-lg">
                                    <h3 className="text-xl font-bold text-white mb-2">Private View (Logged-in Owner)</h3>
                                    <p>When you're logged in and viewing your own portfolio, you see:</p>
                                    <ul className="ml-6 mt-2 space-y-1">
                                        <li>• All projects (active, completed, hidden)</li>
                                        <li>• Milestone statuses (pending, under review, verified, rejected)</li>
                                        <li>• Internal progress tracking</li>
                                        <li>• Edit and submission options</li>
                                    </ul>
                                </div>
                                <div className="p-4 bg-white/[0.03] border border-white/10 rounded-lg">
                                    <h3 className="text-xl font-bold text-white mb-2">Public View (Recruiters & Visitors)</h3>
                                    <p>When others visit your portfolio via your unique URL, they see:</p>
                                    <ul className="ml-6 mt-2 space-y-1">
                                        <li>• Only verified projects and milestones</li>
                                        <li>• Proof submissions (commits, screenshots, reflections)</li>
                                        <li>• Skills derived from completed milestones</li>
                                        <li>• Activity timeline and discipline metrics</li>
                                        <li>• GitHub repository links</li>
                                    </ul>
                                </div>
                            </div>
                            <p className="text-white font-medium mt-4">
                                What is hidden by default:
                            </p>
                            <ul className="space-y-2 ml-6">
                                <li className="flex items-start gap-3">
                                    <span className="text-gray-500 mt-1">•</span>
                                    <span>Unverified or rejected milestones</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-gray-500 mt-1">•</span>
                                    <span>Projects you mark as hidden</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-gray-500 mt-1">•</span>
                                    <span>Internal task completion tracking</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-gray-500 mt-1">•</span>
                                    <span>Email address and private account details</span>
                                </li>
                            </ul>
                            <p className="mt-4">
                                Skills are derived automatically from verified milestones. For example, if you complete a React project, skills like "React", "JavaScript", and "Frontend Development" are added to your profile.
                            </p>
                        </div>
                    </motion.div>

                    {/* Activity & Discipline Metrics */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeIn}
                        transition={{ duration: 0.6 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#4A7BFF] to-[#FF6B35] rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold">Activity & Discipline Metrics</h2>
                        </div>
                        <div className="space-y-4 text-lg text-gray-400 leading-relaxed">
                            <p>
                                MadeIt tracks basic activity metrics to give recruiters a sense of your consistency and pace:
                            </p>
                            <ul className="space-y-3 ml-6">
                                <li className="flex items-start gap-3">
                                    <span className="text-[#4A7BFF] mt-1">•</span>
                                    <span><strong className="text-white">Active days:</strong> Days on which you marked tasks complete or submitted milestones.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[#4A7BFF] mt-1">•</span>
                                    <span><strong className="text-white">Pace per milestone:</strong> Average time taken to complete each milestone.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[#4A7BFF] mt-1">•</span>
                                    <span><strong className="text-white">Activity timeline:</strong> A visual representation of your work over time.</span>
                                </li>
                            </ul>
                            <p className="text-white font-medium">
                                These are signals, not gamification. MadeIt does not enforce streaks or daily goals. The focus is on real progress, not checking boxes.
                            </p>
                            <p>
                                If you work in bursts or take breaks, that's fine. The metrics simply reflect your actual activity.
                            </p>
                        </div>
                    </motion.div>

                    {/* Support & Tickets */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeIn}
                        transition={{ duration: 0.6 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#4A7BFF] to-[#FF6B35] rounded-lg flex items-center justify-center">
                                <MessageSquare className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold">Support & Tickets</h2>
                        </div>
                        <div className="space-y-4 text-lg text-gray-400 leading-relaxed">
                            <p>
                                You can raise a support ticket if you encounter issues or need help. Here are the types of tickets you can submit:
                            </p>
                            <ul className="space-y-3 ml-6">
                                <li className="flex items-start gap-3">
                                    <span className="text-[#4A7BFF] mt-1">•</span>
                                    <span><strong className="text-white">GitHub Repository Change:</strong> If you need to change the repository linked to your project.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[#4A7BFF] mt-1">•</span>
                                    <span><strong className="text-white">Bug Report:</strong> Report technical issues or bugs on the platform.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[#4A7BFF] mt-1">•</span>
                                    <span><strong className="text-white">Query:</strong> Ask questions about how MadeIt works or clarify guidelines.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[#4A7BFF] mt-1">•</span>
                                    <span><strong className="text-white">Feature Suggestion:</strong> Suggest new features or improvements.</span>
                                </li>
                            </ul>
                            <p className="text-white font-medium mt-4">
                                Ticket status workflow:
                            </p>
                            <ol className="space-y-2 ml-6">
                                <li className="flex items-start gap-3">
                                    <span className="text-yellow-400 font-bold mt-1">1.</span>
                                    <span><strong className="text-yellow-400">Open:</strong> Your ticket has been submitted and is awaiting review.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-blue-400 font-bold mt-1">2.</span>
                                    <span><strong className="text-blue-400">In Progress:</strong> The support team is actively working on your issue.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-green-400 font-bold mt-1">3.</span>
                                    <span><strong className="text-green-400">Resolved:</strong> Your issue has been resolved. You'll receive an email notification.</span>
                                </li>
                            </ol>
                            <p className="mt-4">
                                You'll receive email notifications when your ticket status changes.
                            </p>
                        </div>
                    </motion.div>

                    {/* Common Questions */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeIn}
                        transition={{ duration: 0.6 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#4A7BFF] to-[#FF6B35] rounded-lg flex items-center justify-center">
                                <HelpCircle className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold">Common Questions</h2>
                        </div>
                        <div className="space-y-6 text-lg text-gray-400 leading-relaxed">
                            <div>
                                <h3 className="text-xl font-semibold text-white mb-2">Can I complete a project in one day?</h3>
                                <p>
                                    Technically yes, but it's not recommended. Milestones are designed to represent meaningful progress over time. Rushing through them defeats the purpose of showing consistent execution. Recruiters value steady progress over speed.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-white mb-2">Do I need perfect commits?</h3>
                                <p>
                                    No. Your commits should be genuine and reflect real work, but they don't need to be perfect. Commit messages like "fix bug" or "update styling" are fine. The goal is authenticity, not perfection.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-white mb-2">Can I redo a milestone?</h3>
                                <p>
                                    If a milestone is rejected, you can resubmit proof after making corrections. If a milestone is already verified, you cannot redo it unless you contact support with a valid reason.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-white mb-2">Is verification guaranteed?</h3>
                                <p>
                                    No. Verification is based on whether you've submitted legitimate proof of work. If your submission is incomplete, fake, or inconsistent, it may be rejected.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-white mb-2">Can I hide a project later?</h3>
                                <p>
                                    Yes. You can mark a project as hidden in your settings, and it will no longer appear on your public portfolio. However, it will still be visible to you in your private view.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-white mb-2">Can I share my portfolio before completion?</h3>
                                <p>
                                    Yes. Your portfolio is always public via your unique URL. However, only verified milestones will be visible to others. Unfinished or unverified work will not appear.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Limitations & Expectations */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeIn}
                        transition={{ duration: 0.6 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#4A7BFF] to-[#FF6B35] rounded-lg flex items-center justify-center">
                                <AlertTriangle className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold">Limitations & Expectations</h2>
                        </div>
                        <div className="space-y-4 text-lg text-gray-400 leading-relaxed">
                            <p className="text-white font-medium">
                                MadeIt does not guarantee jobs.
                            </p>
                            <p>
                                Building projects and earning verification on MadeIt demonstrates your ability to execute, but it does not guarantee employment opportunities. Hiring decisions are made by recruiters, not by MadeIt.
                            </p>
                            <p className="text-white font-medium mt-4">
                                Verification checks consistency, not perfection.
                            </p>
                            <p>
                                The verification process confirms that you submitted proof for a milestone. It does not assess the technical quality, elegance, or correctness of your code. Verified does not mean perfect.
                            </p>
                            <p className="text-white font-medium mt-4">
                                The platform is evolving.
                            </p>
                            <p>
                                MadeIt is an early-stage platform. Features may change, be added, or removed as the platform develops. We're committed to improving based on user feedback.
                            </p>
                            <p className="text-white font-medium mt-4">
                                Features may change.
                            </p>
                            <p>
                                We may update the milestone structure, proof requirements, or portfolio layout over time. Changes will be communicated to users in advance when possible.
                            </p>
                        </div>
                    </motion.div>

                    {/* Contact & Feedback */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeIn}
                        transition={{ duration: 0.6 }}
                        className="space-y-4 pb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Contact & Feedback</h2>
                        <div className="space-y-4 text-lg text-gray-400 leading-relaxed">
                            <p>
                                We value your feedback and suggestions. If you have ideas for improving MadeIt or want to report issues, please reach out:
                            </p>
                            <div className="p-6 bg-white/[0.03] border border-white/10 rounded-xl">
                                <p className="text-white mb-3">
                                    <strong>Support Page:</strong> <a href="/contact-us" className="text-[#4A7BFF] hover:underline">Visit Support</a>
                                </p>
                                <p className="text-white mb-3">
                                    <strong>Email:</strong> <a href="mailto:moinsheikh1303@gmail.com" className="text-[#4A7BFF] hover:underline">moinsheikh1303@gmail.com</a>
                                </p>
                                <p className="text-white">
                                    <strong>Contact Us:</strong> <a href="/contact-us" className="text-[#4A7BFF] hover:underline">Contact Form</a>
                                </p>
                            </div>
                            <p>
                                Your suggestions help us shape the future of MadeIt. Thank you for being part of this journey.
                            </p>
                        </div>
                    </motion.div>

                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Documentation;
