import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Database, Mail } from 'lucide-react';
import Footer from '../components/Footer';

const PrivacyPolicy = () => {
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
                        <Shield className="w-4 h-4 text-[#4A7BFF]" />
                        <span className="text-sm text-gray-300">Privacy Policy</span>
                    </motion.div>

                    <motion.h1
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6"
                    >
                        Your Privacy Matters
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
                                This Privacy Policy explains how MadeIt collects, uses, stores, and protects your personal information when you use our platform.
                            </p>
                            <p>
                                By using MadeIt, you agree to the terms outlined in this policy. If you do not agree with these terms, please do not use our platform.
                            </p>
                            <p>
                                We are committed to being transparent about how we handle your data. This policy is written in plain language to help you understand your rights and our practices.
                            </p>
                        </div>
                    </motion.div>

                    {/* Information We Collect */}
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
                                <Database className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold">Information We Collect</h2>
                        </div>
                        <div className="space-y-6 text-lg text-gray-400 leading-relaxed">
                            <div>
                                <h3 className="text-xl font-semibold text-white mb-2">Account Information</h3>
                                <p>
                                    When you create an account, we collect basic information such as your name, email address, username, and profile details you choose to provide.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-white mb-2">Content You Submit</h3>
                                <p>
                                    We collect and store the content you submit to MadeIt, including projects, milestones, proofs of work, code commits, links, images, videos, and written reflections. This content forms your public portfolio.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-white mb-2">Usage Data</h3>
                                <p>
                                    We collect basic usage information to understand how our platform is used and to improve the user experience. This may include device type, browser information, IP address, pages visited, and interaction patterns.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* How We Use Information */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeIn}
                        transition={{ duration: 0.6 }}
                        className="space-y-4"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">How We Use Information</h2>
                        <div className="space-y-4 text-lg text-gray-400 leading-relaxed">
                            <p>We use the information we collect to:</p>
                            <ul className="space-y-3 ml-6">
                                <li className="flex items-start gap-3">
                                    <span className="text-[#4A7BFF] mt-1">•</span>
                                    <span>Operate and maintain the MadeIt platform</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[#4A7BFF] mt-1">•</span>
                                    <span>Display your public portfolio and track your progress across projects and milestones</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[#4A7BFF] mt-1">•</span>
                                    <span>Communicate important updates, notifications, and platform changes</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[#4A7BFF] mt-1">•</span>
                                    <span>Improve our services through analytics and user feedback</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[#4A7BFF] mt-1">•</span>
                                    <span>Maintain security, prevent fraud, and enforce our terms of service</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[#4A7BFF] mt-1">•</span>
                                    <span>Respond to support requests and user inquiries</span>
                                </li>
                            </ul>
                        </div>
                    </motion.div>

                    {/* Public vs Private Information */}
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
                                <Eye className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold">Public vs Private Information</h2>
                        </div>
                        <div className="space-y-6 text-lg text-gray-400 leading-relaxed">
                            <div>
                                <h3 className="text-xl font-semibold text-white mb-2">Public Information</h3>
                                <p>
                                    The following information is publicly visible on your portfolio:
                                </p>
                                <ul className="space-y-2 ml-6 mt-3">
                                    <li className="flex items-start gap-3">
                                        <span className="text-[#FF6B35] mt-1">•</span>
                                        <span>Your name, username, and profile details</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-[#FF6B35] mt-1">•</span>
                                        <span>Projects you are working on and have completed</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-[#FF6B35] mt-1">•</span>
                                        <span>Milestones and proofs of work you have submitted</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-[#FF6B35] mt-1">•</span>
                                        <span>Skills derived from completed milestones</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-[#FF6B35] mt-1">•</span>
                                        <span>Any content you explicitly choose to share publicly</span>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-white mb-2">Private Information</h3>
                                <p>
                                    The following information remains private and is not publicly displayed:
                                </p>
                                <ul className="space-y-2 ml-6 mt-3">
                                    <li className="flex items-start gap-3">
                                        <span className="text-[#4A7BFF] mt-1">•</span>
                                        <span>Your email address</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-[#4A7BFF] mt-1">•</span>
                                        <span>Account authentication credentials</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-[#4A7BFF] mt-1">•</span>
                                        <span>Internal platform data and analytics</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-[#4A7BFF] mt-1">•</span>
                                        <span>Private communications with MadeIt support</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </motion.div>

                    {/* Data Storage and Security */}
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
                                <Lock className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold">Data Storage and Security</h2>
                        </div>
                        <div className="space-y-4 text-lg text-gray-400 leading-relaxed">
                            <p>
                                We take reasonable measures to protect your data from unauthorized access, loss, or misuse. Your information is stored securely using industry-standard practices.
                            </p>
                            <p>
                                However, no method of transmission or storage is completely secure. While we strive to protect your data, we cannot guarantee absolute security. You use MadeIt at your own risk.
                            </p>
                            <p>
                                If we become aware of a security breach that affects your data, we will notify you as promptly as possible.
                            </p>
                        </div>
                    </motion.div>

                    {/* Cookies and Tracking */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeIn}
                        transition={{ duration: 0.6 }}
                        className="space-y-4"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Cookies and Tracking</h2>
                        <div className="space-y-4 text-lg text-gray-400 leading-relaxed">
                            <p>
                                MadeIt uses cookies and similar tracking technologies to enhance your experience on the platform. Cookies are small text files stored on your device that help us remember your preferences and understand how you use our platform.
                            </p>
                            <p>
                                We use cookies to:
                            </p>
                            <ul className="space-y-2 ml-6">
                                <li className="flex items-start gap-3">
                                    <span className="text-[#4A7BFF] mt-1">•</span>
                                    <span>Keep you logged in between sessions</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[#4A7BFF] mt-1">•</span>
                                    <span>Remember your preferences and settings</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[#4A7BFF] mt-1">•</span>
                                    <span>Analyze platform usage and performance</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[#4A7BFF] mt-1">•</span>
                                    <span>Improve security and prevent fraud</span>
                                </li>
                            </ul>
                            <p>
                                You can disable cookies in your browser settings, but this may limit your ability to use certain features of MadeIt.
                            </p>
                        </div>
                    </motion.div>

                    {/* Third-Party Services */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeIn}
                        transition={{ duration: 0.6 }}
                        className="space-y-4"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Third-Party Services</h2>
                        <div className="space-y-4 text-lg text-gray-400 leading-relaxed">
                            <p>
                                MadeIt uses third-party services to help operate the platform. These may include:
                            </p>
                            <ul className="space-y-2 ml-6">
                                <li className="flex items-start gap-3">
                                    <span className="text-[#4A7BFF] mt-1">•</span>
                                    <span>Cloud hosting and storage providers</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[#4A7BFF] mt-1">•</span>
                                    <span>Analytics tools to understand platform usage</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[#4A7BFF] mt-1">•</span>
                                    <span>Email service providers for transactional emails</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[#4A7BFF] mt-1">•</span>
                                    <span>Authentication and security services</span>
                                </li>
                            </ul>
                            <p>
                                These third-party services may have access to your data only as necessary to perform their functions. They are not authorized to use your data for other purposes.
                            </p>
                            <p className="text-white font-medium">
                                MadeIt is not responsible for the privacy practices of third-party services. We encourage you to review their privacy policies independently.
                            </p>
                        </div>
                    </motion.div>

                    {/* User Rights */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeIn}
                        transition={{ duration: 0.6 }}
                        className="space-y-4"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">User Rights</h2>
                        <div className="space-y-4 text-lg text-gray-400 leading-relaxed">
                            <p>
                                You have the following rights regarding your personal data:
                            </p>
                            <ul className="space-y-3 ml-6">
                                <li className="flex items-start gap-3">
                                    <span className="text-[#4A7BFF] mt-1">•</span>
                                    <span><strong className="text-white">Access:</strong> You can view and access the data associated with your account at any time through your profile settings.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[#4A7BFF] mt-1">•</span>
                                    <span><strong className="text-white">Update:</strong> You can update your profile information, project details, and other account data directly on the platform.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[#4A7BFF] mt-1">•</span>
                                    <span><strong className="text-white">Delete:</strong> You can request to delete your account and associated data by contacting our support team.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[#4A7BFF] mt-1">•</span>
                                    <span><strong className="text-white">Export:</strong> You can request a copy of your data in a portable format.</span>
                                </li>
                            </ul>
                            <p>
                                To exercise any of these rights, please contact us through the support page or email us at the address provided at the end of this policy.
                            </p>
                        </div>
                    </motion.div>

                    {/* Data Retention */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeIn}
                        transition={{ duration: 0.6 }}
                        className="space-y-4"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Data Retention</h2>
                        <div className="space-y-4 text-lg text-gray-400 leading-relaxed">
                            <p>
                                We retain your personal data for as long as your account is active or as needed to provide you with our services.
                            </p>
                            <p>
                                If you delete your account, we will delete or anonymize your personal information within a reasonable timeframe, unless we are required to retain it for legal, security, or operational purposes.
                            </p>
                            <p>
                                Some data, such as publicly shared portfolio content, may remain visible if it has been shared or accessed by other users before deletion. We will make reasonable efforts to remove your data from public view.
                            </p>
                        </div>
                    </motion.div>

                    {/* Changes to This Policy */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeIn}
                        transition={{ duration: 0.6 }}
                        className="space-y-4"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Changes to This Policy</h2>
                        <div className="space-y-4 text-lg text-gray-400 leading-relaxed">
                            <p>
                                MadeIt may update this Privacy Policy from time to time to reflect changes in our practices, legal requirements, or platform features.
                            </p>
                            <p>
                                When we make significant changes, we will notify you via email or through a notice on the platform. The updated policy will include a new "Last Updated" date at the top of this page.
                            </p>
                            <p>
                                Your continued use of MadeIt after any changes indicates your acceptance of the updated policy.
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
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#4A7BFF] to-[#FF6B35] rounded-lg flex items-center justify-center">
                                <Mail className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold">Contact Information</h2>
                        </div>
                        <div className="space-y-4 text-lg text-gray-400 leading-relaxed">
                            <p>
                                If you have any questions, concerns, or requests regarding this Privacy Policy or how we handle your data, please contact us:
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
                                We will respond to your inquiry as promptly as possible, typically within 5-7 business days.
                            </p>
                        </div>
                    </motion.div>

                </div>
            </section>

            <Footer />
        </div>
    );
};

export default PrivacyPolicy;
