const nodemailer = require('nodemailer');

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

        // Validate environment variables
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.error('Missing EMAIL_USER or EMAIL_PASS environment variables');
            return res.status(500).json({ error: 'Email configuration missing' });
        }

        // Create transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Email templates
        const getEmailContent = (emailType, emailData) => {
            switch (emailType) {
                case 'welcome':
                    return {
                        to: emailData.email,
                        subject: 'Welcome to MadeIt!',
                        html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #4A7BFF;">Welcome to MadeIt, ${emailData.name}!</h2>
                <p>We're excited to have you on board.</p>
                <p>MadeIt helps you build real projects through structured milestones and turns your progress into a proof-of-work portfolio.</p>
                <h3>Next Steps:</h3>
                <ol style="line-height: 1.8;">
                  <li>Browse available projects</li>
                  <li>Select a project that interests you</li>
                  <li>Start building and submitting proof</li>
                </ol>
                <p>If you have any questions, feel free to reach out!</p>
                <p>Best regards,<br><strong>The MadeIt Team</strong></p>
              </div>
            `,
                    };

                case 'projectSelection':
                    return {
                        to: emailData.email,
                        subject: `You've selected: ${emailData.projectName}`,
                        html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #4A7BFF;">Project Selected!</h2>
                <p>Hi ${emailData.name},</p>
                <p>You've successfully selected <strong>${emailData.projectName}</strong>.</p>
                <p>Start working through the milestones and submit proof as you complete each one.</p>
                <p>Good luck building!</p>
                <p>Best regards,<br><strong>The MadeIt Team</strong></p>
              </div>
            `,
                    };

                case 'cohortApplicationUser':
                    return {
                        to: emailData.email,
                        subject: 'We received your MadeIt cohort application',
                        html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #4A7BFF;">Thank You for Applying!</h2>
                <p>Hi ${emailData.name},</p>
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
                    };

                case 'cohortApplicationAdmin':
                    return {
                        to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
                        subject: 'New MadeIt Cohort Application',
                        html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #4A7BFF;">New Cohort Application Received</h2>
                <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="margin-top: 0;">Applicant Details</h3>
                  <p><strong>Name:</strong> ${emailData.name}</p>
                  <p><strong>Email:</strong> ${emailData.email}</p>
                  <p><strong>WhatsApp:</strong> ${emailData.phone}</p>
                  <p><strong>Status:</strong> ${emailData.status}</p>
                  <p><strong>Tech Interests:</strong> ${emailData.techInterest}</p>
                  <p><strong>GitHub:</strong> <a href="${emailData.githubUrl}">${emailData.githubUrl}</a></p>
                  <p><strong>Can Commit 7-10 days:</strong> ${emailData.commitment}</p>
                  <h4>Why they want to join:</h4>
                  <p style="background-color: white; padding: 15px; border-left: 3px solid #4A7BFF; margin: 10px 0;">
                    ${emailData.motivation}
                  </p>
                </div>
                <p style="color: #666; font-size: 12px;">
                  Application ID: ${emailData.applicationId}<br>
                  Submitted: ${new Date().toLocaleString()}
                </p>
              </div>
            `,
                    };

                default:
                    throw new Error(`Unknown email type: ${emailType}`);
            }
        };

        // Send emails based on type
        if (type === 'cohortApplicationUser') {
            // Send both user confirmation and admin notification
            const userEmail = getEmailContent('cohortApplicationUser', data);
            const adminEmail = getEmailContent('cohortApplicationAdmin', data);

            await Promise.all([
                transporter.sendMail({
                    from: `"MadeIt" <${process.env.EMAIL_USER}>`,
                    ...userEmail
                }),
                transporter.sendMail({
                    from: `"MadeIt" <${process.env.EMAIL_USER}>`,
                    ...adminEmail
                })
            ]);

            return res.status(200).json({
                success: true,
                message: 'Cohort application emails sent successfully'
            });
        }

        // For other email types (to be added later)
        const emailContent = getEmailContent(type, data);
        await transporter.sendMail({
            from: `"MadeIt" <${process.env.EMAIL_USER}>`,
            ...emailContent
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
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};
