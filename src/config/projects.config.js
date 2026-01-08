// ═══════════════════════════════════════════════════════════════
// MADEIT PROJECTS CONFIGURATION
// Single source of truth for all project data
// ═══════════════════════════════════════════════════════════════

const PROJECTS = [
    {
        projectId: "personal-portfolio",
        name: "Personal Portfolio Website",
        category: "Frontend",
        difficulty: "Beginner",
        estimatedDuration: "3-4 weeks",
        overview: "Build a professional portfolio website to showcase your work, skills, and projects.",
        fullOverview: "Create a responsive, modern portfolio website that serves as your digital presence. Learn HTML, CSS, and JavaScript fundamentals while building a real-world project that you'll actually use. This project covers responsive design, accessibility, and deployment.",
        skills: ["HTML5", "CSS3", "JavaScript", "Responsive Design", "Git", "Deployment"],
        learningOutcomes: [
            "Master HTML structure and semantic markup",
            "Style with CSS including Flexbox and Grid",
            "Implement responsive design principles",
            "Deploy a live website",
            "Use Git for version control"
        ],
        prerequisites: ["Basic understanding of HTML and CSS", "Text editor installed", "GitHub account"],
        milestones: [
            {
                milestoneId: "m1",
                title: "Foundation & Planning",
                description: "Establish project structure and design direction.",
                status: "unlocked",
                tasks: [
                    {
                        taskId: "t1",
                        title: "Create project folder and initialize Git repository",
                        description: "Set up your project directory and initialize version control",
                        expectedOutput: "Project folder with .git initialized",
                        type: "setup",
                        completed: false
                    },
                    {
                        taskId: "t2",
                        title: "Set up basic HTML file structure",
                        description: "Create index.html with proper HTML5 structure",
                        expectedOutput: "Valid HTML5 document with head and body sections",
                        type: "code",
                        completed: false
                    },
                    {
                        taskId: "t3",
                        title: "Write personal bio",
                        description: "Draft your professional bio and introduction text",
                        expectedOutput: "2-3 paragraph bio highlighting your background and goals",
                        type: "content",
                        completed: false
                    },
                    {
                        taskId: "t4",
                        title: "Create wireframe sketch",
                        description: "Design the layout of your portfolio on paper or digital tool",
                        expectedOutput: "Wireframe showing main sections and layout",
                        type: "design",
                        completed: false
                    },
                    {
                        taskId: "t5",
                        title: "Gather content and skills list",
                        description: "Compile all content, projects, and skills to showcase",
                        expectedOutput: "Document with all content organized by section",
                        type: "content",
                        completed: false
                    },
                    {
                        taskId: "t6",
                        title: "Create style guide",
                        description: "Define color palette, typography, and design system",
                        expectedOutput: "Style guide document with colors, fonts, and spacing",
                        type: "design",
                        completed: false
                    }
                ],
                requiredProofs: [
                    {
                        proofId: "p1",
                        type: "github_commit",
                        label: "GitHub Repository Link",
                        description: "Initial commit showing project structure and HTML foundations",
                        why: "Verifies project creation and repository setup",
                        required: true,
                        autoFetch: true
                    },
                    {
                        proofId: "p2",
                        type: "image",
                        label: "Wireframe Image",
                        description: "Screenshot or photo of portfolio layout design",
                        why: "Shows thoughtful planning before coding",
                        required: true,
                        maxFiles: 3
                    },
                    {
                        proofId: "p3",
                        type: "document",
                        label: "Design Document",
                        description: "PDF/image of style guide with color palette, typography, and content plan",
                        why: "Demonstrates professional planning approach",
                        required: true,
                        acceptedFormats: ["pdf", "png", "jpg"]
                    }
                ]
            },
            {
                milestoneId: "m2",
                title: "Core Structure & Setup",
                description: "Build the foundation of the website with core HTML/CSS structure.",
                status: "locked",
                tasks: [
                    {
                        taskId: "t1",
                        title: "Code HTML structure for hero section",
                        description: "Build the hero section HTML with heading, subheading, and CTA",
                        expectedOutput: "Semantic HTML for hero section",
                        type: "code",
                        completed: false
                    },
                    {
                        taskId: "t2",
                        title: "Style hero section with CSS",
                        description: "Apply CSS styling to make hero section visually appealing",
                        expectedOutput: "Styled hero section with proper typography and spacing",
                        type: "code",
                        completed: false
                    },
                    {
                        taskId: "t3",
                        title: "Add professional photo or avatar",
                        description: "Include your profile image in the hero section",
                        expectedOutput: "Profile image displayed with proper styling",
                        type: "content",
                        completed: false
                    },
                    {
                        taskId: "t4",
                        title: "Create CTA button",
                        description: "Add call-to-action button with hover effects",
                        expectedOutput: "Styled button with hover state",
                        type: "code",
                        completed: false
                    },
                    {
                        taskId: "t5",
                        title: "Make hero responsive",
                        description: "Implement responsive design for mobile and tablet",
                        expectedOutput: "Hero section adapts to different screen sizes",
                        type: "code",
                        completed: false
                    },
                    {
                        taskId: "t6",
                        title: "Test across different screen sizes",
                        description: "Verify responsive behavior on multiple devices",
                        expectedOutput: "Screenshots showing responsive design working",
                        type: "testing",
                        completed: false
                    }
                ],
                requiredProofs: [
                    {
                        proofId: "p1",
                        type: "github_commit_range",
                        label: "GitHub Commit Range",
                        description: "Commits showing HTML/CSS progress",
                        why: "Verifies iterative code development",
                        required: true,
                        autoFetch: true
                    },
                    {
                        proofId: "p2",
                        type: "image",
                        label: "Hero Section Screenshots",
                        description: "Both desktop and mobile views",
                        why: "Demonstrates responsive design implementation",
                        required: true,
                        maxFiles: 2
                    },
                    {
                        proofId: "p3",
                        type: "code_snippet",
                        label: "HTML/CSS Code Snippet",
                        description: "Key CSS for responsive design (max 20 lines)",
                        why: "Shows technical understanding of CSS concepts",
                        required: true,
                        maxLines: 20
                    }
                ]
            },
            {
                milestoneId: "m3",
                title: "Feature Development",
                description: "Implement the core content sections and project showcase.",
                status: "locked",
                tasks: [
                    {
                        taskId: "t1",
                        title: "Build 'About Me' section with bio",
                        description: "Create HTML and CSS for about section",
                        expectedOutput: "Styled about section with bio content",
                        type: "code",
                        completed: false
                    },
                    {
                        taskId: "t2",
                        title: "Create skills section with technology badges",
                        description: "Display your skills as badges or cards",
                        expectedOutput: "Visual skills section with icons/badges",
                        type: "code",
                        completed: false
                    },
                    {
                        taskId: "t3",
                        title: "Design project card layout",
                        description: "Create reusable project card component",
                        expectedOutput: "Project card HTML/CSS template",
                        type: "code",
                        completed: false
                    },
                    {
                        taskId: "t4",
                        title: "Add project cards",
                        description: "Populate projects section with your work",
                        expectedOutput: "Multiple project cards with images and descriptions",
                        type: "content",
                        completed: false
                    },
                    {
                        taskId: "t5",
                        title: "Implement hover effects",
                        description: "Add interactive hover states to project cards",
                        expectedOutput: "Smooth hover animations on cards",
                        type: "code",
                        completed: false
                    },
                    {
                        taskId: "t6",
                        title: "Ensure responsive and accessible design",
                        description: "Test responsiveness and add ARIA labels",
                        expectedOutput: "Accessible, responsive sections",
                        type: "testing",
                        completed: false
                    }
                ],
                requiredProofs: [
                    {
                        proofId: "p1",
                        type: "github_commit_range",
                        label: "GitHub Commit Range",
                        description: "Commits showing feature additions",
                        why: "Validates implementation of multiple sections",
                        required: true,
                        autoFetch: true
                    },
                    {
                        proofId: "p2",
                        type: "image",
                        label: "Feature Screenshots",
                        description: "Projects section and skills section",
                        why: "Visual confirmation of working components",
                        required: true,
                        maxFiles: 3
                    },
                    {
                        proofId: "p3",
                        type: "reflection",
                        label: "Short Reflection",
                        description: "Challenges faced and solutions found while building interactive elements (150 words)",
                        why: "Demonstrates problem-solving and technical growth",
                        required: true,
                        minWords: 100,
                        maxWords: 200
                    }
                ]
            },
            {
                milestoneId: "m4",
                title: "Integration & Testing",
                description: "Connect all sections and implement navigation and contact features.",
                status: "locked",
                tasks: [
                    {
                        taskId: "t1",
                        title: "Add navigation bar",
                        description: "Create sticky navigation with section links",
                        expectedOutput: "Functional navigation bar",
                        type: "code",
                        completed: false
                    },
                    {
                        taskId: "t2",
                        title: "Create smooth scroll navigation",
                        description: "Implement smooth scrolling to sections",
                        expectedOutput: "Smooth scroll behavior when clicking nav links",
                        type: "code",
                        completed: false
                    },
                    {
                        taskId: "t3",
                        title: "Build contact section",
                        description: "Add contact form or contact information",
                        expectedOutput: "Contact section with form or links",
                        type: "code",
                        completed: false
                    },
                    {
                        taskId: "t4",
                        title: "Add footer with attribution",
                        description: "Create footer with social links and credits",
                        expectedOutput: "Styled footer section",
                        type: "code",
                        completed: false
                    },
                    {
                        taskId: "t5",
                        title: "Implement SEO meta tags",
                        description: "Add proper meta tags for SEO",
                        expectedOutput: "Complete meta tags in HTML head",
                        type: "code",
                        completed: false
                    },
                    {
                        taskId: "t6",
                        title: "Test all links and navigation flow",
                        description: "Verify all interactive elements work correctly",
                        expectedOutput: "All links and navigation tested and working",
                        type: "testing",
                        completed: false
                    }
                ],
                requiredProofs: [
                    {
                        proofId: "p1",
                        type: "github_commit_range",
                        label: "GitHub Commit Range",
                        description: "Commits for navigation and integration",
                        why: "Shows connecting separate components into cohesive website",
                        required: true,
                        autoFetch: true
                    },
                    {
                        proofId: "p2",
                        type: "video",
                        label: "Navigation Demo",
                        description: "Short screen recording or GIF showing navigation flow",
                        why: "Demonstrates functional interactivity",
                        required: true,
                        maxDuration: 60
                    },
                    {
                        proofId: "p3",
                        type: "image",
                        label: "Browser Testing Screenshots",
                        description: "Website in 2-3 different browsers",
                        why: "Proves cross-browser compatibility testing",
                        required: true,
                        maxFiles: 3
                    }
                ]
            },
            {
                milestoneId: "m5",
                title: "Refinement & Optimization",
                description: "Improve design, fix issues, and optimize for performance.",
                status: "locked",
                tasks: [
                    {
                        taskId: "t1",
                        title: "Fix spacing, alignment, and typography",
                        description: "Polish visual design details",
                        expectedOutput: "Consistent spacing and typography throughout",
                        type: "code",
                        completed: false
                    },
                    {
                        taskId: "t2",
                        title: "Add subtle animations",
                        description: "Implement CSS animations for enhanced UX",
                        expectedOutput: "Smooth animations on scroll or interaction",
                        type: "code",
                        completed: false
                    },
                    {
                        taskId: "t3",
                        title: "Optimize images",
                        description: "Compress and optimize all images",
                        expectedOutput: "Reduced image file sizes",
                        type: "optimization",
                        completed: false
                    },
                    {
                        taskId: "t4",
                        title: "Test accessibility",
                        description: "Run accessibility audit and fix issues",
                        expectedOutput: "Improved accessibility score",
                        type: "testing",
                        completed: false
                    },
                    {
                        taskId: "t5",
                        title: "Validate HTML/CSS",
                        description: "Use W3C validators to check code quality",
                        expectedOutput: "Valid HTML and CSS",
                        type: "testing",
                        completed: false
                    },
                    {
                        taskId: "t6",
                        title: "Cross-browser testing",
                        description: "Test on Chrome, Firefox, Safari, Edge",
                        expectedOutput: "Consistent behavior across browsers",
                        type: "testing",
                        completed: false
                    }
                ],
                requiredProofs: [
                    {
                        proofId: "p1",
                        type: "github_commit_range",
                        label: "GitHub Commit Range",
                        description: "Refinement commits",
                        why: "Shows attention to detail and iterative improvement",
                        required: true,
                        autoFetch: true
                    },
                    {
                        proofId: "p2",
                        type: "image",
                        label: "Before/After Screenshots",
                        description: "Visual comparison showing improvements",
                        why: "Demonstrates UI refinement and polish",
                        required: true,
                        maxFiles: 4
                    },
                    {
                        proofId: "p3",
                        type: "image",
                        label: "Performance Report",
                        description: "Screenshot of Lighthouse or similar tool results",
                        why: "Shows technical awareness of optimization",
                        required: true,
                        maxFiles: 1
                    }
                ]
            },
            {
                milestoneId: "m6",
                title: "Deployment & Launch",
                description: "Make the site live and accessible to the public.",
                status: "locked",
                tasks: [
                    {
                        taskId: "t1",
                        title: "Push final code to GitHub",
                        description: "Ensure all code is committed and pushed",
                        expectedOutput: "All code on GitHub repository",
                        type: "deployment",
                        completed: false
                    },
                    {
                        taskId: "t2",
                        title: "Deploy to hosting platform",
                        description: "Deploy to Netlify, Vercel, or GitHub Pages",
                        expectedOutput: "Live website URL",
                        type: "deployment",
                        completed: false
                    },
                    {
                        taskId: "t3",
                        title: "Configure domain (optional)",
                        description: "Set up custom domain if available",
                        expectedOutput: "Custom domain configured or default URL working",
                        type: "deployment",
                        completed: false
                    },
                    {
                        taskId: "t4",
                        title: "Test live site on devices",
                        description: "Test deployed site on mobile and desktop",
                        expectedOutput: "Site working correctly on live URL",
                        type: "testing",
                        completed: false
                    },
                    {
                        taskId: "t5",
                        title: "Share portfolio link",
                        description: "Share your portfolio on social media or with peers",
                        expectedOutput: "Portfolio shared publicly",
                        type: "content",
                        completed: false
                    },
                    {
                        taskId: "t6",
                        title: "Document deployment process",
                        description: "Write README with deployment instructions",
                        expectedOutput: "README with deployment documentation",
                        type: "documentation",
                        completed: false
                    }
                ],
                requiredProofs: [
                    {
                        proofId: "p1",
                        type: "github_commit",
                        label: "GitHub Final Commit",
                        description: "Deployment-ready code",
                        why: "Confirms project completion",
                        required: true,
                        autoFetch: true
                    },
                    {
                        proofId: "p2",
                        type: "url",
                        label: "Live URL",
                        description: "Link to deployed site",
                        why: "Most critical proof - actual working portfolio",
                        required: true,
                        mustBeAccessible: true
                    },
                    {
                        proofId: "p3",
                        type: "image",
                        label: "Deployment Documentation",
                        description: "Screenshot of deployment process or configuration",
                        why: "Shows understanding of deployment concepts",
                        required: true,
                        maxFiles: 2
                    }
                ]
            }
        ]
    },
    {
        projectId: "task-dashboard",
        name: "Task Management Dashboard",
        category: "Full Stack",
        difficulty: "Intermediate",
        estimatedDuration: "5-6 weeks",
        overview: "Build a full-stack task management application with authentication and CRUD operations.",
        fullOverview: "Create a complete task management system with user authentication, database integration, and a modern frontend. Learn full-stack development by building a real application with backend API, database, and interactive UI.",
        skills: ["React", "Node.js", "Express", "MongoDB", "Authentication", "REST API", "State Management"],
        learningOutcomes: [
            "Build RESTful APIs with Node.js and Express",
            "Implement user authentication with JWT",
            "Work with MongoDB database",
            "Create interactive UI with React",
            "Manage application state effectively",
            "Deploy full-stack applications"
        ],
        prerequisites: ["JavaScript fundamentals", "Basic React knowledge", "Understanding of HTTP and APIs"],
        milestones: [
            {
                milestoneId: "m1",
                title: "Foundation & Planning",
                description: "Define requirements, design the system architecture, and set up the development environment.",
                status: "unlocked",
                tasks: [
                    {
                        taskId: "t1",
                        title: "Define feature requirements",
                        description: "List all features and user stories for the application",
                        expectedOutput: "Feature requirements document",
                        type: "planning",
                        completed: false
                    },
                    {
                        taskId: "t2",
                        title: "Design database schema",
                        description: "Plan database collections and relationships",
                        expectedOutput: "Database schema diagram",
                        type: "design",
                        completed: false
                    },
                    {
                        taskId: "t3",
                        title: "Create architecture diagram",
                        description: "Design system architecture showing frontend, backend, and database",
                        expectedOutput: "Architecture diagram",
                        type: "design",
                        completed: false
                    },
                    {
                        taskId: "t4",
                        title: "Initialize frontend project",
                        description: "Set up React project with necessary dependencies",
                        expectedOutput: "React project initialized",
                        type: "setup",
                        completed: false
                    },
                    {
                        taskId: "t5",
                        title: "Set up backend",
                        description: "Initialize Node.js/Express server",
                        expectedOutput: "Backend server running",
                        type: "setup",
                        completed: false
                    },
                    {
                        taskId: "t6",
                        title: "Configure version control and structure",
                        description: "Set up Git repository with proper folder structure",
                        expectedOutput: "Organized project structure in Git",
                        type: "setup",
                        completed: false
                    }
                ],
                requiredProofs: [
                    {
                        proofId: "p1",
                        type: "github_commit",
                        label: "GitHub Repository Link",
                        description: "Initial commit showing project structure",
                        why: "Verifies project creation with proper organization",
                        required: true,
                        autoFetch: true
                    },
                    {
                        proofId: "p2",
                        type: "image",
                        label: "Architecture Diagram",
                        description: "Visual representation of system design",
                        why: "Demonstrates planning and architectural thinking",
                        required: true,
                        maxFiles: 1
                    },
                    {
                        proofId: "p3",
                        type: "document",
                        label: "Database Schema",
                        description: "ERD or schema design document",
                        why: "Shows data modeling competency",
                        required: true,
                        acceptedFormats: ["pdf", "png", "jpg"]
                    }
                ]
            },
            {
                milestoneId: "m2",
                title: "Core Structure & Setup",
                description: "Build authentication system and user management foundation.",
                status: "locked",
                tasks: [
                    {
                        taskId: "t1",
                        title: "Build signup form",
                        description: "Create user registration form with validation",
                        expectedOutput: "Functional signup form",
                        type: "code",
                        completed: false
                    },
                    {
                        taskId: "t2",
                        title: "Build login form with error handling",
                        description: "Create login form with proper error messages",
                        expectedOutput: "Login form with validation",
                        type: "code",
                        completed: false
                    },
                    {
                        taskId: "t3",
                        title: "Implement authentication logic",
                        description: "Set up JWT authentication on backend",
                        expectedOutput: "Working authentication system",
                        type: "code",
                        completed: false
                    },
                    {
                        taskId: "t4",
                        title: "Create protected routes",
                        description: "Implement route protection based on authentication",
                        expectedOutput: "Protected routes requiring login",
                        type: "code",
                        completed: false
                    },
                    {
                        taskId: "t5",
                        title: "Add logout functionality",
                        description: "Implement logout and token cleanup",
                        expectedOutput: "Working logout feature",
                        type: "code",
                        completed: false
                    },
                    {
                        taskId: "t6",
                        title: "Test authentication flow",
                        description: "Test complete auth flow from signup to logout",
                        expectedOutput: "All auth features tested and working",
                        type: "testing",
                        completed: false
                    }
                ],
                requiredProofs: [
                    {
                        proofId: "p1",
                        type: "github_commit_range",
                        label: "GitHub Commit Range",
                        description: "Commits showing auth implementation",
                        why: "Verifies security-critical code development",
                        required: true,
                        autoFetch: true
                    },
                    {
                        proofId: "p2",
                        type: "video",
                        label: "Auth Flow Demo",
                        description: "Short video or screenshots of working authentication",
                        why: "Proves functional user management system",
                        required: true,
                        maxDuration: 90
                    },
                    {
                        proofId: "p3",
                        type: "code_snippet",
                        label: "Code Snippet",
                        description: "Key authentication code (sanitized, no secrets)",
                        why: "Demonstrates security knowledge and implementation skills",
                        required: true,
                        maxLines: 30
                    }
                ]
            },
            {
                milestoneId: "m3",
                title: "Feature Development",
                description: "Implement core task management functionality.",
                status: "locked",
                tasks: [
                    {
                        taskId: "t1",
                        title: "Design and build task list UI",
                        description: "Create task list component with proper styling",
                        expectedOutput: "Task list UI component",
                        type: "code",
                        completed: false
                    },
                    {
                        taskId: "t2",
                        title: "Implement task creation form",
                        description: "Build form to add new tasks",
                        expectedOutput: "Working task creation",
                        type: "code",
                        completed: false
                    },
                    {
                        taskId: "t3",
                        title: "Add task editing functionality",
                        description: "Allow users to edit existing tasks",
                        expectedOutput: "Task editing feature",
                        type: "code",
                        completed: false
                    },
                    {
                        taskId: "t4",
                        title: "Implement task deletion",
                        description: "Add ability to delete tasks with confirmation",
                        expectedOutput: "Task deletion with confirmation",
                        type: "code",
                        completed: false
                    },
                    {
                        taskId: "t5",
                        title: "Add status toggling",
                        description: "Allow marking tasks as complete/incomplete",
                        expectedOutput: "Status toggle functionality",
                        type: "code",
                        completed: false
                    },
                    {
                        taskId: "t6",
                        title: "Connect frontend to backend API",
                        description: "Integrate all CRUD operations with backend",
                        expectedOutput: "Full CRUD functionality working",
                        type: "code",
                        completed: false
                    }
                ],
                requiredProofs: [
                    {
                        proofId: "p1",
                        type: "github_commit_range",
                        label: "GitHub Commit Range",
                        description: "Commits showing CRUD implementations",
                        why: "Verifies development of core functionality",
                        required: true,
                        autoFetch: true
                    },
                    {
                        proofId: "p2",
                        type: "image",
                        label: "Feature Screenshots",
                        description: "Task creation, editing, and list views",
                        why: "Visual confirmation of working application",
                        required: true,
                        maxFiles: 4
                    },
                    {
                        proofId: "p3",
                        type: "reflection",
                        label: "Short Reflection",
                        description: "Challenges in state management and data flow (150 words)",
                        why: "Demonstrates understanding of frontend architecture concepts",
                        required: true,
                        minWords: 100,
                        maxWords: 200
                    }
                ]
            },
            {
                milestoneId: "m4",
                title: "Integration & Testing",
                description: "Implement advanced features and integrate all components.",
                status: "locked",
                tasks: [
                    {
                        taskId: "t1",
                        title: "Implement task filtering",
                        description: "Add filters for task status (all/active/completed)",
                        expectedOutput: "Working task filters",
                        type: "code",
                        completed: false
                    },
                    {
                        taskId: "t2",
                        title: "Add sorting options",
                        description: "Allow sorting by date, priority, or name",
                        expectedOutput: "Task sorting functionality",
                        type: "code",
                        completed: false
                    },
                    {
                        taskId: "t3",
                        title: "Create categories/tags",
                        description: "Implement task categorization system",
                        expectedOutput: "Category/tag system working",
                        type: "code",
                        completed: false
                    },
                    {
                        taskId: "t4",
                        title: "Build dashboard statistics",
                        description: "Show task completion stats and charts",
                        expectedOutput: "Dashboard with statistics",
                        type: "code",
                        completed: false
                    },
                    {
                        taskId: "t5",
                        title: "Add search functionality",
                        description: "Implement task search feature",
                        expectedOutput: "Working search",
                        type: "code",
                        completed: false
                    },
                    {
                        taskId: "t6",
                        title: "Implement drag-and-drop (optional)",
                        description: "Add drag-and-drop for task reordering",
                        expectedOutput: "Drag-and-drop working or documented as skipped",
                        type: "code",
                        completed: false
                    }
                ],
                requiredProofs: [
                    {
                        proofId: "p1",
                        type: "github_commit_range",
                        label: "GitHub Commit Range",
                        description: "Commits for advanced features",
                        why: "Shows implementation of complex functionality",
                        required: true,
                        autoFetch: true
                    },
                    {
                        proofId: "p2",
                        type: "video",
                        label: "Feature Demo",
                        description: "Short video showing filtering, sorting, and search",
                        why: "Demonstrates functional application with advanced features",
                        required: true,
                        maxDuration: 120
                    },
                    {
                        proofId: "p3",
                        type: "image",
                        label: "API Integration Test",
                        description: "Screenshot of Postman or similar tool showing API testing",
                        why: "Proves backend-frontend integration testing",
                        required: true,
                        maxFiles: 2
                    }
                ]
            },
            {
                milestoneId: "m5",
                title: "Refinement & Optimization",
                description: "Polish UI/UX and enhance user experience.",
                status: "locked",
                tasks: [
                    {
                        taskId: "t1",
                        title: "Implement consistent design system",
                        description: "Apply consistent colors, spacing, and typography",
                        expectedOutput: "Unified design throughout app",
                        type: "code",
                        completed: false
                    },
                    {
                        taskId: "t2",
                        title: "Add loading states and skeletons",
                        description: "Show loading indicators during data fetch",
                        expectedOutput: "Loading states implemented",
                        type: "code",
                        completed: false
                    },
                    {
                        taskId: "t3",
                        title: "Implement notifications",
                        description: "Add success/error notifications for user actions",
                        expectedOutput: "Toast notifications working",
                        type: "code",
                        completed: false
                    },
                    {
                        taskId: "t4",
                        title: "Make app responsive",
                        description: "Ensure app works on mobile and tablet",
                        expectedOutput: "Responsive design implemented",
                        type: "code",
                        completed: false
                    },
                    {
                        taskId: "t5",
                        title: "Add animations and transitions",
                        description: "Implement smooth animations for better UX",
                        expectedOutput: "Polished animations",
                        type: "code",
                        completed: false
                    },
                    {
                        taskId: "t6",
                        title: "Conduct usability testing",
                        description: "Test with real users and gather feedback",
                        expectedOutput: "Usability test results documented",
                        type: "testing",
                        completed: false
                    }
                ],
                requiredProofs: [
                    {
                        proofId: "p1",
                        type: "github_commit_range",
                        label: "GitHub Commit Range",
                        description: "UI refinement commits",
                        why: "Shows iterative UI improvements",
                        required: true,
                        autoFetch: true
                    },
                    {
                        proofId: "p2",
                        type: "image",
                        label: "Before/After UI Comparison",
                        description: "Screenshots showing evolution",
                        why: "Demonstrates UI polish and attention to detail",
                        required: true,
                        maxFiles: 4
                    },
                    {
                        proofId: "p3",
                        type: "image",
                        label: "Mobile Responsiveness",
                        description: "Screenshots across different device sizes",
                        why: "Proves multi-device compatibility",
                        required: true,
                        maxFiles: 3
                    }
                ]
            },
            {
                milestoneId: "m6",
                title: "Deployment & Launch",
                description: "Deploy application and prepare for public use.",
                status: "locked",
                tasks: [
                    {
                        taskId: "t1",
                        title: "Deploy backend",
                        description: "Deploy backend to Heroku, Railway, or similar",
                        expectedOutput: "Backend deployed and accessible",
                        type: "deployment",
                        completed: false
                    },
                    {
                        taskId: "t2",
                        title: "Deploy frontend",
                        description: "Deploy frontend to Netlify, Vercel, or similar",
                        expectedOutput: "Frontend deployed",
                        type: "deployment",
                        completed: false
                    },
                    {
                        taskId: "t3",
                        title: "Configure environment variables",
                        description: "Set up production environment variables",
                        expectedOutput: "Environment properly configured",
                        type: "deployment",
                        completed: false
                    },
                    {
                        taskId: "t4",
                        title: "Write comprehensive README",
                        description: "Document setup, features, and usage",
                        expectedOutput: "Complete README file",
                        type: "documentation",
                        completed: false
                    },
                    {
                        taskId: "t5",
                        title: "Create demo video/GIF",
                        description: "Record walkthrough of key features",
                        expectedOutput: "Demo video created",
                        type: "content",
                        completed: false
                    },
                    {
                        taskId: "t6",
                        title: "Test production build",
                        description: "Verify all features work in production",
                        expectedOutput: "Production app fully tested",
                        type: "testing",
                        completed: false
                    }
                ],
                requiredProofs: [
                    {
                        proofId: "p1",
                        type: "github_commit",
                        label: "GitHub Final Commit",
                        description: "Production-ready code",
                        why: "Confirms project completion and documentation",
                        required: true,
                        autoFetch: true
                    },
                    {
                        proofId: "p2",
                        type: "url",
                        label: "Live URL",
                        description: "Link to deployed application",
                        why: "Critical proof - actual working application",
                        required: true,
                        mustBeAccessible: true
                    },
                    {
                        proofId: "p3",
                        type: "video",
                        label: "Demo Video",
                        description: "Short (1-2 min) walkthrough of key features",
                        why: "Comprehensive proof of functionality",
                        required: true,
                        maxDuration: 120
                    },
                    {
                        proofId: "p4",
                        type: "image",
                        label: "Documentation Screenshot",
                        description: "README or documentation view",
                        why: "Shows thorough project documentation",
                        required: true,
                        maxFiles: 1
                    }
                ]
            }
        ]
    },
    {
        projectId: "ecommerce-api",
        name: "E-Commerce Product API",
        category: "Backend",
        difficulty: "Intermediate",
        estimatedDuration: "5-6 weeks",
        overview: "Build a RESTful API for an e-commerce platform with product management and order processing.",
        fullOverview: "Create a complete backend API for an e-commerce system including authentication, product management, shopping cart, and payment integration. Learn backend development, database design, and API security.",
        skills: ["Node.js", "Express", "MongoDB", "REST API", "Authentication", "Payment Integration", "Testing"],
        learningOutcomes: [
            "Design and implement RESTful APIs",
            "Implement secure authentication and authorization",
            "Work with complex data relationships",
            "Integrate third-party payment services",
            "Write comprehensive API tests",
            "Deploy backend services"
        ],
        prerequisites: ["JavaScript fundamentals", "Basic Node.js knowledge", "Understanding of HTTP and REST"],
        milestones: [
            {
                milestoneId: "m1",
                title: "Foundation & Planning",
                description: "Design the API architecture and data model.",
                status: "unlocked",
                tasks: [
                    { taskId: "t1", title: "Define API requirements", description: "List all endpoints and functionality", expectedOutput: "API requirements document", type: "planning", completed: false },
                    { taskId: "t2", title: "Design database schema", description: "Plan collections for users, products, orders", expectedOutput: "Database schema diagram", type: "design", completed: false },
                    { taskId: "t3", title: "Create Entity Relationship Diagram", description: "Visualize data relationships", expectedOutput: "ERD diagram", type: "design", completed: false },
                    { taskId: "t4", title: "Choose tech stack", description: "Select frameworks and libraries", expectedOutput: "Tech stack documented", type: "planning", completed: false },
                    { taskId: "t5", title: "Set up project structure", description: "Initialize Node.js project with proper structure", expectedOutput: "Project initialized", type: "setup", completed: false },
                    { taskId: "t6", title: "Initialize database", description: "Set up MongoDB connection", expectedOutput: "Database connected", type: "setup", completed: false }
                ],
                requiredProofs: [
                    { proofId: "p1", type: "github_commit", label: "GitHub Repository Link", description: "Initial commit with project structure", why: "Verifies API project setup with proper organization", required: true, autoFetch: true },
                    { proofId: "p2", type: "image", label: "ERD Diagram", description: "Database schema visualization", why: "Shows data modeling skills critical for backend development", required: true, maxFiles: 1 },
                    { proofId: "p3", type: "document", label: "API Specification", description: "OpenAPI/Swagger initial design document", why: "Demonstrates API design thinking and planning", required: true, acceptedFormats: ["pdf", "yaml", "json"] }
                ]
            },
            {
                milestoneId: "m2",
                title: "Core Structure & Setup",
                description: "Implement user authentication and security.",
                status: "locked",
                tasks: [
                    { taskId: "t1", title: "Implement user registration endpoint", description: "POST /api/auth/register", expectedOutput: "Registration endpoint working", type: "code", completed: false },
                    { taskId: "t2", title: "Hash passwords securely", description: "Use bcrypt for password hashing", expectedOutput: "Passwords hashed", type: "code", completed: false },
                    { taskId: "t3", title: "Build login endpoint with JWT", description: "POST /api/auth/login returns JWT", expectedOutput: "Login endpoint working", type: "code", completed: false },
                    { taskId: "t4", title: "Create middleware for protected routes", description: "Auth middleware for route protection", expectedOutput: "Auth middleware implemented", type: "code", completed: false },
                    { taskId: "t5", title: "Implement token refresh", description: "Refresh token endpoint", expectedOutput: "Token refresh working", type: "code", completed: false },
                    { taskId: "t6", title: "Add validation and error handling", description: "Input validation and error responses", expectedOutput: "Validation implemented", type: "code", completed: false }
                ],
                requiredProofs: [
                    { proofId: "p1", type: "github_commit_range", label: "GitHub Commit Range", description: "Commits showing auth implementation", why: "Verifies security-critical code development", required: true, autoFetch: true },
                    { proofId: "p2", type: "image", label: "Postman Collection", description: "Screenshots or exported collection showing auth tests", why: "Proves API testing methodology", required: true, maxFiles: 3 },
                    { proofId: "p3", type: "reflection", label: "Security Code Review", description: "Short document (150 words) explaining security measures implemented", why: "Demonstrates security awareness and implementation", required: true, minWords: 100, maxWords: 200 }
                ]
            },
            {
                milestoneId: "m3",
                title: "Feature Development",
                description: "Build core product management endpoints.",
                status: "locked",
                tasks: [
                    { taskId: "t1", title: "Create product model", description: "Define product schema with validation", expectedOutput: "Product model created", type: "code", completed: false },
                    { taskId: "t2", title: "Build POST endpoint", description: "POST /api/products - Create product", expectedOutput: "Product creation endpoint", type: "code", completed: false },
                    { taskId: "t3", title: "Build GET endpoints with pagination", description: "GET /api/products with pagination", expectedOutput: "Product listing with pagination", type: "code", completed: false },
                    { taskId: "t4", title: "Build single product GET endpoint", description: "GET /api/products/:id", expectedOutput: "Single product retrieval", type: "code", completed: false },
                    { taskId: "t5", title: "Build PUT endpoint", description: "PUT /api/products/:id - Update product", expectedOutput: "Product update endpoint", type: "code", completed: false },
                    { taskId: "t6", title: "Build DELETE endpoint", description: "DELETE /api/products/:id", expectedOutput: "Product deletion endpoint", type: "code", completed: false }
                ],
                requiredProofs: [
                    { proofId: "p1", type: "github_commit_range", label: "GitHub Commit Range", description: "Commits showing endpoint implementations", why: "Verifies RESTful API development", required: true, autoFetch: true },
                    { proofId: "p2", type: "image", label: "API Testing Screenshots", description: "Postman or similar tool showing successful requests", why: "Proves functioning endpoints with proper responses", required: true, maxFiles: 4 },
                    { proofId: "p3", type: "code_snippet", label: "Code Snippet", description: "Key controller code showing RESTful patterns", why: "Demonstrates understanding of API design patterns", required: true, maxLines: 30 }
                ]
            },
            {
                milestoneId: "m4",
                title: "Integration & Testing",
                description: "Implement cart and order processing functionality.",
                status: "locked",
                tasks: [
                    { taskId: "t1", title: "Design cart data structure", description: "Plan cart schema and relationships", expectedOutput: "Cart model designed", type: "design", completed: false },
                    { taskId: "t2", title: "Build cart endpoints", description: "Add/remove items, update quantities", expectedOutput: "Cart CRUD endpoints", type: "code", completed: false },
                    { taskId: "t3", title: "Implement order creation from cart", description: "POST /api/orders from cart", expectedOutput: "Order creation endpoint", type: "code", completed: false },
                    { taskId: "t4", title: "Build order history endpoint", description: "GET /api/orders for user", expectedOutput: "Order history retrieval", type: "code", completed: false },
                    { taskId: "t5", title: "Create order fulfillment flow", description: "Update order status workflow", expectedOutput: "Order status management", type: "code", completed: false },
                    { taskId: "t6", title: "Document order workflow", description: "Create order flow diagram", expectedOutput: "Order workflow documented", type: "documentation", completed: false }
                ],
                requiredProofs: [
                    { proofId: "p1", type: "github_commit_range", label: "GitHub Commit Range", description: "Commits for cart/order features", why: "Shows implementation of business logic in API", required: true, autoFetch: true },
                    { proofId: "p2", type: "image", label: "Integration Test Results", description: "Screenshot of test suite execution", why: "Demonstrates proper testing methodology", required: true, maxFiles: 2 },
                    { proofId: "p3", type: "image", label: "Order Flow Diagram", description: "Visual representation of order processing logic", why: "Shows understanding of complex business processes", required: true, maxFiles: 1 }
                ]
            },
            {
                milestoneId: "m5",
                title: "Refinement & Optimization",
                description: "Integrate payment processing and optimize performance.",
                status: "locked",
                tasks: [
                    { taskId: "t1", title: "Set up payment provider account", description: "Create Stripe/PayPal test account", expectedOutput: "Payment provider configured", type: "setup", completed: false },
                    { taskId: "t2", title: "Install payment SDK", description: "Add payment library to project", expectedOutput: "Payment SDK installed", type: "setup", completed: false },
                    { taskId: "t3", title: "Build payment intent endpoint", description: "Create payment intent for orders", expectedOutput: "Payment intent endpoint", type: "code", completed: false },
                    { taskId: "t4", title: "Implement webhooks", description: "Handle payment confirmation webhooks", expectedOutput: "Webhook handler implemented", type: "code", completed: false },
                    { taskId: "t5", title: "Update order status", description: "Update orders based on payment status", expectedOutput: "Order status automation", type: "code", completed: false },
                    { taskId: "t6", title: "Add error handling", description: "Handle payment failures gracefully", expectedOutput: "Payment error handling", type: "code", completed: false }
                ],
                requiredProofs: [
                    { proofId: "p1", type: "github_commit_range", label: "GitHub Commit Range", description: "Payment integration commits", why: "Shows integration with third-party services", required: true, autoFetch: true },
                    { proofId: "p2", type: "image", label: "Payment Flow Demo", description: "Screenshots or diagrams of payment process", why: "Demonstrates complex integration implementation", required: true, maxFiles: 3 },
                    { proofId: "p3", type: "reflection", label: "Error Handling Documentation", description: "Short document explaining error handling strategy", why: "Shows attention to edge cases and reliability", required: true, minWords: 100, maxWords: 200 }
                ]
            },
            {
                milestoneId: "m6",
                title: "Deployment & Launch",
                description: "Deploy API, document thoroughly, and prepare for production use.",
                status: "locked",
                tasks: [
                    { taskId: "t1", title: "Write unit tests", description: "Test individual functions and methods", expectedOutput: "Unit tests written", type: "testing", completed: false },
                    { taskId: "t2", title: "Write integration tests", description: "Test API endpoints end-to-end", expectedOutput: "Integration tests written", type: "testing", completed: false },
                    { taskId: "t3", title: "Generate API documentation", description: "Create Swagger/OpenAPI docs", expectedOutput: "API documentation generated", type: "documentation", completed: false },
                    { taskId: "t4", title: "Set up CI/CD pipeline", description: "Configure automated testing and deployment", expectedOutput: "CI/CD pipeline configured", type: "deployment", completed: false },
                    { taskId: "t5", title: "Deploy to cloud provider", description: "Deploy to Heroku, Railway, or AWS", expectedOutput: "API deployed to cloud", type: "deployment", completed: false },
                    { taskId: "t6", title: "Configure production environment", description: "Set up environment variables and security", expectedOutput: "Production environment configured", type: "deployment", completed: false }
                ],
                requiredProofs: [
                    { proofId: "p1", type: "github_commit", label: "GitHub Final Commit", description: "Production-ready code", why: "Confirms project completion with tests and documentation", required: true, autoFetch: true },
                    { proofId: "p2", type: "url", label: "Live API URL", description: "Link to deployed API with documentation", why: "Critical proof - actual working API", required: true, mustBeAccessible: true },
                    { proofId: "p3", type: "image", label: "Test Coverage Report", description: "Screenshot showing test coverage", why: "Demonstrates testing discipline", required: true, maxFiles: 1 },
                    { proofId: "p4", type: "image", label: "CI/CD Pipeline", description: "Screenshot of successful pipeline execution", why: "Shows DevOps knowledge", required: true, maxFiles: 1 }
                ]
            }
        ]
    },
    {
        projectId: "content-platform",
        name: "Content Publishing Platform",
        category: "Full Stack",
        difficulty: "Advanced",
        estimatedDuration: "6-8 weeks",
        overview: "Build a full-featured content publishing platform with rich text editing and social features.",
        fullOverview: "Create a complete content management and publishing platform similar to Medium or Dev.to. Implement rich text editing, user profiles, article management, social features, and SEO optimization.",
        skills: ["React", "Node.js", "MongoDB", "Rich Text Editor", "SEO", "Social Features", "Real-time Updates"],
        learningOutcomes: [
            "Implement complex rich text editing",
            "Build content management systems",
            "Implement social features (likes, comments, follows)",
            "Optimize for SEO",
            "Handle real-time updates",
            "Deploy complex full-stack applications"
        ],
        prerequisites: ["Full-stack development experience", "React proficiency", "Backend API knowledge"],
        milestones: [
            {
                milestoneId: "m1",
                title: "Foundation & Planning",
                description: "Define system architecture and prepare development environment.",
                status: "unlocked",
                tasks: [
                    { taskId: "t1", title: "Define feature set", description: "List all platform features and user stories", expectedOutput: "Feature specification document", type: "planning", completed: false },
                    { taskId: "t2", title: "Design database schema", description: "Plan collections for users, articles, comments", expectedOutput: "Database schema diagram", type: "design", completed: false },
                    { taskId: "t3", title: "Create system architecture diagram", description: "Design full-stack architecture", expectedOutput: "Architecture diagram", type: "design", completed: false },
                    { taskId: "t4", title: "Set up frontend framework", description: "Initialize React project with routing", expectedOutput: "Frontend project initialized", type: "setup", completed: false },
                    { taskId: "t5", title: "Set up backend", description: "Initialize Node.js/Express API server", expectedOutput: "Backend server running", type: "setup", completed: false },
                    { taskId: "t6", title: "Initialize database and version control", description: "Set up MongoDB and Git repository", expectedOutput: "Database and Git configured", type: "setup", completed: false }
                ],
                requiredProofs: [
                    { proofId: "p1", type: "github_commit", label: "GitHub Repository Link", description: "Initial commit with project structure", why: "Verifies project creation with proper organization", required: true, autoFetch: true },
                    { proofId: "p2", type: "image", label: "Architecture Diagram", description: "Visual representation of system design", why: "Demonstrates understanding of complex, multi-tier applications", required: true, maxFiles: 1 },
                    { proofId: "p3", type: "document", label: "Feature Specification", description: "Document outlining key platform features", why: "Shows product thinking alongside technical skills", required: true, acceptedFormats: ["pdf", "md", "docx"] }
                ]
            },
            {
                milestoneId: "m2",
                title: "Core Structure & Setup",
                description: "Implement user authentication and profile management.",
                status: "locked",
                tasks: [
                    { taskId: "t1", title: "Implement user registration and login", description: "Build auth system with JWT", expectedOutput: "Working authentication", type: "code", completed: false },
                    { taskId: "t2", title: "Build user profile page", description: "Create profile view and edit page", expectedOutput: "User profile pages", type: "code", completed: false },
                    { taskId: "t3", title: "Add profile editing functionality", description: "Allow users to update their info", expectedOutput: "Profile editing working", type: "code", completed: false },
                    { taskId: "t4", title: "Implement password reset flow", description: "Email-based password reset", expectedOutput: "Password reset functional", type: "code", completed: false },
                    { taskId: "t5", title: "Create public profile view", description: "Public-facing user profiles", expectedOutput: "Public profiles visible", type: "code", completed: false },
                    { taskId: "t6", title: "Add avatar upload", description: "Image upload for profile pictures", expectedOutput: "Avatar upload working", type: "code", completed: false }
                ],
                requiredProofs: [
                    { proofId: "p1", type: "github_commit_range", label: "GitHub Commit Range", description: "Commits showing auth and profile implementation", why: "Verifies user management code development", required: true, autoFetch: true },
                    { proofId: "p2", type: "image", label: "Profile System Screenshots", description: "Registration, login, and profile views", why: "Demonstrates functional user management", required: true, maxFiles: 4 },
                    { proofId: "p3", type: "code_snippet", label: "File Upload Code", description: "Snippet showing secure file handling for avatars", why: "Shows security awareness with file operations", required: true, maxLines: 25 }
                ]
            },
            {
                milestoneId: "m3",
                title: "Feature Development",
                description: "Build the core article creation and editing functionality.",
                status: "locked",
                tasks: [
                    { taskId: "t1", title: "Integrate rich text editor", description: "Add Quill, TinyMCE, or similar editor", expectedOutput: "Rich text editor integrated", type: "code", completed: false },
                    { taskId: "t2", title: "Build article creation form", description: "Form for creating new articles", expectedOutput: "Article creation working", type: "code", completed: false },
                    { taskId: "t3", title: "Implement auto-save drafts", description: "Automatically save work in progress", expectedOutput: "Auto-save functionality", type: "code", completed: false },
                    { taskId: "t4", title: "Add markdown/WYSIWYG support", description: "Support both editing modes", expectedOutput: "Dual editor modes", type: "code", completed: false },
                    { taskId: "t5", title: "Build article preview mode", description: "Preview before publishing", expectedOutput: "Preview functionality", type: "code", completed: false },
                    { taskId: "t6", title: "Implement publishing workflow", description: "Draft → Review → Publish flow", expectedOutput: "Publishing workflow complete", type: "code", completed: false }
                ],
                requiredProofs: [
                    { proofId: "p1", type: "github_commit_range", label: "GitHub Commit Range", description: "Commits showing editor implementation", why: "Verifies complex UI component integration", required: true, autoFetch: true },
                    { proofId: "p2", type: "video", label: "Editor Demo", description: "Short video or screenshots of working editor", why: "Proves functioning rich text capabilities", required: true, maxDuration: 90 },
                    { proofId: "p3", type: "reflection", label: "Short Reflection", description: "Challenges in implementing draft system (150 words)", why: "Demonstrates problem-solving for complex state management", required: true, minWords: 100, maxWords: 200 }
                ]
            },
            {
                milestoneId: "m4",
                title: "Integration & Testing",
                description: "Create article display and discovery features.",
                status: "locked",
                tasks: [
                    { taskId: "t1", title: "Build homepage with article feed", description: "Display recent articles in feed", expectedOutput: "Article feed homepage", type: "code", completed: false },
                    { taskId: "t2", title: "Create article detail page", description: "Full article view with formatting", expectedOutput: "Article detail page", type: "code", completed: false },
                    { taskId: "t3", title: "Implement tag filtering and search", description: "Filter articles by tags and search", expectedOutput: "Search and filter working", type: "code", completed: false },
                    { taskId: "t4", title: "Add pagination/infinite scroll", description: "Handle large article lists", expectedOutput: "Pagination implemented", type: "code", completed: false },
                    { taskId: "t5", title: "Build author profile page", description: "Show author's articles and bio", expectedOutput: "Author profile page", type: "code", completed: false },
                    { taskId: "t6", title: "Optimize for SEO", description: "Add meta tags, structured data", expectedOutput: "SEO optimization complete", type: "code", completed: false }
                ],
                requiredProofs: [
                    { proofId: "p1", type: "github_commit_range", label: "GitHub Commit Range", description: "Commits for article display features", why: "Shows implementation of content discovery system", required: true, autoFetch: true },
                    { proofId: "p2", type: "image", label: "Feature Screenshots", description: "Article feed, detail view, search results", why: "Visual confirmation of functioning content platform", required: true, maxFiles: 4 },
                    { proofId: "p3", type: "image", label: "SEO Implementation", description: "Screenshot of meta tags and SEO structure", why: "Demonstrates technical SEO knowledge", required: true, maxFiles: 2 }
                ]
            },
            {
                milestoneId: "m5",
                title: "Refinement & Optimization",
                description: "Implement social features and interaction capabilities.",
                status: "locked",
                tasks: [
                    { taskId: "t1", title: "Build commenting system", description: "Add comments to articles", expectedOutput: "Commenting functionality", type: "code", completed: false },
                    { taskId: "t2", title: "Implement like/unlike functionality", description: "Users can like articles", expectedOutput: "Like system working", type: "code", completed: false },
                    { taskId: "t3", title: "Add 'follow user' feature", description: "Users can follow authors", expectedOutput: "Follow system implemented", type: "code", completed: false },
                    { taskId: "t4", title: "Display engagement metrics", description: "Show likes, comments, views", expectedOutput: "Metrics displayed", type: "code", completed: false },
                    { taskId: "t5", title: "Implement notifications", description: "Notify users of interactions", expectedOutput: "Notification system", type: "code", completed: false },
                    { taskId: "t6", title: "Add content moderation", description: "Report and moderate content", expectedOutput: "Moderation tools", type: "code", completed: false }
                ],
                requiredProofs: [
                    { proofId: "p1", type: "github_commit_range", label: "GitHub Commit Range", description: "Commits for social features", why: "Shows implementation of interactive components", required: true, autoFetch: true },
                    { proofId: "p2", type: "video", label: "Social Feature Demo", description: "Short video showing comments, likes, follows", why: "Demonstrates working social interactions", required: true, maxDuration: 120 },
                    { proofId: "p3", type: "reflection", label: "Performance Optimization", description: "Document or screenshot showing performance improvements", why: "Shows attention to application speed and responsiveness", required: true, minWords: 100, maxWords: 200 }
                ]
            },
            {
                milestoneId: "m6",
                title: "Deployment & Launch",
                description: "Optimize, deploy, and prepare for production usage.",
                status: "locked",
                tasks: [
                    { taskId: "t1", title: "Implement responsive design", description: "Ensure mobile compatibility", expectedOutput: "Fully responsive platform", type: "code", completed: false },
                    { taskId: "t2", title: "Optimize images", description: "Compress and lazy-load images", expectedOutput: "Image optimization complete", type: "optimization", completed: false },
                    { taskId: "t3", title: "Add loading states and error handling", description: "Improve UX with feedback", expectedOutput: "Loading states implemented", type: "code", completed: false },
                    { taskId: "t4", title: "Write documentation", description: "Create user and developer docs", expectedOutput: "Documentation complete", type: "documentation", completed: false },
                    { taskId: "t5", title: "Deploy frontend and backend", description: "Deploy to production hosting", expectedOutput: "Platform deployed", type: "deployment", completed: false },
                    { taskId: "t6", title: "Set up analytics and monitoring", description: "Add analytics and error tracking", expectedOutput: "Analytics configured", type: "deployment", completed: false }
                ],
                requiredProofs: [
                    { proofId: "p1", type: "github_commit", label: "GitHub Final Commit", description: "Production-ready code", why: "Confirms project completion and documentation", required: true, autoFetch: true },
                    { proofId: "p2", type: "url", label: "Live URL", description: "Link to deployed platform", why: "Critical proof - actual working platform", required: true, mustBeAccessible: true },
                    { proofId: "p3", type: "url", label: "Demo Content", description: "Sample articles published on the platform", why: "Shows complete workflow from creation to publication", required: true, mustBeAccessible: false },
                    { proofId: "p4", type: "image", label: "Performance Report", description: "Lighthouse or similar showing optimized metrics", why: "Demonstrates attention to production quality", required: true, maxFiles: 1 }
                ]
            }
        ]
    }
];

// ═══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Get all available projects
 */
export const getAllProjects = () => {
    return PROJECTS;
};

/**
 * Get a specific project by ID
 */
export const getProjectById = (projectId) => {
    return PROJECTS.find(p => p.projectId === projectId);
};

/**
 * Get milestones for a specific project
 */
export const getMilestones = (projectId) => {
    const project = getProjectById(projectId);
    return project ? project.milestones : [];
};

/**
 * Get a specific milestone
 */
export const getMilestone = (projectId, milestoneId) => {
    const milestones = getMilestones(projectId);
    return milestones.find(m => m.milestoneId === milestoneId);
};

/**
 * Get tasks for a specific milestone
 */
export const getTasks = (projectId, milestoneId) => {
    const milestone = getMilestone(projectId, milestoneId);
    return milestone ? milestone.tasks : [];
};

/**
 * Get required proofs for a milestone
 */
export const getRequiredProofs = (projectId, milestoneId) => {
    const milestone = getMilestone(projectId, milestoneId);
    return milestone ? milestone.requiredProofs : [];
};

/**
 * Calculate project progress based on completed milestones
 */
export const calculateProgress = (projectId, completedMilestones = []) => {
    const milestones = getMilestones(projectId);
    if (milestones.length === 0) return 0;

    const completed = completedMilestones.length;
    const total = milestones.length;

    return Math.round((completed / total) * 100);
};

/**
 * Check if all tasks in a milestone are completed
 */
export const areMilestoneTasksCompleted = (projectId, milestoneId, completedTasks = []) => {
    const tasks = getTasks(projectId, milestoneId);
    if (tasks.length === 0) return false;

    const allCompleted = tasks.every(task => {
        const taskKey = `${milestoneId}-${task.taskId}`;
        return completedTasks.includes(taskKey);
    });

    return allCompleted;
};

/**
 * Get milestone status based on completion
 */
export const getMilestoneStatus = (projectId, milestoneId, completedMilestones = []) => {
    const milestones = getMilestones(projectId);
    const milestoneIndex = milestones.findIndex(m => m.milestoneId === milestoneId);

    if (milestoneIndex === -1) return 'locked';

    // Check if this milestone is completed
    if (completedMilestones.includes(milestoneId)) {
        return 'completed';
    }

    // First milestone is always unlocked
    if (milestoneIndex === 0) {
        return 'unlocked';
    }

    // Check if previous milestone is completed
    const previousMilestone = milestones[milestoneIndex - 1];
    if (completedMilestones.includes(previousMilestone.milestoneId)) {
        return 'unlocked';
    }

    return 'locked';
};

export default PROJECTS;
