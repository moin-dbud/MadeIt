import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Target, CheckCircle2, Users, TrendingUp, Zap } from 'lucide-react';
import Footer from '../components/Footer';

const About = () => {
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white">
            {/* Hero Section */}
            <section className="relative min-h-[70vh] flex flex-col items-center justify-center px-6 pt-32 pb-20">
                <div className="max-w-5xl mx-auto text-center">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-8"
                    >
                        <Zap className="w-4 h-4 text-[#4A7BFF]" />
                        <span className="text-sm text-gray-300">About MadeIt</span>
                    </motion.div>

                    <motion.h1
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.1] mb-6"
                    >
                        Proof of Work.
                        <br />
                        <span className="bg-gradient-to-r from-[#4A7BFF] to-[#FF6B35] bg-clip-text text-transparent">
                            Real Execution.
                        </span>
                    </motion.h1>

                    <motion.p
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
                    >
                        MadeIt is a platform where builders prove their skills through real work. Complete milestone-based projects, submit actual proof, and build a portfolio that shows execution, not claims.
                    </motion.p>
                </div>
            </section>

            {/* What is MadeIt */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeIn}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">What is MadeIt</h2>
                        <div className="space-y-4 text-lg text-gray-400 leading-relaxed">
                            <p>
                                MadeIt is a proof-of-work platform for people who build things.
                            </p>
                            <p>
                                Instead of listing skills on a resume or creating static portfolios, you complete structured projects broken down into milestones. Each milestone requires proof: code commits, live demos, architecture diagrams, or written reflections. Your progress is verified and displayed publicly.
                            </p>
                            <p className="text-white font-medium">
                                The result is a portfolio that shows what you've actually built, not what you claim to know.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* The Problem */}
            <section className="py-20 px-6 bg-white/[0.02]">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeIn}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">The Problem</h2>
                        <div className="space-y-4 text-lg text-gray-400 leading-relaxed">
                            <p>
                                Resumes are outdated. They list skills and job titles, but anyone can write "proficient in React" or "experienced backend developer." There's no proof.
                            </p>
                            <p>
                                Traditional portfolios aren't much better. A few showcase projects with no context about how they were built, what challenges were solved, or whether the work was finished.
                            </p>
                            <p className="text-white font-medium">
                                Online, it's hard to prove you can execute. Credentials and self-reported skills dominate, while real builders struggle to stand out.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* The Solution */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeIn}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">The Solution</h2>
                        <div className="space-y-4 text-lg text-gray-400 leading-relaxed">
                            <p>
                                MadeIt uses milestones and proof.
                            </p>
                            <p>
                                Each project is divided into milestones. Every milestone has specific tasks and required proofs. You can't skip ahead. You can't fake progress.
                            </p>
                            <p>
                                When you complete a milestone, you submit proof: a GitHub commit range showing your code, a deployed URL, screenshots of your work, or a reflection explaining what you learned.
                            </p>
                            <p className="text-white font-medium">
                                Your submissions are verified, and your portfolio updates automatically. Anyone visiting your profile can see exactly what you built, when you built it, and how you proved it.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* How MadeIt Works */}
            <section className="py-20 px-6 bg-white/[0.02]">
                <div className="max-w-5xl mx-auto">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeIn}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">How MadeIt Works</h2>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {[
                            {
                                step: "01",
                                title: "Choose or Start a Project",
                                description: "Browse structured project templates or start your own. Each project is broken into milestones with clear deliverables.",
                                icon: Target
                            },
                            {
                                step: "02",
                                title: "Complete Milestones",
                                description: "Work through each milestone step by step. Build features, solve problems, and make real progress.",
                                icon: Code2
                            },
                            {
                                step: "03",
                                title: "Submit Proof",
                                description: "When a milestone is complete, submit proof. This could be code commits, live links, images, videos, or written reflections.",
                                icon: CheckCircle2
                            },
                            {
                                step: "04",
                                title: "Get Verified and Build Your Portfolio",
                                description: "Your submission is reviewed and verified. Once approved, your portfolio updates publicly with the completed milestone and its proof.",
                                icon: TrendingUp
                            }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-50px" }}
                                variants={fadeIn}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="relative group"
                            >
                                <div className="h-full p-8 bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 rounded-2xl transition-all duration-300">
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 bg-gradient-to-br from-[#4A7BFF] to-[#FF6B35] rounded-xl flex items-center justify-center">
                                                <item.icon className="w-6 h-6 text-white" />
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-sm font-bold text-[#4A7BFF] mb-2">STEP {item.step}</div>
                                            <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                                            <p className="text-gray-400 leading-relaxed">{item.description}</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* What Makes MadeIt Different */}
            <section className="py-20 px-6">
                <div className="max-w-5xl mx-auto">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeIn}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">What Makes MadeIt Different</h2>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {[
                            {
                                title: "Execution over claims",
                                description: "Your portfolio is built from real work, not self-reported skills."
                            },
                            {
                                title: "Proof-first approach",
                                description: "Every milestone requires tangible evidence. No shortcuts."
                            },
                            {
                                title: "Structured milestones",
                                description: "Projects are broken into clear, achievable steps. Progress is measurable."
                            },
                            {
                                title: "Public and transparent",
                                description: "Your portfolio is a living record of what you've built. Anyone can verify your work."
                            }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-50px" }}
                                variants={fadeIn}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="p-6 bg-white/[0.03] border border-white/10 rounded-xl hover:border-[#4A7BFF]/30 transition-all duration-300"
                            >
                                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                                <p className="text-gray-400 leading-relaxed">{item.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Who MadeIt Is For */}
            <section className="py-20 px-6 bg-white/[0.02]">
                <div className="max-w-5xl mx-auto">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeIn}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">Who MadeIt Is For</h2>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                title: "Developers",
                                description: "Show your skills through real code and deployed projects, not generic resumes."
                            },
                            {
                                title: "Students",
                                description: "Build a portfolio that proves you can execute, even without professional experience."
                            },
                            {
                                title: "Freelancers",
                                description: "Demonstrate your abilities with verified work that speaks for itself."
                            },
                            {
                                title: "Indie Builders",
                                description: "Document your journey and showcase consistent progress on real projects."
                            }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-50px" }}
                                variants={fadeIn}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="p-6 bg-white/[0.03] border border-white/10 rounded-xl hover:border-[#FF6B35]/30 transition-all duration-300 text-center"
                            >
                                <h3 className="text-xl font-bold mb-3 text-[#FF6B35]">{item.title}</h3>
                                <p className="text-gray-400 leading-relaxed text-sm">{item.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Vision */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeIn}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Vision</h2>
                        <div className="space-y-4 text-lg text-gray-400 leading-relaxed">
                            <p>
                                We believe proof of work should be the default standard online.
                            </p>
                            <p>
                                Skills aren't proven through credentials or claims. They're proven through execution.
                            </p>
                            <p>
                                MadeIt exists to give builders a place to show their work, track their progress, and prove what they're capable of building.
                            </p>
                            <p>
                                Over time, we want proof-of-work portfolios to replace resumes. We want hiring, collaboration, and recognition to be based on what people have actually built.
                            </p>
                            <p className="text-2xl font-bold text-white">
                                The best way to prove you can build is to build.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6 bg-gradient-to-br from-[#4A7BFF]/10 to-[#FF6B35]/10 border-y border-white/10">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeIn}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to start building?</h2>
                        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
                            Join MadeIt and turn your projects into proof of work.
                        </p>
                        <a
                            href="/projects"
                            className="inline-block px-10 py-5 bg-[#FF6B35] hover:bg-[#ff7d4d] text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105"
                        >
                            Browse Projects
                        </a>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default About;
