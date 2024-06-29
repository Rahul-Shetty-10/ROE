const express = require('express')
const router = express.Router()
const { jwt_auth, admin_role_auth} = require('../middleware/auth_middleware');

const adminController = require('../controller/admin_controller/admin_controls')
const adminplacementController = require('../controller/admin_controller/placement_training_registered')
const admintotalusersController = require('../controller/admin_controller/total_users')
const adminfeedbacksController = require('../controller/admin_controller/user_feedbacks')
const adminnewsusersController = require('../controller/admin_controller/news_users')
const adminuserprofilesController = require('../controller/admin_controller/user_profiles')

router.get('/admin_dashboard', jwt_auth, admin_role_auth, adminController.dashboard_page);

router.get('/placement_training_registered', jwt_auth, adminplacementController.placement_registered_users);
router.post('delete_placement_user', adminplacementController.delete_placement_user);

router.get('/total_users', jwt_auth, admintotalusersController.total_users_page);
router.post('/delete_user', admintotalusersController.delete_user);

router.get('/user_feedbacks', jwt_auth, adminfeedbacksController.user_feedbacks_page);
router.post('/delete_feedback', adminfeedbacksController.delete_feedback);

router.get('/news_users', jwt_auth, adminnewsusersController.news_letter_users);
router.post('/delete_news_user', adminnewsusersController.delete_news_user);

router.get('/user_profile', jwt_auth, adminuserprofilesController.user_profiles);
module.exports = router