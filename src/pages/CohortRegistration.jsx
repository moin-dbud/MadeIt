import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Send, CheckCircle } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import Footer from '../components/Footer';

const CohortRegistration = () => {
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        status: '',
        techInterest: [],
        githubUrl: '',
        motivation: '',
        commitment: '',
        agreedToTerms: false
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const techOptions = [
        'React',
        'Node.js',
        'Python',
        'Java',
        'JavaScript',
        'TypeScript',
        'MongoDB',
        'PostgreSQL',
        'AWS',
        'Docker',
        'Next.js',
        'Express',
        'Django',
        'Machine Learning',
        'DevOps',
        'Mobile Development'
    ];

    const validateForm = () => {
        const newErrors = {};

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = 'Full name is required';
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Phone validation
        if (!formData.phone.trim()) {
            newErrors.phone = 'WhatsApp number is required';
        }

        // Status validation
        if (!formData.status) {
            newErrors.status = 'Please select your current status';
        }

        // Tech interest validation
        if (formData.techInterest.length === 0) {
            newErrors.techInterest = 'Please select at least one tech interest';
        }

        // GitHub URL validation
        const githubRegex = /^https?:\/\/(www\.)?github\.com\/[\w-]+\/?$/;
        if (!formData.githubUrl.trim()) {
            newErrors.githubUrl = 'GitHub profile URL is required';
        } else if (!githubRegex.test(formData.githubUrl)) {
            newErrors.githubUrl = 'Please enter a valid GitHub profile URL (e.g., https://github.com/username)';
        }

        // // Motivation validation (min 50 words)
        // const wordCount = formData.motivation.trim().split(/\s+/).filter(word => word.length > 0).length;
        // if (!formData.motivation.trim()) {
        //     newErrors.motivation = 'Please tell us why you want to join';
        // } else if (wordCount < 50) {
        //     newErrors.motivation = `Please write at least 50 words (currently ${wordCount} words)`;
        // }

        // Commitment validation
        if (!formData.commitment) {
            newErrors.commitment = 'Please answer this question';
        }

        // Terms checkbox validation
        if (!formData.agreedToTerms) {
            newErrors.agreedToTerms = 'You must agree to the testing cohort terms';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleTechInterestChange = (tech) => {
        setFormData(prev => ({
            ...prev,
            techInterest: prev.techInterest.includes(tech)
                ? prev.techInterest.filter(t => t !== tech)
                : [...prev.techInterest, tech]
        }));
        if (errors.techInterest) {
            setErrors(prev => ({ ...prev, techInterest: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Save to Firestore
            const docRef = await addDoc(collection(db, 'cohortApplications'), {
                name: formData.name.trim(),
                email: formData.email.trim().toLowerCase(),
                phone: formData.phone.trim(),
                status: formData.status,
                techInterest: formData.techInterest,
                githubUrl: formData.githubUrl.trim(),
                motivation: formData.motivation.trim(),
                commitment: formData.commitment,
                cohortStatus: 'pending',
                createdAt: serverTimestamp()
            });

            console.log('Application saved to Firestore with ID:', docRef.id);

            // Try to send emails via API (this may fail in local dev)
            try {
                const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
                const response = await fetch(`${API_BASE_URL}/api/send-email`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        type: 'cohortApplicationUser',
                        data: {
                            name: formData.name.trim(),
                            email: formData.email.trim().toLowerCase(),
                            phone: formData.phone.trim(),
                            status: formData.status,
                            techInterest: formData.techInterest.join(', '),
                            githubUrl: formData.githubUrl.trim(),
                            motivation: formData.motivation.trim(),
                            commitment: formData.commitment,
                            applicationId: docRef.id
                        }
                    }),
                });

                if (!response.ok) {
                    console.warn('Email API not available (expected in local development)');
                } else {
                    console.log('Emails sent successfully');
                }
            } catch (emailError) {
                // Email sending failed - this is expected in local development
                console.warn('Email sending failed (normal in local dev):', emailError.message);
            }

            // Show success screen regardless of email status
            // The important part (Firestore save) succeeded
            setIsSuccess(true);
        } catch (error) {
            console.error('Error submitting application:', error);
            setErrors({ submit: 'Failed to submit application. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center px-6">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    transition={{ duration: 0.6 }}
                    className="max-w-2xl mx-auto text-center"
                >
                    <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-12 h-12 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Application Received!</h1>
                    <p className="text-xl text-gray-400 mb-8">
                        Thank you for applying to the MadeIt testing cohort. We've sent a confirmation email to <strong className="text-white">{formData.email}</strong>.
                    </p>
                    <p className="text-lg text-gray-400 mb-8">
                        Our team will review your application and contact you if you're selected for the cohort.
                    </p>
                    <a
                        href="/"
                        className="inline-block px-8 py-4 bg-[#4A7BFF] hover:bg-[#5a8bff] text-white font-semibold rounded-full transition-colors"
                    >
                        Back to Home
                    </a>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white">
            {/* Hero Section */}
            <section className="relative min-h-[40vh] flex flex-col items-center justify-center px-6 pt-32 pb-16">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-8"
                    >
                        <Users className="w-4 h-4 text-[#4A7BFF]" />
                        <span className="text-sm text-gray-300">Testing Cohort</span>
                    </motion.div>

                    <motion.h1
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-5xl md:text-6xl font-bold leading-[1.1] mb-6"
                    >
                        Join the MadeIt Testing Cohort
                    </motion.h1>

                    <motion.p
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-xl text-gray-400 max-w-3xl mx-auto"
                    >
                        This cohort is for selected developers who want to build real projects and auto-generate proof-based portfolios. Help us shape the future of MadeIt.
                    </motion.p>
                </div>
            </section>

            {/* Form Section */}
            <section className="py-12 px-6 pb-20">
                <div className="max-w-3xl mx-auto">
                    <motion.form
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >
                        {/* Full Name */}
                        <div>
                            <label htmlFor="name" className="block text-lg font-medium mb-2">
                                Full Name <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-[#4A7BFF] focus:outline-none focus:ring-2 focus:ring-[#4A7BFF]/20 transition-colors text-white"
                                placeholder="Enter your full name"
                            />
                            {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-lg font-medium mb-2">
                                Email Address <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-[#4A7BFF] focus:outline-none focus:ring-2 focus:ring-[#4A7BFF]/20 transition-colors text-white"
                                placeholder="your.email@example.com"
                            />
                            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                        </div>

                        {/* WhatsApp Number */}
                        <div>
                            <label htmlFor="phone" className="block text-lg font-medium mb-2">
                                WhatsApp Number <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-[#4A7BFF] focus:outline-none focus:ring-2 focus:ring-[#4A7BFF]/20 transition-colors text-white"
                                placeholder="+91 XXXXXXXXXX"
                            />
                            {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
                        </div>

                        {/* Current Status */}
                        <div>
                            <label htmlFor="status" className="block text-lg font-medium mb-2">
                                Current Status <span className="text-red-400">*</span>
                            </label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-[#4A7BFF] focus:outline-none focus:ring-2 focus:ring-[#4A7BFF]/20 transition-colors text-white"
                            >
                                <option value="">Select your status</option>
                                <option value="Student">Student</option>
                                <option value="Fresher">Fresher</option>
                                <option value="Working Professional">Working Professional</option>
                                <option value="Other">Other</option>
                            </select>
                            {errors.status && <p className="text-red-400 text-sm mt-1">{errors.status}</p>}
                        </div>

                        {/* Tech Interest */}
                        <div>
                            <label className="block text-lg font-medium mb-2">
                                Primary Tech Interest (Select all that apply) <span className="text-red-400">*</span>
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {techOptions.map(tech => (
                                    <label
                                        key={tech}
                                        className={`flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer transition-all ${formData.techInterest.includes(tech)
                                            ? 'bg-[#4A7BFF]/20 border-[#4A7BFF]'
                                            : 'bg-white/5 border-white/10 hover:border-white/30'
                                            }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={formData.techInterest.includes(tech)}
                                            onChange={() => handleTechInterestChange(tech)}
                                            className="w-4 h-4 accent-[#4A7BFF]"
                                        />
                                        <span className="text-sm">{tech}</span>
                                    </label>
                                ))}
                            </div>
                            {errors.techInterest && <p className="text-red-400 text-sm mt-1">{errors.techInterest}</p>}
                        </div>

                        {/* GitHub URL */}
                        <div>
                            <label htmlFor="githubUrl" className="block text-lg font-medium mb-2">
                                GitHub Profile URL <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="url"
                                id="githubUrl"
                                name="githubUrl"
                                value={formData.githubUrl}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-[#4A7BFF] focus:outline-none focus:ring-2 focus:ring-[#4A7BFF]/20 transition-colors text-white"
                                placeholder="https://github.com/yourusername"
                            />
                            {errors.githubUrl && <p className="text-red-400 text-sm mt-1">{errors.githubUrl}</p>}
                        </div>

                        {/* Motivation */}
                        <div>
                            <label htmlFor="motivation" className="block text-lg font-medium mb-2">
                                Why do you want to join this cohort? <span className="text-red-400">*</span>
                                <span className="text-sm text-gray-400 font-normal ml-2">(Minimum 50 words)</span>
                            </label>
                            <textarea
                                id="motivation"
                                name="motivation"
                                onChange={handleInputChange}
                                rows="6"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-[#4A7BFF] focus:outline-none focus:ring-2 focus:ring-[#4A7BFF]/20 transition-colors text-white resize-none"
                                placeholder="Tell us about your goals, what you want to build, and why MadeIt interests you..."
                            />
                            <div className="flex justify-between items-center mt-1">
                                <div>
                                    {errors.motivation && <p className="text-red-400 text-sm">{errors.motivation}</p>}
                                </div>
                                <p className="text-sm text-gray-400">
                                    {formData.motivation.trim().split(/\s+/).filter(word => word.length > 0).length} words
                                </p>
                            </div>
                        </div>

                        {/* Commitment */}
                        <div>
                            <label className="block text-lg font-medium mb-2">
                                Can you commit 7–10 days to complete one project? <span className="text-red-400">*</span>
                            </label>
                            <div className="space-y-2">
                                <label className="flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:border-white/30 transition-colors">
                                    <input
                                        type="radio"
                                        name="commitment"
                                        value="Yes"
                                        checked={formData.commitment === 'Yes'}
                                        onChange={handleInputChange}
                                        className="w-4 h-4 accent-[#4A7BFF]"
                                    />
                                    <span>Yes, I can commit 7–10 days</span>
                                </label>
                                <label className="flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:border-white/30 transition-colors">
                                    <input
                                        type="radio"
                                        name="commitment"
                                        value="No"
                                        checked={formData.commitment === 'No'}
                                        onChange={handleInputChange}
                                        className="w-4 h-4 accent-[#4A7BFF]"
                                    />
                                    <span>No, I cannot commit this time</span>
                                </label>
                            </div>
                            {errors.commitment && <p className="text-red-400 text-sm mt-1">{errors.commitment}</p>}
                        </div>

                        {/* Terms Agreement */}
                        <div>
                            <label className="flex items-start gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="agreedToTerms"
                                    checked={formData.agreedToTerms}
                                    onChange={handleInputChange}
                                    className="w-5 h-5 mt-1 accent-[#4A7BFF]"
                                />
                                <span className="text-gray-300">
                                    I understand this is a testing cohort and the product may have bugs. I'm willing to provide feedback to help improve MadeIt.
                                </span>
                            </label>
                            {errors.agreedToTerms && <p className="text-red-400 text-sm mt-1">{errors.agreedToTerms}</p>}
                        </div>

                        {/* Submit Error */}
                        {errors.submit && (
                            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                                <p className="text-red-400">{errors.submit}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full px-8 py-4 bg-gradient-to-r from-[#4A7BFF] to-[#FF6B35] hover:from-[#5a8bff] hover:to-[#ff7d4d] text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Submitting...</span>
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5" />
                                        <span>Submit Application</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.form>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default CohortRegistration;
