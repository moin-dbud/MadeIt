import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from parent directory
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Initialize Supabase Admin client
let supabaseAdmin = null;
if (process.env.VITE_SUPABASE_URL && (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY)) {
    supabaseAdmin = createClient(
        process.env.VITE_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
    );
    console.log('✅ Supabase Client initialized in server');
} else {
    console.log('⚠️  Supabase Client not initialized in server - missing env vars');
}

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Verify transporter configuration
transporter.verify((error, success) => {
    if (error) {
        console.error('❌ Email transporter error:', error);
    } else {
        console.log('✅ Email server is ready to send messages');
    }
});

// ===== REUSABLE EMAIL HELPER =====
const sendEmail = async (to, subject, html) => {
    try {
        await transporter.sendMail({
            from: `"MadeIt" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html
        });
        return { success: true };
    } catch (error) {
        console.error('Email send error:', error);
        return { success: false, error: error.message };
    }
};

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Email server is running' });
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
    const { name, email, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        });
    }

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
                            <p style="margin: 5px 0; color: #666;"><strong style="color: #333;">From:</strong> ${name}</p>
                            <p style="margin: 5px 0; color: #666;"><strong style="color: #333;">Email:</strong> <a href="mailto:${email}" style="color: #FF6B35; text-decoration: none;">${email}</a></p>
                            <p style="margin: 5px 0; color: #666;"><strong style="color: #333;">Subject:</strong> ${subject}</p>
                        </div>
                        
                        <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #f0f0f0;">
                            <p style="margin: 0 0 10px 0; color: #333;"><strong>Message:</strong></p>
                            <p style="margin: 0; color: #666; line-height: 1.6; white-space: pre-wrap;">${message}</p>
                        </div>
                        
                        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #f0f0f0; text-align: center; color: #999; font-size: 12px;">
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
                        <p style="margin: 0 0 15px 0; color: #333; font-size: 16px;">Hi <strong>${name}</strong>,</p>
                        
                        <p style="margin: 0 0 15px 0; color: #666; line-height: 1.6;">
                            Thank you for contacting MadeIt! I've received your message and will get back to you as soon as possible.
                        </p>
                        
                        <div style="background-color: #f8f8f8; padding: 20px; border-left: 4px solid #FF6B35; margin: 20px 0;">
                            <p style="margin: 0 0 10px 0; color: #333; font-weight: bold;">Your Message:</p>
                            <p style="margin: 0; color: #666; font-style: italic; line-height: 1.6; white-space: pre-wrap;">"${message}"</p>
                        </div>
                        
                        <p style="margin: 20px 0 15px 0; color: #666; line-height: 1.6;">
                            I typically respond within 24-48 hours. In the meantime, feel free to check out:
                        </p>
                        
                        <ul style="color: #666; line-height: 1.8; margin: 15px 0;">
                            <li><a href="https://github.com/moin-dbud" style="color: #FF6B35; text-decoration: none;">My GitHub</a> for projects and code</li>
                            <li><a href="https://linkedin.com/in/moin-s-sheikh" style="color: #FF6B35; text-decoration: none;">My LinkedIn</a> for professional background</li>
                        </ul>
                        
                        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #f0f0f0;">
                            <p style="margin: 0 0 10px 0; color: #333; font-weight: bold;">Best regards,</p>
                            <p style="margin: 0; color: #666;">Moin Sheikh</p>
                            <p style="margin: 5px 0 0 0; color: #999; font-size: 14px;">Founder, MadeIt</p>
                        </div>
                        
                        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #f0f0f0; text-align: center; color: #999; font-size: 12px;">
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

        res.json({
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
});

// Support ticket endpoint
app.post('/api/support-ticket', async (req, res) => {
    const {
        ticketId,
        userName,
        userEmail,
        issueType,
        message,
        projectName,
        currentRepo,
        newRepo,
        title,
        page,
        subject,
        featureTitle
    } = req.body;

    // Validation
    if (!ticketId || !userName || !userEmail || !issueType || !message) {
        return res.status(400).json({
            success: false,
            message: 'Required fields are missing'
        });
    }

    try {
        // Map issue type to readable label
        const issueTypeLabels = {
            'repo_change': 'Change GitHub Repository',
            'bug': 'Bug / Error',
            'question': 'Question / Query',
            'feature': 'Feature Suggestion',
            'other': 'Other'
        };
        const issueTypeLabel = issueTypeLabels[issueType] || issueType;

        // Email to admin
        const mailToAdmin = {
            from: `"MadeIt Support" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            subject: `[MadeIt Support] New Ticket - ${issueTypeLabel}`,
            replyTo: userEmail,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                    <div style="background-color: #0A0A0A; color: white; padding: 20px; border-radius: 10px 10px 0 0;">
                        <h2 style="margin: 0; color: #FF6B35;">🎫 New Support Ticket Raised</h2>
                    </div>
                    
                    <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <div style="background-color: #f8f8f8; padding: 15px; border-left: 4px solid #FF6B35; margin-bottom: 20px;">
                            <p style="margin: 0; font-size: 18px; font-weight: bold; color: #333;">${issueTypeLabel}</p>
                        </div>
                        
                        <div style="margin-bottom: 20px;">
                            <p style="margin: 5px 0; color: #666;"><strong style="color: #333;">Ticket ID:</strong> #${ticketId.slice(0, 8)}</p>
                            <p style="margin: 5px 0; color: #666;"><strong style="color: #333;">User:</strong> ${userName}</p>
                            <p style="margin: 5px 0; color: #666;"><strong style="color: #333;">Email:</strong> <a href="mailto:${userEmail}" style="color: #FF6B35; text-decoration: none;">${userEmail}</a></p>
                            ${projectName ? `<p style="margin: 5px 0; color: #666;"><strong style="color: #333;">Project:</strong> ${projectName}</p>` : ''}
                        </div>
                        
                        ${issueType === 'repo_change' ? `
                            <div style="margin-bottom: 20px; padding: 15px; background-color: #fff3cd; border-radius: 5px;">
                                <p style="margin: 0 0 10px 0; color: #856404; font-weight: bold;">Repository Change Request:</p>
                                <p style="margin: 5px 0; color: #856404;"><strong>Current:</strong> ${currentRepo || 'Not set'}</p>
                                <p style="margin: 5px 0; color: #856404;"><strong>New:</strong> ${newRepo}</p>
                            </div>
                        ` : ''}
                        
                        ${title ? `<p style="margin: 10px 0; color: #333;"><strong>Title:</strong> ${title}</p>` : ''}
                        ${page ? `<p style="margin: 10px 0; color: #333;"><strong>Page:</strong> ${page}</p>` : ''}
                        ${subject ? `<p style="margin: 10px 0; color: #333;"><strong>Subject:</strong> ${subject}</p>` : ''}
                        ${featureTitle ? `<p style="margin: 10px 0; color: #333;"><strong>Feature:</strong> ${featureTitle}</p>` : ''}
                        
                        <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #f0f0f0;">
                            <p style="margin: 0 0 10px 0; color: #333;"><strong>Message:</strong></p>
                            <p style="margin: 0; color: #666; line-height: 1.6; white-space: pre-wrap;">${message}</p>
                        </div>
                        
                        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #f0f0f0; text-align: center; color: #999; font-size: 12px;">
                            <p style="margin: 0;">This ticket was submitted via MadeIt Support System</p>
                            <p style="margin: 5px 0;">Reply directly to this email to respond to ${userName}</p>
                        </div>
                    </div>
                </div>
            `
        };

        // Auto-reply to user
        const mailToUser = {
            from: `"Moin Sheikh - MadeIt" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: 'Your MadeIt Support Ticket Has Been Received',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                    <div style="background-color: #0A0A0A; color: white; padding: 20px; border-radius: 10px 10px 0 0;">
                        <h2 style="margin: 0; color: #FF6B35;">Thank You for Contacting Support!</h2>
                    </div>
                    
                    <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <p style="margin: 0 0 15px 0; color: #333; font-size: 16px;">Hi <strong>${userName}</strong>,</p>
                        
                        <p style="margin: 0 0 15px 0; color: #666; line-height: 1.6;">
                            Your support ticket has been received and logged in our system. I'll review it and get back to you as soon as possible.
                        </p>
                        
                        <div style="background-color: #f8f8f8; padding: 20px; border-left: 4px solid #FF6B35; margin: 20px 0;">
                            <p style="margin: 0 0 10px 0; color: #333; font-weight: bold;">Ticket Details:</p>
                            <p style="margin: 5px 0; color: #666;"><strong>Ticket ID:</strong> #${ticketId.slice(0, 8)}</p>
                            <p style="margin: 5px 0; color: #666;"><strong>Issue Type:</strong> ${issueTypeLabel}</p>
                            <p style="margin: 5px 0; color: #666;"><strong>Status:</strong> Open</p>
                        </div>
                        
                        <p style="margin: 20px 0 15px 0; color: #666; line-height: 1.6;">
                            I typically respond within 24-48 hours. You can track your ticket status in the Support section of your MadeIt dashboard.
                        </p>
                        
                        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #f0f0f0;">
                            <p style="margin: 0 0 10px 0; color: #333; font-weight: bold;">Best regards,</p>
                            <p style="margin: 0; color: #666;">Moin Sheikh</p>
                            <p style="margin: 5px 0 0 0; color: #999; font-size: 14px;">Founder, MadeIt</p>
                        </div>
                        
                        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #f0f0f0; text-align: center; color: #999; font-size: 12px;">
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

        res.json({
            success: true,
            message: 'Support ticket emails sent successfully!'
        });

    } catch (error) {
        console.error('❌ Support ticket email error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send support ticket emails. Please try again.'
        });
    }
});

// ===== 1. WELCOME EMAIL (On Signup) =====
app.post('/api/send-welcome-email', async (req, res) => {
    const { userName, userEmail } = req.body;

    if (!userName || !userEmail) {
        return res.status(400).json({ success: false, message: 'userName and user Email required' });
    }

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background-color: #0A0A0A; color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
                <h1 style="margin: 0; color: #FF6B35; font-size: 32px;">Welcome to MadeIt 👋</h1>
            </div>
            
            <div style="background-color: white; padding: 40px 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <p style="margin: 0 0 20px 0; color: #333; font-size: 18px;">Hi <strong>${userName}</strong>,</p>
                
                <p style="margin: 0 0 20px 0; color: #666; line-height: 1.8;">
                    Welcome to MadeIt! You've just joined a platform where <strong>building</strong> is the new resume.
                </p>
                
                <div style="background-color: #f8f8f8; padding: 20px; border-left: 4px solid #FF6B35; margin: 25px 0;">
                    <h3 style="margin: 0 0 15px 0; color: #333;">What is MadeIt?</h3>
                    <p style="margin: 0; color: #666; line-height: 1.6;">
                        MadeIt helps you build real-world projects, track your progress, and create a portfolio that proves your skills — not just claims them.
                    </p>
                </div>
                
                <h3 style="margin: 30px 0 15px 0; color: #333;">What's Next?</h3>
                <ul style="color: #666; line-height: 2; margin: 0 0 25px 0; padding-left: 25px;">
                    <li>Complete your profile</li>
                    <li>Select your first project</li>
                    <li>Start building and tracking milestones</li>
                    <li>Watch your portfolio update automatically</li>
                </ul>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="https://madeit-78dcf.web.app/dashboard" style="display: inline-block; background-color: #FF6B35; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                        Go to Dashboard →
                    </a>
                </div>
                
                <div style="margin-top: 40px; padding-top: 25px; border-top: 1px solid #f0f0f0;">
                    <p style="margin: 0; color: #999; font-size: 13px; line-height: 1.6; text-align: center;">
                        — MadeIt<br>
                        <em>Built from real work, not claims</em>
                    </p>
                </div>
            </div>
        </div>
    `;

    const result = await sendEmail(userEmail, 'Welcome to MadeIt 👋', html);
    res.json(result);
});

// ===== 2. PROJECT SELECTION EMAIL =====
app.post('/api/send-project-selection-email', async (req, res) => {
    const { userName, userEmail, projectName, projectDescription } = req.body;

    if (!userName || !userEmail || !projectName) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background-color: #0A0A0A; color: white; padding: 30px; border-radius: 10px 10px 0 0;">
                <h2 style="margin: 0; color: #FF6B35;">You selected a new project on MadeIt 🚀</h2>
            </div>
            
            <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <p style="margin: 0 0 15px 0; color: #333; font-size: 16px;">Hi <strong>${userName}</strong>,</p>
                
                <p style="margin: 0 0 20px 0; color: #666; line-height: 1.6;">
                    You've selected a project! This is a great step toward building real-world skills.
                </p>
                
                <div style="background-color: #f8f8f8; padding: 20px; border-left: 4px solid #FF6B35; margin: 20px 0;">
                    <h3 style="margin: 0 0 10px 0; color: #333;">Project: ${projectName}</h3>
                    <p style="margin: 0; color: #666; line-height: 1.6;">
                        ${projectDescription || 'Time to build something amazing!'}
                    </p>
                </div>
                
                <p style="margin: 20px 0; color: #666; line-height: 1.6;">
                    <strong>Remember:</strong> You'll need to confirm your project and set up your GitHub repository before you can start building.
                </p>
                
                <div style="text-align: center; margin: 25px 0;">
                    <a href="https://madeit-78dcf.web.app/dashboard" style="display: inline-block; background-color: #FF6B35; color: white; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                        Confirm Project →
                    </a>
                </div>
                
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #f0f0f0;">
                    <p style="margin: 0; color: #999; font-size: 12px; text-align: center;">
                        — MadeIt<br>
                        <em>Built from real work, not claims</em>
                    </p>
                </div>
            </div>
        </div>
    `;

    const result = await sendEmail(userEmail, 'You selected a new project on MadeIt 🚀', html);
    res.json(result);
});

// ===== 3. PROJECT CONFIRMATION EMAIL =====
app.post('/api/send-project-confirmation-email', async (req, res) => {
    const { userName, userEmail, projectName, milestoneCount, githubRepo } = req.body;

    if (!userName || !userEmail || !projectName) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background-color: #0A0A0A; color: white; padding: 30px; border-radius: 10px 10px 0 0;">
                <h2 style="margin: 0; color: #FF6B35;">Your project is confirmed 🎯 Let's build!</h2>
            </div>
            
            <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <p style="margin: 0 0 15px 0; color: #333; font-size: 16px;">Hi <strong>${userName}</strong>,</p>
                
                <p style="margin: 0 0 20px 0; color: #666; line-height: 1.6;">
                    Congratulations! Your project <strong>${projectName}</strong> is now confirmed and ready to build.
                </p>
                
                <div style="background-color: #f8f8f8; padding: 20px; border-left: 4px solid #FF6B35; margin: 20px 0;">
                    <h3 style="margin: 0 0 15px 0; color: #333;">Project Overview</h3>
                    <p style="margin: 5px 0; color: #666;"><strong>Project:</strong> ${projectName}</p>
                    <p style="margin: 5px 0; color: #666;"><strong>Milestones:</strong> ${milestoneCount || 'Several'} milestones to complete</p>
                    ${githubRepo ? `<p style="margin: 5px 0; color: #666;"><strong>Repository:</strong> <a href="${githubRepo}" style="color: #FF6B35; text-decoration: none;">${githubRepo}</a></p>` : ''}
                </div>
                
                <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; border: 1px solid #ffeaa7; margin: 20px 0;">
                    <p style="margin: 0; color: #856404; font-size: 14px; line-height: 1.6;">
                        <strong>⚠️ Important:</strong> Your GitHub repository is now locked for this project. If you need to change it, you'll need to <strong>raise a support ticket</strong>.
                    </p>
                </div>
                
                <p style="margin: 20px 0 15px 0; color: #333; font-weight: bold;">Ready to start?</p>
                <ul style="color: #666; line-height: 2; margin: 0 0 20px 0; padding-left: 25px;">
                    <li>Begin with Milestone 1</li>
                    <li>Complete tasks and submit proof of work</li>
                    <li>Watch your portfolio update automatically</li>
                </ul>
                
                <div style="text-align: center; margin: 25px 0;">
                    <a href="https://madeit-78dcf.web.app/dashboard" style="display: inline-block; background-color: #FF6B35; color: white; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                        Start Milestone 1 →
                    </a>
                </div>
                
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #f0f0f0;">
                    <p style="margin: 0; color: #999; font-size: 12px; text-align: center;">
                        — MadeIt<br>
                        <em>Built from real work, not claims</em>
                    </p>
                </div>
            </div>
        </div>
    `;

    const result = await sendEmail(userEmail, 'Your project is confirmed 🎯 Let\'s build!', html);
    res.json(result);
});

// ===== 4. TICKET STATUS: IN PROGRESS =====
app.post('/api/send-ticket-inprogress-email', async (req, res) => {
    const { userEmail, userName, ticketId, issueType } = req.body;

    if (!userEmail || !ticketId) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background-color: #0A0A0A; color: white; padding: 30px; border-radius: 10px 10px 0 0;">
                <h2 style="margin: 0; color: #F59E0B;">Your MadeIt ticket is being reviewed 👀</h2>
            </div>
            
            <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <p style="margin: 0 0 15px 0; color: #333; font-size: 16px;">Hi ${userName ? `<strong>${userName}</strong>` : 'there'},</p>
                
                <p style="margin: 0 0 20px 0; color: #666; line-height: 1.6;">
                    Good news! We're actively looking into your support request.
                </p>
                
                <div style="background-color: #fef3c7; padding: 20px; border-left: 4px solid #F59E0B; margin: 20px 0;">
                    <p style="margin: 5px 0; color: #92400e;"><strong>Ticket ID:</strong> #${ticketId.slice(0, 8)}</p>
                    ${issueType ? `<p style="margin: 5px 0; color: #92400e;"><strong>Type:</strong> ${issueType}</p>` : ''}
                    <p style="margin: 5px 0; color: #92400e;"><strong>Status:</strong> In Progress</p>
                </div>
                
                <p style="margin: 20px 0; color: #666; line-height: 1.6;">
                    We'll update you once there's a resolution. No action needed from your end.
                </p>
                
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #f0f0f0;">
                    <p style="margin: 0; color: #999; font-size: 12px; text-align: center;">
                       — MadeIt<br>
                        <em>Built from real work, not claims</em>
                    </p>
                </div>
            </div>
        </div>
    `;

    const result = await sendEmail(userEmail, 'Your MadeIt ticket is being reviewed 👀', html);
    res.json(result);
});

// ===== 5. TICKET STATUS: RESOLVED =====
app.post('/api/send-ticket-resolved-email', async (req, res) => {
    const { userEmail, userName, ticketId, issueType, resolutionMessage } = req.body;

    if (!userEmail || !ticketId) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background-color: #0A0A0A; color: white; padding: 30px; border-radius: 10px 10px 0 0;">
                <h2 style="margin: 0; color: #10B981;">Your MadeIt ticket has been resolved ✅</h2>
            </div>
            
            <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <p style="margin: 0 0 15px 0; color: #333; font-size: 16px;">Hi ${userName ? `<strong>${userName}</strong>` : 'there'},</p>
                
                <p style="margin: 0 0 20px 0; color: #666; line-height: 1.6;">
                    Great news! Your support ticket has been resolved.
                </p>
                
                <div style="background-color: #d1fae5; padding: 20px; border-left: 4px solid #10B981; margin: 20px 0;">
                    <p style="margin: 5px 0; color: #065f46;"><strong>Ticket ID:</strong> #${ticketId.slice(0, 8)}</p>
                    ${issueType ? `<p style="margin: 5px 0; color: #065f46;"><strong>Type:</strong> ${issueType}</p>` : ''}
                    <p style="margin: 5px 0; color: #065f46;"><strong>Status:</strong> Resolved</p>
                </div>
                
                ${resolutionMessage ? `
                    <div style="background-color: #f8f8f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 0 0 10px 0; color: #333; font-weight: bold;">Resolution:</p>
                        <p style="margin: 0; color: #666; line-height: 1.6;">${resolutionMessage}</p>
                    </div>
                ` : ''}
                
                <p style="margin: 20px 0; color: #666; line-height: 1.6;">
                    ${issueType === 'repo_change' ? 'Your repository change has been applied. You can now continue working on your project.' : 'The issue has been addressed. If you have any more questions, feel free to raise another ticket.'}
                </p>
                
                <div style="text-align: center; margin: 25px 0;">
                    <a href="https://madeit-78dcf.web.app/dashboard" style="display: inline-block; background-color: #FF6B35; color: white; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                        Back to Dashboard →
                    </a>
                </div>
                
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #f0f0f0;">
                    <p style="margin: 0; color: #999; font-size: 12px; text-align: center;">
                        — MadeIt<br>
                        <em>Built from real work, not claims</em>
                    </p>
                </div>
            </div>
        </div>
    `;

    const result = await sendEmail(userEmail, 'Your MadeIt ticket has been resolved ✅', html);
    res.json(result);
});

// ============================================
// MILESTONE VERIFICATION EMAILS
// ============================================

// ===== 6. MILESTONE SUBMITTED (Notify Admin) =====
app.post('/api/send-milestone-submitted-email', async (req, res) => {
    const { userName, userEmail, projectName, milestoneName, milestoneId, adminEmail } = req.body;

    if (!userName || !userEmail || !projectName || !milestoneName || !adminEmail) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background-color: #0A0A0A; color: white; padding: 30px; border-radius: 10px 10px 0 0;">
                <h2 style="margin: 0; color: #3B82F6;">🔔 New Milestone Submitted for Review</h2>
            </div>
            
            <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <p style="margin: 0 0 20px 0; color: #333; font-size: 16px;">Hi Admin,</p>
                
                <p style="margin: 0 0 20px 0; color: #666; line-height: 1.6;">
                    A user has submitted a milestone for verification.
                </p>
                
                <div style="background-color: #dbeafe; padding: 20px; border-left: 4px solid #3B82F6; margin: 20px 0;">
                    <p style="margin: 5px 0; color: #1e40af;"><strong>User:</strong> ${userName} (${userEmail})</p>
                    <p style="margin: 5px 0; color: #1e40af;"><strong>Project:</strong> ${projectName}</p>
                    <p style="margin: 5px 0; color: #1e40af;"><strong>Milestone:</strong> ${milestoneName}</p>
                    <p style="margin: 5px 0; color: #1e40af;"><strong>Milestone ID:</strong> ${milestoneId}</p>
                    <p style="margin: 5px 0; color: #1e40af;"><strong>Status:</strong> Under Review</p>
                </div>
                
                <p style="margin: 20px 0; color: #666; line-height: 1.6;">
                    Please review this submission in your admin dashboard.
                </p>
                
                <div style="text-align: center; margin: 25px 0;">
                    <a href="https://madeit-78dcf.web.app/dashboard" style="display: inline-block; background-color: #FF6B35; color: white; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                        Review in Dashboard →
                    </a>
                </div>
                
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #f0f0f0;">
                    <p style="margin: 0; color: #999; font-size: 12px; text-align: center;">
                        — MadeIt<br>
                        <em>Built from real work, not claims</em>
                    </p>
                </div>
            </div>
        </div>
    `;

    const result = await sendEmail(adminEmail, `New Milestone Submitted: ${milestoneName}`, html);
    res.json(result);
});

// ===== 7. MILESTONE VERIFIED (Notify User) =====
app.post('/api/send-milestone-verified-email', async (req, res) => {
    const { userName, userEmail, projectName, milestoneName, milestoneId } = req.body;

    if (!userName || !userEmail || !projectName || !milestoneName) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background-color: #0A0A0A; color: white; padding: 30px; border-radius: 10px 10px 0 0;">
                <h2 style="margin: 0; color: #10B981;">✅ Milestone Verified!</h2>
            </div>
            
            <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <p style="margin: 0 0 15px 0; color: #333; font-size: 16px;">Hi <strong>${userName}</strong>,</p>
                
                <p style="margin: 0 0 20px 0; color: #666; line-height: 1.6;">
                    Congratulations! Your milestone has been verified and is now live on your public portfolio! 🎉
                </p>
                
                <div style="background-color: #d1fae5; padding: 20px; border-left: 4px solid #10B981; margin: 20px 0;">
                    <p style="margin: 5px 0; color: #065f46;"><strong>Project:</strong> ${projectName}</p>
                    <p style="margin: 5px 0; color: #065f46;"><strong>Milestone:</strong> ${milestoneName}</p>
                    <p style="margin: 5px 0; color: #065f46;"><strong>Status:</strong> ✅ Verified</p>
                </div>
                
                <p style="margin: 20px 0; color: #666; line-height: 1.6;">
                    This milestone now appears on your public portfolio with the <strong>MadeIt Verified</strong> badge, proving your work to potential recruiters and collaborators.
                </p>
                
                <div style="text-align: center; margin: 25px 0;">
                    <a href="https://madeit-78dcf.web.app/portfolio" style="display: inline-block; background-color: #10B981; color: white; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-right: 10px;">
                        View Portfolio →
                    </a>
                    <a href="https://madeit-78dcf.web.app/project" style="display: inline-block; background-color: #FF6B35; color: white; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                        Continue Building →
                    </a>
                </div>
                
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #f0f0f0;">
                    <p style="margin: 0; color: #999; font-size: 12px; text-align: center;">
                        — MadeIt<br>
                        <em>Built from real work, not claims</em>
                    </p>
                </div>
            </div>
        </div>
    `;

    console.log('📧 [SERVER] Sending verification email to:', userEmail);
    console.log('📧 [SERVER] Email data:', { userName, projectName, milestoneName });

    const result = await sendEmail(userEmail, `✅ Milestone Verified: ${milestoneName}`, html);

    console.log('📧 [SERVER] Email send result:', result);
    if (result.success) {
        console.log('✅ [SERVER] Verification email sent successfully to:', userEmail);
    } else {
        console.error('❌ [SERVER] Verification email failed:', result.error);
    }

    res.json(result);
});

// ===== 8. MILESTONE FLAGGED (Notify User) =====
app.post('/api/send-milestone-flagged-email', async (req, res) => {
    const { userName, userEmail, projectName, milestoneName, milestoneId, adminNote } = req.body;

    if (!userName || !userEmail || !projectName || !milestoneName || !adminNote) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background-color: #0A0A0A; color: white; padding: 30px; border-radius: 10px 10px 0 0;">
                <h2 style="margin: 0; color: #F59E0B;">⚠️ Milestone Needs Clarification</h2>
            </div>
            
            <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <p style="margin: 0 0 15px 0; color: #333; font-size: 16px;">Hi <strong>${userName}</strong>,</p>
                
                <p style="margin: 0 0 20px 0; color: #666; line-height: 1.6;">
                    Your milestone submission has been reviewed and needs some clarification before it can be verified.
                </p>
                
                <div style="background-color: #fef3c7; padding: 20px; border-left: 4px solid #F59E0B; margin: 20px 0;">
                    <p style="margin: 5px 0; color: #92400e;"><strong>Project:</strong> ${projectName}</p>
                    <p style="margin: 5px 0; color: #92400e;"><strong>Milestone:</strong> ${milestoneName}</p>
                    <p style="margin: 5px 0; color: #92400e;"><strong>Status:</strong> ⚠️ Needs Clarification</p>
                </div>
                
                <div style="background-color: #f8f8f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 0 0 10px 0; color: #333; font-weight: bold;">Admin's Note:</p>
                    <p style="margin: 0; color: #666; line-height: 1.6;">${adminNote}</p>
                </div>
                
                <p style="margin: 20px 0; color: #666; line-height: 1.6;">
                    Please review the note above and resubmit your milestone with the requested information or clarifications.
                </p>
                
                <div style="text-align: center; margin: 25px 0;">
                    <a href="https://madeit-78dcf.web.app/project" style="display: inline-block; background-color: #FF6B35; color: white; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                        View Milestone →
                    </a>
                </div>
                
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #f0f0f0;">
                    <p style="margin: 0; color: #999; font-size: 12px; text-align: center;">
                        — MadeIt<br>
                        <em>Built from real work, not claims</em>
                    </p>
                </div>
            </div>
        </div>
    `;

    const result = await sendEmail(userEmail, `⚠️ Milestone Needs Clarification: ${milestoneName}`, html);
    res.json(result);
});

// ===== 9. MILESTONE REJECTED (Notify User) =====
app.post('/api/send-milestone-rejected-email', async (req, res) => {
    const { userName, userEmail, projectName, milestoneName, milestoneId, adminNote } = req.body;

    if (!userName || !userEmail || !projectName || !milestoneName || !adminNote) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background-color: #0A0A0A; color: white; padding: 30px; border-radius: 10px 10px 0 0;">
                <h2 style="margin: 0; color: #EF4444;">❌ Milestone Submission Rejected</h2>
            </div>
            
            <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <p style="margin: 0 0 15px 0; color: #333; font-size: 16px;">Hi <strong>${userName}</strong>,</p>
                
                <p style="margin: 0 0 20px 0; color: #666; line-height: 1.6;">
                    Unfortunately, your milestone submission has been rejected after review.
                </p>
                
                <div style="background-color: #fee2e2; padding: 20px; border-left: 4px solid #EF4444; margin: 20px 0;">
                    <p style="margin: 5px 0; color: #991b1b;"><strong>Project:</strong> ${projectName}</p>
                    <p style="margin: 5px 0; color: #991b1b;"><strong>Milestone:</strong> ${milestoneName}</p>
                    <p style="margin: 5px 0; color: #991b1b;"><strong>Status:</strong> ❌ Rejected</p>
                </div>
                
                <div style="background-color: #f8f8f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 0 0 10px 0; color: #333; font-weight: bold;">Reason for Rejection:</p>
                    <p style="margin: 0; color: #666; line-height: 1.6;">${adminNote}</p>
                </div>
                
                <p style="margin: 20px 0; color: #666; line-height: 1.6;">
                    Don't be discouraged! Review the feedback above and work on addressing the issues. You can resubmit this milestone once you've made the necessary improvements.
                </p>
                
                <div style="text-align: center; margin: 25px 0;">
                    <a href="https://madeit-78dcf.web.app/project" style="display: inline-block; background-color: #FF6B35; color: white; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                        Back to Project →
                    </a>
                </div>
                
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #f0f0f0;">
                    <p style="margin: 0; color: #999; font-size: 12px; text-align: center;">
                        — MadeIt<br>
                        <em>Built from real work, not claims</em>
                    </p>
                </div>
            </div>
        </div>
    `;

    const result = await sendEmail(userEmail, `❌ Milestone Rejected: ${milestoneName}`, html);
    res.json(result);
});

// ===== SUPABASE LISTENER FOR TICKET STATUS CHANGES =====
const setupTicketStatusListener = () => {
    if (!supabaseAdmin) {
        console.log('ℹ️  Supabase listener not started (standalone mode)');
        return;
    }
    try {
        supabaseAdmin
            .channel('public:support_tickets')
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'support_tickets' }, (payload) => {
                console.log('🔔 Support ticket status change detected in Supabase:', payload.new);
            })
            .subscribe();
        console.log('⚡ Supabase ticket status listener active');
    } catch (err) {
        console.error('Error starting Supabase listener:', err);
    }
};

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Email server running on http://localhost:${PORT}`);
    console.log(`📧 Using email: ${process.env.EMAIL_USER}`);

    setupTicketStatusListener();
});
