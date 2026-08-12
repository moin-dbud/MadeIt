import nodemailer from 'nodemailer';

const getEnv = () => typeof process !== 'undefined' ? process.env : {};

// Email configuration helper
const getTransporter = () => {
    const env = getEnv();
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: env.EMAIL_USER,
            pass: env.EMAIL_PASS
        }
    });
};

// Reusable email sender
const sendEmail = async (to, subject, html) => {
    try {
        const env = getEnv();
        const transporter = getTransporter();
        await transporter.sendMail({
            from: `"MadeIt" <${env.EMAIL_USER}>`,
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

// CORS headers helper
const setCorsHeaders = (res) => {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
};

// Handle OPTIONS requests for CORS
const handleCorsOptions = (req, res) => {
    if (req.method === 'OPTIONS') {
        setCorsHeaders(res);
        res.status(200).end();
        return true;
    }
    setCorsHeaders(res);
    return false;
};

export { getTransporter, sendEmail, setCorsHeaders, handleCorsOptions };


