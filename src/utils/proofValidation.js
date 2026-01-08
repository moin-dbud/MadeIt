/**
 * Proof Submission Validation
 * 
 * Utilities for validating milestone proof submissions.
 */

/**
 * Validate a single proof item
 * 
 * @param {Object} proof - The proof object
 * @param {string} proof.type - Proof type: 'commit', 'screenshot', 'video', 'link', 'text'
 * @param {string} proof.value - Proof value/content
 * @param {boolean} proof.required - Whether this proof is required
 * @returns {Object} - { valid: boolean, error: string }
 */
export const validateProof = (proof) => {
    if (!proof) {
        return { valid: false, error: 'Proof is required' };
    }

    const { type, value, required } = proof;

    // If not required and empty, it's valid
    if (!required && !value) {
        return { valid: true, error: null };
    }

    // If required and empty, it's invalid
    if (required && !value) {
        return { valid: false, error: 'This proof is required' };
    }

    // Type-specific validation
    switch (type) {
        case 'commit':
            return validateCommitProof(value);
        case 'screenshot':
            return validateScreenshotProof(value);
        case 'video':
            return validateVideoProof(value);
        case 'link':
            return validateLinkProof(value);
        case 'text':
            return validateTextProof(value);
        default:
            return { valid: true, error: null };
    }
};

/**
 * Validate commit proof (GitHub commit URL or range)
 */
const validateCommitProof = (value) => {
    if (!value || !value.trim()) {
        return { valid: false, error: 'Commit URL or range is required' };
    }

    // Check if it's a valid GitHub commit URL
    const commitUrlPattern = /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w-]+\/commit\/[\w]+\/?$/;
    const commitRangePattern = /^[\w]{7,40}\.\.[\w]{7,40}$/; // SHA range like abc123..def456

    if (commitUrlPattern.test(value) || commitRangePattern.test(value)) {
        return { valid: true, error: null };
    }

    return {
        valid: false,
        error: 'Please enter a valid GitHub commit URL or commit range (e.g., abc123..def456)'
    };
};

/**
 * Validate screenshot proof (URL or file)
 */
const validateScreenshotProof = (value) => {
    if (!value || !value.trim()) {
        return { valid: false, error: 'Screenshot is required' };
    }

    // Check if it's a valid URL
    const urlPattern = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i;
    if (urlPattern.test(value)) {
        return { valid: true, error: null };
    }

    // Check if it's a file path (for uploaded files)
    if (value.startsWith('blob:') || value.startsWith('data:image')) {
        return { valid: true, error: null };
    }

    return {
        valid: false,
        error: 'Please provide a valid screenshot URL or upload an image'
    };
};

/**
 * Validate video proof (URL or file)
 */
const validateVideoProof = (value) => {
    if (!value || !value.trim()) {
        return { valid: false, error: 'Video is required' };
    }

    // Check if it's a valid video URL (YouTube, Vimeo, Loom, etc.)
    const videoUrlPatterns = [
        /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+$/,
        /^https?:\/\/(www\.)?vimeo\.com\/.+$/,
        /^https?:\/\/(www\.)?loom\.com\/.+$/,
        /^https?:\/\/.+\.(mp4|webm|mov)$/i
    ];

    if (videoUrlPatterns.some(pattern => pattern.test(value))) {
        return { valid: true, error: null };
    }

    // Check if it's a file path (for uploaded files)
    if (value.startsWith('blob:') || value.startsWith('data:video')) {
        return { valid: true, error: null };
    }

    return {
        valid: false,
        error: 'Please provide a valid video URL (YouTube, Loom, etc.) or upload a video'
    };
};

/**
 * Validate link proof (general URL)
 */
const validateLinkProof = (value) => {
    if (!value || !value.trim()) {
        return { valid: false, error: 'Link is required' };
    }

    // Check if it's a valid URL
    const urlPattern = /^https?:\/\/.+\..+$/;
    if (urlPattern.test(value)) {
        return { valid: true, error: null };
    }

    return {
        valid: false,
        error: 'Please enter a valid URL (must start with http:// or https://)'
    };
};

/**
 * Validate text proof (description, notes, etc.)
 */
const validateTextProof = (value) => {
    if (!value || !value.trim()) {
        return { valid: false, error: 'Description is required' };
    }

    // Minimum length check
    if (value.trim().length < 10) {
        return {
            valid: false,
            error: 'Please provide at least 10 characters'
        };
    }

    return { valid: true, error: null };
};

/**
 * Validate all proofs for a milestone
 * 
 * @param {Array} proofs - Array of proof objects
 * @returns {Object} - { valid: boolean, errors: Object, missingRequired: Array }
 */
export const validateAllProofs = (proofs) => {
    if (!proofs || proofs.length === 0) {
        return {
            valid: false,
            errors: {},
            missingRequired: ['At least one proof is required']
        };
    }

    const errors = {};
    const missingRequired = [];
    let hasAtLeastOneValid = false;

    proofs.forEach((proof, index) => {
        const validation = validateProof(proof);

        if (!validation.valid) {
            errors[proof.id || index] = validation.error;

            if (proof.required) {
                missingRequired.push(proof.label || `Proof ${index + 1}`);
            }
        } else {
            hasAtLeastOneValid = true;
        }
    });

    return {
        valid: Object.keys(errors).length === 0 && hasAtLeastOneValid,
        errors,
        missingRequired
    };
};

/**
 * Validate commit range for suspicious patterns
 * 
 * @param {Object} commitData - Commit data from GitHub
 * @returns {Object} - { valid: boolean, warnings: Array }
 */
export const validateCommitPattern = (commitData) => {
    if (!commitData || !commitData.commits) {
        return { valid: true, warnings: [] };
    }

    const warnings = [];
    const commits = commitData.commits;

    // Check for too few commits
    if (commits.length < 3) {
        warnings.push('Very few commits detected. Consider making more granular commits to show your progress.');
    }

    // Check for commits all on same day
    if (commits.length > 5) {
        const dates = commits.map(c => new Date(c.date).toDateString());
        const uniqueDates = new Set(dates);

        if (uniqueDates.size === 1) {
            warnings.push('All commits were made on the same day. This might indicate bulk commits rather than incremental progress.');
        }
    }

    // Check for very large commits (potential bulk work)
    const largeCommits = commits.filter(c =>
        (c.additions || 0) + (c.deletions || 0) > 500
    );

    if (largeCommits.length > commits.length * 0.5) {
        warnings.push('Many large commits detected. Consider breaking down work into smaller, focused commits.');
    }

    // Check for generic commit messages
    const genericMessages = ['update', 'fix', 'changes', 'wip', 'test'];
    const genericCommits = commits.filter(c =>
        genericMessages.some(msg =>
            c.message?.toLowerCase().includes(msg) && c.message.length < 15
        )
    );

    if (genericCommits.length > commits.length * 0.7) {
        warnings.push('Many commits have generic messages. Descriptive commit messages help demonstrate your work.');
    }

    return {
        valid: warnings.length === 0,
        warnings
    };
};

/**
 * Check if all milestone tasks are completed
 * 
 * @param {Object} milestone - Milestone object
 * @param {Array} completedTasks - Array of completed task IDs
 * @returns {Object} - { valid: boolean, incompleteTasks: Array }
 */
export const validateMilestoneCompletion = (milestone, completedTasks) => {
    if (!milestone || !milestone.tasks) {
        return { valid: false, incompleteTasks: [] };
    }

    const incompleteTasks = milestone.tasks.filter(task => {
        const taskId = `${milestone.milestoneId}-${task.taskId}`;
        return !completedTasks.includes(taskId);
    });

    return {
        valid: incompleteTasks.length === 0,
        incompleteTasks: incompleteTasks.map(t => t.title)
    };
};
