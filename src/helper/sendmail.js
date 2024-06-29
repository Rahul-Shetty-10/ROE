const nodemailer = require('nodemailer');
const db = require('../db/db');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        accessToken: process.env.ACCESS_TOKEN
    }
});

async function sendVerificationEmail(email, verificationLink, verification_token) {
    const mailOptions = {
        from: 'republicofengineers.sns@gmail.com',
        to: email,
        subject: 'Verify your email',
        text: `Please verify your email and set password by clicking the following link: ${verificationLink}`,
        html: `<p>Please verify your email by clicking the following link: <a href="${verificationLink}">${verificationLink}</a></p>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email', error);
            return;
        }

        // Insert user with verification token into the database
        db.query('SELECT Email FROM users WHERE Email = ?', [email], (err, rows) => {

            if (rows.length > 0) {
                // Email exists, update the verification token
                db.query('UPDATE users SET verification_token = ? WHERE Email = ?', [verification_token, email], (updateErr) => {
                    if (updateErr) {
                        console.error('Error updating verification token', updateErr);
                    } else {
                        console.log('Verification token updated successfully for', email);
                    }
                });
            } else {
                // Email does not exist, insert new user
                db.query('INSERT INTO users (Email, verification_token) VALUES (?, ?)', [email, verification_token], (insertErr) => {
                    if (insertErr) {
                        console.error('Error inserting new user', insertErr);
                    } else {
                        console.log('New user inserted successfully with email', email);
                    }
                });
            }
        });

        console.log('Message sent: %s', info.messageId);
    });
}



async function sendVerificationEmailForgot(email, verificationLink, verification_token) {
    const mailOptions = {
        from: 'republicofengineers.sns@gmail.com',
        to: email,
        subject: 'Reset Password',
        text: `Please reset your password by clicking the following link: ${verificationLink}`,
        html: `<p>Please reset your password by clicking the following link: <a href="${verificationLink}">${verificationLink}</a></p>`
    };

    transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
            console.error('Error sending email', error);
            return;
        }
        
        // Update user's verification_token in the database
        try {
            await db.query('UPDATE users SET verification_token = ? WHERE email = ?', [verification_token, email]);
            console.log('Message sent: %s', info.messageId);
        } catch (err) {
            console.error('Error updating verification token', err);
            // Handle database update error
        }
    });
}


module.exports = {
    sendVerificationEmail,
    sendVerificationEmailForgot
};
