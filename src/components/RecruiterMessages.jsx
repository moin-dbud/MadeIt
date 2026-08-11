import { useState, useEffect } from 'react';
import { Mail, Building2, Calendar, Eye, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabase/supabase';
import { useAuth } from '../context/AuthContext';

/**
 * RecruiterMessages Component (Supabase)
 * 
 * Displays inbound recruiter inquiries for portfolio owner
 * Shows in Dashboard
 */
export default function RecruiterMessages() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        if (!user) return;

        const fetchMessages = async () => {
            console.log('🔍 Fetching recruiter messages for user:', user.id || user.uid);

            try {
                const userId = user.id || user.uid;
                const { data, error } = await supabase
                    .from('recruiter_inquiries')
                    .select('*')
                    .eq('portfolio_owner_id', userId)
                    .order('created_at', { ascending: false });

                if (error) {
                    console.error('❌ Error fetching recruiter messages:', error);
                    throw error;
                }

                const fetchedMessages = (data || []).map(item => ({
                    id: item.id,
                    portfolioOwnerId: item.portfolio_owner_id,
                    recruiterName: item.recruiter_name,
                    recruiterEmail: item.recruiter_email,
                    company: item.company,
                    message: item.message,
                    isProfessionalOpportunity: item.is_professional_opportunity,
                    status: item.status,
                    replied: item.replied,
                    timestamp: item.created_at
                }));

                console.log('📬 Total messages fetched:', fetchedMessages.length);
                setMessages(fetchedMessages);
            } catch (error) {
                console.error('❌ Error fetching recruiter messages:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, [user]);

    const markAsRead = async (messageId) => {
        try {
            await supabase
                .from('recruiter_inquiries')
                .update({ status: 'read' })
                .eq('id', messageId);

            setMessages(messages.map(msg =>
                msg.id === messageId ? { ...msg, status: 'read' } : msg
            ));
        } catch (error) {
            console.error('Error marking message as read:', error);
        }
    };

    const handleViewMessage = (message) => {
        setSelectedMessage(message);
        if (message.status === 'unread') {
            markAsRead(message.id);
        }
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return 'Recently';
        const date = new Date(timestamp);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString();
    };

    if (loading) {
        return (
            <div className="p-6 mt-10 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)]">
                <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-[rgba(255,255,255,0.05)] rounded w-1/3"></div>
                    <div className="h-20 bg-[rgba(255,255,255,0.05)] rounded"></div>
                    <div className="h-20 bg-[rgba(255,255,255,0.05)] rounded"></div>
                </div>
            </div>
        );
    }

    if (messages.length === 0) {
        return (
            <div className="p-6 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)]">
                <div className="flex items-center gap-3 mb-4">
                    <Mail size={20} className="text-[#FF6B35]" />
                    <h3 className="text-lg font-semibold">Recruiter Messages</h3>
                </div>
                <div className="text-center py-8">
                    <Mail size={48} className="mx-auto mb-4 text-[#A0A0A0]" />
                    <p className="text-sm text-[#A0A0A0]">No messages yet</p>
                    <p className="text-xs text-[#A0A0A0] mt-2">
                        Recruiters can contact you through your public portfolio
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="p-6 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)]">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <Mail size={20} className="text-[#FF6B35]" />
                        <h3 className="text-lg font-semibold">Recruiter Messages</h3>
                        {messages.filter(m => m.status === 'unread').length > 0 && (
                            <span className="px-2 py-1 rounded-full bg-[#FF6B35] text-white text-xs font-medium">
                                {messages.filter(m => m.status === 'unread').length} new
                            </span>
                        )}
                    </div>
                </div>

                <div className="space-y-3">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            onClick={() => handleViewMessage(message)}
                            className={`p-4 rounded-lg border cursor-pointer transition-all hover:bg-[rgba(255,255,255,0.05)] ${message.status === 'unread'
                                ? 'border-[#FF6B35]/30 bg-[rgba(255,107,53,0.05)]'
                                : 'border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)]'
                                }`}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-medium text-sm">{message.recruiterName}</h4>
                                        {message.status === 'unread' && (
                                            <span className="w-2 h-2 rounded-full bg-[#FF6B35]"></span>
                                        )}
                                    </div>
                                    {message.company && (
                                        <div className="flex items-center gap-1 text-xs text-[#A0A0A0] mb-2">
                                            <Building2 size={12} />
                                            {message.company}
                                        </div>
                                    )}
                                    <p className="text-sm text-[#A0A0A0] line-clamp-2">
                                        {message.message}
                                    </p>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <div className="flex items-center gap-1 text-xs text-[#A0A0A0]">
                                        <Calendar size={12} />
                                        {formatDate(message.timestamp)}
                                    </div>
                                    <button className="p-1 hover:bg-[rgba(255,255,255,0.05)] rounded transition-colors">
                                        <Eye size={16} className="text-[#A0A0A0]" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Message Detail Modal */}
            <AnimatePresence>
                {selectedMessage && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={() => setSelectedMessage(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-2xl bg-[#0A0A0A] rounded-2xl border border-[rgba(255,255,255,0.08)] p-6"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h2 className="text-xl font-semibold mb-1">{selectedMessage.recruiterName}</h2>
                                    {selectedMessage.company && (
                                        <div className="flex items-center gap-2 text-sm text-[#A0A0A0]">
                                            <Building2 size={14} />
                                            {selectedMessage.company}
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => setSelectedMessage(null)}
                                    className="p-2 hover:bg-[rgba(255,255,255,0.05)] rounded-lg transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Contact Info */}
                            <div className="mb-6 p-4 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)]">
                                <div className="flex items-center gap-2 text-sm mb-2">
                                    <Mail size={14} className="text-[#FF6B35]" />
                                    <span className="text-[#A0A0A0]">Email:</span>
                                    <a
                                        href={`mailto:${selectedMessage.recruiterEmail}`}
                                        className="text-white hover:text-[#FF6B35] transition-colors"
                                    >
                                        {selectedMessage.recruiterEmail}
                                    </a>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Calendar size={14} className="text-[#FF6B35]" />
                                    <span className="text-[#A0A0A0]">Received:</span>
                                    <span className="text-white">{formatDate(selectedMessage.timestamp)}</span>
                                </div>
                            </div>

                            {/* Message */}
                            <div className="mb-6">
                                <h3 className="text-sm font-medium text-[#A0A0A0] mb-2">Message:</h3>
                                <div className="p-4 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)]">
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                        {selectedMessage.message}
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <a
                                    href={`mailto:${selectedMessage.recruiterEmail}?subject=Re: Professional Opportunity`}
                                    className="flex-1 py-3 rounded-xl bg-[#FF6B35] text-white text-center font-medium hover:bg-[#FF6B35]/90 transition-colors"
                                >
                                    Reply via Email
                                </a>
                                <button
                                    onClick={() => setSelectedMessage(null)}
                                    className="px-6 py-3 rounded-xl border border-[rgba(255,255,255,0.1)] text-white font-medium hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
