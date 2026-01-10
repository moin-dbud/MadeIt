import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Linkedin, Github, Instagram, MessageCircle, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { EMAIL_CONFIG } from '../config/email';

export default function ContactUs() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [sending, setSending] = useState(false);

    const contactInfo = {
        phone: '+91 7249339058',
        email: 'moinsheikh1303@gmail.com',
        linkedin: 'https://linkedin.com/in/moin-s-sheikh',
        github: 'https://github.com/moin-dbud',
        instagram: 'https://instagram.com/moin__sheikh_18',
        whatsapp: 'https://wa.me/917249339058'
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSending(true);
        setStatus({ type: '', message: '' });

        try {
            const response = await fetch(`${EMAIL_CONFIG.API_BASE_URL}/api/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                setStatus({
                    type: 'success',
                    message: data.message
                });

                // Clear form
                setFormData({
                    name: '',
                    email: '',
                    subject: '',
                    message: ''
                });
            } else {
                setStatus({
                    type: 'error',
                    message: data.message || 'Something went wrong. Please try again.'
                });
            }
        } catch (error) {
            console.error('Form submission error:', error);
            setStatus({
                type: 'error',
                message: 'Failed to send message. Please make sure the email server is running or contact us directly at ' + contactInfo.email
            });
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white">
            {/* Header Section */}
            <section className="relative min-h-[40vh] flex flex-col items-center justify-center px-6 pt-32 pb-16">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-6"
                    >
                        <Mail className="w-4 h-4 text-[#FF6B35]" />
                        <span className="text-sm text-gray-300">Get in Touch</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
                    >
                        Contact Us
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-xl text-gray-400 max-w-2xl mx-auto"
                    >
                        Have questions about MadeIt? We'd love to hear from you.
                    </motion.p>
                </div>
            </section>

            {/* Main Content */}
            <section className="relative py-12 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Contact Information */}
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="space-y-8"
                        >
                            <div>
                                <h2 className="text-3xl font-bold mb-6">Let's Connect</h2>
                                <p className="text-gray-400 leading-relaxed mb-8">
                                    Reach out to us directly via email, phone, or connect with us on social media.
                                    We're here to help you build and showcase your work.
                                </p>
                            </div>

                            {/* Contact Cards */}
                            <div className="space-y-4">
                                {/* Email */}
                                <a
                                    href={`mailto:${contactInfo.email}`}
                                    className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors group"
                                >
                                    <div className="w-12 h-12 rounded-lg bg-[#FF6B35]/20 border border-[#FF6B35]/30 flex items-center justify-center flex-shrink-0 group-hover:bg-[#FF6B35]/30 transition-colors">
                                        <Mail className="w-6 h-6 text-[#FF6B35]" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Email</p>
                                        <p className="text-white font-medium">{contactInfo.email}</p>
                                    </div>
                                </a>

                                {/* Phone */}
                                <a
                                    href={`tel:${contactInfo.phone}`}
                                    className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors group"
                                >
                                    <div className="w-12 h-12 rounded-lg bg-[#FF6B35]/20 border border-[#FF6B35]/30 flex items-center justify-center flex-shrink-0 group-hover:bg-[#FF6B35]/30 transition-colors">
                                        <Phone className="w-6 h-6 text-[#FF6B35]" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Phone</p>
                                        <p className="text-white font-medium">{contactInfo.phone}</p>
                                    </div>
                                </a>

                                {/* WhatsApp */}
                                <a
                                    href={contactInfo.whatsapp}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors group"
                                >
                                    <div className="w-12 h-12 rounded-lg bg-[#FF6B35]/20 border border-[#FF6B35]/30 flex items-center justify-center flex-shrink-0 group-hover:bg-[#FF6B35]/30 transition-colors">
                                        <MessageCircle className="w-6 h-6 text-[#FF6B35]" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">WhatsApp</p>
                                        <p className="text-white font-medium">Message Us</p>
                                    </div>
                                </a>
                            </div>

                            {/* Social Links */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
                                <div className="flex items-center gap-4">
                                    <a
                                        href={contactInfo.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-[#FF6B35]/50 transition-colors group"
                                    >
                                        <Linkedin className="w-5 h-5 text-gray-400 group-hover:text-[#FF6B35]" />
                                    </a>
                                    <a
                                        href={contactInfo.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-[#FF6B35]/50 transition-colors group"
                                    >
                                        <Github className="w-5 h-5 text-gray-400 group-hover:text-[#FF6B35]" />
                                    </a>
                                    <a
                                        href={contactInfo.instagram}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-[#FF6B35]/50 transition-colors group"
                                    >
                                        <Instagram className="w-5 h-5 text-gray-400 group-hover:text-[#FF6B35]" />
                                    </a>
                                </div>
                            </div>
                        </motion.div>

                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl"
                        >
                            <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Name */}
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                                        Your Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B35]/50 transition-colors"
                                        placeholder="John Doe"
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                        Your Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B35]/50 transition-colors"
                                        placeholder="john@example.com"
                                    />
                                </div>

                                {/* Subject */}
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                                        Subject
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B35]/50 transition-colors"
                                        placeholder="How can we help?"
                                    />
                                </div>

                                {/* Message */}
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows="5"
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B35]/50 transition-colors resize-none"
                                        placeholder="Tell us more about your inquiry..."
                                    />
                                </div>

                                {/* Status Message */}
                                {status.message && (
                                    <div
                                        className={`p-4 rounded-lg border flex items-start gap-3 ${status.type === 'success'
                                            ? 'bg-green-500/10 border-green-500/30 text-green-400'
                                            : 'bg-red-500/10 border-red-500/30 text-red-400'
                                            }`}
                                    >
                                        {status.type === 'success' ? (
                                            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                        ) : (
                                            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                        )}
                                        <p className="text-sm">{status.message}</p>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={sending}
                                    className="w-full px-6 py-4 bg-[#FF6B35] hover:bg-[#ff7d4d] disabled:bg-[#FF6B35]/50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    {sending ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            Send Message
                                        </>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Footer Spacing */}
            <div className="h-20" />
        </div>
    );
}
