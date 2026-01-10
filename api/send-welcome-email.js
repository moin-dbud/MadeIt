import { sendEmail, handleCorsOptions } from './_helpers.js';

export default async function handler(req, res) {
    if (handleCorsOptions(req, res)) return;

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    const { userName, userEmail } = req.body;

    if (!userName || !userEmail) {
        return res.status(400).json({ success: false, message: 'userName and userEmail required' });
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
    res.status(result.success ? 200 : 500).json(result);
}
