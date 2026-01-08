import { motion } from "framer-motion";

/**
 * EmptyState Component
 * 
 * A reusable component for displaying empty states with clear user guidance.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.icon - Icon component to display
 * @param {string} props.title - Main heading text
 * @param {string} props.description - Supporting description text (1-2 lines)
 * @param {string} [props.actionLabel] - CTA button text (optional)
 * @param {Function} [props.onAction] - CTA button click handler (optional)
 * @param {React.ReactNode} [props.children] - Additional custom content (optional)
 */
export default function EmptyState({
    icon: Icon,
    title,
    description,
    actionLabel,
    onAction,
    children
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center py-16 px-6 rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)]"
        >
            {/* Icon */}
            {Icon && (
                <div className="w-16 h-16 rounded-full bg-[rgba(255,107,53,0.1)] flex items-center justify-center mx-auto mb-6">
                    <Icon size={28} color="#FF6B35" strokeWidth={1.5} />
                </div>
            )}

            {/* Title */}
            <h3 className="text-xl font-semibold tracking-tight mb-3">
                {title}
            </h3>

            {/* Description */}
            <p className="text-[#A0A0A0] max-w-md mx-auto mb-6 leading-relaxed">
                {description}
            </p>

            {/* CTA Button */}
            {actionLabel && onAction && (
                <button
                    onClick={onAction}
                    className="px-8 py-3.5 cursor-pointer rounded-xl bg-[#FF6B35] text-white text-sm font-medium inline-flex items-center gap-2 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                    {actionLabel}
                </button>
            )}

            {/* Custom Children */}
            {children}
        </motion.div>
    );
}
