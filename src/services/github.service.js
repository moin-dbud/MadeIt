// GitHub API Service for MadeIt Projects Only

const GITHUB_API_BASE = 'https://api.github.com';

/**
 * Extract owner and repo from GitHub URL
 * @param {string} repoUrl - Full GitHub repository URL
 * @returns {object} - { owner, repo } or null
 */
export const parseGitHubUrl = (repoUrl) => {
    if (!repoUrl) return null;

    try {
        // Handle various GitHub URL formats
        // https://github.com/username/repo
        // https://github.com/username/repo.git
        // git@github.com:username/repo.git

        const match = repoUrl.match(/github\.com[\/:]([^\/]+)\/([^\/\.]+)/);
        if (match) {
            return {
                owner: match[1],
                repo: match[2]
            };
        }
        return null;
    } catch (error) {
        console.error('Error parsing GitHub URL:', error);
        return null;
    }
};

/**
 * Fetch commits for a specific repository
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @returns {Promise<Array>} - Array of commits
 */
export const fetchRepoCommits = async (owner, repo) => {
    try {
        const response = await fetch(
            `${GITHUB_API_BASE}/repos/${owner}/${repo}/commits?per_page=100`,
            {
                headers: {
                    'Accept': 'application/vnd.github.v3+json'
                }
            }
        );

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Repository not found or is private');
            }
            throw new Error(`GitHub API error: ${response.status}`);
        }

        const commits = await response.json();
        return commits;
    } catch (error) {
        console.error(`Error fetching commits for ${owner}/${repo}:`, error);
        throw error;
    }
};

/**
 * Analyze commit data for a project
 * @param {Array} commits - Array of commit objects from GitHub API
 * @returns {object} - Analyzed commit data
 */
export const analyzeCommits = (commits) => {
    if (!commits || commits.length === 0) {
        return {
            totalCommits: 0,
            firstCommitDate: null,
            lastCommitDate: null,
            activeDays: 0,
            durationWeeks: 0,
            commitsPerWeek: 0,
            commitsPerDay: 0,
            redFlags: []
        };
    }

    const commitDates = commits.map(c => new Date(c.commit.author.date));
    const firstCommit = new Date(Math.min(...commitDates));
    const lastCommit = new Date(Math.max(...commitDates));

    // Calculate duration in weeks
    const durationMs = lastCommit - firstCommit;
    const durationDays = Math.max(1, Math.ceil(durationMs / (1000 * 60 * 60 * 24)));
    const durationWeeks = Math.max(1, Math.ceil(durationDays / 7));

    // Calculate active days (unique days with commits)
    const uniqueDays = new Set(
        commitDates.map(date => date.toISOString().split('T')[0])
    );
    const activeDays = uniqueDays.size;

    // Calculate commit frequency
    const commitsPerWeek = Math.round((commits.length / durationWeeks) * 10) / 10;
    const commitsPerDay = activeDays > 0 ? Math.round((commits.length / activeDays) * 10) / 10 : 0;

    // Red flag detection
    const redFlags = detectRedFlags(commits, commitDates, activeDays);

    return {
        totalCommits: commits.length,
        firstCommitDate: firstCommit,
        lastCommitDate: lastCommit,
        activeDays,
        durationDays,
        durationWeeks,
        commitsPerWeek,
        commitsPerDay,
        redFlags
    };
};

/**
 * Detect suspicious commit patterns (internal use only)
 * @param {Array} commits - Array of commits
 * @param {Array} commitDates - Array of commit dates
 * @param {number} activeDays - Number of unique days with commits
 * @returns {Array} - Array of red flag strings
 */
const detectRedFlags = (commits, commitDates, activeDays) => {
    const flags = [];

    // Only 1 commit
    if (commits.length === 1) {
        flags.push('single_commit');
    }

    // All commits on same day
    if (activeDays === 1 && commits.length > 5) {
        flags.push('bulk_upload');
    }

    // Poor commit messages
    const poorMessages = commits.filter(c => {
        const msg = c.commit.message.toLowerCase().trim();
        return msg.length < 5 ||
            ['asdf', 'test', 'fix', 'update', 'commit', 'changes'].includes(msg);
    });

    if (poorMessages.length > commits.length * 0.5) {
        flags.push('poor_commit_messages');
    }

    // Very high commits per day (possible bulk)
    if (commits.length / activeDays > 20) {
        flags.push('high_commit_density');
    }

    return flags;
};

/**
 * Fetch and analyze GitHub activity for all MadeIt projects
 * @param {Array} projects - Array of project objects with githubRepo
 * @returns {Promise<object>} - Aggregated GitHub activity data
 */
export const fetchGitHubActivity = async (projects) => {
    const projectActivity = [];
    let totalCommits = 0;
    let totalWeeks = 0;
    let errors = [];

    for (const project of projects) {
        if (!project.githubRepo) continue;

        const parsed = parseGitHubUrl(project.githubRepo);
        if (!parsed) {
            errors.push({
                projectId: project.projectId,
                error: 'Invalid GitHub URL'
            });
            continue;
        }

        try {
            const commits = await fetchRepoCommits(parsed.owner, parsed.repo);
            const analysis = analyzeCommits(commits);

            projectActivity.push({
                projectId: project.projectId,
                projectName: project.name,
                repoUrl: project.githubRepo,
                owner: parsed.owner,
                repo: parsed.repo,
                ...analysis,
                status: project.status || 'ongoing'
            });

            totalCommits += analysis.totalCommits;
            totalWeeks += analysis.durationWeeks;
        } catch (error) {
            errors.push({
                projectId: project.projectId,
                error: error.message
            });
        }
    }

    // Calculate average commit frequency
    const avgCommitsPerWeek = projectActivity.length > 0
        ? Math.round((totalCommits / Math.max(1, totalWeeks)) * 10) / 10
        : 0;

    return {
        projects: projectActivity,
        totalCommits,
        avgCommitsPerWeek,
        lastSynced: new Date().toISOString(),
        errors
    };
};

/**
 * Format duration for display
 * @param {number} weeks - Duration in weeks
 * @returns {string} - Formatted duration
 */
export const formatDuration = (weeks) => {
    if (weeks < 1) return '< 1 week';
    if (weeks === 1) return '1 week';
    if (weeks < 4) return `${weeks} weeks`;

    const months = Math.floor(weeks / 4);
    const remainingWeeks = weeks % 4;

    if (months === 1 && remainingWeeks === 0) return '1 month';
    if (remainingWeeks === 0) return `${months} months`;
    return `${months}mo ${remainingWeeks}w`;
};

/**
 * Format date for display
 * @param {Date} date - Date object
 * @returns {string} - Formatted date
 */
export const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    }).format(date);
};

/**
 * Get time since last sync
 * @param {string} lastSyncedISO - ISO string of last sync time
 * @returns {string} - Human-readable time since sync
 */
export const getTimeSinceSync = (lastSyncedISO) => {
    if (!lastSyncedISO) return 'Never';

    const now = new Date();
    const lastSync = new Date(lastSyncedISO);
    const diffMs = now - lastSync;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
};
