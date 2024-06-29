const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports.dashboard_page = (req, res) => {
    // Set headers to prevent caching
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    console.log('Session details in user page: ', req.session);
    // Check if user session exists and has a token
    if (!req.session.token) {
        console.log('No token found in session');
        return res.redirect('/');
    }

    // Verify the JWT token and get role_id
    try {
        const decodedToken = jwt.verify(req.session.token, process.env.JWT_SECRET);
        console.log('Decoded token:', decodedToken); // Log decoded token for debugging
        const roleId = decodedToken.role_id;

        // Render the appropriate dashboard based on role
        if (roleId === 1) {
            return res.render('user/user_dashboard'); // User dashboard
        } else {
            return res.status(403).send('Unauthorized'); // Handle unauthorized access
        }
    } catch (error) {
        console.error('JWT verification error:', error);
        req.session.login_message = 'Unauthorized';
        return res.redirect('/');
    }
};
