const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports.dashboard_page = (req, res) => {
    // Set headers to prevent caching
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // Check if admin session exists and has a token
    if (!req.session.token) {
        return res.redirect('/');
    }

    // Verify the JWT token and get role_id
    try {
        const decodedToken = jwt.verify(req.session.token, process.env.JWT_SECRET);
        const roleId = decodedToken.role_id;

        // Render the appropriate dashboard based on role
        if (roleId === 2) {
            res.render('admin/admin_dashboard'); // Admin dashboard
        } else {
            res.status(403).send('Unauthorized'); // Handle unauthorized access
        }
    } catch (error) {
        console.error('JWT verification error:', error);
        req.session.login_message = 'Unauthorized';
        return res.redirect('/');
    }
};
