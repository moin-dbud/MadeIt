import { sendEmail, handleCorsOptions } from './_helpers.js';

export default async function handler(req, res) {
    if (handleCorsOptions(req, res)) return;

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

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

    const result = await sendEmail(userEmail, "Your project is confirmed 🎯 Let's build!", html);
    res.status(result.success ? 200 : 500).json(result);
}
