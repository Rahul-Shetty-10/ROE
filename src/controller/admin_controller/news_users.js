const db = require('../../db/db');
const jwt = require('jsonwebtoken');


module.exports.news_letter_users = async (req, res) => {
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
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const role_id = decoded.role_id;

        if (role_id !== 2) { // Assuming role_id 1 is for admin
            return res.redirect('/'); // Redirect to user dashboard if role is not admin
        }

        // Query to count the total number of users
        db.query('SELECT COUNT(*) AS Users_count FROM News_Letter WHERE isDeleted = ?', [false], (error, countResult) => {
            if (error) {
                console.error('Error counting users:', error);
                return res.render('user/error500');
            }
            
            // Total number of users
            const Users_count = countResult.length > 0 ? countResult[0].Users_count : 0;

            // Query to fetch all user details
            db.query('SELECT *, DATE_FORMAT(JoinedAt, "%d-%m-%Y") AS JoinedAt FROM News_Letter WHERE isDeleted = ?', [false], (error, userResults) => {
                if (error) {
                    console.error('Error fetching users:', error);
                    return res.render('user/error500');
                }

                res.render('admin/news_users', { users: userResults, Users_count: Users_count });
            });
        });
    } catch (error) {
        console.error('JWT verification error:', error);
        return res.status(401).redirect('/'); // Redirect to login page if token verification fails
    }
};


module.exports.delete_news_user = async (req, res) => {
    const { email } = req.body;
    
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    await db.query('UPDATE News_Letter SET isDeleted = ? WHERE Email = ?', [true, email]);

       res.redirect('/news_users')
}
