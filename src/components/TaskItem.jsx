import { Check, Circle } from "lucide-react";
import { motion } from "framer-motion";

export default function TaskItem({ task, completed, onComplete, disabled }) {
    return (
        <button
            onClick={onComplete}
            disabled={disabled || completed}
            className={`
                w-full p-4 rounded-lg border text-left transition-all
                ${completed
                    ? 'border-green-400/30 bg-green-400/5'
                    : 'border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.02)]'
                }
                ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
            `}
        >
            <div className="flex items-start gap-3">
                {/* Checkbox */}
                <div className={`
                    w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all
                    ${completed
                        ? 'border-green-400 bg-green-400'
                        : 'border-[rgba(255,255,255,0.3)]'
                    }
                `}>
                    {completed && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        >
                            <Check size={14} className="text-white" />
                        </motion.div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <h4 className={`
                        text-sm font-medium mb-1
                        ${completed ? 'text-green-400 line-through' : 'text-white'}
                    `}>
                        {task.title}
                    </h4>
                    <p className="text-xs text-[#A0A0A0] mb-2">
                        {task.description}
                    </p>
                    <div className="flex items-center gap-3 text-xs">
                        <span className={`
                            px-2 py-0.5 rounded
                            ${completed
                                ? 'bg-green-400/20 text-green-400'
                                : 'bg-[rgba(255,255,255,0.1)] text-[#606060]'
                            }
                        `}>
                            {task.type}
                        </span>
                        {task.expectedOutput && (
                            <span className="text-[#606060]">
                                → {task.expectedOutput}
                            </span>
                        )}
                    </div>
                </div>

                {/* Status Badge */}
                {completed && (
                    <span className="px-2 py-1 bg-green-400/20 text-green-400 text-xs font-medium rounded flex-shrink-0">
                        ✓ Completed
                    </span>
                )}
            </div>
        </button>
    );
}
