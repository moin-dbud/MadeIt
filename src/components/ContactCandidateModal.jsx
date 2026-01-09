import { useState } from 'react';
import { X, Mail, Building2, User, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/firebase';

/**
 * ContactCandidateModal
 * 
 * Modal for recruiters to contact portfolio owners
 * Captures lead information and sends to portfolio owner
 */
export default function ContactCandidateModal({ isOpen, onClose, portfolioOwnerId, candidateName }) {
    const [formData, setFormData] = useState({
        recruiterName: '',
        recruiterEmail: '',
        company: '',
        message: '',
        isProfessionalOpportunity: false
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.recruiterName.trim()) {
            newErrors.recruiterName = 'Name is required';
        }

        if (!formData.recruiterEmail.trim()) {
            newErrors.recruiterEmail = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.recruiterEmail)) {
            newErrors.recruiterEmail = 'Invalid email format';
        }

        if (!formData.message.trim()) {
            newErrors.message = 'Message is required';
        } else if (formData.message.trim().length < 50) {
            newErrors.message = 'Message must be at least 50 characters';
        }

        if (!formData.isProfessionalOpportunity) {
            newErrors.checkbox = 'Please confirm this is a professional opportunity';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setSubmitting(true);

        try {
            // Save inquiry to Firestore
            await addDoc(collection(db, 'recruiterInquiries'), {
                portfolioOwnerId,
                recruiterName: formData.recruiterName.trim(),
                recruiterEmail: formData.recruiterEmail.trim(),
                company: formData.company.trim() || null,
                message: formData.message.trim(),
                isProfessionalOpportunity: formData.isProfessionalOpportunity,
                timestamp: serverTimestamp(),
                status: 'unread',
                replied: false
            });

            setSubmitted(true);

            // Close modal after 2 seconds
            setTimeout(() => {
                onClose();
                // Reset form
                setTimeout(() => {
                    setFormData({
                        recruiterName: '',
                        recruiterEmail: '',
                        company: '',
                        message: '',
                        isProfessionalOpportunity: false
                    });
                    setSubmitted(false);
                }, 300);
            }, 2000);

        } catch (error) {
            console.error('Error submitting inquiry:', error);
            setErrors({ submit: 'Failed to send message. Please try again.' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!submitting) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full max-w-lg bg-[#0A0A0A] rounded-2xl border border-[rgba(255,255,255,0.08)] p-6 max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    {!submitted ? (
                        <>
                            {/* Header */}
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-semibold mb-2">Contact {candidateName}</h2>
                                    <p className="text-sm text-[#A0A0A0]">
                                        Send a professional inquiry. Candidate's contact details are private.
                                    </p>
                                </div>
                                <button
                                    onClick={handleClose}
                                    disabled={submitting}
                                    className="p-2 hover:bg-[rgba(255,255,255,0.05)] rounded-lg transition-colors disabled:opacity-50"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Recruiter Name */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium mb-2 text-[#A0A0A0]">
                                        <User size={16} />
                                        Your Name *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        value={formData.recruiterName}
                                        onChange={(e) => {
                                            setFormData({ ...formData, recruiterName: e.target.value });
                                            if (errors.recruiterName) setErrors({ ...errors, recruiterName: null });
                                        }}
                                        className={`w-full px-4 py-3 rounded-xl text-sm bg-[rgba(255,255,255,0.05)] border ${errors.recruiterName ? 'border-red-500' : 'border-[rgba(255,255,255,0.08)]'
                                            } outline-none focus:border-[#FF6B35] transition-colors`}
                                    />
                                    {errors.recruiterName && (
                                        <p className="text-xs text-red-500 mt-1">{errors.recruiterName}</p>
                                    )}
                                </div>

                                {/* Recruiter Email */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium mb-2 text-[#A0A0A0]">
                                        <Mail size={16} />
                                        Your Email *
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="john@company.com"
                                        value={formData.recruiterEmail}
                                        onChange={(e) => {
                                            setFormData({ ...formData, recruiterEmail: e.target.value });
                                            if (errors.recruiterEmail) setErrors({ ...errors, recruiterEmail: null });
                                        }}
                                        className={`w-full px-4 py-3 rounded-xl text-sm bg-[rgba(255,255,255,0.05)] border ${errors.recruiterEmail ? 'border-red-500' : 'border-[rgba(255,255,255,0.08)]'
                                            } outline-none focus:border-[#FF6B35] transition-colors`}
                                    />
                                    {errors.recruiterEmail && (
                                        <p className="text-xs text-red-500 mt-1">{errors.recruiterEmail}</p>
                                    )}
                                </div>

                                {/* Company */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium mb-2 text-[#A0A0A0]">
                                        <Building2 size={16} />
                                        Company / Organization
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Acme Inc. (optional)"
                                        value={formData.company}
                                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl text-sm bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] outline-none focus:border-[#FF6B35] transition-colors"
                                    />
                                </div>

                                {/* Message */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium mb-2 text-[#A0A0A0]">
                                        <MessageSquare size={16} />
                                        Message *
                                    </label>
                                    <textarea
                                        rows={5}
                                        placeholder="Tell the candidate about the opportunity... (minimum 50 characters)"
                                        value={formData.message}
                                        onChange={(e) => {
                                            setFormData({ ...formData, message: e.target.value });
                                            if (errors.message) setErrors({ ...errors, message: null });
                                        }}
                                        className={`w-full px-4 py-3 rounded-xl text-sm bg-[rgba(255,255,255,0.05)] border ${errors.message ? 'border-red-500' : 'border-[rgba(255,255,255,0.08)]'
                                            } outline-none focus:border-[#FF6B35] transition-colors resize-none`}
                                    />
                                    <div className="flex justify-between items-center mt-1">
                                        {errors.message && (
                                            <p className="text-xs text-red-500">{errors.message}</p>
                                        )}
                                        <p className={`text-xs ml-auto ${formData.message.length < 50 ? 'text-[#A0A0A0]' : 'text-green-500'
                                            }`}>
                                            {formData.message.length}/50 characters
                                        </p>
                                    </div>
                                </div>

                                {/* Checkbox */}
                                <div className="flex items-start gap-3">
                                    <input
                                        type="checkbox"
                                        checked={formData.isProfessionalOpportunity}
                                        onChange={(e) => {
                                            setFormData({ ...formData, isProfessionalOpportunity: e.target.checked });
                                            if (errors.checkbox) setErrors({ ...errors, checkbox: null });
                                        }}
                                        className={`mt-1 w-4 h-4 rounded border-2 ${errors.checkbox ? 'border-red-500' : 'border-[rgba(255,255,255,0.2)]'
                                            } bg-black/50 cursor-pointer appearance-none checked:bg-[#FF6B35] checked:border-[#FF6B35]`}
                                    />
                                    <label className="text-sm text-[#A0A0A0] leading-relaxed">
                                        I'm contacting regarding a professional opportunity
                                    </label>
                                </div>
                                {errors.checkbox && (
                                    <p className="text-xs text-red-500 -mt-2">{errors.checkbox}</p>
                                )}

                                {/* Privacy Note */}
                                <div className="p-3 rounded-lg bg-[rgba(255,107,53,0.05)] border border-[rgba(255,107,53,0.2)]">
                                    <p className="text-xs text-[#A0A0A0]">
                                        🔒 <span className="text-white">Privacy Protected:</span> Your message will be forwarded to the candidate.
                                        They can choose to respond or share their contact details.
                                    </p>
                                </div>

                                {/* Submit Error */}
                                {errors.submit && (
                                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                                        <p className="text-sm text-red-500">{errors.submit}</p>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-3 rounded-xl bg-[#FF6B35] text-white font-medium hover:bg-[#FF6B35]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitting ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                        </>
                    ) : (
                        /* Success State */
                        <div className="text-center py-8">
                            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                                <Mail size={32} className="text-green-500" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
                            <p className="text-sm text-[#A0A0A0]">
                                Your inquiry has been forwarded to {candidateName}. They'll review and respond if interested.
                            </p>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
