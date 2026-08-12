export default async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const env = typeof process !== 'undefined' ? process.env : {};

    // Return environment variable status (WITHOUT exposing actual values)
    return res.status(200).json({
        success: true,
        message: 'Test endpoint working',
        timestamp: new Date().toISOString(),
        env_check: {
            EMAIL_USER: !!env.EMAIL_USER ? 'SET' : 'MISSING',
            EMAIL_PASS: !!env.EMAIL_PASS ? 'SET' : 'MISSING',
            ADMIN_EMAIL: !!env.ADMIN_EMAIL ? 'SET' : 'MISSING',
            NODE_ENV: env.NODE_ENV || 'not set'
        },
        nodemailer_available: false // We'll test this separately
    });
};
