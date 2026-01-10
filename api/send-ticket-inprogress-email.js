import { sendEmail, handleCorsOptions } from './_helpers.js';

export default async function handler(req, res) {
    if (handleCorsOptions(req, res)) return;

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

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
    res.status(result.success ? 200 : 500).json(result);
}
