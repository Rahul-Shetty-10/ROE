const db = require('../../db/db');
const jwt = require('jsonwebtoken');

module.exports.placement_registered_users = async (req, res) => {
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

        if (role_id !== 2) { // Assuming role_id 1 is for admin
            return res.redirect('/'); // Redirect if not admin
        }

     
            // db.query('SELECT (SELECT COUNT(*) FROM Placement) AS Users_count, *, DATE_FORMAT(DOB, "%d-%m-%Y") AS DOB FROM Placement', (error, results) => {
            //     const Users_count = results.length > 0 ? results[0].Users_count : 0;
            //     res.render('admin/placement_training_registered', { users: results, Users_count });
            // })
            db.query('SELECT (SELECT COUNT(*) FROM Placement) AS Users_count, Email, FirstName, Lastname, Phone, Gender, University, College, Branch, Semester, Payment_Screenshot, DATE_FORMAT(DOB, "%d-%m-%Y") AS DOB FROM Placement WHERE isDeleted = ?', [false], (error, results) => {
                if (error) {
                    console.error('Error fetching placement data:', error);
                    return res.status(500).send('Internal server error');
                }
            
                const Users_count = results.length > 0 ? results[0].Users_count : 0;
                res.render('admin/placement_training_registered', { users: results, Users_count });
            });
    

    } catch (error) {
        console.error('Error fetching users:', error);
        return res.render('user/error500');
    }
};


module.exports.delete_placement_user = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        await db.query('DELETE FROM Placement WHERE Email = ?', [email]);
        res.redirect('/placement_training_registered');
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send('Internal server error');
    }
};
