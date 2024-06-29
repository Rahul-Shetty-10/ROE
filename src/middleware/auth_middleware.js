// const jwt = require('jsonwebtoken');
// require('dotenv').config();

// const jwt_auth = (req, res, next) => {
//     const token = req.session.token;
//     if (!token) {
//         console.log('jwt token not found')
//         req.session.login_message = 'Unauthorized';
//         return res.redirect('/');
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded;
//         next();
//     } catch (error) {
//         console.error('JWT verification error:', error);
//         req.session.login_message = 'Unauthorized';
//         return res.redirect('/');
//     }
// };

// const admin_role_auth = (req, res, next) => {
//     if (req.user.role === 'admin') {
//         next();
//     } else {
//         req.session.login_message = 'Unauthorized';
//         return res.redirect('/');
//     }
// };

// const user_role_auth = (req, res, next) => {
//     if (req.user.role === 'user') {
//         next();
//     } else {
//         req.session.login_message = 'Unauthorized';
//         return res.redirect('/');
//     }
// };

// module.exports = {
//     jwt_auth,
//     admin_role_auth,
//     user_role_auth
// };


const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwt_auth = (req, res, next) => {
    const token = req.session.token;
    if (!token) {
        console.log('jwt token not found');
        req.session.login_message = 'Unauthorized';
        return res.redirect('/');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded); // Log for debugging
        req.user = decoded;
        next();
    } catch (error) {
        console.error('JWT verification error:', error);
        req.session.login_message = 'Unauthorized';
        return res.redirect('/');
    }
};

const admin_role_auth = (req, res, next) => {
    if (req.user.role_id === 2) { // Assuming 2 is for admin
        next();
    } else {
        req.session.login_message = 'Unauthorized';
        return res.redirect('/');
    }
};

const user_role_auth = (req, res, next) => {
    if (req.user.role_id === 1) { // User role
        next();
    } else if (req.user.role_id === 2) { // Admin role
        return res.redirect('/admin_dashboard');
    } else {
        req.session.login_message = 'Unauthorized';
        return res.redirect('/');
    }
};


module.exports = {
    jwt_auth,
    admin_role_auth,
    user_role_auth
};
