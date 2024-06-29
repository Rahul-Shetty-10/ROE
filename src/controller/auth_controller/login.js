const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../../db/db');
require('dotenv').config();

module.exports.login = (req, res) => {
    const { Email, Password } = req.body;

    try {
        // Fetch user from the database
        db.query('SELECT * FROM Users WHERE Email = ? and isActive = ?', [Email,true], async (error, results) => {
            if (error) {
                console.error('Database query error:', error);
                return res.status(500).json({ error: "Internal server error" });
            }

            if (results.length === 0) {
                return res.render('user/index', { error: "Email does not exist!" });
            }

            const user = results[0];
            if (!user.Password) {
                return res.render('user/index', { error: "Password not found for the user!" });
            }
            // Compare provided password with hashed password
            const match = await bcrypt.compare(Password, user.Password);

            if (!match) {
                return res.render('user/index', { error: "Invalid password!" });
            }
            const role_id = user.role_id
            // Update LastLogin timestamp
            db.query('UPDATE Users SET LastLogin = current_timestamp() WHERE Email = ?', [Email], (error) => {
                if (error) {
                    console.error('Error updating LastLogin:', error);
                    return res.status(500).json({ error: "Internal server error" });
                }
                
                // Create a JWT token
                const token = jwt.sign({ email: Email, role_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
                
                // Set session token
                req.session.token = token;

                // Redirect based on role
                const dashboard = user.role_id === 1 ? '/user_dashboard' : '/admin_dashboard';
                res.redirect(dashboard);
            });
        });
    } catch (error) {
        console.error('Error in login:', error);
        res.status(500).json({ error: "Internal server error" });
    }
};
