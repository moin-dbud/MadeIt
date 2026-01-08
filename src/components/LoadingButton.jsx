import { Loader2 } from "lucide-react";

/**
 * LoadingButton Component
 * 
 * A button that shows loading state with spinner and custom text.
 * Automatically disables during loading to prevent double submission.
 * 
 * @param {Object} props
 * @param {boolean} props.loading - Whether button is in loading state
 * @param {boolean} [props.disabled] - Additional disabled state
 * @param {string} [props.loadingText] - Text to show during loading (e.g., "Saving...")
 * @param {React.ReactNode} props.children - Button content when not loading
 * @param {string} [props.variant] - Button variant: 'primary', 'secondary', 'danger'
 * @param {string} [props.className] - Additional CSS classes
 * @param {Function} [props.onClick] - Click handler
 */
export default function LoadingButton({
    loading = false,
    disabled = false,
    loadingText,
    children,
    variant = 'primary',
    className = '',
    onClick,
    ...props
}) {
    const baseStyles = "px-6 py-3 rounded-xl text-sm font-medium inline-flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";

    const variantStyles = {
        primary: "bg-[#FF6B35] text-white hover:bg-[#FF6B35]/90 hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100",
        secondary: "border border-[rgba(255,255,255,0.1)] text-white hover:bg-[rgba(255,255,255,0.05)]",
        danger: "bg-red-500 text-white hover:bg-red-600 hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100"
    };

    const isDisabled = loading || disabled;

    return (
        <button
            onClick={onClick}
            disabled={isDisabled}
            className={`${baseStyles} ${variantStyles[variant]} ${className}`}
            {...props}
        >
            {loading && (
                <Loader2 size={16} className="animate-spin" />
            )}
            {loading ? (loadingText || children) : children}
        </button>
    );
}
