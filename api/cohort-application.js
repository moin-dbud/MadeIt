const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

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
        const { name, email, phone, status, techInterest, githubUrl, motivation, commitment, applicationId } = req.body;

        // Validate required fields
        if (!name || !email || !phone || !status || !githubUrl || !motivation || !commitment) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Email to Admin
        const adminMailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
            subject: 'New MadeIt Cohort Application',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4A7BFF;">New Cohort Application Received</h2>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Applicant Details</h3>
            
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>WhatsApp:</strong> ${phone}</p>
            <p><strong>Current Status:</strong> ${status}</p>
            <p><strong>Tech Interests:</strong> ${techInterest}</p>
            <p><strong>GitHub:</strong> <a href="${githubUrl}">${githubUrl}</a></p>
            <p><strong>Can Commit 7-10 days:</strong> ${commitment}</p>
            
            <h4>Why they want to join:</h4>
            <p style="background-color: white; padding: 15px; border-left: 3px solid #4A7BFF; margin: 10px 0;">
              ${motivation}
            </p>
          </div>
          
          <p style="color: #666; font-size: 12px;">
            Application ID: ${applicationId}<br>
            Submitted: ${new Date().toLocaleString()}
          </p>
        </div>
      `,
        };

        // Email to User (Confirmation)
        const userMailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'We received your MadeIt cohort application',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4A7BFF;">Thank You for Applying!</h2>
          
          <p>Hi ${name},</p>
          
          <p>We've received your application to join the MadeIt testing cohort.</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">What's Next?</h3>
            <ul style="line-height: 1.8;">
              <li>Our team will review your application carefully</li>
              <li>We'll evaluate your background and motivation</li>
              <li>If selected, we'll contact you within 5-7 business days via email or WhatsApp</li>
            </ul>
          </div>
          
          <p>This is a testing cohort, so we're looking for developers who are genuinely excited to build projects and provide feedback to help shape MadeIt.</p>
          
          <p>If you have any questions in the meantime, feel free to reach out to us at <a href="mailto:moinsheikh1303@gmail.com">moinsheikh1303@gmail.com</a>.</p>
          
          <p style="margin-top: 30px;">
            Best regards,<br>
            <strong>The MadeIt Team</strong>
          </p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          
          <p style="color: #666; font-size: 12px; text-align: center;">
            This is an automated email. Please do not reply directly to this message.
          </p>
        </div>
      `,
        };

        // Send both emails
        await Promise.all([
            transporter.sendMail(adminMailOptions),
            transporter.sendMail(userMailOptions)
        ]);

        return res.status(200).json({
            success: true,
            message: 'Application submitted and emails sent successfully'
        });

    } catch (error) {
        console.error('Error processing cohort application:', error);
        return res.status(500).json({
            error: 'Failed to process application',
            details: error.message
        });
    }
};
