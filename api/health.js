export default function handler(req, res) {
    res.status(200).json({
        status: 'ok',
        message: 'Email server is running'
    });
}
