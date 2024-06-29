const db = require('../../db/db');
const { sendVerificationEmail, sendVerificationEmailForgot } = require('../../helper/sendmail');
// const sendVerificationEmailForgot = require('../../helper/sendmail');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 
require('dotenv').config();

module.exports.forgot_page = async (req, res) => {
    try {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');

        res.render('password/forgot');
    } catch (error) {
        console.error('Error rendering forgot password page:', error);
        return res.render('user/error500');
    }
};

module.exports.forgot = async (req, res) => {
    const { Email } = req.body;

    try {
        // Check if the email exists in the database
        const existingUser = await db.query('SELECT * FROM Users WHERE Email = ? and isActive = ?', [Email,true]);

        if (!existingUser) {
            // If no user found with the provided email, render an error message
            return res.render('user/index', { error: 'Email does not exist!' });
        }

        // Generate a JWT token for verification link
        const verification_token = jwt.sign({ email: Email }, process.env.JWT_SECRET, {
            expiresIn: '1h' // Adjust as per your requirements
        });

        // Construct verification link
        const verificationLink = `https://70a4-2401-4900-4e6a-9c94-d52c-4a87-219c-6850.ngrok-free.app/new_password?token=${verification_token}`;

        // Send verification email
        sendVerificationEmailForgot(Email, verificationLink, verification_token); // Assuming this function sends the email

        // Render success message to the user
        return res.render('user/index', { error: `Verification email is sent to ${Email}` });
    } catch (error) {
        console.error('Error sending forgot password email:', error);
        return res.render('user/error500');
    }
};

module.exports.set_password_page = async (req, res) => {
    const { token } = req.query;

    try {
        // Verify the JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const email = decoded.email;

        // Query the database to check if the email and token combination exists
        db.query('SELECT * FROM users WHERE Email = ? AND verification_token = ?', [email, token], (err, results) => {
            if (err || results.length === 0) {
                // Handle case where token or email doesn't match
                return res.render('user/index', { error: 'Invalid Token' });
            }

            // Render the set password page with the email
            res.render('password/set_password', { email });
        });
    } catch (error) {
        // Handle JWT verification errors
        console.error('JWT verification error:', error);
        res.status(400).send('Invalid token');
    }
};

module.exports.set_password = async (req, res) => {
    const { FirstName, LastName, Category, Password, Confirm_Password, email, verification_token } = req.body;
 
    if (Password !== Confirm_Password) {
        return res.status(400).send('Passwords do not match');
    }

    const hashedPassword = await bcrypt.hash(Password, 10);

    try {
        const role_id = determineRole(email); 


        db.query('UPDATE users SET FirstName = ?, LastName = ?, Category = ?, Password = ?, verified = ?, isActive = ?, isDeleted = ?, verification_token = NULL, role_id = ? WHERE Email = ?',
            [FirstName, LastName, Category, hashedPassword, true, true, false, role_id, email],
            async (error, results) => {
                if (error) {
                    console.error('Error updating user details:', error);
                    return res.render('user/error500');
                }

                // Create JWT token
                const token = jwt.sign({ email, role_id }, process.env.JWT_SECRET, { expiresIn: '1h' });

                // Set session token
                req.session.token = token;

                // Insert profile data if required
                await db.query('INSERT INTO profile (Email, FirstName, LastName, Category, isActive, isDeleted) VALUES (?, ?, ?, ?, ?, ?)', [email, FirstName, LastName, Category, true, false]);

                // Redirect based on role
                // const dashboard = role_id === 1 ? '/user_dashboard' : '/admin_dashboard';
                // res.redirect(dashboard);
                res.render('user/index',{error: 'Registration was successful'})
            }
        );
    } catch (error) {
        console.error('Error updating user details:', error);
        return res.render('user/error500');
    }
}
function determineRole(email) {
    
    if (email === 'republicofengineers.sns@gmail.com') {
        return 2;
    } else {
        return 1;
    }
}



// module.exports.new_password_page = async (req, res) => {
//     res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
//     res.setHeader('Pragma', 'no-cache');
//     res.setHeader('Expires', '0');

//     console.log(req.session);

//     if (!req.query.email) {
//         res.redirect('/');
//     } else {
//         req.session.email = req.query.email; // Store the email in session
//         res.render('password/new_password', { email: req.query.email }); // Pass the email variable to the view
//     }
// }
// module.exports.new_password = async (req, res) => {
//     const email = req.body.email; // Assuming the email is sent with the form data
//     const password = req.body.Password;

//     try {
//         const hashedPassword = await bcrypt.hash(password, 10);

//         db.query('UPDATE Users SET Password = ? WHERE Email = ?', [hashedPassword, email]);
//         req.session.user = { email: email };
//         if (email === 'republicofengineers.sns@gmail.com') {
//             res.redirect('/admin_dashboard');
//         } else {
//             res.redirect('/user_dashboard');
//         }

//     } catch (error) {
//         console.error('Error setting password:', error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// }

module.exports.cancel_signin = async (req, res) => {
    res.redirect('/');
}

module.exports.new_password_page = async (req, res) => {
    const { token } = req.query;

    try {
        // Verify the JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const email = decoded.email;

        // Query the database to check if the email and token combination exists
        db.query('SELECT * FROM users WHERE Email = ? AND verification_token = ? and isActive =?', [email, token, true], (err, results) => {
            if (err || results.length === 0) {
                // Handle case where token or email doesn't match
                return res.render('index', { error: 'Invalid Token' });
            }

            // Render the set password page with the email
            res.render('password/new_password', { email: email, resetPasswordToken: token });
        });
    } catch (error) {
        // Handle JWT verification errors
        console.error('JWT verification error:', error);
        res.status(400).send('Invalid token');
    }
}
module.exports.new_password = async (req, res) => {
    console.log(req.body); 
    
    const { resetPasswordToken, Password } = req.body;

    try {
        // Check if resetPasswordToken exists
        if (!resetPasswordToken) {
            return res.status(400).json({ error: "Reset password token is required" });
        }
        
        // Verify the reset password token
        const decoded = jwt.verify(resetPasswordToken, process.env.JWT_SECRET);
        const email = decoded.email;

        // Hash the new password
        const hashedPassword = await bcrypt.hash(Password, 10);

        // Update the user's password in the database
        await db.query('UPDATE Users SET Password = ? WHERE Email = ? and isActive = ?', [hashedPassword, email, true]);

        // Clear the session token (if you set it)
        req.session.token = null;

        // Render the index page with a success message
        return res.render('user/index', { error: 'Password changed successfully' });

    } catch (error) {
        console.error('Error setting new password:', error);
        return res.render('user/error500');
    }
};


