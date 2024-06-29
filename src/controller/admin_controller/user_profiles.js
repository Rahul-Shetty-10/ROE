const db = require('../../db/db');
const jwt = require('jsonwebtoken');

module.exports.user_profiles = async (req, res) => {
    // Set headers to prevent caching
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    console.log('Session details in user page: ', req.session);
    if (!req.session.token) {
        console.log('No token found in session');
        return res.redirect('/');
    }
    try {
        const token = req.session.token;

        if (!token) {
            return res.redirect('/user_dashboard'); // Redirect if not authenticated
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const role_id = decoded.role_id;

        if (role_id !== 2) { // Redirect if not admin (assuming role_id 2 is for admin)
            return res.redirect('/');
        }

        db.query('SELECT *, DATE_FORMAT(DOB, "%d-%m-%Y") AS DOB FROM Profile WHERE isActive = ? AND isDeleted = ?', [true, false], (error, results) => {
            if (error) {
                console.error('Error fetching user profiles:', error);
                return res.status(500).send('Internal server error');
            }
            res.render('admin/user_profile', { users: results });
        });
    } catch (error) {
        console.error('Error verifying JWT token:', error);
        return res.render('user/error500');
    }
};
