// Mock data for MadeIt landing page

export const portfolioMockData = {
  user: {
    name: "Alex Rivera",
    role: "Product Designer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    status: "Building in public"
  },
  projects: [
    {
      id: 1,
      title: "Design System Rebuild",
      category: "UI/UX",
      progress: 75,
      milestones: 8,
      completedMilestones: 6,
      daysActive: 12,
      status: "In Progress"
    },
    {
      id: 2,
      title: "Mobile App Prototype",
      category: "Product Design",
      progress: 45,
      milestones: 10,
      completedMilestones: 4,
      daysActive: 8,
      status: "In Progress"
    },
    {
      id: 3,
      title: "Brand Identity Kit",
      category: "Branding",
      progress: 100,
      milestones: 6,
      completedMilestones: 6,
      daysActive: 20,
      status: "Completed"
    }
  ],
  recentActivity: [
    {
      id: 1,
      task: "Completed component library documentation",
      project: "Design System Rebuild",
      timestamp: "2 hours ago",
      type: "milestone"
    },
    {
      id: 2,
      task: "Shipped wireframes for onboarding flow",
      project: "Mobile App Prototype",
      timestamp: "5 hours ago",
      type: "task"
    }
  ],
  skills: [
    { name: "Figma", count: 12 },
    { name: "User Research", count: 8 },
    { name: "Prototyping", count: 15 },
    { name: "Design Systems", count: 6 }
  ]
};

export const features = [
  {
    title: "Milestone-based execution",
    description: "Break projects into achievable milestones. Complete them one by one."
  },
  {
    title: "Proof-of-work portfolio",
    description: "Every task completed automatically builds your public portfolio."
  },
  {
    title: "Visible progress tracking",
    description: "See exactly what you've shipped. No fake progress, only real work."
  },
  {
    title: "Public shareable profile",
    description: "Share your proof-of-work with employers, clients, and collaborators."
  }
];

export const howItWorksSteps = [
  {
    number: "01",
    title: "Pick a real project",
    description: "Choose something you want to build. No theory, no courses—just execution."
  },
  {
    number: "02",
    title: "Complete milestone tasks",
    description: "Work through structured milestones. Each one moves you forward."
  },
  {
    number: "03",
    title: "Portfolio updates automatically",
    description: "Your progress becomes proof. Every task contributes to your public profile."
  }
];
