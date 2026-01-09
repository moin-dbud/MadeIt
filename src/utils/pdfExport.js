import jsPDF from 'jspdf';

/**
 * Generate ATS-Ready PDF from Portfolio Data
 * 
 * Creates a clean, text-first PDF optimized for ATS systems
 * Uses only public portfolio data
 */

export const generatePortfolioPDF = (userData, projects, skills, workMetrics) => {
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    // Page settings
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let yPos = margin;

    // Colors
    const primaryColor = [255, 107, 53]; // #FF6B35
    const textColor = [0, 0, 0];
    const grayColor = [128, 128, 128];

    // Helper: Add new page if needed
    const checkPageBreak = (requiredSpace = 20) => {
        if (yPos + requiredSpace > pageHeight - margin) {
            doc.addPage();
            yPos = margin;
            return true;
        }
        return false;
    };

    // Helper: Add text with word wrap
    const addText = (text, fontSize, color = textColor, isBold = false, maxWidth = contentWidth) => {
        doc.setFontSize(fontSize);
        doc.setTextColor(...color);
        doc.setFont('helvetica', isBold ? 'bold' : 'normal');

        const lines = doc.splitTextToSize(text, maxWidth);
        lines.forEach(line => {
            checkPageBreak();
            doc.text(line, margin, yPos);
            yPos += fontSize * 0.5;
        });
    };

    // Helper: Add link
    const addLink = (text, url, fontSize = 10) => {
        doc.setFontSize(fontSize);
        doc.setTextColor(...primaryColor);
        doc.textWithLink(text, margin, yPos, { url });
        yPos += fontSize * 0.5;
    };

    // Helper: Add section divider
    const addDivider = () => {
        yPos += 3;
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, yPos, pageWidth - margin, yPos);
        yPos += 5;
    };

    // ==================== 1. HEADER ====================
    addText(userData?.name || userData?.profile?.fullName || 'Portfolio', 24, textColor, true);
    yPos += 2;

    // Role/Title
    if (userData?.profile?.bio) {
        addText(userData.profile.bio, 11, grayColor);
        yPos += 2;
    }

    // Portfolio URL
    const username = userData?.profile?.username || '';
    const portfolioUrl = `https://madeit-app.vercel.app/portfolio/${username}`;
    addLink(`Portfolio: ${portfolioUrl}`, portfolioUrl, 9);
    yPos += 2;

    // Social Links
    if (userData?.socials?.github) {
        addLink(`GitHub: ${userData.socials.github}`, userData.socials.github, 9);
    }
    if (userData?.socials?.linkedin) {
        addLink(`LinkedIn: ${userData.socials.linkedin}`, userData.socials.linkedin, 9);
    }

    yPos += 3;
    addDivider();

    // ==================== 2. PROJECT SUMMARY ====================
    addText('Summary', 16, textColor, true);
    yPos += 2;

    const completedProjects = projects?.filter(p => p.completed)?.length || 0;
    addText(`Projects Completed: ${completedProjects}`, 10);
    addText(`Active Days: ${workMetrics?.totalActiveDays || 0}`, 10);
    addText(`Last Updated: ${new Date().toLocaleDateString()}`, 10);

    yPos += 3;
    addDivider();

    // ==================== 3. PROJECTS (CORE SECTION) ====================
    addText('Projects', 16, textColor, true);
    yPos += 3;

    const completedProjectsList = projects?.filter(p => p.completed) || [];

    completedProjectsList.forEach((project, index) => {
        checkPageBreak(40);

        // Project Name
        addText(`${index + 1}. ${project.name}`, 12, textColor, true);
        yPos += 1;

        // Category + Duration
        const category = project.category || 'Project';
        const duration = project.duration || 'N/A';
        addText(`${category} • ${duration}`, 9, grayColor);
        yPos += 1;

        // Description
        if (project.description) {
            addText(project.description, 9);
            yPos += 1;
        }

        // Tech Stack
        if (project.techStack && project.techStack.length > 0) {
            addText(`Tech Stack: ${project.techStack.join(', ')}`, 9, grayColor);
            yPos += 1;
        }

        // Status
        addText(`Status: ${project.completed ? 'Completed' : 'In Progress'}`, 9, grayColor);
        yPos += 1;

        // Links
        if (project.liveDemo) {
            addLink(`Live Demo: ${project.liveDemo}`, project.liveDemo, 9);
        }
        if (project.github) {
            addLink(`Repository: ${project.github}`, project.github, 9);
        }

        // Milestones
        const completedMilestones = project.milestones?.filter(m => m.completed) || [];
        if (completedMilestones.length > 0) {
            yPos += 1;
            addText('Key Milestones:', 9, textColor, true);
            completedMilestones.forEach(milestone => {
                addText(`  • ${milestone.title}`, 9);
            });
        }

        yPos += 5;
    });

    if (completedProjectsList.length === 0) {
        addText('No completed projects yet.', 10, grayColor);
        yPos += 5;
    }

    addDivider();

    // ==================== 4. SKILLS PROVEN BY WORK ====================
    checkPageBreak(30);
    addText('Skills Proven by Work', 16, textColor, true);
    yPos += 3;

    if (skills && skills.length > 0) {
        // Categorize skills
        const frontend = skills.filter(s => ['React', 'Vue', 'Angular', 'HTML', 'CSS', 'JavaScript', 'TypeScript', 'Tailwind'].some(tech => s.includes(tech)));
        const backend = skills.filter(s => ['Node', 'Express', 'Python', 'Django', 'Flask', 'Java', 'Spring', 'PHP', 'Laravel', 'Ruby', 'Rails'].some(tech => s.includes(tech)));
        const tools = skills.filter(s => !frontend.includes(s) && !backend.includes(s));

        if (frontend.length > 0) {
            addText('Frontend:', 10, textColor, true);
            addText(frontend.join(', '), 9);
            yPos += 2;
        }

        if (backend.length > 0) {
            addText('Backend:', 10, textColor, true);
            addText(backend.join(', '), 9);
            yPos += 2;
        }

        if (tools.length > 0) {
            addText('Tools & Technologies:', 10, textColor, true);
            addText(tools.join(', '), 9);
            yPos += 2;
        }
    } else {
        addText('Skills will be auto-derived from completed projects.', 10, grayColor);
    }

    yPos += 3;
    addDivider();

    // ==================== 5. WORK DISCIPLINE METRICS ====================
    checkPageBreak(25);
    addText('Work Discipline Metrics', 16, textColor, true);
    yPos += 3;

    addText(`Active Days: ${workMetrics?.totalActiveDays || 0}`, 10);
    addText(`Longest Streak: ${workMetrics?.longestStreak || 0} days`, 10);
    addText(`Current Streak: ${workMetrics?.currentStreak || 0} days`, 10);

    if (workMetrics?.avgDaysPerMilestone) {
        addText(`Average Pace: ${workMetrics.avgDaysPerMilestone} days per milestone`, 10);
    }

    yPos += 5;
    addDivider();

    // ==================== 6. FOOTER ====================
    checkPageBreak(20);
    yPos = pageHeight - margin - 15;

    doc.setFontSize(8);
    doc.setTextColor(...grayColor);
    doc.text('Built on MadeIt · Portfolio auto-generated from real work', margin, yPos);
    yPos += 4;
    doc.text(portfolioUrl, margin, yPos);
    yPos += 4;
    doc.text(`Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, margin, yPos);

    // Generate filename
    const filename = `madeit-portfolio-${username || 'export'}.pdf`;

    // Save PDF
    doc.save(filename);

    return filename;
};

/**
 * Prepare portfolio data for PDF export
 * Filters only public data
 */
export const preparePortfolioDataForPDF = (userData, allProjects) => {
    // Filter only completed and public projects
    const publicProjects = allProjects?.filter(project => {
        return project.completed && !project.isDraft;
    }) || [];

    // Extract skills from completed projects
    const skills = new Set();
    publicProjects.forEach(project => {
        if (project.techStack) {
            project.techStack.forEach(tech => skills.add(tech));
        }
    });

    return {
        userData,
        projects: publicProjects,
        skills: Array.from(skills),
    };
};
