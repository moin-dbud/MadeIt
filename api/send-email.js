const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Email templates
const emailTemplates = {
    // Welcome email when user signs up
    welcome: (data) => ({
        to: data.email,
        subject: 'Welcome to MadeIt!',
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4A7BFF;">Welcome to MadeIt, ${data.name}!</h2>
        <p>We're excited to have you on board.</p>
        <p>MadeIt helps you build real projects through structured milestones and turn your progress into a proof-of-work portfolio.</p>
        <h3>Next Steps:</h3>
        <ol>
          <li>Complete your profile setup</li>
          <li>Browse available projects</li>
          <li>Start building and submitting proof</li>
        </ol>
        <p>If you have any questions, feel free to reach out!</p>
        <p>Best regards,<br><strong>The MadeIt Team</strong></p>
      </div>
    `,
    }),

    // Project selection confirmation
    projectSelection: (data) => ({
        to: data.email,
        subject: `You've selected: ${data.projectName}`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4A7BFF;">Project Selected!</h2>
        <p>Hi ${data.name},</p>
        <p>You've successfully selected <strong>${data.projectName}</strong>.</p>
        <p>Start working through the milestones and submit proof as you complete each one.</p>
        <p>Good luck building!</p>
        <p>Best regards,<br><strong>The MadeIt Team</strong></p>
      </div>
    `,
    }),

    // Project confirmation
    projectConfirmation: (data) => ({
        to: data.email,
        subject: `${data.projectName} - Ready to Start`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4A7BFF;">Your project is ready!</h2>
        <p>Hi ${data.name},</p>
        <p>Your project <strong>${data.projectName}</strong> is all set up.</p>
        <p>You can now start working on Milestone 1.</p>
        <p>Best regards,<br><strong>The MadeIt Team</strong></p>
      </div>
    `,
    }),

    // Milestone submitted
    milestoneSubmitted: (data) => ({
        to: data.email,
        subject: `Milestone ${data.milestoneNumber} Submitted`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4A7BFF;">Milestone Submitted!</h2>
        <p>Hi ${data.name},</p>
        <p>Your submission for <strong>Milestone ${data.milestoneNumber}</strong> in <strong>${data.projectName}</strong> has been received.</p>
        <p>Our team will review it shortly.</p>
        <p>Best regards,<br><strong>The MadeIt Team</strong></p>
      </div>
    `,
    }),

    // Milestone verified
    milestoneVerified: (data) => ({
        to: data.email,
        subject: `Milestone ${data.milestoneNumber} Verified!`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #10B981;">✓ Milestone Verified!</h2>
        <p>Hi ${data.name},</p>
        <p>Great news! Your submission for <strong>Milestone ${data.milestoneNumber}</strong> in <strong>${data.projectName}</strong> has been verified.</p>
        <p>Your portfolio has been updated with this milestone.</p>
        <p>Keep up the great work!</p>
        <p>Best regards,<br><strong>The MadeIt Team</strong></p>
      </div>
    `,
    }),

    // Milestone rejected
    milestoneRejected: (data) => ({
        to: data.email,
        subject: `Milestone ${data.milestoneNumber} Needs Revision`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #EF4444;">Milestone Needs Revision</h2>
        <p>Hi ${data.name},</p>
        <p>Your submission for <strong>Milestone ${data.milestoneNumber}</strong> in <strong>${data.projectName}</strong> needs some revisions.</p>
        ${data.reason ? `<p><strong>Reason:</strong> ${data.reason}</p>` : ''}
        <p>Please review and resubmit your proof.</p>
        <p>Best regards,<br><strong>The MadeIt Team</strong></p>
      </div>
    `,
    }),

    // Milestone flagged
    milestoneFlagged: (data) => ({
        to: data.email,
        subject: `Milestone ${data.milestoneNumber} Under Review`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #F59E0B;">Milestone Under Additional Review</h2>
        <p>Hi ${data.name},</p>
        <p>Your submission for <strong>Milestone ${data.milestoneNumber}</strong> in <strong>${data.projectName}</strong> is under additional review.</p>
        <p>We'll get back to you soon.</p>
        <p>Best regards,<br><strong>The MadeIt Team</strong></p>
      </div>
    `,
    }),

    // Support ticket in progress
    ticketInProgress: (data) => ({
        to: data.email,
        subject: `Support Ticket #${data.ticketId} - In Progress`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4A7BFF;">Your ticket is being worked on</h2>
        <p>Hi ${data.name},</p>
        <p>Your support ticket <strong>#${data.ticketId}</strong> is now in progress.</p>
        <p><strong>Type:</strong> ${data.type}</p>
        <p>We're working on it and will update you soon.</p>
        <p>Best regards,<br><strong>The MadeIt Team</strong></p>
      </div>
    `,
    }),

    // Support ticket resolved
    ticketResolved: (data) => ({
        to: data.email,
        subject: `Support Ticket #${data.ticketId} - Resolved`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #10B981;">✓ Ticket Resolved</h2>
        <p>Hi ${data.name},</p>
        <p>Your support ticket <strong>#${data.ticketId}</strong> has been resolved.</p>
        <p><strong>Type:</strong> ${data.type}</p>
        ${data.adminResponse ? `<p><strong>Response:</strong> ${data.adminResponse}</p>` : ''}
        <p>If you need further assistance, feel free to create a new ticket.</p>
        <p>Best regards,<br><strong>The MadeIt Team</strong></p>
      </div>
    `,
    }),

    // Cohort application - User
    cohortApplicationUser: (data) => ({
        to: data.email,
        subject: 'We received your MadeIt cohort application',
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4A7BFF;">Thank You for Applying!</h2>
        <p>Hi ${data.name},</p>
        <p>We've received your application to join the MadeIt testing cohort.</p>
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">What's Next?</h3>
          <ul style="line-height: 1.8;">
            <li>Our team will review your application carefully</li>
            <li>We'll evaluate your background and motivation</li>
            <li>If selected, we'll contact you within 5-7 business days via email or WhatsApp</li>
          </ul>
        </div>
        <p>If you have any questions, reach out to us at <a href="mailto:moinsheikh1303@gmail.com">moinsheikh1303@gmail.com</a>.</p>
        <p>Best regards,<br><strong>The MadeIt Team</strong></p>
      </div>
    `,
    }),

    // Cohort application - Admin
    cohortApplicationAdmin: (data) => ({
        to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
        subject: 'New MadeIt Cohort Application',
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4A7BFF;">New Cohort Application Received</h2>
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Applicant Details</h3>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>WhatsApp:</strong> ${data.phone}</p>
          <p><strong>Status:</strong> ${data.status}</p>
          <p><strong>Tech Interests:</strong> ${data.techInterest}</p>
          <p><strong>GitHub:</strong> <a href="${data.githubUrl}">${data.githubUrl}</a></p>
          <p><strong>Can Commit 7-10 days:</strong> ${data.commitment}</p>
          <h4>Why they want to join:</h4>
          <p style="background-color: white; padding: 15px; border-left: 3px solid #4A7BFF;">
            ${data.motivation}
          </p>
        </div>
        <p style="color: #666; font-size: 12px;">
          Application ID: ${data.applicationId}<br>
          Submitted: ${new Date().toLocaleString()}
        </p>
      </div>
    `,
    }),
};

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { type, data } = req.body;

        if (!type || !data) {
            return res.status(400).json({ error: 'Missing type or data' });
        }

        // Validate email type
        if (!emailTemplates[type]) {
            return res.status(400).json({ error: 'Invalid email type' });
        }

        // For cohort applications, send two emails
        if (type === 'cohortApplicationUser') {
            const userEmail = emailTemplates.cohortApplicationUser(data);
            const adminEmail = emailTemplates.cohortApplicationAdmin(data);

            await Promise.all([
                transporter.sendMail({ from: process.env.EMAIL_USER, ...userEmail }),
                transporter.sendMail({ from: process.env.EMAIL_USER, ...adminEmail })
            ]);

            return res.status(200).json({
                success: true,
                message: 'Cohort application emails sent successfully'
            });
        }

        // For all other email types, send single email
        const emailConfig = emailTemplates[type](data);
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            ...emailConfig
        });

        return res.status(200).json({
            success: true,
            message: 'Email sent successfully',
            type
        });

    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({
            error: 'Failed to send email',
            details: error.message
        });
    }
};
