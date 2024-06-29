const db = require('../../db/db');
const jwt = require('jsonwebtoken');


module.exports.total_users_page = async (req, res) => {
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

      db.query('SELECT (SELECT COUNT(*) FROM Users WHERE isActive = ? AND isDeleted = ?) AS Users_count,Email, FirstName, LastName, DATE_FORMAT(CreatedAt, "%d-%m-%Y %H:%i:%s") AS CreatedAt, DATE_FORMAT(LastLogin, "%Y-%m-%d %H:%i:%s") AS LastLogin FROM Users WHERE isActive = ? AND isDeleted = ?', [true, false, true, false], (error, results) => {
        const Users_count = results.length > 0 ? results[0].Users_count : 0;
        res.render('admin/total_users', { users: results, Users_count: Users_count });    
      })

        
    } catch (error) {
        console.error('Error retrieving users data:', error);
        return res.render('user/error500');
    }
};

module.exports.delete_user = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        await db.beginTransaction();

        await db.query('UPDATE Users SET isDeleted = true, isActive = false WHERE Email = ?', [email]);

        await db.query('UPDATE Profile SET isDeleted = true isActive = false WHERE Email = ?', [email]);

        await db.commit();
        res.redirect('/total_users'); // Assuming correct route after deletion
    } catch (error) {
        console.error('Error deleting user:', error);
        await db.rollback();
        return res.render('user/error500');
    }
};