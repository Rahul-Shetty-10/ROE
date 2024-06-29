const express = require('express')
const router = express.Router()
const passport = require('passport');
const { handleGoogleCallback } = require('../helper/googleAuth');
const { jwt_auth} = require('../middleware/auth_middleware');

router.use(passport.initialize());
router.use(passport.session());

const authloginController = require('../controller/auth_controller/login')
const authsignupController = require('../controller/auth_controller/signup')
const authpasswordController = require('../controller/auth_controller/password')
const authindexController = require('../controller/auth_controller/index')


router.get('/', authindexController.index_page);
router.post('/news_letter', authindexController.news_letter);

router.post('/feedback', authindexController.feedback)

router.post('/login', authloginController.login);
router.post('/signup', authsignupController.signup);

router.get('/forgot', authpasswordController.forgot_page);
router.post('/forgot', authpasswordController.forgot);

router.get('/new_password', authpasswordController.new_password_page);
router.post('/new_password', authpasswordController.new_password);

router.get('/verify-email', authpasswordController.set_password_page);
router.post('/set_password', authpasswordController.set_password);

router.get('/cancel-signin', authpasswordController.cancel_signin)

router.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), handleGoogleCallback);

module.exports = router