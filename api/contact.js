const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            message: 'Method not allowed'
        });
    }

    const { name, email, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        });
    }

    // Email configuration
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    try {
        // Email to you (the recipient)
        const mailToAdmin = {
            from: `"MadeIt Contact Form" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            subject: `New Contact Form: ${subject}`,
            replyTo: email,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                    <div style="background-color: #0A0A0A; color: white; padding: 20px; border-radius: 10px 10px 0 0;">
                        <h2 style="margin: 0; color: #FF6B35;">New Contact Form Submission</h2>
                    </div>
                    
                    <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <div style="margin-bottom: 20px;">
                            <p style="color: #666; margin: 0 0 5px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">From</p>
                            <p style="margin: 0; font-size: 18px; font-weight: bold; color: #0A0A0A;">${name}</p>
                            <p style="margin: 5px 0 0 0; color: #FF6B35;">${email}</p>
                        </div>
                        
                        <div style="margin-bottom: 20px;">
                            <p style="color: #666; margin: 0 0 5px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Subject</p>
                            <p style="margin: 0; font-size: 16px; color: #0A0A0A;">${subject}</p>
                        </div>
                        
                        <div style="margin-bottom: 20px;">
                            <p style="color: #666; margin: 0 0 10px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Message</p>
                            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; border-left: 4px solid #FF6B35;">
                                <p style="margin: 0; color: #333; line-height: 1.6; white-space: pre-wrap;">${message}</p>
                            </div>
                        </div>
                        
                        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px;">
                            <p style="margin: 0;">This message was sent via MadeIt Contact Form</p>
                            <p style="margin: 5px 0;">Reply directly to this email to respond to ${name}</p>
                        </div>
                    </div>
                </div>
            `
        };

        // Auto-reply email to the user
        const mailToUser = {
            from: `"Moin Sheikh - MadeIt" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Thank you for contacting MadeIt!',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                    <div style="background-color: #0A0A0A; color: white; padding: 20px; border-radius: 10px 10px 0 0;">
                        <h2 style="margin: 0; color: #FF6B35;">Thank You for Reaching Out!</h2>
                    </div>
                    
                    <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <p style="margin: 0 0 15px 0; font-size: 16px; color: #333;">Hi ${name},</p>
                        
                        <p style="margin: 0 0 15px 0; color: #666; line-height: 1.6;">
                            Thank you for getting in touch! I've received your message and will get back to you as soon as possible.
                        </p>
                        
                        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #FF6B35;">
                            <p style="margin: 0 0 5px 0; font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 1px;">Your Message</p>
                            <p style="margin: 0; color: #333; line-height: 1.6; white-space: pre-wrap;">${message}</p>
                        </div>
                        
                        <p style="margin: 20px 0 15px 0; color: #666; line-height: 1.6;">
                            I typically respond within 24-48 hours. In the meantime, feel free to check out:
                        </p>
                        
                        <ul style="color: #666; line-height: 1.8; margin: 15px 0;">
                            <li><a href="https://github.com/moin-dbud" style="color: #FF6B35; text-decoration: none;">My GitHub</a> for projects and code</li>
                            <li><a href="https://linkedin.com/in/moin-sheikh" style="color: #FF6B35; text-decoration: none;">My LinkedIn</a> for professional updates</li>
                            <li><a href="https://madeit.vercel.app" style="color: #FF6B35; text-decoration: none;">MadeIt Platform</a> to explore more</li>
                        </ul>
                        
                        <p style="margin: 25px 0 0 0; color: #333;">Best regards,<br><strong>Moin Sheikh</strong></p>
                        
                        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px;">
                            <p style="margin: 0;">This is an automated confirmation email.</p>
                            <p style="margin: 5px 0 0 0;">Please do not reply to this email. I'll reach out from my personal email.</p>
                        </div>
                    </div>
                </div>
            `
        };

        // Send both emails
        await transporter.sendMail(mailToAdmin);
        await transporter.sendMail(mailToUser);

        res.status(200).json({
            success: true,
            message: 'Message sent successfully! Check your email for confirmation.'
        });

    } catch (error) {
        console.error('❌ Email send error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send message. Please try again or email us directly.'
        });
    }
}
