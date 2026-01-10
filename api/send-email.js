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
                        subject: '🎉 Welcome to MadeIt - Let\'s Build Something Amazing!',
                        html: `
              <!DOCTYPE html>
              <html>
              <head>
                <style>
                  body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
                  .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
                  .header { background: linear-gradient(135deg, #4A7BFF 0%, #FF6B35 100%); padding: 40px 30px; text-align: center; }
                  .header h1 { color: #ffffff; font-size: 28px; margin: 0 0 10px 0; font-weight: 700; }
                  .header p { color: rgba(255,255,255,0.95); font-size: 16px; margin: 0; }
                  .content { padding: 40px 30px; }
                  .greeting { font-size: 18px; color: #1a1a1a; margin-bottom: 20px; font-weight: 600; }
                  .message { font-size: 16px; color: #4a4a4a; line-height: 1.6; margin-bottom: 24px; }
                  .steps-box { background: linear-gradient(135deg, rgba(74,123,255,0.05) 0%, rgba(255,107,53,0.05) 100%); border-left: 4px solid #4A7BFF; border-radius: 8px; padding: 24px; margin: 24px 0; }
                  .steps-box h3 { color: #1a1a1a; font-size: 18px; margin: 0 0 16px 0; }
                  .steps-box ol { margin: 0; padding-left: 20px; }
                  .steps-box li { color: #4a4a4a; margin-bottom: 12px; font-size: 15px; line-height: 1.5; }
                  .cta-button { display: inline-block; background: linear-gradient(135deg, #4A7BFF 0%, #FF6B35 100%); color: #ffffff !important; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; margin: 24px 0; }
                  .footer { background-color: #f8f8f8; padding: 30px; text-align: center; border-top: 1px solid #e5e5e5; }
                  .footer p { color: #888; font-size: 13px; margin: 5px 0; }
                </style>
              </head>
              <body>
                <div class="email-container">
                  <div class="header">
                    <h1>🚀 Welcome to MadeIt!</h1>
                    <p>Your journey to building real projects starts now</p>
                  </div>
                  
                  <div class="content">
                    <p class="greeting">Hey ${emailData.name}! 👋</p>
                    
                    <p class="message">
                      We're thrilled to have you join MadeIt! You're now part of a community of builders who believe in learning by doing.
                    </p>
                    
                    <p class="message">
                      MadeIt helps you build real-world projects through structured milestones, and automatically turns your progress into a proof-of-work portfolio that showcases your skills.
                    </p>
                    
                    <div class="steps-box">
                      <h3>🎯 Here's what to do next:</h3>
                      <ol>
                        <li><strong>Browse Projects</strong> - Check out our curated real-world projects</li>
                        <li><strong>Select & Build</strong> - Pick a project that excites you and start building</li>
                        <li><strong>Submit Proof</strong> - Complete milestones and submit your work</li>
                        <li><strong>Build Portfolio</strong> - Your achievements automatically become your portfolio</li>
                      </ol>
                    </div>
                    
                    <center>
                      <a href="${process.env.VITE_APP_URL || 'https://madeit-app.vercel.app'}/projects" class="cta-button">
                        Start Building Now →
                      </a>
                    </center>
                    
                    <p class="message">
                      Need help getting started? Feel free to reach out anytime. We're here to support you!
                    </p>
                  </div>
                  
                  <div class="footer">
                    <p><strong>MadeIt</strong></p>
                    <p>Build real projects. Prove your work.</p>
                    <p style="margin-top: 16px;">
                      <a href="mailto:moinsheikh1303@gmail.com" style="color: #4A7BFF; text-decoration: none;">Contact Support</a>
                    </p>
                  </div>
                </div>
              </body>
              </html>
            `,
                    };

                case 'projectSelection':
                    return {
                        to: emailData.email,
                        subject: `🎯 You've selected: ${emailData.projectName}`,
                        html: `
              <!DOCTYPE html>
              <html>
              <head>
                <style>
                  body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
                  .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
                  .header { background: linear-gradient(135deg, #4A7BFF 0%, #FF6B35 100%); padding: 40px 30px; text-align: center; }
                  .header h1 { color: #ffffff; font-size: 28px; margin: 0 0 10px 0; font-weight: 700; }
                  .header p { color: rgba(255,255,255,0.95); font-size: 16px; margin: 0; }
                  .content { padding: 40px 30px; }
                  .greeting { font-size: 18px; color: #1a1a1a; margin-bottom: 20px; font-weight: 600; }
                  .message { font-size: 16px; color: #4a4a4a; line-height: 1.6; margin-bottom: 24px; }
                  .project-box { background: linear-gradient(135deg, rgba(74,123,255,0.08) 0%, rgba(255,107,53,0.08) 100%); border: 2px solid #4A7BFF; border-radius: 12px; padding: 28px; margin: 24px 0; text-align: center; }
                  .project-box h2 { color: #1a1a1a; font-size: 24px; margin: 0 0 12px 0; }
                  .project-box p { color: #4a4a4a; font-size: 15px; margin: 0; }
                  .tips-box { background-color: #f8f8f8; border-radius: 8px; padding: 24px; margin: 24px 0; }
                  .tips-box h3 { color: #1a1a1a; font-size: 18px; margin: 0 0 16px 0; }
                  .tips-box ul { margin: 0; padding-left: 20px; }
                  .tips-box li { color: #4a4a4a; margin-bottom: 10px; font-size: 15px; line-height: 1.5; }
                  .cta-button { display: inline-block; background: linear-gradient(135deg, #4A7BFF 0%, #FF6B35 100%); color: #ffffff !important; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; margin: 24px 0; }
                  .footer { background-color: #f8f8f8; padding: 30px; text-align: center; border-top: 1px solid #e5e5e5; }
                  .footer p { color: #888; font-size: 13px; margin: 5px 0; }
                </style>
              </head>
              <body>
                <div class="email-container">
                  <div class="header">
                    <h1>✅ Project Selected!</h1>
                    <p>Time to build something amazing</p>
                  </div>
                  
                  <div class="content">
                    <p class="greeting">Hey ${emailData.name}! 🎉</p>
                    
                    <p class="message">
                      Great choice! You've successfully selected your project. It's time to turn ideas into reality.
                    </p>
                    
                    <div class="project-box">
                      <h2>🚀 ${emailData.projectName}</h2>
                      <p>Your journey starts now!</p>
                    </div>
                    
                    <div class="tips-box">
                      <h3>💡 Quick Tips for Success:</h3>
                      <ul>
                        <li><strong>Follow the milestones</strong> - They're designed to guide you step-by-step</li>
                        <li><strong>Submit quality proof</strong> - Clear screenshots, commit messages, and documentation</li>
                        <li><strong>Ask for help</strong> - Use the support system if you get stuck</li>
                        <li><strong>Stay consistent</strong> - Regular progress leads to faster completion</li>
                      </ul>
                    </div>
                    
                    <center>
                      <a href="${process.env.VITE_APP_URL || 'https://madeit-app.vercel.app'}/dashboard" class="cta-button">
                        View Your Project →
                      </a>
                    </center>
                    
                    <p class="message">
                      Remember: Every milestone you complete brings you closer to building a powerful portfolio. Let's make it happen!
                    </p>
                  </div>
                  
                  <div class="footer">
                    <p><strong>MadeIt</strong></p>
                    <p>Build real projects. Prove your work.</p>
                    <p style="margin-top: 16px;">
                      <a href="mailto:moinsheikh1303@gmail.com" style="color: #4A7BFF; text-decoration: none;">Need Help?</a>
                    </p>
                  </div>
                </div>
              </body>
              </html>
            `,
                    };

                case 'cohortApplicationUser':
                    return {
                        to: emailData.email,
                        subject: '🎓 Your MadeIt Cohort Application is Received!',
                        html: `
              <!DOCTYPE html>
              <html>
              <head>
                <style>
                  body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
                  .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
                  .header { background: linear-gradient(135deg, #4A7BFF 0%, #FF6B35 100%); padding: 40px 30px; text-align: center; }
                  .header h1 { color: #ffffff; font-size: 28px; margin: 0 0 10px 0; font-weight: 700; }
                  .header p { color: rgba(255,255,255,0.95); font-size: 16px; margin: 0; }
                  .content { padding: 40px 30px; }
                  .greeting { font-size: 18px; color: #1a1a1a; margin-bottom: 20px; font-weight: 600; }
                  .message { font-size: 16px; color: #4a4a4a; line-height: 1.6; margin-bottom: 24px; }
                  .timeline-box { background: linear-gradient(135deg, rgba(74,123,255,0.05) 0%, rgba(255,107,53,0.05) 100%); border-left: 4px solid #FF6B35; border-radius: 8px; padding: 24px; margin: 24px 0; }
                  .timeline-box h3 { color: #1a1a1a; font-size: 18px; margin: 0 0 16px 0; display: flex; align-items: center; }
                  .timeline-box ul { margin: 0; padding-left: 20px; list-style: none; }
                  .timeline-box li { color: #4a4a4a; margin-bottom: 12px; font-size: 15px; line-height: 1.5; padding-left: 24px; position: relative; }
                  .timeline-box li:before { content: '✓'; position: absolute; left: 0; color: #4A7BFF; font-weight: bold; }
                  .highlight-box { background-color: #fffbf0; border: 1px solid #ffd700; border-radius: 8px; padding: 20px; margin: 24px 0; }
                  .highlight-box p { margin: 0; color: #806200; font-size: 15px; line-height: 1.5; }
                  .footer { background-color: #f8f8f8; padding: 30px; text-align: center; border-top: 1px solid #e5e5e5; }
                  .footer p { color: #888; font-size: 13px; margin: 5px 0; }
                </style>
              </head>
              <body>
                <div class="email-container">
                  <div class="header">
                    <h1>🎉 Application Received!</h1>
                    <p>Thank you for applying to the MadeIt Testing Cohort</p>
                  </div>
                  
                  <div class="content">
                    <p class="greeting">Hey ${emailData.name}! 👋</p>
                    
                    <p class="message">
                      We've successfully received your application for the MadeIt testing cohort. Thank you for your interest in helping shape the future of project-based learning!
                    </p>
                    
                    <div class="timeline-box">
                      <h3>🗓️ What Happens Next:</h3>
                      <ul>
                        <li>Our team will carefully review your application and background</li>
                        <li>We'll evaluate your motivation and technical interests</li>
                        <li>Selected candidates will be contacted within 5-7 business days</li>
                        <li>We'll reach out via email or WhatsApp with next steps</li>
                      </ul>
                    </div>
                    
                    <div class="highlight-box">
                      <p>
                        <strong>⚡ Important:</strong> This is a testing cohort, so we're looking for developers who are genuinely excited to build real projects and provide honest feedback to help shape MadeIt. Your detailed motivation really helps us understand if this is the right fit!
                      </p>
                    </div>
                    
                    <p class="message">
                      While you wait, feel free to check out our website to learn more about how MadeIt works. If you have any questions, don't hesitate to reach out!
                    </p>
                  </div>
                  
                  <div class="footer">
                    <p><strong>MadeIt Team</strong></p>
                    <p>Build real projects. Prove your work.</p>
                    <p style="margin-top: 16px;">
                      <a href="mailto:moinsheikh1303@gmail.com" style="color: #4A7BFF; text-decoration: none;">Contact Us</a> · 
                      <a href="${process.env.VITE_APP_URL || 'https://madeit-app.vercel.app'}" style="color: #4A7BFF; text-decoration: none;">Visit Website</a>
                    </p>
                  </div>
                </div>
              </body>
              </html>
            `,
                    };

                case 'cohortApplicationAdmin':
                    return {
                        to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
                        subject: '🆕 New MadeIt Cohort Application',
                        html: `
              <!DOCTYPE html>
              <html>
              <head>
                <style>
                  body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
                  .email-container { max-width: 650px; margin: 0 auto; background-color: #ffffff; }
                  .header { background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 30px; text-align: center; border-bottom: 4px solid #4A7BFF; }
                  .header h1 { color: #ffffff; font-size: 24px; margin: 0; font-weight: 700; }
                  .content { padding: 30px; }
                  .applicant-card { background: linear-gradient(135deg, rgba(74,123,255,0.08) 0%, rgba(255,107,53,0.08) 100%); border: 2px solid #4A7BFF; border-radius: 12px; padding: 24px; margin: 20px 0; }
                  .field { margin-bottom: 16px; }
                  .field-label { font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
                  .field-value { font-size: 16px; color: #1a1a1a; font-weight: 500; }
                  .motivation-section { background-color: #f8f8f8; border-left: 4px solid #FF6B35; border-radius: 8px; padding: 20px; margin: 20px 0; }
                  .motivation-section h3 { color: #1a1a1a; font-size: 16px; margin: 0 0 12px 0; }
                  .motivation-section p { color: #4a4a4a; font-size: 15px; line-height: 1.6; margin: 0; white-space: pre-wrap; }
                  .metadata { background-color: #f0f0f0; padding: 16px; border-radius: 6px; margin-top: 20px; font-size: 13px; color: #666; }
                  .tech-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
                  .tech-tag { background-color: #4A7BFF; color: white; padding: 4px 12px; border-radius: 4px; font-size: 13px; }
                </style>
              </head>
              <body>
                <div class="email-container">
                  <div class="header">
                    <h1>📝 New Cohort Application</h1>
                  </div>
                  
                  <div class="content">
                    <div class="applicant-card">
                      <div class="field">
                        <div class="field-label">Full Name</div>
                        <div class="field-value">${emailData.name}</div>
                      </div>
                      
                      <div class="field">
                        <div class="field-label">Email Address</div>
                        <div class="field-value">${emailData.email}</div>
                      </div>
                      
                      <div class="field">
                        <div class="field-label">WhatsApp Number</div>
                        <div class="field-value">${emailData.phone}</div>
                      </div>
                      
                      <div class="field">
                        <div class="field-label">Current Status</div>
                        <div class="field-value">${emailData.status}</div>
                      </div>
                      
                      <div class="field">
                        <div class="field-label">GitHub Profile</div>
                        <div class="field-value"><a href="${emailData.githubUrl}" style="color: #4A7BFF;">${emailData.githubUrl}</a></div>
                      </div>
                      
                      <div class="field">
                        <div class="field-label">Can Commit 7-10 Days</div>
                        <div class="field-value" style="color: ${emailData.commitment === 'Yes' ? '#10b981' : '#ef4444'};">${emailData.commitment}</div>
                      </div>
                      
                      <div class="field">
                        <div class="field-label">Tech Interests</div>
                        <div class="tech-tags">
                          ${emailData.techInterest.split(',').map(tech => `<span class="tech-tag">${tech.trim()}</span>`).join('')}
                        </div>
                      </div>
                    </div>
                    
                    <div class="motivation-section">
                      <h3>💭 Why They Want to Join:</h3>
                      <p>${emailData.motivation}</p>
                    </div>
                    
                    <div class="metadata">
                      <strong>Application ID:</strong> ${emailData.applicationId}<br>
                      <strong>Submitted:</strong> ${new Date().toLocaleString()}
                    </div>
                  </div>
                </div>
              </body>
              </html>
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
