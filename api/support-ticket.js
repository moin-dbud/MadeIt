import nodemailer from 'nodemailer';
import { sendEmail, handleCorsOptions } from './_helpers.js';

export default async function handler(req, res) {
    if (handleCorsOptions(req, res)) return;

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

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
        const transporter = nodemailer.createTransporter({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail(mailToAdmin);
        await transporter.sendMail(mailToUser);

        res.status(200).json({
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
}
