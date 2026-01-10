import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Users, Shield, Code, AlertCircle, Scale } from 'lucide-react';
import Footer from '../components/Footer';

const TermsOfService = () => {
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const lastUpdated = "January 10, 2026";

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
                        <FileText className="w-4 h-4 text-[#4A7BFF]" />
                        <span className="text-sm text-gray-300">Terms of Service</span>
                    </motion.div>

                    <motion.h1
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6"
                    >
                        Terms of Service
                    </motion.h1>

                    <motion.p
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg text-gray-400 max-w-2xl mx-auto"
                    >
                        Last updated: {lastUpdated}
                    </motion.p>
                </div>
            </section>

            {/* Content Sections */}
            <section className="py-12 px-6">
                <div className="max-w-4xl mx-auto space-y-16">

                    {/* Introduction */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeIn}
                        transition={{ duration: 0.6 }}
                        className="space-y-4"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Introduction</h2>
                        <div className="space-y-4 text-lg text-gray-400 leading-relaxed">
                            <p>
                                Welcome to MadeIt. MadeIt is a platform that helps users build real projects through structured milestones and tasks, submit proof of work, and generate a portfolio based on verified execution.
                            </p>
                            <p>
                                By accessing or using MadeIt, you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use the platform.
                            </p>
                            <p>
                                These terms apply to all users of MadeIt, including those who browse, create accounts, submit projects, or view public portfolios.
                            </p>
                        </div>
                    </motion.div>

                    {/* Eligibility */}
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
                                <Users className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold">Eligibility</h2>
                        </div>
                        <div className="space-y-4 text-lg text-gray-400 leading-relaxed">
                            <p>
                                To use MadeIt, you must:
                            </p>
                            <ul className="space-y-2 ml-6">
                                <li className="flex items-start gap-3">
                                    <span className="text-[#4A7BFF] mt-1">•</span>
                                    <span>Provide accurate and truthful information when creating an account</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[#4A7BFF] mt-1">•</span>
                                    <span>Use MadeIt for individual purposes only</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[#4A7BFF] mt-1">•</span>
                                    <span>Not create multiple accounts to circumvent platform rules</span>
                                </li>
                            </ul>
                            <p>
                                You are responsible for all activity that occurs under your account. MadeIt reserves the right to refuse service to anyone at any time.
                            </p>
                        </div>
                    </motion.div>

                    {/* User Accounts */}
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
                            <h2 className="text-3xl md:text-4xl font-bold">User Accounts</h2>
                        </div>
                        <div className="space-y-4 text-lg text-gray-400 leading-relaxed">
                            <p>
                                You are responsible for maintaining the security of your account and password. MadeIt will not be liable for any loss or damage resulting from your failure to protect your account information.
                            </p>
                            <p>
                                You must provide accurate and complete profile information. Misleading or false information may result in account suspension or termination.
                            </p>
                            <p>
                                If you become aware of unauthorized use of your account, you must notify MadeIt immediately.
                            </p>
                            <p className="text-white font-medium">
                                Accounts found to be misused, used for fraudulent purposes, or in violation of these terms may be suspended or permanently deleted without prior notice.
                            </p>
                        </div>
                    </motion.div>

                    {/* Use of the Platform */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeIn}
                        transition={{ duration: 0.6 }}
                        className="space-y-4"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Use of the Platform</h2>
                        <div className="space-y-6 text-lg text-gray-400 leading-relaxed">
                            <div>
                                <h3 className="text-xl font-semibold text-white mb-2">Allowed Usage</h3>
                                <p>You may use MadeIt to:</p>
                                <ul className="space-y-2 ml-6 mt-3">
                                    <li className="flex items-start gap-3">
                                        <span className="text-[#4A7BFF] mt-1">•</span>
                                        <span>Build and complete real projects</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-[#4A7BFF] mt-1">•</span>
                                        <span>Track your progress through milestones and tasks</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-[#4A7BFF] mt-1">•</span>
                                        <span>Submit proof of work for verification</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-[#4A7BFF] mt-1">•</span>
                                        <span>Create and share a public portfolio showcasing your work</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-[#4A7BFF] mt-1">•</span>
                                        <span>Learn and improve your skills</span>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-white mb-2">Prohibited Activities</h3>
                                <p>You may NOT use MadeIt to:</p>
                                <ul className="space-y-2 ml-6 mt-3">
                                    <li className="flex items-start gap-3">
                                        <span className="text-[#FF6B35] mt-1">•</span>
                                        <span>Submit fake work, plagiarized content, or misrepresent your contributions</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-[#FF6B35] mt-1">•</span>
                                        <span>Abuse or harass other users</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-[#FF6B35] mt-1">•</span>
                                        <span>Exploit platform vulnerabilities or attempt unauthorized access</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-[#FF6B35] mt-1">•</span>
                                        <span>Use automated tools or bots to manipulate the platform</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-[#FF6B35] mt-1">•</span>
                                        <span>Upload malicious code, viruses, or harmful content</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-[#FF6B35] mt-1">•</span>
                                        <span>Violate any applicable laws or regulations</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-[#FF6B35] mt-1">•</span>
                                        <span>Impersonate others or create misleading identities</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </motion.div>

                    {/* Projects, Milestones, and Proof of Work */}
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
                                <Code className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold">Projects, Milestones, and Proof of Work</h2>
                        </div>
                        <div className="space-y-4 text-lg text-gray-400 leading-relaxed">
                            <p>
                                You are responsible for all content you submit to MadeIt, including projects, milestones, code, links, images, videos, and written reflections.
                            </p>
                            <p>
                                All proof of work you submit must represent real work that you have completed. Submitting fake, copied, or misrepresented work is strictly prohibited.
                            </p>
                            <p>
                                MadeIt may review, verify, or reject submissions at its discretion. Verification of your work does not constitute an endorsement, guarantee of quality, or promise of employment or opportunity.
                            </p>
                            <p>
                                MadeIt is not responsible for verifying the accuracy, correctness, or completeness of your submissions. The verification process is intended to confirm that proof has been submitted, not to assess the technical quality of your work.
                            </p>
                            <p className="text-white font-medium">
                                Repeated submission of false or misleading content may result in account suspension or termination.
                            </p>
                        </div>
                    </motion.div>

                    {/* Public Portfolios */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeIn}
                        transition={{ duration: 0.6 }}
                        className="space-y-4"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Public Portfolios</h2>
                        <div className="space-y-4 text-lg text-gray-400 leading-relaxed">
                            <p>
                                When you create a portfolio on MadeIt, some or all of your profile information, projects, milestones, and proofs may be publicly visible to anyone on the internet.
                            </p>
                            <p>
                                You have control over what content is displayed on your portfolio through your account settings. However, once content is made public, other users may view, reference, or link to it.
                            </p>
                            <p>
                                MadeIt is not responsible for how others use, share, or interpret the content you make publicly available. You should carefully consider what information you choose to display publicly.
                            </p>
                            <p className="text-white font-medium">
                                Do not include sensitive, private, or confidential information in your public portfolio.
                            </p>
                        </div>
                    </motion.div>

                    {/* Content Ownership */}
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
                                <Scale className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold">Content Ownership</h2>
                        </div>
                        <div className="space-y-4 text-lg text-gray-400 leading-relaxed">
                            <p>
                                You retain full ownership of all content you create and submit to MadeIt, including projects, code, images, videos, and written work.
                            </p>
                            <p>
                                By using MadeIt, you grant the platform a non-exclusive, worldwide license to display, store, and distribute your content as necessary to operate the platform and provide services to you. This includes displaying your portfolio publicly if you choose to make it public.
                            </p>
                            <p className="text-white font-medium">
                                MadeIt will not claim ownership of your projects or use your work for purposes outside of operating the platform.
                            </p>
                            <p>
                                If you delete your account or remove content, MadeIt will make reasonable efforts to remove it from public view. However, cached or archived versions may remain temporarily.
                            </p>
                        </div>
                    </motion.div>

                    {/* Platform Availability */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeIn}
                        transition={{ duration: 0.6 }}
                        className="space-y-4"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Platform Availability</h2>
                        <div className="space-y-4 text-lg text-gray-400 leading-relaxed">
                            <p>
                                MadeIt is provided on an "as is" and "as available" basis. The platform may be updated, modified, paused, or discontinued at any time without prior notice.
                            </p>
                            <p>
                                We do not guarantee that MadeIt will always be available, error-free, or uninterrupted. Features may change or be removed as the platform evolves.
                            </p>
                            <p>
                                MadeIt may perform maintenance, updates, or changes to the platform that temporarily affect availability or functionality.
                            </p>
                            <p className="text-white font-medium">
                                You are responsible for backing up any content or data you create on MadeIt. MadeIt is not responsible for data loss.
                            </p>
                        </div>
                    </motion.div>

                    {/* Termination */}
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
                                <AlertCircle className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold">Termination</h2>
                        </div>
                        <div className="space-y-4 text-lg text-gray-400 leading-relaxed">
                            <p>
                                MadeIt reserves the right to suspend or terminate your account at any time for violations of these Terms of Service, misuse of the platform, or for any other reason at our discretion.
                            </p>
                            <p>
                                You may voluntarily delete your account at any time through your account settings or by contacting support.
                            </p>
                            <p>
                                Upon termination or deletion, your access to MadeIt will be revoked. Publicly visible content may be removed, although cached or archived versions may persist temporarily.
                            </p>
                            <p>
                                Provisions of these terms that by their nature should survive termination will remain in effect, including content ownership, disclaimers, and limitations of liability.
                            </p>
                        </div>
                    </motion.div>

                    {/* Limitation of Liability */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeIn}
                        transition={{ duration: 0.6 }}
                        className="space-y-4"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Limitation of Liability</h2>
                        <div className="space-y-4 text-lg text-gray-400 leading-relaxed">
                            <p>
                                MadeIt is provided "as is" without warranties of any kind, either express or implied. We make no guarantees about the functionality, reliability, or outcomes of using the platform.
                            </p>
                            <p>
                                MadeIt is not responsible for:
                            </p>
                            <ul className="space-y-2 ml-6">
                                <li className="flex items-start gap-3">
                                    <span className="text-[#4A7BFF] mt-1">•</span>
                                    <span>Any losses, damages, or consequences resulting from your use of the platform</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[#4A7BFF] mt-1">•</span>
                                    <span>Hiring decisions, job opportunities, or career outcomes based on your portfolio</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[#4A7BFF] mt-1">•</span>
                                    <span>The accuracy, quality, or completeness of user-submitted content</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[#4A7BFF] mt-1">•</span>
                                    <span>Data loss, service interruptions, or technical issues</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[#4A7BFF] mt-1">•</span>
                                    <span>Actions taken by other users or third parties</span>
                                </li>
                            </ul>
                            <p className="text-white font-medium">
                                To the maximum extent permitted by law, MadeIt's total liability to you for any claims arising from your use of the platform is limited to the amount you have paid to MadeIt, if any.
                            </p>
                            <p>
                                You use MadeIt at your own risk. MadeIt does not guarantee that using the platform will result in employment, opportunities, or any specific outcome.
                            </p>
                        </div>
                    </motion.div>

                    {/* Changes to the Terms */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeIn}
                        transition={{ duration: 0.6 }}
                        className="space-y-4"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Changes to the Terms</h2>
                        <div className="space-y-4 text-lg text-gray-400 leading-relaxed">
                            <p>
                                MadeIt may update or modify these Terms of Service at any time. When significant changes are made, we will notify you via email or through a notice on the platform.
                            </p>
                            <p>
                                The updated terms will include a new "Last Updated" date at the top of this page.
                            </p>
                            <p className="text-white font-medium">
                                Your continued use of MadeIt after changes are made constitutes your acceptance of the updated terms. If you do not agree with the new terms, you should stop using the platform.
                            </p>
                        </div>
                    </motion.div>

                    {/* Contact Information */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeIn}
                        transition={{ duration: 0.6 }}
                        className="space-y-4 pb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Contact Information</h2>
                        <div className="space-y-4 text-lg text-gray-400 leading-relaxed">
                            <p>
                                If you have questions, concerns, or feedback about these Terms of Service, please contact us:
                            </p>
                            <div className="p-6 bg-white/[0.03] border border-white/10 rounded-xl">
                                <p className="text-white mb-3">
                                    <strong>Email:</strong> <a href="mailto:moinsheikh1303@gmail.com" className="text-[#4A7BFF] hover:underline">moinsheikh1303@gmail.com</a>
                                </p>
                                <p className="text-white">
                                    <strong>Support Page:</strong> <a href="/contact-us" className="text-[#4A7BFF] hover:underline">Contact Us</a>
                                </p>
                            </div>
                            <p className="text-sm text-gray-500 mt-6">
                                We will respond to your inquiry as promptly as possible.
                            </p>
                        </div>
                    </motion.div>

                </div>
            </section>

            <Footer />
        </div>
    );
};

export default TermsOfService;
