import { sendEmail, handleCorsOptions } from './_helpers.js';

export default async function handler(req, res) {
    if (handleCorsOptions(req, res)) return;

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

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
    res.status(result.success ? 200 : 500).json(result);
}
