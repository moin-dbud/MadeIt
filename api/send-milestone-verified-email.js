import { sendEmail, handleCorsOptions } from './_helpers.js';

export default async function handler(req, res) {
    if (handleCorsOptions(req, res)) return;

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

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

    console.log('📧 [SERVERLESS] Sending verification email to:', userEmail);
    console.log('📧 [SERVERLESS] Email data:', { userName, projectName, milestoneName });

    const result = await sendEmail(userEmail, `✅ Milestone Verified: ${milestoneName}`, html);

    console.log('📧 [SERVERLESS] Email send result:', result);
    if (result.success) {
        console.log('✅ [SERVERLESS] Verification email sent successfully to:', userEmail);
    } else {
        console.error('❌ [SERVERLESS] Verification email failed:', result.error);
    }

    res.status(result.success ? 200 : 500).json(result);
}
